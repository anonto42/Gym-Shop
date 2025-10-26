"use server";

import {JwtPayload, sign, verify} from "jsonwebtoken";
import {StringValue} from "ms";
import { cookies } from 'next/headers';

export async function setCookie({name = "GYM_Shop", value, maxAge = 12000 }: {name?: string, value: string, maxAge?: number}): Promise<void>{
    const cookieStore = await cookies();
    cookieStore.set(name, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge,
        path: '/',
        sameSite: 'lax'
    });
}

export async function getCookie(name: string = "GYM_Shop"): Promise<string | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(name)?.value;
    return token || null;
}

export async function verifyCookie(token: string ): Promise<JwtPayload & {email: string} | string> {
    return await verify(token,process.env.JWT_SECRET!) as JwtPayload & {email: string} | string;
}

export async function signToken({ email, id, role}:{email: string, id: string, role: string}): Promise<string> {
    return sign({
        email,
        id,
        role
    }, process.env.JWT_SECRET as string,{ expiresIn: process.env.JWT_EXPIRY as StringValue });
}