import { Injectable } from '@nestjs/common';
import { AppRepositoryRedis } from 'src/app.repository.redis';

@Injectable()
export class AnalyticsService {
    constructor(private readonly redis: AppRepositoryRedis) {}

    async incrementUniqueVisit(hash: string, ipAddress: string) {
        try {
            return await this.redis.addToSet(`short:${hash}:ips`, ipAddress);
        } catch (err) {
            throw new Error(err);
        }
    }
    async incrementVisit(hash: string) {
        try {
            return await this.redis.increment(hash);
        } catch (err) {
            throw new Error(err);
        }
    }
}
