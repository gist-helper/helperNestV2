import { CustomRepository } from "src/db/typeorm-ex.decorator";
import { MealImage } from "./mealimage.entity";
import { Repository } from "typeorm";
import { CreateMealDto } from "./dto/req-create-meal.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { ErrorMessage } from "./enum/meal-related.enum";


@CustomRepository(MealImage)
export class MealImageRepository extends Repository<MealImage> {
    async createImage(fileName: string): Promise<MealImage> {
        const mealimage = this.create({
            bldgType: 0,
            bldg: "1",
            name: fileName,
            ext: 'jpg',
            cache: 10,
        })
        await this.save(mealimage);
        return mealimage;
    }
}