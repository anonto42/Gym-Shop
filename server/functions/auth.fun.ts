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
import {handleServerError} from "@/server/helper/ErrorHandler";
import {JwtPayload} from 'jsonwebtoken';
import {getCookie, signToken, verifyCookie} from "@/server/helper/jwt.helper";
import {USER_STATUS} from "@/enum/user.enum";
import {connectToDB} from "@/server/db";
import {hashData} from "@/server/helper/crypt";

export async function signUpServerSide ( body: ISignUpInput ): Promise<IUser | IResponse> {
    try {
        await connectToDB();

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
    } catch (error) {
        return handleServerError(error);
    }
}

export async function signInServerSide ( body: ISignInInput ): Promise<string | IResponse > {
    try {
        await connectToDB();

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

    } catch (error ) {
        return handleServerError(error);
    }
}

export async function forgotPasswordServerSide ( body: IForgotPasswordInput ): Promise<IResponse> {
    try {
        await connectToDB();

        const email = body.get("email") as string;

        const user: IUser  = await UserModel.findUserByEmail(email);
        if ( !user ) return SendResponse({ isError: true, status: 404, message: "Email was not exist!" });
        // if ( !user.isVerified ) return SendResponse({ isError: true, status: 401, message: "Your mail was not verified!" });
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

    } catch (error ) {
        return handleServerError(error);
    }
}

export async function verifyOtpServerSide ( body: IVerifyOtpInput ): Promise<IResponse> {
    try {
        await connectToDB();

        const email = body.get("email") as string;
        const otp = body.get("otp") as string;

        const user: IUser  = await UserModel.findUserByEmail(email);
        if ( !user ) return SendResponse({ isError: true, status: 404, message: "Email was not exist!" });
        // if ( !user.isVerified ) return SendResponse({ isError: true, status: 401, message: "Your mail was not verified!" });
        if ( user.status == USER_STATUS.BLOCKED || user.status == USER_STATUS.DELETED ) return SendResponse({ isError: true, status: 423, message: `Your mail was ${user.status}!` });
        if ( user.otp?.toString() != otp ) return SendResponse({ isError: true, status: 422, message: "You given the wrong otp" });

        // Create token
        const token = generateOTP(6 );
        // Hash Number
        const hashValue = await hashData( token.toString());

        const response = await UserModel.findUserByEmailAndUpdate(email,{ hashToken: hashValue, isVerified: true });
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

    } catch (error ) {
        return handleServerError(error);
    }
}

export async function setPasswordServerSide ( body: ISetPasswordInput ): Promise<IResponse> {
    try {
        await connectToDB();

        const email = body.get("email") as string;
        const token = body.get("token") as string;
        const password = body.get("password") as string;

        const user: IUser  = await UserModel.findUserByEmail(email);
        if ( !user ) return SendResponse({ isError: true, status: 404, message: "Email was not exist!" });
        if ( !user.isVerified ) return SendResponse({ isError: true, status: 401, message: "Your mail was not verified!" });
        if ( user.status == USER_STATUS.BLOCKED || user.status == USER_STATUS.DELETED ) return SendResponse({ isError: true, status: 423, message: `Your mail was ${user.status}!` });

        if ( user.hashToken?.toString() !== token ) return SendResponse({ isError: true, status: 403, message: "Attempt to bypass security!" });

        const response = await UserModel.findUserByEmailAndUpdate(email,{ password, otp: "", hashToken: "" });
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

    } catch (error ) {
        return handleServerError(error);
    }
}

export async function changePasswordServerSide ( body: IChangePasswordInput ): Promise<IResponse> {
    try {
        await connectToDB();

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

    } catch (error ) {
        return handleServerError(error);
    }
}

export async function isAuthenticatedAndGetUser (): Promise<string | IResponse> {

    await connectToDB();

    const token = await getCookie();
    if (token == null) return SendResponse({ isError: true, status: 404, message: "Token is missing!" });

    const payload: string | JwtPayload & { email: string } = await verifyCookie(token);
    if (typeof payload == "string" ) return SendResponse({ isError: true, status: 404, message: "Token was not verified!" });

    const user = await UserModel.findUserByEmail(payload.email);
    if ( !user ) return SendResponse({isError: true, status: 404, message: "User not found!" });

    return JSON.stringify(user);
}