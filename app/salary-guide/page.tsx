import PublicChrome from "../../components/marketplace/PublicChrome";
import InfoPage from "../../components/marketplace/InfoPage";
import { salaryContent } from "../../lib/info-pages";
import { getSessionUser } from "../../lib/session";

export default async function SalaryGuidePage() {
  const user = await getSessionUser();
  return <PublicChrome user={user}><InfoPage content={salaryContent()} /></PublicChrome>;
}
