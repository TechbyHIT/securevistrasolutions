import { SITE_CONFIG } from "@/config/site";
import { withTrailingSlash } from "@/config/routes";

export function generateCanonical(path: string): string {
  const normalizedPath = withTrailingSlash(path.startsWith("/") ? path : `/${path}`);
  return `${SITE_CONFIG.url}${normalizedPath === "/" ? "/" : normalizedPath}`;
}

export function normalizePath(path: string): string {
  return withTrailingSlash(
    path
      .toLowerCase()
      .replace(/\/{2,}/g, "/")
      .replace(/\?.*$/, "")
      .replace(/#.*$/, ""),
  );
}
