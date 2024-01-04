import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // 이걸 써줘야 클레스 밸리데이션이 됩니다.
  app.useGlobalFilters(new HttpExceptionFilter());
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
}
bootstrap();
