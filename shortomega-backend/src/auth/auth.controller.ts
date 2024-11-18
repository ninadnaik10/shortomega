import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthInput } from './types';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() input: { email: string, password: string }) {
        return this.authService.authenticate(input)
    }
    @HttpCode(HttpStatus.CREATED)
    @Post("register")
    async register(@Body() input: { email: string, password: string }) {
        return this.authService.register(input)
    }
}
