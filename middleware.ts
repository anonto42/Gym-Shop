import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {getCookie, verifyCookie} from "@/server/helper/jwt.helper";
import {IUser} from "@/server/models/user/user.interfce";
import {USER_ROLE} from "@/enum/user.enum";

export async function middleware(request: NextRequest) {
    // Define your protected routes
    const protectedRoutesForAdmins = ['/dashboard'];
    const protectedRoutes = ['/profile'];

    const path = request.nextUrl.pathname;

    // Skip middleware for internal Next.js paths (e.g., _next)
    if (path.startsWith('/_next')) {
        return NextResponse.next();
    }

    const isAuthenticated = await getCookie("user");

    if (!isAuthenticated) return console.log("Unauthenticated user");

    const isUser = await verifyCookie(isAuthenticated!);

    if (typeof isUser !== "string" && protectedRoutes.includes(path)) {
        const loginUrl = new URL('/auth/signin', request.url);
        return NextResponse.redirect(loginUrl);
    }

    const user = JSON.parse(isUser as string) as IUser;

    if (user.role != USER_ROLE.ADMIN && protectedRoutesForAdmins.includes(path)) {
        const returnUrl = new URL('/', request.url);
        return NextResponse.redirect(returnUrl);
    }

    return NextResponse.next();
}