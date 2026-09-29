import { requirePageRole } from "../../../lib/api-auth";

export default async function TalentProfileLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requirePageRole(["talent"]);
  return children;
}
