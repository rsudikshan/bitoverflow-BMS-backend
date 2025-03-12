import express from "express";
import { Request,Response } from "express";
import {AdminRegisterController, LoginController,RegisterController} from "./src/controllers/authController";
import AppDataSource from "./src/dataSource";
import { error } from "console";
import "dotenv/config";
import {JwtFilterBasedOnRole,JwtFilterBasedOnPermission} from "./src/middlewares/jwtFilter";
import { Roles } from "./src/enums/roles";
import { ApiRoutes } from "./src/enums/route";
import { Permissions } from "./src/enums/permissions";
import { BlogController, BlogControllerProtected } from "./src/controllers/blogController";

const server = express();
const port = process.env.PORT;

const login = LoginController;
const register = RegisterController;
const adminRegister = AdminRegisterController;

//unprotected
const blogController = BlogController;

//protected
const blogControllerProtected = BlogControllerProtected;

//db
const appDataSource = AppDataSource;

const jwtFilter = JwtFilterBasedOnRole; //for strict role check
const jwtFilterBasedOnPermission = JwtFilterBasedOnPermission; //to allow admin to access user routes based on permissions



appDataSource.initialize()
.then(
    ()=>{
        server.get("/testAdmin",jwtFilterBasedOnPermission(Permissions.ADMIN_CREATE),(req,res)=>{
            res.send("ok admin");
        });
        server.get("/testUser",jwtFilter(Roles.USER),(req,res)=>{
            res.send("ok user");
        });
        server.use(express.json());
        server.use("/",login);
        server.use("/",register);
        server.use("/",adminRegister);

        //unprotected routes
        console.log(ApiRoutes.GET_BLOGS);
        console.log(ApiRoutes.GET_PERSONAL_BLOG_WITH_ID);
        server.use("/",blogController);

        //protected routes
        console.log(ApiRoutes.CREATE_BLOG);
        server.use("/",jwtFilterBasedOnPermission(Permissions.CLIENT_CREATE),blogControllerProtected);

        server.listen(process.env.PORT,()=>{
        console.log("server is running on port");
        })
    }
)
.catch(
    (error)=>{
        console.log(error);
    }
);