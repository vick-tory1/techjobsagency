import type { Metadata } from "next";
import type { Session } from "next-auth";
import { auth } from "../auth";
import ScrollReveal from "../components/marketplace/ScrollReveal";
import SessionExpiryGuard from "../components/marketplace/SessionExpiryGuard";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.AUTH_URL ?? "http://localhost:3000"),
  title: {
    default: "Flowpilot | Technology Recruitment Platform",
    template: "%s | Flowpilot",
  },
  description: "Flowpilot connects technology employers with software, data, cloud, security, product, QA, and design talent through real jobs, profiles, applications, and hiring workflows.",
  openGraph: {
    title: "Flowpilot | Technology Recruitment Platform",
    description: "A modern technology job agency and talent marketplace for employers and technical professionals.",
    type: "website",
    url: "/",
    siteName: "Flowpilot",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let session: Session | null = null;
  let hasInvalidSession = false;

  try {
    session = await auth();
  } catch {
    // An AUTH_SECRET change makes existing JWT cookies unreadable. Treat that
    // cookie as a signed-out visitor instead of failing every public page.
    hasInvalidSession = true;
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ScrollReveal />
        <SessionExpiryGuard expiresAt={session?.expires} hasInvalidSession={hasInvalidSession} />
        {children}
      </body>
    </html>
  );
}
