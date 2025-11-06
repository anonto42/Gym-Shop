"use server";

import { connectToDB } from "@/server/db";
import { UserModel } from "../models/user/user.model";
import { USER_ROLE } from "@/enum/user.enum";
import { SendResponse } from "../helper/sendResponse.helper";
import { ServerError } from "../interface/serverError.interface";
import { handleServerError } from "../helper/ErrorHandler";

let isAdminCreated = false;

export async function createAdminServerSide(){
    if(isAdminCreated) return SendResponse({ isError: true, status: 409, message: "Admin already exists!" });
    try {
        await connectToDB();

        const isAdminExist = await UserModel.exists({ role: USER_ROLE.ADMIN });
        if(isAdminExist) return SendResponse({ isError: true, status: 409, message: "Admin already exists!" });

        await UserModel.create({
            name: "Admin",
            email: "admin@admin.com",
            password: "admin123",
            isVerified: true,
            role: USER_ROLE.ADMIN
        });

        isAdminCreated = true;

        return SendResponse({ isError: false, status: 200, message: "Admin created successfully!" });

    } catch (error: ServerError) {
        return handleServerError(error);
    }
}