/**
 * Copies HD project photos into public/images/services and generates catalog.
 * Run: node scripts/build-service-images.mjs
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "fs";
import { basename, extname, join } from "path";

const ROOT = process.cwd();
const SOURCE_DIRS = [
  "images/FINIALIZED PHOTOS",
  "images/FINIALIZED PHOTOS - 1",
  "images/FINIALIZED PHOTOS - 2",
  "images/FINIALIZED PHOTOS - 3",
  "images/FINIALIZED PHOTOS - 4",
].map((dir) => join(ROOT, dir));

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const MIN_BYTES = 25_000;
const MAX_PER_SERVICE = 20;
/** Skip UI mockups / “GLORY PLACEHOLDER” style assets. */
const PLACEHOLDER_NAME_RE =
  /placeholder|glory|home-hero|academy-sports|upload-area|\.svg$/i;

/** Source subfolder name → service slug(s) */
const FOLDER_MAP = {
  "children safety nets": ["children-safety-nets"],
  "cloth hangers": ["cloth-hangers"],
  "cricket nets": ["cricket-nets"],
  "duct area nets": ["balcony-safety-nets"],
  "invisible grill balcony": ["invisible-grills"],
  "invisible grill window": ["invisible-grills"],
  siri: ["invisible-grills"],
  "siri-webp": ["invisible-grills"],
  "mosquito nets": ["mosquito-nets"],
  "pet safety nets": ["pet-safety-nets"],
  "safety nets balcony": ["balcony-safety-nets"],
  spikes: ["bird-spikes"],
};

const SERVICE_SLUGS = [
  "invisible-grills",
  "balcony-safety-nets",
  "children-safety-nets",
  "pet-safety-nets",
  "mosquito-nets",
  "bird-spikes",
  "cloth-hangers",
  "cricket-nets",
];

function slugifyFile(name) {
  const ext = extname(name).toLowerCase();
  const base = basename(name, extname(name));
  const safeBase = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `${safeBase}${ext}`;
}

function walkFiles(dir, folderKey, bucket) {
  if (!existsSync(dir)) return;

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, folderKey, bucket);
      continue;
    }

    const ext = extname(entry.name).toLowerCase();
    if (!IMAGE_EXTS.has(ext)) continue;
    if (PLACEHOLDER_NAME_RE.test(entry.name) || PLACEHOLDER_NAME_RE.test(folderKey)) continue;

    const size = statSync(fullPath).size;
    const dedupeKey = `${folderKey}::${entry.name.toLowerCase()}`;
    const current = bucket.get(dedupeKey);
    if (!current || size > current.size) {
      bucket.set(dedupeKey, { name: entry.name, size, src: fullPath, folderKey });
    }
  }
}

function collectByService() {
  const raw = new Map();
  const byService = Object.fromEntries(SERVICE_SLUGS.map((slug) => [slug, []]));

  for (const sourceRoot of SOURCE_DIRS) {
    if (!existsSync(sourceRoot)) continue;

    for (const entry of readdirSync(sourceRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const folderKey = entry.name.toLowerCase();
      const slugs = FOLDER_MAP[folderKey];
      if (!slugs) continue;

      const folderBucket = new Map();
      walkFiles(join(sourceRoot, entry.name), folderKey, folderBucket);

      for (const file of folderBucket.values()) {
        for (const slug of slugs) {
          byService[slug].push(file);
        }
      }
    }
  }

  for (const slug of SERVICE_SLUGS) {
    const deduped = new Map();
    for (const file of byService[slug]) {
      const key = file.name.toLowerCase();
      const existing = deduped.get(key);
      if (!existing || file.size > existing.size) deduped.set(key, file);
    }

    const sorted = [...deduped.values()]
      .filter((file) => file.size >= MIN_BYTES)
      .sort((a, b) => b.size - a.size)
      .slice(0, MAX_PER_SERVICE);

    if (sorted.length === 0) {
      const fallback = [...deduped.values()].sort((a, b) => b.size - a.size).slice(0, MAX_PER_SERVICE);
      byService[slug] = fallback;
    } else {
      byService[slug] = sorted;
    }
  }

  return byService;
}

function copyImages(byService) {
  const catalog = {};
  const publicRoot = join(ROOT, "public", "images", "services");
  if (existsSync(publicRoot)) {
    rmSync(publicRoot, { recursive: true, force: true });
  }
  mkdirSync(publicRoot, { recursive: true });

  for (const slug of SERVICE_SLUGS) {
    const destDir = join(publicRoot, slug);
    mkdirSync(destDir, { recursive: true });

    const paths = [];
    byService[slug].forEach((file, index) => {
      const safeName = `${String(index + 1).padStart(2, "0")}-${slugifyFile(file.name)}`;
      const dest = join(destDir, safeName);
      cpSync(file.src, dest);
      paths.push(`/images/services/${slug}/${safeName}`);
    });

    catalog[slug] = {
      heroImage: paths[0] ?? `/images/services/${slug}/placeholder.webp`,
      galleryImages: paths,
    };
  }

  return catalog;
}

function buildHomeGallery(catalog) {
  const picks = [];
  for (const slug of SERVICE_SLUGS) {
    const images = catalog[slug]?.galleryImages ?? [];
    for (const src of images.slice(0, 3)) {
      picks.push({ src, serviceSlug: slug });
    }
  }
  return picks.slice(0, 24);
}

const byService = collectByService();
const catalog = copyImages(byService);
const homeGallery = buildHomeGallery(catalog);
const homeHero =
  catalog["invisible-grills"]?.heroImage ??
  catalog["balcony-safety-nets"]?.heroImage ??
  "/images/hero.webp";

const output = `/** Auto-generated by scripts/build-service-images.mjs — do not edit manually. */
export type ServiceImageEntry = {
  heroImage: string;
  galleryImages: string[];
};

export type HomeGalleryItem = {
  src: string;
  serviceSlug: string;
};

export const SERVICE_IMAGE_CATALOG: Record<string, ServiceImageEntry> = ${JSON.stringify(catalog, null, 2)};

export const HOME_GALLERY_IMAGES: HomeGalleryItem[] = ${JSON.stringify(homeGallery, null, 2)};

export const HOME_HERO_IMAGE = ${JSON.stringify(homeHero)};
`;

writeFileSync(join(ROOT, "src", "data", "service-image-catalog.ts"), output, "utf8");

console.log("Service image catalog generated:");
for (const slug of SERVICE_SLUGS) {
  console.log(`  ${slug}: ${catalog[slug].galleryImages.length} images`);
}
console.log(`Home gallery: ${homeGallery.length} images`);
console.log(`Home hero: ${homeHero}`);
