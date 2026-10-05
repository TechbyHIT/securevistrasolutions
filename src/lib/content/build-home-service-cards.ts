import { SERVICES_MEGA_MENU, getMegaMenuLinkHref } from "@/config/mega-menu";
import { getPublishedServices } from "@/data/initial-services";
import { getServiceImages } from "@/lib/images/get-service-images";

export type HomeServiceCard = {
  title: string;
  description: string;
  href: string;
  image: string;
};

export function buildHomeServiceCards(): HomeServiceCard[] {
  const services = getPublishedServices();
  const cards: HomeServiceCard[] = [];

  for (const service of services) {
    const images = getServiceImages(service.slug);
    cards.push({
      title: service.name,
      description: service.summary,
      href: `/services/${service.slug}/`,
      image: images.heroImage || service.heroImage,
    });
  }

  for (const column of SERVICES_MEGA_MENU) {
    for (const link of column.links.slice(0, 3)) {
      if (cards.some((card) => card.title === link.label)) continue;
      const images = getServiceImages(link.serviceSlug);
      cards.push({
        title: link.label,
        description: `${link.label} with professional measurement, quality materials and neat finishing across Hyderabad.`,
        href: getMegaMenuLinkHref(link),
        image: images.heroImage,
      });
      if (cards.length >= 12) break;
    }
    if (cards.length >= 12) break;
  }

  return cards.slice(0, 12);
}
