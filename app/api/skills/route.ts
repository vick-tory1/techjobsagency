import { NextRequest, NextResponse } from "next/server";
import { skillMatchPercentage, skills } from "../../../lib/skills";

export async function GET() {
  return NextResponse.json(skills);
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  return NextResponse.json({
    match: skillMatchPercentage(payload.requiredSkills ?? [], payload.talentSkills ?? []),
  });
}
