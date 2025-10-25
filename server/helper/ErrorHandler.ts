import {IResponse} from "@/server/interface/response.interface";
import {SendResponse} from "@/server/helper/sendResponse.helper";
import {ServerError} from "@/server/interface/serverError.interface";
import mongoose from "mongoose";

export function handleServerError(error: ServerError): IResponse {
    console.error("Server error:", error);

    if (error instanceof mongoose.Error.ValidationError) {
        return SendResponse({
            isError: true,
            status: 400,
            message: "Validation failed",
            data: error.errors
        });
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (error.code === 11000) {
        return SendResponse({
            isError: true,
            status: 409,
            message: "Duplicate entry found"
        });
    }

    return SendResponse({
        isError: true,
        status: 500,
        message: "Internal server error"
    });
}
