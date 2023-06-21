import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignupDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signUp(signupDto: SignupDto) {
    await this.usersService.createUser(signupDto);
  }
}
