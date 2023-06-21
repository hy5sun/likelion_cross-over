import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsEntity } from './entities/posts.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { v1 as uuid } from 'uuid';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private postsRepository: Repository<PostsEntity>,
  ) {}

  async create(userId: string, createPostDto: CreatePostDto) {
    const now = new Date();
    const post = new PostsEntity();

    post.id = uuid(); //uuid로 id 생성
    post.title = createPostDto.title;
    post.content = createPostDto.content;
    post.createdAt = now;
    post.writerId = userId;

    await this.postsRepository.save(post);
  }

  async paginate(page = 1) {
    const take = 10; // 10 페이지씩 조회

    const [posts, total] = await this.postsRepository.findAndCount({
      take, // limit
      skip: (page - 1) * take, // offset
    });

    return {
      data: posts,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }

  async readById(postId: string) {
    const foundPost = this.postsRepository.findOne({
      where: { id: postId },
    });

    return foundPost;
  }

  async deleteById(postId: string) {
    return await this.postsRepository.delete(postId);
  }
}
