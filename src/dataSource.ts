import { DataSource } from "typeorm";
import { User } from "./entities/user";
import { Post } from "./entities/post";

const AppDataSource = new DataSource({
    type:"postgres",
    username:"postgres",
    password:"melkor8811",
    database:"bit-overflow-BMS",
    host:"localhost",
    port:5432,
    entities:[User,Post],
    migrations:["src/migrations/**/*.ts"],
    synchronize:true
});

export default AppDataSource;