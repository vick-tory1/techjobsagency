import { useMemo, useState } from "react";
import type { TechJob } from "../data/techJobs";
import { useAuth } from "../hooks/useAuth";
import { useStoredList } from "../hooks/useStoredList";
import { useTechJobs } from "../hooks/useTechJobs";

const fallbackSkills = ["TypeScript", "React", "Product Engineering"];
const workModeOptions: TechJob["workMode"][] = ["Remote", "Hybrid", "On-site"];
const employmentTypeOptions: TechJob["employmentType"][] = ["Full-time", "Contract", "Internship"];

export default function JobSearch() {
  const { user } = useAuth();
  const { jobs, status } = useTechJobs(120);
  const [applications, setApplications] = useStoredList<{ id: string; jobId: string; email: string; candidate: string }>(
    "jobboard-applications",
    []
  );
  const [query, setQuery] = useState("");
  const [selectedWorkModes, setSelectedWorkModes] = useState<TechJob["workMode"][]>([]);
  const [level, setLevel] = useState("All");
  const [employmentType, setEmploymentType] = useState("All");
  const [notice, setNotice] = useState("");
  const userApplications = applications.filter((application) => application.email === user?.email);

  const filteredJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return jobs.filter((job) => {
        const searchable = [job.title, job.company, job.category, job.location, job.level, job.workMode, job.employmentType, ...(job.skills ?? fallbackSkills)]
          .join(" ")
          .toLowerCase();
        return (
          (!normalizedQuery || searchable.includes(normalizedQuery)) &&
          (selectedWorkModes.length === 0 || selectedWorkModes.includes(job.workMode)) &&
          (level === "All" || job.level === level) &&
          (employmentType === "All" || job.employmentType === employmentType)
        );
      });
  }, [employmentType, jobs, level, query, selectedWorkModes]);

  const toggleWorkMode = (mode: TechJob["workMode"]) => {
    setSelectedWorkModes((current) =>
      current.includes(mode) ? current.filter((item) => item !== mode) : [...current, mode]
    );
  };

  const handleApply = (job: TechJob) => {
    if (!user) return;

    setApplications((current) => [
      {
        id: crypto.randomUUID(),
        jobId: job.id,
        email: user.email,
        candidate: user.name,
      },
      ...current,
    ]);
    setNotice(`Your interest in ${job.title} has been saved for the employer.`);
  };

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-green-700">Authenticated job seeker workspace</p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">Search Verified Tech Roles</h1>
        <p className="mt-3 max-w-3xl text-gray-600">
          Search available jobs across software, data, cloud, DevOps, design, QA, mobile, AI, product, and security roles. Applications are tied to your signed-in profile.
        </p>
        <p className="mt-3 text-sm font-semibold text-green-700">
          Saved applications: {userApplications.length}
        </p>
      </div>

      <div className="grid gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm xl:grid-cols-[1fr_1fr_180px_180px]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search React, AWS, security, data, product..."
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
        />
        <div className="rounded-lg border border-gray-300 p-2">
          <p className="px-2 pb-2 text-xs font-bold uppercase text-gray-500">Work mode</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {workModeOptions.map((mode) => (
              <label
                key={mode}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${
                  selectedWorkModes.includes(mode)
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedWorkModes.includes(mode)}
                  onChange={() => toggleWorkMode(mode)}
                  className="h-4 w-4 accent-green-600"
                />
                {mode}
              </label>
            ))}
          </div>
        </div>
        <select value={level} onChange={(event) => setLevel(event.target.value)} className="rounded-lg border border-gray-300 px-4 py-3">
          <option>All</option>
          <option>Junior</option>
          <option>Mid-level</option>
          <option>Senior</option>
          <option>Lead</option>
        </select>
        <select value={employmentType} onChange={(event) => setEmploymentType(event.target.value)} className="rounded-lg border border-gray-300 px-4 py-3">
          <option>All</option>
          {employmentTypeOptions.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </div>

      <p className="text-sm text-gray-500">
        {status}. Showing {filteredJobs.length} matching roles. Filters: {selectedWorkModes.length > 0 ? selectedWorkModes.join(", ") : "all modes"}, {level === "All" ? "all levels" : level}, {employmentType === "All" ? "all job types" : employmentType}.
      </p>

      {notice && <p className="rounded-lg bg-green-50 p-4 text-green-800">{notice}</p>}

      <div className="grid gap-4">
        {filteredJobs.map((job) => (
          <article key={job.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-xl font-bold">{job.title}</h2>
                <p className="mt-1 text-gray-600">{job.company} - {job.location}</p>
                <p className="mt-3 max-w-2xl text-sm text-gray-600">
                  This role is listed for technical candidates with matching experience in {(job.skills ?? fallbackSkills).join(", ")}.
                </p>
              </div>
              <button type="button" onClick={() => handleApply(job)} className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white">
                Apply with profile
              </button>
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
  );
}
