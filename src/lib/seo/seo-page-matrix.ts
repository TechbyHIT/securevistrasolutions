/**
 * Authoritative SEO page matrix — single source of truth for:
 * - which URLs are VALID + INDEXABLE
 * - sitemap membership
 * - robots index,follow
 * - priority / build-time pre-render selection
 *
 * CRITICAL: generateStaticParams() is NOT this list.
 * Absence from generateStaticParams never means noindex / skip / 404 / sitemap-exclude.
 */
import { getPublishedServices } from "@/data/initial-services";
import { getPublishedLocations } from "@/data/initial-locations";
import { getServedAreas } from "@/data/initial-areas";
import { getPublishedProblems } from "@/data/problems";
import { getPublishedPropertyTypes } from "@/data/property-types";
import { getPublishedGuides } from "@/data/guides";
import { getPublishedPosts } from "@/data/blog";
import { buildServiceInCityPath } from "@/lib/utils/service-in-city-slug";
import { buildInvisibleGrillsInstallationPath } from "@/lib/utils/installation-in-locality-slug";
import { withTrailingSlash } from "@/config/routes";

export type SeoPageKind =
  | "home"
  | "core"
  | "service"
  | "location"
  | "service-in-city"
  | "installation-locality"
  | "area"
  | "service-area"
  | "solution"
  | "property-type"
  | "guide"
  | "blog";

export type SeoPageMatrixEntry = {
  path: string;
  kind: SeoPageKind;
  /** Internal priority 1.0 (highest) → 0.5 */
  priority: number;
  /** Build-time pre-render candidate (still independent of indexability) */
  preRender: boolean;
  indexable: true;
  serviceSlug?: string;
  locationSlug?: string;
  areaSlug?: string;
};

const CORE_INDEXABLE: { path: string; priority: number }[] = [
  { path: "/", priority: 1.0 },
  { path: "/services/", priority: 0.9 },
  { path: "/locations/", priority: 0.85 },
  { path: "/property-types/", priority: 0.55 },
  { path: "/solutions/", priority: 0.55 },
  { path: "/projects/", priority: 0.7 },
  { path: "/testimonials/", priority: 0.65 },
  { path: "/gallery/", priority: 0.65 },
  { path: "/blog/", priority: 0.7 },
  { path: "/guides/", priority: 0.65 },
  { path: "/faq/", priority: 0.6 },
  { path: "/pricing-guide/", priority: 0.65 },
  { path: "/materials-guide/", priority: 0.6 },
  { path: "/installation-process/", priority: 0.65 },
  { path: "/safety-guide/", priority: 0.6 },
  { path: "/about/", priority: 0.5 },
  { path: "/contact/", priority: 0.8 },
];

/** Legal / utility pages — published but intentionally noindex. */
export const SEO_INTENTIONAL_NOINDEX_PATHS = new Set([
  "/thank-you/",
  "/privacy-policy/",
  "/terms-and-conditions/",
  "/disclaimer/",
]);

/**
 * Only deep intent URLs stay noindex by default (~74k combinations).
 * Area hubs and service×area pages are approved indexable SEO pages.
 */
export const SEO_THIN_NOINDEX_PAGE_TYPES = new Set(["service-area-intent"]);

let cachedMatrix: SeoPageMatrixEntry[] | null = null;

function normalizePath(path: string): string {
  return withTrailingSlash(path.startsWith("/") ? path : `/${path}`);
}

/**
 * Full approved indexable SEO page matrix.
 * Independent of generateStaticParams().
 */
