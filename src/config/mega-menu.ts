import { buildServiceInCityPath } from "@/lib/utils/service-in-city-slug";
import { buildInvisibleGrillsInstallationPath } from "@/lib/utils/installation-in-locality-slug";

export const DEFAULT_LOCATION_SLUG = "hyderabad";
export const DEFAULT_MEGA_MENU_AREA = "gachibowli";

export type MegaMenuLink = {
  label: string;
  serviceSlug: string;
  intentSlug?: string;
};

export type MegaMenuColumn = {
  title: string;
  serviceSlug: string;
  links: MegaMenuLink[];
};

export type AreaMenuColumn = {
  title: string;
  areas: { label: string; slug: string }[];
};

/** Eight-column services mega menu — links to programmatic intent pages in a default Hyderabad area. */
export const SERVICES_MEGA_MENU: MegaMenuColumn[] = [
  {
    title: "Invisible Grills",
    serviceSlug: "invisible-grills",
    links: [
      { label: "Invisible Grills", serviceSlug: "invisible-grills", intentSlug: "invisible-grills" },
      { label: "Balcony Invisible Grills", serviceSlug: "invisible-grills", intentSlug: "invisible-grill-for-balcony" },
      { label: "Window Invisible Grills", serviceSlug: "invisible-grills", intentSlug: "invisible-grill-for-window" },
      { label: "Invisible Grills for Apartments", serviceSlug: "invisible-grills", intentSlug: "invisible-grills-for-apartment" },
      { label: "Invisible Grills for Villas", serviceSlug: "invisible-grills", intentSlug: "invisible-grills-for-villa" },
      { label: "Invisible Grills for Child Safety", serviceSlug: "invisible-grills", intentSlug: "invisible-grills-for-child-safety" },
      { label: "Invisible Grills for Pets", serviceSlug: "invisible-grills", intentSlug: "invisible-grills-for-pets" },
    ],
  },
  {
    title: "Safety Nets",
    serviceSlug: "balcony-safety-nets",
    links: [
      { label: "Safety Nets", serviceSlug: "balcony-safety-nets", intentSlug: "safety-nets" },
      { label: "Balcony Safety Nets", serviceSlug: "balcony-safety-nets", intentSlug: "balcony-safety-net" },
      { label: "Kids Safety Nets", serviceSlug: "children-safety-nets", intentSlug: "kids-safety-net" },
      { label: "Child Safety Nets", serviceSlug: "children-safety-nets", intentSlug: "child-safety-net" },
      { label: "Pet Safety Nets", serviceSlug: "pet-safety-nets", intentSlug: "pet-safety-net" },
      { label: "Cat Safety Nets", serviceSlug: "pet-safety-nets", intentSlug: "safety-nets-for-cats" },
      { label: "Dog Safety Nets", serviceSlug: "pet-safety-nets", intentSlug: "safety-nets-for-dogs" },
    ],
  },
  {
    title: "Balcony Nets",
    serviceSlug: "balcony-safety-nets",
    links: [
      { label: "Balcony Nets", serviceSlug: "balcony-safety-nets", intentSlug: "balcony-nets" },
      { label: "Balcony Protection Nets", serviceSlug: "balcony-safety-nets", intentSlug: "balcony-safety-nets" },
      { label: "Balcony Children Safety Nets", serviceSlug: "balcony-safety-nets", intentSlug: "balcony-net-for-child-safety" },
      { label: "Balcony Pet Safety Nets", serviceSlug: "pet-safety-nets", intentSlug: "safety-nets-for-pets" },
      { label: "Apartment Balcony Nets", serviceSlug: "balcony-safety-nets", intentSlug: "balcony-net-for-apartments" },
      { label: "High Rise Balcony Nets", serviceSlug: "balcony-safety-nets", intentSlug: "balcony-nets-for-high-rise" },
    ],
  },
  {
    title: "Bird Nets",
    serviceSlug: "balcony-safety-nets",
    links: [
      { label: "Bird Nets", serviceSlug: "balcony-safety-nets", intentSlug: "safety-nets-for-bird-protection" },
      { label: "Anti Bird Nets", serviceSlug: "balcony-safety-nets", intentSlug: "safety-net-for-bird-protection" },
      { label: "Bird Protection Nets", serviceSlug: "balcony-safety-nets", intentSlug: "safety-net-for-bird-protection" },
      { label: "Balcony Bird Nets", serviceSlug: "balcony-safety-nets", intentSlug: "balcony-bird-net" },
      { label: "Window Bird Nets", serviceSlug: "balcony-safety-nets", intentSlug: "window-safety-net-for-bird-protection" },
      { label: "Duct Area Bird Nets", serviceSlug: "balcony-safety-nets", intentSlug: "duct-area-safety-net" },
    ],
  },
  {
    title: "Pigeon Nets",
    serviceSlug: "balcony-safety-nets",
    links: [
      { label: "Pigeon Nets", serviceSlug: "balcony-safety-nets", intentSlug: "safety-nets-for-pigeon-protection" },
      { label: "Anti Pigeon Nets", serviceSlug: "balcony-safety-nets", intentSlug: "safety-net-for-pigeon-protection" },
      { label: "Pigeon Safety Nets", serviceSlug: "balcony-safety-nets", intentSlug: "safety-net-for-pigeon-protection" },
      { label: "Balcony Pigeon Nets", serviceSlug: "balcony-safety-nets", intentSlug: "balcony-safety-nets-for-pigeon-protection" },
      { label: "Window Pigeon Nets", serviceSlug: "balcony-safety-nets", intentSlug: "window-safety-net-for-pigeon-protection" },
      { label: "Duct Area Pigeon Nets", serviceSlug: "balcony-safety-nets", intentSlug: "duct-area-safety-net-for-pigeon-protection" },
    ],
  },
  {
    title: "Sports Nets",
    serviceSlug: "cricket-nets",
    links: [
      { label: "Sports Nets", serviceSlug: "cricket-nets", intentSlug: "sports-nets" },
      { label: "Cricket Nets", serviceSlug: "cricket-nets", intentSlug: "cricket-net" },
      { label: "Cricket Practice Nets", serviceSlug: "cricket-nets", intentSlug: "cricket-practice-net" },
      { label: "Football Nets", serviceSlug: "cricket-nets", intentSlug: "sports-nets" },
      { label: "Football Goal Nets", serviceSlug: "cricket-nets", intentSlug: "sports-nets" },
      { label: "Volleyball Nets", serviceSlug: "cricket-nets", intentSlug: "sports-nets" },
    ],
  },
  {
    title: "Cloth Hangers",
    serviceSlug: "cloth-hangers",
    links: [
      { label: "Cloth Hangers", serviceSlug: "cloth-hangers", intentSlug: "cloth-hanger" },
      { label: "Ceiling Cloth Hangers", serviceSlug: "cloth-hangers", intentSlug: "ceiling-cloth-hanger" },
      { label: "Balcony Cloth Hangers", serviceSlug: "cloth-hangers", intentSlug: "balcony-cloth-hanger" },
      { label: "Wall Mounted Cloth Hangers", serviceSlug: "cloth-hangers", intentSlug: "cloth-hanger" },
      { label: "Pulley Cloth Hangers", serviceSlug: "cloth-hangers", intentSlug: "ceiling-cloth-hanger" },
      { label: "Stainless Steel Cloth Hangers", serviceSlug: "cloth-hangers", intentSlug: "cloth-hanger" },
      { label: "Clothes Drying Hangers", serviceSlug: "cloth-hangers", intentSlug: "clothes-drying-hanger" },
    ],
  },
  {
    title: "Bird Spikes",
    serviceSlug: "bird-spikes",
    links: [
      { label: "Bird Spikes", serviceSlug: "bird-spikes", intentSlug: "bird-spikes" },
      { label: "Pigeon Spikes", serviceSlug: "bird-spikes", intentSlug: "pigeon-spikes" },
      { label: "Anti Bird Spikes", serviceSlug: "bird-spikes", intentSlug: "anti-bird-spikes" },
      { label: "Anti Pigeon Spikes", serviceSlug: "bird-spikes", intentSlug: "anti-pigeon-spikes" },
      { label: "Bird Control Spikes", serviceSlug: "bird-spikes", intentSlug: "bird-control-spikes" },
      { label: "Pigeon Control Spikes", serviceSlug: "bird-spikes", intentSlug: "pigeon-control-spikes" },
      { label: "Stainless Steel Bird Spikes", serviceSlug: "bird-spikes", intentSlug: "bird-spikes-stainless-steel" },
    ],
  },
];

