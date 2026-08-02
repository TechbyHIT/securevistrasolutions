import { NextResponse } from "next/server";
import {
  buildUrlSetXml,
  getSitemapGroups,
  getSitemapShardEntries,
} from "@/lib/sitemap/get-sitemap-entries";
import { SITE_CONFIG } from "@/config/site";

type RouteContext = {
  params: Promise<{ group: string; shard: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 86400;

export async function GET(_request: Request, context: RouteContext) {
  const { group, shard: shardRaw } = await context.params;
  const groupName = group.replace(/\.xml$/, "");
  const shard = Number.parseInt(shardRaw.replace(/\.xml$/, ""), 10);

  if (!getSitemapGroups().includes(groupName) || !Number.isFinite(shard) || shard < 1) {
    return new NextResponse("Not found", { status: 404 });
  }

  const { entries, totalInGroup } = getSitemapShardEntries(groupName, shard);
  const maxShard = Math.max(1, Math.ceil(totalInGroup / SITE_CONFIG.maxSitemapUrlsPerFile));
  if (shard > maxShard) {
    return new NextResponse("Not found", { status: 404 });
  }

  const xml = buildUrlSetXml(entries);
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Sitemap-Group": groupName,
      "X-Sitemap-Shard": String(shard),
      "X-Sitemap-Total-In-Group": String(totalInGroup),
    },
  });
}
