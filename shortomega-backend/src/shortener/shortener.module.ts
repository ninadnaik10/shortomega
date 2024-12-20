import { Module } from '@nestjs/common';
import { LongUrlController, ShortenerController } from './shortener.controller';
import { AppRepositoryRedis } from 'src/app.repository.redis';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ShortenerService } from './shortener.service';

@Module({
    controllers: [ShortenerController, LongUrlController],
    providers: [ShortenerService, AppRepositoryRedis],
})
export class ShortenerModule {}
