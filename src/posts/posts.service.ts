import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsEntity } from './entities/posts.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { v1 as uuid } from 'uuid';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(PostsEntity)
    private postsRepository: Repository<PostsEntity>,
  ) {}

  async create(userId: string, createPostDto: CreatePostDto) {
    const writer = await this.usersService.findById(userId);

    // 토큰 기반으로 예외처리하는 것으로 수정 예정
    if (!userId) {
      throw new UnauthorizedException('로그인이 안 되어 있습니다.');
    }

    const now = new Date();
    const post = new PostsEntity();

    post.id = uuid(); //uuid로 id 생성
    post.title = createPostDto.title;
    post.content = createPostDto.content;
    post.createdAt = now;
    post.writer = writer;

    await this.postsRepository.save(post);

    return {
      statusCode: HttpStatus.CREATED,
    };
  }

  async paginate(page = 1, take: number) {
    const [posts, total] = await this.postsRepository.findAndCount({
      take, // limit
      skip: (page - 1) * take, // offset
      order: { createdAt: 'DESC' },
    });

    return {
      statusCode: HttpStatus.OK,
      data: posts,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }

  async readById(postId: string) {
    const foundPost = await this.postsRepository.findOne({
      where: { id: postId },
    });

    if (!foundPost || foundPost.deletedAt !== null) {
      throw new NotFoundException('해당 id의 게시물을 찾을 수 없습니다.');
    }

    return {
      statusCode: HttpStatus.OK,
      data: [foundPost],
    };
  }

  async deleteById(userId: string, postId: string) {
    const writer = await this.usersService.findById(userId);

    const post = await this.postsRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException('해당 id의 게시물을 찾을 수 없습니다.');
    }

    // 토큰을 기준으로 판단해야함...
    if (!userId) {
      throw new UnauthorizedException('로그인이 되어 있지 않습니다.');
    }

    if (post.writer !== writer) {
      throw new UnauthorizedException('해당 글에 접근할 권한이 없습니다.');
    }

    await this.postsRepository.softDelete({ id: postId });

    return {
      statusCode: HttpStatus.OK,
    };
  }
}
