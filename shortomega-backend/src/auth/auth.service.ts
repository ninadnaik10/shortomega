import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthInput } from './types';

type SignInData = {
    userId: string;
    username: string;
}

type AuthResult = {
    accessToken: string;
    userId: string;
}

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }
    async validateUser(input: AuthInput): Promise<SignInData | null> {
        const user = await this.usersService.findOne(input.email);
        console.log(user)
        if (user) {
            return {
                userId: "1",
                username: "ninad",
            };
        }
        return null;
    }

    async authenticate(input: AuthInput): Promise<AuthResult> {
        const user = await this.validateUser(input);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        return {
            accessToken: 'fake-access',
            userId: user.userId.toString(),

        }
    }

    async register(input: AuthInput): Promise<AuthResult> {
        const userId = await this.usersService.createUser(input);
        return {
            accessToken: 'fake-access',
            userId: userId.toString(),
        }
    }
}
