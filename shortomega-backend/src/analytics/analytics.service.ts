import { Injectable } from '@nestjs/common';
import { AppRepositoryRedis } from 'src/app.repository.redis';
import { TotalUniqueVisitsObject } from 'src/types';

@Injectable()
export class AnalyticsService {
    constructor(private readonly redis: AppRepositoryRedis) {}

    async incrementUniqueVisit(hash: string, ipAddress: string) {
        try {
            return await this.redis.addToHyperloglog(hash, ipAddress);
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

    async getTotalAndUniqueVisits(
        shortUrls: string[],
    ): Promise<TotalUniqueVisitsObject[]> {
        try {
            return this.redis.getTotalAndUniqueVisits(shortUrls);
        } catch (err) {
            throw new Error(err);
        }
    }
}
