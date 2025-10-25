"use server";

import {UserModel} from "@/server/models/user/user.model";
import {IUser} from "@/server/models/user/user.interfce";
import {ISignInInput, ISignUpInput} from "@/server/interface/auth.interface";
import {IResponse} from "@/server/interface/response.interface";
import {SendResponse} from "@/server/helper/sendResponse.helper";
import {sendEmail} from "@/server/helper/emailSender.helper";
import {GenerateCreateAccountHtml} from "@/enum/htmlCreate.helper";
import {generateOTP} from "@/server/helper/generateOtp.helper";
import connectToDB from "@/server/db";
import {handleServerError} from "@/server/helper/ErrorHandler";
import {ServerError} from "@/server/interface/serverError.interface";
import { sign } from 'jsonwebtoken';

await connectToDB();

export async function signUpServerSide ( body: ISignUpInput ): Promise<IUser | IResponse> {
    try {
        const name = body.get("name") as string;
        const email = body.get("email") as string;
        const password = body.get("password") as string;

        if ( await UserModel.exists({ email })) return SendResponse({ isError: true, status: 409, message: "You email was already exist!" })

        // Create OTP
        const otp = generateOTP(6);

        // Create html
        const html = GenerateCreateAccountHtml( otp );

        // Send Otp for users
        await sendEmail({ to:email, html, subject:`Verify you ${process.env.COMPANY_NAME} account`});

        const newUser = await UserModel.create({name, email, password, otp});

        return  newUser;
    } catch (error : ServerError ) {
        return handleServerError(error);
    }
}

export async function signInServerSide ( body: ISignInInput ): Promise<string | IResponse > {
    try {
        const email = body.get("email") as string;
        const password = body.get("password") as string;

        const user  = await UserModel.findUserByEmail(email);
        if ( !user ) return SendResponse({ isError: true, status: 404, message: "Email was not exist!" });

        const response: boolean | { isError: boolean, status: number, message: string } = await UserModel.isPasswordMac(email,password);
        if( typeof response != "boolean" && response.isError == true ){
            return SendResponse({
                isError: response.isError,
                status: response.status,
                message: response.message
            });
        }

        return sign({
            email,
            id: user._id,
            role: user.role
        }, process.env.JWT_EXPIRY as string);

    } catch (error : ServerError ) {
        return handleServerError(error);
    }
}