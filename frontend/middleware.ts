/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Define Path Categories
  const isAdminPath = pathname.startsWith("/admin");

  // FIXED: Added '/admin/setup' to the allowed auth paths so you don't get redirected!
  const isAuthPath =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/admin/login") ||
    pathname === "/admin/setup";

  // 2. Bypass middleware for static assets and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.includes("/api/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 3. AUTH LOGIC: No Token
  if (!token) {
    // If trying to access protected dashboard/admin routes without token
    if (!isAuthPath && pathname !== "/") {
      // Redirect to login, but preserve the destination for post-login redirect if needed
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // 4. AUTH LOGIC: Has Token
  if (token && isAuthPath) {
    // Already logged in? Don't show login/register/setup pages, send to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Apply to all routes except specific exclusions
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
