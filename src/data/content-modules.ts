import type { ContentModule } from "@/types/content";

export const CONTENT_MODULES: ContentModule[] = [
  {
    id: "service-introduction",
    title: "Service overview",
    body: [
      "This service is planned around measured openings, household use and the practical safety or comfort outcome required.",
    ],
    applicablePageTypes: ["service", "service-location", "service-area", "property-type"],
  },
  {
    id: "local-introduction",
    title: "Local service context",
    body: [
      "Local recommendations focus on verified housing patterns and practical installation conditions rather than generic city-name substitution.",
    ],
    applicablePageTypes: ["location", "area", "service-location", "service-area", "service-area-intent"],
  },
  {
    id: "pricing-factors",
    title: "Pricing factors",
    body: [
      "Pricing depends on measurements, material grade, required spacing, installation complexity, building height, site accessibility and total project quantity.",
    ],
    applicablePageTypes: [
      "service",
      "service-location",
      "service-area",
      "service-area-intent",
      "property-type",
      "core",
    ],
  },
  {
    id: "quotation-cta",
    title: "Request a quotation",
    body: [
      "Share your service need, city, area and property type for a measurement-led recommendation. No fixed prices are shown because every opening differs.",
    ],
    applicablePageTypes: [
      "service",
      "service-location",
      "service-area",
      "service-area-intent",
      "solution",
      "property-type",
      "location",
      "area",
    ],
  },
];

export const STANDARD_PRICING_STATEMENT =
  "Pricing depends on measurements, material grade, required spacing, installation complexity, building height, site accessibility and total project quantity.";
