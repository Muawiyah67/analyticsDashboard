import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

const possiblePaths = [
  path.resolve(process.cwd(), '.env'),           // when running from packages/api/
  path.resolve(process.cwd(), 'packages/api/.env'), // when running from root
  path.resolve(__dirname, '../.env'),           // fallback relative to compiled file
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

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(3001, () => {
    console.log('Backend running on http://localhost:3001');
  });
}

bootstrap();