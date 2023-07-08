import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@Index(["bldgType", "langType", "dateType", "kindType", "date"], { unique: true })
export class Meal extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    bldgType: number;

    @Column()
    langType: number;

    @Column()
    dateType: number;

    @Column()
    kindType: number;

    @Column()
    bldg: string;

    @Column()
    date: string;

    @Column()
    kind: string;

    @Column()
    menu: string;

    @Column()
    special: string;
}