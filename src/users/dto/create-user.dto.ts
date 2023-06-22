import { IsEmail, Matches } from 'class-validator';

export class CreateUserDto {
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{5,10}$/)
  id: string;

  @IsEmail()
  email: string;

  @Matches(
    /^(?=.*[a-zA-Z])(?=.*[~!@#$%^&*_\-+=`|\(){}[\]:;"'<>,.?/])(?=.*[0-9]).{8,14}$/,
  )
  password: string;
}
