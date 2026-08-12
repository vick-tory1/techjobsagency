import { NextRequest, NextResponse } from "next/server";
import { store } from "../../../../lib/store";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const application = (await store.applications()).find((item) => item.id === id);
  return application ? NextResponse.json(application) : NextResponse.json({ error: "Application not found" }, { status: 404 });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = await request.json();
  const applications = await store.applications();
  const index = applications.findIndex((application) => application.id === id);
  if (index === -1) return NextResponse.json({ error: "Application not found" }, { status: 404 });
  applications[index] = { ...applications[index], ...payload, id };
  await store.saveApplications(applications);
  return NextResponse.json(applications[index]);
}
