import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AppRepositoryRedis } from 'src/app.repository.redis';
import { TotalUniqueVisitsObject } from 'src/types';
import axios from 'axios';

@Injectable()
export class AnalyticsService {
    constructor(private readonly redis: AppRepositoryRedis) {}

    async incrementUniqueVisit(hash: string, ipAddress: string) {
        try {
            await this.visitsByLocation(hash, ipAddress);
            return await this.redis.addToHyperloglog(hash, ipAddress);
        } catch (err) {
            throw new InternalServerErrorException('Failed to increment unique visit');
        }
    }

    async incrementVisit(hash: string) {
        try {
            return await this.redis.increment(hash);
        } catch (err) {
            throw new InternalServerErrorException('Failed to increment visit count');
        }
    }

    async getTotalAndUniqueVisits(
        shortUrls: string[],
    ): Promise<TotalUniqueVisitsObject[]> {
        try {
            return this.redis.getTotalAndUniqueVisits(shortUrls);
        } catch (err) {
            throw new InternalServerErrorException('Failed to fetch visit statistics');
        }
    }

    async visitsByLocation(hash: string, ipAddress: string) {
        try {
            const country = await this.fetchCountryByIpAddress(ipAddress);
            await this.redis.addToSet(`location:${hash}`, country);
        } catch (err) {
            if (err instanceof BadRequestException) {
                throw err;
            }
            throw new InternalServerErrorException('Failed to record visit location');
        }
    }

    async fetchCountryByIpAddress(ipAddress: string): Promise<string> {
        
        try {
            if(ipAddress === "::1"){
            await this.redis.put(
                `location:${ipAddress}`,
                JSON.stringify("localhost"),
            );
            return "localhost"
        }
            const cachedLocation = await this.redis.get(`location:${ipAddress}`);
            if (cachedLocation) {
                return cachedLocation;
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

            const { data, headers } = await axios.get(
                `http://ip-api.co/json/${ipAddress}`,
            );

            const remaining = headers['x-rl'];
            const ttl = headers['x-ttl'];

            if (remaining) {
                await this.redis.put('ip-api:X-Rl', remaining);
            }
            if (ttl) {
                await this.redis.put('ip-api:X-Ttl', ttl);
            }

            await this.redis.put(
                `location:${ipAddress}`,
                JSON.stringify(data),
            );

            if (!data?.country) {
                throw new BadRequestException('Unable to determine country from IP');
            }

            return data.country;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new InternalServerErrorException(
                    `Failed to fetch location data: ${error.message}`,
                );
            }
            throw new InternalServerErrorException(
                'An unexpected error occurred while fetching location data',
            );
        }
    }
}
