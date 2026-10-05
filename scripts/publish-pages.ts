import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { PUBLISHING_CONFIG } from "../src/config/publishing";
import { isPageIndexable } from "../src/lib/seo/is-page-indexable";
import { SEO_CONFIG } from "../src/config/seo";
import type { PageRecord } from "../src/types/page";

function parseArgs(argv: string[]): { batchSize?: number } {
  const result: { batchSize?: number } = {};
  for (const arg of argv) {
    if (arg.startsWith("--batch-size=")) {
      result.batchSize = Number(arg.slice("--batch-size=".length));
    }
  }
  return result;
}

const args = parseArgs(process.argv.slice(2));
const batchSize = args.batchSize ?? PUBLISHING_CONFIG.defaultBatchSize;

if (!args.batchSize) {
  console.error("Explicit --batch-size is required. Example: npm run pages:publish -- --batch-size=500");
  process.exit(1);
}

if (batchSize > PUBLISHING_CONFIG.maxBatchSize) {
  console.error(`batch-size cannot exceed ${PUBLISHING_CONFIG.maxBatchSize}`);
  process.exit(1);
}

const registryPath = join(process.cwd(), "data/generated/pages.json");
if (!existsSync(registryPath)) {
  console.error("Run npm run pages:create first.");
  process.exit(1);
}

const registry = JSON.parse(readFileSync(registryPath, "utf8")) as {
  pages: PageRecord[];
};

let published = 0;
const log: Array<{ path: string; action: string }> = [];

for (const page of registry.pages) {
  if (published >= batchSize) break;
  if (page.publicationStatus !== "review" && page.publicationStatus !== "approved") continue;

  const eligible = isPageIndexable({
    ...page,
    publicationStatus: "published",
    minimumRequiredWordCount: SEO_CONFIG.minimumWordCounts[page.pageType] ?? 1500,
  });

  if (!eligible) {
    page.publicationStatus = "review";
    log.push({ path: page.path, action: "blocked-not-eligible" });
    continue;
  }

  page.publicationStatus = "published";
  page.allowIndexing = true;
  page.publishedAt = new Date().toISOString();
  published += 1;
  log.push({ path: page.path, action: "published" });
}

writeFileSync(registryPath, JSON.stringify({ ...registry, pages: registry.pages }, null, 2));
mkdirSync(join(process.cwd(), "reports"), { recursive: true });
writeFileSync(
  join(process.cwd(), "reports/publishing-summary.json"),
  JSON.stringify({ batchSize, published, log }, null, 2),
);

console.log(`Published ${published} pages (batch-size=${batchSize}).`);
