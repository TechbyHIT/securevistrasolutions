import { SITE_CONFIG } from "@/config/site";
import { isSitemapMaterializedGroup } from "@/config/sitemap-indexing";
import { getMaterializedIndexablePages } from "@/lib/pages/registry";
import {
  getProgrammaticContext,
  iterateProgrammaticPathEntries,
} from "@/lib/publishing/enumerate-programmatic-pages";
import { countHighIntentKeywordIntents } from "@/data/keyword-intents";

export type SitemapEntry = {
  url: string;
  lastModified?: string;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

export type SitemapShard = {
  group: string;
  shard: number;
  loc: string;
};

const priorityMap: Record<string, number> = {
  critical: 1.0,
  high: 0.8,
  medium: 0.6,
  low: 0.4,
};

type SitemapSource = {
  path: string;
  updatedAt?: string;
  crawlPriority?: string;
  sitemapGroup: string;
};

function* iterateMaterializedSitemapSources(group?: string): Generator<SitemapSource> {
  for (const page of getMaterializedIndexablePages()) {
    const sitemapGroup = page.sitemapGroup ?? "core";
    if (page.pageType === "area" || sitemapGroup === "areas") continue;
    if (!isSitemapMaterializedGroup(sitemapGroup) && sitemapGroup !== "service-in-city") {
      continue;
    }
    if (group && sitemapGroup !== group) continue;
    yield {
      path: page.path,
      updatedAt: page.updatedAt,
      crawlPriority: page.crawlPriority,
      sitemapGroup,
    };
  }
}

function* iterateProgrammaticSitemapSources(group?: string): Generator<SitemapSource> {
  const allowed = new Set(["service-area-intent", "invisible-grills-installation"]);
  for (const entry of iterateProgrammaticPathEntries(group)) {
    if (!allowed.has(entry.sitemapGroup)) continue;
    yield {
      path: entry.path,
      updatedAt: entry.updatedAt,
      crawlPriority: entry.crawlPriority,
      sitemapGroup: entry.sitemapGroup,
    };
  }
}

function* iterateAllSitemapSources(group?: string): Generator<SitemapSource> {
  if (!group) {
    yield* iterateMaterializedSitemapSources();
    yield* iterateProgrammaticSitemapSources();
    return;
  }

  const materializedGroups = new Set(
    getMaterializedIndexablePages()
      .map((page) => page.sitemapGroup)
      .filter(Boolean) as string[],
  );

  if (materializedGroups.has(group)) {
    yield* iterateMaterializedSitemapSources(group);
    return;
  }

  yield* iterateProgrammaticSitemapSources(group);
}

function collectSitemapEntries(
  sources: Generator<SitemapSource>,
  options?: { limit?: number; offset?: number },
): { entries: SitemapEntry[]; nextCursor: string | null } {
  const limit = options?.limit ?? SITE_CONFIG.maxSitemapUrlsPerFile;
  const offset = options?.offset ?? 0;
  const entries: SitemapEntry[] = [];
  let index = 0;
  let lastPath: string | null = null;

  for (const source of sources) {
    if (index < offset) {
      index += 1;
      continue;
    }

    entries.push({
      url: `${SITE_CONFIG.url}${source.path}`,
      lastModified: source.updatedAt,
      changeFrequency: "weekly",
      priority: priorityMap[source.crawlPriority ?? "medium"] ?? 0.5,
    });
    lastPath = source.path;
    index += 1;

    if (entries.length >= limit) {
      return { entries, nextCursor: lastPath };
    }
  }

  return { entries, nextCursor: null };
}

export function getSitemapEntries(options?: {
  group?: string;
  limit?: number;
  offset?: number;
}): { entries: SitemapEntry[]; nextCursor: string | null } {
  const sources = iterateAllSitemapSources(options?.group);
  return collectSitemapEntries(sources, options);
}

export function getSitemapGroups(): string[] {
  const groups = new Set<string>();
  for (const page of getMaterializedIndexablePages()) {
    const g = page.sitemapGroup ?? "core";
    if (page.pageType === "area" || g === "areas") continue;
    if (isSitemapMaterializedGroup(g) || g === "service-in-city") {
      groups.add(g);
    }
  }
  groups.add("service-area-intent");
  groups.add("invisible-grills-installation");
  return Array.from(groups).sort();
}

function countMaterializedGroup(group: string): number {
  let count = 0;
  for (const page of getMaterializedIndexablePages()) {
    if ((page.sitemapGroup ?? "core") === group) count += 1;
  }
  return count;
}

/** Fast O(1)/O(n-pages) counts — avoids walking millions of intent paths. */
export function countSitemapEntries(group?: string): number {
  if (!group) {
    return getSitemapGroups().reduce((sum, name) => sum + countSitemapEntries(name), 0);
  }

  const materialized = countMaterializedGroup(group);
  if (materialized > 0) return materialized;

  const ctx = getProgrammaticContext();
  if (!ctx) return 0;

  switch (group) {
    case "service-area-intent":
      return ctx.areas.length * countHighIntentKeywordIntents();
    case "invisible-grills-installation":
      return ctx.areas.length;
    case "service-area":
    case "area":
      return 0;
    default:
      return 0;
  }
}

export function listSitemapShards(): SitemapShard[] {
  const limit = SITE_CONFIG.maxSitemapUrlsPerFile;
  const shards: SitemapShard[] = [];

  for (const group of getSitemapGroups()) {
    const total = countSitemapEntries(group);
    if (total === 0) continue;
    const shardCount = Math.max(1, Math.ceil(total / limit));
    for (let shard = 1; shard <= shardCount; shard++) {
      shards.push({
        group,
        shard,
        loc: `${SITE_CONFIG.url}/sitemaps/${group}/${shard}.xml`,
      });
    }
  }

  return shards;
}

export function getSitemapShardEntries(
  group: string,
  shard: number,
): { entries: SitemapEntry[]; totalInGroup: number } {
  const limit = SITE_CONFIG.maxSitemapUrlsPerFile;
  const offset = Math.max(0, (shard - 1) * limit);
  const totalInGroup = countSitemapEntries(group);
  const { entries } = getSitemapEntries({ group, limit, offset });
  return { entries, totalInGroup };
}

export function buildSitemapIndexXml(): string {
  const shards = listSitemapShards();
  const body = shards
    .map(
      (shard) => `  <sitemap>
    <loc>${escapeXml(shard.loc)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>`;
}

export function buildUrlSetXml(entries: SitemapEntry[]): string {
  const urlEntries = entries
    .map(
      (entry) => `<url>
  <loc>${escapeXml(entry.url)}</loc>
  ${entry.lastModified ? `<lastmod>${escapeXml(entry.lastModified)}</lastmod>` : ""}
  ${entry.changeFrequency ? `<changefreq>${entry.changeFrequency}</changefreq>` : ""}
  ${entry.priority !== undefined ? `<priority>${entry.priority}</priority>` : ""}
</url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
