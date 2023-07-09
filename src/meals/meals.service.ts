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
    private readonly oneDayDiff: number = 24 * 60 * 60 * 1000;
    private readonly krTimeDiff: number = 9 * 60 * 60 * 1000;
    private readonly mealType: Array<Array<string>> = [
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
    private readonly mealEmpty = [
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
        return this.genSimpleTextRes(this.genMenu(langType))
    }

    getSpecMeal(specMealDto: SpecMealReqDto, langType: number) {
        const { dateCustom, bld } = specMealDto.params;
        const nextMealTime = this.getSpecNextMealTime(langType, dateCustom);
        const kindType = this.getKindTypeByBld(langType, bld);
        return this.genSimpleTextRes(this.genMenu(langType, nextMealTime, kindType))
    }

    private async genMenu(langType: number, krCurrent?: Date, kindType?: number): Promise<string> {
        // for specmeal get time to show diet
        let nextMealTime = krCurrent;

        // for nowmeal get time to show diet
        if(!krCurrent) {
            krCurrent = this.getNowKRTime();
            nextMealTime = this.getNowNextMealTime(krCurrent);
        }

        // for nowmeal get kindtype to show diet
        if(!kindType) {
            kindType = this.getKindType(krCurrent);
        }

        const date = this.genTimeString(nextMealTime);

        let meal0 = this.mealRepository.getMealByTypeAndDate(Types.BLDG1_1ST, langType, kindType, date);
        let meal1 = this.mealRepository.getMealByTypeAndDate(Types.BLDG1_2ND, langType, kindType, date);
        let meal2 = this.mealRepository.getMealByTypeAndDate(Types.BLDG2_1ST, langType, kindType, date);

        let menuPromise = this.genMenuString([meal0, meal1, meal2]);
        let menu = "";
        
        await menuPromise.then((menuString) => {
            menu = date + " ";
            menu += this.mealType[langType][kindType] + "\n\n";
            menu += menuString;
            if(menuString.length === 0) {
                menu += this.mealEmpty[langType];
            }
        })

        return menu;
    }

    private getSpecNextMealTime(langType:number, dateCustom: String): Date {
        return new Date();
    }

    private getNowNextMealTime(krCurrent: Date): Date {
        const hour = krCurrent.getHours();
        const minute = krCurrent.getMinutes();
        if(this.isShowTomorrowBreakfast(hour, minute)) // show tomorrow breakfast
            return new Date(krCurrent.getTime() + this.oneDayDiff); 
        return krCurrent;
    }
    
    private getNowKRTime(): Date {
        const current = new Date();
        const utc = current.getTime() + (current.getTimezoneOffset() * 60 * 1000);
        return new Date(utc + this.krTimeDiff);
    }

    private getKindTypeByBld(langType: number, bld: string): number {
        return this.mealType[langType].indexOf(bld);
    }

    private getKindType(krCurrent: Date): number {
        const hour = krCurrent.getHours();
        const minute = krCurrent.getMinutes();
        if(this.isShowLunch(hour, minute)) // show lunch
            return Types.KIND_LUNCH;     
        if(this.isShowDinner(hour, minute)) // show dinner
            return Types.KIND_DINNER; 
        return Types.KIND_BREAKFAST;
    }

    private isShowLunch(hour: number, minute: number): boolean {
        return 9 <= hour && hour < 13;
    }
    private isShowDinner(hour: number, minute: number): boolean {
        return 13 <= hour && (hour < 18 || (hour == 18 && minute < 30));
    }
    private isShowTomorrowBreakfast(hour: number, minute: number): boolean {
        return ((hour == 18 && minute >= 30) || 19 <= hour) && hour < 24;
    }
    private isShowBreakfast(hour: number, minute: number): boolean {
        return 0 <= hour && hour < 9;
    }

    private genTimeString(date: Date) {
        const y = date.getFullYear()
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    private async genMenuString(dietPromise: Promise<Meal>[]): Promise<string> {
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
