import { describe, expect, it } from "vitest";
import { isPageIndexable } from "@/lib/seo/is-page-indexable";

describe("isPageIndexable", () => {
  it("allows fully validated published pages", () => {
    expect(
      isPageIndexable({
        publicationStatus: "published",
        allowIndexing: true,
        qualityScore: 90,
        contentReviewed: true,
        localDataVerified: true,
        hasUniqueMetadata: true,
        hasUniqueContent: true,
        hasValidCanonical: true,
        hasInternalLinks: true,
        hasValidSchema: true,
        wordCount: 1200,
        minimumRequiredWordCount: 1000,
        similarityScore: 0.2,
        placeholders: [],
      }),
    ).toBe(true);
  });

  it("blocks pages with placeholders", () => {
    expect(
      isPageIndexable({
        publicationStatus: "published",
        allowIndexing: true,
        qualityScore: 90,
        contentReviewed: true,
        localDataVerified: true,
        hasUniqueMetadata: true,
        hasUniqueContent: true,
        hasValidCanonical: true,
        hasInternalLinks: true,
        hasValidSchema: true,
        wordCount: 1200,
        minimumRequiredWordCount: 1000,
        similarityScore: 0.2,
        placeholders: ["[BUSINESS_NAME]"],
      }),
    ).toBe(false);
  });

  it("blocks low quality pages", () => {
    expect(
      isPageIndexable({
        publicationStatus: "published",
        allowIndexing: true,
        qualityScore: 70,
        contentReviewed: true,
        localDataVerified: true,
        hasUniqueMetadata: true,
        hasUniqueContent: true,
        hasValidCanonical: true,
        hasInternalLinks: true,
        hasValidSchema: true,
        wordCount: 1200,
        minimumRequiredWordCount: 1000,
        similarityScore: 0.2,
      }),
    ).toBe(false);
  });
});
