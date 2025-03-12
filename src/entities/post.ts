//Blog posts

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class Post{

    @PrimaryGeneratedColumn()
    id!:number;

    @Column()
    title!:string;

    @Column()
    content!:string;

    @Column()
    createdAt!:Date

    @Column({nullable:true})
    modifiedAt!:Date;

    @ManyToOne(()=>User)
    @JoinColumn({name:'userId',referencedColumnName:'id'})
    user!:User;
}