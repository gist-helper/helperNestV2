import { Body, Controller, Get, Post } from '@nestjs/common';
import { MealsService } from './meals.service';
import { CreateMealDto } from './dto/req-create-meal.dto';
import { TypeValidationPipe } from './pipes/createmeal-type-validation.pipe';
import { Meal } from './meal.entity';
import { typeORMconfig } from 'src/configs/typeorm.config';
import { ChatbotSimpleTextResDto } from './dto/res-chatbot-simpletext.dto';
import { SpecMealReqDto } from './dto/req-chatbot-specmeal.dto';
import { SpecmealEngParamsValidationPipe, SpecmealKorParamsValidationPipe } from './pipes/specmeal-params-validation.pipe';
import { Types } from './enum/meal-related.enum';

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
    getNowKorMeal(): Promise<ChatbotSimpleTextResDto> {
        const langType = Types.LANG_KOR;
        return this.mealService.getNowMeal(langType);
    }

    @Post('/eng') 
    getNowEngMeal(): Promise<ChatbotSimpleTextResDto> {
        const langType = Types.LANG_ENG;
        return this.mealService.getNowMeal(langType);
    }

    @Post('/speckor')
    getSpecKorMeal(@Body('action', SpecmealKorParamsValidationPipe) specMealDto: SpecMealReqDto) {
        //console.log(JSON.stringify(specMealDto.params));
        const langType = Types.LANG_KOR;
        return this.mealService.getSpecMeal(specMealDto, langType);
    }

    @Post('/speceng')
    getSpecEngMeal(@Body('action', SpecmealEngParamsValidationPipe) specMealDto: SpecMealReqDto) {
        //console.log(JSON.stringify(specMealDto.params));
        const langType = Types.LANG_ENG;
        return this.mealService.getSpecMeal(specMealDto, langType);
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
