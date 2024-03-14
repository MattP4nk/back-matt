import { NestFactory } from '@nestjs/core';
import * as appModule from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(appModule.AppModule);

  app.enableCors();
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Matt back')
    .setDescription('Backend documentation')
    .setVersion('1.0')
    .addTag('Info')
    .addTag('Muse')
    .addTag('Auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('Documentation', app, document);
  await app.listen(3000);
}
bootstrap();
