import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { getAllPages } from "../src/lib/pages/registry";

const pages = getAllPages();
const invalid = pages.filter((page) => !page.hasValidSchema);

const report = {
  generatedAt: new Date().toISOString(),
  invalidCount: invalid.length,
  invalid: invalid.map((page) => page.path),
};

mkdirSync(join(process.cwd(), "reports"), { recursive: true });
writeFileSync(join(process.cwd(), "reports/schema-audit.json"), JSON.stringify(report, null, 2));
console.log(`Schema audit: invalid=${invalid.length}`);
