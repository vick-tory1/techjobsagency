import dynamic from "next/dynamic";
import PublicChrome from "../../components/marketplace/PublicChrome";
import { getSessionUser } from "../../lib/session";
import { store } from "../../lib/store";

const PublicStories = dynamic(() => import("../../components/marketplace/PublicStories"), {
  loading: () => (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm font-semibold text-gray-600 shadow-sm">
        Loading career and hiring stories...
      </div>
    </section>
  ),
});

export default async function StoriesPage() {
  const [user, jobs, talent, users] = await Promise.all([getSessionUser(), store.jobs(), store.talent(), store.users()]);
  return (
    <PublicChrome user={user}>
      <PublicStories jobs={jobs} talent={talent} users={users} />
    </PublicChrome>
  );
}
