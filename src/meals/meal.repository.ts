import { CustomRepository } from "src/db/typeorm-ex.decorator";
import { Meal } from "./meal.entity";
import { Repository } from "typeorm";
import { CreateMealDto } from "./dto/req-create-meal.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { ErrorMessage } from "./enum/meal-related.enum";

@CustomRepository(Meal)
export class MealRepository extends Repository<Meal> {
    async createMeal(createMealDto: CreateMealDto): Promise<Meal> {
        const { bldgType, langType, dateType, kindType, bldg, date, kind, menu, special } = createMealDto

        const meal = this.create({
            ...createMealDto
        });

        try {
            await this.save(meal);
        }
        catch (error) {
            if(error.code === '23505') {
                throw new ConflictException(ErrorMessage.EXIST_MEAL_ERROR)
            }
            else {
                throw new InternalServerErrorException();
            }
        }
        return meal;
    }
}