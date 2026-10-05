import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import {
  countByStatus,
  getAllPages,
  getIndexablePages,
  getProgrammaticIndexablePages,
} from "../src/lib/pages/registry";
import { getAllSitemapEntries, resetSitemapEntryCache } from "../src/lib/sitemap-urls";
import {
  countSeoPageMatrix,
  getSeoPageMatrix,
  resetSeoPageMatrixCache,
} from "../src/lib/seo/seo-page-matrix";
import {
  countHyderabadSeoCoverage,
  getPrioritySeoPages,
} from "../src/lib/seo/priority-seo-pages";

resetSeoPageMatrixCache();
resetSitemapEntryCache();

const counts = countByStatus();
const pages = getAllPages();
const byType: Record<string, number> = {};

for (const page of pages) {
  byType[page.pageType] = (byType[page.pageType] ?? 0) + 1;
}

const matrix = countSeoPageMatrix();
const sitemap = getAllSitemapEntries();
const priority = getPrioritySeoPages();
const coverage = countHyderabadSeoCoverage();
const indexable = getIndexablePages().filter((page) =>
  getSeoPageMatrix().some((entry) => entry.path === page.path),
);
const indexableByType: Record<string, number> = {};
for (const page of indexable) {
  indexableByType[page.pageType] = (indexableByType[page.pageType] ?? 0) + 1;
}

const report = {
  generatedAt: new Date().toISOString(),
  locationScope: "Hyderabad only",
  database: "none — TypeScript data registry",
  totals: counts,
  byType,
  authoritativeMatrix: matrix,
  sitemapUrls: sitemap.length,
  buildTimeCompositePages: priority.length,
  coverage,
  indexableMaterializedAligned: indexable.length,
  indexableByType,
  indexableSample: indexable.slice(0, 20).map((page) => page.path),
  programmaticSample: getProgrammaticIndexablePages()
    .slice(0, 10)
    .map((page) => page.path),
  notes: [
    "Authoritative sitemap = getSeoPageMatrix() / getAllSitemapEntries().",
    "Legacy get-sitemap-entries (~74k) is NOT used for production sitemap.",
    "generateStaticParams does not limit indexability.",
  ],
};

mkdirSync(join(process.cwd(), "reports"), { recursive: true });
writeFileSync(join(process.cwd(), "reports/page-count.json"), JSON.stringify(report, null, 2));

console.log(JSON.stringify(report.totals, null, 2));
console.log("authoritativeMatrix:", matrix);
console.log("sitemapUrls:", sitemap.length);
console.log("buildTimeCompositePages:", priority.length);
console.log("coverage:", coverage);
console.log("Wrote reports/page-count.json");
