import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
var path = require('path');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe(
    {
      //whitelist: true,
      //forbidNonWhitelisted: true,
      transform: true,
    }
  ))
  //app.useStaticAssets(path.join(__dirname, './common', 'uploads'), {
  //  prefix: '/media',
  //});

  const swaggerConfig = new DocumentBuilder()
    .setTitle('GIST Helper')
    .setDescription('GIST Helper API description')
    .setVersion('1.0')
    .addTag('Meals')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const serverConfig = config.get('server');
  const port = serverConfig.port;
  await app.listen(port);

}
bootstrap();
