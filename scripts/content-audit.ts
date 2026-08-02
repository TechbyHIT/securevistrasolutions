import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { getAllPages } from "../src/lib/pages/registry";
import { SEO_CONFIG } from "../src/config/seo";

const pages = getAllPages();
const thin = pages.filter(
  (page) => page.wordCount < (SEO_CONFIG.minimumWordCounts[page.pageType] ?? 700),
);
const lowQuality = pages.filter((page) => page.qualityScore < SEO_CONFIG.minimumQualityScore);
const unverified = pages.filter(
  (page) =>
    (page.pageType === "location" ||
      page.pageType === "area" ||
      page.pageType === "service-location" ||
      page.pageType === "service-area") &&
    !page.localDataVerified,
);

const report = {
  generatedAt: new Date().toISOString(),
  thinCount: thin.length,
  lowQualityCount: lowQuality.length,
  unverifiedLocalCount: unverified.length,
  thin: thin.map((page) => ({ path: page.path, wordCount: page.wordCount })),
  lowQuality: lowQuality.map((page) => ({ path: page.path, qualityScore: page.qualityScore })),
};

mkdirSync(join(process.cwd(), "reports"), { recursive: true });
writeFileSync(join(process.cwd(), "reports/content-quality.json"), JSON.stringify(report, null, 2));
console.log(
  `Content audit: thin=${report.thinCount}, lowQuality=${report.lowQualityCount}, unverifiedLocal=${report.unverifiedLocalCount}`,
);
