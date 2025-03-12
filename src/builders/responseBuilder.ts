import { ResponseModel } from "../models/response/responseModel";

export class ResponseBuilder{
    static success(message: string, object: any):ResponseModel{
        const response:ResponseModel = new ResponseModel();
        response.message = message;
        response.object = object;
        response.status = "success";
        return response;
    }

    static successObjectOnly(data:any):ResponseModel{
        const response:ResponseModel = new ResponseModel();
        response.object = data;
        response.status = "success";
        return response;
    }

    static failure(message:string):ResponseModel{
        const response = new ResponseModel();
        response.message = message;
        response.status = "failure"
        return response;
    }
}