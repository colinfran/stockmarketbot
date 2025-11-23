import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

const proxy = async (request: NextRequest): Promise<NextResponse> => {
  const sessionCookie = getSessionCookie(request)
  const isOnHome = request.nextUrl.pathname === "/"
  const isOnDashboard = request.nextUrl.pathname.startsWith("/dashboard")

  // User is signed in → keep them out of login/home page
  if (sessionCookie && isOnHome) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // User is NOT signed in → keep them out of dashboard
  if (!sessionCookie && isOnDashboard) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export default proxy

export const config = {
  matcher: ["/", "/dashboard"], // Specify the routes the proxy applies to
}
