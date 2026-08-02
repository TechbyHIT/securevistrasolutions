import { NextResponse } from "next/server";
import { buildSitemapIndexXml } from "@/lib/sitemap/get-sitemap-entries";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

/** Root sitemap index listing every sharded urlset (all indexable URLs). */
export async function GET() {
  const xml = buildSitemapIndexXml();
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
