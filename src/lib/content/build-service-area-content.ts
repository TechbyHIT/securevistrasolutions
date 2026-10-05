import { BUSINESS_CONFIG } from "@/config/business";
import { getServiceSeoProfile } from "@/data/service-seo-profiles";
import type { Area } from "@/types/location";
import type { Service } from "@/types/service";
import type { ContentBlock, FaqItem } from "@/types/content";
import type { Location } from "@/types/location";

type BuildServiceAreaContentInput = {
  service: Service;
  location: Location;
  area: Area;
};

export function buildServiceAreaContentBlocks(input: BuildServiceAreaContentInput): ContentBlock[] {
  const { service, location, area } = input;
  const profile = getServiceSeoProfile(service.slug);

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
      heading: `Why choose ${BUSINESS_CONFIG.name} for ${service.shortName.toLowerCase()} in ${area.name}`,
      subSections: profile.whyChooseUs,
      paragraphs: [
        `Households in ${area.name} choose ${BUSINESS_CONFIG.name} for measurement-led recommendations, named materials and professional installation — not keyword slogans.`,
      ],
    },
    {
      id: "sa-process",
      anchorId: "process",
      heading: "Installation process",
      subSections: profile.processSteps,
      paragraphs: [
        `Installation for ${service.name.toLowerCase()} in ${area.name} starts with measurement and a written scope — not a location-swap sales script.`,
      ],
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
        `Call ${BUSINESS_CONFIG.phone.display} or WhatsApp ${BUSINESS_CONFIG.whatsapp.display} for a free measurement visit and written quotation.`,
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
