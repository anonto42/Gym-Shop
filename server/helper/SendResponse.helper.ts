import {IResponse} from "@/server/interface/Response.interface";
import {IUser} from "@/server/models/user/user.interfce";

export default ( props: Partial<IResponse>): IResponse => ({
    status: props.status? props.status : 200,
    message: props.message? props.message : "You request was processed successfully!",
    isError: props.isError? true : false,
})

// Type guard function
export function isErrorResponse(response: IUser | IResponse): response is IResponse {
    return 'isError' in response && response.isError === true;
}

export function isSuccessResponse(response: IUser | IResponse): response is IUser {
    return !isErrorResponse(response) && 'id' in response;
}