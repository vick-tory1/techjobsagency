import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import PublicChrome from "../../components/marketplace/PublicChrome";
import { getSessionUser } from "../../lib/session";
import { store } from "../../lib/store";

const TalentExplorer = dynamic(() => import("../../components/marketplace/TalentExplorer"), {
  loading: () => (
    <section className="mx-auto max-w-7xl px-4 pb-12 lg:px-8">
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm font-semibold text-gray-600 shadow-sm">Loading talent directory...</div>
    </section>
  ),
});

const talentSignals = [
  { title: "Proof of work", body: "See their portfolio, tools, projects, and the type of role they are looking for." },
  { title: "Skip the guesswork", body: "Shortlist talent where the skills match what you need to hire." },
  { title: "Save time early", body: "Location, availability, and experience level are visible before you schedule calls." },
];

const reviewPoints = [
  { title: "What they build", body: "Check their portfolio, shipped projects, and case studies that prove their skills." },
  { title: "Where they fit", body: "See if they are looking for frontend, backend, data, design, QA, security, or product work." },
  { title: "Availability", body: "Know their location and timeline before reaching out." },
  { title: "Communication", body: "Look for job seekers who can explain their work and decisions clearly." },
];

const candidateBenefits = [
  { title: "Show your strongest work", body: "Put your best projects, portfolio links, and core skill first." },
  { title: "Get contacted by the right teams", body: "Show what you do best so relevant teams have a reason to reach out." },
  { title: "Keep it fresh", body: "Update your profile as you grow so opportunities find you." },
];

export default async function TalentPage() {
  const [user, talent, jobs] = await Promise.all([getSessionUser(), store.talent(), store.jobs()]);
  return (
    <PublicChrome user={user}>
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-2 lg:px-8">
          <Image src="/assets/mi&pc.jpg" alt="Talent profile" width={900} height={620} priority sizes="(min-width: 1024px) 50vw, 100vw" className="h-full max-h-[520px] w-full rounded-lg object-cover shadow-xl" />
          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold uppercase text-green-700">Talent network</p>
            <h1 className="mt-2 text-4xl font-black md:text-6xl">Hire technical talent you can evaluate and trust.</h1>
            <p className="mt-5 leading-8 text-gray-600">Search developers, analysts, designers, QA, cloud engineers, and security specialists. Each profile shows portfolio, skills, availability, and what they are looking for next.</p>
            <Link href="/signup?role=employer" className="mt-7 w-fit rounded-lg bg-gray-950 px-5 py-3 font-bold text-white">Start shortlisting</Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">{talentSignals.map((signal) => <article key={signal.title} className="rounded-lg border border-gray-200 bg-gradient-to-br from-white to-blue-50 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"><h2 className="text-xl font-black text-gray-900">{signal.title}</h2><p className="mt-3 leading-7 text-gray-600">{signal.body}</p></article>)}</div>
      </section>
      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase text-green-700">For employers</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">Review talent based on what they have actually built.</h2>
            <p className="mt-4 leading-7 text-gray-600">Check skills, portfolio, location, and availability. Make shortlist decisions before scheduling interviews.</p>
            <Link href="/employer/jobs/create" className="mt-6 inline-block rounded-lg bg-green-600 px-5 py-3 font-bold text-white">Post a role</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {reviewPoints.map((item) => <article key={item.title} className="rounded-lg border border-gray-200 bg-gradient-to-br from-white to-green-50 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"><h3 className="text-lg font-black text-gray-900">{item.title}</h3><p className="mt-2 text-sm leading-6 text-gray-600">{item.body}</p></article>)}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="mb-6 max-w-3xl">
          <p className="text-sm font-bold uppercase text-green-700">For job seekers</p>
          <h2 className="mt-2 text-3xl font-black md:text-4xl">Make your profile easy to evaluate.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {candidateBenefits.map((item) => <article key={item.title} className="rounded-lg border border-gray-200 bg-gradient-to-br from-white to-purple-50 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-lg"><h3 className="text-xl font-black text-gray-900">{item.title}</h3><p className="mt-3 leading-7 text-gray-600">{item.body}</p></article>)}
        </div>
      </section>
      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
          <div className="mb-6 max-w-3xl">
            <p className="text-sm font-bold uppercase text-green-700">Directory</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">Find talent by the skills and details that matter.</h2>
            <p className="mt-4 leading-7 text-gray-600">Filter by role type, location, experience, availability, and stack. The directory makes it easy to find the right fit for your team.</p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-12 lg:px-8"><TalentExplorer talent={talent} jobs={jobs} /></section>
    </PublicChrome>
  );
}
