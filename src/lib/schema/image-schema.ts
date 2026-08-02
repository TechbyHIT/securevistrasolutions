import { SITE_CONFIG } from "@/config/site";

type ImageSchemaInput = {
  url: string;
  caption?: string;
  width?: number;
  height?: number;
};

export function imageSchema(input: ImageSchemaInput) {
  const absoluteUrl = input.url.startsWith("http") ? input.url : `${SITE_CONFIG.url}${input.url}`;

  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: absoluteUrl,
    url: absoluteUrl,
    ...(input.caption ? { caption: input.caption } : {}),
    ...(input.width ? { width: input.width } : {}),
    ...(input.height ? { height: input.height } : {}),
  };
}
