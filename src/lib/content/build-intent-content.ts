import { BUSINESS_CONFIG } from "@/config/business";
import { getServiceSeoProfile } from "@/data/service-seo-profiles";
import type { KeywordIntent } from "@/data/keyword-intents";
import type { Area } from "@/types/location";
import type { Service } from "@/types/service";
import type { ContentBlock, FaqItem } from "@/types/content";
import type { Location } from "@/types/location";
import { getAreaById } from "@/data/initial-areas";

export type BuildIntentContentInput = {
  intent: KeywordIntent;
  service: Service;
  location: Location;
  area: Area;
  intentPhrase: string;
};

function hasTag(intent: KeywordIntent, tag: string): boolean {
  return intent.tags?.includes(tag) ?? false;
}

function nearbyAreaNames(area: Area): string[] {
  return area.nearbyLocationIds
    .map((id) => getAreaById(id)?.name)
    .filter((name): name is string => Boolean(name))
    .slice(0, 4);
}

export function buildIntentContentBlocks(input: BuildIntentContentInput): ContentBlock[] {
  const { intent, service, location, area, intentPhrase } = input;
  const profile = getServiceSeoProfile(service.slug);
  const nearby = nearbyAreaNames(area);
  const blocks: ContentBlock[] = [];

  blocks.push({
    id: "intent-overview",
    anchorId: "about",
    heading: `Professional ${intent.label} in ${area.name}, ${location.name}`,
    paragraphs: [
      `${intentPhrase.charAt(0).toUpperCase() + intentPhrase.slice(1)}. ${profile.problemStatement}`,
      `${BUSINESS_CONFIG.name} provides ${service.name.toLowerCase()} for ${profile.headlineSuffix} in ${area.name} and across ${location.name}. ${service.detailedDescription}`,
      `${area.localDescription} ${profile.climateNote}`,
    ],
  });

  blocks.push({
    id: "intent-sub-services",
    anchorId: "services",
    heading: `Our ${service.shortName} services in ${area.name}`,
    paragraphs: [
      `Residents searching for ${intent.label.toLowerCase()} in ${area.name} often need more than a generic product listing. We plan installations around property type, opening measurements and how the space is used every day.`,
    ],
    subSections: profile.subServices.slice(0, 6),
  });

  blocks.push({
    id: "intent-applications",
    anchorId: "applications",
    heading: `Where ${service.shortName.toLowerCase()} is used in ${area.name}`,
    paragraphs: [
      `${area.name} includes ${area.propertyTypes.join(", ")} and similar housing types. These are the most common applications we handle locally:`,
    ],
    listItems: service.applications,
  });

  blocks.push({
    id: "intent-benefits",
    anchorId: "benefits",
    heading: `Benefits of ${service.shortName.toLowerCase()} in ${area.name}`,
    paragraphs: [
      `The right installation should improve safety or comfort without creating unnecessary maintenance burden. Key benefits for ${area.name} homes include:`,
    ],
    listItems: service.benefits,
  });

  blocks.push({
    id: "intent-materials",
    anchorId: "materials",
    heading: "Materials we use",
    paragraphs: [
      `We recommend materials based on exposure, household use and budget. Premium options are selected for Hyderabad's climate and long-term durability.`,
    ],
    subSections: profile.materials.map((material) => ({
      title: material.name,
      description: material.description,
    })),
    listItems: profile.trustedBrands.map((brand) => `${brand} — verified supplier-grade materials`),
  });

  blocks.push({
    id: "intent-pricing",
    anchorId: "pricing",
    heading: `${intent.label} cost in ${area.name} — transparent price guidance`,
    paragraphs: [
      `Looking for ${intent.label.toLowerCase()} price or cost details in ${area.name}? Below are indicative Hyderabad ranges. Final quotation is shared after free site measurement.`,
      profile.priceDisclaimer,
    ],
    tableRows: profile.priceRanges.map((row) => ({
      label: row.label,
      value: row.range,
      note: row.bestFor,
    })),
    highlight: hasTag(intent, "pricing")
      ? `Approx. range in ${area.name}: ${profile.priceRanges[0]?.range ?? "Quote after inspection"}`
      : undefined,
  });

  blocks.push({
    id: "intent-why-us",
    anchorId: "why-us",
    heading: `Why choose ${BUSINESS_CONFIG.name} for ${intent.label.toLowerCase()} in ${area.name}?`,
    paragraphs: [
      `Searching for the best ${intent.label.toLowerCase()} near ${area.name}? Here is why homeowners and apartment communities across ${location.name} contact ${BUSINESS_CONFIG.name}:`,
    ],
    subSections: profile.whyChooseUs,
  });

  blocks.push({
    id: "intent-near-me",
    anchorId: "near-me",
    heading: `${intent.label} near me in ${area.name}`,
    paragraphs: [
      `Need ${intent.label.toLowerCase()} near me in ${area.name}? Our local team supports site visits, measurements and installation scheduling across ${location.name}.`,
      nearby.length > 0
        ? `We also serve nearby localities including ${nearby.join(", ")} from the same service route.`
        : `We serve ${area.name} and surrounding Hyderabad residential localities with scheduled site inspections.`,
      `Call ${BUSINESS_CONFIG.phone.display} or WhatsApp ${BUSINESS_CONFIG.whatsapp.display} to book a free inspection in ${area.name}.`,
    ],
    listItems: area.serviceDemandNotes.length > 0 ? area.serviceDemandNotes : area.localCharacteristics,
  });

  blocks.push({
    id: "intent-installation",
    anchorId: "process",
    heading: `Our installation process in ${area.name}`,
    paragraphs: [
      `Professional installation in ${area.name} follows a simple step-by-step process so fixing quality, spacing and finish meet your expectations.`,
    ],
    subSections: profile.processSteps,
    listItems: service.installationSteps,
  });

  if (hasTag(intent, "safety")) {
    blocks.push({
      id: "intent-safety",
      anchorId: "safety",
      heading: "Safety considerations",
      paragraphs: [
        `Safety outcomes depend on correct spacing, tension, fixing strength and periodic inspection. We plan around child, pet and fall-protection needs common in ${area.name} households.`,
      ],
      listItems: service.safetyInformation,
    });
  }

  if (hasTag(intent, "design")) {
    blocks.push({
      id: "intent-design",
      anchorId: "design",
      heading: "Design and finish options",
      paragraphs: [
        `Design choices should balance safety, ventilation, light and everyday usability. We plan layouts that suit balcony railings, window frames and terrace edges in ${area.name}.`,
      ],
      listItems: service.features,
    });
  }

  blocks.push({
    id: "intent-local-context",
    anchorId: "local",
    heading: `${area.name} local service coverage`,
    paragraphs: [
      area.introduction,
      area.localDescription,
      ...area.verifiedLocalFacts.slice(0, 2),
    ],
    listItems: area.propertyTypes.slice(0, 5),
  });

  blocks.push({
    id: "intent-maintenance",
    anchorId: "maintenance",
    heading: "Maintenance and warranty",
    paragraphs: [
      `Routine maintenance helps ${service.shortName.toLowerCase()} perform reliably through seasonal weather changes in ${location.name}. Warranty coverage up to ${profile.warrantyYears} may apply depending on material grade and scope.`,
    ],
    listItems: service.maintenanceTips,
  });

  blocks.push({
    id: "intent-cta",
    anchorId: "quote",
    heading: `Get free site inspection in ${area.name}`,
    paragraphs: [
      `Share your ${intent.label.toLowerCase()} requirement, property type and preferred visit time. Our ${area.name} team will contact you with measurement-led recommendations and a written quotation — no advance payment required for inspection.`,
      `Phone: ${BUSINESS_CONFIG.phone.display} · WhatsApp: ${BUSINESS_CONFIG.whatsapp.display} · Email: ${BUSINESS_CONFIG.email}`,
    ],
  });

  return blocks;
}

