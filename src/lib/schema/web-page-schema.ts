import { SITE_CONFIG } from "@/config/site";

type WebPageSchemaInput = {
  name: string;
  description: string;
  url: string;
};

export function webPageSchema(input: WebPageSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: input.url,
    inLanguage: SITE_CONFIG.language,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
  };
}
