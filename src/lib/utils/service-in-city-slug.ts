import { getPublishedLocations } from "@/data/initial-locations";
import { getServiceBySlug } from "@/data/initial-services";

export function buildServiceInCityPath(serviceSlug: string, citySlug: string): string {
  return `/${serviceSlug}-in-${citySlug}/`;
}

export function buildServiceInCitySlug(serviceSlug: string, citySlug: string): string {
  return `${serviceSlug}-in-${citySlug}`;
}

export type ParsedServiceInCitySlug = {
  serviceSlug: string;
  citySlug: string;
};

/** Parse composite slug like `invisible-grills-in-hyderabad` or `balcony-safety-nets-in-hitech-city`. */
export function parseServiceInCitySlug(compositeSlug: string): ParsedServiceInCitySlug | null {
  const clean = compositeSlug.replace(/^\/+|\/+$/g, "");
  const locations = getPublishedLocations();

  for (const location of locations) {
    const suffix = `-in-${location.slug}`;
    if (clean.endsWith(suffix)) {
      const serviceSlug = clean.slice(0, -suffix.length);
      if (serviceSlug && getServiceBySlug(serviceSlug)) {
        return { serviceSlug, citySlug: location.slug };
      }
    }
  }

  return null;
}
