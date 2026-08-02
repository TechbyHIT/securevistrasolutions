import { BUSINESS_CONFIG } from "@/config/business";
import { getServiceSeoProfile } from "@/data/service-seo-profiles";
import { getAreaById } from "@/data/initial-areas";
import type { Area } from "@/types/location";
import type { Service } from "@/types/service";
import type { ContentBlock, FaqItem } from "@/types/content";
import type { Location } from "@/types/location";

type BuildServiceAreaContentInput = {
  service: Service;
  location: Location;
  area: Area;
};

function nearbyAreaNames(area: Area): string[] {
  return area.nearbyLocationIds
    .map((id) => getAreaById(id)?.name)
    .filter((name): name is string => Boolean(name))
    .slice(0, 4);
}

export function buildServiceAreaContentBlocks(input: BuildServiceAreaContentInput): ContentBlock[] {
  const { service, location, area } = input;
  const profile = getServiceSeoProfile(service.slug);
  const nearby = nearbyAreaNames(area);

  return [
    {
      id: "sa-overview",
      anchorId: "about",
      heading: `${service.name} in ${area.name}, ${location.name}`,
      paragraphs: [
        `Professional ${service.name.toLowerCase()} installation in ${area.name}, ${location.name}. ${profile.problemStatement}`,
        `${service.detailedDescription} ${area.localDescription}`,
      ],
    },
    {
      id: "sa-sub-services",
      anchorId: "services",
      heading: `${service.shortName} solutions we provide in ${area.name}`,
      paragraphs: [
        `Comprehensive ${service.name.toLowerCase()} options for apartments, villas and independent homes in ${area.name}.`,
      ],
      subSections: profile.subServices,
    },
    {
      id: "sa-materials",
      anchorId: "materials",
      heading: "Materials used",
      subSections: profile.materials.map((material) => ({
        title: material.name,
        description: material.description,
      })),
      paragraphs: [profile.climateNote],
    },
    {
      id: "sa-pricing",
      anchorId: "pricing",
      heading: `${service.shortName} cost in ${area.name}`,
      paragraphs: [profile.priceDisclaimer],
      tableRows: profile.priceRanges.map((row) => ({
        label: row.label,
        value: row.range,
        note: row.bestFor,
      })),
      highlight: profile.priceRanges[0]?.range,
    },
    {
      id: "sa-why-us",
      anchorId: "why-us",
      heading: `Best ${service.shortName.toLowerCase()} in ${area.name}`,
      subSections: profile.whyChooseUs,
      paragraphs: [
        `Homeowners searching for the best ${service.name.toLowerCase()} in ${area.name} choose ${BUSINESS_CONFIG.name} for transparent quotes, quality materials and professional installation.`,
      ],
    },
    {
      id: "sa-near-me",
      anchorId: "near-me",
      heading: `${service.shortName} near me in ${area.name}`,
      paragraphs: [
        `Looking for ${service.name.toLowerCase()} near me in ${area.name}? We schedule free site visits across ${location.name}.`,
        nearby.length > 0
          ? `Nearby areas served: ${nearby.join(", ")}.`
          : `We cover ${area.name} and surrounding Hyderabad residential localities.`,
      ],
    },
    {
      id: "sa-process",
      anchorId: "process",
      heading: "Installation process",
      subSections: profile.processSteps,
      paragraphs: [],
    },
    {
      id: "sa-benefits",
      anchorId: "benefits",
      heading: "Key benefits",
      listItems: service.benefits,
      paragraphs: [service.summary],
    },
    {
      id: "sa-quote",
      anchorId: "quote",
      heading: `Free site inspection in ${area.name}`,
      paragraphs: [
        `Call ${BUSINESS_CONFIG.phone.display} or WhatsApp ${BUSINESS_CONFIG.whatsapp.display} for a free quote. Warranty up to ${profile.warrantyYears} on selected materials.`,
      ],
    },
  ];
}

export function buildServiceAreaFaqs(input: BuildServiceAreaContentInput): FaqItem[] {
  const { service, area, location } = input;
  const profile = getServiceSeoProfile(service.slug);

  return [
    {
      question: `Do you install ${service.name.toLowerCase()} in ${area.name}?`,
      answer: `Yes. We provide ${service.name.toLowerCase()} in ${area.name}, ${location.name} with free site inspection and written quotation.`,
    },
    {
      question: `What is the cost of ${service.name.toLowerCase()} in ${area.name}?`,
      answer: `Indicative pricing starts around ${profile.priceRanges[0]?.range ?? "a custom quote"}. ${profile.priceDisclaimer}`,
    },
    {
      question: `How soon can you visit ${area.name} for inspection?`,
      answer: `We typically schedule site visits within 24–48 hours depending on workload. Call ${BUSINESS_CONFIG.phone.display} to confirm availability.`,
    },
    ...service.customerQuestions.slice(0, 4).map((question) => ({
      question,
      answer: `Contact ${BUSINESS_CONFIG.name} for a measurement-led recommendation in ${area.name}.`,
    })),
  ];
}
