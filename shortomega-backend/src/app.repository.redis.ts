import { createClient, RedisClientType } from "redis";

export interface IAppRepositoryRedis {
    get(hash: string): Promise<string | null>;
    put(hash: string, url: string): Promise<string | null>;
}

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
}