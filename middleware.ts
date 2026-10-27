
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const authSecret =
  process.env.AUTH_SECRET ??
  "flowpilot-local-development-secret-change-before-production";

const protectedRoutes = [
  "/dashboard",
  "/admin",
  "/employer",
  "/talent/profile",
  "/talent/applications",
  "/student",
];

function usesSecureAuthCookies(request: NextRequest) {
  const authUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;

  return authUrl
    ? new URL(authUrl).protocol === "https:"
    : request.nextUrl.protocol === "https:";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/login/")
  ) {
    return NextResponse.next();
  }

  const isProtected = protectedRoutes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!isProtected) return NextResponse.next();

  let token = null;

  try {
    token = await getToken({
      req: request,
      secret: authSecret,
      secureCookie: usesSecureAuthCookies(request),
    });
  } catch {
    token = null;
  }

  if (
    !token ||
    typeof token.exp !== "number" ||
    token.exp * 1000 <= Date.now()
  ) {
    const loginPath = pathname.startsWith("/admin")
      ? "/admin/login"
      : "/login";

    const url = new URL(loginPath, request.url);
    url.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/employer/:path*",
    "/talent/profile/:path*",
    "/talent/applications/:path*",
    "/student/:path*",
  ],
};
