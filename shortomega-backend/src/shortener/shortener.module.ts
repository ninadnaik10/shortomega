import { Module } from '@nestjs/common';
import { RedirectController, ShortenerController } from './shortener.controller';
import { AppRepositoryRedis } from 'src/app.repository.redis';

@Module({
  controllers: [ShortenerController, RedirectController],
  providers: [AppRepositoryRedis]
})
export class ShortenerModule { }
