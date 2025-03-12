import { plainToInstance } from "class-transformer";
import express from "express";
import { LoginDto } from "../models/request/loginDto";
import { validate } from "class-validator";
import { ApiRoutes } from "../enums/route";
import { RegisterDto } from "../models/request/registerDto";
import { AuthService } from "../service/authService";
import { ResponseBuilder } from "../builders/responseBuilder";


const LoginController = express.Router();
const RegisterController = express.Router();
const AdminRegisterController = express.Router();


const authService = new AuthService();

LoginController.post(ApiRoutes.LOGIN,async (req,res)=>{
   const dto:LoginDto = plainToInstance(LoginDto,req.body);
   const error = await validate(dto);
   if(error.length>0){
    console.log(error);
   }
   
   res.send(await authService.login(dto));
   
});

RegisterController.post(ApiRoutes.REGISTER, async (req,res)=>{
    const dto:RegisterDto = plainToInstance(RegisterDto,req.body);
    const error = await validate(dto);
    if(error.length>0){
      res.send(error);
    }
    res.send(await authService.register(dto));
});

AdminRegisterController.post(ApiRoutes.ADMIN_REGISTER, async (req,res)=>{
  
  const dto:RegisterDto = plainToInstance(RegisterDto,req.body);
  const error = await validate(dto);
  if(error.length>0){
    res.send(error);
  }
  res.send(await authService.adminRegister(dto));
});

export {LoginController,RegisterController,AdminRegisterController};