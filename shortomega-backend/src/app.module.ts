import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShortenerModule } from './shortener/shortener.module';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { AppRepositoryRedis } from './app.repository.redis';



@Module({
  imports: [ShortenerModule,
    // CacheModule.registerAsync({
    //   useFactory: async () => {
    //     const store = await redisStore({
    //       socket: {
    //         host: 'localhost',
    //         port: 6379,
    //       }
    //     })
    //     return {
    //       store: store as unknown as CacheStore,
    //       ttl: 3 * 60000
    //     }
    //   }
    // })
  ],
  controllers: [AppController],
  providers: [AppService,

  ],
})
export class AppModule { }