export function buildIntentFaqs(input: BuildIntentContentInput): FaqItem[] {
  const { intent, service, area, location } = input;
  const profile = getServiceSeoProfile(service.slug);
  const faqs: FaqItem[] = [];

  faqs.push({
    question: `Do you provide ${intent.label.toLowerCase()} in ${area.name}?`,
    answer: `Yes. ${BUSINESS_CONFIG.name} serves ${area.name} and surrounding localities in ${location.name} with free site inspection, measurements and professional installation for ${service.name.toLowerCase()}.`,
  });

  faqs.push({
    question: `What is the ${intent.label.toLowerCase()} price in ${area.name}?`,
    answer: `Indicative ranges start around ${profile.priceRanges[0]?.range ?? "a site-specific quote"}. Final cost depends on measurements, material grade, fixing complexity and building height. We share a written quote after free inspection.`,
  });

  faqs.push({
    question: `How long does ${service.shortName.toLowerCase()} installation take in ${area.name}?`,
    answer: `Many apartment projects in ${area.name} can be completed in a single visit once measurements and materials are confirmed. Larger or multi-opening projects may need additional time.`,
  });

  faqs.push({
    question: `Do you offer warranty on ${service.shortName.toLowerCase()} in Hyderabad?`,
    answer: `Warranty coverage up to ${profile.warrantyYears} may apply depending on material selection and installation scope. Warranty terms are shared in your quotation.`,
  });

  if (hasTag(intent, "pricing")) {
    faqs.push({
      question: `What affects ${intent.label.toLowerCase()} cost in ${area.name}?`,
      answer: `Cost depends on opening size, mesh or cable grade, number of sides, floor height, access conditions and total quantity. ${profile.priceDisclaimer}`,
    });
  }

  for (const question of service.customerQuestions.slice(0, 4)) {
    faqs.push({
      question,
      answer: `${service.name} recommendations in ${area.name} depend on your opening measurements, property type and intended use. Contact ${BUSINESS_CONFIG.name} at ${BUSINESS_CONFIG.phone.display} for a local assessment.`,
    });
  }

  faqs.push({
    question: `How do I book a free site visit in ${area.name}?`,
    answer: `Call ${BUSINESS_CONFIG.phone.display}, WhatsApp ${BUSINESS_CONFIG.whatsapp.display}, or submit the contact form with your area and service need. Our team typically responds within the same business day.`,
  });

  return faqs;
}

export function buildIntentTableOfContents(blocks: ContentBlock[]): { label: string; href: string }[] {
  return blocks
    .filter((block) => block.anchorId)
    .map((block) => ({
      label: block.heading,
      href: `#${block.anchorId}`,
    }));
}
