export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  introduction: string;
  sections: Array<{ heading: string; paragraphs: string[] }>;
  relatedServiceIds: string[];
  relatedGuideIds: string[];
  publicationStatus: "draft" | "review" | "published" | "noindex" | "archived";
  allowIndexing: boolean;
  contentReviewed: boolean;
  qualityScore: number;
  publishedAt: string;
  updatedAt: string;
  author: string;
  reviewer: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-choose-balcony-grills",
    slug: "how-to-choose-balcony-safety-grills",
    title: "How to Choose Balcony Safety Grills",
    excerpt:
      "Compare invisible grills and conventional options using safety, appearance and maintenance factors.",
    category: "Safety Guides",
    introduction:
      "Balcony safety decisions should start with who uses the space, how the railing is built and whether the household wants a discreet or more visible barrier.",
    sections: [
      {
        heading: "Start with the risk, not the product name",
        paragraphs: [
          "A family with toddlers may prioritise gap control, while another household may care most about preserving the view. Define the outcome before comparing systems.",
        ],
      },
      {
        heading: "Compare installation practicality",
        paragraphs: [
          "Ask how the system will be fixed, how long measurement takes and what maintenance looks like after the first year. Clear process details are more useful than exaggerated promises.",
        ],
      },
      {
        heading: "Request a measurement-based quotation",
        paragraphs: [
          "Pricing depends on measurements, material grade, required spacing, installation complexity, building height, site accessibility and total project quantity.",
        ],
      },
    ],
    relatedServiceIds: ["svc-invisible-grills", "svc-balcony-safety-nets"],
    relatedGuideIds: ["guide-material", "guide-balcony-safety"],
    publicationStatus: "published",
    allowIndexing: true,
    contentReviewed: true,
    qualityScore: 88,
    publishedAt: "2026-07-20T00:00:00.000Z",
    updatedAt: "2026-07-31T00:00:00.000Z",
    author: "Content Team",
    reviewer: "Technical Reviewer",
  },
  {
    id: "blog-apartment-child-safety",
    slug: "apartment-child-safety-checklist",
    title: "Apartment Child Safety Checklist for Balconies",
    excerpt:
      "A practical checklist for parents evaluating balcony openings in apartments.",
    category: "Family Safety",
    introduction:
      "Apartment balconies can become safer with the right physical barriers, but parents still need a clear checklist covering gaps, furniture placement and supervision habits.",
    sections: [
      {
        heading: "Inspect gaps and climb points",
        paragraphs: [
          "Check railing gaps, decorative openings and furniture that can become climb points. Physical protection works best when obvious bypass paths are also addressed.",
        ],
      },
      {
        heading: "Choose protection that fits daily life",
        paragraphs: [
          "Invisible grills and children safety nets each solve different preferences around appearance and coverage. A short site visit helps match the system to the balcony.",
        ],
      },
    ],
    relatedServiceIds: ["svc-children-safety-nets", "svc-invisible-grills"],
    relatedGuideIds: ["guide-balcony-safety"],
    publicationStatus: "published",
    allowIndexing: true,
    contentReviewed: true,
    qualityScore: 87,
    publishedAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-07-31T00:00:00.000Z",
    author: "Content Team",
    reviewer: "Technical Reviewer",
  },
];

export function getPublishedPosts(): BlogPost[] {
  return BLOG_POSTS.filter(
    (post) => post.publicationStatus === "published" && post.allowIndexing,
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
