import PublicChrome from "../components/marketplace/PublicChrome";
import PublicHome from "../components/marketplace/PublicHome";
import { getSessionUser } from "../lib/session";
import { store } from "../lib/store";

export default async function HomePage() {
  const [user, talent, users, jobs] = await Promise.all([getSessionUser(), store.talent(), store.users(), store.jobs()]);
  return (
    <PublicChrome user={user}>
      <PublicHome talent={talent} users={users} jobs={jobs} />
    </PublicChrome>
  );
}
