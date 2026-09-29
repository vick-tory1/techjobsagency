import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import PublicChrome from "../../components/marketplace/PublicChrome";
import { getSessionUser } from "../../lib/session";
import { store } from "../../lib/store";

const JobExplorer = dynamic(() => import("../../components/marketplace/JobExplorer"), {
  loading: () => <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8"><div className="rounded-lg border border-gray-200 bg-white p-6 font-semibold text-gray-600 shadow-sm">Preparing the job search...</div></section>,
});

const jobExplainers = [
  { title: "Clear role details", body: "Stack, experience level, work mode, location, and salary range are listed upfront." },
  { title: "No surprises later", body: "Remote or on-site expectations are clear so both sides know what they are looking for." },
  { title: "Show your best work", body: "Match your portfolio and experience to the specific role you are applying for." },
];

const disciplineRows = [
  ["Frontend", "React", "Next.js", "Accessibility", "Performance"],
  ["Backend", "Node.js", "PostgreSQL", "Authentication", "APIs"],
  ["Data", "SQL", "Power BI", "Analytics", "Machine Learning"],
  ["Cloud", "AWS", "Azure", "Docker", "Terraform"],
  ["Security", "SIEM", "Linux", "Incident Response", "Risk"],
  ["Product", "Figma", "UX Research", "Roadmaps", "QA"],
];

export default async function JobsPage() {
  const [user, jobs] = await Promise.all([getSessionUser(), store.jobs()]);
  return (
    <PublicChrome user={user}>
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase text-green-700">Technical jobs</p>
            <h1 className="mt-2 text-4xl font-black md:text-6xl">Find roles that match your skills.</h1>
            <p className="mt-5 leading-8 text-gray-600">Browse roles in software development, data, cloud infrastructure, security, QA, product, and design. Each listing includes stack, seniority, work mode, and salary so you know what you are applying for.</p>
            <Link href="/signup?role=talent" className="mt-7 inline-block rounded-lg bg-green-600 px-5 py-3 font-bold text-white">Build your profile</Link>
          </div>
          <Image src="/assets/recruiting-workspace.jpg" alt="Hiring workspace" width={900} height={620} priority sizes="(min-width: 1024px) 60vw, 100vw" className="h-full max-h-[520px] w-full rounded-lg object-cover shadow-xl" />
        </div>
      </section>
      <section className="lazy-section mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">{jobExplainers.map((item) => <article key={item.title} className="rounded-lg border border-gray-200 bg-gradient-to-br from-white to-green-50 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"><h2 className="text-xl font-black text-gray-900">{item.title}</h2><p className="mt-3 leading-7 text-gray-600">{item.body}</p></article>)}</div>
      </section>
      <section className="lazy-section border-y border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[0.7fr_0.95fr_1.1fr] lg:px-8">
          <Image src="/assets/developer-code-office.jpg" alt="Developer working with code in a modern office" width={620} height={520} loading="lazy" decoding="async" sizes="(min-width: 1024px) 28vw, 100vw" className="h-full max-h-[430px] w-full rounded-lg object-cover shadow-lg" />
          <div><p className="text-sm font-bold uppercase text-green-700">Skill groups</p><h2 className="mt-2 text-3xl font-black">Search by the work you want to do.</h2><p className="mt-4 leading-7 text-gray-600">Roles are grouped around the teams companies are hiring for: product engineering, backend platforms, analytics, cloud operations, security, delivery, and QA.</p></div>
          <div className="grid gap-3">{disciplineRows.map(([label, ...skills]) => <div key={label} className="rounded-lg border border-gray-200 bg-gradient-to-br from-white to-blue-50 p-4 transition duration-200 hover:border-blue-300 hover:shadow-md"><p className="font-black text-gray-900">{label}</p><div className="mt-3 flex flex-wrap gap-2">{skills.map((skill) => <span key={skill} className="cursor-pointer rounded-full bg-white px-3 py-1 text-sm font-semibold text-gray-700 shadow-sm transition duration-150 hover:bg-blue-100 hover:text-blue-700 hover:shadow">{skill}</span>)}</div></div>)}</div>
        </div>
      </section>
      <div className="lazy-section">
        <JobExplorer jobs={jobs} />
      </div>
    </PublicChrome>
  );
}
