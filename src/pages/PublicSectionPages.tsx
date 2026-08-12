import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { TechJob } from "../data/techJobs";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useRegisteredUsers } from "../hooks/useAuth";
import { useTechJobs } from "../hooks/useTechJobs";

type HiringStory = {
  title: string;
  url: string;
  author: string;
  points: number;
};

const workModeOptions: TechJob["workMode"][] = ["Remote", "Hybrid", "On-site"];
const levelOptions: TechJob["level"][] = ["Junior", "Mid-level", "Senior", "Lead"];
const employmentTypeOptions: TechJob["employmentType"][] = ["Full-time", "Contract", "Internship"];


function PublicHeader() {
  const { user, logout, hasRegisteredAccount } = useAuth();
  const startActionLabel = user ? "Logout" : hasRegisteredAccount ? "Login" : "SignUp";
  const startActionPath = hasRegisteredAccount ? "/login" : "/signup";

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-green-600 font-black text-white">TH</span>
          <span>
            <span className="block text-xl font-black tracking-tight">TechHire Market</span>
            <span className="block text-xs font-semibold uppercase text-gray-500">Private tech hiring</span>
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold">
          <Link to="/jobs" className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">Jobs</Link>
          <Link to="/talent" className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">Talent</Link>
          <Link to="/stories" className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">Stories</Link>
          {user ? (
            <button type="button" onClick={logout} className="rounded-lg bg-gray-950 px-4 py-2 text-white shadow-sm">
              Logout
            </button>
          ) : (
            <Link to={startActionPath} className="rounded-lg bg-gray-950 px-4 py-2 text-white shadow-sm">
              {startActionLabel}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

function PublicFooter() {
  const { user, logout, hasRegisteredAccount } = useAuth();
  const startActionLabel = user ? "Logout" : hasRegisteredAccount ? "Login" : "SignUp";
  const startActionPath = hasRegisteredAccount ? "/login" : "/signup";

  return (
    <footer className="border-t border-gray-800 bg-gray-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <p className="text-2xl font-black">TechHire Market</p>
          <p className="mt-3 max-w-md leading-7 text-gray-300">
            Technical hiring workflows for software engineering, product design, data, cloud, DevOps, and cyber security roles.
          </p>
          <p className="mt-5 text-sm font-semibold text-gray-400">
            Copyright © 2026 Adams Ekpe, aka YHWH's Chosen. All rights reserved.
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Built by Adams Ekpe, a web developer, graphic designer, and cyber security personnel.
          </p>
        </div>
        <div>
          <p className="font-black">Explore</p>
          <div className="mt-3 grid gap-2 text-sm text-gray-300">
            <Link to="/jobs" className="hover:text-white">Open roles</Link>
            <Link to="/talent" className="hover:text-white">Talent profiles</Link>
            <Link to="/stories" className="hover:text-white">Stories</Link>
          </div>
        </div>
        <div>
          <p className="font-black">Start</p>
          <div className="mt-3 grid gap-2 text-sm text-gray-300">
            {user ? (
              <button type="button" onClick={logout} className="w-fit text-left hover:text-white">Logout</button>
            ) : (
              <Link to={startActionPath} className="hover:text-white">{startActionLabel}</Link>
            )}
            <Link to="/signup" state={{ role: "job-seeker" }} className="hover:text-white">Job seeker SignUp</Link>
            <Link to="/signup" state={{ role: "employer" }} className="hover:text-white">Employer SignUp</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f5f7fb] text-gray-950">
      <PublicHeader />
      {children}
      <PublicFooter />
    </main>
  );
}

export function PublicJobsPage() {
  const { jobs, status } = useTechJobs(120);
  const [query, setQuery] = useState("");
  const [workMode, setWorkMode] = useState("All");
  const [level, setLevel] = useState("All");
  const [employmentType, setEmploymentType] = useState("All");
  const filteredJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return jobs.filter((job) => {
      const searchable = [job.title, job.company, job.category, job.location, job.level, job.workMode, job.employmentType, ...job.skills]
        .join(" ")
        .toLowerCase();

      return (
        (!normalizedQuery || searchable.includes(normalizedQuery)) &&
        (workMode === "All" || job.workMode === workMode) &&
        (level === "All" || job.level === level) &&
        (employmentType === "All" || job.employmentType === employmentType)
      );
    });
  }, [employmentType, jobs, level, query, workMode]);

  return (
    <PageShell>
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase text-green-700">Jobs</p>
            <h1 className="mt-2 text-4xl font-black md:text-6xl">Available tech roles across every major discipline.</h1>
            <p className="mt-5 leading-8 text-gray-600">
              Review software engineering, product design, cloud, DevOps, data, QA, mobile, AI, product, and cyber security openings from a free live jobs API, with fallback context roles when the feed is unavailable.
            </p>
            <p className="mt-5 rounded-lg bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">{status}. Showing {filteredJobs.length} of {jobs.length} roles.</p>
            <Link to="/signup" state={{ role: "job-seeker" }} className="mt-7 inline-block rounded-lg bg-green-600 px-5 py-3 font-bold text-white">
              Search jobs privately
            </Link>
          </div>
          <img src="/images/recruiting-workspace.jpg" alt="Hiring workspace" className="h-full max-h-[520px] w-full rounded-lg object-cover shadow-xl" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="mb-6 grid gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_180px_180px_180px]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search role, company, stack, location..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          />
          <select value={workMode} onChange={(event) => setWorkMode(event.target.value)} className="rounded-lg border border-gray-300 px-4 py-3">
            <option>All</option>
            {workModeOptions.map((mode) => (
              <option key={mode}>{mode}</option>
            ))}
          </select>
          <select value={level} onChange={(event) => setLevel(event.target.value)} className="rounded-lg border border-gray-300 px-4 py-3">
            <option>All</option>
            {levelOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select value={employmentType} onChange={(event) => setEmploymentType(event.target.value)} className="rounded-lg border border-gray-300 px-4 py-3">
            <option>All</option>
            {employmentTypeOptions.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-5">
          {filteredJobs.map((job) => (
            <article key={job.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-2xl font-black">{job.title}</h2>
                  <p className="mt-1 text-gray-600">{job.company} - {job.location}</p>
                  <p className="mt-3 max-w-3xl leading-7 text-gray-600">
                    Technical requirements: {job.skills.join(", ")}. Category: {job.category}. Role level: {job.level}. Work mode: {job.workMode}. Employment type: {job.employmentType}.
                  </p>
                </div>
                <a href={job.url} target={job.source === "Live Remotive" ? "_blank" : undefined} rel="noreferrer" className="rounded-lg bg-gray-950 px-5 py-3 text-center font-bold text-white">
                  Apply with profile
                </a>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-gray-100 px-3 py-1">{job.workMode}</span>
                <span className="rounded-full bg-gray-100 px-3 py-1">{job.level}</span>
                <span className="rounded-full bg-gray-100 px-3 py-1">{job.employmentType}</span>
                <span className="rounded-full bg-green-100 px-3 py-1 text-green-800">{job.salary}</span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-800">{job.source}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

export function PublicTalentPage() {
  return (
    <PageShell>
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-2 lg:px-8">
          <img src="/images/candidate-engineer.webp" alt="Talent profile" className="h-full max-h-[520px] w-full rounded-lg object-cover shadow-xl" />
          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold uppercase text-green-700">Talent</p>
            <h1 className="mt-2 text-4xl font-black md:text-6xl">Technical talent information by skill, discipline, and availability.</h1>
            <p className="mt-5 leading-8 text-gray-600">
              Candidate profiles show practical hiring details: technical stack, design tools, security experience, cloud exposure, salary expectation, location, and preferred work mode.
            </p>
            <Link to="/signup" state={{ role: "employer" }} className="mt-7 w-fit rounded-lg bg-gray-950 px-5 py-3 font-bold text-white">
              Find applicants
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {talentProfiles.map((profile) => (
            <article key={profile.name} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <img src={profile.image} alt={profile.name} className="h-72 w-full object-cover" />
              <div className="p-6">
                <p className="text-xl font-black">{profile.name}</p>
                <p className="mt-1 text-sm font-semibold text-green-700">{profile.title}</p>
                <p className="mt-4 leading-7 text-gray-600">{profile.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

export function PublicStoriesPage() {
  const [stories, setStories] = useState<HiringStory[]>(fallbackStories);
  const [storiesStatus, setStoriesStatus] = useState("React, TypeScript, cloud security, AI, DevOps, UX, and remote-first hiring signals");

  useEffect(() => {
    const controller = new AbortController();

    async function loadStories() {
      try {
        const response = await fetch(
          "https://hn.algolia.com/api/v1/search_by_date?query=tech%20hiring&tags=story&hitsPerPage=9",
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error("Unable to load stories");

        const data = await response.json();
        const nextStories = data.hits
          .filter((story: { title?: string; url?: string }) => story.title && story.url)
          .slice(0, 9)
          .map((story: { title: string; url: string; author?: string; points?: number }) => ({
            title: story.title,
            url: story.url,
            author: story.author ?? "Job market feed",
            points: story.points ?? 0,
          }));

        if (nextStories.length > 0) {
          const filledStories = [...nextStories, ...fallbackStories].slice(0, 9);
          setStories(filledStories);
          setStoriesStatus("Active signals across engineering roles, cloud teams, product design, cyber security, and remote hiring");
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setStoriesStatus("Engineering, design, data, cloud, and cyber security hiring signals for current job searches");
        }
      }
    }

    loadStories();
    return () => controller.abort();
  }, []);

  const featuredStory = useMemo(() => stories[0], [stories]);

  return (
    <PageShell>
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase text-green-700">Stories</p>
            <h1 className="mt-2 text-4xl font-black md:text-6xl">Tech job signals for engineering, design, cloud, data, and security roles.</h1>
            <p className="mt-5 leading-8 text-gray-600">
              React, TypeScript, DevOps, AWS, cyber security, AI tooling, UX systems, remote roles, hybrid teams, salary bands, and interview readiness shape the opportunities tracked here.
            </p>
            <p className="mt-5 rounded-lg bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">{storiesStatus}</p>
          </div>
          <div className="overflow-hidden rounded-lg bg-gray-950 text-white shadow-xl">
            <img src="/images/testimonial-developer.jpg" alt="Story feature" className="h-72 w-full object-cover opacity-90" />
            <div className="p-6">
              <p className="text-sm font-bold uppercase text-green-200">Featured story</p>
              <h2 className="mt-2 text-2xl font-black">{featuredStory.title}</h2>
              <p className="mt-3 text-sm text-gray-300">By {featuredStory.author} · {featuredStory.points} points</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story, index) => (
            <a
              key={`${story.title}-${index}`}
              href={story.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:border-green-200 hover:bg-green-50"
            >
              <p className="text-sm font-bold uppercase text-gray-500">Story {index + 1}</p>
              <h2 className="mt-3 text-xl font-black">{story.title}</h2>
              <p className="mt-4 text-sm text-gray-600">By {story.author} · {story.points} points</p>
            </a>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
