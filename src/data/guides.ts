export type Guide = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  introduction: string;
  sections: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }>;
  relatedServiceIds: string[];
  publicationStatus: "draft" | "review" | "published" | "noindex" | "archived";
  allowIndexing: boolean;
  contentReviewed: boolean;
  qualityScore: number;
  updatedAt: string;
  reviewedAt: string;
  author: string;
  reviewer: string;
};

export const GUIDES: Guide[] = [
  {
    id: "guide-material",
    slug: "invisible-grill-material-guide",
    title: "Invisible Grill Material Guide",
    excerpt:
      "Understand stainless steel cable choices, spacing considerations and durability factors before installation.",
    introduction:
      "Choosing invisible grill materials is less about brand slogans and more about tensile strength, corrosion resistance, spacing needs and the structure that will hold the system.",
    sections: [
      {
        heading: "What matters in cable selection",
        paragraphs: [
          "Cable grade, coating behaviour and tensioning quality influence both safety and appearance. Coastal or humid locations may prioritise corrosion-resistant stainless options.",
        ],
      },
      {
        heading: "Spacing and household use",
        paragraphs: [
          "Spacing should reflect whether the primary need is child safety, pet containment or general fall protection. Narrower spacing is not automatically better if installation quality is poor.",
        ],
        bullets: [
          "Child-focused openings need carefully planned gaps",
          "Pet behaviour can change the preferred mesh or cable approach",
          "Balcony geometry affects fixing points",
        ],
      },
      {
        heading: "Questions to ask before approving work",
        paragraphs: [
          "Ask for measured drawings, material clarification, fixing method details and a clear maintenance expectation. Avoid decisions based only on the lowest quoted amount.",
        ],
      },
    ],
    relatedServiceIds: ["svc-invisible-grills"],
    publicationStatus: "published",
    allowIndexing: true,
    contentReviewed: true,
    qualityScore: 92,
    updatedAt: "2026-07-31T00:00:00.000Z",
    reviewedAt: "2026-07-31T00:00:00.000Z",
    author: "Content Team",
    reviewer: "Technical Reviewer",
  },
  {
    id: "guide-balcony-safety",
    slug: "balcony-safety-net-buying-guide",
    title: "Balcony Safety Net Buying Guide",
    excerpt:
      "A practical checklist for mesh selection, fixing quality and common buying mistakes.",
    introduction:
      "Balcony safety nets are useful when mesh size, border strength and fixing method match the opening and the people or pets using the space.",
    sections: [
      {
        heading: "Mesh and durability",
        paragraphs: [
          "UV-stabilised netting and reinforced borders usually matter more than glossy product photos. Ask what happens if a section is damaged later.",
        ],
      },
      {
        heading: "Installation quality checks",
        paragraphs: [
          "Look for even tension, secure attachment points and complete coverage of the risk edge. Partial coverage can leave the most important gap unprotected.",
        ],
      },
    ],
    relatedServiceIds: ["svc-balcony-safety-nets", "svc-children-safety-nets"],
    publicationStatus: "published",
    allowIndexing: true,
    contentReviewed: true,
    qualityScore: 90,
    updatedAt: "2026-07-31T00:00:00.000Z",
    reviewedAt: "2026-07-31T00:00:00.000Z",
    author: "Content Team",
    reviewer: "Technical Reviewer",
  },
];

export function getPublishedGuides(): Guide[] {
  return GUIDES.filter((guide) => guide.publicationStatus === "published" && guide.allowIndexing);
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}
