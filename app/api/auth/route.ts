import { NextRequest, NextResponse } from "next/server";
import { createId, store } from "../../../lib/store";
import type { Role, User } from "../../../lib/types";

function dashboardForRoles(roles: Role[]) {
  if (roles.includes("admin")) return "/admin";
  if (roles.length > 1) return "/dashboard";
  if (roles.includes("employer")) return "/employer";
  if (roles.includes("talent")) return "/talent";
  if (roles.includes("student")) return "/student";
  return "/community";
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const users = await store.users();
  let user = users.find((item) => item.email.toLowerCase() === payload.email.toLowerCase());
  if (!user) {
    user = {
      id: createId("user"),
      name: payload.name,
      email: payload.email,
      profilePicture: payload.profilePicture,
      roles: payload.roles?.length ? payload.roles : [payload.role ?? "talent"],
      provider: "password",
    } satisfies User;
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
