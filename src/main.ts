import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe()); // 이걸 써줘야 클레스 밸리데이션이 됩니다.
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('USER API')
    .setDescription('Users API description')
    .setVersion('1.0')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  const PORT = process.env.PORT || 3000;

  document.tags = [];

  // CORS 설정
  app.enableCors({
    origin: true, // 이렇게 해줘야 모든 요청에 대해 CORS 허용합니다.
    credentials: true, // 이걸 해줘야 쿠키가 전달됩니다.
  });

  await app.listen(PORT);
}
bootstrap();
