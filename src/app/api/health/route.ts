import { NextResponse } from "next/server";
import { countByStatus } from "@/lib/pages/registry";

export async function GET() {
  const counts = countByStatus();
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    pages: counts,
  });
}
