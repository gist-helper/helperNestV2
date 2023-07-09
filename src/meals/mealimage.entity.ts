import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class MealImage extends BaseEntity {
    @PrimaryColumn()
    bldgType: number;

    @Column()
    bldg: string;

    @Column()
    name: string;

    @Column()
    ext: string;

    @Column()
    cache: number;

    getIamgeName() {
        return `${this.name}.${this.cache}.${this.ext}`;
    }
}