import { IResponse } from "@/server/interface/response.interface";

export const handleServerError = (error: unknown): IResponse => {
    console.error("Server Error:", error);

    if (error instanceof Error) {
        return {
            isError: true,
            status: 500,
            message: error.message || "Internal server error",
        };
    }

    return {
        isError: true,
        status: 500,
        message: "Internal server error",
    };
};