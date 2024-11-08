import { Body, Controller, Get, Param, Post, Redirect, Response } from '@nestjs/common';
import { AppRepositoryRedis } from 'src/app.repository.redis';
import { isValidUrl } from 'src/utils';
import { v4 as uuidv4 } from 'uuid';


interface ShortenResponse {
    hash: string;
}

interface ErrorResponse {
    error: string,
    code: string
}

@Controller('shorten')
export class ShortenerController {
    constructor(private readonly redisService: AppRepositoryRedis) { }
    @Post("/")
    async shortenLink(@Body('url') url: string): Promise<ShortenResponse | ErrorResponse> {
        if (!url) {
            return ({ error: 'URL is required', code: 'missing_url' });
        }
        else if (!isValidUrl(url)) {
            return { error: 'Enter a valid URL', code: 'invalid_url_format' }
        }
        let hash = uuidv4().slice(0, 7);
        // console.log(hash)
        console.log(await this.redisService.get(hash))
        while (await this.redisService.get(hash) !== null) {
            // console.log("first")
            hash = uuidv4().slice(0, 7);
        }
        // console.log(hash, url)
        await this.redisService.put(hash, url)
        return ({ hash: hash });
    }



}

@Controller("/")
export class RedirectController {
    constructor(private readonly redisService: AppRepositoryRedis) { }

    @Get(":hash")
    async redirect(@Param("hash") hash: string) {
        return { url: await this.redisService.get(hash) }
    }
}