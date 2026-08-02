import { getPublishedServices } from "@/data/initial-services";
import { getPublishedLocations } from "@/data/initial-locations";
import { getPublishedAreas, getServedAreas } from "@/data/initial-areas";
import { getServiceById } from "@/data/initial-services";
import { getLocationById } from "@/data/initial-locations";
import { getAreaById } from "@/data/initial-areas";
import {
  getSampleIntentsForLinking,
  getSampleIntentsForService,
} from "@/data/keyword-intents";
import { buildServiceInCityPath } from "@/lib/utils/service-in-city-slug";
import type { PageRecord } from "@/types/page";

export type InternalLink = {
  label: string;
  href: string;
};

function linkLimitForPageType(pageType: PageRecord["pageType"]): number {
  switch (pageType) {
    case "area":
      return 48;
    case "service-in-city":
      return 40;
    case "service-area":
      return 24;
    case "service-area-intent":
      return 28;
    default:
      return 12;
  }
}

export function generateInternalLinks(page: PageRecord): InternalLink[] {
  const links: InternalLink[] = [];
  const seen = new Set<string>();

  function add(label: string, href: string) {
    if (href === page.path || seen.has(href)) return;
    seen.add(href);
    links.push({ label, href });
  }

  add("Home", "/");
  add("Services", "/services/");
  add("Locations", "/locations/");
  add("Contact", "/contact/");

  if (page.serviceId) {
    const service = getServiceById(page.serviceId);
    if (service) {
      add(service.name, `/services/${service.slug}/`);
      for (const relatedId of service.relatedServiceIds.slice(0, 3)) {
        const related = getServiceById(relatedId);
        if (related) add(related.name, `/services/${related.slug}/`);
      }
    }
  }

  if (page.locationId) {
    const location = getLocationById(page.locationId);
    if (location) {
      add(location.name, `/locations/${location.slug}/`);
      const services = getPublishedServices();
      for (const service of services) {
        add(`${service.name} in ${location.name}`, buildServiceInCityPath(service.slug, location.slug));
      }
    }
  }

  if (page.areaId) {
    const area = getAreaById(page.areaId);
    const location = page.locationId ? getLocationById(page.locationId) : undefined;
    if (area && location) {
      add(area.name, `/locations/${location.slug}/${area.slug}/`);
      const services = getPublishedServices();
      for (const service of services) {
        add(
          `${service.name} in ${area.name}`,
          `/${location.slug}/${area.slug}/${service.slug}/`,
        );
      }
    }
  }

  if (page.pageType === "service-in-city" && page.serviceId && page.locationId) {
    const service = getServiceById(page.serviceId);
    const location = getLocationById(page.locationId);
    if (service && location) {
      for (const related of getPublishedServices()) {
        if (related.id === service.id) continue;
        add(
          `${related.name} in ${location.name}`,
          buildServiceInCityPath(related.slug, location.slug),
        );
      }
      const areas = getServedAreas(location.id).slice(0, 25);
      for (const area of areas) {
        add(
          `${service.name} in ${area.name}`,
          `/${location.slug}/${area.slug}/${service.slug}/`,
        );
      }
      for (const intent of getSampleIntentsForService(service.slug, 15)) {
        const area = areas[0];
        if (area) {
          add(
            intent.label,
            `/${location.slug}/${area.slug}/${service.slug}/${intent.slug}/`,
          );
        }
      }
    }
  }

  if (page.pageType === "service-area" && page.serviceId && page.areaId && page.locationId) {
    const service = getServiceById(page.serviceId);
    const area = getAreaById(page.areaId);
    const location = getLocationById(page.locationId);
    if (service && area && location) {
      for (const intent of getSampleIntentsForService(service.slug, 20)) {
        add(
          intent.label,
          `/${location.slug}/${area.slug}/${service.slug}/${intent.slug}/`,
        );
      }
    }
  }

  if (
    page.pageType === "service-area-intent" &&
    page.serviceId &&
    page.areaId &&
    page.locationId
  ) {
    const service = getServiceById(page.serviceId);
    const area = getAreaById(page.areaId);
    const location = getLocationById(page.locationId);
    if (service && area && location) {
      add(
        `${service.name} in ${area.name}`,
        `/${location.slug}/${area.slug}/${service.slug}/`,
      );
      for (const intent of getSampleIntentsForService(service.slug, 24)) {
        if (intent.slug === page.intentSlug) continue;
        add(
          intent.label,
          `/${location.slug}/${area.slug}/${service.slug}/${intent.slug}/`,
        );
      }
    }
  }

  if (page.pageType === "area" && page.areaId && page.locationId) {
    const area = getAreaById(page.areaId);
    const location = getLocationById(page.locationId);
    if (area && location) {
      for (const intent of getSampleIntentsForLinking(36)) {
        add(
          intent.label,
          `/${location.slug}/${area.slug}/${intent.serviceSlug}/${intent.slug}/`,
        );
      }
    }
  }

  if (page.pageType === "service" || page.pageType === "location") {
    const locations = getPublishedLocations();
    const services = getPublishedServices().slice(0, 4);
    for (const location of locations) {
      for (const service of services.slice(0, 2)) {
        add(`${service.name} in ${location.name}`, buildServiceInCityPath(service.slug, location.slug));
      }
    }
  }

  if (page.pageType === "area" || page.pageType === "location") {
    const areas = (page.locationId ? getServedAreas(page.locationId) : getPublishedAreas()).slice(
      0,
      8,
    );
    const location = page.locationId ? getLocationById(page.locationId) : getPublishedLocations()[0];
    if (location) {
      for (const area of areas) {
        add(area.name, `/locations/${location.slug}/${area.slug}/`);
      }
    }
  }

  add("FAQ", "/faq/");
  add("Pricing Guide", "/pricing-guide/");

  return links.slice(0, linkLimitForPageType(page.pageType));
}
