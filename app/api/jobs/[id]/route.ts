import { NextRequest, NextResponse } from "next/server";
import { store } from "../../../../lib/store";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = (await store.jobs()).find((item) => item.id === id);
  return job ? NextResponse.json(job) : NextResponse.json({ error: "Job not found" }, { status: 404 });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = await request.json();
  const jobs = await store.jobs();
  const index = jobs.findIndex((job) => job.id === id);
  if (index === -1) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  jobs[index] = { ...jobs[index], ...payload, id, updatedAt: new Date().toISOString() };
  await store.saveJobs(jobs);
  return NextResponse.json(jobs[index]);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const jobs = await store.jobs();
  await store.saveJobs(jobs.filter((job) => job.id !== id));
  return NextResponse.json({ ok: true });
}
