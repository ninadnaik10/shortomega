
import { Injectable } from '@nestjs/common';
import { AppRepositoryRedis } from 'src/app.repository.redis';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { UserInput } from './types';
import { AuthInput } from 'src/auth/types';
export type User = {
  userId: string;
  hashedPassword: string;
  email: string;
};



@Injectable()
export class UsersService {

  constructor(private readonly redisService: AppRepositoryRedis) { }
  async findOne(email: string): Promise<string | undefined> {
    const userId = await this.redisService.get(`user:${email}`)
    console.log(userId)
    if (!userId) {
      return undefined
    }
    const hashed_password = await this.redisService.hgetall(`userid:${userId}`)
    console.log(hashed_password)
    return userId
  }

  async createUser(input: AuthInput): Promise<string> {
    // TODO: Error handling
    const uuid = uuidv4()
    console.log(input)
    console.log(uuid.toString())
    const hashedPassword = await bcrypt.hash(input.password, 10);
    await this.redisService.put(`user:${input.email}`, uuid.toString())
    await this.redisService.hmset(`userid:${uuid.toString()}`, {
      hashedPassword,
      email: input.email
    });
    return uuid
  }
}
