"use server";

import {UserModel} from "@/server/models/user/user.model";
import {IUser} from "@/server/models/user/user.interfce";
import {ISignUpInput} from "@/server/interface/auth.interface";
import {IResponse} from "@/server/interface/response.interface";
import {SendResponse} from "@/server/helper/sendResponse.helper";
import {sendEmail} from "@/server/helper/emailSender.helper";
import {GenerateCreateAccountHtml} from "@/enum/htmlCreate.helper";
import {generateOTP} from "@/server/helper/generateOtp.helper";

export async function signUpServerSide ( body: ISignUpInput ): Promise<IUser | IResponse> {

    const name = body.get("name") as string;
    const email = body.get("email") as string;
    const password = body.get("password") as string;

    if ( await UserModel.exists({ email })) return SendResponse({ isError: true, status: 409, message: "You email was already exist!" })

    // Create html
    const html = GenerateCreateAccountHtml( generateOTP(6) );

    // Send Otp for users
    await sendEmail({ to:email, html, subject:`Verify you ${process.env.COMPANY_NAME} account`});

    return await UserModel.create({name, email, password});
}