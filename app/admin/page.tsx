import Link from "next/link";
import MarketplaceShell, { PageHeader } from "../../components/marketplace/MarketplaceShell";
import { CTASection, GuideGrid, ProcessGrid, VisualBand } from "../../components/marketplace/ResourceSections";
import { requirePageRole } from "../../lib/api-auth";
import { store } from "../../lib/store";

export default async function AdminPage() {
  const [user, jobs, applications, talent] = await Promise.all([
    requirePageRole(["admin"], "/admin/login"),
    store.jobs(),
    store.applications(),
    store.talent(),
  ]);
  const openJobs = jobs.filter((job) => job.status === "open");
  const visibleTalent = talent.filter((profile) => profile.name && profile.skills.length);
  const applicationStatuses = ["submitted", "reviewing", "shortlisted", "interview", "accepted", "rejected"].map((status) => ({
    status,
    count: applications.filter((application) => application.status === status).length,
  }));
  const stageDescriptions: Record<string, string> = {
    submitted: "Applications received and awaiting review.",
    reviewing: "Applications currently being assessed by the hiring team.",
    shortlisted: "Applications selected for further consideration.",
    interview: "Applications moved to the interview stage.",
    accepted: "Applications marked as accepted.",
    rejected: "Applications marked as rejected.",
  };
  const operationalSummary = [
    openJobs.length ? `${openJobs.length} open job${openJobs.length === 1 ? "" : "s"}` : "No open jobs",
    visibleTalent.length ? `${visibleTalent.length} talent profile${visibleTalent.length === 1 ? "" : "s"} with skills` : "No talent profiles with skills",
    applications.length ? `${applications.length} application${applications.length === 1 ? "" : "s"}` : "No applications",
    jobs.length - openJobs.length ? `${jobs.length - openJobs.length} closed or paused job${jobs.length - openJobs.length === 1 ? "" : "s"}` : "No closed or paused jobs",
  ];

  return (
    <MarketplaceShell user={user}>
      <PageHeader eyebrow="Marketplace administration" title="Marketplace operations">
        Review marketplace records, application progress, public listings, and account-facing content.
      </PageHeader>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-12 md:grid-cols-3 lg:px-8">
        {[["Jobs", jobs.length], ["Applications", applications.length], ["Talent profiles", talent.length]].map(([label, count]) => (
          <div key={label} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase text-gray-500">{label}</p>
            <p className="mt-2 text-4xl font-black">{count}</p>
          </div>
        ))}
      </section>
      <VisualBand
        eyebrow="Marketplace overview"
        title="Current marketplace records"
        body="These counts summarize the records currently available to administrators. Review public listings and account-facing content before making operational decisions."
        image="/assets/analytics-hiring-dashboard.jpg"
        imageAlt="Marketplace operations dashboard with hiring analytics"
        points={operationalSummary}
      />
      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase text-green-700">Record review</p>
          <h2 className="mt-2 text-2xl font-black">Review the current marketplace state</h2>
          <p className="mt-3 leading-7 text-gray-600">
            Use these totals to identify the records that need attention. A zero count means no records currently meet that criterion.
          </p>
          <div className="mt-5 grid gap-3 text-sm font-semibold text-gray-700 sm:grid-cols-2">
            {operationalSummary.map((item) => <p key={item} className="rounded-lg bg-gray-50 p-3">{item}</p>)}
          </div>
        </div>
        <div className="grid gap-3">
          {applicationStatuses.map((item) => (
            <article key={item.status} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <p className="font-black capitalize text-gray-900">{item.status}</p>
                <p className="rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-green-700">{item.count}</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-gray-600">{stageDescriptions[item.status]}</p>
            </article>
          ))}
        </div>
      </section>
      <ProcessGrid
        eyebrow="Administration workflow"
        title="Review marketplace information"
        intro="Use this dashboard to review the current records and the public pages that present them."
        steps={[
          { title: "Review listings and applications", body: "Check job details and application statuses for accuracy before acting on them." },
          { title: "Review talent profile visibility", body: "Confirm public profile content is appropriate for the information shown on the talent directory." },
          { title: "Review support and access paths", body: "Check that support content and sign-in journeys provide a clear next step for users." },
        ]}
      />
      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-12 md:grid-cols-4 lg:px-8">
        {[
          { title: "Public marketplace", href: "/", body: "Review the public site and its navigation from a visitor’s perspective." },
          { title: "Job listings", href: "/jobs", body: "Review published job details, including role requirements, compensation, work mode, and application information." },
          { title: "Talent directory", href: "/talent", body: "Review the professional information displayed in talent profiles." },
          { title: "Support center", href: "/support", body: "Review support content and the available guidance for marketplace users." },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:border-green-300 hover:shadow-lg">
            <h2 className="text-lg font-black">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">{item.body}</p>
          </Link>
        ))}
      </section>
      <GuideGrid
        eyebrow="Administrative review"
        title="Review key marketplace areas"
        intro="Use these areas to review the records and user-facing information currently available in the marketplace."
        items={[
          { title: "Review marketplace records", body: "Return to the dashboard to review the current job, application, and talent profile totals.", href: "/admin" },
          { title: "Review the public site", body: "Check the public marketplace, including jobs, talent profiles, support, sign-in, and sign-up pages.", href: "/" },
          { title: "Review support content", body: "Open the support center to review the guidance available to marketplace users.", href: "/support" },
        ]}
      />
      <CTASection
        title="Review marketplace experience"
        body="Open the public marketplace or support center to review the information and guidance available to users."
        primary={{ label: "View public marketplace", href: "/" }}
        secondary={{ label: "View support center", href: "/support" }}
      />
    </MarketplaceShell>
  );
}
