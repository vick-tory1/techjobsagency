import { cookies } from "next/headers";
import type { Role, User } from "./types";

export async function getSessionUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("techhire-session")?.value;
  return session ? (JSON.parse(session) as User) : null;
}

export async function requireRole(roles: Role[]) {
  const user = await getSessionUser();
  if (!user || !roles.some((role) => user.roles.includes(role))) return null;
  return user;
}
