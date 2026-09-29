import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "../../auth";
import type { User } from "../../lib/types";
import MobileMenu from "./MobileMenu";

const primaryLinks = [
  { href: "/jobs", label: "Jobs" },
  { href: "/talent", label: "Talent" },
  { href: "/career-roadmap", label: "Careers" },
  { href: "/skill-tracks", label: "Skills" },
  { href: "/stories", label: "Stories" },
  { href: "/community", label: "Community" },
  { href: "/support", label: "Support" },
];

export function PublicHeader({ user }: { user?: User | null }) {
  const authAction = user ? (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/login" });
      }}
    >
      <button type="submit" className="w-full rounded-lg bg-gray-950 px-4 py-2 text-left text-white shadow-sm sm:w-auto sm:text-center">Logout</button>
    </form>
  ) : (
    <Link href="/signup" className="rounded-lg bg-gray-950 px-4 py-2 text-white shadow-sm">Sign up</Link>
  );

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-green-600 font-black text-white">FP</span>
          <span className="min-w-0">
            <span className="block text-xl font-black tracking-tight">Flowpilot</span>
            <span className="block text-xs font-semibold uppercase text-gray-500 sm:whitespace-nowrap">Technology hiring for real teams</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-2 text-sm font-semibold lg:flex">
          {primaryLinks.map((link) => <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">{link.label}</Link>)}
          {!user && <Link href="/login" className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">Login</Link>}
          {authAction}
        </nav>
        <MobileMenu className="lg:hidden">
          {primaryLinks.map((link) => <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">{link.label}</Link>)}
          {!user && <Link href="/login" className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">Login</Link>}
          <div className="pt-1">{authAction}</div>
        </MobileMenu>
      </div>
    </header>
  );
}

export function PublicFooter({ user }: { user?: User | null }) {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <p className="text-2xl font-black">Flowpilot</p>
          <p className="mt-3 max-w-md leading-7 text-gray-300">Technical hiring made clear. Employers publish roles, talent shares evidence, and every conversation starts with real context.</p>
          <p className="mt-5 text-sm font-semibold text-gray-400">(c) 2026 Flowpilot. All rights reserved.</p>
          <p className="mt-2 text-sm text-gray-400">For developers, designers, data analysts, cloud engineers, QA, security, and product people.</p>
        </div>
        <div>
          <p className="font-black">Marketplace</p>
          <div className="mt-3 grid gap-2 text-sm text-gray-300">
            <Link href="/jobs" className="hover:text-white">Browse jobs</Link>
            <Link href="/talent" className="hover:text-white">Browse talent</Link>
            <Link href="/career-roadmap" className="hover:text-white">Career roadmap</Link>
            <Link href="/skill-tracks" className="hover:text-white">Skill tracks</Link>
            <Link href="/hiring-process" className="hover:text-white">Hiring process</Link>
            <Link href="/stories" className="hover:text-white">Hiring insights</Link>
            <Link href="/community" className="hover:text-white">Community referrals</Link>
            <Link href="/support" className="hover:text-white">Support center</Link>
          </div>
        </div>
        <div>
          <p className="font-black">Account</p>
          <div className="mt-3 grid gap-2 text-sm text-gray-300">
            {user ? <Link href="/dashboard" className="hover:text-white">Dashboard</Link> : <Link href="/login?role=talent" className="hover:text-white">Job Seeker Sign In</Link>}
            <Link href="/signup?role=talent" className="hover:text-white">Create Job Seeker Account</Link>
            {!user && <Link href="/login?role=employer" className="hover:text-white">Employer Sign In</Link>}
            <Link href="/signup?role=employer" className="hover:text-white">Create Employer Account</Link>
            <Link href="/signup?role=community" className="hover:text-white">Community signup</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function PublicChrome({ children, user }: { children: ReactNode; user?: User | null }) {
  return (
    <main className="min-h-screen bg-[#f5f7fb] text-gray-950">
      <PublicHeader user={user} />
      {children}
      <PublicFooter user={user} />
    </main>
  );
}
