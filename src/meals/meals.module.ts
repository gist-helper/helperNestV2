import { Module } from "@nestjs/common";
import { TypeOrmExModule } from "src/db/typeorm-ex.module";
import { MealRepository } from "./meal.repository";
import { MealsController } from "./meals.controller";
import { MealsService } from "./meals.service";

@Module({
    imports: [
        TypeOrmExModule.forCustomRepository([MealRepository])
    ],
    controllers: [MealsController],
    providers: [MealsService],
})
export class MealsModule {}