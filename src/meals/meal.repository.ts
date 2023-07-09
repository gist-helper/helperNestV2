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

    async getMealByTypeAndDate(bldgType: number, langType: number, kindType: number, date: string): Promise<Meal> {
        const query = this.createQueryBuilder('meal');
        query.where(
            'meal.bldgType = :bldgType and meal.langType = :langType and meal.kindType = :kindType and meal.date = :date',
            {
                bldgType,
                langType,
                kindType,
                date
            }
        )
        const meal = await query.getOne();
        return meal;
    }
}