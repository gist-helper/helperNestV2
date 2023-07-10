import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
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

  const serverConfig = config.get('server');
  const port = serverConfig.port;
  await app.listen(port);

}
bootstrap();
