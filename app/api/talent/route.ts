import { NextRequest, NextResponse } from "next/server";
import { isAdmin, requireRole } from "../../../lib/api-auth";
import { createId, store } from "../../../lib/store";
import { publicTalentProfile } from "../../../lib/talent-privacy";
import type { TalentProfile } from "../../../lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase() ?? "";
  const skill = searchParams.get("skill")?.toLowerCase();
  const location = searchParams.get("location")?.toLowerCase();
  const profiles = await store.talent();
  return NextResponse.json(profiles.filter((profile) => {
    const searchable = [profile.name, profile.bio, profile.location, profile.availability, ...profile.skills, ...profile.projects].join(" ").toLowerCase();
    return (!q || searchable.includes(q)) &&
      (!skill || profile.skills.some((item) => item.toLowerCase() === skill)) &&
      (!location || profile.location.toLowerCase().includes(location));
  }).map(publicTalentProfile));
}

export async function POST(request: NextRequest) {
  const authResult = await requireRole(["talent", "admin"]);
  if ("response" in authResult) return authResult.response;
  const payload = await request.json();
  const userId = isAdmin(authResult.user) && typeof payload.userId === "string" ? payload.userId : authResult.user.id;
  const existingProfiles = await store.talent();
  if (existingProfiles.some((profile) => profile.userId === userId)) {
    return NextResponse.json({ error: "A profile already exists for this user." }, { status: 409 });
  }
  const profile: TalentProfile = {
    id: createId("profile"),
    userId,
    name: typeof payload.name === "string" && payload.name.trim() ? payload.name.trim() : authResult.user.name,
    email: authResult.user.email,
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
  await store.saveTalent([profile, ...existingProfiles]);
  return NextResponse.json(profile, { status: 201 });
}
