import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() input: { email: string; password: string }) {
    return this.authService.authenticate(input);
  }
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() input: { email: string; password: string }) {
    return this.authService.register(input);
  }
  @UseGuards(AuthGuard)
  @Get('me')
  async getUserInfo(@Request() req) {
    return req.user;
  }
}
