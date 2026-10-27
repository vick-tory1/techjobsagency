import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const authSecret = process.env.AUTH_SECRET ?? "flowpilot-local-development-secret-change-before-production";
const protectedRoutes = ["/dashboard", "/admin", "/employer", "/talent/profile", "/talent/applications", "/student"];

function usesSecureAuthCookies(request: NextRequest) {
  // Auth.js uses AUTH_URL/NEXTAUTH_URL when configured, or the incoming URL
  // otherwise, to choose both the session cookie name and its JWT salt.
  const authUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;
  return authUrl ? new URL(authUrl).protocol === "https:" : request.nextUrl.protocol === "https:";
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin/login")) return NextResponse.next();

  const route = protectedRoutes.find((prefix) => request.nextUrl.pathname.startsWith(prefix));
  if (!route) return NextResponse.next();

  let token = null;
  try {
    token = await getToken({
      req: request,
      secret: authSecret,
      secureCookie: usesSecureAuthCookies(request),
    });
  } catch {
    // A token encrypted with a previous secret is not a valid session.
    token = null;
  }
  if (!token || typeof token.exp !== "number" || token.exp * 1000 <= Date.now()) {
    const loginPath = request.nextUrl.pathname.startsWith("/admin") ? "/admin/login" : "/login";
    return NextResponse.redirect(new URL(`${loginPath}?callbackUrl=${encodeURIComponent(request.nextUrl.pathname)}`, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/employer/:path*", "/talent/profile/:path*", "/talent/applications/:path*", "/student/:path*"],
};
