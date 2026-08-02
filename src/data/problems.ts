export type Problem = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  introduction: string;
  relatedServiceIds: string[];
  symptoms: string[];
  recommendedActions: string[];
  faqs: Array<{ question: string; answer: string }>;
  publicationStatus: "draft" | "review" | "published" | "noindex" | "archived";
  allowIndexing: boolean;
  contentReviewed: boolean;
  qualityScore: number;
};

export const PROBLEMS: Problem[] = [
  {
    id: "prob-child-balcony-safety",
    slug: "child-balcony-safety",
    name: "Child Balcony Safety",
    summary:
      "Practical ways to reduce balcony fall risk for children using nets and invisible grills.",
    introduction:
      "Parents often look for balcony protection that remains usable every day without turning the home into a closed cage. The right solution depends on railing design, spacing needs and whether a net, invisible grill or combined approach fits best.",
    relatedServiceIds: ["svc-children-safety-nets", "svc-invisible-grills", "svc-balcony-safety-nets"],
    symptoms: [
      "Low railing height relative to child reach",
      "Wide railing gaps",
      "Furniture placed near balcony edges",
    ],
    recommendedActions: [
      "Measure openings before choosing mesh or cable spacing",
      "Prioritise secure fixing over decorative appearance alone",
      "Combine supervision habits with physical protection",
    ],
    faqs: [
      {
        question: "Are children safety nets enough on high-rise balconies?",
        answer:
          "Children safety nets are a practical protective layer when correctly installed, but they work best as part of a broader safety approach that includes supervision and suitable spacing.",
      },
      {
        question: "When should families choose invisible grills instead of nets?",
        answer:
          "Invisible grills are often preferred when households want stronger view retention and a more permanent cable-based barrier. A site assessment helps compare both options.",
      },
    ],
    publicationStatus: "published",
    allowIndexing: true,
    contentReviewed: true,
    qualityScore: 90,
  },
  {
    id: "prob-pet-balcony-escape",
    slug: "pet-balcony-escape",
    name: "Pet Balcony Escape Prevention",
    summary: "Reduce the chance of pets slipping through balcony openings.",
    introduction:
      "Cats and smaller dogs can slip through railing gaps or push against weak barriers. Pet safety nets help close those gaps when mesh and fixing methods match the animal’s size and behaviour.",
    relatedServiceIds: ["svc-pet-safety-nets", "svc-balcony-safety-nets"],
    symptoms: ["Pets climbing railings", "Gaps wide enough for a pet to pass"],
    recommendedActions: [
      "Choose mesh suitable for the pet size",
      "Cover the full risk edge, not only part of the balcony",
      "Inspect for chewing or claw damage regularly",
    ],
    faqs: [
      {
        question: "Can one net work for both children and pets?",
        answer:
          "Sometimes a carefully chosen mesh can serve both needs, but the safer approach is to select spacing and coverage based on the highest-risk user in the home.",
      },
    ],
    publicationStatus: "published",
    allowIndexing: true,
    contentReviewed: true,
    qualityScore: 86,
  },
  {
    id: "prob-mosquito-nuisance",
    slug: "mosquito-nuisance",
    name: "Mosquito Nuisance at Home",
    summary: "Improve comfort by reducing mosquito entry through windows and doors.",
    introduction:
      "Households in humid climates often need window and door mosquito nets so rooms can stay ventilated without constant insect disturbance.",
    relatedServiceIds: ["svc-mosquito-nets"],
    symptoms: ["Mosquitoes entering through open windows", "Poor sleep due to insect bites"],
    recommendedActions: [
      "Identify the most-used openings first",
      "Choose fixed, sliding or magnetic systems based on window type",
      "Maintain mesh so tears do not reopen insect paths",
    ],
    faqs: [
      {
        question: "Which mosquito net style suits sliding windows?",
        answer:
          "Sliding or framed systems are often practical for sliding windows, but the final choice depends on frame depth, usage pattern and maintenance preference.",
      },
    ],
    publicationStatus: "published",
    allowIndexing: true,
    contentReviewed: true,
    qualityScore: 84,
  },
];

export function getPublishedProblems(): Problem[] {
  return PROBLEMS.filter(
    (problem) => problem.publicationStatus === "published" && problem.allowIndexing,
  );
}

export function getProblemBySlug(slug: string): Problem | undefined {
  return PROBLEMS.find((problem) => problem.slug === slug);
}
