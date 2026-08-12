import { NextRequest, NextResponse } from "next/server";
import { createId, store } from "../../../lib/store";
import type { TalentProfile } from "../../../lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase() ?? "";
  const skill = searchParams.get("skill")?.toLowerCase();
  const location = searchParams.get("location")?.toLowerCase();
  const profiles = await store.talent();
  return NextResponse.json(profiles.filter((profile) => {
    const searchable = [profile.name, profile.email, profile.bio, profile.location, profile.availability, ...profile.skills, ...profile.projects].join(" ").toLowerCase();
    return (!q || searchable.includes(q)) &&
      (!skill || profile.skills.some((item) => item.toLowerCase() === skill)) &&
      (!location || profile.location.toLowerCase().includes(location));
  }));
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const profile: TalentProfile = {
    id: createId("profile"),
    userId: payload.userId ?? "talent-1",
    name: payload.name,
    email: payload.email,
    profilePicture: payload.profilePicture,
    bio: payload.bio ?? "",
    skills: payload.skills ?? [],
    experience: payload.experience ?? [],
    education: payload.education ?? [],
    projects: payload.projects ?? [],
    portfolioUrl: payload.portfolioUrl,
    socialLinks: payload.socialLinks ?? {},
    location: payload.location ?? "",
    availability: payload.availability ?? "Open to interviews",
  };
  const profiles = await store.talent();
  await store.saveTalent([profile, ...profiles]);
  return NextResponse.json(profile, { status: 201 });
}
