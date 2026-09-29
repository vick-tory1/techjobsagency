import { NextRequest, NextResponse } from "next/server";
import { isAdmin, requirePersistedUser, requireRole } from "../../../../lib/api-auth";
import { store } from "../../../../lib/store";
import { isVerifiedEmployer, publicTalentProfile } from "../../../../lib/talent-privacy";
import type { TalentProfile } from "../../../../lib/types";

function text(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function optionalText(value: unknown, fallback?: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function stringArray(value: unknown, fallback: string[]) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && Boolean(item.trim())).map((item) => item.trim()) : fallback;
}

function socialLinks(value: unknown, fallback: Record<string, string>) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return fallback;
  return Object.fromEntries(Object.entries(value).filter(([, link]) => typeof link === "string").map(([key, link]) => [key, link.trim()]));
}

function patchProfile(profile: TalentProfile, payload: Record<string, unknown>): TalentProfile {
  return {
    ...profile,
    name: text(payload.name, profile.name),
    profilePicture: optionalText(payload.profilePicture, profile.profilePicture),
    bio: text(payload.bio, profile.bio),
    skills: stringArray(payload.skills, profile.skills),
    experience: stringArray(payload.experience, profile.experience),
    education: stringArray(payload.education, profile.education),
    projects: stringArray(payload.projects, profile.projects),
    portfolioUrl: optionalText(payload.portfolioUrl, profile.portfolioUrl),
    socialLinks: socialLinks(payload.socialLinks, profile.socialLinks),
    location: text(payload.location, profile.location),
    availability: text(payload.availability, profile.availability),
  };
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = (await store.talent()).find((item) => item.id === id || item.userId === id);
  return profile ? NextResponse.json(publicTalentProfile(profile)) : NextResponse.json({ error: "Talent profile not found" }, { status: 404 });
}

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requirePersistedUser();
  if ("response" in authResult) return authResult.response;
  const { id } = await params;
  const profiles = await store.talent();
  const profile = profiles.find((item) => item.id === id || item.userId === id);
  if (!profile) return NextResponse.json({ error: "Talent profile not found" }, { status: 404 });

  if (isAdmin(authResult.user) || profile.userId === authResult.user.id) {
    return NextResponse.json(profile);
  }
  if (!isVerifiedEmployer(authResult.user)) {
    return NextResponse.json({ error: "Verified employer access is required for private job seeker details." }, { status: 403 });
  }
  const [applications, jobs] = await Promise.all([store.applications(), store.jobs()]);
  const authorizedApplication = applications.some((application) => {
    const job = jobs.find((item) => item.id === application.jobId);
    return application.applicantId === profile.userId && application.employerId === authResult.user.id && job?.employerId === authResult.user.id;
  });
  if (!authorizedApplication) {
    return NextResponse.json({ error: "This employer is not authorized to access private details for this job seeker." }, { status: 403 });
  }
  return NextResponse.json(profile);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireRole(["talent", "admin"]);
  if ("response" in authResult) return authResult.response;
  const { id } = await params;
  const payload = await request.json();
  const profiles = await store.talent();
  const index = profiles.findIndex((profile) => profile.id === id || profile.userId === id);
  if (index === -1) return NextResponse.json({ error: "Talent profile not found" }, { status: 404 });
  if (!isAdmin(authResult.user) && profiles[index].userId !== authResult.user.id) {
    return NextResponse.json({ error: "You do not have permission to update this profile." }, { status: 403 });
  }
  profiles[index] = patchProfile(profiles[index], payload);
  await store.saveTalent(profiles);
  return NextResponse.json(profiles[index]);
}
