import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AppRepositoryRedis } from 'src/app.repository.redis';

@Module({
    providers: [AnalyticsService, AppRepositoryRedis],
})
export class AnalyticsModule {}
