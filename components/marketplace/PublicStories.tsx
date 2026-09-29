import Image from "next/image";
import Link from "next/link";
import type { Job, TalentProfile, User } from "../../lib/types";

const resourceCards = [
  { title: "Career development", href: "/career-roadmap", body: "Choose a technical lane, build proof of work, and use job requirements to decide what to learn next." },
  { title: "Hiring insights", href: "/hiring-process", body: "Design role briefs, screening steps, and interview criteria that help strong job seekers recognize fit." },
  { title: "Interview preparation", href: "/interview-prep", body: "Prepare examples, technical topics, portfolio stories, and practical questions before every hiring conversation." },
];

const insightCards = [
  { title: "Build a stronger portfolio", href: "/portfolio", body: "Show two or three focused projects with the problem, stack, screenshots, decisions, and your personal contribution." },
  { title: "Understand technology skills", href: "/skill-tracks", body: "Compare software engineering, cloud, data, security, QA, product, and design skills by the work they support." },
  { title: "Prepare for remote roles", href: "/remote-work", body: "Remote teams value clear writing, reliable delivery habits, time-zone clarity, and strong documentation." },
  { title: "Screen technical talent", href: "/candidate-screening", body: "Evaluate skills, portfolio evidence, communication, availability, and role constraints before scheduling interviews." },
];

export default function PublicStories({ jobs, talent, users }: { jobs: Job[]; talent: TalentProfile[]; users: User[] }) {
  const openJobs = jobs.filter((job) => job.status === "open");
  const employers = users.filter((user) => user.roles.includes("employer"));
  const recentJobs = openJobs.slice(0, 6);
  const recentProfiles = talent.slice(0, 6);
  const status = `${openJobs.length} open role${openJobs.length === 1 ? "" : "s"}, ${talent.length} technical profile${talent.length === 1 ? "" : "s"}, and ${employers.length} hiring team${employers.length === 1 ? "" : "s"} are represented today.`;

  return (
    <>
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div><p className="text-sm font-bold uppercase text-green-700">Career resources</p><h1 className="mt-2 text-4xl font-black md:text-6xl">Technology Careers. Hiring Insights. Practical Guidance.</h1><p className="mt-5 leading-8 text-gray-600">The technology industry changes quickly. Stay sharp with practical guidance on building technical careers, hiring skilled professionals, preparing for interviews, developing portfolios, and understanding modern workplace expectations.</p><p className="mt-5 rounded-lg bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">{status}</p></div>
          <div className="overflow-hidden rounded-lg bg-gray-950 text-white shadow-xl"><Image src="/assets/recruitment-planning-table.jpg" alt="Hiring team reviewing role and job seeker activity" width={900} height={520} loading="lazy" decoding="async" sizes="(min-width: 1024px) 55vw, 100vw" className="h-72 w-full object-cover opacity-90" /><div className="grid gap-3 p-6 sm:grid-cols-3"><div><p className="text-3xl font-black">{openJobs.length}</p><p className="text-sm text-gray-300">Open roles</p></div><div><p className="text-3xl font-black">{talent.length}</p><p className="text-sm text-gray-300">Profiles</p></div><div><p className="text-3xl font-black">{employers.length}</p><p className="text-sm text-gray-300">Employers</p></div></div></div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="mb-6 max-w-3xl"><p className="text-sm font-bold uppercase text-green-700">Open roles</p><h2 className="mt-2 text-3xl font-black">Discover Your Next Technology Opportunity</h2><p className="mt-3 leading-7 text-gray-600">{recentJobs.length ? "Explore roles across software development, cloud, data, cybersecurity, product, QA, and design. Review the stack, work mode, location, and level before deciding where to apply." : "No open roles are available right now. Use the career guides below to sharpen your profile while new opportunities are added."}</p></div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{recentJobs.length ? recentJobs.map((job) => <Link key={job.id} href={`/jobs/${job.id}`} className="group rounded-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-300 hover:bg-white hover:shadow-lg"><p className="text-sm font-bold uppercase text-green-700">{job.company}</p><h2 className="mt-2 text-xl font-black leading-snug text-gray-950 transition group-hover:text-green-800">{job.title}</h2><p className="mt-3 text-sm text-gray-600">{job.location} - {job.employmentType}</p><p className="mt-3 text-sm font-semibold text-gray-500 transition group-hover:text-green-600">Open job</p></Link>) : <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-gray-600 md:col-span-2 lg:col-span-3">Employers have not published any open roles yet.</div>}</div>
      </section>
      <section className="border-t border-gray-200 bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="mb-6 max-w-3xl"><p className="text-sm font-bold uppercase text-green-700">Talent</p><h2 className="mt-2 text-3xl font-black">Technical Professionals With Proof of Work</h2><p className="mt-3 leading-7 text-gray-600">{recentProfiles.length ? "Review profiles by skills, availability, location, projects, and portfolio evidence before starting a hiring conversation." : "No public talent profiles are available yet. Hiring teams can still prepare role briefs and screening criteria before outreach begins."}</p></div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{recentProfiles.length ? recentProfiles.map((profile) => <Link key={profile.id} href={`/talent/${profile.id}`} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"><p className="text-xl font-black text-gray-900">{profile.name}</p><p className="mt-2 text-sm font-semibold text-green-700">{profile.skills.slice(0, 3).join(", ") || "Technical profile"}</p><p className="mt-3 text-sm text-gray-600">{profile.location} - {profile.availability}</p></Link>) : <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-gray-600 md:col-span-2 lg:col-span-3">Job seekers have not created visible profiles yet.</div>}</div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div><p className="text-sm font-bold uppercase text-green-700">Practical guidance</p><h2 className="mt-2 text-3xl font-black">Build careers and teams with better information</h2><p className="mt-3 leading-7 text-gray-600">Strong hiring and career decisions come from clear evidence: relevant projects, defined role outcomes, fair screening, and honest expectations around salary, work mode, and availability.</p></div>
          <div className="grid gap-4 md:grid-cols-2">{insightCards.map((item) => <Link key={item.href} href={item.href} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"><h3 className="text-xl font-black text-gray-900">{item.title}</h3><p className="mt-3 text-sm leading-6 text-gray-600">{item.body}</p><p className="mt-4 text-sm font-bold text-green-700">Read guide</p></Link>)}</div>
        </div>
      </section>
      <section className="border-t border-gray-200 bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-14 md:grid-cols-3 lg:px-8">
          {resourceCards.map((card) => <Link key={card.href} href={card.href} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"><h2 className="text-xl font-black text-gray-900">{card.title}</h2><p className="mt-3 leading-7 text-gray-600">{card.body}</p><p className="mt-4 text-sm font-bold text-green-700">Read more</p></Link>)}
        </div>
      </section>
    </>
  );
}
