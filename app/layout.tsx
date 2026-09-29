import type { Metadata } from "next";
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
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ScrollReveal />
        <SessionExpiryGuard expiresAt={session?.expires} />
        {children}
      </body>
    </html>
  );
}
