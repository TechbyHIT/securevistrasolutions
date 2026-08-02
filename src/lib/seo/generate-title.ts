import { BUSINESS_CONFIG } from "@/config/business";
import { truncate } from "@/lib/utils";
import { SEO_CONFIG } from "@/config/seo";

type TitleInput = {
  pageType: string;
  serviceName?: string;
  locationName?: string;
  areaName?: string;
  propertyTypeName?: string;
  problemName?: string;
  guideTitle?: string;
  blogTitle?: string;
  patternIndex?: number;
  intentLabel?: string;
};

export function generateTitle(input: TitleInput): string {
  const brand = BUSINESS_CONFIG.name;
  const patterns: string[] = [];

  switch (input.pageType) {
    case "service":
      patterns.push(
        `${input.serviceName} Installation`,
        `${input.serviceName} for Homes`,
        `Professional ${input.serviceName}`,
      );
      break;
    case "location":
      patterns.push(
        `Home Safety Solutions in ${input.locationName}`,
        `${input.locationName} Service Coverage`,
      );
      break;
    case "area":
      patterns.push(
        `Home Safety in ${input.areaName}, ${input.locationName}`,
        `${input.areaName} Installation Support`,
      );
      break;
    case "service-in-city":
    case "service-location":
      patterns.push(
        `${input.serviceName} in ${input.locationName}`,
        `${input.locationName} ${input.serviceName} Installation`,
        `Get ${input.serviceName} in ${input.locationName}`,
      );
      break;
    case "service-area":
      patterns.push(
        `${input.serviceName} in ${input.areaName}`,
        `${input.areaName} ${input.serviceName} Service`,
        `${input.serviceName} near ${input.areaName}, ${input.locationName}`,
      );
      break;
    case "service-area-intent":
      patterns.push(
        `${input.intentLabel} in ${input.areaName}`,
        `${input.areaName} ${input.intentLabel}`,
        `${input.intentLabel} near ${input.areaName}, ${input.locationName}`,
      );
      break;
    case "solution":
      patterns.push(
        `${input.problemName} Solutions`,
        `How to Handle ${input.problemName}`,
      );
      break;
    case "property-type":
      patterns.push(
        `${input.serviceName} for ${input.propertyTypeName}`,
        `${input.propertyTypeName} ${input.serviceName} Guide`,
      );
      break;
    case "guide":
      patterns.push(input.guideTitle ?? "Guide");
      break;
    case "blog":
      patterns.push(input.blogTitle ?? "Article");
      break;
    default:
      patterns.push(brand);
  }

  const index = (input.patternIndex ?? 0) % patterns.length;
  const base = patterns[index] ?? brand;
  const suffix = ` | ${brand}`;
  const maxBaseLength = Math.max(SEO_CONFIG.titleMaxLength - suffix.length, 20);
  return `${truncate(base, maxBaseLength)}${suffix}`;
}
