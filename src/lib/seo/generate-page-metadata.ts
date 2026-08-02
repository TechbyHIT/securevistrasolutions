import type { Metadata } from "next";
import { BUSINESS_CONFIG } from "@/config/business";
import { SITE_CONFIG } from "@/config/site";
import { SEO_CONFIG } from "@/config/seo";
import { isPageIndexable } from "@/lib/seo/is-page-indexable";
import { isSitemapIndexablePage } from "@/lib/seo/is-page-sitemap-indexable";
import { generateRobots } from "@/lib/seo/generate-robots";
import type { PageRecord } from "@/types/page";

export function generatePageMetadata(page: PageRecord): Metadata {
  const strictlyIndexable = isPageIndexable({
    ...page,
    minimumRequiredWordCount: SEO_CONFIG.minimumWordCounts[page.pageType] ?? 700,
  });

  // Only URLs listed in high-intent sitemaps should be indexed.
  const indexable =
    page.publicationStatus === "published" &&
    page.allowIndexing &&
    page.path !== "/thank-you/" &&
    isSitemapIndexablePage(page) &&
    (strictlyIndexable || page.hasValidCanonical);

  return {
    title: page.title,
    description: page.metaDescription,
    alternates: {
      canonical: page.canonicalUrl,
    },
    robots: generateRobots(indexable),
    openGraph: {
      title: page.openGraphTitle,
      description: page.openGraphDescription,
      url: page.canonicalUrl,
      siteName: BUSINESS_CONFIG.name,
      type: "website",
      locale: SITE_CONFIG.locale,
      images: [
        {
          url: page.openGraphImage,
          width: 1200,
          height: 630,
          alt: page.openGraphImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.twitterTitle,
      description: page.twitterDescription,
      images: [page.openGraphImage],
    },
  };
}
