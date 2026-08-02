import { getServedAreas, getAreaBySlug, resolveAreaSlug } from "@/data/initial-areas";

/** Keyword prefix for locality installation landing pages. */
export const INVISIBLE_GRILLS_INSTALLATION_KEYWORD = "invisible-grills-installation";

/** Maps keyword prefixes to real service slugs. */
export const INSTALLATION_KEYWORD_TO_SERVICE: Record<string, string> = {
  [INVISIBLE_GRILLS_INSTALLATION_KEYWORD]: "invisible-grills",
};

export type ParsedInstallationInLocalitySlug = {
  keywordSlug: string;
  serviceSlug: string;
  localitySlug: string;
};

export function buildInvisibleGrillsInstallationPath(localitySlug: string): string {
  return `/${INVISIBLE_GRILLS_INSTALLATION_KEYWORD}-in-${localitySlug}/`;
}

export function buildInvisibleGrillsInstallationSlug(localitySlug: string): string {
  return `${INVISIBLE_GRILLS_INSTALLATION_KEYWORD}-in-${localitySlug}`;
}

/**
 * Parse composite slug like `invisible-grills-installation-in-gachibowli`.
 * Tries longest area slug match first to avoid partial collisions.
 */
export function parseInstallationInLocalitySlug(
  compositeSlug: string,
): ParsedInstallationInLocalitySlug | null {
  const clean = compositeSlug.replace(/^\/+|\/+$/g, "");

  for (const [keywordSlug, serviceSlug] of Object.entries(INSTALLATION_KEYWORD_TO_SERVICE)) {
    const prefix = `${keywordSlug}-in-`;
    if (!clean.startsWith(prefix)) continue;

    const localityPart = clean.slice(prefix.length);
    if (!localityPart) continue;

    const resolved = resolveAreaSlug(localityPart);
    const area = getAreaBySlug(resolved);
    if (area?.isServed && area.publicationStatus === "published") {
      return {
        keywordSlug,
        serviceSlug,
        localitySlug: area.slug,
      };
    }
  }

  return null;
}

export function getInstallationLocalityAreas() {
  return getServedAreas();
}
