import Image from "next/image";
import Link from "next/link";
import type { Job, TalentProfile, User } from "../../lib/types";
import LazyVideo from "./LazyVideo";

const hiringLanes = [
  { title: "Frontend & Mobile", skills: ["React", "Next.js", "TypeScript", "Accessibility", "Mobile", "Flutter", "React Native", "UI/UX"] },
  { title: "Backend & Infrastructure", skills: ["Node.js", "Python", "Django", "FastAPI", "Java", "C#", "Go", "PHP", "Laravel", "PostgreSQL", "MongoDB", "SQL"] },
  { title: "Data & AI", skills: ["Data Analysis", "Power BI", "Machine Learning", "LLMs", "Vector Search", "Analytics"] },
  { title: "Cloud & DevOps", skills: ["AWS", "Azure", "Docker", "Kubernetes", "Terraform", "Linux", "DevOps", "Cyber Security"] },
  { title: "Product & QA", skills: ["Figma", "Product Management", "UX Research", "QA Automation", "Playwright", "Testing", "Agile"] },
];

const platformSections = [
  { title: "Talent profiles with proof", image: "/assets/candidate-review-meeting.jpg", body: "Strong profiles highlight skills, portfolio links, experience, education, projects, location, and availability so hiring teams can evaluate fit before asking for time." },
  { title: "Role briefs with useful context", image: "/assets/executive-hiring-brief.jpg", body: "The best job posts name the stack, level, work mode, salary, location, deadline, and evidence expected, so job seekers can decide faster and apply with stronger context." },
  { title: "Applications with clear next steps", image: "/assets/student-career-workshop.jpg", body: "A professional hiring process keeps every application connected to a specific role, then moves through review, shortlist, interview, and decision stages without leaving job seekers guessing." },
];

const skillTracks = ["React", "Next.js", "TypeScript", "Node.js", "Python", "Django", "FastAPI", "Java", "C#", "Go", "PHP", "Laravel", "PostgreSQL", "MongoDB", "SQL", "Data Analysis", "Power BI", "Machine Learning", "LLMs", "AWS", "Azure", "Docker", "Kubernetes", "Terraform", "Linux", "DevOps", "Cyber Security", "QA Automation", "Playwright", "Mobile", "Flutter", "React Native", "UI/UX", "Figma", "Product Management"];

const routeCards = [
  { title: "Jobs", href: "/jobs", body: "Browse open roles with full details upfront." },
  { title: "Talent", href: "/talent", body: "Discover technical profiles with portfolios and proof of work." },
  { title: "Career roadmap", href: "/career-roadmap", body: "Plan your next move from beginner to specialist." },
  { title: "Skill tracks", href: "/skill-tracks", body: "Compare frontend, backend, cloud, security, data, QA, product, and design paths." },
  { title: "Post a role", href: "/employer/jobs/create", body: "Publish a new opening for your hiring team." },
  { title: "Hiring process", href: "/hiring-process", body: "Build a structured journey from role definition to decision." },
  { title: "Applications", href: "/employer/applications", body: "Review job seekers against the role brief, portfolio evidence, and practical constraints." },
  { title: "My applications", href: "/talent/applications", body: "Stay prepared for interviews, follow-ups, and decisions on roles you have applied for." },
  { title: "Community", href: "/community", body: "Get referrals and feedback from the network." },
  { title: "Career resources", href: "/stories", body: "Read practical guidance on careers, hiring, portfolios, and interviews." },
  { title: "Support", href: "/support", body: "Get help with accounts, profiles, jobs, and applications." },
];

