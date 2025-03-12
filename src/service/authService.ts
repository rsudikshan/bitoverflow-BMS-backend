import { ResponseBuilder } from "../builders/responseBuilder";
import AppDataSource from "../dataSource";
import { User } from "../entities/user";
import { Roles } from "../enums/roles";
import { LoginDto } from "../models/request/loginDto";
import { RegisterDto } from "../models/request/registerDto";
import { ResponseModel } from "../models/response/responseModel";
import * as bcrypt from 'bcrypt';

import "dotenv/config";

export class AuthService{
    private jwt = require("jsonwebtoken");
    private manager = AppDataSource.manager; 
    private jwtSecret = process.env.JWT_SECRET;
    private jwtExpiry = process.env.JWT_EXPIRY;

    async register(dto:RegisterDto):Promise<ResponseModel>{
        const emailExists = await this.manager.existsBy(User,{email:dto.email});
        const usernameExists = await this.manager.existsBy(User,{email:dto.username});

        if(emailExists || usernameExists){
            return ResponseBuilder.failure("blog creator already exists");
        }

        const hashedPasssword = await bcrypt.hash(dto.password,12);
        const user = new User();
        Object.assign(user,dto);
        user.password = hashedPasssword;

        await this.manager.save(user);
        return ResponseBuilder.success("register successful",dto.username);
    }

    async login(dto:LoginDto):Promise<ResponseModel>{
        const user = await this.manager.findOneBy(User,{username:dto.username});
        let token;

        if(user!=null && await bcrypt.compare(dto.password,user.password)){
            if (!this.jwtSecret) {
                throw new Error("jwtSecret is not defined in environment variables");
            }
            token = this.jwt.sign(
                {
                    id:user.id,
                    username:user.username,
                    email:user.email,
                    role:user.role
                },
                this.jwtSecret as string,
                { expiresIn:this.jwtExpiry|| '1h'}
            );
            if(user.role == Roles.ADMIN){
                return ResponseBuilder.success("Welcome Admin",token);
            }
            return ResponseBuilder.success("login successful",token);
        }
        return ResponseBuilder.failure("login failed");
    }


    async adminRegister(dto:RegisterDto):Promise<ResponseModel>{
        const emailExists = await this.manager.existsBy(User,{email:dto.email});
        const usernameExists = await this.manager.existsBy(User,{email:dto.username});

        if(emailExists || usernameExists){
            return ResponseBuilder.failure("admin already exists");
        }

        const hashedPasssword = await bcrypt.hash(dto.password,12);
        const user = new User();
        Object.assign(user,dto);
        user.password = hashedPasssword;
        user.role = Roles.ADMIN;

        await this.manager.save(user);
        return ResponseBuilder.success("register successful",dto.username);
    }

}