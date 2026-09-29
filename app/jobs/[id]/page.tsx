import MarketplaceShell, { PageHeader } from "../../../components/marketplace/MarketplaceShell";
import { ApplyButton } from "../../../components/marketplace/ApplicationActions";
import { CTASection, ProcessGrid, VisualBand } from "../../../components/marketplace/ResourceSections";
import { getSessionUser } from "../../../lib/session";
import { store } from "../../../lib/store";

const processSteps = [
  "Review the role details, skills, salary, location, work mode, and deadline before applying.",
  "Use your Flowpilot profile and cover note to explain why your experience matches the role.",
  "The hiring team reviews the application, updates its status, and follows up when the role moves forward.",
];

const roleGuidance = [
  { title: "Who this role may suit", body: "Use the listed level, employment type, and required skills to decide whether the role fits your current experience and next career step." },
  { title: "How to prepare", body: "Refresh portfolio projects, code samples, case studies, or work examples that connect directly to the skills named in this job." },
  { title: "How to evaluate fit", body: "Compare the salary, work mode, location, and expectations with what you can commit to before starting the application." },
];

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [user, jobs] = await Promise.all([getSessionUser(), store.jobs()]);
  const job = jobs.find((item) => item.id === id);
  const relatedJobs = job ? jobs.filter((item) => item.id !== job.id && item.status === "open" && item.skills.some((skill) => job.skills.includes(skill))).slice(0, 3) : [];
  if (!job) return <MarketplaceShell user={user}><PageHeader title="Job not found" /></MarketplaceShell>;
  return (
    <MarketplaceShell user={user}>
      <PageHeader eyebrow={job.company} title={job.title}>
        {job.description}
      </PageHeader>
      <VisualBand
        eyebrow="Role evaluation"
        title="Decide whether this opportunity fits your next move"
        body="A good application starts before the cover note. Compare the role's work, stack, compensation, location, and seniority with the evidence you can confidently show."
        image="/assets/developer-workstation.jpg"
        imageAlt="Job seeker reviewing a technical role before applying"
        points={[`Work mode: ${job.workplaceType ?? (job.remote ? "Remote" : "On-site")}`, `Experience level: ${job.experienceLevel}`, `Employment type: ${job.employmentType}`, `Salary or budget: ${job.salary}`]}
      />
      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-12 lg:grid-cols-[1fr_360px] lg:px-8">
        <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">About this role</h2>
          <p className="mt-4 leading-7 text-gray-700">{job.description}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <p><b>Location:</b> {job.location}</p><p><b>Workplace:</b> {job.workplaceType ?? (job.remote ? "Remote" : "On-site")}</p>
            <p><b>Experience:</b> {job.experienceLevel}</p><p><b>Type:</b> {job.employmentType}</p>
            <p><b>Salary/budget:</b> {job.salary}</p><p><b>Status:</b> {job.status}</p>
            {job.applicationDeadline && <p><b>Application deadline:</b> {job.applicationDeadline}</p>}
          </div>
          <h3 className="mt-8 text-lg font-black">Required skills and technologies</h3>
          <div className="mt-3 flex flex-wrap gap-2">{job.skills.map((skill) => <span key={skill} className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-800">{skill}</span>)}</div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {roleGuidance.map((item) => <section key={item.title} className="rounded-lg border border-gray-200 bg-gray-50 p-4"><h3 className="font-black text-gray-900">{item.title}</h3><p className="mt-2 text-sm leading-6 text-gray-600">{item.body}</p></section>)}
          </div>
          <h3 className="mt-8 text-lg font-black">Application process</h3>
          <ol className="mt-3 space-y-3 text-gray-700">
            {processSteps.map((step, index) => <li key={step} className="rounded-lg border border-gray-200 p-4"><b>Step {index + 1}:</b> {step}</li>)}
          </ol>
          <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-5">
            <h3 className="font-black text-green-900">Before you apply</h3>
            <p className="mt-2 leading-7 text-green-900">Make your profile specific. Mention the skills from this job, link to relevant work, and keep the cover note focused on evidence rather than broad claims.</p>
          </div>
        </article>
        <aside className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">Apply to this job</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">Apply when the location, salary, work mode, and core responsibilities match what you can realistically commit to.</p>
          <div className="mt-6"><ApplyButton jobId={job.id} employerId={job.employerId} /></div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">Related open roles</h2>
            <div className="mt-4 grid gap-3">
              {relatedJobs.length ? relatedJobs.map((item) => <a key={item.id} href={`/jobs/${item.id}`} className="rounded-lg border border-gray-200 p-3 font-bold hover:border-green-300">{item.title}</a>) : <p className="text-sm text-gray-600">No related open roles are available right now.</p>}
            </div>
          </div>
        </aside>
      </section>
      <ProcessGrid eyebrow="Application plan" title="Apply with relevant evidence" intro="Use the job brief to choose the examples that make your fit easiest for the employer to evaluate." steps={[{ title: "Match the core skills", body: `Prioritize examples connected to ${job.skills.slice(0, 3).join(", ") || "the required stack"}.` }, { title: "Explain your role", body: "Make it clear what you personally built, improved, reviewed, or delivered." }, { title: "Confirm constraints", body: "Only apply if the location, salary, work mode, and timeline are realistic for you." }]} />
      <CTASection title="Want to compare similar opportunities?" body="Browse current open roles and keep your profile ready before sending another application." primary={{ label: "Browse jobs", href: "/jobs" }} secondary={{ label: "Update profile", href: "/talent/profile" }} />
    </MarketplaceShell>
  );
}
