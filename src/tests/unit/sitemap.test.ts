import { describe, expect, it } from "vitest";
import {
  countSitemapEntries,
  getSitemapEntries,
  getSitemapGroups,
  getSitemapShardEntries,
  listSitemapShards,
  buildSitemapIndexXml,
} from "@/lib/sitemap/get-sitemap-entries";
import { countProgrammaticIndexablePages } from "@/lib/publishing/enumerate-programmatic-pages";
import { resolveInvisibleGrillsInstallationCombo } from "@/lib/publishing/page-factory";
import { isPageIndexable } from "@/lib/seo/is-page-indexable";
import { SEO_CONFIG } from "@/config/seo";

describe("sitemap indexability", () => {
  it("includes high-intent programmatic URL groups only", () => {
    const groups = getSitemapGroups();
    expect(groups).toContain("service-area-intent");
    expect(groups).toContain("invisible-grills-installation");
    expect(groups).toContain("service-in-city");
    expect(groups).not.toContain("service-area");
    expect(groups).not.toContain("areas");
  });

  it("enumerates high-intent intent URLs and installation localities", () => {
    const programmatic = countProgrammaticIndexablePages();
    expect(programmatic.invisibleGrillsInstallation).toBeGreaterThanOrEqual(352);

    const installCount = countSitemapEntries("invisible-grills-installation");
    expect(installCount).toBeGreaterThanOrEqual(352);

    const intentTotal = countSitemapEntries("service-area-intent");
    expect(intentTotal).toBeGreaterThan(1000);
    expect(intentTotal).toBeLessThan(programmatic.serviceAreaIntents * 2);
  });

  it("builds a sharded sitemap index covering every group", () => {
    const shards = listSitemapShards();
    expect(shards.length).toBeGreaterThan(5);
    expect(shards.every((s) => s.loc.includes("/sitemaps/") && s.loc.endsWith(".xml"))).toBe(
      true,
    );

    const indexXml = buildSitemapIndexXml();
    expect(indexXml).toContain("<sitemapindex");
    expect(indexXml).toContain("/sitemaps/service-area-intent/");
    expect(indexXml).toContain("/sitemaps/invisible-grills-installation/");
  });

  it("returns shard urlsets with absolute urls", () => {
    const { entries } = getSitemapShardEntries("invisible-grills-installation", 1);
    expect(entries.length).toBeGreaterThan(0);
    expect(entries[0]?.url).toMatch(/^https?:\/\//);
    expect(entries.some((e) => e.url.includes("invisible-grills-installation-in-"))).toBe(true);
  });

  it("marks locality installation pages as indexable", () => {
    const page = resolveInvisibleGrillsInstallationCombo("gachibowli");
    expect(page).toBeTruthy();
    expect(
      isPageIndexable({
        ...page!,
        minimumRequiredWordCount: SEO_CONFIG.minimumWordCounts[page!.pageType] ?? 700,
      }),
    ).toBe(true);
  });

  it("includes materialized home and service-in-city urls", () => {
    const { entries } = getSitemapEntries({ group: "service-in-city", limit: 50 });
    expect(entries.some((e) => e.url.includes("invisible-grills-in-hyderabad"))).toBe(true);
  });

  it("reports high-intent intent coverage across shards", () => {
    const intentTotal = countSitemapEntries("service-area-intent");
    const shards = listSitemapShards().filter((s) => s.group === "service-area-intent");
    expect(intentTotal).toBeGreaterThan(1000);
    expect(shards.length).toBeGreaterThan(1);
  });
});

