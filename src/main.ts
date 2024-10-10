import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { UrcGaurd } from './auth/urc-gaurd';
import { AuthGaurd } from './auth/auth-gaurd';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const port = 3000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Swagger setup & Swagger UI available at /api
  const config = new DocumentBuilder()
    .setTitle('Books API')
    .setDescription('API for managing books')
    .setVersion('1.0')
    .addTag('books')
    .addBearerAuth() // If you're using JWT or basic auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000, () => {
    logger.log(`Server is listening on http://localhost:${port}`);
  });
}
bootstrap();
