import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { getAllPages } from "../src/lib/pages/registry";

function similarity(a: string, b: string): number {
  const aWords = new Set(a.toLowerCase().split(/\s+/));
  const bWords = new Set(b.toLowerCase().split(/\s+/));
  const intersection = [...aWords].filter((word) => bWords.has(word)).length;
  const union = new Set([...aWords, ...bWords]).size;
  return union === 0 ? 0 : intersection / union;
}

const pages = getAllPages().filter((page) =>
  ["service-location", "service-area", "service"].includes(page.pageType),
);
const pairs: Array<{ a: string; b: string; score: number }> = [];

for (let i = 0; i < pages.length; i += 1) {
  for (let j = i + 1; j < Math.min(pages.length, i + 25); j += 1) {
    const score = similarity(pages[i]!.introduction, pages[j]!.introduction);
    if (score > 0.7) {
      pairs.push({ a: pages[i]!.path, b: pages[j]!.path, score: Number(score.toFixed(3)) });
    }
  }
}

const report = { generatedAt: new Date().toISOString(), pairCount: pairs.length, pairs };
mkdirSync(join(process.cwd(), "reports"), { recursive: true });
writeFileSync(join(process.cwd(), "reports/duplicate-content.json"), JSON.stringify(report, null, 2));
console.log(`Duplicate audit: ${pairs.length} high-similarity pairs`);
