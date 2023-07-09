import { IsNotEmpty } from "class-validator"

export class MobileDateMealReqDto {
    @IsNotEmpty()
    year: number;

    @IsNotEmpty()
    month: number;

    @IsNotEmpty()
    day: number;

    @IsNotEmpty()
    bldgType: number;

    @IsNotEmpty()
    langType: number;
}