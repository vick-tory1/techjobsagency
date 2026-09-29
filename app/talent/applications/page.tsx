import MarketplaceShell, { PageHeader } from "../../../components/marketplace/MarketplaceShell";
import { CTASection, GuideGrid, ProcessGrid, VisualBand, careerGuides } from "../../../components/marketplace/ResourceSections";
import { getSessionUser } from "../../../lib/session";
import { store } from "../../../lib/store";
import Link from "next/link";

export default async function TalentApplicationsPage() {
  const [user, applications, jobs] = await Promise.all([getSessionUser(), store.applications(), store.jobs()]);
  const rows = applications.filter((item) => user && item.applicantId === user.id);
  return (
    <MarketplaceShell user={user}>
      <PageHeader eyebrow="Applications" title="Track applications">Keep your active job search organized, prepare for interviews early, and stay clear on where each opportunity stands.</PageHeader>
      <VisualBand
        eyebrow="Career pipeline"
        title="Treat each application as a focused opportunity"
        body="A strong application is not just a submitted form. It is a clear match between your skills, portfolio evidence, role constraints, and the next conversation you want to earn."
        image="/assets/customer-success-call.jpg"
        imageAlt="Job seeker preparing for an application follow-up call"
        points={[`${rows.length} application${rows.length === 1 ? "" : "s"} currently in your tracker.`, "Review the role again before interviews or follow-ups.", "Keep project evidence ready for the stack named in the job.", "Use your profile as the shared source of professional context."]}
      />
      <GuideGrid eyebrow="Application guidance" title="Use each application as a focused career move" intro="Track your submitted roles, keep your profile aligned with the jobs you want, and prepare evidence before interviews." items={careerGuides} />
      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-8 md:grid-cols-3 lg:px-8">
        {[{ title: "Check fit before applying", body: "Compare the role's skills, salary, location, and work mode with what you can actually commit to." }, { title: "Prepare evidence", body: "Keep links to relevant projects, repositories, case studies, and examples ready for each role." }, { title: "Follow up with context", body: "When a status changes, review the job again and prepare questions that show you understand the work." }].map((item) => <article key={item.title} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-black">{item.title}</h2><p className="mt-2 text-sm leading-6 text-gray-600">{item.body}</p></article>)}
      </section>
      <ProcessGrid eyebrow="Next-step preparation" title="Stay ready after you apply" intro="Application status can change quickly. Prepare practical examples before the employer asks for them." steps={[{ title: "Revisit the brief", body: "Read the job details again and note the skills, responsibilities, work mode, and salary context." }, { title: "Match your evidence", body: "Choose two or three projects or experiences that directly support the role requirements." }, { title: "Prepare questions", body: "Ask about the team, technical environment, delivery expectations, and interview process." }]} />
      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-12 lg:px-8">
        {rows.length ? rows.map((application) => {
          const job = jobs.find((item) => item.id === application.jobId);
          return <article key={application.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"><h2 className="text-xl font-black">{job?.title ?? application.jobId}</h2><p className="text-gray-600">{application.coverLetter}</p><p className="mt-3 font-bold">Status: {application.status}</p></article>;
        }) : <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-gray-600"><h2 className="text-xl font-black text-gray-900">No applications yet</h2><p className="mt-2">Browse open roles, update your profile, and apply only when the work, salary, location, and availability expectations make sense for you.</p><Link href="/jobs" className="mt-4 inline-block rounded-lg bg-green-600 px-5 py-3 font-bold text-white">Browse jobs</Link></div>}
      </section>
      <CTASection title="Keep your search moving" body="Refresh your profile before applying to the next role, then prepare evidence for each opportunity you choose." primary={{ label: "Update profile", href: "/talent/profile" }} secondary={{ label: "Browse jobs", href: "/jobs" }} />
    </MarketplaceShell>
  );
}
