import { getPublicPage } from "@/lib/pages/get-public-page";
import { parseServiceInCitySlug } from "@/lib/utils/service-in-city-slug";
import { parseInstallationInLocalitySlug } from "@/lib/utils/installation-in-locality-slug";
import { getServiceBySlug } from "@/data/initial-services";
import { getLocationBySlug, getLocationById } from "@/data/initial-locations";
import { getAreaBySlug } from "@/data/initial-areas";
import { isSitemapIndexablePage } from "@/lib/seo/is-page-sitemap-indexable";
import { withTrailingSlash } from "@/config/routes";
import type { PageRecord } from "@/types/page";

export type ResolvedSeoPage = {
  path: string;
  page: PageRecord;
  kind: "service-in-city" | "invisible-grills-installation" | "other";
  indexable: boolean;
  serviceSlug?: string;
  localitySlug?: string;
  citySlug?: string;
};

/**
 * Single resolver for composite SEO slugs under /[locationSlug]/.
 * Validity here drives HTTP 200; indexability uses the shared sitemap gate.
 */
export function resolveSeoPage(slugOrPath: string): ResolvedSeoPage | null {
  const raw = slugOrPath.replace(/^\/+|\/+$/g, "");
  const path = withTrailingSlash(`/${raw}`);

  const installation = parseInstallationInLocalitySlug(raw);
  if (installation) {
    const area = getAreaBySlug(installation.localitySlug);
    const service = getServiceBySlug(installation.serviceSlug);
    if (!area?.isServed || !service) return null;
    const parent = getLocationById(area.parentId);
    const page = getPublicPage(path);
    if (!page) return null;
    return {
      path,
      page,
      kind: "invisible-grills-installation",
      indexable: isSitemapIndexablePage(page),
      serviceSlug: service.slug,
      localitySlug: area.slug,
      citySlug: parent?.slug,
    };
  }

  const cityCombo = parseServiceInCitySlug(raw);
  if (cityCombo) {
    const service = getServiceBySlug(cityCombo.serviceSlug);
    const location = getLocationBySlug(cityCombo.citySlug);
    if (!service || !location?.isServed) return null;
    const page = getPublicPage(path);
    if (!page) return null;
    return {
      path,
      page,
      kind: "service-in-city",
      indexable: isSitemapIndexablePage(page),
      serviceSlug: service.slug,
      citySlug: location.slug,
    };
  }

  return null;
}
