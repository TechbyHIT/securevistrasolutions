import { BUSINESS_CONFIG } from "@/config/business";
import { SITE_CONFIG } from "@/config/site";

type ServiceSchemaInput = {
  name: string;
  description: string;
  url: string;
  image?: string;
  areaServed?: string;
};

export function serviceSchema(input: ServiceSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: input.url,
    provider: {
      "@type": "LocalBusiness",
      name: BUSINESS_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    areaServed: {
      "@type": "City",
      name: input.areaServed ?? BUSINESS_CONFIG.serviceArea.primaryCity,
    },
    ...(input.image
      ? { image: input.image.startsWith("http") ? input.image : `${SITE_CONFIG.url}${input.image}` }
      : {}),
  };
}
