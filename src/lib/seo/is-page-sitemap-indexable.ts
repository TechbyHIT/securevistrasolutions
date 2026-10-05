/**
 * Indexability policy for robots meta + sitemap membership.
 *
 * VALID indexable pages come from the authoritative SEO page matrix.
 * generateStaticParams() never controls indexability.
 */
import {
  isSitemapMaterializedGroup,
  isSitemapProgrammaticGroup,
  SITEMAP_EXCLUDED_PROGRAMMATIC_GROUPS,
} from "@/config/sitemap-indexing";
import { SEO_INTENTIONAL_NOINDEX_PATHS } from "@/lib/seo/seo-page-matrix";
import type { PageRecord } from "@/types/page";

/**
 * Whether a published page should receive index,follow and appear in the sitemap.
 * Alias kept as `isSitemapIndexablePage` for existing call sites.
 */
export function isSeoIndexablePage(page: PageRecord): boolean {
  if (SEO_INTENTIONAL_NOINDEX_PATHS.has(page.path)) {
    return false;
  }

  if (page.path === "/thank-you/") {
    return false;
  }

  if (page.publicationStatus !== "published" || page.allowIndexing === false) {
    return false;
  }

  const group = page.sitemapGroup ?? "core";

  // Intent URLs stay noindex at ~74k scale until explicitly promoted into the matrix.
  if (page.pageType === "service-area-intent" || group === "service-area-intent") {
    return false;
  }

  if (SITEMAP_EXCLUDED_PROGRAMMATIC_GROUPS.has(group)) {
    return false;
  }

  // Area hubs + service×area are approved indexable SEO pages (ISR + sitemap).
  if (page.pageType === "area" || page.pageType === "service-area") {
    return true;
  }

  if (group === "areas" || group === "service-area") {
    return true;
  }

  if (isSitemapProgrammaticGroup(group)) {
    return group === "invisible-grills-installation";
  }

  return isSitemapMaterializedGroup(group);
}

/** @deprecated Prefer isSeoIndexablePage — kept for call-site compatibility */
export function isSitemapIndexablePage(page: PageRecord): boolean {
  return isSeoIndexablePage(page);
}
