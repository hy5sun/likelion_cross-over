import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signupDto: SignupDto) {
    await this.usersService.createUser(signupDto);
  }

  async getAccessToken({ user }): Promise<string> {
    return this.jwtService.sign(
      {
        email: user.email,
        sub: user.id,
      },
      {
        secret: process.env.SECRET_KEY,
        expiresIn: '5m',
      },
    );
  }

  async getRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      {
        email: user.email,
        sub: user.id,
      },
      {
        secret: process.env.SECRET_KEY,
        expiresIn: '2w',
      },
    );

    res.setHeader('set-Cookie', `refreshToken=${refreshToken}`);
    return;
  }

  async logIn(loginDto: LoginDto, res) {
    const user = await this.usersService.findById(loginDto.id);

    if (!user) {
      throw new UnprocessableEntityException('해당 아이디의 계정은 없습니다.');
    }

    const isPWTrue = await bcrypt.compare(loginDto.password, user.password);
    if (!isPWTrue) {
      throw new UnprocessableEntityException('비밀번호가 일치하지 않습니다.');
    }

    await this.getRefreshToken({ user, res });

    const jwt = await this.getAccessToken({ user });

    return res.status(200).send(jwt);
  }

  async logOut(req, res) {
    req.logOut();
    req.clearCookie('connect.sid', { httpOnly: true });
    res.send('OK');
  }
}
