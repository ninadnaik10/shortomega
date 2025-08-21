import { Body, Controller, Post } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) { }

  @Post('/visits')
  async getVisits(@Body() shortUrls: string[]) {
    return this.analyticsService.getTotalAndUniqueVisits(shortUrls);
  }
}
