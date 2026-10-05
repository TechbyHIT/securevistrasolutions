import { getPublishedServices } from "@/data/initial-services";
import { getPublishedLocations } from "@/data/initial-locations";
import { getAreaBySlug, getServedAreas } from "@/data/initial-areas";
import { buildServiceInCityPath } from "@/lib/utils/service-in-city-slug";
import { buildInvisibleGrillsInstallationPath } from "@/lib/utils/installation-in-locality-slug";
import { getAllSitemapEntries } from "@/lib/sitemap-urls";
import { getSeoPageMatrix } from "@/lib/seo/seo-page-matrix";

/**
 * Hyderabad priority localities for BUILD-TIME pre-render only.
 * Indexability/sitemap are independent — every served area still gets ISR pages.
 * Slugs must exist in the authoritative area dataset (never invent).
 */
export const HYDERABAD_PRIORITY_LOCALITY_SLUGS = [
  "gachibowli",
  "kondapur",
  "hitech-city",
  "madhapur",
  "miyapur",
  "kukatpally",
  "financialdistrict", // alias: financial-district
  "jubilee-hills",
  "banjara-hills",
  "ameerpet",
  "begumpet",
  "sr-nagar",
  "manikonda",
  "lbnagar", // alias: lb-nagar
  "dilsukhnagar",
  "uppal",
  "secunderabad",
  "malkajgiri",
  "attapur",
  "mehdipatnam",
  "kompally",
  "alwal",
  "karmanghat",
  "hastinapuram",
  "saidabad",
] as const;

export type PrioritySeoPage = {
  /** Composite slug segment for /[locationSlug]/ (no slashes) */
  locationSlug: string;
  path: string;
  kind: "service-in-city" | "invisible-grills-installation";
  serviceSlug: string;
  localitySlug?: string;
  citySlug: string;
  priority: number;
};

function verifiedPriorityLocalities(cityId: string) {
  return HYDERABAD_PRIORITY_LOCALITY_SLUGS.map((slug) => getAreaBySlug(slug, cityId)).filter(
    (area): area is NonNullable<ReturnType<typeof getAreaBySlug>> =>
      Boolean(area?.isServed && area.publicationStatus === "published"),
  );
}

/**
 * Build-time only: highest-value Hyderabad SEO pages to pre-render.
 * Does NOT limit sitemap or indexability.
 */
export function getPrioritySeoPages(): PrioritySeoPage[] {
  const city = getPublishedLocations().find((loc) => loc.slug === "hyderabad");
  if (!city) return [];

  const services = getPublishedServices();
  const localities = verifiedPriorityLocalities(city.id);
  const pages: PrioritySeoPage[] = [];
  const seen = new Set<string>();

  function add(page: PrioritySeoPage) {
    if (seen.has(page.path)) return;
    seen.add(page.path);
    pages.push(page);
  }

  // Priority 3–4: all services × Hyderabad city hub landings
  for (const service of services) {
    const path = buildServiceInCityPath(service.slug, city.slug);
    add({
      locationSlug: path.replace(/^\/|\/$/g, ""),
      path,
      kind: "service-in-city",
      serviceSlug: service.slug,
      citySlug: city.slug,
      priority: 3,
    });
  }

  // Priority 4–5: invisible-grills installation for priority localities only
  for (const area of localities) {
    const path = buildInvisibleGrillsInstallationPath(area.slug);
    add({
      locationSlug: path.replace(/^\/|\/$/g, ""),
      path,
      kind: "invisible-grills-installation",
      serviceSlug: "invisible-grills",
      localitySlug: area.slug,
      citySlug: city.slug,
      priority: 4,
    });
  }

  return pages.sort((a, b) => a.priority - b.priority || a.path.localeCompare(b.path));
}

/** Params for `app/[locationSlug]/generateStaticParams`. */
export function getPriorityCompositeStaticParams(): { locationSlug: string }[] {
  return getPrioritySeoPages().map((page) => ({ locationSlug: page.locationSlug }));
}

/**
 * Full approved indexable URL set for sitemap / validation.
 * Independent of generateStaticParams.
 */
export function getApprovedIndexablePaths(): string[] {
  return getSeoPageMatrix().map((entry) => entry.path);
}

export function countHyderabadSeoCoverage() {
  const city = getPublishedLocations().find((loc) => loc.slug === "hyderabad");
  const served = city ? getServedAreas(city.id).length : 0;
  const priority = city ? verifiedPriorityLocalities(city.id).length : 0;
  const buildTime = getPrioritySeoPages().length;
  const sitemap = getAllSitemapEntries().length;
  const matrix = getSeoPageMatrix().length;
  return {
    city: city?.slug ?? null,
    servedLocalities: served,
    priorityLocalities: priority,
    buildTimeCompositePages: buildTime,
    approvedIndexablePages: matrix,
    sitemapUrls: sitemap,
    dynamicIsrInstallationPages: Math.max(0, served - priority),
  };
}
