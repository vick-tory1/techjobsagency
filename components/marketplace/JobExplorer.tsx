"use client";

import { useMemo, useState } from "react";
import type { Job } from "../../lib/types";

export default function JobExplorer({ jobs }: { jobs: Job[] }) {
  const [query, setQuery] = useState("");
  const [remote, setRemote] = useState("all");
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return jobs.filter((job) => (!q || [job.title, job.company, job.location, job.experienceLevel, job.employmentType, ...job.skills].join(" ").toLowerCase().includes(q)) && (remote === "all" || String(job.remote) === remote));
  }, [jobs, query, remote]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase text-green-700">Open roles</p>
          <h2 className="mt-2 text-3xl font-black">Browse {jobs.length} roles hiring technical talent</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-gray-600">Use the filters to find roles that match your stack, location, seniority, and work style before you spend time applying.</p>
      </div>
      <div className="grid gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_180px]">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search React, data, security, Lagos, remote..." className="rounded-lg border border-gray-300 px-4 py-3" />
        <select value={remote} onChange={(event) => setRemote(event.target.value)} className="rounded-lg border border-gray-300 px-4 py-3">
          <option value="all">All locations</option>
          <option value="true">Remote</option>
          <option value="false">On-site/hybrid</option>
        </select>
      </div>
      <div className="mt-6 grid gap-5">
        {!filtered.length && (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
            <h3 className="text-xl font-black text-gray-900">No jobs currently match these filters.</h3>
            <p className="mt-2 text-gray-600">Try a broader search or check back when employers publish new roles.</p>
          </div>
        )}
        {filtered.map((job) => (
          <article key={job.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-2xl font-black">{job.title}</h2>
                <p className="mt-1 text-gray-600">{job.company} - {job.location}</p>
                <p className="mt-3 max-w-3xl leading-7 text-gray-600">{job.description}</p>
              </div>
              <a href={`/jobs/${job.id}`} className="rounded-lg bg-gray-950 px-5 py-3 text-center font-bold text-white">Read the role</a>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {job.skills.map((skill) => <span key={skill} className="rounded-full bg-green-100 px-3 py-1 text-green-800">{skill}</span>)}
              <span className="rounded-full bg-gray-100 px-3 py-1">{job.experienceLevel}</span>
              <span className="rounded-full bg-gray-100 px-3 py-1">{job.employmentType}</span>
              <span className="rounded-full bg-gray-100 px-3 py-1">{job.workplaceType ?? (job.remote ? "Remote" : "On-site")}</span>
              <span className="rounded-full bg-gray-100 px-3 py-1">{job.salary}</span>
              {job.applicationDeadline && <span className="rounded-full bg-gray-100 px-3 py-1">Apply by {job.applicationDeadline}</span>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
