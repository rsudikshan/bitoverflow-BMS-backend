export class BlogResponseDto{
    createdBy!:string;
    title!:string;
    content!:string;
    createdAt!:Date;
    lastModified!:Date;
    id?:number;
}