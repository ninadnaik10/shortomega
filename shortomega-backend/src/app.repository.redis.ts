import { Injectable, Scope } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { UrlMap } from './types';

export interface IAppRepositoryRedis {
    get(hash: string): Promise<string | null>;
    put(hash: string, url: string): Promise<string | null>;
    hmset(hash: string, fields: Record<string, string>): Promise<string | null>;
    addToSet(hash: string, url: string): Promise<string | null>;
    getManyUrls(hash: string): Promise<string[]>;
    hgetall(hash: string): Promise<string | null>;
    increment(hash: string): Promise<number>;
    addToHyperloglog(hash: string, ipAddress: string): Promise<string>;
    countFromHyperloglog(hash: string): Promise<number>;
    getManyLongUrls(hash: string): Promise<UrlMap[]>;
}

@Injectable({ scope: Scope.DEFAULT })
export class AppRepositoryRedis implements IAppRepositoryRedis {
    private readonly redisClient: RedisClientType;

    constructor() {
        const host = process.env.REDIS_HOST || 'localhost';
        const port = process.env.REDIS_PORT || 6379;

        this.redisClient = createClient({
            url: `redis://${host}:${port}`,
        });

        // Initialize connection
        this.init().catch(console.error);
    }

    private async init(): Promise<void> {
        try {
            await this.redisClient.connect();
            console.log('Redis connected');
        } catch (error) {
            console.error('Redis connection error:', error);
        }

        this.redisClient.on('error', console.error);
    }

    async get(hash: string): Promise<string | null> {
        return await this.redisClient.get(hash);
    }

    async put(hash: string, url: string): Promise<string | null> {
        await this.redisClient.set(hash, url);
        return await this.redisClient.get(hash);
    }
    async hmset(
        hash: string,
        fields: Record<string, string>,
    ): Promise<string | null> {
        await this.redisClient.hSet(hash, fields);
        return 'OK';
    }

    async addToSet(hash: string, data: string): Promise<string | null> {
        await this.redisClient.sAdd(hash, data);
        return 'OK';
    }

    async getManyUrls(hash: string): Promise<string[]> {
        return await this.redisClient.sMembers(hash);
    }

    async hgetall(hash: string): Promise<string | null> {
        return await this.redisClient.hGet(hash, 'hashed_password');
    }

    async increment(hash: string): Promise<number> {
        return await this.redisClient.incr(`short:${hash}:visits`);
    }

    async addToHyperloglog(hash: string, ipAddress: string): Promise<string> {
        // try {
        await this.redisClient.pfAdd(hash, ipAddress);
        return 'OK';
        // } catch (e) {
        //     throw new Error(e);
        // }
    }

    async countFromHyperloglog(hash: string): Promise<number> {
        return await this.redisClient.pfCount(hash);
    }

    async getManyLongUrls(hash: string): Promise<UrlMap[]> {
        const script = `
            local urls = redis.call('SMEMBERS', KEYS[1])
            local result = {}
            for i, url in ipairs(urls) do
                local longUrl = redis.call('GET', 'short:'..url)
                if longUrl then
                    table.insert(result, url)
                    table.insert(result, longUrl)
                end
            end
            return result
        `;

        const result = await this.redisClient.eval(script, {
            keys: [hash],
            arguments: [],
        });

        const pairs: UrlMap[] = [];
        for (let i = 0; Array.isArray(result) && i < result.length; i += 2) {
            // @ts-ignore
            pairs.push({ shortUrl: result[i], longUrl: result[i + 1] });
        }
        return pairs;
    }
}
