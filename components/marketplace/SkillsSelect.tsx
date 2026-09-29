"use client";

import { useMemo, useState } from "react";
import { skills } from "../../lib/skills";

export default function SkillsSelect({ value, onChange }: { value: string[]; onChange: (skills: string[]) => void }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => skills.filter((skill) => skill.toLowerCase().includes(query.toLowerCase())), [query]);
  const toggle = (skill: string) => onChange(value.includes(skill) ? value.filter((item) => item !== skill) : [...value, skill]);

  return (
    <div className="space-y-3">
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search skills" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" />
      <div className="flex flex-wrap gap-2">
        {value.map((skill) => (
          <button key={skill} type="button" onClick={() => toggle(skill)} className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
            {skill} x
          </button>
        ))}
      </div>
      <div className="grid max-h-56 gap-2 overflow-auto rounded-lg border border-gray-200 bg-white p-3 sm:grid-cols-2">
        {filtered.map((skill) => (
          <label key={skill} className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
            <input type="checkbox" checked={value.includes(skill)} onChange={() => toggle(skill)} className="h-4 w-4 accent-green-600" />
            {skill}
          </label>
        ))}
      </div>
    </div>
  );
}
