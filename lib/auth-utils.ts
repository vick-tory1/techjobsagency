import type { Role } from "./types";

export const assignableRoles: Role[] = ["talent", "employer"];

export function isAssignableRole(value: unknown): value is Role {
  return typeof value === "string" && assignableRoles.includes(value as Role);
}

export function dashboardForRoles(roles: Role[]) {
  if (roles.includes("admin")) return "/admin";
  if (roles.length > 1) return "/dashboard";
  if (roles.includes("employer")) return "/employer";
  if (roles.includes("talent")) return "/talent";
  if (roles.includes("student")) return "/student";
  return "/community";
}
