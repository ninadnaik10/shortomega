import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { AppRepositoryRedis } from 'src/app.repository.redis';

@Module({
  providers: [UsersService, AppRepositoryRedis],
  exports: [UsersService],
})
export class UsersModule {}
