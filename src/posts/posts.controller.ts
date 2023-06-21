import {
  Controller,
  Post,
  Headers,
  Body,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(
    @Headers('userId') userId: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return await this.postsService.create(userId, createPostDto);
  }

  @Get() // 수정 예정
  async read() {
    return await this.postsService.read();
  }

  @Get(':id')
  async readById(@Param('postId') postId: string) {
    return await this.postsService.readById(postId);
  }

  @Delete(':id')
  async deleteById(@Param('postId') postId: string) {
    return await this.postsService.deleteById(postId);
  }
}
