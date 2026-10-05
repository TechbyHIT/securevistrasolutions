import { SITE_CONFIG } from "@/config/site";
import { withTrailingSlash } from "@/config/routes";
import {
  getSeoPageMatrix,
  resetSeoPageMatrixCache,
  type SeoPageMatrixEntry,
} from "@/lib/seo/seo-page-matrix";

export type SitemapEntry = {
  url: string;
  lastModified: Date;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
};

/** Max URLs per sitemap shard (Google limit is 50k). */
export const SITEMAP_SHARD_SIZE = 40_000;

/**
 * Sitemap growth phase (1–4).
 * Override with env SITEMAP_PHASE=1 for emergency / low-RAM deploys.
 *
 * Phase 1: hubs + services + service×city only (no installation localities)
 * Phase 2–4: full authoritative matrix (including all installation localities)
 *
 * Sitemap is NEVER derived from generateStaticParams().
 */
function resolveSitemapPhase(): 1 | 2 | 3 | 4 {
  const raw = Number(process.env.SITEMAP_PHASE || 4);
  if (raw === 1 || raw === 2 || raw === 3 || raw === 4) return raw;
  return 4;
}
export const SITEMAP_PHASE = resolveSitemapPhase();

const BUILD_LASTMOD = new Date();

function absoluteUrl(path: string): string {
  const normalized = withTrailingSlash(path.startsWith("/") ? path : `/${path}`);
  return `${SITE_CONFIG.url}${normalized === "/" ? "/" : normalized}`;
}

function changeFrequencyFor(kind: SeoPageMatrixEntry["kind"]): SitemapEntry["changeFrequency"] {
  switch (kind) {
    case "home":
      return "daily";
    case "service":
    case "location":
    case "service-in-city":
    case "installation-locality":
    case "area":
    case "service-area":
      return "weekly";
    default:
      return "monthly";
  }
}

function includeInPhase(entry: SeoPageMatrixEntry): boolean {
  if (SITEMAP_PHASE >= 4) return true;
  if (SITEMAP_PHASE >= 2) {
    // Phase 2–3: hubs + installation + areas (service×area from phase 4)
    return entry.kind !== "service-area";
  }
  // Phase 1 emergency: hubs only
  return (
    entry.kind !== "installation-locality" &&
    entry.kind !== "area" &&
    entry.kind !== "service-area"
  );
}

/**
 * Authoritative indexable URL list for sitemap + validation.
 * Built from `getSeoPageMatrix()` — NOT from generateStaticParams().
 */
function buildAllSitemapEntries(): SitemapEntry[] {
  const matrix = getSeoPageMatrix();
  const seen = new Set<string>();
  const entries: SitemapEntry[] = [];

  for (const page of matrix) {
    if (!includeInPhase(page)) continue;
    const url = absoluteUrl(page.path);
    if (seen.has(url)) continue;
    seen.add(url);
    entries.push({
      url,
      lastModified: BUILD_LASTMOD,
      changeFrequency: changeFrequencyFor(page.kind),
      priority: page.priority,
    });
  }

  return entries;
}

let cachedEntries: SitemapEntry[] | null = null;

export function getAllSitemapEntries(): SitemapEntry[] {
  if (!cachedEntries) cachedEntries = buildAllSitemapEntries();
  return cachedEntries;
}

export function resetSitemapEntryCache(): void {
  cachedEntries = null;
  resetSeoPageMatrixCache();
}

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function renderUrlsetXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map((e) => {
      const parts = [
        `<loc>${xmlEscape(e.url)}</loc>`,
        `<lastmod>${e.lastModified.toISOString()}</lastmod>`,
        `<changefreq>${e.changeFrequency}</changefreq>`,
        `<priority>${e.priority.toFixed(1)}</priority>`,
      ];
      return `<url>\n  ${parts.join("\n  ")}\n</url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function renderSitemapIndexXml(shardUrls: string[]): string {
  const now = new Date().toISOString();
  const body = shardUrls
    .map(
      (loc) => `  <sitemap>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>
`;
}

export function shardSitemapEntries(
  entries: SitemapEntry[],
  size = SITEMAP_SHARD_SIZE,
): SitemapEntry[][] {
  const shards: SitemapEntry[][] = [];
  for (let i = 0; i < entries.length; i += size) {
    shards.push(entries.slice(i, i + size));
  }
  return shards.length > 0 ? shards : [[]];
}
