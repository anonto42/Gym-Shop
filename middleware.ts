import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {getCookie} from "@/server/helper/jwt.helper";
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

    if (!isAuthenticated && protectedRoutes.includes(path)) {
        const loginUrl = new URL('/auth/signin', request.url);
        return NextResponse.redirect(loginUrl);
    }

    if(!isAuthenticated) return;

    const user = JSON.parse(isAuthenticated) as IUser;

    if (user.role != USER_ROLE.ADMIN && protectedRoutesForAdmins.includes(path)) {
        const returnUrl = new URL('/', request.url);
        return NextResponse.redirect(returnUrl);
    }

    return NextResponse.next();
}