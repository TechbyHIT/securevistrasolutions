import type { ContentBlock, FaqItem } from "@/types/content";
import type { Location } from "@/types/location";
import type { Service } from "@/types/service";
import {
  buildPremiumServiceInCityContentBlocks,
  buildPremiumServiceInCityFaqs,
  buildPremiumServiceInCityLanding,
  getPremiumServiceInCityReviews,
} from "@/lib/content/build-premium-service-in-city-content";

type BuildServiceInCityContentInput = {
  service: Service;
  location: Location;
};

export function buildServiceInCityContentBlocks(input: BuildServiceInCityContentInput): ContentBlock[] {
  return buildPremiumServiceInCityContentBlocks(input.service, input.location);
}

export function buildServiceInCityFaqs(input: BuildServiceInCityContentInput): FaqItem[] {
  return buildPremiumServiceInCityFaqs(input.service, input.location);
}

export function buildServiceInCityTableOfContents(blocks: ContentBlock[]) {
  return blocks
    .filter((block) => block.anchorId)
    .map((block) => ({ label: block.heading, href: `#${block.anchorId}` }));
}

export function getServiceInCityReviews(input: BuildServiceInCityContentInput) {
  return getPremiumServiceInCityReviews(input.service, input.location);
}

export function buildServiceInCityPremiumLanding(input: BuildServiceInCityContentInput) {
  return buildPremiumServiceInCityLanding(input.service, input.location);
}

export function countServiceInCityWords(input: BuildServiceInCityContentInput): number {
  return buildPremiumServiceInCityLanding(input.service, input.location).wordCount;
}
