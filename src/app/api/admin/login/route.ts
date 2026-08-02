import { COOKIE_NAME, validateAdminCredentials } from "@/lib/admin/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as { username?: string; password?: string };

  if (!body.username || !body.password || !validateAdminCredentials(body.username, body.password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
