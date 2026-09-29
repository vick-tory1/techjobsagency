import type { Role, User } from "./types";
import { getPersistedSessionUser } from "./api-auth";

export async function getSessionUser() {
  return getPersistedSessionUser();
}

export async function requireRole(roles: Role[]) {
  const user = await getSessionUser();
  if (!user || !roles.some((role) => user.roles.includes(role))) return null;
  return user;
}
