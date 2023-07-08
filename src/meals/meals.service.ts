import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MealRepository } from './meal.repository';
import { CreateMealDto } from './dto/req-create-meal.dto';
import { Meal } from './meal.entity';

@Injectable()
export class MealsService {
    constructor(
        @InjectRepository(MealRepository)
        private mealRepository: MealRepository
    ) {}

    createMeal(createMealDto: CreateMealDto): Promise<Meal> {
        return this.mealRepository.createMeal(createMealDto);
    }
}
