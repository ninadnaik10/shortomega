import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthInput } from './types';
import { JwtService } from '@nestjs/jwt';

type SignInData = {
  userId: string;
  email: string;
};

type AuthResult = {
  accessToken: string;
  userId: string;
  email: string;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(input: AuthInput): Promise<SignInData | null> {
    const user = await this.usersService.findOne(input.email);
    console.log(user);
    if (user) {
      return user;
    }
    return null;
  }

  async authenticate(input: AuthInput): Promise<AuthResult> {
    const user = await this.validateUser(input);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.signIn(user);
  }

  async register(input: AuthInput): Promise<AuthResult> {
    const userId = await this.usersService.createUser(input);
    const user = await this.usersService.findOne(input.email);
    return this.signIn(user);
  }

  async signIn(user: SignInData): Promise<AuthResult> {
    const tokenPayload = {
      userId: user.userId,
      username: user.email,
    };
    console.log('tp' + tokenPayload);
    const accessToken = await this.jwtService.signAsync(tokenPayload);
    return {
      accessToken,
      userId: user.userId,
      email: user.email,
    };
  }
}
