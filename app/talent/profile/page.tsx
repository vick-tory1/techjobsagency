import Image from "next/image";
import MarketplaceShell, { PageHeader } from "../../../components/marketplace/MarketplaceShell";
import ProfileForm from "../../../components/marketplace/ProfileForm";
import { CTASection, GuideGrid, ProcessGrid, VisualBand, careerGuides } from "../../../components/marketplace/ResourceSections";
import { getSessionUser } from "../../../lib/session";
import { store } from "../../../lib/store";

export default async function TalentProfilePage() {
  const [user, profiles] = await Promise.all([getSessionUser(), store.talent()]);
  const profile = user ? profiles.find((item) => item.userId === user.id) : null;
  return (
    <MarketplaceShell user={user}>
      <PageHeader eyebrow="Talent profile" title="Professional profile">Build a profile that helps employers understand your skills, proof of work, location, availability, and next role target.</PageHeader>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase text-green-700">Profile craft</p>
          <h2 className="mt-2 text-3xl font-black">Make your evidence easy to scan</h2>
          <p className="mt-4 leading-7 text-gray-600">A strong Flowpilot profile turns skills into proof: concise summary, focused projects, portfolio links, location, availability, and the type of role you want next.</p>
        </div>
        <Image src="/assets/developer-workstation.jpg" alt="Developer workspace prepared for portfolio review" width={900} height={560} priority sizes="(min-width: 1024px) 45vw, 100vw" className="h-full max-h-[420px] w-full rounded-lg object-cover shadow-xl" />
      </section>
      <GuideGrid eyebrow="Profile guidance" title="Make your technical profile easier to evaluate" intro="A strong profile connects skills to evidence. Use the form to keep your work samples and career direction clear." items={careerGuides} />
      <VisualBand
        eyebrow="Portfolio signal"
        title="Present your work like a professional job seeker"
        body="A polished profile makes your strongest work easy to understand: what you build, how you explain decisions, and where your experience fits a technical team. Lead with evidence, not a long list of tools."
        image="/assets/portfolio-code-review.jpg"
        imageAlt="Job seeker reviewing portfolio work and code samples"
        points={["Name the role direction you want next.", "Connect every important skill to a project or work sample.", "Keep location and availability current.", "Use portfolio links that are easy to open and review."]}
      />
      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-8 md:grid-cols-3 lg:px-8">{[{ title: "Public summary", body: "Write a concise summary of the kind of technical work you do and the teams you can help." }, { title: "Proof links", body: "Add portfolio, GitHub, product demos, or case studies that support the skills on your profile." }, { title: "Privacy-aware detail", body: "Public pages show professional context; private contact and detailed history stay protected for authorized hiring workflows." }].map((item) => <article key={item.title} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-black">{item.title}</h2><p className="mt-2 text-sm leading-6 text-gray-600">{item.body}</p></article>)}</section>
      <ProcessGrid eyebrow="Profile polish" title="Shape your profile for real hiring reviews" intro="Make your fit easy to understand before the first conversation. Put the strongest evidence where reviewers will see it quickly." steps={[{ title: "Lead with focus", body: "State your main discipline, preferred role type, and the kind of problems you can solve." }, { title: "Prove the stack", body: "Use projects, repositories, dashboards, designs, or case studies to support the skills you list." }, { title: "Keep it current", body: "Update availability, location, and links whenever your job search changes." }]} />
      <section className="mx-auto max-w-5xl px-4 pb-12 lg:px-8"><ProfileForm user={user} profile={profile} /></section>
      <CTASection title="Ready to apply with stronger evidence?" body="After your profile is current, browse roles that match your stack and use each cover note to connect your work to the job." primary={{ label: "Browse jobs", href: "/jobs" }} secondary={{ label: "Track applications", href: "/talent/applications" }} />
    </MarketplaceShell>
  );
}
