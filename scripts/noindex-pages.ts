import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import type { PageRecord } from "../src/types/page";

function parseArgs(argv: string[]): { qualityBelow?: number } {
  const result: { qualityBelow?: number } = {};
  for (const arg of argv) {
    if (arg.startsWith("--quality-below=")) {
      result.qualityBelow = Number(arg.slice("--quality-below=".length));
    }
  }
  return result;
}

const args = parseArgs(process.argv.slice(2));
const qualityBelow = args.qualityBelow ?? 80;
const registryPath = join(process.cwd(), "data/generated/pages.json");

if (!existsSync(registryPath)) {
  console.error("Run npm run pages:create first.");
  process.exit(1);
}

const registry = JSON.parse(readFileSync(registryPath, "utf8")) as { pages: PageRecord[] };
let changed = 0;

for (const page of registry.pages) {
  if (page.qualityScore < qualityBelow && page.publicationStatus === "published") {
    page.publicationStatus = "noindex";
    page.allowIndexing = false;
    changed += 1;
  }
}

writeFileSync(registryPath, JSON.stringify(registry, null, 2));
console.log(`Set noindex on ${changed} pages with qualityScore < ${qualityBelow}.`);
