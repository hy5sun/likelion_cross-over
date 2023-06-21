import {
  Controller,
  Post,
  Headers,
  Body,
  Get,
  Param,
  Delete,
  Query,
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

  @Get()
  async read(@Query('page') page = 1) {
    // 쿼리문을 요청하지 않은 디폴트에선 첫 번째 페이지만 불러올 것.
    return await this.postsService.paginate(page);
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
