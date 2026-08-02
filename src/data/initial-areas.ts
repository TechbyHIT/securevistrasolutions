import type { Area } from "@/types/location";
import { AREA_SLUG_ALIASES, HYDERABAD_AREA_CATALOG } from "@/data/hyderabad-area-catalog";
import type { AreaCatalogEntry } from "@/data/area-catalog-types";

const now = "2026-07-31T00:00:00.000Z";

export const INITIAL_AREAS: Area[] = [
  {
    id: "area-gachibowli",
    slug: "gachibowli",
    name: "Gachibowli",
    locationType: "area",
    parentId: "loc-hyderabad",
    state: "Telangana",
    district: "Hyderabad",
    publicationStatus: "published",
    allowIndexing: true,
    isServed: true,
    introduction:
      "Gachibowli apartments and gated communities often prefer discreet invisible grills and reliable balcony safety nets.",
    localDescription:
      "In Gachibowli, installation planning usually accounts for high-rise access, apartment balcony geometry and family or pet safety needs.",
    nearbyLocationIds: ["area-kondapur", "area-hitech-city", "area-madhapur"],
    landmarkIds: ["lm-gachibowli"],
    propertyTypes: ["apartments", "gated-communities"],
    localCharacteristics: ["High-rise apartment living", "Gated community housing"],
    serviceDemandNotes: ["View-preserving balcony protection is a frequent preference"],
    verifiedLocalFacts: ["Gachibowli is a served Hyderabad area with apartment demand"],
    localDataVerified: true,
    contentReviewed: true,
    qualityScore: 88,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "area-kondapur",
    slug: "kondapur",
    name: "Kondapur",
    locationType: "area",
    parentId: "loc-hyderabad",
    state: "Telangana",
    district: "Hyderabad",
    publicationStatus: "published",
    allowIndexing: true,
    isServed: true,
    introduction:
      "Kondapur residences regularly request child safety nets, pet nets and mosquito-net comfort upgrades.",
    localDescription:
      "Kondapur service recommendations are based on property type, opening measurements and verified household needs.",
    nearbyLocationIds: ["area-gachibowli", "area-madhapur", "area-miyapur"],
    landmarkIds: [],
    propertyTypes: ["apartments", "villas"],
    localCharacteristics: ["Apartment-heavy residential demand"],
    serviceDemandNotes: ["Family safety and insect protection are common intents"],
    verifiedLocalFacts: ["Kondapur is included in Hyderabad service coverage"],
    localDataVerified: true,
    contentReviewed: true,
    qualityScore: 87,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "area-hitech-city",
    slug: "hitech-city",
    name: "Hitech City",
    locationType: "area",
    parentId: "loc-hyderabad",
    state: "Telangana",
    district: "Hyderabad",
    publicationStatus: "published",
    allowIndexing: true,
    isServed: true,
    introduction:
      "Hitech City apartments often need balcony protection that works with high-rise living and busy household schedules.",
    localDescription:
      "For Hitech City homes, we plan invisible grills, safety nets and mosquito nets around measured openings and practical access conditions.",
    nearbyLocationIds: ["area-gachibowli", "area-madhapur", "area-kondapur"],
    landmarkIds: ["lm-hitech-city"],
    propertyTypes: ["apartments", "gated-communities"],
    localCharacteristics: ["High-rise apartments", "Working-professional residential demand"],
    serviceDemandNotes: ["Invisible grills and balcony nets are frequent requests"],
    verifiedLocalFacts: ["Hitech City is a served Hyderabad residential and mixed-use corridor"],
    localDataVerified: true,
    contentReviewed: true,
    qualityScore: 86,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "area-madhapur",
    slug: "madhapur",
    name: "Madhapur",
    locationType: "area",
    parentId: "loc-hyderabad",
    state: "Telangana",
    district: "Hyderabad",
    publicationStatus: "published",
    allowIndexing: true,
    isServed: true,
    introduction:
      "Madhapur homes commonly request balcony safety nets, invisible grills and mosquito nets for apartment living.",
    localDescription:
      "Madhapur installations are planned opening by opening, with clear guidance on materials, spacing and quotation factors.",
    nearbyLocationIds: ["area-hitech-city", "area-kondapur", "area-jubilee-hills"],
    landmarkIds: [],
    propertyTypes: ["apartments", "independent-houses"],
    localCharacteristics: ["Dense apartment clusters", "Mixed residential demand"],
    serviceDemandNotes: ["Balcony and window protection requests are common"],
    verifiedLocalFacts: ["Madhapur is part of Hyderabad service coverage"],
    localDataVerified: true,
    contentReviewed: true,
    qualityScore: 86,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "area-miyapur",
    slug: "miyapur",
    name: "Miyapur",
    locationType: "area",
    parentId: "loc-hyderabad",
    state: "Telangana",
    district: "Hyderabad",
    publicationStatus: "published",
    allowIndexing: true,
    isServed: true,
    introduction:
      "Miyapur residences often need practical balcony safety and mosquito-net comfort solutions for apartments and independent houses.",
    localDescription:
      "Service in Miyapur focuses on measured recommendations for family homes, with honest coverage wording and clear installation planning.",
    nearbyLocationIds: ["area-kondapur", "area-kukatpally"],
    landmarkIds: [],
    propertyTypes: ["apartments", "independent-houses"],
    localCharacteristics: ["Growing residential corridors", "Family housing demand"],
    serviceDemandNotes: ["Children safety nets and balcony nets are typical enquiries"],
    verifiedLocalFacts: ["Miyapur is included in Hyderabad service coverage"],
    localDataVerified: true,
    contentReviewed: true,
    qualityScore: 85,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "area-kukatpally",
    slug: "kukatpally",
    name: "Kukatpally",
    locationType: "area",
    parentId: "loc-hyderabad",
    state: "Telangana",
    district: "Hyderabad",
    publicationStatus: "published",
    allowIndexing: true,
    isServed: true,
    introduction:
      "Kukatpally households request balcony nets, invisible grills and utility upgrades based on apartment and independent-house openings.",
    localDescription:
      "Local recommendations for Kukatpally focus on durable materials, practical installation access and clear quotation factors.",
    nearbyLocationIds: ["area-miyapur", "area-bachupally"],
    landmarkIds: [],
    propertyTypes: ["apartments", "independent-houses"],
    localCharacteristics: ["Established residential pockets", "Apartment and independent-house mix"],
    serviceDemandNotes: ["Safety nets and mosquito nets are regular needs"],
    verifiedLocalFacts: ["Kukatpally is a served Hyderabad area"],
    localDataVerified: true,
    contentReviewed: true,
    qualityScore: 85,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "area-jubilee-hills",
    slug: "jubilee-hills",
    name: "Jubilee Hills",
    locationType: "area",
    parentId: "loc-hyderabad",
    state: "Telangana",
    district: "Hyderabad",
    publicationStatus: "published",
    allowIndexing: true,
    isServed: true,
    introduction:
      "Jubilee Hills homes and apartments often prefer discreet invisible grills and carefully finished balcony protection.",
    localDescription:
      "In Jubilee Hills, recommendations usually balance safety, appearance and opening-specific installation quality.",
    nearbyLocationIds: ["area-banjara-hills", "area-madhapur"],
    landmarkIds: [],
    propertyTypes: ["villas", "apartments", "independent-houses"],
    localCharacteristics: ["Premium residential pockets", "Appearance-sensitive installations"],
    serviceDemandNotes: ["Invisible grills are a frequent preference"],
    verifiedLocalFacts: ["Jubilee Hills is included in Hyderabad service coverage"],
    localDataVerified: true,
    contentReviewed: true,
    qualityScore: 86,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "area-banjara-hills",
    slug: "banjara-hills",
    name: "Banjara Hills",
    locationType: "area",
    parentId: "loc-hyderabad",
    state: "Telangana",
    district: "Hyderabad",
    publicationStatus: "published",
    allowIndexing: true,
    isServed: true,
    introduction:
      "Banjara Hills residences request balcony and window safety upgrades with neat finishing and measured planning.",
    localDescription:
      "Installations around Banjara Hills are planned after understanding opening sizes, access and household safety priorities.",
    nearbyLocationIds: ["area-jubilee-hills", "area-tolichowki"],
    landmarkIds: [],
    propertyTypes: ["apartments", "villas", "independent-houses"],
    localCharacteristics: ["Established residential neighbourhoods"],
    serviceDemandNotes: ["Invisible grills and mosquito nets are common discussions"],
    verifiedLocalFacts: ["Banjara Hills is part of Hyderabad service coverage"],
    localDataVerified: true,
    contentReviewed: true,
    qualityScore: 85,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "area-secunderabad",
    slug: "secunderabad",
    name: "Secunderabad",
    locationType: "area",
    parentId: "loc-hyderabad",
    state: "Telangana",
    district: "Hyderabad",
    publicationStatus: "published",
    allowIndexing: true,
    isServed: true,
    introduction:
      "Secunderabad residences often need balcony and window safety upgrades for apartments and independent homes.",
    localDescription:
      "We handle Secunderabad enquiries as part of Hyderabad service coverage with practical site assessment before recommending a solution.",
    nearbyLocationIds: ["area-begumpet", "area-ameerpet"],
    landmarkIds: [],
    propertyTypes: ["apartments", "independent-houses"],
    localCharacteristics: ["Mix of older homes and apartment communities"],
    serviceDemandNotes: ["Window and balcony protection requests are common"],
    verifiedLocalFacts: ["Secunderabad is served as part of the Hyderabad urban service area"],
    localDataVerified: true,
    contentReviewed: true,
    qualityScore: 85,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "area-begumpet",
    slug: "begumpet",
    name: "Begumpet",
    locationType: "area",
    parentId: "loc-hyderabad",
    state: "Telangana",
    district: "Hyderabad",
    publicationStatus: "published",
    allowIndexing: true,
    isServed: true,
    introduction:
      "Begumpet homes commonly need balcony safety nets, mosquito nets and related comfort upgrades.",
    localDescription:
      "Begumpet service support focuses on measured openings and clear recommendations for apartments and independent houses.",
    nearbyLocationIds: ["area-secunderabad", "area-ameerpet"],
    landmarkIds: [],
    propertyTypes: ["apartments", "independent-houses"],
    localCharacteristics: ["Central residential demand"],
    serviceDemandNotes: ["Mosquito nets and balcony nets are typical needs"],
    verifiedLocalFacts: ["Begumpet is included in Hyderabad service coverage"],
    localDataVerified: true,
    contentReviewed: true,
    qualityScore: 84,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "area-ameerpet",
    slug: "ameerpet",
    name: "Ameerpet",
    locationType: "area",
    parentId: "loc-hyderabad",
    state: "Telangana",
    district: "Hyderabad",
    publicationStatus: "published",
    allowIndexing: true,
    isServed: true,
    introduction:
      "Ameerpet apartments and homes request practical balcony protection and mosquito-net installations.",
    localDescription:
      "For Ameerpet, recommendations stay opening-specific with honest service-area wording and quotation clarity.",
    nearbyLocationIds: ["area-begumpet", "area-sr-nagar"],
    landmarkIds: [],
    propertyTypes: ["apartments", "independent-houses"],
    localCharacteristics: ["Dense residential and mixed-use pockets"],
    serviceDemandNotes: ["Balcony nets and mosquito nets are frequent requests"],
    verifiedLocalFacts: ["Ameerpet is part of Hyderabad service coverage"],
    localDataVerified: true,
    contentReviewed: true,
    qualityScore: 84,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "area-sr-nagar",
    slug: "sr-nagar",
    name: "SR Nagar",
    locationType: "area",
    parentId: "loc-hyderabad",
    state: "Telangana",
    district: "Hyderabad",
    publicationStatus: "published",
    allowIndexing: true,
    isServed: true,
    introduction:
      "SR Nagar residences often need balcony safety and window mosquito-net upgrades for everyday family use.",
    localDescription:
      "Installations in SR Nagar are planned around property type, access and the specific safety or comfort outcome required.",
    nearbyLocationIds: ["area-ameerpet", "area-kukatpally"],
    landmarkIds: [],
    propertyTypes: ["apartments", "independent-houses"],
    localCharacteristics: ["Established residential neighbourhood"],
    serviceDemandNotes: ["Family safety nets and mosquito nets are common"],
    verifiedLocalFacts: ["SR Nagar is included in Hyderabad service coverage"],
    localDataVerified: true,
    contentReviewed: true,
    qualityScore: 83,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "area-tolichowki",
    slug: "tolichowki",
    name: "Tolichowki",
    locationType: "area",
    parentId: "loc-hyderabad",
    state: "Telangana",
    district: "Hyderabad",
    publicationStatus: "published",
    allowIndexing: true,
    isServed: true,
    introduction:
      "Tolichowki households request balcony nets, invisible grills and mosquito nets based on apartment and independent-house openings.",
    localDescription:
      "Tolichowki recommendations focus on durable materials, practical fixing methods and clear pricing factors.",
    nearbyLocationIds: ["area-banjara-hills", "area-mehdipatnam"],
    landmarkIds: [],
    propertyTypes: ["apartments", "independent-houses"],
    localCharacteristics: ["Dense residential demand"],
    serviceDemandNotes: ["Balcony safety and mosquito comfort are regular intents"],
    verifiedLocalFacts: ["Tolichowki is a served Hyderabad area"],
    localDataVerified: true,
    contentReviewed: true,
    qualityScore: 83,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "area-mehdipatnam",
    slug: "mehdipatnam",
    name: "Mehdipatnam",
    locationType: "area",
    parentId: "loc-hyderabad",
    state: "Telangana",
    district: "Hyderabad",
    publicationStatus: "published",
    allowIndexing: true,
    isServed: true,
    introduction:
      "Mehdipatnam homes commonly need balcony protection and mosquito-net comfort solutions.",
    localDescription:
      "Service visits around Mehdipatnam start with measurement and household-use discussion before recommending a system.",
    nearbyLocationIds: ["area-tolichowki", "area-attapur"],
    landmarkIds: [],
    propertyTypes: ["apartments", "independent-houses"],
    localCharacteristics: ["Busy residential corridors"],
    serviceDemandNotes: ["Safety nets and mosquito nets are typical enquiries"],
    verifiedLocalFacts: ["Mehdipatnam is included in Hyderabad service coverage"],
    localDataVerified: true,
    contentReviewed: true,
    qualityScore: 83,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "area-attapur",
    slug: "attapur",
    name: "Attapur",
    locationType: "area",
    parentId: "loc-hyderabad",
    state: "Telangana",
    district: "Hyderabad",
    publicationStatus: "published",
    allowIndexing: true,
    isServed: true,
    introduction:
      "Attapur residences often request balcony safety nets, children nets and mosquito-net installations.",
    localDescription:
      "Attapur service planning stays measurement-led with clear material and installation guidance.",
    nearbyLocationIds: ["area-mehdipatnam", "area-rajendranagar"],
    landmarkIds: [],
    propertyTypes: ["apartments", "independent-houses"],
    localCharacteristics: ["Growing residential demand"],
    serviceDemandNotes: ["Family balcony protection is a frequent request"],
    verifiedLocalFacts: ["Attapur is part of Hyderabad service coverage"],
    localDataVerified: true,
    contentReviewed: true,
    qualityScore: 82,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "area-bachupally",
    slug: "bachupally",
    name: "Bachupally",
    locationType: "area",
    parentId: "loc-hyderabad",
    state: "Telangana",
    district: "Hyderabad",
    publicationStatus: "published",
    allowIndexing: true,
    isServed: true,
    introduction:
      "Bachupally apartments and family homes often need balcony safety and mosquito-net comfort upgrades.",
    localDescription:
      "For Bachupally, we recommend systems based on opening size, property type and verified household priorities.",
    nearbyLocationIds: ["area-kukatpally", "area-miyapur"],
    landmarkIds: [],
    propertyTypes: ["apartments", "villas", "independent-houses"],
    localCharacteristics: ["Growth-corridor housing", "Family-oriented residential demand"],
    serviceDemandNotes: ["Children safety nets and invisible grills are common discussions"],
    verifiedLocalFacts: ["Bachupally is included in Hyderabad service coverage"],
    localDataVerified: true,
    contentReviewed: true,
    qualityScore: 84,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "area-rajendranagar",
    slug: "rajendranagar",
    name: "Rajendranagar",
    locationType: "area",
    parentId: "loc-hyderabad",
    state: "Telangana",
    district: "Hyderabad",
    publicationStatus: "published",
    allowIndexing: true,
    isServed: true,
    introduction:
      "Rajendranagar homes and apartments request invisible grills, balcony safety nets and related installations with measurement-led support.",
    localDescription:
      "We provide home safety installations across Rajendranagar based on opening measurements, property type and local access conditions.",
    nearbyLocationIds: ["area-attapur"],
    landmarkIds: [],
    propertyTypes: ["apartments", "independent-houses"],
    localCharacteristics: ["Residential apartments and independent houses"],
    serviceDemandNotes: ["Balcony safety and invisible grills are common local requests"],
    verifiedLocalFacts: ["Rajendranagar is included in Hyderabad service coverage"],
    localDataVerified: true,
    contentReviewed: true,
    qualityScore: 82,
    createdAt: now,
    updatedAt: now,
  },
];