export const AREAS_MEGA_MENU: AreaMenuColumn[] = [
  {
    title: "West Hyderabad",
    areas: [
      { label: "Gachibowli", slug: "gachibowli" },
      { label: "Kondapur", slug: "kondapur" },
      { label: "Hitech City", slug: "hitech-city" },
      { label: "Madhapur", slug: "madhapur" },
      { label: "Miyapur", slug: "miyapur" },
      { label: "Kukatpally", slug: "kukatpally" },
      { label: "Financial District", slug: "financialdistrict" },
    ],
  },
  {
    title: "Central Hyderabad",
    areas: [
      { label: "Jubilee Hills", slug: "jubilee-hills" },
      { label: "Banjara Hills", slug: "banjara-hills" },
      { label: "Ameerpet", slug: "ameerpet" },
      { label: "SR Nagar", slug: "sr-nagar" },
      { label: "Begumpet", slug: "begumpet" },
      { label: "Barkas", slug: "barkas" },
      { label: "Tolichowki", slug: "tolichowki" },
    ],
  },
  {
    title: "North & East",
    areas: [
      { label: "Secunderabad", slug: "secunderabad" },
      { label: "Malkajgiri", slug: "malkajgiri" },
      { label: "Uppal", slug: "uppal" },
      { label: "LB Nagar", slug: "lbnagar" },
      { label: "Dilsukhnagar", slug: "dilsukhnagar" },
      { label: "Kompally", slug: "kompally" },
      { label: "Alwal", slug: "alwal" },
    ],
  },
  {
    title: "South Hyderabad",
    areas: [
      { label: "Attapur", slug: "attapur" },
      { label: "Mehdipatnam", slug: "mehdipatnam" },
      { label: "Manikonda", slug: "manikonda" },
      { label: "Narsingi", slug: "narsingi" },
      { label: "Kokapet", slug: "kokapet" },
      { label: "Rajendranagar", slug: "rajendranagar" },
      { label: "Shamshabad", slug: "shamshabad" },
    ],
  },
];

