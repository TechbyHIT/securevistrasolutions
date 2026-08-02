/**
 * Generates src/data/keyword-intents-data.ts from product bases + modifier patterns.
 * Run: node scripts/build-keyword-intents.mjs
 */
import { writeFileSync } from "fs";
import { join } from "path";

const MODIFIERS = [
  "price",
  "cost",
  "rate",
  "charges",
  "price list",
  "cost per square feet",
  "per sq ft price",
  "installation cost",
  "installation",
  "installers",
  "installer",
  "service",
  "services",
  "company",
  "companies",
  "contractor",
  "contractors",
  "dealer",
  "dealers",
  "supplier",
  "suppliers",
  "manufacturer",
  "manufacturers",
  "shop",
  "store",
  "online",
  "best",
  "top",
  "premium",
  "affordable",
  "low cost",
  "cheap",
  "high quality",
  "durable",
  "strong",
  "safe",
  "custom",
  "customized",
  "repair",
  "maintenance",
  "replacement",
  "fitting",
  "fixing",
  "setup",
  "material",
  "accessories",
  "design",
  "designs",
  "ideas",
  "solution",
  "solutions",
  "booking",
  "quote",
  "estimate",
  "for home",
  "for house",
  "for apartment",
  "for apartments",
  "for flats",
  "for balcony",
  "for balconies",
  "for window",
  "for windows",
  "for terrace",
  "for building",
  "for villa",
  "for high rise",
  "for high rise building",
  "for kids safety",
  "for child safety",
  "for baby safety",
  "for pets",
  "for cats",
  "for dogs",
  "for pigeon protection",
  "for bird protection",
  "for fall protection",
  "without drilling",
  "anti rust",
  "stainless steel",
  "nylon",
  "hdpe",
  "with installation",
  "professional installation",
  "commercial",
  "residential",
  "home installation",
  "apartment installation",
];

const PRODUCT_GROUPS = [
  {
    category: "invisible-grill",
    defaultService: "invisible-grills",
    bases: [
      "invisible grills",
      "invisible grill",
      "invisible grill for balcony",
      "balcony invisible grill",
      "invisible balcony grill",
      "invisible grill for window",
      "window invisible grill",
      "invisible window grill",
      "transparent grill",
      "transparent balcony grill",
      "transparent window grill",
      "balcony safety grill",
      "window safety grill",
      "modern balcony grill",
      "modern window grill",
      "balcony grill design",
      "window grill design",
      "invisible grill design",
      "invisible grill designs",
      "stainless steel invisible grill",
      "ss invisible grill",
      "316 stainless steel invisible grill",
      "316 ss invisible grill",
      "invisible grill wire",
      "invisible grill cable",
    ],
  },
  {
    category: "safety-net",
    defaultService: "balcony-safety-nets",
    bases: [
      "safety nets",
      "safety net",
      "balcony safety net",
      "safety net for balcony",
      "window safety net",
      "terrace safety net",
      "duct area safety net",
      "staircase safety net",
      "kids safety net",
      "child safety net",
      "children safety net",
      "baby safety net",
      "pet safety net",
      "balcony nets",
      "balcony net",
      "balcony safety nets",
      "balcony net for child safety",
      "balcony net for kids safety",
      "balcony net for pets",
      "balcony net for cats",
      "balcony net for dogs",
      "balcony net for pigeons",
      "balcony bird net",
    ],
  },
  {
    category: "cloth-hanger",
    defaultService: "cloth-hangers",
    bases: [
      "cloth hanger",
      "cloth hangers",
      "clothes hanger",
      "clothes hangers",
      "cloth drying hanger",
      "clothes drying hanger",
      "ceiling cloth hanger",
      "ceiling cloth hangers",
      "balcony cloth hanger",
    ],
  },
  {
    category: "sports-net",
    defaultService: "cricket-nets",
    bases: [
      "sports nets",
      "sports net",
      "sports netting",
      "cricket net",
      "cricket nets",
      "cricket practice net",
      "cricket practice nets",
      "cricket net for practice",
    ],
  },
  {
    category: "bird-spikes",
    defaultService: "bird-spikes",
    bases: [
      "bird spikes",
      "pigeon spikes",
      "anti bird spikes",
      "anti pigeon spikes",
      "bird control spikes",
      "pigeon control spikes",
      "bird repellent spikes",
    ],
  },
];

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function titleCase(value) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

function mapService(category, defaultService, phrase) {
  if (category !== "safety-net") return defaultService;
  const lower = phrase.toLowerCase();
  if (/\b(child|children|kid|kids|baby|toddler)\b/.test(lower)) {
    return "children-safety-nets";
  }
  if (/\b(pet|pets|cat|cats|dog|dogs)\b/.test(lower)) {
    return "pet-safety-nets";
  }
  return defaultService;
}

function inferTags(phrase) {
  const lower = phrase.toLowerCase();
  const tags = [];
  if (/\b(price|cost|rate|charges|quote|estimate|affordable|cheap|low cost|per sq ft|square feet)\b/.test(lower)) {
    tags.push("pricing");
  }
  if (/\b(install|installer|fitting|setup|fixing|without drilling|professional installation)\b/.test(lower)) {
    tags.push("installation");
  }
  if (/\b(company|contractor|dealer|supplier|manufacturer|shop|store|service)\b/.test(lower)) {
    tags.push("provider");
  }
  if (/\b(balcony|window|terrace|apartment|flat|villa|high rise|home|house|commercial|residential)\b/.test(lower)) {
    tags.push("application");
  }
  if (/\b(child|kid|baby|pet|cat|dog|pigeon|bird|fall protection|safety)\b/.test(lower)) {
    tags.push("safety");
  }
  if (/\b(stainless|ss|316|nylon|hdpe|material|wire|cable|anti rust|durable|strong)\b/.test(lower)) {
    tags.push("material");
  }
  if (/\b(design|ideas|custom|transparent|modern)\b/.test(lower)) {
    tags.push("design");
  }
  if (tags.length === 0) tags.push("general");
  return tags;
}

function buildIntents() {
  const seen = new Set();
  const intents = [];

  for (const group of PRODUCT_GROUPS) {
    for (const base of group.bases) {
      const phrases = [base, ...MODIFIERS.map((mod) => `${base} ${mod}`)];

      for (const phrase of phrases) {
        const slug = slugify(phrase);
        if (seen.has(slug)) continue;
        seen.add(slug);

        intents.push({
          slug,
          label: titleCase(phrase),
          phraseTemplate: `${phrase} in {area} hyderabad`,
          serviceSlug: mapService(group.category, group.defaultService, phrase),
          category: group.category,
          tags: inferTags(phrase),
        });
      }
    }
  }

  return intents;
}

const intents = buildIntents();

const output = `/* eslint-disable max-lines */
/** Auto-generated by scripts/build-keyword-intents.mjs — do not edit manually. */

export const KEYWORD_INTENTS_DATA = ${JSON.stringify(intents, null, 2)};
`;

writeFileSync(join(process.cwd(), "src/data/keyword-intents-data.ts"), output, "utf8");

console.log(`Generated ${intents.length} keyword intents`);
console.log("By category:");
for (const group of PRODUCT_GROUPS) {
  const count = intents.filter((i) => i.category === group.category).length;
  console.log(`  ${group.category}: ${count}`);
}