export default function PublicHome({ talent, users, jobs }: { talent: TalentProfile[]; users: User[]; jobs: Job[] }) {
  const openJobs = jobs.filter((job) => job.status === "open");
  const remoteJobs = openJobs.filter((job) => job.remote || job.workplaceType === "remote").length;
  const employers = users.filter((user) => user.roles.includes("employer"));
  const employerCount = new Set([...employers.map((user) => user.id), ...jobs.map((job) => job.employerId)]).size;
  const roleSkills = Array.from(new Set(openJobs.flatMap((job) => job.skills).filter(Boolean))).slice(0, 8);
  const featuredJobs = openJobs.slice(0, 4);
  const featuredTalent = talent.slice(0, 3);
  const stats = [
    { label: "Open tech roles", value: String(openJobs.length) },
    { label: "Remote roles", value: String(remoteJobs) },
    { label: "Hiring teams", value: String(employerCount) },
  ];

  return (
    <>
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-center">
            <p className="w-fit rounded-full bg-green-50 px-3 py-1 text-sm font-bold uppercase text-green-700">Technology recruitment agency</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight md:text-6xl">Find your next hire. Land your next role.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">Find practical technology roles and credible technical talent across software engineering, data, cloud, security, product, QA, and design. Clear briefs, proof-led profiles, and structured review help both sides make better hiring decisions.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/jobs" className="rounded-lg bg-green-600 px-5 py-3 font-bold text-white shadow-sm hover:bg-green-700">Browse jobs</Link>
              <Link href="/talent" className="rounded-lg border border-gray-300 px-5 py-3 font-bold text-gray-800 hover:bg-gray-50">Browse talent</Link>
            </div>
            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              {stats.map((item) => <div key={item.label} className="border-l border-gray-200 pl-4"><p className="text-2xl font-black">{item.value}</p><p className="mt-1 text-sm text-gray-500">{item.label}</p></div>)}
            </div>
          </div>
          <div className="relative min-h-[520px] overflow-hidden rounded-lg bg-gray-950 shadow-2xl">
            <LazyVideo src="/assets/team-tech-meeting.mp4" poster="/assets/technical-delivery-team.jpg" label="Technology team collaborating in an office" autoPlay className="absolute inset-0 h-full w-full opacity-90" />
            <div className="absolute inset-x-4 bottom-4 rounded-lg bg-white p-4 shadow-xl sm:inset-x-6 sm:bottom-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><p className="text-xs font-bold uppercase text-green-700">Role in focus</p><h2 className="mt-1 text-2xl font-black">{featuredJobs[0]?.title ?? "No open roles yet"}</h2></div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-800">{featuredJobs[0]?.workplaceType ?? (featuredJobs[0]?.remote ? "remote" : "Flowpilot")}</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                <div className="rounded-lg bg-gray-100 p-3"><p className="font-black">{openJobs.length}</p><p className="text-gray-500">open</p></div>
                <div className="rounded-lg bg-gray-100 p-3"><p className="font-black">{remoteJobs}</p><p className="text-gray-500">remote</p></div>
                <div className="rounded-lg bg-gray-100 p-3"><p className="font-black">{talent.length}</p><p className="text-gray-500">profiles</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="lazy-section border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div><p className="text-sm font-bold uppercase text-green-700">Start here</p><h2 className="mt-2 text-3xl font-black">Find the right career or hiring path</h2></div>
            <Link href="/signup" className="w-fit rounded-lg bg-gray-950 px-5 py-3 font-bold text-white shadow-sm">Create account</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {routeCards.map((card) => <Link key={card.href} href={card.href} className="group rounded-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-300 hover:bg-white hover:shadow-lg hover:ring-2 hover:ring-green-100"><h3 className="text-lg font-black text-gray-900 group-hover:text-green-700">{card.title}</h3><p className="mt-2 text-sm leading-6 text-gray-600">{card.body}</p><p className="mt-4 text-sm font-black text-green-600 transition group-hover:translate-x-1">Open</p></Link>)}
          </div>
        </div>
      </section>
      <section className="lazy-section mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div><p className="text-sm font-bold uppercase text-green-700">Open roles</p><h2 className="mt-2 text-3xl font-black md:text-4xl">Explore current technology openings</h2><p className="mt-4 leading-7 text-gray-600">{openJobs.length ? `${openJobs.length} open role${openJobs.length === 1 ? "" : "s"} available now across active hiring teams. Review the stack, work mode, seniority, salary, and location before applying.` : "No open roles are listed right now. Use the career and portfolio guides to prepare while hiring teams shape clear role briefs."}</p></div>
        <div className="grid gap-4 sm:grid-cols-2">
          {featuredJobs.length ? featuredJobs.map((job) => <Link key={job.id} href={`/jobs/${job.id}`} className="rounded-lg border border-gray-200 bg-gradient-to-br from-white via-gray-50 to-white p-6 shadow-sm transition duration-200 hover:border-green-300 hover:shadow-lg hover:ring-2 hover:ring-green-100"><p className="text-lg font-black text-gray-900">{job.title}</p><p className="mt-2 text-sm font-semibold text-green-700">{job.company}</p><p className="mt-3 text-sm text-gray-600">{job.location} - {job.employmentType}</p></Link>) : <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-gray-600">No featured roles are available yet.</div>}
        </div>
      </section>
      <section className="lazy-section border-y border-gray-200 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-2 lg:px-8">
          <LazyVideo src="/assets/developer-coding-office.mp4" poster="/assets/developer-code-office.jpg" label="Developer coding at a workstation" controls className="h-full max-h-[520px] min-h-80 w-full overflow-hidden rounded-lg shadow-xl transition duration-300 hover:shadow-2xl" />
          <div className="flex flex-col justify-center"><p className="text-sm font-bold uppercase text-green-700">Profiles with proof</p><h2 className="mt-2 text-3xl font-black md:text-4xl">Real portfolios. Real experience.</h2><p className="mt-4 leading-7 text-gray-600">Strong technical profiles make capability visible through skills, portfolio links, project summaries, location, and availability. Hiring teams see fit before asking for a job seeker&apos;s time.</p><div className="mt-7 grid gap-4 sm:grid-cols-2"><Link href="/signup?role=talent" className="rounded-lg bg-green-600 px-5 py-4 text-center font-bold text-white shadow-sm transition duration-200 hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5">Create profile</Link><Link href="/signup?role=employer" className="rounded-lg bg-gray-950 px-5 py-4 text-center font-bold text-white shadow-sm transition duration-200 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5">Start hiring</Link></div></div>
        </div>
      </section>
      <section className="lazy-section mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end"><div><p className="text-sm font-bold uppercase text-green-700">By specialty</p><h2 className="mt-2 text-3xl font-black md:text-4xl">Technology disciplines with clear hiring signals</h2></div><Image src="/assets/delivery-roadmap-session.jpg" alt="Employers reviewing technical talent pipelines" width={900} height={420} loading="lazy" decoding="async" sizes="(min-width: 1024px) 48vw, 100vw" className="h-72 w-full rounded-lg object-cover shadow-lg" /></div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">{hiringLanes.map((lane) => <article key={lane.title} className="rounded-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"><h3 className="text-xl font-black text-gray-900">{lane.title}</h3><p className="mt-3 leading-7 text-gray-600">Compare roles by the tools, responsibilities, and evidence employers expect in this discipline.</p><div className="mt-4 flex flex-wrap gap-2">{lane.skills.map((skill) => <Link key={skill} href={`/jobs?skill=${encodeURIComponent(skill)}`} className="inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-gray-700 transition duration-200 hover:bg-green-200 hover:text-green-900 hover:shadow">{skill}</Link>)}</div></article>)}</div>
      </section>
      <section className="lazy-section border-y border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 lg:px-8">
          {platformSections.map((section, index) => <article key={section.title} className={`grid gap-6 lg:grid-cols-2 transition duration-300 ${index % 2 ? "" : "lg:[&>img]:order-2"}`}><Image src={section.image} alt={section.title} width={900} height={560} loading="lazy" decoding="async" sizes="(min-width: 1024px) 50vw, 100vw" className="h-80 w-full rounded-lg object-cover shadow-lg transition duration-300 hover:shadow-2xl hover:-translate-y-1" /><div className="flex flex-col justify-center rounded-lg border border-gray-200 bg-gradient-to-br from-white to-amber-50 p-6 transition duration-300 hover:border-amber-300 hover:shadow-lg hover:-translate-y-1"><h3 className="text-2xl font-black text-gray-900">{section.title}</h3><p className="mt-4 leading-7 text-gray-600">{section.body}</p></div></article>)}
        </div>
      </section>
      <section className="lazy-section mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div><p className="text-sm font-bold uppercase text-green-700">Filter by skill</p><h2 className="mt-2 text-3xl font-black md:text-4xl">Search by technology</h2><p className="mt-4 leading-7 text-gray-600">{roleSkills.length ? "These skills appear in current open roles." : "Explore common technology tracks while new roles are added."}</p></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {(roleSkills.length ? roleSkills : skillTracks).map((skill) => <Link key={skill} href={`/jobs?skill=${encodeURIComponent(skill)}`} className="grid min-h-14 place-items-center rounded-lg border border-gray-300 bg-white px-4 text-center text-sm font-bold leading-tight text-gray-800 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-green-400 hover:bg-green-50 hover:text-green-700 hover:shadow-md">{skill}</Link>)}
          </div>
        </div>
      </section>
      <section className="lazy-section mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="max-w-3xl"><p className="text-sm font-bold uppercase text-green-700">Featured talent</p><h2 className="mt-2 text-3xl font-black md:text-4xl">Meet technical profiles on Flowpilot</h2></div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">{featuredTalent.length ? featuredTalent.map((person) => <Link key={person.id} href={`/talent/${person.id}`} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"><Image src={person.profilePicture ?? "/assets/talent-screening-call.jpg"} alt={person.name} width={600} height={420} loading="lazy" decoding="async" sizes="(min-width: 1024px) 33vw, 100vw" className="h-64 w-full object-cover transition duration-300 hover:scale-105" /><div className="p-6"><p className="text-lg font-black text-gray-900">{person.name}</p><p className="text-sm font-semibold text-green-600">{person.skills[0] ?? "Technical"} profile</p><p className="mt-4 leading-7 text-gray-700">{person.location} - {person.availability}</p></div></Link>) : <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-gray-600 lg:col-span-3">No talent profiles are available to feature yet.</div>}</div>
      </section>
      <section className="lazy-section border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div><p className="text-sm font-bold uppercase text-green-700">Hiring privacy</p><h2 className="mt-2 text-3xl font-black md:text-4xl">Sensitive hiring details stay protected</h2><p className="mt-4 leading-7 text-gray-600">Public discovery supports role and professional fit without exposing private hiring details. Cover notes, application decisions, private contact details, and hiring discussions belong behind verified account access.</p></div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { title: "For verified employers", href: "/employer/applications", body: "Review applications attached to your roles with the job brief, portfolio evidence, and screening criteria in view." },
              { title: "For job seekers", href: "/talent/applications", body: "Keep your applications organized so you can prepare for interviews, follow-ups, and decisions." },
              { title: "For new hiring teams", href: "/signup?role=employer", body: "Create an employer account before posting roles or reviewing job seeker activity." },
              { title: "For privacy questions", href: "/support", body: "Get help with account access, job seeker data, and application workflow questions." },
            ].map((item) => <Link key={item.href} href={item.href} className="rounded-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-300 hover:bg-white hover:shadow-lg"><h3 className="text-xl font-black leading-snug text-gray-900">{item.title}</h3><p className="mt-2 text-sm leading-6 text-gray-600">{item.body}</p><p className="mt-4 text-sm font-bold text-green-700">Continue</p></Link>)}
          </div>
        </div>
      </section>
    </>
  );
}
