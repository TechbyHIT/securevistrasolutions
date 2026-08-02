export const ROUTE_PATTERNS = {
  home: "/",
  about: "/about/",
  contact: "/contact/",
  services: "/services/",
  service: "/services/[serviceSlug]/",
  locations: "/locations/",
  location: "/locations/[locationSlug]/",
  area: "/locations/[locationSlug]/[areaSlug]/",
  serviceInCity: "/[serviceSlug]-in-[locationSlug]/",
  invisibleGrillsInstallationInLocality:
    "/invisible-grills-installation-in-[areaSlug]/",
  serviceLocation: "/[locationSlug]/[serviceSlug]/",
  serviceArea: "/[locationSlug]/[areaSlug]/[serviceSlug]/",
  serviceAreaIntent: "/[locationSlug]/[areaSlug]/[serviceSlug]/[intentSlug]/",
  solutions: "/solutions/",
  solution: "/solutions/[problemSlug]/",
  propertyTypes: "/property-types/",
  propertyTypeService: "/property-types/[propertyTypeSlug]/[serviceSlug]/",
  guides: "/guides/",
  guide: "/guides/[guideSlug]/",
  blog: "/blog/",
  blogPost: "/blog/[postSlug]/",
  gallery: "/gallery/",
  projects: "/projects/",
  testimonials: "/testimonials/",
  faq: "/faq/",
  pricingGuide: "/pricing-guide/",
  materialsGuide: "/materials-guide/",
  installationProcess: "/installation-process/",
  safetyGuide: "/safety-guide/",
  privacyPolicy: "/privacy-policy/",
  terms: "/terms-and-conditions/",
  disclaimer: "/disclaimer/",
  thankYou: "/thank-you/",
  admin: "/admin/",
} as const;

export type PageType =
  | "home"
  | "core"
  | "service"
  | "location"
  | "area"
  | "service-in-city"
  | "invisible-grills-installation-in-locality"
  | "service-location"
  | "service-area"
  | "service-area-intent"
  | "solution"
  | "property-type"
  | "guide"
  | "blog";

export function withTrailingSlash(path: string): string {
  if (path === "/") return path;
  const clean = path.split("?")[0]?.split("#")[0] ?? path;
  return clean.endsWith("/") ? clean : `${clean}/`;
}
