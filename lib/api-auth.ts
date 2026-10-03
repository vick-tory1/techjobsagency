import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import { auth } from "../auth";
import { store } from "./store";
import type { Role } from "./types";

export async function getPersistedSessionUser() {
  let session: Session | null = null;
  try {
    session = await auth();
  } catch {
    // A cookie created with an older AUTH_SECRET is equivalent to no session.
    return null;
  }
  const expiresAt = session?.expires ? Date.parse(session.expires) : Number.NaN;
  if (!session?.user?.id || !session.user.email || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) return null;

  const users = await store.users();
  return users.find((user) => user.id === session.user.id && user.email.toLowerCase() === session.user.email.toLowerCase()) ?? null;
}

export async function requireUser() {
  const user = await getPersistedSessionUser();
  if (!user) return { response: NextResponse.json({ error: "Authentication required." }, { status: 401 }) };
  return { user };
}

export async function requireRole(roles: Role[]) {
  const result = await requireUser();
  if ("response" in result) return result;
  if (!roles.some((role) => result.user.roles.includes(role))) {
    return { response: NextResponse.json({ error: "You do not have permission to perform this action." }, { status: 403 }) };
  }
  return result;
}

export function isAdmin(user: { roles: Role[] }) {
  return user.roles.includes("admin");
}

export const requirePersistedUser = requireUser;

export async function requirePageUser(signInPath = "/login") {
  const user = await getPersistedSessionUser();
  if (!user) redirect(signInPath);
  return user;
}

export async function requirePageRole(roles: Role[], signInPath = "/login") {
  const user = await requirePageUser(signInPath);
  if (!roles.some((role) => user.roles.includes(role))) {
    const { dashboardForRoles } = await import("./auth-utils");
    redirect(dashboardForRoles(user.roles));
  }
  return user;
}
