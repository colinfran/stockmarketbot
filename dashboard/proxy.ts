import { NextRequest, NextResponse } from "next/server";
import { getCookieCache, getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
		const session = getSessionCookie(request);


    // THIS IS NOT SECURE!
    // This is the recommended approach to optimistically redirect users
    // We recommend handling auth checks in each page/route
		const isOnHome = request.nextUrl.pathname === "/";
		const isOnDashboard = request.nextUrl.pathname.startsWith("/dashboard");

		// User is signed in → keep them out of login/home page
		if (session && isOnHome) {
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}

		// User is NOT signed in → keep them out of dashboard
		if (!session && isOnDashboard) {
			return NextResponse.redirect(new URL("/", request.url));
		}

	return NextResponse.next();
}

export const config = {
	matcher: ["/", "/dashboard"], // Specify the routes the middleware applies to
};