const HOT_INSTALLATION_LOCALITIES = [
  { label: "Gachibowli", slug: "gachibowli" },
  { label: "Kondapur", slug: "kondapur" },
  { label: "Hitech City", slug: "hitech-city" },
  { label: "Madhapur", slug: "madhapur" },
  { label: "Kukatpally", slug: "kukatpally" },
  { label: "Miyapur", slug: "miyapur" },
  { label: "Jubilee Hills", slug: "jubilee-hills" },
  { label: "Manikonda", slug: "manikonda" },
  { label: "Karmanghat", slug: "karmanghat" },
  { label: "LB Nagar", slug: "lbnagar" },
];

export function buildInvisibleGrillsLocalityLinks() {
  return HOT_INSTALLATION_LOCALITIES.map((area) => ({
    label: `Install in ${area.label}`,
    href: buildInvisibleGrillsInstallationPath(area.slug),
  }));
}

/**
 * Public link target for keyword/intent navigation.
 * Deep intent URLs (`/city/area/service/intent/`) stay ISR-reachable but noindex.
 * Public links MUST point at indexable service×area pages so crawlers Add them
 * instead of Skipping noindex URLs.
 */
export function buildIntentPageUrl(
  serviceSlug: string,
  _intentSlug: string,
  areaSlug = DEFAULT_MEGA_MENU_AREA,
  locationSlug = DEFAULT_LOCATION_SLUG,
): string {
  return `/${locationSlug}/${areaSlug}/${serviceSlug}/`;
}

/** Canonical deep intent path (kept for routing/tests; do not use in public nav). */
export function buildDeepIntentPageUrl(
  serviceSlug: string,
  intentSlug: string,
  areaSlug = DEFAULT_MEGA_MENU_AREA,
  locationSlug = DEFAULT_LOCATION_SLUG,
): string {
  return `/${locationSlug}/${areaSlug}/${serviceSlug}/${intentSlug}/`;
}

export function buildServiceLocationUrl(
  serviceSlug: string,
  locationSlug = DEFAULT_LOCATION_SLUG,
): string {
  return buildServiceInCityPath(serviceSlug, locationSlug);
}

export function buildAreaPageUrl(
  areaSlug: string,
  locationSlug = DEFAULT_LOCATION_SLUG,
): string {
  return `/locations/${locationSlug}/${areaSlug}/`;
}

export function getMegaMenuLinkHref(
  link: MegaMenuLink,
  areaSlug = DEFAULT_MEGA_MENU_AREA,
): string {
  // Prefer indexable service×area pages over noindex deep-intent URLs.
  return `/${DEFAULT_LOCATION_SLUG}/${areaSlug}/${link.serviceSlug}/`;
}

export function getMegaMenuColumnHref(column: MegaMenuColumn): string {
  return `/services/${column.serviceSlug}/`;
}
