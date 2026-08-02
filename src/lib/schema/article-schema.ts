import { BUSINESS_CONFIG } from "@/config/business";
import { SITE_CONFIG } from "@/config/site";

type ArticleSchemaInput = {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
};

export function articleSchema(input: ArticleSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: input.url,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: {
      "@type": "Organization",
      name: BUSINESS_CONFIG.name,
    },
    publisher: {
      "@type": "Organization",
      name: BUSINESS_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.url}${BUSINESS_CONFIG.logo}`,
      },
    },
    ...(input.image
      ? { image: input.image.startsWith("http") ? input.image : `${SITE_CONFIG.url}${input.image}` }
      : {}),
  };
}
