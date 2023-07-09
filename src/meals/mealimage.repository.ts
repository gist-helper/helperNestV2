import { CustomRepository } from "src/db/typeorm-ex.decorator";
import { MealImage } from "./mealimage.entity";
import { Repository } from "typeorm";
import { CreateMealDto } from "./dto/req-create-meal.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { ErrorMessage } from "./enum/meal-related.enum";


@CustomRepository(MealImage)
export class MealRepository extends Repository<MealImage> {
    
}