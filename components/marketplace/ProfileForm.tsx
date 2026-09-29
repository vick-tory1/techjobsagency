"use client";

import { useState } from "react";
import SkillsSelect from "./SkillsSelect";
import type { TalentProfile, User } from "../../lib/types";

export default function ProfileForm({ user, profile }: { user?: User | null; profile?: TalentProfile | null }) {
  const [skills, setSkills] = useState<string[]>(profile?.skills.length ? profile.skills : ["React", "TypeScript"]);
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
    const response = await fetch(profile ? `/api/talent/${profile.id}` : "/api/talent", {
      method: profile ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        bio: form.get("bio"),
        location: form.get("location"),
        portfolioUrl: form.get("portfolioUrl"),
        availability: form.get("availability"),
        skills,
        experience: String(form.get("experience") ?? "").split("\n").filter(Boolean),
        education: String(form.get("education") ?? "").split("\n").filter(Boolean),
        projects: String(form.get("projects") ?? "").split("\n").filter(Boolean),
      }),
    });
    const data = await response.json().catch(() => ({}));
    setIsSubmitting(false);
    if (!response.ok) {
      setError(typeof data.error === "string" ? data.error : "Unable to save profile.");
      return;
    }
    setNotice(profile ? "Talent profile updated." : "Talent profile saved with selected skills.");
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <input name="name" required defaultValue={profile?.name ?? user?.name ?? ""} placeholder="Name" className="rounded-lg border border-gray-300 px-4 py-3" />
        <input value={profile?.email ?? user?.email ?? ""} readOnly aria-label="Email" className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-600" />
        <input name="location" defaultValue={profile?.location ?? ""} placeholder="Location" className="rounded-lg border border-gray-300 px-4 py-3" />
        <input name="availability" defaultValue={profile?.availability ?? ""} placeholder="Availability" className="rounded-lg border border-gray-300 px-4 py-3" />
      </div>
      <textarea name="bio" defaultValue={profile?.bio ?? ""} placeholder="Biography" className="min-h-28 w-full rounded-lg border border-gray-300 px-4 py-3" />
      <SkillsSelect value={skills} onChange={setSkills} />
      <textarea name="experience" defaultValue={profile?.experience.join("\n") ?? ""} placeholder="Experience, one item per line" className="min-h-24 w-full rounded-lg border border-gray-300 px-4 py-3" />
      <textarea name="education" defaultValue={profile?.education.join("\n") ?? ""} placeholder="Education, one item per line" className="min-h-24 w-full rounded-lg border border-gray-300 px-4 py-3" />
      <textarea name="projects" defaultValue={profile?.projects.join("\n") ?? ""} placeholder="Projects, one item per line" className="min-h-24 w-full rounded-lg border border-gray-300 px-4 py-3" />
      <input name="portfolioUrl" defaultValue={profile?.portfolioUrl ?? ""} placeholder="Portfolio URL" className="w-full rounded-lg border border-gray-300 px-4 py-3" />
      {notice && <p className="rounded-lg bg-green-50 p-3 text-green-800">{notice}</p>}
      {error && <p className="rounded-lg bg-red-50 p-3 text-red-800">{error}</p>}
      <button disabled={isSubmitting} className="rounded-lg bg-green-600 px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-300">{isSubmitting ? "Saving..." : "Save profile"}</button>
    </form>
  );
}
