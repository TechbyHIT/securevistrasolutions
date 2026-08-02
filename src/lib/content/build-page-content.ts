import { BUSINESS_CONFIG } from "@/config/business";
import { CONTENT_MODULES } from "@/data/content-modules";
import {
  buildIntentContentBlocks,
  buildIntentFaqs,
  buildIntentTableOfContents,
} from "@/lib/content/build-intent-content";
import {
  buildServiceInCityPremiumLanding,
  getServiceInCityReviews,
} from "@/lib/content/build-service-in-city-content";
import {
  buildServiceAreaContentBlocks,
  buildServiceAreaFaqs,
} from "@/lib/content/build-service-area-content";
import {
  formatIntentPhrase,
  getKeywordIntentBySlug,
} from "@/data/keyword-intents";
import { getServiceSeoProfile } from "@/data/service-seo-profiles";
import { mergeLongformIntoPageContent } from "@/lib/content/build-ultra-longform-seo";
import type { Area } from "@/types/location";
import type { Service } from "@/types/service";
import type { ContentBlock, FaqItem } from "@/types/content";
import type { Location } from "@/types/location";

type BuildPageContentInput = {
  pageType: string;
  service?: Service;
  location?: Location;
  area?: Area;
  intentSlug?: string;
  h1?: string;
};

export type BuildPageContentResult = {
  blocks: ContentBlock[];
  faqs: FaqItem[];
  tableOfContents: { label: string; href: string }[];
  priceHighlight?: string;
  warrantyYears?: string;
  reviews?: ReturnType<typeof getServiceInCityReviews>;
  galleryCaptions?: { src: string; alt: string; caption: string }[];
  internalLinkSuggestions?: { label: string; href: string; reason: string }[];
  wordCount?: number;
};

function interpolate(text: string, ctx: BuildPageContentInput): string {
  let result = text;
  if (ctx.service) {
    result = result.replace(/this service/gi, ctx.service.name);
  }
  if (ctx.location) {
    result = result.replace(/local/gi, ctx.location.name);
  }
  if (ctx.area) {
    result = result.replace(/nearby areas/gi, `areas near ${ctx.area.name}`);
  }
  return result;
}

function withLongform(
  base: BuildPageContentResult,
  input: BuildPageContentInput,
): BuildPageContentResult {
  const topic =
    input.service?.name ??
    input.h1 ??
    (input.pageType === "home" ? "home safety solutions" : "home safety installation");
  const placeName = input.area?.name ?? input.location?.name ?? "Hyderabad";
  const cityName = input.location?.name ?? "Hyderabad";

  const merged = mergeLongformIntoPageContent(
    {
      blocks: base.blocks,
      faqs: base.faqs,
      tableOfContents: base.tableOfContents,
    },
    {
      topic,
      placeName,
      cityName,
      company: BUSINESS_CONFIG.name,
      serviceSlug: input.service?.slug,
      areaSlug: input.area?.slug,
      pageType: input.pageType,
    },
  );

  return {
    ...base,
    blocks: merged.blocks,
    faqs: merged.faqs,
    tableOfContents: merged.tableOfContents,
    wordCount: merged.wordCount,
  };
}

export function buildPageContent(input: BuildPageContentInput): BuildPageContentResult {
  if (
    input.pageType === "service-area-intent" &&
    input.service &&
    input.location &&
    input.area &&
    input.intentSlug
  ) {
    const intent = getKeywordIntentBySlug(input.intentSlug);
    if (intent) {
      const intentPhrase = formatIntentPhrase(intent, input.area.name);
      const intentInput = {
        intent,
        service: input.service,
        location: input.location,
        area: input.area,
        intentPhrase,
      };
      const blocks = buildIntentContentBlocks(intentInput);
      const faqs = buildIntentFaqs(intentInput);
      const pricingBlock = blocks.find((block) => block.id === "intent-pricing");
      return withLongform(
        {
          blocks,
          faqs,
          tableOfContents: buildIntentTableOfContents(blocks),
          priceHighlight: pricingBlock?.highlight ?? pricingBlock?.tableRows?.[0]?.value,
        },
        input,
      );
    }
  }

  if (input.pageType === "service-in-city" && input.service && input.location) {
    const sicInput = { service: input.service, location: input.location };
    const landing = buildServiceInCityPremiumLanding(sicInput);
    const pricingBlock = landing.blocks.find((block) => block.id === "sic-pricing");
    const profile = getServiceSeoProfile(input.service.slug);
    return withLongform(
      {
        blocks: landing.blocks,
        faqs: landing.faqs,
        tableOfContents: landing.tableOfContents,
        priceHighlight: pricingBlock?.highlight,
        warrantyYears: profile.warrantyYears,
        reviews: landing.reviews,
        galleryCaptions: landing.galleryCaptions,
        internalLinkSuggestions: landing.internalLinkSuggestions,
        wordCount: landing.wordCount,
      },
      input,
    );
  }

  if (
    input.pageType === "service-area" &&
    input.service &&
    input.location &&
    input.area
  ) {
    const saInput = {
      service: input.service,
      location: input.location,
      area: input.area,
    };
    const blocks = buildServiceAreaContentBlocks(saInput);
    const faqs = buildServiceAreaFaqs(saInput);
    const pricingBlock = blocks.find((block) => block.id === "sa-pricing");
    return withLongform(
      {
        blocks,
        faqs,
        tableOfContents: blocks
          .filter((block) => block.anchorId)
          .map((block) => ({ label: block.heading, href: `#${block.anchorId}` })),
        priceHighlight: pricingBlock?.highlight,
      },
      input,
    );
  }

  const applicableModules = CONTENT_MODULES.filter((mod) =>
    mod.applicablePageTypes.includes(input.pageType),
  );

  const blocks: ContentBlock[] = applicableModules.map((mod) => ({
    id: mod.id,
    heading: mod.title,
    paragraphs: mod.body.map((p) => interpolate(p, input)),
  }));

  if (input.service) {
    blocks.push({
      id: "service-benefits",
      heading: "Key benefits",
      paragraphs: [input.service.summary],
      listItems: input.service.benefits,
    });

    blocks.push({
      id: "service-features",
      heading: "Features",
      paragraphs: [],
      listItems: input.service.features,
    });
  }

  if (input.location) {
    blocks.push({
      id: "location-context",
      heading: `Serving ${input.location.name}`,
      paragraphs: [input.location.localDescription],
      listItems: input.location.localCharacteristics,
    });
  }

  if (input.area) {
    blocks.push({
      id: "area-context",
      heading: `${input.area.name} coverage`,
      paragraphs: [input.area.introduction],
      listItems: input.area.propertyTypes,
    });
  }

  const faqs: FaqItem[] = [];

  if (input.service) {
    for (const question of input.service.customerQuestions.slice(0, 5)) {
      faqs.push({
        question,
        answer: `${input.service.name} recommendations depend on measurements, property type and local installation conditions in Hyderabad. Contact us for a site-specific assessment.`,
      });
    }
  }

  if (input.location) {
    faqs.push({
      question: `Do you serve all areas in ${input.location.name}?`,
      answer: `We serve verified residential areas across ${input.location.name} with measurement-led recommendations. Share your area and property type for confirmation.`,
    });
  }

  return withLongform({ blocks, faqs, tableOfContents: [] }, input);
}
