import { IsNotEmpty } from "class-validator"

export class CreateMealDto {
    @IsNotEmpty()
    bldgType: number;

    @IsNotEmpty()
    langType: number;

    @IsNotEmpty()
    dateType: number;

    @IsNotEmpty()
    kindType: number;

    @IsNotEmpty()
    bldg: string;

    @IsNotEmpty()
    date: string;

    @IsNotEmpty()
    kind: string;

    @IsNotEmpty()
    menu: string;

    @IsNotEmpty()
    special: string;
}