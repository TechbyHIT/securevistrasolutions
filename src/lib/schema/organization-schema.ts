import { BUSINESS_CONFIG } from "@/config/business";
import { SITE_CONFIG } from "@/config/site";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BUSINESS_CONFIG.name,
    legalName: BUSINESS_CONFIG.legalName,
    founder: {
      "@type": "Person",
      name: BUSINESS_CONFIG.ownerName,
    },
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}${BUSINESS_CONFIG.logo}`,
    email: BUSINESS_CONFIG.email,
    telephone: BUSINESS_CONFIG.phone.raw,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS_CONFIG.address.street,
      addressLocality: BUSINESS_CONFIG.address.city,
      addressRegion: BUSINESS_CONFIG.address.state,
      postalCode: BUSINESS_CONFIG.address.postalCode,
      addressCountry: BUSINESS_CONFIG.address.country,
    },
    sameAs: Object.values(BUSINESS_CONFIG.socialLinks).filter(
      (link) => link && !link.startsWith("["),
    ),
  };
}
