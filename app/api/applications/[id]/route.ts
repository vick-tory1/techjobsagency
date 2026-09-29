import { NextRequest, NextResponse } from "next/server";
import { isAdmin, requireUser } from "../../../../lib/api-auth";
import { store } from "../../../../lib/store";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireUser();
  if ("response" in authResult) return authResult.response;
  const { id } = await params;
  const application = (await store.applications()).find((item) => item.id === id);
  if (!application) return NextResponse.json({ error: "Application not found" }, { status: 404 });
  const ownsApplication = application.applicantId === authResult.user.id;
  const ownsJob = application.employerId === authResult.user.id;
  if (!isAdmin(authResult.user) && !ownsApplication && !ownsJob) {
    return NextResponse.json({ error: "You do not have permission to view this application." }, { status: 403 });
  }
  return NextResponse.json(application);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireUser();
  if ("response" in authResult) return authResult.response;
  const { id } = await params;
  const payload = await request.json();
  const applications = await store.applications();
  const index = applications.findIndex((application) => application.id === id);
  if (index === -1) return NextResponse.json({ error: "Application not found" }, { status: 404 });
  const application = applications[index];
  const ownsApplication = application.applicantId === authResult.user.id;
  const ownsJob = application.employerId === authResult.user.id;
  if (!isAdmin(authResult.user) && !ownsApplication && !ownsJob) {
    return NextResponse.json({ error: "You do not have permission to update this application." }, { status: 403 });
  }
  const allowedStatus = ["submitted", "reviewing", "shortlisted", "interview", "accepted", "rejected"].includes(payload.status) ? payload.status : application.status;
  applications[index] = ownsApplication && !ownsJob && !isAdmin(authResult.user)
    ? { ...application, coverLetter: typeof payload.coverLetter === "string" ? payload.coverLetter : application.coverLetter, id }
    : { ...application, status: allowedStatus, id };
  await store.saveApplications(applications);
  return NextResponse.json(applications[index]);
}
