import { useEffect, useState } from "react";
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

export default function JobWebsite() {
  const { user, logout, hasRegisteredAccount } = useAuth();
  const registeredUsers = useRegisteredUsers();
  const { jobs: activeJobs, status: jobsStatus } = useTechJobs(80);
  const [stories, setStories] = useState<HiringStory[]>([]);
  const [storiesStatus, setStoriesStatus] = useState("Loading hiring stories from Hacker News");
  const registeredEmployers = registeredUsers.filter((registeredUser) => registeredUser.role === "employer");
  const registeredJobSeekers = registeredUsers.filter((registeredUser) => registeredUser.role === "job-seeker");
  const remoteJobs = activeJobs.filter((job) => job.workMode === "Remote").length;
  const employerCount = new Set(activeJobs.map((job) => job.company)).size + registeredEmployers.length;
  const roleCategories = Array.from(new Set(activeJobs.map((job) => job.category))).slice(0, 4);
  const stats = [
    { label: "Active tech roles", value: String(activeJobs.length) },
    { label: "Remote roles", value: String(remoteJobs) },
    { label: "Hiring teams", value: String(employerCount) },
  ];
  const startActionLabel = user ? "Logout" : hasRegisteredAccount ? "Login" : "SignUp";
  const startActionPath = hasRegisteredAccount ? "/login" : "/signup";

  useEffect(() => {
    const controller = new AbortController();

    async function loadStories() {
      try {
        const response = await fetch(
          "https://hn.algolia.com/api/v1/search_by_date?query=tech%20hiring&tags=story&hitsPerPage=3",
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error("Unable to load stories");

        const data = await response.json();
        const nextStories = data.hits
          .filter((story: { title?: string; url?: string }) => story.title && story.url)
          .slice(0, 3)
          .map((story: { title: string; url: string; author?: string; points?: number }) => ({
            title: story.title,
            url: story.url,
            author: story.author ?? "Job market feed",
            points: story.points ?? 0,
          }));

        if (nextStories.length > 0) {
          setStories(nextStories);
          setStoriesStatus("Active signals across engineering roles, cloud teams, product design, cyber security, and remote hiring");
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setStories([]);
          setStoriesStatus("Hiring stories API is unavailable right now");
        }
      }
    }

    loadStories();
    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-gray-950">
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

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-center">
            <p className="w-fit rounded-full bg-green-50 px-3 py-1 text-sm font-bold uppercase text-green-700">
              Tech personnel only
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
              Technical roles, applicant profiles, and hiring signals for tech teams.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              Search software engineering, product design, data, cloud, DevOps, and cyber security opportunities with role, skill, salary, location, and work-mode context.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup" state={{ role: "job-seeker" }} className="rounded-lg bg-green-600 px-5 py-3 font-bold text-white shadow-sm hover:bg-green-700">
                Search tech jobs
              </Link>
              <Link to="/signup" state={{ role: "employer" }} className="rounded-lg border border-gray-300 px-5 py-3 font-bold text-gray-800 hover:bg-gray-50">
                Find tech applicants
              </Link>
            </div>
            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              {stats.map((item) => (
                <div key={item.label} className="border-l border-gray-200 pl-4">
                  <p className="text-2xl font-black">{item.value}</p>
                  <p className="mt-1 text-sm text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[520px] overflow-hidden rounded-lg bg-gray-950 shadow-2xl">
            <img
              src="/images/flams.jpeg"
              alt="Recruiting team working together in a modern office"
              className="h-full min-h-[520px] w-full object-cover opacity-90"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-lg bg-white p-4 shadow-xl sm:inset-x-6 sm:bottom-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase text-green-700">Live market snapshot</p>
                  <h2 className="mt-1 text-2xl font-black">{activeJobs[0]?.title ?? "No live API role loaded yet"}</h2>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-800">{activeJobs[0]?.workMode ?? "Tech"}</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                <div className="rounded-lg bg-gray-100 p-3">
                  <p className="font-black">{activeJobs.length}</p>
                  <p className="text-gray-500">roles</p>
                </div>
                <div className="rounded-lg bg-gray-100 p-3">
                  <p className="font-black">{remoteJobs}</p>
                  <p className="text-gray-500">remote</p>
                </div>
                <div className="rounded-lg bg-gray-100 p-3">
                  <p className="font-black">{employerCount}</p>
                  <p className="text-gray-500">teams</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="jobs" className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase text-green-700">Focused hiring</p>
          <h2 className="mt-2 text-3xl font-black md:text-4xl">Current role categories for technical hiring.</h2>
          <p className="mt-4 leading-7 text-gray-600">
            Software engineering, product design, cloud, DevOps, data, AI, and cyber security roles are organized by skills, seniority, salary, location, and work mode.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {roleCategories.length === 0 ? (
            <article className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-gray-600">
              {jobsStatus}. No API role categories are available yet.
            </article>
          ) : roleCategories.map((category) => (
            <article key={category} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-lg font-black">{category}</p>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Live category from the jobs API. Search by role, skill level, work mode, salary, and location.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="talent" className="border-y border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-2 lg:px-8">
          <img src="/images/mi&pc.jpg" alt="Software engineer at her workstation" className="h-full max-h-[520px] w-full rounded-lg object-cover shadow-xl" />
          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold uppercase text-green-700">Talent data</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">Technical profiles include skills, experience, availability, and work mode.</h2>
            <p className="mt-4 leading-7 text-gray-600">
              Employers can review role fit through stack, years of experience, salary expectation, preferred location, remote or hybrid preference, and portfolio details.
            </p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <Link to="/signup" state={{ role: "job-seeker" }} className="rounded-lg bg-green-600 px-5 py-4 text-center font-bold text-white shadow-sm hover:bg-green-700">
                Continue as job seeker
              </Link>
              <Link to="/signup" state={{ role: "employer" }} className="rounded-lg bg-gray-950 px-5 py-4 text-center font-bold text-white shadow-sm hover:bg-gray-800">
                Continue as employer
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase text-green-700">Employer pages</p>
          <h2 className="mt-2 text-3xl font-black md:text-4xl">Each employer gets a tailored hiring page.</h2>
          <p className="mt-4 leading-7 text-gray-600">
            Employer pages show company-specific roles, target skills, hiring contact details, and links to connect with registered job-hunting users.
          </p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {registeredEmployers.length === 0 ? (
            <article className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-gray-600">
              No registered employers yet. Employer pages appear here after an employer signs up.
            </article>
          ) : registeredEmployers.map((employer) => (
            <article key={employer.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold uppercase text-green-700">Registered employer</p>
              <h3 className="mt-2 text-2xl font-black">{employer.company ?? employer.name}</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Hiring contact: {employer.name}. Contact email: {employer.email}.
              </p>
              <Link to={`/employers/registered-${employer.id}`} className="mt-5 inline-block rounded-lg bg-gray-950 px-4 py-3 text-sm font-bold text-white">
                View employer page
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase text-green-700">Job market stories</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">Tech job signals across engineering, design, cloud, data, and security.</h2>
            <p className="mt-4 leading-7 text-gray-600">
              React, TypeScript, DevOps, AWS, cyber security, AI tooling, UX systems, remote roles, hybrid teams, salary bands, and interview readiness all shape the jobs shown here.
            </p>
            <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">{storiesStatus}</p>
          </div>
          <div className="grid gap-4">
            {stories.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 bg-[#f8fafc] p-5 text-gray-600">
                No API stories are available yet.
              </div>
            ) : stories.map((story, index) => (
              <a
                key={`${story.title}-${index}`}
                href={story.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-gray-200 bg-[#f8fafc] p-5 shadow-sm hover:border-green-200 hover:bg-green-50"
              >
                <p className="text-sm font-bold uppercase text-gray-500">Story {index + 1}</p>
                <h3 className="mt-2 text-xl font-black">{story.title}</h3>
                <p className="mt-3 text-sm text-gray-600">
                  By {story.author} · {story.points} points
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase text-green-700">Registered job seekers</p>
          <h2 className="mt-2 text-3xl font-black md:text-4xl">Profiles from users registered on this website.</h2>
          <p className="mt-4 leading-7 text-gray-600">
            This section only shows users who registered as job seekers.
          </p>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {registeredJobSeekers.length === 0 ? (
            <article className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-gray-600">
              No registered job seeker profiles yet.
            </article>
          ) : registeredJobSeekers.map((person) => (
            <article key={person.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              {person.profileImage ? (
                <img src={person.profileImage} alt={person.name} className="h-64 w-full object-cover" />
              ) : (
                <div className="grid h-64 w-full place-items-center bg-green-100 text-6xl font-black text-green-700">
                  {person.name[0].toUpperCase()}
                </div>
              )}
              <div className="p-6">
                <p className="text-lg font-black">{person.name}</p>
                <p className="text-sm font-semibold text-green-700">{person.primarySkill ? `${person.primarySkill} Specialist` : "Technical Candidate"}</p>
                <p className="mt-4 leading-7 text-gray-700">{person.email}</p>
                <p className="mt-5 border-t border-gray-200 pt-4 text-sm leading-6 text-gray-500">Registered job-hunting user.</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-800 bg-gray-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
          <div>
            <p className="text-2xl font-black">TechHire Market</p>
            <p className="mt-3 max-w-md leading-7 text-gray-300">
              Private hiring workflows for technical candidates, recruiting teams, and companies building serious products.
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
              <Link to="/talent" className="hover:text-white">Applicant search</Link>
              <Link to="/stories" className="hover:text-white">Testimonials</Link>
            </div>
          </div>
          <div>
            <p className="font-black">Start</p>
            <div className="mt-3 grid gap-2 text-sm text-gray-300">
              {user ? (
                <button type="button" onClick={logout} className="w-fit text-left hover:text-white">
                  Logout
                </button>
              ) : (
                <Link to={startActionPath} className="hover:text-white">
                  {startActionLabel}
                </Link>
              )}
              <Link to="/signup" state={{ role: "job-seeker" }} className="hover:text-white">Job seeker SignUp</Link>
              <Link to="/signup" state={{ role: "employer" }} className="hover:text-white">Employer SignUp</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
