import PublicChrome from "../../components/marketplace/PublicChrome";
import InfoPage from "../../components/marketplace/InfoPage";
import { screeningContent } from "../../lib/info-pages";
import { getSessionUser } from "../../lib/session";

export default async function CandidateScreeningPage() {
  const user = await getSessionUser();
  return <PublicChrome user={user}><InfoPage content={screeningContent()} /></PublicChrome>;
}
