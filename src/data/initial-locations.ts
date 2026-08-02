import type { Location } from "@/types/location";

const now = "2026-07-31T00:00:00.000Z";

export const INITIAL_LOCATIONS: Location[] = [
  {
    id: "loc-hyderabad",
    slug: "hyderabad",
    name: "Hyderabad",
    locationType: "city",
    state: "Telangana",
    district: "Hyderabad",
    publicationStatus: "published",
    allowIndexing: true,
    isServed: true,
    introduction:
      "Hyderabad apartment and villa communities regularly look for discreet balcony protection, child safety nets and mosquito-net comfort solutions.",
    localDescription:
      "Our Hyderabad coverage focuses on practical installation support for multi-storey apartments, gated communities and independent houses where balcony and window openings need safer everyday use. We serve genuine enquiries across verified Hyderabad areas with measurement-led recommendations — not claimed branch offices in every locality.",
    nearbyLocationIds: [],
    landmarkIds: ["lm-hitech-city", "lm-gachibowli", "lm-charminar-area"],
    propertyTypes: ["apartments", "villas", "independent-houses", "gated-communities", "duplexes"],
    localCharacteristics: [
      "Strong apartment and gated-community housing mix",
      "High-rise balcony openings are common",
      "Family and pet safety demand across residential corridors",
    ],
    serviceDemandNotes: [
      "Invisible grills are popular where residents want view retention",
      "Children and pet safety nets are frequent family requests",
      "Mosquito nets are commonly requested for everyday comfort",
    ],
    verifiedLocalFacts: [
      "Multi-storey apartment living is a major housing pattern in many served corridors",
      "Gated communities and high-rise apartments are common installation contexts",
    ],
    localDataVerified: true,
    contentReviewed: true,
    qualityScore: 92,
    createdAt: now,
    updatedAt: now,
  },
];

export function getPublishedLocations(): Location[] {
  return INITIAL_LOCATIONS.filter(
    (location) =>
      location.publicationStatus === "published" &&
      location.allowIndexing &&
      location.isServed,
  );
}

export function getLocationBySlug(slug: string): Location | undefined {
  return INITIAL_LOCATIONS.find((location) => location.slug === slug);
}

export function getLocationById(id: string): Location | undefined {
  return INITIAL_LOCATIONS.find((location) => location.id === id);
}
