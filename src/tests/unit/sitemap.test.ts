import { describe, expect, it, beforeEach } from "vitest";
import {
  getAllSitemapEntries,
  resetSitemapEntryCache,
  shardSitemapEntries,
  renderUrlsetXml,
  renderSitemapIndexXml,
  SITEMAP_SHARD_SIZE,
} from "@/lib/sitemap-urls";
import { SITE_CONFIG } from "@/config/site";

describe("build-time sitemap (Deva pattern)", () => {
  beforeEach(() => {
    resetSitemapEntryCache();
  });

  it("returns deduped absolute https entries with lastmod", () => {
    const entries = getAllSitemapEntries();
    expect(entries.length).toBeGreaterThan(50);

    const urls = entries.map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);

    for (const entry of entries.slice(0, 100)) {
      expect(entry.url.startsWith("https://")).toBe(true);
      expect(entry.url.startsWith(SITE_CONFIG.url)).toBe(true);
      expect(entry.lastModified).toBeInstanceOf(Date);
      expect(entry.changeFrequency).toBeTruthy();
      expect(entry.priority).toBeGreaterThan(0);
    }
  });

  it("includes core hubs and excludes thank-you", () => {
    const urls = getAllSitemapEntries().map((e) => e.url);
    expect(urls.some((u) => u === `${SITE_CONFIG.url}/` || u === `${SITE_CONFIG.url}`)).toBe(true);
    expect(urls.some((u) => u.includes("/services/"))).toBe(true);
    expect(urls.some((u) => u.includes("/locations/hyderabad"))).toBe(true);
    expect(urls.some((u) => u.includes("/thank-you"))).toBe(false);
    expect(urls.some((u) => u.includes("/admin"))).toBe(false);
  });

  it("includes service-in-city and capped area service pages at default phase", () => {
    const urls = getAllSitemapEntries().map((e) => e.url);
    expect(urls.some((u) => u.includes("invisible-grills-in-hyderabad"))).toBe(true);
    expect(urls.some((u) => u.includes("invisible-grills-installation-in-"))).toBe(true);
    expect(urls.some((u) => /\/hyderabad\/[^/]+\/invisible-grills\//.test(u))).toBe(true);
  });

  it("does not include intent keyword × area explosion paths", () => {
    const urls = getAllSitemapEntries().map((e) => e.url);
    // Intent URLs look like /hyderabad/{area}/{service}/{intent}/
    const intentLike = urls.filter((u) => {
      const path = u.replace(SITE_CONFIG.url, "");
      const parts = path.split("/").filter(Boolean);
      return parts.length >= 4 && parts[0] === "hyderabad";
    });
    expect(intentLike.length).toBe(0);
  });

  it("shards under Google's 50k limit", () => {
    const entries = getAllSitemapEntries();
    const shards = shardSitemapEntries(entries);
    expect(shards.length).toBeGreaterThanOrEqual(1);
    for (const shard of shards) {
      expect(shard.length).toBeLessThanOrEqual(SITEMAP_SHARD_SIZE);
    }
  });

  it("renders valid urlset and index XML", () => {
    const entries = getAllSitemapEntries().slice(0, 5);
    const xml = renderUrlsetXml(entries);
    expect(xml).toContain("<urlset");
    expect(xml).toContain("<loc>");
    expect(xml).toContain("<lastmod>");
    expect(xml).toContain("<changefreq>");
    expect(xml).toContain("<priority>");

    const index = renderSitemapIndexXml([`${SITE_CONFIG.url}/sitemaps/sitemap-1.xml`]);
    expect(index).toContain("<sitemapindex");
    expect(index).toContain("/sitemaps/sitemap-1.xml");
  });
});
