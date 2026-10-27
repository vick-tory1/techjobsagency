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
  { title: "Account access", body: "Help with sign-in, passwords, Google authentication, and profile access." },
  { title: "Jobs and applications", body: "Help with job details, applications, and application status." },
  { title: "Profiles and hiring", body: "Help with profile details, portfolio links, availability, and employer workflows." },
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
            <h1 className="mt-2 text-4xl font-black md:text-6xl">Support for accounts, hiring, and applications</h1>
            <p className="mt-5 leading-8 text-gray-600">Get help with sign-in, job details, applications, profiles, and employer workflows.</p>
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
        title="Provide the details needed to investigate"
        body="Include the affected account, job, profile, or application so the issue can be understood in context. Do not send passwords or other secrets."
        image="/assets/support-operations-desk.jpg"
        imageAlt="Support team managing account and marketplace requests"
        points={["Account issue: include the affected email address.", "Job issue: include the role title and company name.", "Profile issue: include the profile or portfolio field involved.", "Application issue: include the job title and current status shown."]}
      />
      <FAQ items={faqItems} />
      <ProcessGrid eyebrow="Support process" title="Report an issue with context" intro="Identify the affected area and include the information needed to review it safely." steps={[{ title: "Identify the affected area", body: "Specify whether the issue concerns sign-in, jobs, talent profiles, applications, dashboard access, or admin access." }, { title: "Include relevant context", body: "Share the account email, job title, profile link, or application involved. Do not send passwords or secrets." }, { title: "Use the linked account", body: "Sign in with the job seeker or employer account connected to the private profile or application." }]} />
      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-14 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div id="support-chat"><SupportChat userName={user?.name ?? ""} /></div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase text-green-700">Get in touch</p>
          <h2 className="mt-2 text-3xl font-black">Support areas</h2>
          <p className="mt-4 leading-7 text-gray-600">Choose the area related to your issue to review the relevant account, job, profile, or application context.</p>
          <div className="mt-6 grid gap-3">
            {contactLinks.map((link) => <Link key={link.label} href={link.href} className="rounded-lg border border-gray-200 p-4 hover:border-green-200 hover:bg-green-50"><p className="font-black">{link.label}</p><p className="mt-1 text-sm text-gray-600">{link.value}</p></Link>)}
          </div>
        </div>
      </section>
      <CTASection title="Need help with an account or application?" body="Use support chat for guidance, then return to the account area associated with the job or application." primary={{ label: "Open support chat", href: "#support-chat" }} secondary={{ label: "Open dashboard", href: "/dashboard" }} />
    </PublicChrome>
  );
}
