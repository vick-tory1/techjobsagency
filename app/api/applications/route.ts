import { NextRequest, NextResponse } from "next/server";
import { createId, store } from "../../../lib/store";
import type { Application } from "../../../lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const applicantId = searchParams.get("applicantId");
  const employerId = searchParams.get("employerId");
  const jobId = searchParams.get("jobId");
  const applications = await store.applications();
  return NextResponse.json(applications.filter((application) =>
    (!applicantId || application.applicantId === applicantId) &&
    (!employerId || application.employerId === employerId) &&
    (!jobId || application.jobId === jobId)
  ));
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const application: Application = {
    id: createId("application"),
    jobId: payload.jobId,
    applicantId: payload.applicantId ?? "talent-1",
    employerId: payload.employerId,
    resumeProfile: payload.resumeProfile ?? "profile-talent-1",
    coverLetter: payload.coverLetter ?? "",
    submittedAt: new Date().toISOString(),
    status: "submitted",
  };
  const applications = await store.applications();
  await store.saveApplications([application, ...applications]);
  return NextResponse.json(application, { status: 201 });
}
