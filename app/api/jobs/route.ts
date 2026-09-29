import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "../../../lib/api-auth";
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
  const authResult = await requireRole(["employer", "admin"]);
  if ("response" in authResult) return authResult.response;

  const payload = await request.json();
  const salaryMin = Number(payload.salaryMin);
  const salaryMax = Number(payload.salaryMax);
  const salaryCurrency = typeof payload.salaryCurrency === "string" ? payload.salaryCurrency : "USD";
  const salaryPeriod = typeof payload.salaryPeriod === "string" ? payload.salaryPeriod : "year";
  const workplaceType = typeof payload.workplaceType === "string" ? payload.workplaceType : "remote";
  const requiredFields = [payload.title, payload.description, payload.company, payload.experienceLevel, payload.employmentType, payload.location];

  if (requiredFields.some((field) => typeof field !== "string" || !field.trim())) {
    return NextResponse.json({ error: "Please complete the required job fields." }, { status: 400 });
  }
  if (!Number.isFinite(salaryMin) || !Number.isFinite(salaryMax) || salaryMin <= 0 || salaryMax < salaryMin) {
    return NextResponse.json({ error: "Enter a valid salary range." }, { status: 400 });
  }

  const now = new Date().toISOString();
  const formattedMin = new Intl.NumberFormat("en-US", { style: "currency", currency: salaryCurrency, maximumFractionDigits: 0 }).format(salaryMin);
  const formattedMax = new Intl.NumberFormat("en-US", { style: "currency", currency: salaryCurrency, maximumFractionDigits: 0 }).format(salaryMax);
  const job: Job = {
    id: createId("job"),
    title: payload.title.trim(),
    description: payload.description.trim(),
    company: payload.company.trim(),
    employerId: authResult.user.id,
    skills: Array.isArray(payload.skills) ? payload.skills.filter((skill) => typeof skill === "string" && skill.trim()) : [],
    experienceLevel: payload.experienceLevel.trim(),
    employmentType: payload.employmentType.trim(),
    location: payload.location.trim(),
    remote: workplaceType === "remote",
    salary: `${formattedMin} - ${formattedMax} / ${salaryPeriod}`,
    salaryMin,
    salaryMax,
    salaryCurrency,
    salaryPeriod,
    workplaceType,
    applicationDeadline: typeof payload.applicationDeadline === "string" ? payload.applicationDeadline : undefined,
    status: payload.status ?? "open",
    createdAt: now,
    updatedAt: now,
  };
  const jobs = await store.jobs();
  await store.saveJobs([job, ...jobs]);
  return NextResponse.json(job, { status: 201 });
}
