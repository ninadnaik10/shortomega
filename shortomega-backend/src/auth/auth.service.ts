import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

export type AuthInput = {
    username: string;
    password: string;
};

type SignInData = {
    userId: number;
    username: string;
}

type AuthResult = {
    accessToken: string;
    userId: string;
    username: string
}

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }
    async validateUser(input: AuthInput): Promise<SignInData | null> {
        const user = await this.usersService.findOne(input.username);
        if (user && user.hashedPassword === input.password) {
            return {
                userId: user.userId,
                username: user.username,
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
            username: user.username,

        }
    }
}
