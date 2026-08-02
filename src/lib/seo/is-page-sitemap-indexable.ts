import {
  isSitemapMaterializedGroup,
  isSitemapProgrammaticGroup,
  SITEMAP_EXCLUDED_PROGRAMMATIC_GROUPS,
} from "@/config/sitemap-indexing";
import { getSitemapKeywordIntents } from "@/data/keyword-intents";
import type { PageRecord } from "@/types/page";

let sitemapIntentSlugSet: Set<string> | null = null;

function getSitemapIntentSlugSet(): Set<string> {
  if (!sitemapIntentSlugSet) {
    sitemapIntentSlugSet = new Set(getSitemapKeywordIntents().map((intent) => intent.slug));
  }
  return sitemapIntentSlugSet;
}

export function isSitemapIndexablePage(page: PageRecord): boolean {
  const group = page.sitemapGroup ?? "core";

  if (SITEMAP_EXCLUDED_PROGRAMMATIC_GROUPS.has(group)) {
    return false;
  }

  if (page.pageType === "service-area") {
    return false;
  }

  if (page.pageType === "area") {
    return false;
  }

  if (page.pageType === "service-area-intent" || group === "service-area-intent") {
    if (!page.intentSlug) return false;
    return getSitemapIntentSlugSet().has(page.intentSlug);
  }

  if (isSitemapProgrammaticGroup(group)) {
    return true;
  }

  return isSitemapMaterializedGroup(group);
}
