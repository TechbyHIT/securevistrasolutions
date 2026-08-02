import {
  isSitemapMaterializedGroup,
  isSitemapProgrammaticGroup,
  SITEMAP_EXCLUDED_PROGRAMMATIC_GROUPS,
} from "@/config/sitemap-indexing";
import { getHighIntentKeywordIntents } from "@/data/keyword-intents";
import type { PageRecord } from "@/types/page";

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
    return getHighIntentKeywordIntents().some((intent) => intent.slug === page.intentSlug);
  }

  if (isSitemapProgrammaticGroup(group)) {
    return true;
  }

  return isSitemapMaterializedGroup(group);
}
