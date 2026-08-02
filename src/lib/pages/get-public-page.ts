import { getPageByPath } from "@/lib/pages/registry";
import type { PageRecord } from "@/types/page";

export function getPublicPage(path: string): PageRecord | null {
  const page = getPageByPath(path);
  if (!page || page.publicationStatus !== "published") return null;
  return page;
}
