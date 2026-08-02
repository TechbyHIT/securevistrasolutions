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

export function isSitemapProgrammaticGroup(group: string): boolean {
  return (SITEMAP_PROGRAMMATIC_GROUPS as readonly string[]).includes(group);
}

export function isSitemapMaterializedGroup(group: string | undefined): boolean {
  const name = group ?? "core";
  return SITEMAP_MATERIALIZED_GROUPS.has(name);
}
