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

  async read() {
    return await this.postsRepository.find(); //10페이지씩 보이게 수정 예정
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
