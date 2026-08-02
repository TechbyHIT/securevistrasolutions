/** Which sitemap shards are emitted and eligible for Google indexing. */
export const SITEMAP_PROGRAMMATIC_GROUPS = [
  "invisible-grills-installation",
  "service-area-intent",
] as const;

/** Materialized page groups included in sitemaps (excludes bulk area hubs). */
export const SITEMAP_MATERIALIZED_GROUPS = new Set([
  "core",
  "services",
  "service-in-city",
  "guides",
  "blog",
]);

/** Programmatic groups excluded from sitemaps (still reachable, noindex). */
export const SITEMAP_EXCLUDED_PROGRAMMATIC_GROUPS = new Set(["service-area", "area"]);

/**
 * Commercial tags only for sitemap intent URLs.
 * Broader tags (safety/material/design/application) explode to millions of URLs
 * and cause Google Search Console "Couldn't fetch" on the shard index.
 */
export const SITEMAP_INTENT_TAGS = new Set([
  "pricing",
  "installation",
  "buy",
  "near-me",
  "provider",
]);

/** Cap intents per service so area×intent stays Google-crawlable. */
export const SITEMAP_MAX_INTENTS_PER_SERVICE = 30;

export function isSitemapProgrammaticGroup(group: string): boolean {
  return (SITEMAP_PROGRAMMATIC_GROUPS as readonly string[]).includes(group);
}

export function isSitemapMaterializedGroup(group: string | undefined): boolean {
  const name = group ?? "core";
  return SITEMAP_MATERIALIZED_GROUPS.has(name);
}
