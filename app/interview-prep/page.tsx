import PublicChrome from "../../components/marketplace/PublicChrome";
import InfoPage from "../../components/marketplace/InfoPage";
import { interviewContent } from "../../lib/info-pages";
import { getSessionUser } from "../../lib/session";

export default async function InterviewPrepPage() {
  const user = await getSessionUser();
  return <PublicChrome user={user}><InfoPage content={interviewContent()} /></PublicChrome>;
}
