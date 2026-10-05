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
import {
  SEO_INTENTIONAL_NOINDEX_PATHS,
  SEO_THIN_NOINDEX_PAGE_TYPES,
} from "@/lib/seo/seo-page-matrix";
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

  if (SEO_THIN_NOINDEX_PAGE_TYPES.has(page.pageType)) {
    return false;
  }

  const group = page.sitemapGroup ?? "core";

  if (SITEMAP_EXCLUDED_PROGRAMMATIC_GROUPS.has(group)) {
    return false;
  }

  if (page.pageType === "service-area" || page.pageType === "area") {
    return false;
  }

  // Intent URLs stay reachable via ISR but are intentionally noindex at this scale
  // (~74k combinations). Re-enable only when also added to the authoritative sitemap.
  if (page.pageType === "service-area-intent" || group === "service-area-intent") {
    return false;
  }

  if (isSitemapProgrammaticGroup(group)) {
    // invisible-grills-installation is the only programmatic group that indexes
    return group === "invisible-grills-installation";
  }

  return isSitemapMaterializedGroup(group);
}

/** @deprecated Prefer isSeoIndexablePage — kept for call-site compatibility */
export function isSitemapIndexablePage(page: PageRecord): boolean {
  return isSeoIndexablePage(page);
}
