import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { createAllPageRecords } from "../src/lib/publishing/page-factory";

function parseArgs(argv: string[]): { type?: string; limit?: number } {
  const result: { type?: string; limit?: number } = {};
  for (const arg of argv) {
    if (arg.startsWith("--type=")) result.type = arg.slice("--type=".length);
    if (arg.startsWith("--limit=")) result.limit = Number(arg.slice("--limit=".length));
  }
  return result;
}

const args = parseArgs(process.argv.slice(2));
const pages = createAllPageRecords(args);

mkdirSync(join(process.cwd(), "data/generated"), { recursive: true });
writeFileSync(
  join(process.cwd(), "data/generated/pages.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), count: pages.length, pages }, null, 2),
);

console.log(`Created ${pages.length} page records${args.type ? ` for type=${args.type}` : ""}.`);
console.log("Wrote data/generated/pages.json");
