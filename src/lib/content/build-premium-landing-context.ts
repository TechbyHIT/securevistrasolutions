import { BUSINESS_CONFIG } from "@/config/business";
import { getCitySeoProfile } from "@/data/city-seo-profiles";
import { getLandmarksByLocation } from "@/data/initial-landmarks";
import { getServedAreas } from "@/data/initial-areas";
import { buildServiceInCityPath } from "@/lib/utils/service-in-city-slug";
import type { Location } from "@/types/location";
import type { Service } from "@/types/service";
import type { PremiumLandingContext } from "@/lib/content/premium-landing-types";

export function buildPremiumLandingContext(
  service: Service,
  location: Location,
  company = BUSINESS_CONFIG.name,
): PremiumLandingContext {
  const cityProfile = getCitySeoProfile(location.slug);
  const landmarksFromDb = getLandmarksByLocation(location.id).map((lm) => lm.name);
  const neighborhoods = getServedAreas(location.id)
    .slice(0, 30)
    .map((area) => area.name);

  return {
    service,
    location,
    city: location.name,
    citySlug: location.slug,
    state: location.state || cityProfile.state,
    company,
    landmarks: landmarksFromDb.length > 0 ? landmarksFromDb : cityProfile.landmarks,
    neighborhoods: neighborhoods.length > 0 ? neighborhoods : cityProfile.popularLocalities,
    nearbyCities: cityProfile.nearbyCities,
  };
}

export function buildPremiumLandingUrl(serviceSlug: string, citySlug: string): string {
  return buildServiceInCityPath(serviceSlug, citySlug);
}
