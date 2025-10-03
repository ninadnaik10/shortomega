import { Injectable } from '@nestjs/common';
import { AppRepositoryRedis } from 'src/app.repository.redis';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { AuthInput } from 'src/types';
export type User = {
    userId: string;
    hashedPassword?: string;
    email: string;
    name: string;
};

@Injectable()
export class UsersService {
    constructor(private readonly redisService: AppRepositoryRedis) {}

    async findOneByUserId(userId: string): Promise<User | undefined> {
        const user = await this.redisService.hgetall(`userid:${userId}`);
        console.log(user);
        if (!user) {
            return undefined;
        }
        return {
            userId: userId,
            email: user.email,
            name: user.name,
        };
    }
    async findOne(email: string): Promise<User | undefined> {
        const userId = await this.redisService.get(`user:${email}`);
        // findOneByUserId
        return this.findOneByUserId(userId);
    }

    async createUser(input: AuthInput): Promise<string> {
        // TODO: Error handling
        const uuid = uuidv4();
        console.log(input);
        console.log(uuid.toString());
        const hashedPassword = await bcrypt.hash(input.password, 10);
        await this.redisService.put(`user:${input.email}`, uuid.toString());
        await this.redisService.hSet(`userid:${uuid.toString()}`, {
            hashedPassword,
            email: input.email,
        });
        return uuid;
    }
}
