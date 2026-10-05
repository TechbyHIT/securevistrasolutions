/** Which sitemap shards are emitted and eligible for Google indexing. */
export const SITEMAP_PROGRAMMATIC_GROUPS = [
  "invisible-grills-installation",
  "areas",
  "service-area",
] as const;

/** Materialized page groups included in sitemaps. */
export const SITEMAP_MATERIALIZED_GROUPS = new Set([
  "core",
  "services",
  "service-in-city",
  "locations",
  "guides",
  "blog",
  "solutions",
  "property-types",
  "areas",
  "service-area",
]);

/**
 * Programmatic groups excluded from sitemaps (still reachable via ISR, noindex).
 * Intent URLs remain excluded at current scale (~74k).
 */
export const SITEMAP_EXCLUDED_PROGRAMMATIC_GROUPS = new Set(["service-area-intent"]);

/**
 * Commercial tags only for sitemap intent URLs (when re-enabled).
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
