import { CustomRepository } from "src/db/typeorm-ex.decorator";
import { MealImage } from "./mealimage.entity";
import { Repository } from "typeorm";
import { CreateMealDto } from "./dto/req-create-meal.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { ErrorMessage } from "./enum/meal-related.enum";


@CustomRepository(MealImage)
export class MealImageRepository extends Repository<MealImage> {
    async createImage(fileName: string): Promise<MealImage> {
        const bldgMeta = fileName.split('.')[0];
        const bldgType = parseInt(bldgMeta.split('_')[0], 10);
        const langType = parseInt(bldgMeta.split('_')[1], 10);
        const ext = fileName.split('.')[1];
        
        const mealimage = this.create({
            langType: langType,
            bldgType: bldgType,
            name: fileName,
            ext: ext,
            cache: 20,
        })
        await this.save(mealimage);
        return mealimage;
    }
}