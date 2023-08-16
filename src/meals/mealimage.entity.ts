import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MealImage extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    langType: number;

    @Column()
    bldgType: number;

    @Column()
    name: string;

    @Column()
    ext: string;

    @Column()
    cache: number;

    getIamgeUrl() {
        return `${this.name}.${this.cache}.${this.ext}`;
    }
}