import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMconfig } from './configs/typeorm.config';
import { MealsModule } from './meals/meals.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMconfig),
    MealsModule,
  ],
})
export class AppModule {}
