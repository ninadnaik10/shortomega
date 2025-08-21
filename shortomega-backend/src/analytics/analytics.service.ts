import { Injectable } from '@nestjs/common';
import { AppRepositoryRedis } from 'src/app.repository.redis';
import { TotalUniqueVisitsObject } from 'src/types';

@Injectable()
export class AnalyticsService {
    constructor(private readonly redis: AppRepositoryRedis) {}

    async incrementUniqueVisit(hash: string, ipAddress: string) {
        try {
            await this.visitsByLocation(hash, ipAddress);
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

    async visitsByLocation(hash: string, ipAddress: string) {
        try {
            const country = await this.fetchCountryByIpAddress(ipAddress);
            await this.redis.addToSet(`location:${hash}`, country);
        } catch (err) {
            throw new Error(err);
        }
    }

    async fetchCountryByIpAddress(ipAddress: string): Promise<string> {
        if (this.redis.get(`location:${ipAddress}`)) {
            return this.redis.get(`location:${ipAddress}`);
        }
        const remainingRequests = await this.redis.get(`ip-api:X-Rl`);
        if (remainingRequests !== null && parseInt(remainingRequests) <= 0) {
            const ttl = await this.redis.get(`ip-api:X-Ttl`);
            if (ttl) {
                await new Promise((resolve) =>
                    setTimeout(resolve, parseInt(ttl) * 1000),
                );
                await this.redis.delete(`ip-api:X-Rl`);
                await this.redis.delete(`ip-api:X-Ttl`);
            }
        }

        try {
            const response = await fetch(`http://ip-api.co/json/${ipAddress}`);

            const remaining = response.headers.get('X-Rl');
            const ttl = response.headers.get('X-Ttl');
            if (remaining !== null) {
                await this.redis.put('X-Rl', remaining);
            }
            if (ttl !== null) {
                await this.redis.put('X-Ttl', ttl);
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const locationData = await response.json();

            await this.redis.put(
                `location:${ipAddress}`,
                JSON.stringify(locationData),
            );

            return locationData?.country;
        } catch (err) {
            throw new Error(err);
        }
    }
}
