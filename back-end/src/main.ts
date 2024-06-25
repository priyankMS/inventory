import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { JwtGuard } from './modules/auth/guards/JwtGuard.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
    }),
  );
  app.useGlobalGuards(new JwtGuard(reflector));
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
