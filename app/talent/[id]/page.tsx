import Image from "next/image";
import Link from "next/link";
import MarketplaceShell, { PageHeader } from "../../../components/marketplace/MarketplaceShell";
import { CTASection, ProcessGrid, VisualBand } from "../../../components/marketplace/ResourceSections";
import { getSessionUser } from "../../../lib/session";
import { store } from "../../../lib/store";

export default async function TalentProfileDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [user, profiles, jobs] = await Promise.all([getSessionUser(), store.talent(), store.jobs()]);
  const profile = profiles.find((item) => item.id === id || item.userId === id);
  const relatedJobs = profile ? jobs.filter((job) => job.skills.some((skill) => profile.skills.includes(skill))).slice(0, 4) : [];

  return (
    <MarketplaceShell user={user}>
      <PageHeader eyebrow="Talent profile" title={profile?.name ?? "Profile unavailable"}>
        {profile ? `${profile.location} - ${profile.availability}` : "This profile is not available or has been removed."}
      </PageHeader>
      {profile && (
        <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-10 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <Image src={profile.profilePicture ?? "/assets/candidate-review-meeting.jpg"} alt={`${profile.name} professional profile context`} width={760} height={520} priority sizes="(min-width: 1024px) 38vw, 100vw" className="h-full max-h-[420px] w-full rounded-lg object-cover shadow-xl" />
          <div className="grid content-center gap-4">
            <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold uppercase text-green-700">Professional profile</p>
              <h2 className="mt-2 text-2xl font-black">Review skills, projects, and availability before outreach</h2>
              <p className="mt-3 leading-7 text-gray-600">A strong technical profile makes the job seeker&apos;s focus clear: what they build, which tools they use, how they explain their work, and whether their availability matches the role. Private contact details and deeper history stay protected for verified hiring workflows.</p>
            </article>
            <div className="grid gap-3 sm:grid-cols-3">
              {[["Skills", profile.skills.length], ["Projects", profile.projects.length], ["Related roles", relatedJobs.length]].map(([label, value]) => <div key={label} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"><p className="text-sm font-bold text-gray-500">{label}</p><p className="mt-1 text-2xl font-black">{value}</p></div>)}
            </div>
          </div>
        </section>
      )}
      {profile && (
        <VisualBand
          eyebrow="Professional evaluation"
          title="Look beyond keywords and review the evidence"
          body="A useful talent review connects skills, project history, location, availability, and role goals. The strongest profiles make it easy to see where the job seeker can contribute."
          image="/assets/candidate-review-meeting.jpg"
          imageAlt="Employer reviewing a technical job seeker profile"
          points={["Compare skills with the exact role requirements.", "Review portfolio links and project summaries before outreach.", "Respect private contact and history boundaries.", "Use related roles to decide whether there is a credible match."]}
        />
      )}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-12 lg:grid-cols-[1fr_360px] lg:px-8">
        {profile ? (
          <>
            <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black">Professional summary</h2>
              <p className="mt-4 leading-7 text-gray-700">{profile.bio || "No profile summary has been added yet."}</p>
              <h3 className="mt-8 text-lg font-black">Skills</h3>
              <div className="mt-3 flex flex-wrap gap-2">{profile.skills.map((skill) => <span key={skill} className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-800">{skill}</span>)}</div>
              <h3 className="mt-8 text-lg font-black">Projects</h3>
              {profile.projects.length ? <ul className="mt-3 space-y-2 text-gray-700">{profile.projects.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="mt-3 text-gray-600">No project entries have been added yet.</p>}
              <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-5">
                <h3 className="font-black text-blue-950">How to evaluate this profile</h3>
                <p className="mt-2 leading-7 text-blue-950">Look for alignment between listed skills, project evidence, availability, location, and the actual role requirements. Ask for private details only through authorized hiring workflows.</p>
              </div>
            </article>
            <aside className="space-y-4">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black">Contact and links</h2>
                <p className="mt-3 text-gray-700">Private contact details are available only to verified employers with an authorized hiring workflow for this job seeker.</p>
                {profile.portfolioUrl ? <a href={profile.portfolioUrl} className="mt-4 inline-block font-bold text-green-700">Open portfolio</a> : <p className="mt-4 text-sm text-gray-600">No portfolio link has been added.</p>}
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black">Related open roles</h2>
                <div className="mt-4 grid gap-3">
                  {relatedJobs.length ? relatedJobs.map((job) => <Link key={job.id} href={`/jobs/${job.id}`} className="rounded-lg border border-gray-200 p-3 font-bold hover:border-green-300">{job.title}</Link>) : <p className="text-sm text-gray-600">No related open roles are available right now.</p>}
                </div>
              </div>
            </aside>
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center lg:col-span-2">
            <p className="text-gray-600">Browse the talent directory to find technical professionals by skill, location, portfolio evidence, and availability.</p>
            <Link href="/talent" className="mt-4 inline-block rounded-lg bg-green-600 px-5 py-3 font-bold text-white">Back to talent</Link>
          </div>
        )}
      </section>
      {profile && (
        <>
          <ProcessGrid eyebrow="Hiring review" title="Shortlist with context" intro="Use public signals first, then move to private hiring workflows only when the role fit is credible." steps={[{ title: "Check relevance", body: "Match the job seeker's strongest skills and projects to the role's day-one work." }, { title: "Review readiness", body: "Consider availability, location, and communication quality before requesting time." }, { title: "Move through workflow", body: "Use authorized employer routes for contact, interviews, and application decisions." }]} />
          <CTASection title="Found a promising profile?" body="Create a clear role or review related openings before you move the conversation into a hiring workflow." primary={{ label: "Post a role", href: "/employer/jobs/create" }} secondary={{ label: "Browse talent", href: "/talent" }} />
        </>
      )}
    </MarketplaceShell>
  );
}
