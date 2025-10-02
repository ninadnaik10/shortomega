import { Injectable } from '@nestjs/common';
import { AppRepositoryRedis } from 'src/app.repository.redis';

@Injectable()
export class UrlsService {
    constructor(private readonly redis: AppRepositoryRedis) {}

    async getUrls(user: { userId: string; email: string }) {
        const urls = await this.redis.getManyLongUrls(
            `user:${user.userId}:urls`,
        );
        return urls;
    }
}
