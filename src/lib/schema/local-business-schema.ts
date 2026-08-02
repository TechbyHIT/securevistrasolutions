import { BUSINESS_CONFIG } from "@/config/business";
import { SITE_CONFIG } from "@/config/site";

export function localBusinessSchema() {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: BUSINESS_CONFIG.name,
    url: SITE_CONFIG.url,
    telephone: BUSINESS_CONFIG.phone.raw,
    email: BUSINESS_CONFIG.email,
    founder: {
      "@type": "Person",
      name: BUSINESS_CONFIG.ownerName,
    },
    image: `${SITE_CONFIG.url}${BUSINESS_CONFIG.defaultOpenGraphImage}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS_CONFIG.address.street,
      addressLocality: BUSINESS_CONFIG.address.city,
      addressRegion: BUSINESS_CONFIG.address.state,
      postalCode: BUSINESS_CONFIG.address.postalCode,
      addressCountry: BUSINESS_CONFIG.address.country,
    },
    areaServed: {
      "@type": "City",
      name: BUSINESS_CONFIG.serviceArea.primaryCity,
      containedInPlace: {
        "@type": "State",
        name: BUSINESS_CONFIG.serviceArea.state,
      },
    },
    priceRange: "$$",
  };

  if (BUSINESS_CONFIG.coordinates.latitude && BUSINESS_CONFIG.coordinates.longitude) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: BUSINESS_CONFIG.coordinates.latitude,
      longitude: BUSINESS_CONFIG.coordinates.longitude,
    };
  }

  return schema;
}
