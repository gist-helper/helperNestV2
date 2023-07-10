import { Body, Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { MealsService } from './meals.service';
import { CreateMealDto } from './dto/req-create-meal.dto';
import { TypeValidationPipe } from './pipes/createmeal-type-validation.pipe';
import { Meal } from './meal.entity';
import { typeORMconfig } from 'src/configs/typeorm.config';
import { ChatbotSimpleTextResDto } from './dto/res-chatbot-simpletext.dto';
import { SpecMealReqDto } from './dto/req-chatbot-specmeal.dto';
import { SpecmealEngParamsValidationPipe, SpecmealKorParamsValidationPipe } from './pipes/specmeal-params-validation.pipe';
import { Types } from './enum/meal-related.enum';
import { MobileDateMealReqDto } from './dto/req-mobile-datemeal.dto';
import { MobileDateMealResDto } from './dto/res-mobile-datemeal.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/utils/fileupload';

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

    @Post('/createimage')
    @UseInterceptors(FilesInterceptor('file'))
    createMealImage(
        @UploadedFiles() files: Express.Multer.File
    ) {
        console.log(files)
        //return this.mealService.createMealImage(files);
    }

    @Post('/imagebldg1')
    getBldg1Image() {
        return this.mealService.getBldg1Image();
    }

    @Post('/imageBldg2')
    getBldg2Image() {
        return this.mealService.getBldg2Image();
    }

    @Get('/date/:year/:month/:day/:bldgType/:langType')
    getDateMeal(
        @Param('year') year: number, 
        @Param('month') month: number, 
        @Param('day') day: number, 
        @Param('bldgType') bldgType: number, 
        @Param('langType') langType: number
    ): Promise<MobileDateMealResDto> {
        const mobileDateMealReqDto: MobileDateMealReqDto = {
            year,
            month,
            day,
            bldgType,
            langType
        }
        return this.mealService.getDateMeal(mobileDateMealReqDto);
    }
}
