import { DEFAULT_LOCATION_SLUG } from "@/config/mega-menu";
import { getServedAreas } from "@/data/initial-areas";
import { getPublishedServices } from "@/data/initial-services";
import { getServiceImages } from "@/lib/images/get-service-images";
import { buildInvisibleGrillsInstallationPath } from "@/lib/utils/installation-in-locality-slug";
import { buildServiceInCityPath } from "@/lib/utils/service-in-city-slug";

export type AreaServiceLink = {
  label: string;
  href: string;
};

export type AreaLinkNode = {
  slug: string;
  name: string;
  areaHubHref: string;
  installationHref: string;
  serviceLinks: AreaServiceLink[];
};

export type ServiceImageBlock = {
  slug: string;
  name: string;
  summary: string;
  href: string;
  cityHref: string;
  heroImage: string;
  galleryImages: string[];
  sampleAreaLinks: AreaServiceLink[];
};

const CITY = DEFAULT_LOCATION_SLUG;

/** All served Hyderabad areas with service + sub-location internal links. */
export function buildHyderabadAreaLinkGraph(): AreaLinkNode[] {
  const services = getPublishedServices();
  const areas = getServedAreas().sort((a, b) => a.name.localeCompare(b.name));

  return areas.map((area) => ({
    slug: area.slug,
    name: area.name,
    areaHubHref: `/locations/${CITY}/${area.slug}/`,
    installationHref: buildInvisibleGrillsInstallationPath(area.slug),
    serviceLinks: services.map((service) => ({
      label: `${service.shortName} in ${area.name}`,
      href: `/${CITY}/${area.slug}/${service.slug}/`,
    })),
  }));
}

/** Group area nodes into alphabetical buckets for long-scroll SEO directories. */
export function groupAreaLinksByLetter(nodes: AreaLinkNode[]): { letter: string; areas: AreaLinkNode[] }[] {
  const map = new Map<string, AreaLinkNode[]>();
  for (const node of nodes) {
    const letter = (node.name[0] ?? "#").toUpperCase();
    const key = /[A-Z]/.test(letter) ? letter : "#";
    const list = map.get(key) ?? [];
    list.push(node);
    map.set(key, list);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, areas]) => ({ letter, areas }));
}

/** Chunk area nodes for paginated-style SEO sections. */
export function chunkAreaLinks(nodes: AreaLinkNode[], size = 24): AreaLinkNode[][] {
  const chunks: AreaLinkNode[][] = [];
  for (let i = 0; i < nodes.length; i += size) {
    chunks.push(nodes.slice(i, i + size));
  }
  return chunks;
}

/** Homepage / services index image blocks with sample area deep links. */
export function buildHomeServiceImageBlocks(sampleAreas = 12): ServiceImageBlock[] {
  const services = getPublishedServices();
  const areas = getServedAreas().slice(0, sampleAreas);

  return services.map((service) => {
    const images = getServiceImages(service.slug);
    return {
      slug: service.slug,
      name: service.name,
      summary: service.summary,
      href: `/services/${service.slug}/`,
      cityHref: buildServiceInCityPath(service.slug, CITY),
      heroImage: images.heroImage || service.heroImage,
      galleryImages: (images.galleryImages.length > 0
        ? images.galleryImages
        : service.galleryImages
      ).slice(0, 4),
      sampleAreaLinks: areas.map((area) => ({
        label: `${service.shortName} in ${area.name}`,
        href: `/${CITY}/${area.slug}/${service.slug}/`,
      })),
    };
  });
}

export function countHyderabadLinkGraph() {
  const nodes = buildHyderabadAreaLinkGraph();
  const serviceLinkCount = nodes.reduce((sum, node) => sum + node.serviceLinks.length, 0);
  return {
    areas: nodes.length,
    serviceLinks: serviceLinkCount,
    areaHubs: nodes.length,
    installationPages: nodes.length,
    total: serviceLinkCount + nodes.length * 2,
  };
}
