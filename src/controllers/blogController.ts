import { plainToInstance } from "class-transformer";
import express from "express";
import { NewBlogPostDto } from "../models/request/newBlogPostDto";
import { ApiRoutes } from "../enums/route";
import { BlogService } from "../service/blogService";
import { AuthRequest } from "../interface/authRequest";
import { UpdateBlogDto } from "../models/request/updateBlogDto";
import { Roles } from "../enums/roles";
import { ResponseBuilder } from "../builders/responseBuilder";

const BlogControllerProtected = express.Router();
const BlogController = express.Router();

const blogService = new BlogService();

BlogController.get(ApiRoutes.GET_BLOGS,async (req,res)=>{
    res.send(await blogService.getAllBlogs());
});



//protected
//get personal blogs
BlogControllerProtected.get(ApiRoutes.GET_PERSONAL_BLOG_WITH_ID,async (req:AuthRequest,res)=>{
    console.log("hitting");
    res.send(await blogService.getBlogsById(req.user.id));
});

//create blog
BlogControllerProtected.post(ApiRoutes.CREATE_BLOG,async (req:AuthRequest,res)=>{
    const createBlogDto = plainToInstance(NewBlogPostDto,req.body);
    const id = req.user.id;
    res.send(await blogService.createBlog(createBlogDto,id));
});

//update blog
BlogControllerProtected.post(ApiRoutes.UPDATE_BLOG, async (req:AuthRequest,res)=>{
    const updateBlogDto = plainToInstance(UpdateBlogDto,req.body);
    const id = req.user.id;
    res.send(await blogService.updateBlog(updateBlogDto,id));
});

//delete blog
BlogController.post(ApiRoutes.DELETE_BLOG, async (req:AuthRequest,res)=>{
    const deleteDto = plainToInstance(UpdateBlogDto,req.body);
    const id = req.user.id;
    res.send(await blogService.deleteBlog(id,deleteDto));
});

//admin
BlogController.post(ApiRoutes.ADMIN_DELETE,async (req:AuthRequest,res)=>{
    const user = req.user;
    const deleteDto = plainToInstance(UpdateBlogDto,req.body);
    if(user!=null){
        if(user.role==Roles.ADMIN){
            res.send(await blogService.adminDelete(deleteDto));
        }
        ResponseBuilder.failure("unauthorized");
    }
    ResponseBuilder.failure("invalid operation");
});

export {BlogControllerProtected,BlogController};