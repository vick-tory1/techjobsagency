import PublicChrome from "../../components/marketplace/PublicChrome";
import InfoPage from "../../components/marketplace/InfoPage";
import { remoteContent } from "../../lib/info-pages";
import { getSessionUser } from "../../lib/session";
import { store } from "../../lib/store";

export default async function RemoteWorkPage() {
  const [user, jobs] = await Promise.all([getSessionUser(), store.jobs()]);
  return <PublicChrome user={user}><InfoPage content={remoteContent(jobs)} /></PublicChrome>;
}
