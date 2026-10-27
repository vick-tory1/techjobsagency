import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import PublicChrome from "../../components/marketplace/PublicChrome";
import { getSessionUser } from "../../lib/session";

const CommunityForum = dynamic(() => import("../../components/marketplace/CommunityForum"), {
  loading: () => (
    <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm font-semibold text-gray-600 shadow-sm">
        Loading community forum...
      </div>
    </section>
  ),
});

const communityUses = [
  { title: "Referrals", body: "Share your technical focus, experience, and target role to make relevant introductions easier." },
  { title: "Portfolio and interview feedback", body: "Request feedback on portfolio presentation, interview preparation, or career decisions." },
  { title: "Role sharing", body: "Share relevant roles and help job seekers assess fit." },
  { title: "Peer support", body: "Exchange practical advice with people working toward similar technology roles." },
];

export default async function CommunityPage() {
  const user = await getSessionUser();
  return (
    <PublicChrome user={user}>
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold uppercase text-green-700">Community</p>
            <h1 className="mt-2 text-4xl font-black md:text-6xl">Community support for technology careers</h1>
            <p className="mt-5 leading-8 text-gray-600">Share roles, request portfolio feedback, practise interviews, and make relevant introductions.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/signup?role=community" className="rounded-lg bg-green-600 px-5 py-3 font-bold text-white">Join community</Link>
              <Link href="/support" className="rounded-lg border border-gray-300 px-5 py-3 font-bold text-gray-800">Contact support</Link>
            </div>
          </div>
          <Image src="/assets/innovation-team-session.jpg" alt="Community member working on a technical profile" width={900} height={620} priority sizes="(min-width: 1024px) 55vw, 100vw" className="h-full max-h-[560px] w-full rounded-lg object-cover shadow-xl" />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          {communityUses.map((item) => <article key={item.title} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-black">{item.title}</h2><p className="mt-3 leading-7 text-gray-600">{item.body}</p></article>)}
        </div>
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">Use the community to prepare for your next role</h2>
          <p className="mt-3 leading-7 text-gray-600">Request targeted feedback, prepare for interviews, and share relevant opportunities with other members.</p>
        </div>
      </section>
      <CommunityForum />
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 md:grid-cols-3 lg:px-8">
          <article className="rounded-lg border border-gray-200 p-6 shadow-sm"><h2 className="text-xl font-black">For job seekers</h2><p className="mt-3 leading-7 text-gray-600">Get feedback on your portfolio. Practice interviews. Find introductions to roles that fit.</p></article>
          <article className="rounded-lg border border-gray-200 p-6 shadow-sm"><h2 className="text-xl font-black">For employers</h2><p className="mt-3 leading-7 text-gray-600">Share openings. Community members will surface job seekers who match what you need.</p></article>
          <article className="rounded-lg border border-gray-200 p-6 shadow-sm"><h2 className="text-xl font-black">For mentors</h2><p className="mt-3 leading-7 text-gray-600">Review portfolios. Offer interview practice. Help people get better at what they do.</p></article>
        </div>
      </section>
    </PublicChrome>
  );
}
