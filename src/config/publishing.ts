export const PUBLISHING_CONFIG = {
  defaultBatchSize: 500,
  maxBatchSize: 1000,
  phases: {
    1: {
      name: "Foundation",
      pageTypes: ["home", "core", "service", "location", "service-location", "guide"],
      crawlPriorities: ["critical", "high"],
    },
    2: {
      name: "Areas and solutions",
      pageTypes: ["area", "service-area", "solution", "property-type"],
      crawlPriorities: ["high", "medium"],
    },
    3: {
      name: "Authority content",
      pageTypes: ["guide", "blog", "service-area", "solution"],
      crawlPriorities: ["medium", "low"],
    },
    4: {
      name: "Measured expansion",
      pageTypes: [
        "service",
        "location",
        "area",
        "service-location",
        "service-area",
        "solution",
        "property-type",
        "guide",
        "blog",
      ],
      crawlPriorities: ["critical", "high", "medium", "low"],
    },
  },
  requireExplicitBatchSize: true,
} as const;
