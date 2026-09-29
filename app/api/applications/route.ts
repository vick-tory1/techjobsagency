import { NextRequest, NextResponse } from "next/server";
import { isAdmin, requireRole, requireUser } from "../../../lib/api-auth";
import { createId, store } from "../../../lib/store";
import type { Application } from "../../../lib/types";

export async function GET(request: NextRequest) {
  const authResult = await requireUser();
  if ("response" in authResult) return authResult.response;
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");
  const applications = await store.applications();
  return NextResponse.json(applications.filter((application) => {
    const ownsApplication = application.applicantId === authResult.user.id;
    const ownsJob = application.employerId === authResult.user.id;
    return (isAdmin(authResult.user) || ownsApplication || ownsJob) && (!jobId || application.jobId === jobId);
  }));
}

export async function POST(request: NextRequest) {
  const authResult = await requireRole(["talent", "admin"]);
  if ("response" in authResult) return authResult.response;
  const payload = await request.json();
  const jobs = await store.jobs();
  const job = jobs.find((item) => item.id === payload.jobId);
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  const applicantId = isAdmin(authResult.user) && typeof payload.applicantId === "string" ? payload.applicantId : authResult.user.id;
  const talent = await store.talent();
  const profile = talent.find((item) => item.userId === applicantId);
  const application: Application = {
    id: createId("application"),
    jobId: job.id,
    applicantId,
    employerId: job.employerId,
    resumeProfile: profile?.id ?? applicantId,
    coverLetter: payload.coverLetter ?? "",
    submittedAt: new Date().toISOString(),
    status: "submitted",
  };
  const applications = await store.applications();
  if (applications.some((item) => item.jobId === application.jobId && item.applicantId === application.applicantId)) {
    return NextResponse.json({ error: "You have already applied to this job." }, { status: 409 });
  }
  await store.saveApplications([application, ...applications]);
  return NextResponse.json(application, { status: 201 });
}
