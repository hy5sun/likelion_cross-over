import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { IOAuthUser } from './auth.userInterface';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() signupDto: SignupDto) {
    return this.authService.signUp(signupDto);
  }

  @HttpCode(200)
  @Post('login')
  async logIn(@Body() loginDto: LoginDto, @Res() res: Response) {
    return await this.authService.logIn(loginDto, res);
  }

  @UseGuards(AuthGuard('refresh'))
  @Post('refresh')
  async restoreAccessToken(@Req() req: Request & IOAuthUser) {
    return await this.authService.getAccessToken({ user: req.user });
  }

  @Post('logout')
  async logOut(@Res() res: Response) {
    return await this.authService.logOut(res);
  }
}
