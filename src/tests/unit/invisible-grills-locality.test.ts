import { describe, expect, it } from "vitest";
import { getAreaBySlug } from "@/data/initial-areas";
import { buildInvisibleGrillsLocalityContent } from "@/lib/content/build-invisible-grills-locality-content";
import {
  buildInvisibleGrillsInstallationPath,
  parseInstallationInLocalitySlug,
} from "@/lib/utils/installation-in-locality-slug";
import { resolveInvisibleGrillsInstallationCombo } from "@/lib/publishing/page-factory";
import { BUSINESS_CONFIG } from "@/config/business";

describe("invisible grills installation in locality", () => {
  it("parses and builds locality installation URLs", () => {
    expect(buildInvisibleGrillsInstallationPath("gachibowli")).toBe(
      "/invisible-grills-installation-in-gachibowli/",
    );
    expect(parseInstallationInLocalitySlug("invisible-grills-installation-in-gachibowli")).toEqual({
      keywordSlug: "invisible-grills-installation",
      serviceSlug: "invisible-grills",
      localitySlug: "gachibowli",
    });
    expect(parseInstallationInLocalitySlug("invisible-grills-in-hyderabad")).toBeNull();
  });

  it("builds long-form SEO content with high-intent internal links", () => {
    const area = getAreaBySlug("gachibowli");
    expect(area).toBeTruthy();
    const content = buildInvisibleGrillsLocalityContent(area!);

    expect(content.h1).toBe("Invisible Grills Installation in Gachibowli");
    expect(content.title).toContain("Gachibowli");
    expect(content.title).toContain(BUSINESS_CONFIG.name);
    expect(content.metaDescription).toContain("Gachibowli");
    expect(content.metaDescription.length).toBeGreaterThan(80);
    expect(content.faqs.length).toBeGreaterThanOrEqual(10);
    expect(content.introExtended.length).toBeGreaterThanOrEqual(4);
    expect(content.wordCountEstimate).toBeGreaterThanOrEqual(1500);
    expect(content.longformBlocks.length).toBeGreaterThanOrEqual(5);
    expect(content.highIntentLinks.length).toBeGreaterThanOrEqual(20);
    expect(content.highIntentLinks.some((l) => /cost|price|installation/i.test(l.label))).toBe(true);
    expect(content.nearbyLocalityLinks.length).toBeGreaterThanOrEqual(8);
    expect(content.moreLocalityLinks.length).toBeGreaterThanOrEqual(10);
    expect(content.allInternalLinks.length).toBeGreaterThanOrEqual(50);
    expect(content.tableOfContents.length).toBeGreaterThanOrEqual(12);
    expect(content.cta).toContain(BUSINESS_CONFIG.name);
  });

  it("resolves a published page record", () => {
    const page = resolveInvisibleGrillsInstallationCombo("gachibowli");
    expect(page).toBeTruthy();
    expect(page?.path).toBe("/invisible-grills-installation-in-gachibowli/");
    expect(page?.pageType).toBe("invisible-grills-installation-in-locality");
    expect(page?.publicationStatus).toBe("published");
    expect(page?.wordCount).toBeGreaterThanOrEqual(1500);
  });
});
