import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

const possiblePaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'packages/api/.env'),
  path.resolve(__dirname, '../.env'),
];

for (const envPath of possiblePaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log('Loaded .env from:', envPath);
    break;
  }
}

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

let app: any;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.enableCors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    });

    await app.init();
  }
  return app;
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  bootstrap().then(async (app) => {
    await app.listen(3001, () => {
      console.log('Backend running on http://localhost:3001');
    });
  });
}

// For Vercel serverless
export default async function handler(req: any, res: any) {
  const app = await bootstrap();
  const httpAdapter = app.getHttpAdapter().getInstance();
  httpAdapter(req, res);
}