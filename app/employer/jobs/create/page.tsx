import Image from "next/image";
import JobForm from "../../../../components/marketplace/JobForm";
import MarketplaceShell, { PageHeader } from "../../../../components/marketplace/MarketplaceShell";
import { CTASection, GuideGrid, ProcessGrid, VisualBand, hiringGuides } from "../../../../components/marketplace/ResourceSections";
import { getSessionUser } from "../../../../lib/session";

export default async function CreateJobPage() {
  const user = await getSessionUser();
  return (
    <MarketplaceShell user={user}>
      <PageHeader eyebrow="Create a role" title="Turn a hiring need into a clear opportunity">Give the right job seekers a useful picture of the work, the team, the skills that matter, and what a successful hire will contribute.</PageHeader>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-12 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase text-green-700">Role brief builder</p>
          <h2 className="mt-2 text-3xl font-black">Write the job so the right job seeker can self-select</h2>
          <p className="mt-4 leading-7 text-gray-600">A useful technical job post explains the problem, the team context, the stack, the level, the compensation range, and the evidence that makes an application credible.</p>
        </div>
        <Image src="/assets/agency-workshop-board.jpg" alt="Team planning a technical hiring brief on a workshop board" width={900} height={560} priority sizes="(min-width: 1024px) 42vw, 100vw" className="h-full max-h-[420px] w-full rounded-lg object-cover shadow-xl" />
      </section>
      <VisualBand
        eyebrow="Attract qualified job seekers"
        title="Turn a hiring need into a role job seekers can trust"
        body="Technical job seekers respond faster when the role feels concrete: the product context is clear, the stack is named, the salary is visible, and the interview path is not a mystery."
        image="/assets/client-strategy-session.jpg"
        imageAlt="Client and employer shaping a technology hiring plan"
        points={["Describe the business outcome behind the role.", "Separate required skills from useful extras.", "Name the decision criteria before applications arrive.", "Keep compensation, work mode, and deadlines visible."]}
      />
      <GuideGrid eyebrow="Before publishing" title="Write for qualified technical job seekers" intro="The best job posts help job seekers decide quickly whether they are a fit, then give employers better applications to review." items={hiringGuides} />
      <ProcessGrid eyebrow="Publishing checklist" title="Build a role brief that screens before the interview" intro="Use the job form after the essentials are clear enough for job seekers to compare their experience with your expectations." steps={[{ title: "Frame the problem", body: "Lead with the work the person will own, the team they will join, and the impact this hire needs to create." }, { title: "Anchor the stack", body: "List the technologies that matter for day-one contribution and avoid broad wish lists that hide the real requirement." }, { title: "Set the next step", body: "Name what belongs in the application so the first review is evidence-based and efficient." }]} />
      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-8 md:grid-cols-3 lg:px-8">
        {[{ title: "Define outcomes", body: "Explain the work the hire will own in the first months, not only the tools involved." }, { title: "Name must-haves", body: "Separate required skills from nice-to-have skills so qualified job seekers can decide quickly." }, { title: "State constraints", body: "Salary, work mode, location, deadlines, and interview steps help job seekers avoid wasted effort." }].map((item) => <article key={item.title} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-black">{item.title}</h2><p className="mt-2 text-sm leading-6 text-gray-600">{item.body}</p></article>)}
      </section>
      <section className="mx-auto max-w-5xl px-4 pb-12 lg:px-8"><JobForm /></section>
      <CTASection title="Ready to review better applications?" body="Publish the role when the brief is specific enough for skilled job seekers to recognize fit and for your team to evaluate evidence consistently." primary={{ label: "Manage jobs", href: "/employer/jobs" }} secondary={{ label: "Browse talent", href: "/employer/talent" }} />
    </MarketplaceShell>
  );
}
