import type { ContentBlock, FaqItem } from "@/types/content";
import type { Location } from "@/types/location";
import type { Service } from "@/types/service";

export type PremiumLandingContext = {
  service: Service;
  location: Location;
  city: string;
  citySlug: string;
  state: string;
  company: string;
  landmarks: string[];
  neighborhoods: string[];
  nearbyCities: string[];
};

export type PremiumSeoPackage = {
  seoTitle: string;
  metaTitle: string;
  metaDescription: string;
  url: string;
  slug: string;
  h1: string;
  heroIntroduction: string;
  canonical: string;
};

export type PremiumGalleryCaption = {
  src: string;
  alt: string;
  caption: string;
};

export type PremiumInternalLinkSuggestion = {
  label: string;
  href: string;
  reason: string;
};

export type PremiumLandingPageContent = {
  seo: PremiumSeoPackage;
  blocks: ContentBlock[];
  faqs: FaqItem[];
  tableOfContents: { label: string; href: string }[];
  reviews: { author: string; rating: number; text: string; location: string }[];
  galleryCaptions: PremiumGalleryCaption[];
  internalLinkSuggestions: PremiumInternalLinkSuggestion[];
  wordCount: number;
  quickHighlights: string[];
};
