export type ExploreMoreLink = {
  label: string;
  href: string;
  /** Optional badge for high-intent / current page context */
  badge?: string;
};

export type ExploreMoreCardId =
  | "current-service"
  | "related-services"
  | "nearby-areas"
  | "nearby-cities"
  | "nearby-districts"
  | "nearby-states"
  | "popular-searches"
  | "price-guides"
  | "buying-guides"
  | "installation-guides"
  | "applications"
  | "building-types"
  | "materials"
  | "maintenance"
  | "repair"
  | "faqs"
  | "recent-projects"
  | "gallery"
  | "latest-blogs"
  | "nearby-landmarks"
  | "nearby-apartments"
  | "nearby-commercial"
  | "nearby-it-parks"
  | "related-products"
  | "customer-reviews"
  | "contact"
  | "book-inspection";

export type ExploreMoreCardVariant = "featured" | "standard" | "cta";

export type ExploreMoreCard = {
  id: ExploreMoreCardId;
  title: string;
  description: string;
  icon: ExploreMoreIconName;
  links: ExploreMoreLink[];
  viewAllHref?: string;
  viewAllLabel?: string;
  variant?: ExploreMoreCardVariant;
  /** When true, card opens by default in mobile accordion */
  defaultOpen?: boolean;
};

export type ExploreMoreIconName =
  | "service"
  | "related"
  | "map"
  | "city"
  | "district"
  | "state"
  | "search"
  | "price"
  | "guide"
  | "install"
  | "app"
  | "building"
  | "materials"
  | "maintenance"
  | "repair"
  | "faq"
  | "project"
  | "gallery"
  | "blog"
  | "landmark"
  | "apartment"
  | "commercial"
  | "itpark"
  | "product"
  | "review"
  | "contact"
  | "inspect";

export type ExploreMoreSectionData = {
  title: string;
  intro: string;
  currentPath: string;
  cards: ExploreMoreCard[];
};
