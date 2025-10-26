"use server";

import {UserModel} from "@/server/models/user/user.model";
import {IUser} from "@/server/models/user/user.interfce";
import {
    IChangePasswordInput,
    IForgotPasswordInput,
    ISetPasswordInput,
    ISignInInput,
    ISignUpInput,
    IVerifyOtpInput
} from "@/server/interface/auth.interface";
import {IResponse} from "@/server/interface/response.interface";
import {SendResponse} from "@/server/helper/sendResponse.helper";
import {sendEmail} from "@/server/helper/emailSender.helper";
import {GenerateCreateAccountHtml} from "@/server/helper/htmlCreate.helper";
import {generateOTP} from "@/server/helper/generateOtp.helper";
import connectToDB from "@/server/db";
import {handleServerError} from "@/server/helper/ErrorHandler";
import {ServerError} from "@/server/interface/serverError.interface";
import {JwtPayload} from 'jsonwebtoken';
import {getCookie, signToken, verifyCookie} from "@/server/helper/jwt.helper";
import {USER_STATUS} from "@/enum/user.enum";
import {hash} from "crypto";

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

        const user: IUser  = await UserModel.findUserByEmail(email);
        if ( !user ) return SendResponse({ isError: true, status: 404, message: "Email was not exist!" });
        if ( !user.isVerified ) return SendResponse({ isError: true, status: 401, message: "Your mail was not verified!" });
        if ( user.status == USER_STATUS.BLOCKED || user.status == USER_STATUS.DELETED ) return SendResponse({ isError: true, status: 423, message: `Your mail was ${user.status}!` });

        const response: boolean | { isError: boolean, status: number, message: string } = await UserModel.isPasswordMac(email,password);
        if( typeof response != "boolean" && response.isError == true ){
            return SendResponse({
                isError: response.isError,
                status: response.status,
                message: response.message
            });
        }

        return signToken({
            email,
            id: user._id as string,
            role: user.role
        });

    } catch (error : ServerError ) {
        return handleServerError(error);
    }
}

export async function isAuthenticated(): Promise<boolean | JwtPayload> {

    const token = getCookie();
    if (typeof token !== "string" && !token) return false;

    const payload = verifyCookie(token);
    if (typeof payload !== "string" ) return payload;

    return false;
}

export async function forgotPasswordServerSide ( body: IForgotPasswordInput ): Promise<IResponse> {
    try {
        const email = body.get("email") as string;

        const user: IUser  = await UserModel.findUserByEmail(email);
        if ( !user ) return SendResponse({ isError: true, status: 404, message: "Email was not exist!" });
        if ( !user.isVerified ) return SendResponse({ isError: true, status: 401, message: "Your mail was not verified!" });
        if ( user.status == USER_STATUS.BLOCKED || user.status == USER_STATUS.DELETED ) return SendResponse({ isError: true, status: 423, message: `Your mail was ${user.status}!` });

        // Create OTP
        const otp = generateOTP(6);

        // Create html
        const html = GenerateCreateAccountHtml( otp );

        // Send Otp for users
        await sendEmail({ to:email, html, subject:`Forgot Password OTP`});

        const response = await UserModel.findUserByEmailAndUpdate(email,{ otp: otp.toString() });
        if( !response ){
            return SendResponse({
                isError: true,
                status: 404,
                message: "User not found!"
            });
        }

        return SendResponse({
            isError: false,
            status: 200,
            message: "Forgot Password OTP Send Successfully!"
        });

    } catch (error : ServerError ) {
        return handleServerError(error);
    }
}

export async function verifyOtpServerSide ( body: IVerifyOtpInput ): Promise<IResponse> {
    try {
        const email = body.get("email") as string;

        const user: IUser  = await UserModel.findUserByEmail(email);
        if ( !user ) return SendResponse({ isError: true, status: 404, message: "Email was not exist!" });
        if ( !user.isVerified ) return SendResponse({ isError: true, status: 401, message: "Your mail was not verified!" });
        if ( user.status == USER_STATUS.BLOCKED || user.status == USER_STATUS.DELETED ) return SendResponse({ isError: true, status: 423, message: `Your mail was ${user.status}!` });

        if ( user.otp?.toString() != body.otp.toString() ) return SendResponse({ isError: true, status: 422, message: "You given the wrong otp" });

        // Create token
        const token = generateOTP(6);
        // Hash Number
        const hashValue = hash("aboriginal", token.toString());

        const response = await UserModel.findUserByEmailAndUpdate(email,{ hashToken: hashValue });
        if( !response ){
            return SendResponse({
                isError: true,
                status: 404,
                message: "User not found!"
            });
        }

        return SendResponse({
            isError: false,
            status: 200,
            message: "OTP Successfully Verified",
            data: { token: hashValue }
        });

    } catch (error : ServerError ) {
        return handleServerError(error);
    }
}

export async function setPasswordServerSide ( body: ISetPasswordInput ): Promise<IResponse> {
    try {
        const email = body.get("email") as string;

        const user: IUser  = await UserModel.findUserByEmail(email);
        if ( !user ) return SendResponse({ isError: true, status: 404, message: "Email was not exist!" });
        if ( !user.isVerified ) return SendResponse({ isError: true, status: 401, message: "Your mail was not verified!" });
        if ( user.status == USER_STATUS.BLOCKED || user.status == USER_STATUS.DELETED ) return SendResponse({ isError: true, status: 423, message: `Your mail was ${user.status}!` });

        if ( user.hashToken?.toString() !== body.token.toString() ) return SendResponse({ isError: true, status: 403, message: "Attempt to bypass security!" });

        const response = await UserModel.findUserByEmailAndUpdate(email,{ password: body.password });
        if( !response ){
            return SendResponse({
                isError: true,
                status: 404,
                message: "User not found!"
            });
        }

        return SendResponse({
            isError: false,
            status: 200,
            message: "Successfully Changed Password!"
        });

    } catch (error : ServerError ) {
        return handleServerError(error);
    }
}

export async function changePasswordServerSide ( body: IChangePasswordInput ): Promise<IResponse> {
    try {
        const payload = verifyCookie(body.userToken) as JwtPayload;

        const user: IUser  = await UserModel.findUserByEmail(payload.email);
        if ( !user ) return SendResponse({ isError: true, status: 404, message: "Email was not exist!" });
        if ( !user.isVerified ) return SendResponse({ isError: true, status: 401, message: "Your mail was not verified!" });
        if ( user.status == USER_STATUS.BLOCKED || user.status == USER_STATUS.DELETED ) return SendResponse({ isError: true, status: 423, message: `Your mail was ${user.status}!` });

        const response = await UserModel.findUserByEmailAndUpdate(payload.email,{ password: body.password });
        if( !response ){
            return SendResponse({
                isError: true,
                status: 404,
                message: "User not found!"
            });
        }

        return SendResponse({
            isError: false,
            status: 200,
            message: "Successfully Changed Password!"
        });

    } catch (error : ServerError ) {
        return handleServerError(error);
    }
}
