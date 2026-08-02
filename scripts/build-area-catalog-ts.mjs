import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const data = JSON.parse(
  fs.readFileSync(path.join(root, "scripts/generated-area-catalog.json"), "utf8"),
);

function titleCase(s) {
  return s
    .replace(/\b([a-z])/g, (m) => m.toUpperCase())
    .replace(/\b(And|In|The|Of)\b/g, (m) => m.toLowerCase());
}

const aliases = {
  jambagh: "jam-bagh",
  santoshnagar: "santosh-nagar",
};

const entries = data.canonical.map((e) => ({
  slug: e.slug,
  name: titleCase(e.name),
}));

const out = `import type { AreaCatalogEntry } from "./area-catalog-types";

export const HYDERABAD_AREA_CATALOG: AreaCatalogEntry[] = ${JSON.stringify(entries, null, 2)};

export const AREA_SLUG_ALIASES: Record<string, string> = ${JSON.stringify(aliases, null, 2)};
`;

fs.writeFileSync(path.join(root, "src/data/hyderabad-area-catalog.ts"), out);
console.log("wrote", entries.length, "areas");
