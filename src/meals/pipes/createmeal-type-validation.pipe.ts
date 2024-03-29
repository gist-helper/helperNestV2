import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { ErrorMessage, Types } from "../enum/meal-related.enum";


export class TypeValidationPipe implements PipeTransform {
    readonly BldgTypeOptions = [
        Types.BLDG1_1ST,
        Types.BLDG1_2ND,
        Types.BLDG2_1ST,
    ]

    readonly LangTypeOptions = [
        Types.LANG_KOR,
        Types.LANG_ENG,
    ]
    
    readonly DateTypeOptions = [
        Types.DATE_MON,
        Types.DATE_TUE,
        Types.DATE_WED,
        Types.DATE_THR,
        Types.DATE_FRI,
        Types.DATE_SAT,
        Types.DATE_SUN, 
    ]

    readonly KindTypeoptions = [
        Types.KIND_BREAKFAST,
        Types.KIND_LUNCH,
        Types.KIND_DINNER,
        Types.KIND_LUNCH_CORNER,
        Types.KIND_LUNCH_BLDG1_2,
        Types.KIND_BREAKFAST_CORNER
    ]

    transform(value: any, metadata: ArgumentMetadata) {
        if(!this.isBldgTypeValid(value.bldgType)) {
            throw new BadRequestException(ErrorMessage.INVALID_BLDG_ERROR);
        }

        if(!this.isLangTypeValid(value.langType)) {
            throw new BadRequestException(ErrorMessage.INVALID_LANG_ERROR);
        }

        if(!this.isDateTypeValid(value.dateType)) {
            throw new BadRequestException(ErrorMessage.INVALID_DATE_ERROR);
        }

        if(!this.isKindTypeValid(value.kindType)) {
            throw new BadRequestException(ErrorMessage.INVALID_KIND_ERROR);
        }
        return value;
    }

    private isBldgTypeValid(bldgType: any): boolean {
        const index = this.BldgTypeOptions.indexOf(bldgType);
        return index !== -1;
    }

    private isLangTypeValid(langType: any): boolean {
        const index = this.LangTypeOptions.indexOf(langType);
        return index !== -1;
    }

    private isDateTypeValid(dateType: any): boolean {
        const index = this.DateTypeOptions.indexOf(dateType);
        return index !== -1;
    }

    private isKindTypeValid(kindType: any): boolean {
        const index = this.KindTypeoptions.indexOf(kindType);
        return index !== -1;
    }
}