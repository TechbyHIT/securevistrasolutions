/**
 * Catalog gate for build — SWAMI uses static TypeScript data (no DB snapshot).
 * Verifies published catalog modules load before sitemap generation.
 */
import { getPublishedServices } from "../src/data/initial-services.ts";
import { getPublishedLocations } from "../src/data/initial-locations.ts";
import { getServedAreas } from "../src/data/initial-areas.ts";

const services = getPublishedServices();
const locations = getPublishedLocations();
const areas = locations.reduce((sum, loc) => sum + getServedAreas(loc.id).length, 0);

if (services.length === 0 || locations.length === 0) {
  console.error("catalog:build failed — missing published services or locations");
  process.exit(1);
}

console.log(
  `catalog:build ok — ${services.length} services, ${locations.length} cities, ${areas} served areas`,
);
