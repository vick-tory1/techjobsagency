import { NextRequest, NextResponse } from "next/server";
import { createId, store } from "../../../lib/store";
import type { Job } from "../../../lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase() ?? "";
  const skill = searchParams.get("skill")?.toLowerCase();
  const experience = searchParams.get("experience");
  const employmentType = searchParams.get("employmentType");
  const location = searchParams.get("location")?.toLowerCase();
  const remote = searchParams.get("remote");
  const jobs = await store.jobs();
  const filtered = jobs.filter((job) => {
    const searchable = [job.title, job.description, job.company, job.location, job.experienceLevel, job.employmentType, ...job.skills].join(" ").toLowerCase();
    return (!q || searchable.includes(q)) &&
      (!skill || job.skills.some((item) => item.toLowerCase() === skill)) &&
      (!experience || job.experienceLevel === experience) &&
      (!employmentType || job.employmentType === employmentType) &&
      (!location || job.location.toLowerCase().includes(location)) &&
      (!remote || String(job.remote) === remote);
  });
  return NextResponse.json(filtered);
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const now = new Date().toISOString();
  const job: Job = {
    id: createId("job"),
    title: payload.title,
    description: payload.description,
    company: payload.company,
    employerId: payload.employerId ?? "employer-1",
    skills: payload.skills ?? [],
    experienceLevel: payload.experienceLevel,
    employmentType: payload.employmentType,
    location: payload.location,
    remote: Boolean(payload.remote),
    salary: payload.salary,
    status: payload.status ?? "open",
    createdAt: now,
    updatedAt: now,
  };
  const jobs = await store.jobs();
  await store.saveJobs([job, ...jobs]);
  return NextResponse.json(job, { status: 201 });
}