export function getSeoPageMatrix(forceRefresh = false): SeoPageMatrixEntry[] {
  if (cachedMatrix && !forceRefresh) return cachedMatrix;

  const locations = getPublishedLocations();
  const services = getPublishedServices();
  const problems = getPublishedProblems();
  const propertyTypes = getPublishedPropertyTypes();
  const guides = getPublishedGuides();
  const posts = getPublishedPosts();

  const entries: SeoPageMatrixEntry[] = [];
  const seen = new Set<string>();

  function add(entry: Omit<SeoPageMatrixEntry, "indexable">) {
    const path = normalizePath(entry.path);
    if (seen.has(path) || SEO_INTENTIONAL_NOINDEX_PATHS.has(path)) return;
    seen.add(path);
    entries.push({ ...entry, path, indexable: true });
  }

  for (const core of CORE_INDEXABLE) {
    add({
      path: core.path,
      kind: core.path === "/" ? "home" : "core",
      priority: core.priority,
      preRender: core.path === "/",
    });
  }

  for (const service of services) {
    add({
      path: `/services/${service.slug}/`,
      kind: "service",
      priority: 0.85,
      preRender: true,
      serviceSlug: service.slug,
    });
  }

  for (const location of locations) {
    add({
      path: `/locations/${location.slug}/`,
      kind: "location",
      priority: 0.85,
      preRender: true,
      locationSlug: location.slug,
    });

    for (const service of services) {
      add({
        path: buildServiceInCityPath(service.slug, location.slug),
        kind: "service-in-city",
        priority: 0.8,
        preRender: location.slug === "hyderabad",
        serviceSlug: service.slug,
        locationSlug: location.slug,
      });
    }

    const areas = getServedAreas(location.id);
    for (const area of areas) {
      add({
        path: `/locations/${location.slug}/${area.slug}/`,
        kind: "area",
        priority: 0.65,
        preRender: false,
        locationSlug: location.slug,
        areaSlug: area.slug,
      });

      for (const service of services) {
        add({
          path: `/${location.slug}/${area.slug}/${service.slug}/`,
          kind: "service-area",
          priority: 0.6,
          preRender: false,
          serviceSlug: service.slug,
          locationSlug: location.slug,
          areaSlug: area.slug,
        });
      }

      add({
        path: buildInvisibleGrillsInstallationPath(area.slug),
        kind: "installation-locality",
        priority: 0.7,
        preRender: false,
        serviceSlug: "invisible-grills",
        locationSlug: location.slug,
        areaSlug: area.slug,
      });
    }
  }

  for (const problem of problems) {
    add({
      path: `/solutions/${problem.slug}/`,
      kind: "solution",
      priority: 0.6,
      preRender: false,
    });
  }

  for (const propertyType of propertyTypes) {
    for (const service of services) {
      if (!service.suitablePropertyTypes.includes(propertyType.slug)) continue;
      add({
        path: `/property-types/${propertyType.slug}/${service.slug}/`,
        kind: "property-type",
        priority: 0.55,
        preRender: false,
        serviceSlug: service.slug,
      });
    }
  }

  for (const guide of guides) {
    add({
      path: `/guides/${guide.slug}/`,
      kind: "guide",
      priority: 0.55,
      preRender: false,
    });
  }

  for (const post of posts) {
    add({
      path: `/blog/${post.slug}/`,
      kind: "blog",
      priority: 0.65,
      preRender: false,
    });
  }

  cachedMatrix = entries.sort(
    (a, b) => b.priority - a.priority || a.path.localeCompare(b.path),
  );
  return cachedMatrix;
}

export function resetSeoPageMatrixCache(): void {
  cachedMatrix = null;
}

export function getApprovedIndexableSeoPaths(): string[] {
  return getSeoPageMatrix().map((entry) => entry.path);
}

export function isApprovedIndexablePath(path: string): boolean {
  const normalized = normalizePath(path);
  return getSeoPageMatrix().some((entry) => entry.path === normalized);
}

export function countSeoPageMatrix() {
  const matrix = getSeoPageMatrix();
  const byKind: Record<string, number> = {};
  for (const entry of matrix) {
    byKind[entry.kind] = (byKind[entry.kind] ?? 0) + 1;
  }
  return {
    totalIndexable: matrix.length,
    byKind,
  };
}
