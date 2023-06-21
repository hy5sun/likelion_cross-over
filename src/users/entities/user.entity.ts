import { IsDate, IsEmail, Matches } from 'class-validator';
import { PostsEntity } from 'src/posts/entities/posts.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity('User')
export class UserEntity {
  @PrimaryColumn({ unique: true })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{5,9}$/)
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @IsEmail()
  @Column({ unique: true, nullable: false })
  email: string;

  @Column()
  @Matches(
    /^(?=.*[a-zA-Z])(?=.*[~!@#$%^&*_\-+=`|\(){}[\]:;"'<>,.?/])(?=.*[0-9]).{8,13}$/,
  )
  password: string;

  @CreateDateColumn()
  policyAgreementDate: Date;

  @OneToMany(() => PostsEntity, (post) => post.writerId)
  posts: PostsEntity[];
}
