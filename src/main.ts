import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors({
  //   origin: ['http://localhost:3000', 'http://localhost:3001'],
  //   methods: ['GET', 'POST', 'PUT', 'DELETE'],
  //   credentials: true, // si planeas enviar cookies o tokens
  // });
  app.enableCors({
    origin: ['*'],
    // origin: ['https://finandiaz.vercel.app', 'http://localhost:3001'],
    // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // allowedHeaders: ['Content-Type', 'Authorization'],
    // credentials: true,
  });

  //( PreFIX )
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
