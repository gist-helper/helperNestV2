import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { ErrorMessage, SpecMealInputEng, SpecMealInputKor } from "../enum/meal-related.enum";

export class SpecmealKorParamsValidationPipe implements PipeTransform {
    readonly dateCustomKorOptions = [
        SpecMealInputKor.TODAY,
        SpecMealInputKor.TOMORROW,
        SpecMealInputKor.MON,
        SpecMealInputKor.TUE,
        SpecMealInputKor.WED,
        SpecMealInputKor.THR,
        SpecMealInputKor.FRI,
        SpecMealInputKor.SAT,
        SpecMealInputKor.SUN,
        ...Array.from({length: 31}, (v,i)=>`${i + 1}${SpecMealInputKor.DAY}`)
    ]

    readonly bldKorOptions = [
        SpecMealInputKor.BREAKFAST,
        SpecMealInputKor.LUNCH,
        SpecMealInputKor.DINNER
    ]

    transform(value: any, metadata: ArgumentMetadata) {
        console.log(value.params)
        console.log(value.params.dateCustom)
        console.log(value.params.bld)
        const dateCustom = value.params.dateCustom
        const bld = value.params.bld
        console.log(dateCustom, bld)
        if(!this.isDateCustomValid(dateCustom)) {
            throw new BadRequestException(`${ErrorMessage.INVALID_SPEC_INPUT_ERROR} (Invalid dateCustom Input: ${dateCustom})`);
        }

        if(!this.isLangTypeValid(bld)) {
            throw new BadRequestException(`${ErrorMessage.INVALID_SPEC_INPUT_ERROR} (Invalid bld Input: ${bld})`);
        }

        return value;
    }

    private isDateCustomValid(dateCustom: any): boolean {
        console.log()
        const index = this.dateCustomKorOptions.indexOf(dateCustom);
        return index !== -1;
    }

    private isLangTypeValid(bld: any): boolean {
        const index = this.bldKorOptions.indexOf(bld);
        return index !== -1;
    }
    
}

export class SpecmealEngParamsValidationPipe implements PipeTransform {
    readonly dateCustomKorOptions = [
        SpecMealInputEng.TODAY,
        SpecMealInputEng.TOMORROW,
        SpecMealInputEng.MON,
        SpecMealInputEng.TUE,
        SpecMealInputEng.WED,
        SpecMealInputEng.THR,
        SpecMealInputEng.FRI,
        SpecMealInputEng.SAT,
        SpecMealInputEng.SUN,
        `${1}${SpecMealInputEng.DAY_1}`,
        `${2}${SpecMealInputEng.DAY_2}`,
        `${3}${SpecMealInputEng.DAY_3}`,
        ...Array.from({length: 28}, (v,i)=>`${i + 4}${SpecMealInputEng.DAY_OTHER}`)
    ]

    readonly bldKorOptions = [
        SpecMealInputEng.BREAKFAST,
        SpecMealInputEng.LUNCH,
        SpecMealInputEng.DINNER
    ]

    transform(value: any, metadata: ArgumentMetadata) {
        const dateCustom = value.params.dateCustom
        const bld = value.params.bld
        if(!this.isDateCustomValid(dateCustom)) {
            throw new BadRequestException(`${ErrorMessage.INVALID_SPEC_INPUT_ERROR} (Invalid dateCustom Input: ${dateCustom})`);
        }

        if(!this.isLangTypeValid(bld)) {
            throw new BadRequestException(`${ErrorMessage.INVALID_SPEC_INPUT_ERROR} (Invalid bld Input: ${bld})`);
        }
        
        return value;
    }

    private isDateCustomValid(dateCustom: any): boolean {
        const index = this.dateCustomKorOptions.indexOf(dateCustom);
        return index !== -1;
    }

    private isLangTypeValid(bld: any): boolean {
        const index = this.bldKorOptions.indexOf(bld);
        return index !== -1;
    }
    
}