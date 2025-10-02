import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AppRepositoryRedis } from 'src/app.repository.redis';
import { AnalyticsController } from './analytics.controller';

@Module({
    providers: [AnalyticsService, AppRepositoryRedis],
    controllers: [AnalyticsController],
})
export class AnalyticsModule {}
