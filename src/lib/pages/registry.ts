import {
  createAllPageRecords,
  resolvePageByPath,
} from "@/lib/publishing/page-factory";
import {
  buildProgrammaticIndexablePageSample,
} from "@/lib/publishing/enumerate-programmatic-pages";
import { isSeoIndexablePage } from "@/lib/seo/is-page-sitemap-indexable";
import { getSeoPageMatrix } from "@/lib/seo/seo-page-matrix";
import type { PageRecord } from "@/types/page";
import type { PublicationStatus } from "@/types/business";

let cachedPages: PageRecord[] | null = null;
const lazyPageCache = new Map<string, PageRecord>();

function isIndexablePage(page: PageRecord): boolean {
  return (
    page.publicationStatus === "published" &&
    page.allowIndexing &&
    isSeoIndexablePage(page)
  );
}

export function getProgrammaticIndexablePages(forceRefresh = false): PageRecord[] {
  void forceRefresh;
  return buildProgrammaticIndexablePageSample(20);
}

export function getAllPages(forceRefresh = false): PageRecord[] {
  if (!cachedPages || forceRefresh) {
    cachedPages = createAllPageRecords();
    lazyPageCache.clear();
  }
  return cachedPages;
}

export function getPageByPath(path: string): PageRecord | undefined {
  const normalized = path === "/" || path.endsWith("/") ? path : `${path}/`;
  const materialized = getAllPages().find((page) => page.path === normalized);
  if (materialized) return materialized;

  const lazyHit = lazyPageCache.get(normalized);
  if (lazyHit) return lazyHit;

  const resolved = resolvePageByPath(normalized);
  if (resolved) {
    lazyPageCache.set(normalized, resolved);
    return resolved;
  }

  return undefined;
}

export function getPagesByType(pageType: string): PageRecord[] {
  return getAllPages().filter((page) => page.pageType === pageType);
}

export function getPublishedPage(path: string): PageRecord | undefined {
  const page = getPageByPath(path);
  if (!page) return undefined;
  if (page.publicationStatus === "archived") return undefined;
  return page;
}

/** Returns materialized indexable pages only (core, service, guide, etc.). */
export function getMaterializedIndexablePages(): PageRecord[] {
  return getAllPages().filter((page) => isIndexablePage(page));
}

/**
 * Authoritative indexable count = SEO page matrix size.
 * (Not generateStaticParams, not legacy ~74k enumerator.)
 */
export function countIndexablePages(): number {
  return getSeoPageMatrix().length;
}

/** Materialized indexable pages — programmatic URLs use the SEO matrix / sitemap. */
export function getIndexablePages(): PageRecord[] {
  return getMaterializedIndexablePages();
}

export function countByStatus(): Record<PublicationStatus | "indexable" | "total", number> {
  const pages = getAllPages();
  const counts: Record<string, number> = {
    total: pages.length,
    indexable: countIndexablePages(),
    draft: 0,
    review: 0,
    approved: 0,
    published: 0,
    noindex: 0,
    archived: 0,
  };

  for (const page of pages) {
    counts[page.publicationStatus] = (counts[page.publicationStatus] ?? 0) + 1;
  }

  return counts as Record<PublicationStatus | "indexable" | "total", number>;
}

export function paginatePages<T>(
  items: T[],
  options: { cursor?: string; limit?: number; getCursor: (item: T) => string },
): { items: T[]; nextCursor: string | null } {
  const limit = options.limit ?? 100;
  let start = 0;

  if (options.cursor) {
    const index = items.findIndex((item) => options.getCursor(item) === options.cursor);
    start = index >= 0 ? index + 1 : 0;
  }

  const slice = items.slice(start, start + limit);
  const nextCursor =
    start + limit < items.length && slice.length > 0
      ? options.getCursor(slice[slice.length - 1] as T)
      : null;

  return { items: slice, nextCursor };
}
