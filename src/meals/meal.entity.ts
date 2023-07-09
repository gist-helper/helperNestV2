import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { Types } from "./enum/meal-related.enum";

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

    getMenuStr(): string {
        var menuStr = "";
        menuStr += this.bldg + "\n\n";
        menuStr += this.menu
        if(this.special.length != 0) {
            if(this.langType === Types.LANG_KOR) {
                menuStr += "\n\\코너\\\n";
                menuStr += this.special;
            }
            else if(this.langType === Types.LANG_KOR) {
                menuStr += "\n\\Coner\\\n";
                menuStr += this.special;
            }
        }
        return menuStr;
    }
}