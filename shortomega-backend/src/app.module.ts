import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShortenerModule } from './shortener/shortener.module';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { AppRepositoryRedis } from './app.repository.redis';



@Module({
  imports: [ShortenerModule],
  controllers: [AppController],
  providers: [AppService,

  ],
})
export class AppModule { }
