/**
 * Master SEO audit — authoritative matrix vs sitemap vs indexability vs render mode.
 * Usage: npm run seo:audit
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import {
  getAllSitemapEntries,
  resetSitemapEntryCache,
} from "../src/lib/sitemap-urls.ts";
import {
  getSeoPageMatrix,
  countSeoPageMatrix,
  resetSeoPageMatrixCache,
  SEO_INTENTIONAL_NOINDEX_PATHS,
} from "../src/lib/seo/seo-page-matrix.ts";
import {
  countHyderabadSeoCoverage,
  getPrioritySeoPages,
} from "../src/lib/seo/priority-seo-pages.ts";
import { resolveSeoPage } from "../src/lib/seo/resolve-seo-page.ts";
import { getPageByPath } from "../src/lib/pages/registry.ts";
import { isSeoIndexablePage } from "../src/lib/seo/is-page-sitemap-indexable.ts";
import { generateCanonical } from "../src/lib/seo/generate-canonical.ts";
import { SITE_CONFIG } from "../src/config/site.ts";
import { createAllPageRecords } from "../src/lib/publishing/page-factory.ts";

resetSeoPageMatrixCache();
resetSitemapEntryCache();

const matrix = getSeoPageMatrix();
const matrixCounts = countSeoPageMatrix();
const sitemap = getAllSitemapEntries();
const sitemapPaths = new Set(sitemap.map((e) => new URL(e.url).pathname));
const matrixPaths = new Set(matrix.map((e) => e.path));
const priority = getPrioritySeoPages();
const priorityPaths = new Set(priority.map((p) => p.path));
const coverage = countHyderabadSeoCoverage();

const missingFromSitemap = matrix.filter((e) => !sitemapPaths.has(e.path));
const extraInSitemap = [...sitemapPaths].filter((p) => !matrixPaths.has(p));

type Row = {
  path: string;
  httpCapable: boolean;
  indexable: boolean | null;
  canonicalSelf: boolean | null;
  inSitemap: boolean;
  render: "static" | "isr" | "unknown";
  title?: string;
  h1?: string;
  issues: string[];
};

const samplePaths = [
  "/",
  "/services/invisible-grills/",
  "/locations/hyderabad/",
  "/invisible-grills-in-hyderabad/",
  "/invisible-grills-installation-in-gachibowli/",
  "/invisible-grills-installation-in-miyapur/", // ISR (not priority if miyapur is priority - actually miyapur IS priority)
  "/invisible-grills-installation-in-tolichowki/", // likely ISR
  "/solutions/child-balcony-safety/",
  "/property-types/apartments/invisible-grills/",
  "/locations/hyderabad/gachibowli/", // area hub — now indexable
  "/hyderabad/gachibowli/invisible-grills/", // service×area — now indexable
  "/thank-you/",
  "/privacy-policy/",
  "/this-page-should-404-xyz/",
];

// Prefer a known non-priority locality for ISR sample
const nonPriorityInstallation = matrix.find(
  (e) => e.kind === "installation-locality" && !priorityPaths.has(e.path),
);
if (nonPriorityInstallation) {
  samplePaths[6] = nonPriorityInstallation.path;
}

const rows: Row[] = [];

for (const path of samplePaths) {
  const issues: string[] = [];
  const isInvalidProbe = path.includes("should-404");
  const page = isInvalidProbe ? undefined : getPageByPath(path);
  const composite = path.match(/^\/([^/]+)\/$/)?.[1];
  const resolved = composite && !page ? resolveSeoPage(composite) : null;
  const record = page ?? resolved?.page;

  if (isInvalidProbe) {
    rows.push({
      path,
      httpCapable: false,
      indexable: false,
      canonicalSelf: null,
      inSitemap: false,
      render: "unknown",
      issues: ["expected 404"],
    });
    continue;
  }

  if (!record) {
    issues.push("missing page record");
    rows.push({
      path,
      httpCapable: false,
      indexable: null,
      canonicalSelf: null,
      inSitemap: sitemapPaths.has(path),
      render: "unknown",
      issues,
    });
    continue;
  }

  const indexable = isSeoIndexablePage(record) && record.allowIndexing;
  const expectedCanonical = generateCanonical(record.path);
  const canonicalSelf = record.canonicalUrl === expectedCanonical;
  if (!canonicalSelf) issues.push("canonical mismatch");
  if (indexable && !sitemapPaths.has(record.path)) issues.push("indexable but missing from sitemap");
  if (!indexable && sitemapPaths.has(record.path)) issues.push("noindex but present in sitemap");
  if (SEO_INTENTIONAL_NOINDEX_PATHS.has(record.path) && indexable) {
    issues.push("legal/utility page unexpectedly indexable");
  }

  rows.push({
    path: record.path,
    httpCapable: true,
    indexable,
    canonicalSelf,
    inSitemap: sitemapPaths.has(record.path),
    render: priorityPaths.has(record.path) || record.path === "/" ? "static" : "isr",
    title: record.title,
    h1: record.h1,
    issues,
  });
}

// Materialized duplicate title/desc scan (lightweight)
const materialized = createAllPageRecords().filter((p) => isSeoIndexablePage(p) && p.allowIndexing);
const titles = new Map<string, string[]>();
const descriptions = new Map<string, string[]>();
for (const page of materialized) {
  titles.set(page.title, [...(titles.get(page.title) ?? []), page.path]);
  descriptions.set(page.metaDescription, [
    ...(descriptions.get(page.metaDescription) ?? []),
    page.path,
  ]);
}
const duplicateTitles = [...titles.entries()].filter(([, paths]) => paths.length > 1).length;
const duplicateDescriptions = [...descriptions.entries()].filter(
  ([, paths]) => paths.length > 1,
).length;

const critical =
  missingFromSitemap.length +
  extraInSitemap.length +
  rows.filter((r) => r.issues.some((i) => i !== "expected 404")).length;

const report = {
  generatedAt: new Date().toISOString(),
  summary: {
    approvedIndexablePages: matrixCounts.totalIndexable,
    byKind: matrixCounts.byKind,
    sitemapUrls: sitemap.length,
    buildTimeCompositePages: priority.length,
    dynamicIsrInstallationPages: coverage.dynamicIsrInstallationPages,
    priorityLocalities: coverage.priorityLocalities,
    servedLocalities: coverage.servedLocalities,
    missingFromSitemap: missingFromSitemap.length,
    extraInSitemap: extraInSitemap.length,
    duplicateTitles,
    duplicateDescriptions,
    critical,
  },
  coverage,
  missingFromSitemap: missingFromSitemap.map((e) => e.path).slice(0, 50),
  extraInSitemap: extraInSitemap.slice(0, 50),
  sampleRows: rows,
  notes: [
    "generateStaticParams only controls build-time pre-render — never indexability.",
    "Area hubs and service×area pages are index,follow and included in the sitemap.",
    "Intent URLs (~74k) stay ISR-reachable but noindex until explicitly promoted into the matrix + sitemap.",
  ],
};

mkdirSync(join(process.cwd(), "reports"), { recursive: true });
writeFileSync(join(process.cwd(), "reports/seo-audit.json"), JSON.stringify(report, null, 2));

console.log("SEO audit summary");
console.log(JSON.stringify(report.summary, null, 2));
console.log(`Wrote reports/seo-audit.json`);

if (critical > 0) {
  console.error(`seo:audit failed with ${critical} critical issue(s)`);
  process.exit(1);
}

console.log("seo:audit passed");
