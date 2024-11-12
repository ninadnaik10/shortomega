
import { Injectable } from '@nestjs/common';
import { AppRepositoryRedis } from 'src/app.repository.redis';

export type User = {
  username: string;
  hashedPassword: string;
  email: string;
};



@Injectable()
export class UsersService {

  constructor(private readonly redisService: AppRepositoryRedis) { }
  async findOne(username: string): Promise<User | undefined> {
    const email = await this.redisService.get(`user:${username}`)
    return this.redisService.get(`user:${username}`)
  }
}
