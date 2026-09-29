import PublicChrome from "../../components/marketplace/PublicChrome";
import InfoPage from "../../components/marketplace/InfoPage";
import { careerRoadmapContent } from "../../lib/info-pages";
import { getSessionUser } from "../../lib/session";
import { store } from "../../lib/store";

export default async function CareerRoadmapPage() {
  const [user, jobs, talent] = await Promise.all([getSessionUser(), store.jobs(), store.talent()]);
  return <PublicChrome user={user}><InfoPage content={careerRoadmapContent(jobs, talent)} /></PublicChrome>;
}
