import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  title: string;

  @IsString()
  @MaxLength(140)
  @IsNotEmpty()
  content: string;
}
