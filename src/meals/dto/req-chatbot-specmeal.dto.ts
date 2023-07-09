import { IsNotEmpty } from "class-validator"

export interface Params {
    dateCustom: string;
    bld: string;
}
export class SpecMealReqDto {
    @IsNotEmpty()
    params: Params
}