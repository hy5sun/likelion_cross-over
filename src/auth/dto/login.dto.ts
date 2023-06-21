import { IsEmail, IsString, Matches } from 'class-validator';

export class SignupDto {
  @IsString()
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{5,9}$/)
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(
    /^(?=.*[a-zA-Z])(?=.*[~!@#$%^&*_\-+=`|\(){}[\]:;"'<>,.?/])(?=.*[0-9]).{8,13}$/,
  )
  password: string;
}
