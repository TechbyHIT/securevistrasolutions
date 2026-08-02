import type { PageIndexabilityInput } from "@/types/page";
import { SEO_CONFIG } from "@/config/seo";

export function isPageIndexable(page: PageIndexabilityInput): boolean {
  if (page.placeholders && page.placeholders.length > 0) {
    return false;
  }

  return (
    page.publicationStatus === "published" &&
    page.allowIndexing &&
    page.qualityScore >= SEO_CONFIG.minimumQualityScore &&
    page.contentReviewed &&
    page.localDataVerified &&
    page.hasUniqueMetadata &&
    page.hasUniqueContent &&
    page.hasValidCanonical &&
    page.hasInternalLinks &&
    page.hasValidSchema &&
    page.wordCount >= page.minimumRequiredWordCount &&
    page.similarityScore <= SEO_CONFIG.maximumSimilarityScore
  );
}
