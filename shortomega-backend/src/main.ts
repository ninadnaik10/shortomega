import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const FRONTEND_URL = process.env.FRONTEND_URL;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: FRONTEND_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    await app.listen(3001);
}
bootstrap();
