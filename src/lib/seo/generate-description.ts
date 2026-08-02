import { truncate } from "@/lib/utils";
import { SEO_CONFIG } from "@/config/seo";
import { STANDARD_PRICING_STATEMENT } from "@/data/content-modules";

type DescriptionInput = {
  pageType: string;
  serviceName?: string;
  locationName?: string;
  areaName?: string;
  summary?: string;
  propertyTypeName?: string;
  problemName?: string;
  intentLabel?: string;
  intentPhrase?: string;
};

export function generateDescription(input: DescriptionInput): string {
  let description = "";

  switch (input.pageType) {
    case "service":
      description = `${input.summary ?? `${input.serviceName} installation support.`} Request a measurement-led quotation with clear material and safety guidance.`;
      break;
    case "location":
      description = `Explore served home safety services in ${input.locationName}. Honest coverage wording, practical recommendations and quotation support.`;
      break;
    case "area":
      description = `${input.serviceName ? `${input.serviceName} and related` : "Home safety"} support in ${input.areaName}, ${input.locationName}. Local recommendations based on verified service coverage.`;
      break;
    case "service-in-city":
    case "service-location":
      description = `${input.serviceName} in ${input.locationName} with free site inspection, premium materials and expert installation. ${STANDARD_PRICING_STATEMENT}`;
      break;
    case "service-area":
      description = `${input.serviceName} in ${input.areaName}, ${input.locationName}. Area-specific guidance, nearby locality links and quotation support.`;
      break;
    case "service-area-intent":
      description = `${input.intentPhrase ?? `${input.intentLabel} in ${input.areaName}`}. ${input.serviceName} with local measurement support in ${input.areaName}, ${input.locationName}. ${STANDARD_PRICING_STATEMENT}`;
      break;
    case "solution":
      description = `Practical guidance for ${input.problemName}. Compare suitable services and request a site-based recommendation.`;
      break;
    case "property-type":
      description = `${input.serviceName} recommendations for ${input.propertyTypeName}. Learn suitable applications, materials and installation considerations.`;
      break;
    default:
      description = input.summary ?? "Professional home safety and comfort installation support.";
  }

  return truncate(description, SEO_CONFIG.descriptionMaxLength);
}
