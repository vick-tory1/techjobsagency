import { NextRequest, NextResponse } from "next/server";
import { store } from "../../../../lib/store";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = (await store.talent()).find((item) => item.id === id || item.userId === id);
  return profile ? NextResponse.json(profile) : NextResponse.json({ error: "Talent profile not found" }, { status: 404 });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = await request.json();
  const profiles = await store.talent();
  const index = profiles.findIndex((profile) => profile.id === id || profile.userId === id);
  if (index === -1) return NextResponse.json({ error: "Talent profile not found" }, { status: 404 });
  profiles[index] = { ...profiles[index], ...payload };
  await store.saveTalent(profiles);
  return NextResponse.json(profiles[index]);
}
