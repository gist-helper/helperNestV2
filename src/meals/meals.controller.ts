import { Body, Controller, Get, Post } from '@nestjs/common';
import { MealsService } from './meals.service';
import { CreateMealDto } from './dto/req-create-meal.dto';
import { TypeValidationPipe } from './pipes/createmeal-type-validation.pipe';
import { Meal } from './meal.entity';
import { typeORMconfig } from 'src/configs/typeorm.config';

@Controller('meals')
export class MealsController {
    constructor(private mealService: MealsService) {}

    @Get()
    healthCheck(): string {
        return "dk dusdjejvqkq"
    }

    @Post('/create')
    createMeal(
        @Body(TypeValidationPipe) createMealDto: CreateMealDto
    ): Promise<Meal> {
        return this.mealService.createMeal(createMealDto)
    }

    @Post('/kor')
    getNowKorMeal() {
        console.log('kor')
    }

    @Post('/eng') 
    getNowEngMeal() {

    }

    @Post('/speckor')
    getSpecKorMeal() {

    }

    @Post('/speceng')
    getSpecEngMeal() {

    }

    @Post('/imagebldg1')
    getBldg1Image() {

    }

    @Post('/imageBldg2')
    getBldg2Image() {

    }

    @Get('/date/:year/:month/:day/:bldgType/:langType')
    getDateMeal() {
        
    }
}
