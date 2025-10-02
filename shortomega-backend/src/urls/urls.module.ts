import { Module } from '@nestjs/common';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { AppRepositoryRedis } from 'src/app.repository.redis';

@Module({
    controllers: [UrlsController],
    providers: [UrlsService, AppRepositoryRedis],
})
export class UrlsModule {}
