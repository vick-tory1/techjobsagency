import { requirePageRole } from "../../../lib/api-auth";

export default async function TalentApplicationsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requirePageRole(["talent"]);
  return children;
}
