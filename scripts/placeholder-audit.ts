import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { getAllPages } from "../src/lib/pages/registry";

const pages = getAllPages().filter((page) => page.placeholders.length > 0);
const report = {
  generatedAt: new Date().toISOString(),
  count: pages.length,
  pages: pages.map((page) => ({ path: page.path, placeholders: page.placeholders })),
  note: "Business config placeholders such as [BUSINESS_NAME] intentionally block public indexation until replaced.",
};

mkdirSync(join(process.cwd(), "reports"), { recursive: true });
writeFileSync(join(process.cwd(), "reports/placeholders.json"), JSON.stringify(report, null, 2));
console.log(`Placeholder audit: ${pages.length} pages contain placeholders`);
