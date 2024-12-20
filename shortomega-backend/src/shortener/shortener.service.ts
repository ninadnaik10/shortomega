import { Injectable } from '@nestjs/common';
import { AppRepositoryRedis } from 'src/app.repository.redis';
import { isValidUrl } from 'src/utils';
import { v4 as uuidv4 } from 'uuid';

interface ShortenResponse {
    hash: string;
}

interface ErrorResponse {
    error: string;
    code: string;
}

@Injectable()
export class ShortenerService {
    constructor(private readonly redis: AppRepositoryRedis) {}

    async shortenLink(
        url: string,
        user: {
            userId: string;
            email: string;
        } | null,
    ): Promise<ShortenResponse | ErrorResponse> {
        if (!url) {
            return { error: 'URL is required', code: 'missing_url' };
        } else if (!isValidUrl(url)) {
            return { error: 'Enter a valid URL', code: 'invalid_url_format' };
        }
        let hash = uuidv4().slice(0, 7);
        // console.log(hash)
        console.log(await this.redis.get(hash));
        while ((await this.redis.get(hash)) !== null) {
            // console.log("first")
            hash = uuidv4().slice(0, 7);
        }
        // console.log(hash, url)
        await this.redis.put(`short:${hash}`, url);
        if (user) {
            console.log(`user:${user.userId}:urls`, hash);
            await this.redis.addToSet(`user:${user.userId}:urls`, hash);
        }
        return { hash: hash };
    }

    async getLongUrl(hash: string): Promise<string | null> {
        return this.redis.get(`short:${hash}`);
    }
}
