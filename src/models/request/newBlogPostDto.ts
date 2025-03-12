import { IsNotEmpty } from "class-validator";

export class NewBlogPostDto{

    @IsNotEmpty()
    title!:string;

    @IsNotEmpty()
    content!:string;
}