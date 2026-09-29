import PublicChrome from "../../components/marketplace/PublicChrome";
import InfoPage from "../../components/marketplace/InfoPage";
import { portfolioContent } from "../../lib/info-pages";
import { getSessionUser } from "../../lib/session";

export default async function PortfolioPage() {
  const user = await getSessionUser();
  return <PublicChrome user={user}><InfoPage content={portfolioContent()} /></PublicChrome>;
}
