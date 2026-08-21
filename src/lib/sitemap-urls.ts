import { SITE_CONFIG } from "@/config/site";
import { withTrailingSlash } from "@/config/routes";
import { getPublishedServices } from "@/data/initial-services";
import { getPublishedLocations } from "@/data/initial-locations";
import { getServedAreas } from "@/data/initial-areas";
import { getPublishedPropertyTypes } from "@/data/property-types";
import { getPublishedProblems } from "@/data/problems";
import { getPublishedGuides } from "@/data/guides";
import { getPublishedPosts } from "@/data/blog";
import { buildServiceInCityPath } from "@/lib/utils/service-in-city-slug";
import { buildInvisibleGrillsInstallationPath } from "@/lib/utils/installation-in-locality-slug";

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
 */
function resolveSitemapPhase(): 1 | 2 | 3 | 4 {
  const raw = Number(process.env.SITEMAP_PHASE || 4);
  if (raw === 1 || raw === 2 || raw === 3 || raw === 4) return raw;
  return 4;
}
export const SITEMAP_PHASE = resolveSitemapPhase();

/** Primary commercial services (menu / flagship). */
const FLAGSHIP_SERVICE_SLUGS = new Set([
  "invisible-grills",
  "balcony-safety-nets",
  "children-safety-nets",
  "pet-safety-nets",
]);

const BUILD_LASTMOD = new Date();

function absoluteUrl(path: string): string {
  const normalized = withTrailingSlash(path.startsWith("/") ? path : `/${path}`);
  return `${SITE_CONFIG.url}${normalized === "/" ? "/" : normalized}`;
}

function toDate(value?: string | Date | null): Date {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "string" && value) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return BUILD_LASTMOD;
}

function buildAllSitemapEntries(): SitemapEntry[] {
  const locations = getPublishedLocations();
  const services = getPublishedServices();
  const propertyTypes = getPublishedPropertyTypes();
  const problems = getPublishedProblems();
  const guides = getPublishedGuides();
  const posts = getPublishedPosts();

  const menuServices = services.filter((s) => FLAGSHIP_SERVICE_SLUGS.has(s.slug));
  const allServices = services;
  const hubServices = SITEMAP_PHASE >= 2 ? allServices : menuServices;
  const cityComboServices = SITEMAP_PHASE >= 2 ? allServices : menuServices;
  /** Area combos: menu/flagship only — never full keyword × neighbourhood. */
  const areaComboServices = SITEMAP_PHASE >= 4 ? allServices : menuServices;

  const seen = new Set<string>();
  const entries: SitemapEntry[] = [];

  function add(partial: {
    path: string;
    priority: number;
    changeFrequency: SitemapEntry["changeFrequency"];
    lastModified?: string | Date | null;
  }) {
    const url = absoluteUrl(partial.path);
    if (seen.has(url)) return;
    seen.add(url);
    entries.push({
      url,
      lastModified: toDate(partial.lastModified),
      changeFrequency: partial.changeFrequency,
      priority: partial.priority,
    });
  }

  const staticPaths: [string, number, SitemapEntry["changeFrequency"]][] = [
    ["/", 1.0, "daily"],
    ["/services/", 0.9, "weekly"],
    ["/locations/", 0.8, "weekly"],
    ["/property-types/", 0.7, "monthly"],
    ["/solutions/", 0.6, "monthly"],
    ["/projects/", 0.7, "weekly"],
    ["/testimonials/", 0.7, "weekly"],
    ["/gallery/", 0.7, "weekly"],
    ["/blog/", 0.7, "weekly"],
    ["/guides/", 0.65, "monthly"],
    ["/faq/", 0.6, "monthly"],
    ["/pricing-guide/", 0.65, "monthly"],
    ["/materials-guide/", 0.6, "monthly"],
    ["/installation-process/", 0.65, "monthly"],
    ["/safety-guide/", 0.6, "monthly"],
    ["/about/", 0.5, "yearly"],
    ["/contact/", 0.8, "monthly"],
  ];
  for (const [path, priority, changeFrequency] of staticPaths) {
    add({ path, priority, changeFrequency });
  }

  for (const s of hubServices) {
    add({
      path: `/services/${s.slug}/`,
      lastModified: s.updatedAt,
      changeFrequency: "weekly",
      priority: FLAGSHIP_SERVICE_SLUGS.has(s.slug) ? 0.9 : 0.65,
    });
  }

  for (const loc of locations) {
    add({
      path: `/locations/${loc.slug}/`,
      lastModified: loc.updatedAt,
      changeFrequency: "weekly",
      priority: 0.85,
    });

    const areas = getServedAreas(loc.id).sort((a, b) => a.slug.localeCompare(b.slug));

    if (SITEMAP_PHASE >= 2) {
      for (const area of areas) {
        add({
          path: `/locations/${loc.slug}/${area.slug}/`,
          lastModified: area.updatedAt,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }

    for (const s of cityComboServices) {
      add({
        path: buildServiceInCityPath(s.slug, loc.slug),
        lastModified: s.updatedAt,
        changeFrequency: "weekly",
        priority: FLAGSHIP_SERVICE_SLUGS.has(s.slug) ? 0.85 : 0.55,
      });
    }

    // Flagship installation locality pages (high commercial intent)
    if (SITEMAP_PHASE >= 2) {
      for (const area of areas) {
        add({
          path: buildInvisibleGrillsInstallationPath(area.slug),
          lastModified: area.updatedAt,
          changeFrequency: "weekly",
          priority: 0.85,
        });
      }
    }

    // Menu/flagship × area service pages (capped — not intents)
    if (SITEMAP_PHASE >= 2) {
      for (const s of areaComboServices) {
        for (const area of areas) {
          add({
            path: `/${loc.slug}/${area.slug}/${s.slug}/`,
            lastModified: area.updatedAt,
            changeFrequency: "monthly",
            priority: 0.6,
          });
        }
      }
    }
  }

  if (SITEMAP_PHASE >= 3) {
    for (const pt of propertyTypes) {
      for (const s of allServices) {
        add({
          path: `/property-types/${pt.slug}/${s.slug}/`,
          changeFrequency: "monthly",
          priority: FLAGSHIP_SERVICE_SLUGS.has(s.slug) ? 0.55 : 0.4,
        });
      }
    }
  }

  for (const problem of problems) {
    add({
      path: `/solutions/${problem.slug}/`,
      changeFrequency: "monthly",
      priority: 0.55,
    });
  }

  for (const guide of guides) {
    add({
      path: `/guides/${guide.slug}/`,
      lastModified: guide.updatedAt,
      changeFrequency: "monthly",
      priority: 0.55,
    });
  }

  for (const post of posts) {
    add({
      path: `/blog/${post.slug}/`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return entries;
}

let cachedEntries: SitemapEntry[] | null = null;

export function getAllSitemapEntries(): SitemapEntry[] {
  if (!cachedEntries) cachedEntries = buildAllSitemapEntries();
  return cachedEntries;
}

/** Test helper — clear memoized entries (e.g. after env phase change). */
export function resetSitemapEntryCache(): void {
  cachedEntries = null;
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

/** Split entries into chunks of SITEMAP_SHARD_SIZE. */
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
