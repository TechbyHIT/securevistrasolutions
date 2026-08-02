export type PropertyType = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  introduction: string;
  recommendations: string[];
  commonRequirements: string[];
  publicationStatus: "draft" | "review" | "published" | "noindex" | "archived";
  allowIndexing: boolean;
  contentReviewed: boolean;
  qualityScore: number;
};

export const PROPERTY_TYPES: PropertyType[] = [
  {
    id: "pt-apartments",
    slug: "apartments",
    name: "Apartments",
    summary: "Safety and comfort solutions planned for apartment balconies and windows.",
    introduction:
      "Apartment openings often need discreet protection, careful fixing methods and solutions that work with existing railings and high-rise access constraints.",
    recommendations: [
      "Invisible grills for view-sensitive balconies",
      "Balcony safety nets for practical family protection",
      "Mosquito nets for everyday ventilation comfort",
    ],
    commonRequirements: [
      "High-rise access planning",
      "Railing-compatible fixing",
      "Child or pet safety spacing",
    ],
    publicationStatus: "published",
    allowIndexing: true,
    contentReviewed: true,
    qualityScore: 88,
  },
  {
    id: "pt-villas",
    slug: "villas",
    name: "Villas",
    summary: "Villa-focused recommendations for balconies, windows and outdoor edges.",
    introduction:
      "Villa projects may involve larger openings, multiple elevations and mixed indoor-outdoor spaces that need tailored measurement and material choices.",
    recommendations: [
      "Invisible grills for selected balcony edges",
      "Children safety nets for family zones",
      "Bird spikes for ledges where roosting is an issue",
    ],
    commonRequirements: ["Multi-opening planning", "Aesthetic finish coordination"],
    publicationStatus: "published",
    allowIndexing: true,
    contentReviewed: true,
    qualityScore: 86,
  },
  {
    id: "pt-independent-houses",
    slug: "independent-houses",
    name: "Independent Houses",
    summary: "Practical safety and comfort upgrades for independent-house openings.",
    introduction:
      "Independent houses often combine window mosquito nets, balcony protection and utility improvements based on how each opening is used day to day.",
    recommendations: [
      "Mosquito nets for bedrooms and living rooms",
      "Balcony safety nets where open edges exist",
      "Cloth hangers for utility areas",
    ],
    commonRequirements: ["Opening-by-opening assessment", "Durable everyday materials"],
    publicationStatus: "published",
    allowIndexing: true,
    contentReviewed: true,
    qualityScore: 85,
  },
  {
    id: "pt-duplexes",
    slug: "duplexes",
    name: "Duplexes",
    summary: "Duplex homes may need stair, balcony and void protection for family safety.",
    introduction:
      "Duplex layouts can include stair openings and double-height voids where carefully planned safety nets complement balcony protection.",
    recommendations: [
      "Children safety nets for stair and void areas",
      "Invisible grills for balcony edges",
    ],
    commonRequirements: ["Void measurement", "Family-focused mesh selection"],
    publicationStatus: "published",
    allowIndexing: true,
    contentReviewed: true,
    qualityScore: 84,
  },
];

export function getPublishedPropertyTypes(): PropertyType[] {
  return PROPERTY_TYPES.filter(
    (item) => item.publicationStatus === "published" && item.allowIndexing,
  );
}

export function getPropertyTypeBySlug(slug: string): PropertyType | undefined {
  return PROPERTY_TYPES.find((item) => item.slug === slug);
}
