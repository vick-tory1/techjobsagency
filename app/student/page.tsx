import Image from "next/image";
import MarketplaceShell, { PageHeader } from "../../components/marketplace/MarketplaceShell";
import { GuideGrid, FAQBlock, careerGuides } from "../../components/marketplace/ResourceSections";
import { requirePageRole } from "../../lib/api-auth";

const studentTracks = [
  { title: "Build a portfolio", body: "Add projects, code links, and screenshots that show what you can actually build." },
  { title: "Find entry-level roles", body: "Browse junior, internship, and early-career positions across all tech stacks." },
  { title: "Prepare for interviews", body: "Practice explaining your work, debugging examples, and technical decisions." },
  { title: "Create a strong profile", body: "Add your main skill, links, location, and what you are looking for next." },
];

export default async function StudentPage() {
  const user = await requirePageRole(["student"]);
  return (
    <MarketplaceShell user={user}>
      <PageHeader eyebrow="Student careers" title="Get started in tech">Build a portfolio, practice interviewing, and find your first technical role.</PageHeader>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase text-green-700">Early career roadmap</p>
          <h2 className="mt-2 text-3xl font-black">Turn learning into visible proof</h2>
          <p className="mt-4 leading-7 text-gray-600">Pick one starting lane, build small projects, explain your decisions, and apply when your portfolio can prove the fundamentals for the role.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">{["Frontend: interfaces, accessibility, state, APIs.", "Backend: data models, auth, APIs, queues.", "Data: SQL, dashboards, analysis, communication.", "Cloud: Linux, deployment, monitoring, reliability."].map((item) => <p key={item} className="rounded-lg bg-gray-50 p-3 text-sm font-semibold text-gray-700">{item}</p>)}</div>
        </div>
        <Image src="/assets/student-career-workshop.jpg" alt="Students learning technology career skills in a workshop" width={900} height={560} priority sizes="(min-width: 1024px) 45vw, 100vw" className="h-full max-h-[430px] w-full rounded-lg object-cover shadow-xl" />
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-12 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          {studentTracks.map((track) => <article key={track.title} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-black">{track.title}</h2><p className="mt-3 leading-7 text-gray-600">{track.body}</p></article>)}
        </div>
        <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-6">
          <h2 className="text-2xl font-black text-green-900">Before you apply</h2>
          <p className="mt-3 leading-7 text-green-900">Pick a role type. Show portfolio work. Be clear about your availability. Compare your skills to the job description.</p>
        </div>
      </section>
      <GuideGrid eyebrow="Career foundation" title="Turn learning into employable evidence" intro="Students and early-career job seekers turn each skill into stronger evidence with a small project, written explanation, or portfolio artifact." items={careerGuides} />
      <FAQBlock items={[{ title: "What belongs in a student portfolio?", body: "Include two or three focused projects, screenshots, links, the problem solved, the stack used, and what you personally contributed." }, { title: "How do I know when to apply?", body: "Apply when you can explain enough of the required stack, show related practice, and commit to the role's location, work mode, and schedule." }]} />
    </MarketplaceShell>
  );
}
