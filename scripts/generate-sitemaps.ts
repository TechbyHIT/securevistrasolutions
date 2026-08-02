import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { getSitemapEntries, getSitemapGroups } from "../src/lib/sitemap/get-sitemap-entries";
import { SITE_CONFIG } from "../src/config/site";
import { getIndexablePages } from "../src/lib/pages/registry";

const groups = getSitemapGroups();
const summary = groups.map((group) => {
  const { entries } = getSitemapEntries({
    group,
    limit: SITE_CONFIG.maxSitemapUrlsPerFile,
  });
  const total = getIndexablePages().filter((page) => page.sitemapGroup === group).length;
  return { group, total, included: entries.length };
});

mkdirSync(join(process.cwd(), "reports"), { recursive: true });
writeFileSync(
  join(process.cwd(), "reports/sitemap-summary.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), groups: summary }, null, 2),
);
console.log(JSON.stringify(summary, null, 2));
