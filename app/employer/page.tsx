import Image from "next/image";
import Link from "next/link";
import MarketplaceShell, { PageHeader } from "../../components/marketplace/MarketplaceShell";
import { GuideGrid, FAQBlock, hiringGuides } from "../../components/marketplace/ResourceSections";
import { getSessionUser } from "../../lib/session";

export default async function EmployerDashboardPage() {
  const user = await getSessionUser();
  return (
    <MarketplaceShell user={user}>
      <PageHeader eyebrow="Employer workspace" title="Build teams that move technology forward">
        Connect with qualified technology professionals, shape clear opportunities, and keep every hiring decision organized from first review to final outcome.
      </PageHeader>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <Image src="/assets/executive-hiring-brief.jpg" alt="Hiring team reviewing a technical role brief" width={900} height={560} priority sizes="(min-width: 1024px) 48vw, 100vw" className="h-full max-h-[430px] w-full rounded-lg object-cover shadow-xl" />
        <div className="grid content-center gap-4">
          {[
            { title: "Shape the role before sourcing", body: "Clarify the business problem, technical stack, level, compensation, work mode, and evidence you need from job seekers." },
            { title: "Review job seekers consistently", body: "Use the same screening criteria for every applicant: proof of work, skill relevance, communication, availability, and role constraints." },
            { title: "Protect private job seeker data", body: "Private contact and detailed profile information is available only through authorized verified employer workflows." },
          ].map((item) => <article key={item.title} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-black">{item.title}</h2><p className="mt-2 text-sm leading-6 text-gray-600">{item.body}</p></article>)}
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-12 md:grid-cols-4 lg:px-8">
        {[["Company profile", "/employer/profile", "Show prospective job seekers who your team is, what the work involves, and how you hire."], ["Manage roles", "/employer/jobs", "Keep every open, paused, and closed role tied to a real hiring priority."], ["Review applications", "/employer/applications", "Compare evidence fairly, make timely decisions, and give job seekers a clear next step."], ["Search talent", "/employer/talent", "Find relevant technical profiles by skills, location, portfolio evidence, and availability."]].map(([label, href, body]) => <Link key={href} href={href} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"><h2 className="text-xl font-black">{label}</h2><p className="mt-3 text-sm leading-6 text-gray-600">{body}</p></Link>)}
      </section>
      <GuideGrid eyebrow="Hiring workflow" title="Run a structured technical hiring process" intro="Strong hiring starts with a clear role brief, practical evidence, consistent review criteria, and timely job seeker communication." items={hiringGuides} />
      <FAQBlock items={[{ title: "What belongs in a job post?", body: "Include stack, seniority, salary or budget, work mode, location, responsibilities, and the evidence you want job seekers to provide." }, { title: "What makes a profile worth shortlisting?", body: "Relevant project proof, communication clarity, skill fit, availability, and evidence that matches the role matter more than broad claims." }]} />
    </MarketplaceShell>
  );
}
