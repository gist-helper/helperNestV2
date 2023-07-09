import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MealRepository } from './meal.repository';
import { CreateMealDto } from './dto/req-create-meal.dto';
import { Meal } from './meal.entity';
import { ChatbotSimpleTextResDto } from './dto/res-chatbot-simpletext.dto';
import { MessagesEng, MessagesKor, SpecMealInputEng, SpecMealInputKor, Types } from './enum/meal-related.enum';
import { Params, SpecMealReqDto } from './dto/req-chatbot-specmeal.dto';

@Injectable()
export class MealsService {
    private oneDayDiff = 24 * 60 * 60 * 1000;
    private krTimeDiff = 9 * 60 * 60 * 1000;
    private mealType = [
        [
            SpecMealInputKor.BREAKFAST,
            SpecMealInputKor.LUNCH,
            SpecMealInputKor.DINNER
        ],
        [
            SpecMealInputEng.BREAKFAST,
            SpecMealInputEng.LUNCH,
            SpecMealInputEng.DINNER
        ]
    ]
    private mealEmpty = [
        MessagesKor.NO_MEAL,
        MessagesEng.NO_MEAL
    ]

    constructor(
        @InjectRepository(MealRepository)
        private mealRepository: MealRepository
    ) {}

    createMeal(createMealDto: CreateMealDto): Promise<Meal> {
        return this.mealRepository.createMeal(createMealDto);
    }

    getNowMeal(langType: number): Promise<ChatbotSimpleTextResDto> {        
        return this.genSimpleTextRes(this.getMenu(langType))
    }

    getSpecMeal(specMealDto: SpecMealReqDto, langType: number) {
        const params = specMealDto.params;
        const { dateCustom, bld } = params;

        const nextMealTime = this.getSpecNextMealTime(langType, dateCustom);
        const kindType = this.getKindTypeByBld(langType, bld);
        return this.genSimpleTextRes(this.getMenu(langType, nextMealTime, kindType))
    }

    private async getMenu(langType: number, krCurrent?: Date, kindType?: number): Promise<string> {
        // for specmeal get time to show diet
        let nextMealTime = krCurrent;

        if(!krCurrent) {
            // for nowmeal get time to show diet
            krCurrent = this.getNowKRTime();
            nextMealTime = this.getNowNextMealTime(krCurrent);
        }

        if(!kindType) {
            // for nowmeal get kindtype to show diet
            kindType = this.getKindType(krCurrent);
        }

        const date = this.genTimeString(nextMealTime);

        let meal0 = this.mealRepository.getMealByTypeAndDate(Types.BLDG1_1ST, langType, kindType, date);
        let meal1 = this.mealRepository.getMealByTypeAndDate(Types.BLDG1_2ND, langType, kindType, date);
        let meal2 = this.mealRepository.getMealByTypeAndDate(Types.BLDG2_1ST, langType, kindType, date);

        let nowMealPromise = this.genMealString([meal0, meal1, meal2]);
        let nowMeal = "";
        
        await nowMealPromise.then((m) => {
            nowMeal = date + " ";
            nowMeal += this.mealType[langType][kindType] + "\n\n";
            nowMeal += m;
            if(m.length === 0) {
                nowMeal += this.mealEmpty[langType];
            }
        })

        return nowMeal;
    }

    private getSpecNextMealTime(langType:number, dateCustom: String): Date {
        return new Date();
    }

    private getNowNextMealTime(krCurrent: Date): Date {
        const hour = krCurrent.getHours();
        if(19 <= hour && hour < 24) {
            // show tomorrow breakfast
            krCurrent = new Date(krCurrent.getTime() + this.oneDayDiff);
        }
        return krCurrent;
    }
    
    private getNowKRTime(): Date {
        const current = new Date();
        const utc = current.getTime() + (current.getTimezoneOffset() * 60 * 1000);
        let krCurrent = new Date(utc + this.krTimeDiff);
        return krCurrent;
    }

    private getKindTypeByBld(langType: number, bld: string) {
        return 0;
    }

    private getKindType(krCurrent: Date): number {
        const hour = krCurrent.getHours();
        const minute = krCurrent.getMinutes();
        var kindType = 0;
        if(9 <= hour && hour < 13) {
            // show lunch
            kindType = 1;
        }
        else if(13 <= hour && (hour < 18 || (hour == 18 && minute < 30))) {
            // show dinner
            kindType = 2;
        }
        else if((19 <= hour || (hour == 18 && minute >= 30)) && hour < 24) {
            // show tomorrow breakfast
            kindType = 0;
            //krCurrent = new Date(krCurrent.getTime() + this.oneDayDiff);
        }
        else { // 0 <= hour && hour < 9
            // show breakfast
            kindType = 0;
        }
        return kindType;
    }

    private genTimeString(date: Date) {
        const y = date.getFullYear()
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    private async genMealString(dietPromise: Promise<Meal>[]): Promise<string> {
        var mealStr = ""
        await Promise.all(dietPromise).then((meals) => {
            meals.forEach((meal) => {
                if(meal) mealStr += meal.getMenuStr();
            })
        })
        return mealStr;
    }

    private async genSimpleTextRes(nowMeal: Promise<string>): Promise<ChatbotSimpleTextResDto> {
        let simpleText = "";
        await nowMeal.then((m) => {
            simpleText = m;
        })
        let chatbotSimpleTextResDto: ChatbotSimpleTextResDto = new ChatbotSimpleTextResDto()
        chatbotSimpleTextResDto = {
            response: {
                template: {
                    outputs: [
                       {
                        simpleText: {
                            text: simpleText
                        }
                       }
                    ]
                },
                version: "2.0"
            },
        }
        return chatbotSimpleTextResDto;
    }
}
