import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/dashboard", "/admin", "/employer", "/talent/profile", "/talent/applications", "/student"];

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin/login")) return NextResponse.next();

  const route = protectedRoutes.find((prefix) => request.nextUrl.pathname.startsWith(prefix));
  if (!route) return NextResponse.next();

  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET || "flowpilot-local-development-secret-change-before-production" });
  if (!token || typeof token.exp !== "number" || token.exp * 1000 <= Date.now()) {
    const loginPath = request.nextUrl.pathname.startsWith("/admin") ? "/admin/login" : "/login";
    return NextResponse.redirect(new URL(`${loginPath}?callbackUrl=${encodeURIComponent(request.nextUrl.pathname)}`, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/employer/:path*", "/talent/profile/:path*", "/talent/applications/:path*", "/student/:path*"],
};
