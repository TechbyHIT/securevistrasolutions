import type { Service } from "@/types/service";
import { BUSINESS_CONFIG } from "@/config/business";
import { SERVICE_IMAGE_CATALOG, HOME_GALLERY_IMAGES, HOME_HERO_IMAGE } from "@/data/service-image-catalog";

export function getServiceImages(serviceSlug: string) {
  return (
    SERVICE_IMAGE_CATALOG[serviceSlug] ?? {
      heroImage: HOME_HERO_IMAGE,
      galleryImages: [],
    }
  );
}

export function enrichService(service: Service): Service {
  const images = getServiceImages(service.slug);
  return {
    ...service,
    heroImage: images.heroImage,
    galleryImages: images.galleryImages.length > 0 ? images.galleryImages : service.galleryImages,
  };
}

export function getEnrichedServiceBySlug(
  slug: string,
  lookup: (slug: string) => Service | undefined,
): Service | undefined {
  const service = lookup(slug);
  return service ? enrichService(service) : undefined;
}

export function getEnrichedPublishedServices(
  lookup: () => Service[],
): Service[] {
  return lookup().map(enrichService);
}

export function getServiceGalleryImages(serviceSlug: string, placeName?: string, limit = 12) {
  const images = getServiceImages(serviceSlug);
  const label = placeName ? ` in ${placeName}` : " in Hyderabad";
  return images.galleryImages.slice(0, limit).map((src, index) => ({
    src,
    alt: `Professional ${serviceSlug.replace(/-/g, " ")} installation photo ${index + 1}${label}`,
  }));
}

export function getHomeGalleryImages() {
  return HOME_GALLERY_IMAGES.map((item, index) => ({
    src: item.src,
    alt: `${BUSINESS_CONFIG.name} project photo ${index + 1} — ${item.serviceSlug.replace(/-/g, " ")} installation in Hyderabad`,
    href: `/services/${item.serviceSlug}/`,
  }));
}

export { HOME_HERO_IMAGE };
