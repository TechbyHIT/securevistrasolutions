/**
 * SEO content audit — technical uniqueness, location dominance, claims, indexability.
 * Usage: npm run seo:content-audit
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { getSeoPageMatrix, resetSeoPageMatrixCache } from "../src/lib/seo/seo-page-matrix.ts";
import {
  getAllSitemapEntries,
  resetSitemapEntryCache,
} from "../src/lib/sitemap-urls.ts";
import { getPrioritySeoPages } from "../src/lib/seo/priority-seo-pages.ts";
import { getServiceKnowledgeBase } from "../src/data/service-knowledge-base.ts";
import { buildUltraLongformSeo } from "../src/lib/content/build-ultra-longform-seo.ts";
import { buildInvisibleGrillsLocalityContent } from "../src/lib/content/build-invisible-grills-locality-content.ts";
import { assignContentAngle } from "../src/lib/content/content-matrix.ts";
import {
  contentFingerprint,
  locationTokenRatio,
  similarityScore,
} from "../src/lib/content/content-fingerprint.ts";
import { getPublishedLocations } from "../src/data/initial-locations.ts";
import { getServedAreas } from "../src/data/initial-areas.ts";
import { getPublishedServices } from "../src/data/initial-services.ts";
import { isSeoIndexablePage } from "../src/lib/seo/is-page-sitemap-indexable.ts";
import { resolveInvisibleGrillsInstallationCombo } from "../src/lib/publishing/page-factory.ts";

resetSeoPageMatrixCache();
resetSitemapEntryCache();

const FORBIDDEN = [
  /in today's world/i,
  /look no further/i,
  /best-in-class/i,
  /cutting-edge/i,
  /100%\s*safe/i,
  /completely childproof/i,
  /10\+\s*years/i,
  /5000\+/i,
  /areas we serve/i,
  /nearby areas we serve/i,
  /surrounding areas/i,
];

const matrix = getSeoPageMatrix();
const sitemap = new Set(getAllSitemapEntries().map((e) => new URL(e.url).pathname));
const priority = new Set(getPrioritySeoPages().map((p) => p.path));
const kb = getServiceKnowledgeBase();
const city = getPublishedLocations()[0]!;
const areas = getServedAreas(city.id);
const services = getPublishedServices();

type Row = {
  url: string;
  service: string;
  location: string;
  pageType: string;
  wordCount: number;
  contentAngle: string;
  fingerprint: string;
  similarityMax: number;
  locationRatio: number;
  qualityScore: number;
  faqCount: number;
  forbiddenHits: number;
  indexable: boolean;
  sitemap: boolean;
  render: "static" | "isr";
  pass: boolean;
  issues: string[];
};

const sampleAreas = areas.filter((a) =>
  ["gachibowli", "hastinapuram", "miyapur", "kondapur", "tolichowki", "lbnagar"].includes(a.slug),
);
const rows: Row[] = [];
const localityBodies: { slug: string; text: string }[] = [];

for (const area of sampleAreas) {
  const content = buildInvisibleGrillsLocalityContent(area);
  const longform = buildUltraLongformSeo({
    topic: "Invisible Grills",
    placeName: area.name,
    cityName: city.name,
    serviceSlug: "invisible-grills",
    areaSlug: area.slug,
    pageType: "invisible-grills-installation-in-locality",
  });
  const text = [
    content.intro,
    ...content.introExtended,
    ...content.whyLocalityExtended,
    ...longform.blocks.flatMap((b) => b.paragraphs),
    ...longform.faqs.map((f) => `${f.question} ${f.answer}`),
  ].join(" ");
  localityBodies.push({ slug: area.slug, text });

  const angle = assignContentAngle({
    serviceSlug: "invisible-grills",
    areaSlug: area.slug,
    pageType: "invisible-grills-installation-in-locality",
  });
  const path = `/invisible-grills-installation-in-${area.slug}/`;
  const page = resolveInvisibleGrillsInstallationCombo(area.slug);
  const fp = contentFingerprint(text, [area.name, city.name, "hyderabad"]);
  const locRatio = locationTokenRatio(text, [area.name, city.name, "Hyderabad"]);
  const forbiddenHits = FORBIDDEN.reduce((n, re) => n + (re.test(text) ? 1 : 0), 0);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const issues: string[] = [];
  if (wordCount < 1500) issues.push("thin-content");
  if (locRatio > 0.22) issues.push("location-dominant");
  if (forbiddenHits > 0) issues.push("forbidden-phrases");
  if (page && !isSeoIndexablePage(page)) issues.push("not-indexable");
  if (!sitemap.has(path)) issues.push("missing-sitemap");

  let quality = 92;
  quality -= issues.length * 8;
  quality -= Math.max(0, Math.round((locRatio - 0.15) * 100));
  quality = Math.max(40, Math.min(100, quality));

  rows.push({
    url: path,
    service: "invisible-grills",
    location: area.name,
    pageType: "invisible-grills-installation-in-locality",
    wordCount,
    contentAngle: angle.id,
    fingerprint: fp.hash,
    similarityMax: 0,
    locationRatio: Number(locRatio.toFixed(3)),
    qualityScore: quality,
    faqCount: longform.faqs.length + content.faqs.length,
    forbiddenHits,
    indexable: page ? isSeoIndexablePage(page) : false,
    sitemap: sitemap.has(path),
    render: priority.has(path) ? "static" : "isr",
    pass: issues.length === 0 && quality >= 80,
    issues,
  });
}

for (let i = 0; i < rows.length; i++) {
  let worst = 0;
  for (let j = 0; j < localityBodies.length; j++) {
    if (i === j) continue;
    const tokens = [rows[i]!.location, rows[j]!.location, city.name, "Hyderabad"];
    worst = Math.max(
      worst,
      similarityScore(localityBodies[i]!.text, localityBodies[j]!.text, tokens),
    );
  }
  rows[i]!.similarityMax = Number(worst.toFixed(3));
  if (worst >= 0.85) {
    rows[i]!.issues.push("high-similarity");
    rows[i]!.pass = false;
    rows[i]!.qualityScore = Math.min(rows[i]!.qualityScore, 75);
  }
}

// Service-in-city sample
for (const service of services.slice(0, 3)) {
  const longform = buildUltraLongformSeo({
    topic: service.name,
    placeName: city.name,
    cityName: city.name,
    serviceSlug: service.slug,
    pageType: "service-in-city",
  });
  const text = [
    ...longform.blocks.flatMap((b) => [
      b.heading,
      ...b.paragraphs,
      ...(b.listItems ?? []),
      ...(b.subSections ?? []).map((s) => `${s.title} ${s.description}`),
    ]),
    ...longform.faqs.map((f) => `${f.question} ${f.answer}`),
  ].join(" ");
  const path = `/${service.slug}-in-${city.slug}/`;
  const angle = assignContentAngle({
    serviceSlug: service.slug,
    pageType: "service-in-city",
  });
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const locRatio = locationTokenRatio(text, [city.name, "Hyderabad"]);
  const forbiddenHits = FORBIDDEN.reduce((n, re) => n + (re.test(text) ? 1 : 0), 0);
  const issues: string[] = [];
  if (wordCount < 1500) issues.push("thin-content");
  if (locRatio > 0.25) issues.push("location-dominant");
  if (forbiddenHits > 0) issues.push("forbidden-phrases");
  if (!sitemap.has(path)) issues.push("missing-sitemap");
  rows.push({
    url: path,
    service: service.slug,
    location: city.name,
    pageType: "service-in-city",
    wordCount,
    contentAngle: angle.id,
    fingerprint: contentFingerprint(text, [city.name]).hash,
    similarityMax: 0,
    locationRatio: Number(locRatio.toFixed(3)),
    qualityScore: Math.max(50, 94 - issues.length * 10),
    faqCount: longform.faqs.length,
    forbiddenHits,
    indexable: true,
    sitemap: sitemap.has(path),
    render: priority.has(path) ? "static" : "isr",
    pass: issues.length === 0,
    issues,
  });
}

const passed = rows.filter((r) => r.pass).length;
const failed = rows.filter((r) => !r.pass).length;
const avgWords = Math.round(rows.reduce((s, r) => s + r.wordCount, 0) / Math.max(1, rows.length));
const avgQuality = Math.round(
  rows.reduce((s, r) => s + r.qualityScore, 0) / Math.max(1, rows.length),
);
const above5k = rows.filter((r) => r.wordCount >= 5000).length;

const report = {
  generatedAt: new Date().toISOString(),
  philosophy:
    "Technical service knowledge first; location secondary; no nearby-area filler; no invented specs.",
  knowledgeBaseServices: kb.length,
  totals: {
    approvedIndexableUrls: matrix.length,
    sitemapUrls: sitemap.size,
    preRenderedComposite: priority.size,
    sampleAudited: rows.length,
    samplePassed: passed,
    sampleFailed: failed,
    averageWordCount: avgWords,
    pagesAbove5000Words: above5k,
    averageQualityScore: avgQuality,
  },
  hardFails: rows.filter((r) => !r.pass).map((r) => ({
    url: r.url,
    issues: r.issues,
    similarityMax: r.similarityMax,
    locationRatio: r.locationRatio,
  })),
  samples: rows,
};

mkdirSync(join(process.cwd(), "reports"), { recursive: true });
writeFileSync(join(process.cwd(), "reports/seo-content-audit.json"), JSON.stringify(report, null, 2));

console.log(JSON.stringify(report.totals, null, 2));
console.log(`Wrote reports/seo-content-audit.json`);

if (failed > 0) {
  console.error(`seo:content-audit FAILED — ${failed} sample(s)`);
  process.exit(1);
}
console.log("seo:content-audit PASSED");
