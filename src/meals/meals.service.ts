import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MealRepository } from './meal.repository';
import { CreateMealDto } from './dto/req-create-meal.dto';
import { Meal } from './meal.entity';
import { ChatbotSimpleTextResDto } from './dto/res-chatbot-simpletext.dto';
import { ErrorMessage, MessagesEng, MessagesKor, SpecMealInputEng, SpecMealInputKor, Types } from './enum/meal-related.enum';
import { Params, SpecMealReqDto } from './dto/req-chatbot-specmeal.dto';
import { MobileDateMealReqDto } from './dto/req-mobile-datemeal.dto';

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
    private readonly mealEmpty: Array<string> = [
        MessagesKor.NO_MEAL,
        MessagesEng.NO_MEAL
    ]
    private readonly specInputTypeLang: Array<Array<string>> = [
        [
            SpecMealInputKor.TODAY,
            SpecMealInputKor.TOMORROW,
        ],
        [
            SpecMealInputEng.TODAY,
            SpecMealInputEng.TOMORROW,
        ]
    ]
    // legacy!
    // for our policy MON - SUN (0 - 6)
    // in javasript SUN - SAT (0 - 6)
    private readonly specInputTypeDay: Array<Array<string>> = [
        [
            SpecMealInputKor.SUN,
            SpecMealInputKor.MON,
            SpecMealInputKor.TUE,
            SpecMealInputKor.WED,
            SpecMealInputKor.THR,
            SpecMealInputKor.FRI,
            SpecMealInputKor.SAT,
        ],
        [
            SpecMealInputEng.SUN,
            SpecMealInputEng.MON,
            SpecMealInputEng.TUE,
            SpecMealInputEng.WED,
            SpecMealInputEng.THR,
            SpecMealInputEng.FRI,
            SpecMealInputEng.SAT,
        ]
    ]
    private readonly specInputTypeDate: Array<Array<string>> = [
        [
            ...Array.from({length: 31}, (v,i)=>`${i + 1}${SpecMealInputKor.DAY}`)
        ],
        [
            `${1}${SpecMealInputEng.DAY_1}`,
            `${2}${SpecMealInputEng.DAY_2}`,
            `${3}${SpecMealInputEng.DAY_3}`,
            ...Array.from({length: 28}, (v,i)=>`${i + 4}${SpecMealInputEng.DAY_OTHER}`)
        ]
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

    createMealImage() {

    }

    getBldg1Image() {

    }

    getBldg2Image() {

    }

    getDateMeal(mobileDateMealReqDto: MobileDateMealReqDto) {

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

    private getSpecNextMealTime(langType:number, dateCustom: string): Date {
        let krCurrent = this.getNowKRTime();

        const indexLang = this.specInputTypeLang[langType].indexOf(dateCustom);
        if(indexLang !== -1)
            return new Date(krCurrent.getTime() + indexLang * this.oneDayDiff); 

        const indexDay = this.specInputTypeDay[langType].indexOf(dateCustom);
        const currentDay = krCurrent.getDay();
        const dayDiff = (indexDay - currentDay + 7) % 7;
        // always show feture diet
        if(indexDay !== -1)
            return new Date(krCurrent.getTime() + dayDiff * this.oneDayDiff);

        const indexDate = this.specInputTypeDate[langType].indexOf(dateCustom);
        const y = krCurrent.getFullYear();
        const m = krCurrent.getMonth();
        const d = indexDate + 1;
        
        if(indexDate !== -1) {
            if(!this.isValid(y, m, d)) 
                throw new BadRequestException(ErrorMessage.NO_EXIST_DATE_ERROR);
            return new Date(new Date(y, m, d));
        }
        
        throw new BadRequestException(`${ErrorMessage.INVALID_SPEC_INPUT_ERROR} (Unfiltered Input: ${dateCustom})`);
    }

    private daysInMonth(y: number, m: number): number { // m is 0 indexed: 0-11
        switch (m) {
            case 1 :
                return (y % 4 == 0 && y % 100) || y % 400 == 0 ? 29 : 28;
            case 8 : case 3 : case 5 : case 10 :
                return 30;
            default :
                return 31
        }
    }
    
    private isValid(y: number, m: number, d: number): boolean {
        return m >= 0 && m < 12 && d > 0 && d <= this.daysInMonth(m, y);
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
