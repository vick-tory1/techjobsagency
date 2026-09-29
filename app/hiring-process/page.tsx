import PublicChrome from "../../components/marketplace/PublicChrome";
import InfoPage from "../../components/marketplace/InfoPage";
import { hiringGuideContent } from "../../lib/info-pages";
import { getSessionUser } from "../../lib/session";

export default async function HiringProcessPage() {
  const user = await getSessionUser();
  return <PublicChrome user={user}><InfoPage content={hiringGuideContent()} /></PublicChrome>;
}
