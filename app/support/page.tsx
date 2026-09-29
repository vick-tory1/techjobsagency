import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import FAQ from "../../components/marketplace/FAQ";
import PublicChrome from "../../components/marketplace/PublicChrome";
import { CTASection, ProcessGrid, VisualBand } from "../../components/marketplace/ResourceSections";
import faqData from "../../data/faq.json";
import { getSessionUser } from "../../lib/session";

const SupportChat = dynamic(() => import("../../components/marketplace/SupportChat"), {
  loading: () => (
    <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm font-semibold text-gray-600 shadow-sm">
      Loading support chat...
    </div>
  ),
});

const supportTopics = [
  { title: "Account access", body: "Login problems, password issues, Google signup problems, and profile access help." },
  { title: "Jobs and applications", body: "Find the right role, review details, apply clearly, and understand your next step." },
  { title: "Profiles and hiring", body: "Keep your skills, portfolio, and availability up to date for better matches and more interviews." },
];

const faqItems = faqData as Array<{ category: string; question: string; answer: string }>;

const contactLinks = [
  { label: "Account support", href: "/support", value: "Use the chat assistant and include the affected account email." },
  { label: "Employer help", href: "/employer", value: "Manage roles, company context, applications, and hiring decisions." },
  { label: "Job Seeker help", href: "/talent/profile", value: "Update skills, portfolio links, location, availability, and role goals." },
  { label: "Community help", href: "/community", value: "Ask for referrals, profile feedback, and interview preparation support." },
];

export default async function SupportPage() {
  const user = await getSessionUser();
  return (
    <PublicChrome user={user}>
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold uppercase text-green-700">Help & support</p>
            <h1 className="mt-2 text-4xl font-black md:text-6xl">Support that actually helps.</h1>
            <p className="mt-5 leading-8 text-gray-600">Whether you need help logging in, reviewing a role, updating your profile, or managing hiring work, we can help you move faster.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="#support-chat" className="rounded-lg bg-green-600 px-5 py-3 font-bold text-white">Open chat</Link>
              <Link href="/community" className="rounded-lg border border-gray-300 px-5 py-3 font-bold text-gray-800">Ask the community</Link>
            </div>
          </div>
          <Image src="/assets/agency-support-hub.jpg" alt="Support team helping with hiring and talent questions" width={900} height={620} priority sizes="(min-width: 1024px) 55vw, 100vw" className="h-full max-h-[560px] w-full rounded-lg object-cover shadow-xl" />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {supportTopics.map((topic) => <article key={topic.title} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-black">{topic.title}</h2><p className="mt-3 leading-7 text-gray-600">{topic.body}</p></article>)}
        </div>
      </section>
      <VisualBand
        eyebrow="Resolution paths"
        title="Get the right help for the work you are trying to finish"
        body="Hiring work touches accounts, profiles, jobs, applications, and private data. Start with the issue type so the next action is clear and your request includes the details support needs."
        image="/assets/support-operations-desk.jpg"
        imageAlt="Support team managing account and marketplace requests"
        points={["Account issue: include the affected email address.", "Job issue: include the role title and company name.", "Profile issue: include the profile or portfolio field involved.", "Application issue: include the job title and current status shown."]}
      />
      <FAQ items={faqItems} />
      <ProcessGrid eyebrow="Support process" title="Move from issue to resolution faster" intro="Clear requests help support understand whether the problem is account access, job details, profile visibility, privacy, or application progress." steps={[{ title: "Name the area", body: "Tell us whether the issue involves jobs, talent profiles, employer applications, dashboard access, admin access, or login." }, { title: "Share the context", body: "Include the account email, role name, profile link, or application involved without sending passwords or sensitive secrets." }, { title: "Use the right account", body: "Sign in with the job seeker or employer account connected to the private application or profile details." }]} />
      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-14 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div id="support-chat"><SupportChat userName={user?.name ?? ""} /></div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase text-green-700">Get in touch</p>
          <h2 className="mt-2 text-3xl font-black">Direct contact</h2>
          <p className="mt-4 leading-7 text-gray-600">Choose the help path that matches the problem so support can review the right account, role, profile, or application context.</p>
          <div className="mt-6 grid gap-3">
            {contactLinks.map((link) => <Link key={link.label} href={link.href} className="rounded-lg border border-gray-200 p-4 hover:border-green-200 hover:bg-green-50"><p className="font-black">{link.label}</p><p className="mt-1 text-sm text-gray-600">{link.value}</p></Link>)}
          </div>
        </div>
      </section>
      <CTASection title="Need help while hiring or applying?" body="Use the support chat for immediate guidance, then continue from the account area connected to your role or application." primary={{ label: "Open chat", href: "#support-chat" }} secondary={{ label: "Go to dashboard", href: "/dashboard" }} />
    </PublicChrome>
  );
}
