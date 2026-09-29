import PublicChrome from "../../components/marketplace/PublicChrome";
import InfoPage from "../../components/marketplace/InfoPage";
import { cloudContent } from "../../lib/info-pages";
import { getSessionUser } from "../../lib/session";
import { store } from "../../lib/store";

export default async function CloudDevOpsPage() {
  const [user, jobs, talent] = await Promise.all([getSessionUser(), store.jobs(), store.talent()]);
  return <PublicChrome user={user}><InfoPage content={cloudContent(jobs, talent)} /></PublicChrome>;
}
