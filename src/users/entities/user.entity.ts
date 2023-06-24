import { IsDate, IsEmail, Matches } from 'class-validator';
import { PostsEntity } from 'src/posts/entities/posts.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('User')
export class UserEntity {
  @PrimaryColumn({ unique: true })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{5,10}$/)
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @IsEmail()
  @Column({ unique: true, nullable: false })
  email: string;

  @Column()
  @Matches(
    /^(?=.*[a-zA-Z])(?=.*[~!@#$%^&*_\-+=`|\(){}[\]:;"'<>,.?/])(?=.*[0-9]).{8,14}$/,
  )
  password: string;

  @CreateDateColumn()
  policyAgreementDate: Date;

  @OneToMany(() => PostsEntity, (post) => post.writer)
  posts: PostsEntity[];

  @BeforeInsert()
  private beforeInsert() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
