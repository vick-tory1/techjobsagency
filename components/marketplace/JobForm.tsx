"use client";

import { useState } from "react";
import SkillsSelect from "./SkillsSelect";

const inputClass = "w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100";
const labelClass = "text-sm font-bold text-gray-800";

export default function JobForm() {
  const [skills, setSkills] = useState<string[]>(["React", "Next.js"]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const form = new FormData(event.currentTarget);
    setNotice("");
    setError("");
    setIsSubmitting(true);

    const response = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        description: form.get("description"),
        company: form.get("company"),
        skills,
        experienceLevel: form.get("experienceLevel"),
        employmentType: form.get("employmentType"),
        workplaceType: form.get("workplaceType"),
        location: form.get("location"),
        salaryMin: form.get("salaryMin"),
        salaryMax: form.get("salaryMax"),
        salaryCurrency: form.get("salaryCurrency"),
        salaryPeriod: form.get("salaryPeriod"),
        applicationDeadline: form.get("applicationDeadline"),
        status: "open",
      }),
    });

    const data = await response.json().catch(() => ({}));
    setIsSubmitting(false);

    if (!response.ok) {
      setError(typeof data.error === "string" ? data.error : "We could not publish this role. Please check the details and try again.");
      return;
    }

    event.currentTarget.reset();
    setNotice("Your role is live. Job seekers can now review the brief, requirements, and application details.");
  }

  return (
    <form onSubmit={submit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-black uppercase text-green-700">Hiring brief</p>
        <h2 className="mt-2 text-2xl font-black text-gray-950">Write the role clearly enough for the right person to apply</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 md:col-span-2">
          <span className={labelClass}>Job title</span>
          <input name="title" required placeholder="Senior Frontend Engineer" className={inputClass} />
        </label>
        <label className="space-y-2">
          <span className={labelClass}>Company/client</span>
          <input name="company" required placeholder="Client or company name" className={inputClass} />
        </label>
        <label className="space-y-2">
          <span className={labelClass}>Location</span>
          <input name="location" required placeholder="Lagos, Nigeria or Remote" className={inputClass} />
        </label>
        <label className="space-y-2">
          <span className={labelClass}>Experience level</span>
          <select name="experienceLevel" defaultValue="Mid-level" className={inputClass}>
            <option>Internship</option>
            <option>Junior</option>
            <option>Mid-level</option>
            <option>Senior</option>
            <option>Lead</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className={labelClass}>Employment type</span>
          <select name="employmentType" defaultValue="Full-time" className={inputClass}>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Internship</option>
            <option>Project</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className={labelClass}>Workplace type</span>
          <select name="workplaceType" defaultValue="remote" className={inputClass}>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">On-site</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className={labelClass}>Application deadline</span>
          <input name="applicationDeadline" type="date" className={inputClass} />
        </label>
      </div>

      <div className="rounded-lg border border-gray-200 bg-[#f8fafc] p-4">
        <h3 className="text-lg font-black text-gray-950">Compensation</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-[0.8fr_1fr_1fr_1fr]">
          <label className="space-y-2">
            <span className={labelClass}>Currency</span>
            <select name="salaryCurrency" defaultValue="USD" className={inputClass}>
              <option value="USD">USD</option>
              <option value="NGN">NGN</option>
              <option value="GBP">GBP</option>
              <option value="EUR">EUR</option>
              <option value="CAD">CAD</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className={labelClass}>Minimum</span>
            <input name="salaryMin" required type="number" min="1" step="1" placeholder="70000" className={inputClass} />
          </label>
          <label className="space-y-2">
            <span className={labelClass}>Maximum</span>
            <input name="salaryMax" required type="number" min="1" step="1" placeholder="100000" className={inputClass} />
          </label>
          <label className="space-y-2">
            <span className={labelClass}>Pay period</span>
            <select name="salaryPeriod" defaultValue="year" className={inputClass}>
              <option value="year">Per year</option>
              <option value="month">Per month</option>
              <option value="hour">Per hour</option>
              <option value="project">Per project</option>
            </select>
          </label>
        </div>
      </div>

      <label className="space-y-2">
        <span className={labelClass}>Job description</span>
        <textarea
          name="description"
          required
          placeholder="Describe the work, must-have skills, expected outcomes, interview steps, and the evidence that signals a strong match."
          className={`${inputClass} min-h-40 resize-y`}
        />
      </label>

      <SkillsSelect value={skills} onChange={setSkills} />

      {notice && <p className="rounded-lg bg-green-50 p-3 font-semibold text-green-800">{notice}</p>}
      {error && <p className="rounded-lg bg-red-50 p-3 font-semibold text-red-800">{error}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <button disabled={isSubmitting} className="rounded-lg bg-green-600 px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-300">
          {isSubmitting ? "Publishing role..." : "Publish role"}
        </button>
        <p className="text-sm text-gray-500">Clear details help qualified people decide quickly.</p>
      </div>
    </form>
  );
}
