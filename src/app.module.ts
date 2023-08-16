import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMconfig } from './configs/typeorm.config';
import { MealsModule } from './meals/meals.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMconfig),
    MealsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../public'),
    }),
  ],
})
export class AppModule {}