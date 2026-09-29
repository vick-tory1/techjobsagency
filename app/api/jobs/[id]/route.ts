import { NextRequest, NextResponse } from "next/server";
import { isAdmin, requireRole } from "../../../../lib/api-auth";
import { store } from "../../../../lib/store";
import type { Job, JobStatus } from "../../../../lib/types";

const jobStatuses: JobStatus[] = ["open", "paused", "closed"];
const salaryPeriods: Array<NonNullable<Job["salaryPeriod"]>> = ["year", "month", "hour", "project"];
const workplaceTypes: Array<NonNullable<Job["workplaceType"]>> = ["remote", "hybrid", "onsite"];

function optionalText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function optionalStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && Boolean(item.trim())).map((item) => item.trim()) : undefined;
}

function patchJob(job: Job, payload: Record<string, unknown>): Job | { error: string } {
  const salaryMin = payload.salaryMin === undefined || payload.salaryMin === "" ? job.salaryMin : Number(payload.salaryMin);
  const salaryMax = payload.salaryMax === undefined || payload.salaryMax === "" ? job.salaryMax : Number(payload.salaryMax);
  const salaryCurrency = optionalText(payload.salaryCurrency) ?? job.salaryCurrency ?? "USD";
  const salaryPeriod = salaryPeriods.includes(payload.salaryPeriod as NonNullable<Job["salaryPeriod"]>) ? payload.salaryPeriod as NonNullable<Job["salaryPeriod"]> : job.salaryPeriod;
  const workplaceType = workplaceTypes.includes(payload.workplaceType as NonNullable<Job["workplaceType"]>) ? payload.workplaceType as NonNullable<Job["workplaceType"]> : job.workplaceType;

  if ((salaryMin !== undefined && (!Number.isFinite(salaryMin) || salaryMin <= 0)) || (salaryMax !== undefined && (!Number.isFinite(salaryMax) || salaryMax <= 0))) {
    return { error: "Enter a valid salary range." };
  }
  if (salaryMin !== undefined && salaryMax !== undefined && salaryMax < salaryMin) {
    return { error: "Maximum salary must be greater than minimum salary." };
  }

  const formattedSalary = salaryMin && salaryMax
    ? `${new Intl.NumberFormat("en-US", { style: "currency", currency: salaryCurrency, maximumFractionDigits: 0 }).format(salaryMin)} - ${new Intl.NumberFormat("en-US", { style: "currency", currency: salaryCurrency, maximumFractionDigits: 0 }).format(salaryMax)} / ${salaryPeriod ?? "year"}`
    : job.salary;

  return {
    ...job,
    title: optionalText(payload.title) ?? job.title,
    description: optionalText(payload.description) ?? job.description,
    company: optionalText(payload.company) ?? job.company,
    skills: optionalStringArray(payload.skills) ?? job.skills,
    experienceLevel: optionalText(payload.experienceLevel) ?? job.experienceLevel,
    employmentType: optionalText(payload.employmentType) ?? job.employmentType,
    location: optionalText(payload.location) ?? job.location,
    remote: workplaceType ? workplaceType === "remote" : job.remote,
    salary: formattedSalary,
    salaryMin,
    salaryMax,
    salaryCurrency,
    salaryPeriod,
    workplaceType,
    applicationDeadline: optionalText(payload.applicationDeadline) ?? job.applicationDeadline,
    status: jobStatuses.includes(payload.status as JobStatus) ? payload.status as JobStatus : job.status,
    updatedAt: new Date().toISOString(),
  };
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = (await store.jobs()).find((item) => item.id === id);
  return job ? NextResponse.json(job) : NextResponse.json({ error: "Job not found" }, { status: 404 });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireRole(["employer", "admin"]);
  if ("response" in authResult) return authResult.response;
  const { id } = await params;
  const payload = await request.json();
  const jobs = await store.jobs();
  const index = jobs.findIndex((job) => job.id === id);
  if (index === -1) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  if (!isAdmin(authResult.user) && jobs[index].employerId !== authResult.user.id) {
    return NextResponse.json({ error: "You do not have permission to update this job." }, { status: 403 });
  }
  const nextJob = patchJob(jobs[index], payload);
  if ("error" in nextJob) return NextResponse.json({ error: nextJob.error }, { status: 400 });
  jobs[index] = nextJob;
  await store.saveJobs(jobs);
  return NextResponse.json(jobs[index]);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireRole(["employer", "admin"]);
  if ("response" in authResult) return authResult.response;
  const { id } = await params;
  const jobs = await store.jobs();
  const job = jobs.find((item) => item.id === id);
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  if (!isAdmin(authResult.user) && job.employerId !== authResult.user.id) {
    return NextResponse.json({ error: "You do not have permission to delete this job." }, { status: 403 });
  }
  await store.saveJobs(jobs.filter((job) => job.id !== id));
  return NextResponse.json({ ok: true });
}
