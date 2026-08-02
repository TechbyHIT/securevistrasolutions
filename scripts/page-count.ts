import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import {
  countByStatus,
  countIndexablePages,
  getAllPages,
  getIndexablePages,
  getProgrammaticIndexablePages,
} from "../src/lib/pages/registry";
import { countProgrammaticIndexablePages } from "../src/lib/publishing/enumerate-programmatic-pages";
import { countSitemapEntries } from "../src/lib/sitemap/get-sitemap-entries";

const counts = countByStatus();
const pages = getAllPages();
const byType: Record<string, number> = {};

for (const page of pages) {
  byType[page.pageType] = (byType[page.pageType] ?? 0) + 1;
}

const programmatic = countProgrammaticIndexablePages();
const indexable = getIndexablePages();
const indexableTotal = countIndexablePages();
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
  programmaticIndexable: programmatic,
  indexableMaterialized: indexable.length,
  indexableTotal,
  sitemapTotal: countSitemapEntries(),
  sitemapByGroup: {
    "service-area-intent": countSitemapEntries("service-area-intent"),
    "service-area": countSitemapEntries("service-area"),
    area: countSitemapEntries("area"),
  },
  indexableByType,
  indexableSample: indexable.slice(0, 20).map((page) => page.path),
  programmaticSample: getProgrammaticIndexablePages()
    .slice(0, 10)
    .map((page) => page.path),
};

mkdirSync(join(process.cwd(), "reports"), { recursive: true });
writeFileSync(join(process.cwd(), "reports/page-count.json"), JSON.stringify(report, null, 2));

console.log(JSON.stringify(report.totals, null, 2));
console.log("byType:", byType);
console.log("programmaticIndexable:", programmatic);
console.log("indexableTotal:", indexableTotal);
console.log("sitemapTotal:", countSitemapEntries());
console.log("indexableByType:", indexableByType);
console.log("Wrote reports/page-count.json");
