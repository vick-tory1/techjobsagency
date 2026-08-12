import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("techhire-session")?.value;
  return NextResponse.json({ user: session ? JSON.parse(session) : null });
}
