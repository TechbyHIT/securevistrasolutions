import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /privacy-policy and /terms-and-conditions keep noindex,follow in page
        // metadata — do not robots-disallow them or crawlers cannot read that meta.
        disallow: ["/admin/", "/api/", "/thank-you/", "/*?*"],
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url.replace(/^https?:\/\//, ""),
  };
}
