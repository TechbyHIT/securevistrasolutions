import { NextResponse } from "next/server";
import { SITE_CONFIG } from "@/config/site";
import { getSitemapGroups } from "@/lib/sitemap/get-sitemap-entries";

type RouteContext = { params: Promise<{ group: string }> };

/**
 * Legacy group URL → redirect to shard 1 of the sharded sitemap.
 * Keeps old /sitemaps/{group}.xml references working.
 */
export async function GET(_request: Request, context: RouteContext) {
  const { group } = await context.params;
  const groupName = group.replace(/\.xml$/, "");

  if (!getSitemapGroups().includes(groupName)) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.redirect(
    new URL(`/sitemaps/${groupName}/1.xml`, SITE_CONFIG.url),
    308,
  );
}