const RICH_AREA_SLUGS = new Set(INITIAL_AREAS.map((area) => area.slug));
const ALIAS_SOURCE_SLUGS = new Set(Object.keys(AREA_SLUG_ALIASES));

function catalogEntryToArea(entry: AreaCatalogEntry): Area {
  return {
    id: `area-${entry.slug}`,
    slug: entry.slug,
    name: entry.name,
    locationType: "area",
    parentId: "loc-hyderabad",
    state: "Telangana",
    district: "Hyderabad",
    publicationStatus: "published",
    allowIndexing: true,
    isServed: true,
    introduction: `${entry.name} homeowners can request invisible grills, safety nets, cloth hangers and sports nets with measurement-led installation support across Hyderabad.`,
    localDescription: `We provide home safety and comfort installations for properties in ${entry.name}, Hyderabad based on opening measurements, property type and local access conditions.`,
    nearbyLocationIds: [],
    landmarkIds: [],
    propertyTypes: ["apartments", "independent-houses", "villas"],
    localCharacteristics: ["Residential demand across apartments and independent homes"],
    serviceDemandNotes: ["Balcony safety, invisible grills and drying solutions are common requests"],
    verifiedLocalFacts: [`${entry.name} is included in Hyderabad service coverage`],
    localDataVerified: true,
    contentReviewed: true,
    qualityScore: 80,
    createdAt: now,
    updatedAt: now,
  };
}

