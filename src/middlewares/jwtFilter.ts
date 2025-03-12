import { Request,Response,NextFunction } from "express";
import { ResponseBuilder } from "../builders/responseBuilder";
import { AuthRequest } from "../interface/authRequest";
import { Roles } from "../enums/roles";
import { Permissions } from "../enums/permissions";
import { RolePermissionMap } from "../const/rolesPermissionMap";

const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;

//direct role check
const JwtFilterBasedOnRole = (role:Roles)=>{
    return (req:AuthRequest,res:Response,next:NextFunction)=>{
        console.log(role);
        const authHeader = req.header("Authorization");
        //const token = req.headers.authorization;
        if( authHeader == null || !authHeader.startsWith("Bearer ")){
            res.status(401).send(ResponseBuilder.failure("invalid jwt"));
            return;
        }
        const token = authHeader?.split(" ")[1];
        try{
            const decoded = jwt.verify(token,secretKey);
            console.log(decoded);

            if(decoded.role!=role){
                res.status(403).send(ResponseBuilder.failure("Forbidden"));
                return;
            }

            req.user = decoded;

            if(decoded.role == role){
                next();
                return;
            }    
                            
        }catch(error){
            res.status(401).send(ResponseBuilder.failure("invalid jwt"));
            return;
        }
    }
    
} 

const JwtFilterBasedOnPermission = (permission:Permissions)=>{
    return (req:AuthRequest,res:Response,next:NextFunction)=>{

        const authHeader = req.header("Authorization");
        if( authHeader == null || !authHeader.startsWith("Bearer ")){
            res.send(ResponseBuilder.failure("missing header or invalid token"));
        }

        const token = authHeader?.split(" ")[1]; //
        try{
            const decoded = jwt.verify(token,secretKey);
            if(Object.values(Permissions).includes(permission)){
                const role:Roles = decoded.role;
                const userPermissions = RolePermissionMap[role] || [];
                if(userPermissions.includes(permission)){
                    req.user = decoded;
                    next();
                }
            }
        }
        catch(error){
            ResponseBuilder.failure("error parsing token");
        }

    }
}

export {JwtFilterBasedOnRole,JwtFilterBasedOnPermission};