"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { dashboardForRoles } from "../../lib/auth-utils";
import type { Role } from "../../lib/types";
import LazyVideo from "./LazyVideo";
import PasswordInput from "./PasswordInput";

type AuthRole = Extract<Role, "talent" | "employer">;
type Media =
  | { type: "image"; src: string; alt: string }
  | { type: "gif"; src: string; alt: string }
  | { type: "video"; src: string; poster: string; alt: string };

type AuthContent = {
  eyebrow: string;
  title: string;
  body: string;
  nameLabel: string;
  emailLabel: string;
  extraLabel: string;
  cta: string;
  proofTitle: string;
  proof: string;
  sideTitle: string;
  sideBody: string;
  media: Media;
  highlights: string[];
};

function authContent(role: AuthRole, isSignup: boolean): AuthContent {
  const key = `${role}-${isSignup ? "signup" : "login"}`;
  const content: Record<string, AuthContent> = {
    "talent-signup": {
      eyebrow: "Job Seeker account",
      title: "Create Job Seeker Account",
      body: "Create a focused profile that gives hiring teams the context to understand your skills, portfolio, and next move.",
      nameLabel: "Your full name",
      emailLabel: "Personal email address",
      extraLabel: "Primary technical skill",
      cta: "Sign up",
      proofTitle: "What hiring teams will see",
      proof: "Your headline skill, LinkedIn, portfolio, and the work you choose to make visible. Your application history stays private.",
      sideTitle: "Make your experience easy for employers to understand.",
      sideBody: "A complete profile helps the Flowpilot team and employers understand where your experience fits before the first conversation.",
      media: { type: "image", src: "/assets/portfolio-code-review.jpg", alt: "Job seeker reviewing a technical portfolio on a laptop" },
      highlights: ["Lead with your strongest skill", "Share a portfolio that proves it", "Track every application privately"],
    },
    "talent-login": {
      eyebrow: "Job Seeker account",
      title: "Job Seeker Sign In",
      body: "Return to the roles, applications, and profile details that keep your next move on track.",
      nameLabel: "Your full name",
      emailLabel: "Job seeker email address",
      extraLabel: "Primary technical skill",
      cta: "Login",
      proofTitle: "Your job search workspace",
      proof: "Review applications, keep your profile current, and arrive prepared for each employer conversation.",
      sideTitle: "Keep your job search moving with purpose.",
      sideBody: "Return to the applications, opportunities, and profile details that help you make a well-informed next move.",
      media: { type: "gif", src: "/assets/job-seeker-tech.gif", alt: "Animated developer working at a laptop with code on screen" },
      highlights: ["Application status in one place", "Portfolio and profile controls", "Roles matched to your skills"],
    },
    "employer-signup": {
      eyebrow: "Employer account",
      title: "Create Employer Account",
      body: "Set up your company account to publish role briefs, review job seeker evidence, and keep every decision in context.",
      nameLabel: "Your name",
      emailLabel: "Company email address",
      extraLabel: "Company or client name",
      cta: "Sign up",
      proofTitle: "What your team can do",
      proof: "Create clear role briefs, compare talent against the work, and move applications through a shared hiring workflow.",
      sideTitle: "Start hiring with a brief people can trust.",
      sideBody: "A clear role brief helps Flowpilot connect your team with job seekers who understand the opportunity and its expectations.",
      media: { type: "video", src: "/assets/team-tech-meeting.mp4", poster: "/assets/technical-delivery-team.jpg", alt: "Technology team collaborating during a hiring planning session" },
      highlights: ["Publish useful role briefs", "Review proof of work with context", "Keep the team aligned on next steps"],
    },
    "employer-login": {
      eyebrow: "Employer account",
      title: "Employer Sign In",
      body: "Pick up open roles, job seeker reviews, and hiring decisions without losing the thread of your search.",
      nameLabel: "Your name",
      emailLabel: "Company email address",
      extraLabel: "Company or client name",
      cta: "Login",
      proofTitle: "Your hiring workspace",
      proof: "See the roles you are running, compare job seekers against the brief, and keep reviews moving with your team.",
      sideTitle: "Hiring decisions are easier when the evidence is close.",
      sideBody: "Come back to a workspace built around the role, the job seeker, and the decision your team needs to make.",
      media: { type: "image", src: "/assets/employer-login.jpg", alt: "Hiring team collaborating around a laptop" },
      highlights: ["Active roles and job seeker reviews", "Portfolio-led shortlisting", "Clear application decisions"],
    },
  };

  return content[key];
}

