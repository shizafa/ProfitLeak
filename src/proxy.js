import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = request.cookies.has("sb-access-token");

  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if ((pathname === "/login" || pathname === "/signup") && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard/overview", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
