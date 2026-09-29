import Link from "next/link";
import type { ReactNode } from "react";
import type { User } from "../../lib/types";
import { signOut } from "../../auth";
import MobileMenu from "./MobileMenu";

const marketplaceLinks = [
  { href: "/jobs", label: "Find a Tech Job" },
  { href: "/talent", label: "Hire Tech Talent" },
  { href: "/employer", label: "Employer" },
  { href: "/talent/profile", label: "Profile" },
];

export default function MarketplaceShell({ children, user }: { children: ReactNode; user?: User | null }) {
  const authArea = user ? (
    <>
      <span className="rounded-full bg-green-100 px-3 py-1 text-green-800">{user.name}</span>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button type="submit" className="w-full rounded-lg px-3 py-2 text-left hover:bg-gray-100 md:w-auto">Logout</button>
      </form>
    </>
  ) : (
    <Link href="/login" className="rounded-lg px-3 py-2 hover:bg-gray-100">Login</Link>
  );

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-gray-950">
      <header className="border-b border-gray-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
          <Link href="/" className="text-xl font-black">Flowpilot</Link>
          <div className="hidden items-center gap-3 text-sm font-bold md:flex">
            {marketplaceLinks.map((link) => <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 hover:bg-gray-100">{link.label}</Link>)}
            {authArea}
          </div>
          <MobileMenu className="md:hidden">
            {marketplaceLinks.map((link) => <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 hover:bg-gray-100">{link.label}</Link>)}
            <div className="grid gap-2 pt-1">{authArea}</div>
          </MobileMenu>
        </nav>
      </header>
      {children}
    </div>
  );
}

export function PageHeader({ title, eyebrow, children }: { title: string; eyebrow?: string; children?: ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      {eyebrow && <p className="text-sm font-black uppercase text-green-700">{eyebrow}</p>}
      <h1 className="mt-2 text-4xl font-black tracking-normal md:text-5xl">{title}</h1>
      {children && <div className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">{children}</div>}
    </section>
  );
}
