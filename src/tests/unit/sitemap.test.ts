import { describe, expect, it, beforeEach } from "vitest";
import {
  getAllSitemapEntries,
  resetSitemapEntryCache,
  shardSitemapEntries,
  renderUrlsetXml,
  SITEMAP_SHARD_SIZE,
} from "@/lib/sitemap-urls";
import { SITE_CONFIG } from "@/config/site";
import { getAreaBySlug } from "@/data/initial-areas";
import { buildInvisibleGrillsLocalityContent } from "@/lib/content/build-invisible-grills-locality-content";
import { localitySeed } from "@/lib/content/build-unique-locality-copy";

describe("build-time sitemap (indexable-only)", () => {
  beforeEach(() => {
    resetSitemapEntryCache();
  });

  it("returns deduped absolute https entries with lastmod", () => {
    const entries = getAllSitemapEntries();
    expect(entries.length).toBeGreaterThan(50);
    expect(entries.length).toBeLessThan(5000);

    const urls = entries.map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);

    for (const entry of entries.slice(0, 50)) {
      expect(entry.url.startsWith(SITE_CONFIG.url)).toBe(true);
      expect(entry.lastModified).toBeInstanceOf(Date);
    }
  });

  it("includes installation localities and excludes noindex service-area / area hubs", () => {
    const urls = getAllSitemapEntries().map((e) => e.url);
    expect(urls.some((u) => u.includes("invisible-grills-installation-in-"))).toBe(true);
    expect(urls.some((u) => u.includes("invisible-grills-in-hyderabad"))).toBe(true);
    expect(urls.some((u) => /\/locations\/hyderabad\/[^/]+\/$/.test(u))).toBe(false);
    expect(urls.some((u) => /\/hyderabad\/[^/]+\/invisible-grills\/$/.test(u))).toBe(false);
    expect(urls.some((u) => u.includes("/thank-you"))).toBe(false);
  });

  it("shards under Google's 50k limit", () => {
    const shards = shardSitemapEntries(getAllSitemapEntries());
    for (const shard of shards) {
      expect(shard.length).toBeLessThanOrEqual(SITEMAP_SHARD_SIZE);
    }
  });

  it("renders urlset with loc + lastmod", () => {
    const xml = renderUrlsetXml(getAllSitemapEntries().slice(0, 3));
    expect(xml).toContain("<loc>");
    expect(xml).toContain("<lastmod>");
  });
});

describe("unique locality content", () => {
  it("builds different intros for different localities (not city-name-only swap)", () => {
    const a = getAreaBySlug("gachibowli");
    const b = getAreaBySlug("hastinapuram") ?? getAreaBySlug("kondapur");
    expect(a && b).toBeTruthy();
    const ca = buildInvisibleGrillsLocalityContent(a!);
    const cb = buildInvisibleGrillsLocalityContent(b!);

    expect(ca.introExtended.join(" ").split(/\s+/).length).toBeGreaterThanOrEqual(100);
    expect(cb.introExtended.join(" ").split(/\s+/).length).toBeGreaterThanOrEqual(100);
    expect(ca.title).not.toBe(cb.title);
    expect(ca.metaDescription).not.toBe(cb.metaDescription);
    expect(ca.faqs.length).toBeLessThanOrEqual(10);
    expect(ca.faqs[0]?.question).not.toBe(cb.faqs[0]?.question);

    const norm = (text: string, loc: string, city: string) =>
      text
        .toLowerCase()
        .replaceAll(loc.toLowerCase(), "{loc}")
        .replaceAll(city.toLowerCase(), "{city}");
    expect(norm(ca.intro, ca.locality, ca.city)).not.toBe(norm(cb.intro, cb.locality, cb.city));
  });

  it("uses deterministic seed per slug", () => {
    expect(localitySeed("gachibowli")).toBe(localitySeed("gachibowli"));
    expect(localitySeed("gachibowli")).not.toBe(localitySeed("madhapur"));
  });
});