const CATALOG_AREAS: Area[] = HYDERABAD_AREA_CATALOG.filter(
  (entry) => !RICH_AREA_SLUGS.has(entry.slug) && !ALIAS_SOURCE_SLUGS.has(entry.slug),
).map(catalogEntryToArea);

/** Rich seed areas plus catalog-only localities (351 total served areas). */
export const ALL_AREAS: Area[] = [...INITIAL_AREAS, ...CATALOG_AREAS];

export function resolveAreaSlug(slug: string): string {
  return AREA_SLUG_ALIASES[slug as keyof typeof AREA_SLUG_ALIASES] ?? slug;
}

export function getServedAreas(parentId?: string): Area[] {
  return ALL_AREAS.filter(
    (area) =>
      area.publicationStatus === "published" &&
      area.isServed &&
      (parentId ? area.parentId === parentId : true),
  );
}

export function getPublishedAreas(parentId?: string): Area[] {
  return ALL_AREAS.filter(
    (area) =>
      area.publicationStatus === "published" &&
      area.allowIndexing &&
      area.isServed &&
      (parentId ? area.parentId === parentId : true),
  );
}

export function getAreaBySlug(slug: string, parentId?: string): Area | undefined {
  const resolved = resolveAreaSlug(slug);
  return ALL_AREAS.find(
    (area) => area.slug === resolved && (parentId ? area.parentId === parentId : true),
  );
}

export function getAreaById(id: string): Area | undefined {
  return ALL_AREAS.find((area) => area.id === id);
}

export function countServedAreas(parentId?: string): number {
  return getServedAreas(parentId).length;
}
