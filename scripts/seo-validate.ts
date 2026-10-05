/**
 * SEO validation gate — sitemap, indexability alignment, locality uniqueness sample.
 * Usage: npm run seo:validate
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import {
  getAllSitemapEntries,
  resetSitemapEntryCache,
} from "../src/lib/sitemap-urls.ts";
import { getPublishedLocations } from "../src/data/initial-locations.ts";
import { getServedAreas } from "../src/data/initial-areas.ts";
import { buildInvisibleGrillsLocalityContent } from "../src/lib/content/build-invisible-grills-locality-content.ts";
import { resolveInvisibleGrillsInstallationCombo } from "../src/lib/publishing/page-factory.ts";
import { isSitemapIndexablePage } from "../src/lib/seo/is-page-sitemap-indexable.ts";
import { SITE_CONFIG } from "../src/config/site.ts";
import { SEO_CONFIG } from "../src/config/seo.ts";
import { buildInvisibleGrillsInstallationPath } from "../src/lib/utils/installation-in-locality-slug.ts";
import {
  countHyderabadSeoCoverage,
  getPrioritySeoPages,
} from "../src/lib/seo/priority-seo-pages.ts";
import { resolveSeoPage } from "../src/lib/seo/resolve-seo-page.ts";

resetSitemapEntryCache();
const entries = getAllSitemapEntries();
const urls = entries.map((e) => e.url);

const locations = getPublishedLocations();
const areas = locations.flatMap((loc) => getServedAreas(loc.id));

const installationPaths = areas.map((a) =>
  `${SITE_CONFIG.url}${buildInvisibleGrillsInstallationPath(a.slug)}`,
);

const missingFromSitemap = installationPaths.filter((u) => !urls.includes(u));
const unexpectedNoindexGroups: string[] = [];

// Sample uniqueness across locality pages
const sampleSlugs = [
  "hastinapuram",
  "gachibowli",
  "kukatpally",
  "madhapur",
  "secunderabad",
  "kondapur",
  "lbnagar",
  "dilsukhnagar",
].filter((slug) => areas.some((a) => a.slug === slug));

type SampleRow = {
  url: string;
  indexable: boolean;
  inSitemap: boolean;
  title: string;
  introWords: number;
  localWords: number;
  faqCount: number;
  titleLen: number;
  descLen: number;
  uniqueVsPeer: string;
};

function normalize(text: string, locality: string, city: string): string {
  return text
    .toLowerCase()
    .replaceAll(locality.toLowerCase(), "{loc}")
    .replaceAll(city.toLowerCase(), "{city}")
    .replace(/\s+/g, " ")
    .trim();
}

function jaccard(a: string, b: string): number {
  const A = new Set(a.split(" ").filter(Boolean));
  const B = new Set(b.split(" ").filter(Boolean));
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter += 1;
  return inter / (A.size + B.size - inter);
}

const samples: SampleRow[] = [];
const intros: { slug: string; text: string; locality: string; city: string }[] = [];

for (const slug of sampleSlugs) {
  const area = areas.find((a) => a.slug === slug)!;
  const page = resolveInvisibleGrillsInstallationCombo(slug);
  const content = buildInvisibleGrillsLocalityContent(area);
  const url = `${SITE_CONFIG.url}${buildInvisibleGrillsInstallationPath(slug)}`;
  const indexable = page ? isSitemapIndexablePage(page) : false;
  samples.push({
    url,
    indexable,
    inSitemap: urls.includes(url),
    title: content.title,
    introWords: content.introExtended.join(" ").split(/\s+/).filter(Boolean).length,
    localWords: content.whyLocalityExtended.join(" ").split(/\s+/).filter(Boolean).length,
    faqCount: content.faqs.length,
    titleLen: content.title.length,
    descLen: content.metaDescription.length,
    uniqueVsPeer: "pending",
  });
  intros.push({
    slug,
    text: content.introExtended.join(" "),
    locality: content.locality,
    city: content.city,
  });
}

for (let i = 0; i < samples.length; i++) {
  let worst = 0;
  for (let j = 0; j < samples.length; j++) {
    if (i === j) continue;
    const a = normalize(intros[i]!.text, intros[i]!.locality, intros[i]!.city);
    const b = normalize(intros[j]!.text, intros[j]!.locality, intros[j]!.city);
    worst = Math.max(worst, jaccard(a, b));
  }
  samples[i]!.uniqueVsPeer = worst >= 0.85 ? `FAIL jaccard=${worst.toFixed(2)}` : `OK max=${worst.toFixed(2)}`;
}

const thinIntros = samples.filter((s) => s.introWords < 100);
const metaErrors = samples.filter(
  (s) =>
    s.titleLen > SEO_CONFIG.titleMaxLength + 5 ||
    s.descLen > SEO_CONFIG.descriptionMaxLength + 5 ||
    s.descLen < SEO_CONFIG.descriptionMinLength - 20,
);
const uniquenessFails = samples.filter((s) => s.uniqueVsPeer.startsWith("FAIL"));
const notInSitemap = samples.filter((s) => !s.inSitemap);
const notIndexable = samples.filter((s) => !s.indexable);

const coverage = countHyderabadSeoCoverage();
const priorityPages = getPrioritySeoPages();

// Resolve checks: priority (static) + a non-priority ISR candidate
const resolveChecks = [
  resolveSeoPage("invisible-grills-installation-in-gachibowli"),
  resolveSeoPage("invisible-grills-in-hyderabad"),
  resolveSeoPage("invisible-grills-installation-in-miyapur"),
].map((resolved) =>
  resolved
    ? {
        path: resolved.path,
        kind: resolved.kind,
        indexable: resolved.indexable,
        ok: true,
      }
    : { path: null, kind: null, indexable: false, ok: false },
);

const report = {
  generatedAt: new Date().toISOString(),
  site: SITE_CONFIG.url,
  coverage,
  buildTimePriority: {
    count: priorityPages.length,
    sample: priorityPages.slice(0, 15).map((p) => ({
      path: p.path,
      kind: p.kind,
      priority: p.priority,
    })),
  },
  resolveChecks,
  totals: {
    sitemapUrls: entries.length,
    installationLocalities: areas.length,
    installationMissingFromSitemap: missingFromSitemap.length,
    buildTimeCompositePages: coverage.buildTimeCompositePages,
    dynamicIsrInstallationPages: coverage.dynamicIsrInstallationPages,
    sampleSize: samples.length,
    thinIntros: thinIntros.length,
    metaErrors: metaErrors.length,
    uniquenessFails: uniquenessFails.length,
    sampleNotInSitemap: notInSitemap.length,
    sampleNotIndexable: notIndexable.length,
  },
  notes: [
    "generateStaticParams() pre-renders Hyderabad priority pages only.",
    "Sitemap lists ALL approved indexable URLs (independent of static params).",
    "dynamicParams=true + revalidate=86400 keeps remaining valid pages on ISR.",
    "Sitemap must only list URLs that pass isSitemapIndexablePage.",
  ],
  unexpectedNoindexGroups,
  missingFromSitemap: missingFromSitemap.slice(0, 20),
  samples,
};

mkdirSync(join(process.cwd(), "reports"), { recursive: true });
writeFileSync(
  join(process.cwd(), "reports/seo-validate.json"),
  JSON.stringify(report, null, 2),
);

console.log(JSON.stringify({ coverage, totals: report.totals }, null, 2));
console.log(`Wrote reports/seo-validate.json (${samples.length} locality samples)`);

const failed =
  missingFromSitemap.length > 0 ||
  thinIntros.length > 0 ||
  uniquenessFails.length > 0 ||
  notInSitemap.length > 0 ||
  notIndexable.length > 0 ||
  resolveChecks.some((c) => !c.ok || !c.indexable);

if (failed) {
  console.error("seo:validate FAILED — see reports/seo-validate.json");
  process.exit(1);
}

console.log("seo:validate PASSED");
