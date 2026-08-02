import { describe, expect, it } from "vitest";
import { getPublishedServices } from "@/data/initial-services";
import { getPublishedLocations } from "@/data/initial-locations";
import { buildPremiumServiceInCityLanding } from "@/lib/content/build-premium-service-in-city-content";

describe("premium service-in-city landing", () => {
  it("generates 3000+ words with city-specific content", () => {
    const service = getPublishedServices()[0]!;
    const location = getPublishedLocations()[0]!;
    const landing = buildPremiumServiceInCityLanding(service, location);

    expect(landing.wordCount).toBeGreaterThanOrEqual(3000);
    expect(landing.wordCount).toBeLessThanOrEqual(5500);
    expect(landing.seo.url).toBe(`/invisible-grills-in-hyderabad/`);
    expect(landing.faqs).toHaveLength(20);
    expect(landing.reviews).toHaveLength(10);
    expect(landing.galleryCaptions.length).toBeGreaterThan(0);
    expect(landing.internalLinkSuggestions.length).toBeGreaterThanOrEqual(20);
    expect(landing.blocks.some((b) => b.paragraphs.some((p) => p.includes("Gachibowli")))).toBe(true);
  });
});
