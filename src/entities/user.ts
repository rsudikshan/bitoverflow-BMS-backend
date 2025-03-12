import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "../enums/roles";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id!:number;

    @Column()
    email!:string;

    @Column()
    username!:string;

    @Column()
    password!:string;

    @Column({
        type:"enum",
        enum:Roles,
        default:Roles.USER,
    })
    role!:Roles;

}