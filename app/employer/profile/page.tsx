import Image from "next/image";
import MarketplaceShell, { PageHeader } from "../../../components/marketplace/MarketplaceShell";
import { CTASection, GuideGrid, ProcessGrid, VisualBand, hiringGuides } from "../../../components/marketplace/ResourceSections";
import { getSessionUser } from "../../../lib/session";

export default async function EmployerProfilePage() {
  const user = await getSessionUser();
  return (
    <MarketplaceShell user={user}>
      <PageHeader eyebrow="Employer profile" title="Show job seekers what working with your team is like"><p>Give people enough context to make an informed choice: the work, the team, the technical environment, the hiring process, and the evidence your reviewers value.</p></PageHeader>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <Image src="/assets/enterprise-client-meeting.jpg" alt="Employer team discussing hiring context with stakeholders" width={900} height={560} priority sizes="(min-width: 1024px) 45vw, 100vw" className="h-full max-h-[420px] w-full rounded-lg object-cover shadow-xl" />
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase text-green-700">Job seeker confidence</p>
          <h2 className="mt-2 text-3xl font-black">Context helps serious job seekers decide faster</h2>
          <p className="mt-4 leading-7 text-gray-600">Every role needs accurate team context, location constraints, interview expectations, and technology information. Serious job seekers move faster when the basics are clear.</p>
        </div>
      </section>
      <GuideGrid eyebrow="Employer profile" title="Help job seekers understand the hiring context" intro="A useful employer profile explains what the team hires for, where work happens, and how job seekers evaluate fit." items={hiringGuides} />
      <VisualBand
        eyebrow="Employer brand"
        title="Give technical talent a reason to engage"
        body="Experienced job seekers look for more than a title. They want to understand the team, the technical environment, the problems worth solving, and how the hiring process will respect their time."
        image="/assets/client-delivery-review.jpg"
        imageAlt="Employer and delivery team reviewing hiring progress"
        points={["Describe the product or client environment behind each role.", "Explain collaboration style, tooling, and interview steps.", "Keep promises measurable and avoid generic culture claims.", "Make each job post specific enough for job seekers to assess fit before applying."]}
      />
      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-8 md:grid-cols-3 lg:px-8">{[{ title: "Team context", body: "Use job posts to explain the product area, team structure, stack, and operating style job seekers will join." }, { title: "Hiring process", body: "Name the evidence your team reviews and the interview steps connected to the role." }, { title: "Verification", body: "Private job seeker details require verified employer access and an authorized hiring relationship." }].map((item) => <article key={item.title} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-black">{item.title}</h2><p className="mt-2 text-sm leading-6 text-gray-600">{item.body}</p></article>)}</section>
      <section className="mx-auto max-w-7xl px-4 pb-8 lg:px-8">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase text-green-700">Recommended employer content</p>
          <h2 className="mt-2 text-2xl font-black">Details job seekers expect before they invest time</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              "Primary technical domains: product engineering, platform, data, cloud operations, security, QA, design, or delivery.",
              "Interview plan: screening call, technical discussion, practical exercise, panel, decision timing, and who job seekers will meet.",
              "Working model: remote policy, office expectations, time-zone overlap, equipment, collaboration tools, and on-call requirements.",
              "Role evidence: what portfolio, repository, case study, writing sample, or production experience will be reviewed.",
            ].map((item) => <p key={item} className="rounded-lg bg-gray-50 p-4 text-sm leading-6 text-gray-700">{item}</p>)}
          </div>
        </div>
      </section>
      <ProcessGrid eyebrow="Company context" title="Build confidence before the first conversation" intro="Job seekers are more likely to apply when they can understand the work, the team, and the evidence your hiring team values." steps={[{ title: "Clarify the team", body: "Name the discipline, product area, or client environment connected to each role." }, { title: "Describe the work", body: "Show how the role contributes to delivery, security, reliability, data quality, or customer experience." }, { title: "Explain evaluation", body: "Share the interview stages and the practical proof your reviewers will consider." }]} />
      <section className="mx-auto max-w-7xl px-4 pb-12 lg:px-8"><div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-gray-600"><h2 className="text-xl font-black text-gray-900">Company profile editing is coming soon</h2><p className="mt-2">Until then, each role brief is your clearest introduction. Keep the company, team, stack, compensation, and hiring process accurate so job seekers can assess the opportunity with confidence.</p></div></section>
      <CTASection title="Turn company context into better applications" body="Use your job posts to give job seekers the information they need before applying, then keep application review focused on the same criteria." primary={{ label: "Create a role", href: "/employer/jobs/create" }} secondary={{ label: "Review applications", href: "/employer/applications" }} />
    </MarketplaceShell>
  );
}
