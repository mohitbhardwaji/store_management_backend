import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{ logger: ['log', 'error', 'warn', 'debug', 'verbose'] });
  app.enableCors({
    origin: 'http://localhost:5173', // frontend Vite dev server
    credentials: true, // allow cookies if you use them
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
