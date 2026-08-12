import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { UserRole } from "../types/auth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const authState = location.state as { role?: UserRole; from?: string } | null;
  const requestedRole = authState?.role;
  const isSignup = location.pathname === "/signup";
  const [role, setRole] = useState<UserRole>(requestedRole ?? "job-seeker");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [primarySkill, setPrimarySkill] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [facebook, setFacebook] = useState("");
  const [x, setX] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [error, setError] = useState("");
  const roleContent = {
    "job-seeker": {
      eyebrow: "Candidate market",
      title: isSignup ? "Create a technical candidate record" : "Continue your technical job search",
      body: "Hiring teams compare candidates by practical stack, level, salary range, location, work mode, and availability. A complete candidate record keeps those signals ready when you apply to software, cloud, data, design, QA, mobile, AI, product, and security roles.",
      nameLabel: "Candidate full name",
      emailLabel: "Candidate email",
      extraLabel: "Primary tech skill",
      cta: isSignup ? "Create candidate access" : "Open job search",
      proof: "Live listings include remote-first technical roles with company, location, seniority, employment type, salary notes, and source details.",
      image: "/images/candidate-engineer.webp",
      imageAlt: "Technical candidate working at a desk",
    },
    employer: {
      eyebrow: "Employer hiring",
      title: isSignup ? "Create a technical hiring account" : "Continue applicant discovery",
      body: "Technical hiring decisions depend on evidence: role fit, production experience, salary expectation, availability, location, and depth in the required stack. Employer access keeps applicant review focused on qualified candidates for active engineering and product teams.",
      nameLabel: "Hiring manager name",
      emailLabel: "Work email",
      extraLabel: "Company hiring for tech roles",
      cta: isSignup ? "Create employer access" : "Open applicant search",
      proof: "Applicant records surface role target, primary skills, experience level, expected salary, preferred work mode, and availability.",
      image: "/images/recruiting-workspace.jpg",
      imageAlt: "Recruiting workspace with hiring materials",
    },
  }[role];

  const handleImageChange = (file?: File) => {
    if (!file) {
      setProfileImage("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Upload an image file for the profile photo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setProfileImage(typeof reader.result === "string" ? reader.result : "");
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Enter your full name to continue.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid work email address.");
      return;
    }

    if (role === "employer" && !company.trim()) {
      setError("Employer accounts need a company name.");
      return;
    }

    if (role === "job-seeker" && !primarySkill.trim()) {
      setError("Add the main technical skill employers should match you against.");
      return;
    }

    if (role === "job-seeker" && (!whatsapp.trim() || !facebook.trim() || !x.trim() || !linkedin.trim() || !portfolio.trim())) {
      setError("Job seeker profiles need WhatsApp, Facebook, X, LinkedIn, and portfolio links.");
      return;
    }

    login({ name, email, role, company, primarySkill, profileImage, whatsapp, facebook, x, linkedin, portfolio });

    const roleHome = authState?.from ?? (role === "job-seeker" ? "/user/jobs" : "/user/applicants");
    navigate(roleHome, { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#f6f7fb] px-4 py-8 text-gray-950">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative isolate min-h-[420px] overflow-hidden bg-gray-950 p-6 text-white md:p-8">
          <img
            src={roleContent.image}
            alt={roleContent.imageAlt}
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gray-950/70" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent" />
          <div className="relative flex min-h-full flex-col">
            <Link to="/" className="text-sm font-bold text-green-200">
              Back to public site
            </Link>
            <h1 className="mt-8 text-4xl font-black leading-tight">
              {isSignup ? "Technical hiring starts with accurate records." : "Return to live technical hiring data."}
            </h1>
            <p className="mt-4 text-gray-200">
              TechHire Market organizes the details that matter in technical hiring: role discipline, stack, seniority, work mode, salary context, applicant readiness, and employer demand.
            </p>
            <div className="mt-8 space-y-3">
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <p className="font-bold">Candidate section</p>
                <p className="mt-1 text-sm text-gray-200">Software, data, cloud, DevOps, design, QA, mobile, AI, product, and security jobs are grouped by stack, seniority, work mode, salary notes, and source.</p>
              </div>
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <p className="font-bold">Employer section</p>
                <p className="mt-1 text-sm text-gray-200">Applicant profiles highlight practical skills, target role, years of experience, location, availability, salary expectation, and remote or hybrid preference.</p>
              </div>
            </div>
          </div>
        </aside>

        <section className="p-6 md:p-8">
          <p className="text-sm font-bold uppercase text-green-700">{roleContent.eyebrow}</p>
          <h2 className="mt-2 text-3xl font-black">{roleContent.title}</h2>
          <p className="mt-3 text-gray-600">
            {roleContent.body}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("job-seeker")}
              className={`rounded-lg border px-4 py-3 text-left font-bold ${
                role === "job-seeker" ? "border-green-600 bg-green-50 text-green-700 shadow-sm" : "border-gray-200"
              }`}
            >
              Candidate
              <span className="mt-1 block text-xs font-medium text-gray-500">Software, data, cloud, design, security</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("employer")}
              className={`rounded-lg border px-4 py-3 text-left font-bold ${
                role === "employer" ? "border-green-600 bg-green-50 text-green-700 shadow-sm" : "border-gray-200"
              }`}
            >
              Employer
              <span className="mt-1 block text-xs font-medium text-gray-500">Skills, availability, salary, location</span>
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-gray-700">{roleContent.nameLabel}</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              />
            </label>

            {role === "employer" ? (
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-gray-700">{roleContent.extraLabel}</span>
                <input
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                />
              </label>
            ) : (
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-gray-700">{roleContent.extraLabel}</span>
                <input
                  value={primarySkill}
                  onChange={(event) => setPrimarySkill(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                />
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-gray-700">{roleContent.emailLabel}</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              />
            </label>

            {role === "job-seeker" && (
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-gray-700">WhatsApp contact</span>
                  <input
                    value={whatsapp}
                    onChange={(event) => setWhatsapp(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-gray-700">Facebook link</span>
                  <input
                    value={facebook}
                    onChange={(event) => setFacebook(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-gray-700">X link</span>
                  <input
                    value={x}
                    onChange={(event) => setX(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-gray-700">LinkedIn link</span>
                  <input
                    value={linkedin}
                    onChange={(event) => setLinkedin(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  />
                </label>
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-bold text-gray-700">Portfolio link</span>
                  <input
                    value={portfolio}
                    onChange={(event) => setPortfolio(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  />
                </label>
              </div>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-gray-700">Profile image <span className="font-medium text-gray-500">(optional)</span></span>
              <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center">
                {profileImage ? (
                  <img src={profileImage} alt={`${name || "Profile"} preview`} className="h-20 w-20 rounded-full object-cover" />
                ) : (
                  <div className="grid h-20 w-20 place-items-center rounded-full bg-green-100 text-2xl font-black text-green-700">
                    {(name.trim()[0] || role[0]).toUpperCase()}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleImageChange(event.target.files?.[0])}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-gray-950 file:px-4 file:py-2 file:font-bold file:text-white"
                />
              </div>
            </label>
          </div>

          {error && <p className="mt-4 rounded-lg bg-black-50 p-3 text-sm text-black-700">{error}</p>}

          <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            <p className="font-bold text-gray-800">{role === "job-seeker" ? "Job market signal" : "Applicant signal"}</p>
            <p className="mt-1">{roleContent.proof}</p>
          </div>

          <button type="button" onClick={handleSubmit} className="mt-6 w-full rounded-lg bg-gray-950 px-4 py-3 font-bold text-white shadow-sm hover:bg-gray-800">
            {roleContent.cta}
          </button>
        </section>
      </div>
    </main>
  );
}
