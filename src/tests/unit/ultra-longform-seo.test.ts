import { describe, expect, it } from "vitest";
import { buildPageContent } from "@/lib/content/build-page-content";
import { buildUltraLongformSeo } from "@/lib/content/build-ultra-longform-seo";
import { getPublishedServices } from "@/data/initial-services";
import { getPublishedLocations } from "@/data/initial-locations";
import { getAreaBySlug } from "@/data/initial-areas";

describe("ultra longform SEO content", () => {
  it("generates 20k+ words for a generic topic", () => {
    const result = buildUltraLongformSeo({
      topic: "Invisible Grills",
      placeName: "Gachibowli",
      cityName: "Hyderabad",
      serviceSlug: "invisible-grills",
      areaSlug: "gachibowli",
    });
    expect(result.wordCount).toBeGreaterThanOrEqual(20000);
    expect(result.blocks.length).toBeGreaterThan(5);
    expect(result.faqs.length).toBeGreaterThan(50);
  });

  it("merges 20k+ words into programmatic page content", () => {
    const service = getPublishedServices()[0]!;
    const location = getPublishedLocations()[0]!;
    const area = getAreaBySlug("gachibowli")!;
    const content = buildPageContent({
      pageType: "service-area",
      service,
      location,
      area,
      h1: `${service.name} in ${area.name}`,
    });
    expect(content.wordCount ?? 0).toBeGreaterThanOrEqual(20000);
  });
});
