import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('urls')
export class UrlsController {
    constructor(private readonly urlsService: UrlsService) {}

    @UseGuards(AuthGuard)
    @Get('urls')
    async getUrls(@Request() req) {
        return this.urlsService.getUrls(req.user);
    }
}
