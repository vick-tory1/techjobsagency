import { NextRequest, NextResponse } from "next/server";
import { createId, store } from "../../../../lib/store";
import type { Role, User } from "../../../../lib/types";

type GooglePayload = {
  sub: string;
  name: string;
  email: string;
  picture?: string;
};

function decodeJwtPayload(credential: string): GooglePayload {
  const payload = credential.split(".")[1];
  return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as GooglePayload;
}

function dashboardForRoles(roles: Role[]) {
  if (roles.includes("admin")) return "/admin";
  if (roles.length > 1) return "/dashboard";
  if (roles.includes("employer")) return "/employer";
  if (roles.includes("talent")) return "/talent";
  if (roles.includes("student")) return "/student";
  return "/community";
}

export async function POST(request: NextRequest) {
  const { credential, role } = await request.json();
  if (!credential) return NextResponse.json({ error: "Missing Google credential" }, { status: 400 });

  const googleUser = decodeJwtPayload(credential);
  const users = await store.users();
  let user = users.find((item) => item.email.toLowerCase() === googleUser.email.toLowerCase());

  if (!user) {
    user = {
      id: createId("user"),
      googleId: googleUser.sub,
      name: googleUser.name,
      email: googleUser.email,
      profilePicture: googleUser.picture,
      roles: [role ?? "talent"],
      provider: "google",
    };
    await store.saveUsers([user, ...users]);
  }

  const response = NextResponse.json({ user, redirectTo: dashboardForRoles(user.roles) });
  response.cookies.set("techhire-session", JSON.stringify(user), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