function AuthMedia({ media }: { media: Media }) {
  if (media.type === "video") {
    return <LazyVideo src={media.src} poster={media.poster} label={media.alt} autoPlay className="absolute inset-0 z-0 h-full w-full" />;
  }

  if (media.type === "gif") {
    return <Image src={media.src} alt={media.alt} fill unoptimized sizes="(min-width: 1024px) 42vw, 100vw" className="absolute inset-0 z-0 h-full w-full object-cover" />;
  }

  return <img src={media.src} alt={media.alt} className="absolute inset-0 z-0 h-full w-full object-cover" />;
}

export default function AuthForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isSignup = pathname === "/signup";
  const requestedRole = searchParams.get("role");
  const authError = searchParams.get("error");
  const [role, setRole] = useState<AuthRole>(requestedRole === "employer" || requestedRole === "talent" ? requestedRole : "talent");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [primarySkill, setPrimarySkill] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [facebook, setFacebook] = useState("");
  const [x, setX] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [error, setError] = useState(() => authError ? (isSignup ? "Google signup could not be completed. Use email and password instead." : "Google login could not be completed. Create an account first or use email and password.") : "");
  const [isLoading, setIsLoading] = useState(false);
  const roleContent = authContent(role, isSignup);
  const alternateRole = role === "talent" ? "employer" : "talent";
  const alternateLabel = role === "talent" ? "employer" : "job seeker";
  const modeLink = isSignup ? `/login?role=${role}` : `/signup?role=${role}`;

  function selectRole(nextRole: AuthRole) {
    setRole(nextRole);
    setError("");
  }

  function handleImageChange(file?: File) {
    if (!file) {
      setProfilePicture("");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file for the profile photo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setProfilePicture(typeof reader.result === "string" ? reader.result : "");
    reader.readAsDataURL(file);
  }

  async function submitForm() {
    setError("");
    if (isSignup && !name.trim()) {
      setError("Enter your full name so employers know who they are reviewing.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Use a password with at least 8 characters.");
      return;
    }
    if (isSignup && role === "employer" && !company.trim()) {
      setError("Add the company or client name for this hiring account.");
      return;
    }
    if (isSignup && role === "talent" && !primarySkill.trim()) {
      setError("Add the main technical skill to feature first.");
      return;
    }
    if (isSignup && role === "talent" && (!linkedin.trim() || !portfolio.trim())) {
      setError("Add your LinkedIn and portfolio links so employers can review your work.");
      return;
    }

    setIsLoading(true);
    const result = await signIn("credentials", { redirect: false, mode: isSignup ? "signup" : "login", name, email, password, role, company, primarySkill, profilePicture, whatsapp, facebook, x, linkedin, portfolio });
    setIsLoading(false);

    if (result?.error) {
      setError(isSignup ? "We could not create that account. This email may already be registered." : "The email or password is not correct.");
      return;
    }
    router.push(dashboardForRoles([role]));
    router.refresh();
  }

  async function continueWithGoogle() {
    setError("");
    setIsLoading(true);
    try {
      const config = await fetch("/api/auth/providers", { cache: "no-store" });
      if (!config.ok) throw new Error("Google authentication could not be checked right now.");
      const providers = await config.json();
      if (!providers.google) {
        setError("Google sign-in is not connected yet. Use email and password, or add a Google client ID and secret in .env.local.");
        return;
      }
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Google authentication could not start. Please try email and password.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb] px-4 py-6 text-gray-950 lg:py-10">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl lg:min-h-[720px] lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative isolate flex min-h-[410px] flex-col overflow-hidden bg-white p-6 text-white md:p-8">
          <AuthMedia media={roleContent.media} />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          <div className="relative z-20">
            <Link href="/" className="text-sm font-bold text-green-200 hover:text-white">Back to Flowpilot</Link>
            <p className="mt-10 text-xs font-bold uppercase tracking-[0.16em] text-green-200">{roleContent.eyebrow}</p>
            <h1 className="mt-3 max-w-md text-3xl font-black leading-tight md:text-4xl">{roleContent.sideTitle}</h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-gray-200">{roleContent.sideBody}</p>
          </div>
          <div className="relative z-20 mt-auto pt-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-200">Built for this moment</p>
            <div className="mt-3 grid gap-2">
              {roleContent.highlights.map((item) => <p key={item} className="border border-white/25 bg-white/15 px-3 py-2.5 text-sm font-semibold text-white backdrop-blur-sm">{item}</p>)}
            </div>
          </div>
        </aside>
        <section className="p-5 md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-green-700">{roleContent.eyebrow}</p>
          <h2 className="mt-2 max-w-xl text-3xl font-black leading-tight md:text-4xl">{roleContent.title}</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600">{roleContent.body}</p>

          <div className="mt-6 grid grid-cols-2 gap-3" aria-label="Choose account type">
            <button type="button" onClick={() => selectRole("talent")} aria-pressed={role === "talent"} className={`border px-3 py-3 text-left ${role === "talent" ? "border-green-600 bg-green-50 text-green-800 shadow-sm" : "border-gray-200 text-gray-700 hover:border-gray-400"}`}><span className="block font-bold">Job Seeker</span><span className="mt-1 block text-xs font-medium text-gray-500">Find and manage your next role</span></button>
            <button type="button" onClick={() => selectRole("employer")} aria-pressed={role === "employer"} className={`border px-3 py-3 text-left ${role === "employer" ? "border-green-600 bg-green-50 text-green-800 shadow-sm" : "border-gray-200 text-gray-700 hover:border-gray-400"}`}><span className="block font-bold">Employer</span><span className="mt-1 block text-xs font-medium text-gray-500">Run a structured hiring process</span></button>
          </div>

          <div className="mt-5 space-y-3">
            {isSignup && <label className="block"><span className="mb-1 block text-sm font-bold text-gray-700">{roleContent.nameLabel}</span><input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" className="w-full border border-gray-300 px-3 py-2.5 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" /></label>}
            {isSignup && <label className="block"><span className="mb-1 block text-sm font-bold text-gray-700">{roleContent.extraLabel}</span><input value={role === "employer" ? company : primarySkill} onChange={(event) => role === "employer" ? setCompany(event.target.value) : setPrimarySkill(event.target.value)} className="w-full border border-gray-300 px-3 py-2.5 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" /></label>}
            <label className="block"><span className="mb-1 block text-sm font-bold text-gray-700">{roleContent.emailLabel}</span><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" className="w-full border border-gray-300 px-3 py-2.5 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" /></label>
            <PasswordInput label="Password" value={password} onChange={setPassword} />
            {isSignup && role === "talent" && <div className="grid gap-3 md:grid-cols-2"><input value={linkedin} onChange={(event) => setLinkedin(event.target.value)} placeholder="LinkedIn link" className="border border-gray-300 px-3 py-2.5 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" /><input value={portfolio} onChange={(event) => setPortfolio(event.target.value)} placeholder="Portfolio link" className="border border-gray-300 px-3 py-2.5 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" /><input value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} placeholder="WhatsApp contact (optional)" className="border border-gray-300 px-3 py-2.5 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" /><input value={facebook} onChange={(event) => setFacebook(event.target.value)} placeholder="Facebook link (optional)" className="border border-gray-300 px-3 py-2.5 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" /><input value={x} onChange={(event) => setX(event.target.value)} placeholder="X link (optional)" className="border border-gray-300 px-3 py-2.5 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 md:col-span-2" /></div>}
            {isSignup && <label className="block"><span className="mb-1 block text-sm font-bold text-gray-700">Profile image <span className="font-medium text-gray-500">(optional)</span></span><input type="file" accept="image/*" onChange={(event) => handleImageChange(event.target.files?.[0])} className="w-full border border-gray-300 bg-white px-3 py-2 text-sm file:mr-4 file:border-0 file:bg-gray-950 file:px-3 file:py-1.5 file:font-bold file:text-white" /></label>}
          </div>
          {error && <p role="alert" className="mt-4 border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div className="mt-4 border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600"><p className="font-bold text-gray-900">{roleContent.proofTitle}</p><p className="mt-1 leading-6">{roleContent.proof}</p></div>
          <button type="button" onClick={submitForm} disabled={isLoading} className="mt-4 w-full bg-green-700 px-4 py-3 font-bold text-white shadow-sm hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-500">{isLoading ? (isSignup ? "Creating account..." : "Signing in...") : roleContent.cta}</button>
          <div className="my-4 flex items-center gap-3 text-xs font-bold uppercase text-gray-400"><span className="h-px flex-1 bg-gray-200" />or<span className="h-px flex-1 bg-gray-200" /></div>
          <button type="button" onClick={continueWithGoogle} disabled={isLoading} className="w-full border border-gray-300 bg-white px-4 py-3 font-bold text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-100">{isLoading ? "Opening Google..." : "Continue with Google"}</button>
          <Link href="/admin/login" className="mt-4 block text-center text-sm font-bold text-gray-600 hover:text-gray-950">Admin login</Link>
          <p className="mt-4 border border-gray-200 px-4 py-3 text-center text-sm font-bold text-gray-800">{isSignup ? "Already have an account?" : "New to Flowpilot?"}{" "}<Link href={modeLink} className="text-green-700 underline-offset-4 hover:underline">{isSignup ? `Sign in as a ${role === "talent" ? "job seeker" : "employer"}` : `Create a ${role === "talent" ? "job seeker" : "employer"} account`}</Link></p>
          <p className="mt-3 text-center text-sm text-gray-500">Need the other workspace? <button type="button" onClick={() => selectRole(alternateRole)} className="font-bold text-green-700 underline-offset-4 hover:underline">Continue as a {alternateLabel}</button></p>
        </section>
      </div>
    </main>
  );
}
