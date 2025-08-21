import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Redirect,
  Response,
  UseGuards,
  Request,
  Ip,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AppRepositoryRedis } from 'src/app.repository.redis';
import { isValidUrl } from 'src/utils';
import { v4 as uuidv4 } from 'uuid';
import { ShortenerService } from './shortener.service';
import { AnonymousUserGuard } from 'src/auth/guards/anonymous-user.guard';
import { AnalyticsService } from 'src/analytics/analytics.service';
interface ShortenResponse {
  hash: string;
}

interface ErrorResponse {
  error: string;
  code: string;
}

@Controller('shorten')
export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) { }

  @UseGuards(AnonymousUserGuard)
  @Post('/')
  async shortenLink(
    @Body('url') url: string,
    @Request() req,
  ): Promise<ShortenResponse | ErrorResponse> {
    return this.shortenerService.shortenLink(url, req.user);
  }
}

@Controller('/')
export class LongUrlController {
  constructor(
    private readonly shortenerService: ShortenerService,
    private readonly analyticsService: AnalyticsService,
  ) { }

  @Get(':hash')
  async getUrlToRedirect(@Param('hash') hash: string, @Ip() ip: string) {
    console.log(ip);
    const url = await this.shortenerService.getLongUrl(hash);
    if (url) {
      this.analyticsService.incrementVisit(`short:${hash}:visits`);
      this.analyticsService.incrementUniqueVisit(`short:${hash}:ips`, ip);
      //            this.analyticsService.visitsByLocation()
      return { url };
    } else {
      return { error: 'URL not found' };
    }
  }
}
