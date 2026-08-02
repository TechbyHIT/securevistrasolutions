import { SITE_CONFIG } from "@/config/site";

export type BreadcrumbItem = {
  label: string;
  href: string;
};

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href.startsWith("http") ? item.href : `${SITE_CONFIG.url}${item.href}`,
    })),
  };
}
