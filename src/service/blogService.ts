import { ResponseBuilder } from "../builders/responseBuilder";
import AppDataSource from "../dataSource";
import { Post } from "../entities/post";
import { User } from "../entities/user";
import { NewBlogPostDto } from "../models/request/newBlogPostDto";
import { UpdateBlogDto } from "../models/request/updateBlogDto";
import { BlogResponseDto } from "../models/response/blogModel";
import { ResponseModel } from "../models/response/responseModel";

export class BlogService{
    manager = AppDataSource.manager;
    userRepo = this.manager.getRepository(User);
    blogRepo = this.manager.getRepository(Post);

    async createBlog(dto:NewBlogPostDto,userId:number):Promise<ResponseModel>{
        const newPost = new Post();  
        Object.assign(newPost,dto);
        newPost.createdAt = new Date();
        const userFromJwtId = await this.userRepo.findOneBy({id:userId});
        if(userFromJwtId!=null){
            newPost.user = userFromJwtId;
            await this.manager.save(newPost);
            return ResponseBuilder.success("blog created",userFromJwtId.username);
        }
        return ResponseBuilder.failure("couldnt create");      
    }

    async getAllBlogs():Promise<ResponseModel>{
        const blogs = await this.manager.find(Post,{relations:['user']});
        //const response = await blogs.map(this.dtoConverterHelper); context loss just like java but no option to use Class.this.method
        const response = await Promise.all(blogs.map(blog => this.dtoConverterHelper(blog,false)));
        return ResponseBuilder.success("All blogs",response);        
    }

    //protected and can be accessed with jwt only , good for editing
    async getBlogsById(reqUserId:number):Promise<ResponseModel>{
        const blogs = await this.blogRepo.find(
            {
                where:{user:{
                    id:reqUserId
                }},
                relations:['user']
            }
        );
        const response = await Promise.all(blogs.map(blog=>this.dtoConverterHelper(blog,true)));
        return ResponseBuilder.success("Your personal blogs",response);
    }

    async updateBlog(dto:UpdateBlogDto,userId:number):Promise<ResponseModel>{
        //blog id - user id
        //check if the user id from jwt is same as the blogs user id 
        const blog = await this.blogRepo.findOneBy({id:dto.id});
        const blogUserId = blog?.user.id;
        if(blogUserId != userId){
            return ResponseBuilder.failure("Not your blog");
            
        }
        if(dto.title == null && dto.content!=null){
            await this.blogRepo.update({id:dto.id},{content:dto.content});
            return ResponseBuilder.success("Blog updated",dto.id);
        }
        if(dto.content == null && dto.title!=null){
            await this.blogRepo.update({id:dto.id},{content:dto.content});
            return ResponseBuilder.success("Blog updated",dto.id);
        }
        await this.blogRepo.update({id:dto.id},{title:dto.title,content:dto.content});
        return ResponseBuilder.success("Blog updated",dto.id);

    }

    async deleteBlog(userId:number,dto:UpdateBlogDto):Promise<ResponseModel>{
        const blog = await this.blogRepo.findOneBy({id:dto.id});
        if(blog == null){
            return ResponseBuilder.failure("No such blog");
        }
        const blogUserId = blog.user.id;
        if(blogUserId != userId){
            return ResponseBuilder.failure("Not your blog");
            
        }
        await this.blogRepo.delete({id:dto.id});
        return ResponseBuilder.success("blog deleted",dto.id);
    }

    async adminDelete(dto:UpdateBlogDto):Promise<ResponseModel>{
        const blog = await this.blogRepo.findOneBy({id:dto.id});

        if(blog == null){
            return ResponseBuilder.failure("no such blog");
        }
        this.blogRepo.delete({id:dto.id});
        return ResponseBuilder.success("successfully deleted",dto.id);
    }



    async dtoConverterHelper(blog:Post,withId:boolean):Promise<BlogResponseDto>{
        const responseDto = new BlogResponseDto();

        //responseDto.createdBy = await this.getUsername(blog.user.id);
        //this is not needed we can directly refer since the relation fetches all of entity
        responseDto.createdBy = blog.user.username;
        responseDto.createdAt = blog.createdAt;
        responseDto.lastModified = blog.modifiedAt;
        responseDto.title = blog.title;
        responseDto.content = blog.content;

        if(withId){
            responseDto.id = blog.id;
        }

        return responseDto;
    }


    //just for note
    // async getUsername(id: number): Promise<string> {
    //     const user = await this.userRepo.findOneBy({ id });
    //     return user?.username ?? "Unknown";
    // }
    
}