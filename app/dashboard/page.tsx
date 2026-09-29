import Card from "../../components/dashboard/Card";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { CTASection, ProcessGrid } from "../../components/marketplace/ResourceSections";
import { requirePageUser } from "../../lib/api-auth";
import { store } from "../../lib/store";
import type { ApplicationStatus, Job } from "../../lib/types";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const statusLabels: Record<ApplicationStatus, string> = {
  submitted: "Submitted",
  reviewing: "Reviewing",
  shortlisted: "Shortlisted",
  interview: "Interview",
  accepted: "Accepted",
  rejected: "Rejected",
};

function salaryToBudget(salary: string) {
  const amounts = salary.match(/\d[\d,]*/g)?.map((amount) => Number(amount.replace(/,/g, ""))) ?? [];
  return amounts.length ? Math.max(...amounts) : 0;
}

function closingDate(job: Job) {
  const postedAt = Number.isNaN(new Date(job.createdAt).getTime()) ? new Date() : new Date(job.createdAt);
  postedAt.setDate(postedAt.getDate() + 30);
  return postedAt.toISOString().slice(0, 10);
}

export default async function DashboardPage() {
  const [user, jobs, applications, talent, users] = await Promise.all([
    requirePageUser(),
    store.jobs(),
    store.applications(),
    store.talent(),
    store.users(),
  ]);

  const openJobs = jobs.filter((job) => job.status === "open");
  const isAdmin = Boolean(user?.roles.includes("admin"));
  const isEmployer = Boolean(user?.roles.includes("employer"));
  const isTalent = Boolean(user?.roles.includes("talent"));
  const scopedJobs = isAdmin ? jobs : isEmployer && user ? jobs.filter((job) => job.employerId === user.id) : jobs;
  const scopedOpenJobs = scopedJobs.filter((job) => job.status === "open");
  const scopedApplications = isAdmin
    ? applications
    : isEmployer && user
      ? applications.filter((application) => application.employerId === user.id)
      : isTalent && user
        ? applications.filter((application) => application.applicantId === user.id)
        : applications.filter((application) => application.applicantId === user?.id);
  const ownProfile = user ? talent.find((profile) => profile.userId === user.id) : undefined;
  const employerCount = new Set([...users.filter((item) => item.roles.includes("employer")).map((item) => item.id), ...jobs.map((job) => job.employerId)]).size;
  const applicantCount = isTalent && user ? Number(Boolean(ownProfile)) : new Set([...talent.map((profile) => profile.userId), ...scopedApplications.map((application) => application.applicantId)]).size;
  const salaryPipeline = scopedOpenJobs.reduce((total, job) => total + salaryToBudget(job.salary), 0);
  const jobsNeedingAttention = scopedApplications.filter((application) => ["submitted", "reviewing"].includes(application.status)).length;
  const priorityJobs = [...scopedOpenJobs].sort((a, b) => new Date(closingDate(a)).getTime() - new Date(closingDate(b)).getTime()).slice(0, 3);
  const recentApplications = scopedApplications.slice(0, 4);
  const applicationsByStatus = Object.entries(statusLabels).map(([status, label]) => ({
    label,
    count: scopedApplications.filter((application) => application.status === status).length,
  }));
  const dashboardTitle = isTalent ? "Job Search Center" : isEmployer ? "Hiring Operations Center" : "Marketplace Operations Center";
  const dashboardIntro = isTalent
    ? "Track your applications, profile readiness, interview movement, and role opportunities from your Flowpilot activity."
    : isEmployer
      ? "Monitor your open roles, job seeker movement, salary exposure, and review priorities from your hiring activity."
      : "Monitor hiring demand, open roles, job seeker movement, salary exposure, and review priorities from activity across Flowpilot.";

  return (
    <DashboardLayout user={user}>
        <div className="space-y-8">
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase text-green-700">{isTalent ? "Live job seeker dashboard" : isEmployer ? "Live employer dashboard" : "Live marketplace dashboard"}</p>
                <h1 className="mt-2 text-3xl font-bold text-gray-950 md:text-4xl">{dashboardTitle}</h1>
                <p className="mt-3 max-w-2xl text-gray-600">
                  {dashboardIntro}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                <div className="rounded-lg border border-gray-200 px-4 py-3">
                  <p className="text-gray-500">{isTalent ? "Profile" : "Employers"}</p>
                  <p className="text-2xl font-bold text-gray-950">{isTalent ? (ownProfile ? "Ready" : "Missing") : employerCount}</p>
                </div>
                <div className="rounded-lg border border-gray-200 px-4 py-3">
                  <p className="text-gray-500">Open roles</p>
                  <p className="text-2xl font-bold text-gray-950">{scopedOpenJobs.length}</p>
                </div>
                <div className="rounded-lg border border-gray-200 px-4 py-3">
                  <p className="text-gray-500">Applications</p>
                  <p className="text-2xl font-bold text-gray-950">{scopedApplications.length}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card title={isTalent ? "Profile Status" : "Active Employers"} value={isTalent ? (ownProfile ? "Ready" : "Missing") : String(employerCount)} detail={isTalent ? "Keep your profile current before applying" : "Hiring companies with live job posts"} trend={isTalent ? "Job seeker readiness" : "Employer demand"} />
            <Card title={isTalent ? "My Applications" : "Applicants"} value={String(isTalent ? scopedApplications.length : applicantCount)} detail={`${scopedApplications.length} active application${scopedApplications.length === 1 ? "" : "s"}`} trend={isTalent ? "Job search pipeline" : "Job seeker supply"} />
            <Card title={isTalent ? "Open Matches" : "Salary Pipeline"} value={isTalent ? String(openJobs.length) : currency.format(salaryPipeline)} detail={isTalent ? "Open roles available to explore" : "Combined salary value across open roles"} trend="Market opportunity" />
            <Card title={isTalent ? "In Review" : "Needs Review"} value={String(jobsNeedingAttention)} detail="Submitted or reviewing applications" trend="Application queue" />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-950">Priority Job Posts</h2>
                  <p className="text-sm text-gray-500">{isTalent ? "Open roles ordered by closing date so you can prioritize timely applications." : "Open roles ordered by closing date so hiring teams can protect time-sensitive hiring pipelines."}</p>
                </div>
                <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">{jobsNeedingAttention} needs review</span>
              </div>
              <div className="space-y-4">
                {priorityJobs.length ? priorityJobs.map((job) => (
                  <article key={job.id} className="rounded-lg border border-gray-200 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-950">{job.title}</h3>
                        <p className="text-sm text-gray-500">
                          {job.company} - applications close {closingDate(job)}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-semibold text-gray-950">{job.salary}</p>
                        <p className="text-sm text-gray-500">{job.experienceLevel}</p>
                      </div>
                    </div>
                  </article>
                )) : <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-600">{isTalent ? "No open roles are available yet. Keep your profile current and check back soon." : "No open roles exist yet. Create a real job post before tracking priority hiring deadlines."}</div>}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-950">Application Status</h2>
              <p className="mb-5 text-sm text-gray-500">{isTalent ? "Use these counts to track where your applications stand." : "Use these counts to spot where job seeker review is slowing down."}</p>
              <div className="space-y-4">
                {applications.length ? applicationsByStatus.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm">
                    <span className="font-medium text-gray-800">{item.label}</span>
                    <span className="font-bold text-gray-950">{item.count}</span>
                  </div>
                )) : <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-600">{isTalent ? "You have not submitted any applications yet." : "No applications have been submitted yet."}</div>}
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-950">{isTalent ? "Recent Application Activity" : "Recent Job Seeker Activity"}</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {recentApplications.length ? recentApplications.map((application) => {
                const job = jobs.find((item) => item.id === application.jobId);
                const profile = talent.find((item) => item.userId === application.applicantId);
                return (
                  <article key={application.id} className="rounded-lg border border-gray-200 p-4">
                    <h3 className="font-semibold text-gray-950">{profile?.name ?? "Job seeker profile"}</h3>
                    <p className="mt-1 text-sm text-gray-500">{job?.title ?? "Role"} at {job?.company ?? "Flowpilot employer"}</p>
                    <span className="mt-3 inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">{statusLabels[application.status]}</span>
                  </article>
                );
              }) : <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-600 md:col-span-2">{isTalent ? "No application activity exists yet. Browse roles and apply when you find a strong match." : "No job seeker application activity exists yet. When job seekers apply to open jobs, recent movement will appear here."}</div>}
            </div>
          </section>

          <ProcessGrid eyebrow="Operations rhythm" title="Keep hiring activity moving" intro="Use the dashboard to choose the next area for human attention: stale roles, waiting applications, incomplete profiles, or support needs." steps={[{ title: "Protect supply", body: "Review open roles and close outdated demand so job seekers see useful opportunities." }, { title: "Move applications", body: "Prioritize submitted and reviewing applications so job seekers are not left waiting in early stages." }, { title: "Strengthen profiles", body: "Encourage complete talent profiles with skills, portfolio evidence, location, and availability." }]} />

          <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase text-green-700">Marketplace health</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-950">Operational signals worth watching</h2>
              <p className="mt-3 leading-7 text-gray-600">These indicators help teams focus on real hiring work without relying on inflated activity claims or guesswork.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { label: "Open role coverage", value: `${scopedOpenJobs.length}/${scopedJobs.length}`, body: isTalent ? "Open roles currently available to explore." : "Open roles compared with the full role list." },
                { label: "Review load", value: String(jobsNeedingAttention), body: "Applications waiting in submitted or reviewing states." },
                { label: isTalent ? "Profile readiness" : "Visible talent", value: isTalent ? (ownProfile ? "Ready" : "Missing") : String(talent.length), body: isTalent ? "Your profile status for employer review." : "Technical profiles ready for employer review." },
                { label: isTalent ? "My pipeline" : "Employer base", value: isTalent ? String(scopedApplications.length) : String(employerCount), body: isTalent ? "Applications currently tied to your account." : "Hiring accounts and role owners currently represented." },
              ].map((item) => <article key={item.label} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"><p className="text-sm font-semibold text-gray-500">{item.label}</p><p className="mt-2 text-3xl font-bold text-gray-950">{item.value}</p><p className="mt-2 text-sm leading-6 text-gray-600">{item.body}</p></article>)}
            </div>
          </section>

          <CTASection title="Choose the next operational action" body="Open the workflow that needs attention: role quality, application movement, talent discovery, or support." primary={{ label: "Review applications", href: "/employer/applications" }} secondary={{ label: "Browse jobs", href: "/jobs" }} />
        </div>
    </DashboardLayout>
  );
}
