export type ContentModuleId =
  | "service-introduction"
  | "local-introduction"
  | "customer-problem"
  | "service-explanation"
  | "suitable-applications"
  | "property-recommendations"
  | "benefits"
  | "features"
  | "materials"
  | "technical-specifications"
  | "installation-process"
  | "measurement-process"
  | "safety-checks"
  | "quality-checks"
  | "maintenance-guidance"
  | "durability-factors"
  | "weather-considerations"
  | "pricing-factors"
  | "common-mistakes"
  | "contractor-selection"
  | "local-service-coverage"
  | "nearby-areas"
  | "related-services"
  | "related-guides"
  | "faqs"
  | "quotation-cta";

export type ContentModule = {
  id: ContentModuleId;
  title: string;
  body: string[];
  applicablePageTypes: string[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type ContentBlock = {
  id: string;
  anchorId?: string;
  heading: string;
  paragraphs: string[];
  listItems?: string[];
  highlight?: string;
  tableRows?: { label: string; value: string; note?: string }[];
  subSections?: { title: string; description: string; href?: string }[];
};
