import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShortenerModule } from './shortener/shortener.module';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { AppRepositoryRedis } from './app.repository.redis';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';



@Module({
  imports: [ShortenerModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService,

  ],
})
export class AppModule { }
