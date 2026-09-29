import { requirePageRole } from "../../lib/api-auth";

export default async function EmployerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requirePageRole(["employer"]);
  return children;
}
