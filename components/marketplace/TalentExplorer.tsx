"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { skillMatchPercentage } from "../../lib/skills";
import type { Job, TalentProfile } from "../../lib/types";

export default function TalentExplorer({ talent, jobs }: { talent: TalentProfile[]; jobs: Job[] }) {
  const [query, setQuery] = useState("");
  const selectedJob = jobs[0];
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return talent.filter((profile) => !q || [profile.name, profile.bio, profile.location, profile.availability, ...profile.skills].join(" ").toLowerCase().includes(q));
  }, [query, talent]);

  return (
    <section className="space-y-6">
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search React, Lagos, cloud, portfolio, available..." className="w-full rounded-lg border border-gray-300 px-4 py-3" />
      <div className="grid gap-5">
        {!filtered.length && (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
            <h3 className="text-xl font-black text-gray-900">No talent profiles currently match these filters.</h3>
            <p className="mt-2 text-gray-600">Try another skill, location, or availability search.</p>
          </div>
        )}
        {filtered.map((profile) => (
          <article key={profile.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-2xl font-black"><Link href={`/talent/${profile.id}`} className="hover:text-green-700">{profile.name}</Link></h2>
                <p className="mt-1 text-gray-600">{profile.location} - {profile.availability}</p>
                <p className="mt-3 max-w-3xl leading-7 text-gray-600">{profile.bio}</p>
              </div>
              <span className="rounded-lg bg-green-100 px-4 py-3 font-black text-green-800">{selectedJob ? skillMatchPercentage(selectedJob.skills, profile.skills) : 0}% role fit</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">{profile.skills.map((skill) => <span key={skill} className="cursor-pointer rounded-full bg-green-100 px-3 py-1 font-semibold text-green-700 transition duration-150 hover:bg-green-200 hover:shadow">{skill}</span>)}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
