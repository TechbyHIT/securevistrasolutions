import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { getAllPages, getIndexablePages } from "../src/lib/pages/registry";
import { generateInternalLinks } from "../src/lib/internal-links/generate-internal-links";

const pages = getAllPages();
const indexablePaths = new Set(getIndexablePages().map((page) => page.path));
const linkedTo = new Set<string>();
const orphans: string[] = [];
const missingParents: string[] = [];

for (const page of pages) {
  const links = generateInternalLinks(page);
  for (const link of links) {
    linkedTo.add(link.href);
  }
  if (page.pageType === "service-location" || page.pageType === "service-area") {
    const hasServiceParent = links.some((link) => link.href.startsWith("/services/"));
    const hasLocationParent = links.some((link) => link.href.startsWith("/locations/"));
    if (!hasServiceParent || !hasLocationParent) missingParents.push(page.path);
  }
}

for (const page of getIndexablePages()) {
  if (page.path === "/") continue;
  if (!linkedTo.has(page.path)) orphans.push(page.path);
}

const report = {
  generatedAt: new Date().toISOString(),
  orphanCount: orphans.length,
  missingParentCount: missingParents.length,
  orphans: orphans.slice(0, 100),
  missingParents: missingParents.slice(0, 100),
  indexableCount: indexablePaths.size,
};

mkdirSync(join(process.cwd(), "reports"), { recursive: true });
writeFileSync(join(process.cwd(), "reports/internal-links.json"), JSON.stringify(report, null, 2));
console.log(`Internal link audit: orphans=${report.orphanCount}`);
