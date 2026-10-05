/**
 * Technical long-form SEO content from the service knowledge base.
 * Modules are selected by content-matrix angle so pages differ by INFORMATION, not city-name swaps.
 * NO area-directory filler, NO nearby-area FAQ padding, NO invented specs.
 */
import { BUSINESS_CONFIG } from "@/config/business";
import { getServiceKnowledge, type ServiceKnowledge } from "@/data/service-knowledge-base";
import {
  assignContentAngle,
  describeAngle,
  type ContentAngle,
} from "@/lib/content/content-matrix";
import { buildServiceInCityPath } from "@/lib/utils/service-in-city-slug";
import { DEFAULT_LOCATION_SLUG } from "@/config/mega-menu";
import { getPublishedServices } from "@/data/initial-services";
import type { ContentBlock, FaqItem } from "@/types/content";

/** Useful depth without artificial 20k padding. */
export const ULTRA_LONGFORM_WORD_TARGET = 2_500;

export type LongformContext = {
  topic: string;
  placeName: string;
  cityName?: string;
  company?: string;
  serviceSlug?: string;
  areaSlug?: string;
  pageType?: string;
};

function wordsIn(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function countBlockWords(blocks: ContentBlock[], faqs: FaqItem[]): number {
  let total = 0;
  for (const block of blocks) {
    total += wordsIn(block.heading);
    for (const p of block.paragraphs) total += wordsIn(p);
    for (const item of block.listItems ?? []) total += wordsIn(item);
    for (const sub of block.subSections ?? []) {
      total += wordsIn(sub.title) + wordsIn(sub.description);
    }
  }
  for (const faq of faqs) {
    total += wordsIn(faq.question) + wordsIn(faq.answer);
  }
  return total;
}

function expandList(items: string[], lead: string): string[] {
  return items.map(
    (item, index) =>
      `${lead} ${item}${index % 2 === 0 ? " Confirm this during the free site assessment before approving materials." : " Document it in the written quotation so install-day scope stays clear."}`,
  );
}

function modulesForAngle(angle: ContentAngle): string[] {
  const core = ["overview", "fundamentals", "process", "local"];
  const byAngle: Record<string, string[]> = {
    "balcony-planning": ["materials", "applications", "safety", "selection", "mistakes"],
    "window-safety": ["materials", "applications", "design", "maintenance", "selection"],
    "child-risk": ["safety", "applications", "process", "mistakes", "faq-focus"],
    "pet-risk": ["applications", "materials", "maintenance", "safety", "mistakes"],
    "villa-terrace": ["process", "applications", "selection", "materials", "comparison"],
    "materials-selection": ["materials", "comparison", "selection", "maintenance", "mistakes"],
    "maintenance-repair": ["maintenance", "troubleshooting", "safety", "selection", "mistakes"],
  "high-rise-access": ["process", "applications", "selection", "safety", "mistakes"],
  "independent-house": ["applications", "process", "materials", "selection", "comparison"],
  "quotation-scope": ["selection", "mistakes", "process", "materials", "faq-focus"],
  "ventilation-view": ["design", "materials", "applications", "comparison", "maintenance"],
};
  return [...core, ...(byAngle[angle.id] ?? ["materials", "safety", "selection", "mistakes"])];
}

function buildAngleFaqs(
  serviceName: string,
  place: string,
  company: string,
  kb: ServiceKnowledge | undefined,
  angle: ContentAngle,
): FaqItem[] {
  const baseQs = kb?.customerQuestions ?? [
    `How is ${serviceName} planned?`,
    `What affects ${serviceName} quotation?`,
    `What should I prepare for a site visit?`,
  ];

  const faqs: FaqItem[] = [
    {
      question: baseQs[0] ?? `How does ${company} plan ${serviceName}?`,
      answer: `Planning starts with openings, structure and household use. For this page the focus is ${angle.technicalAngle}. ${company} confirms details on site in ${place} before a written quotation.`,
    },
    {
      question: `What matters most for ${angle.application}?`,
      answer: `Prioritise ${angle.installationAngle}. Photos help for triage, but final recommendations for ${place} still need measurement and fixing-point checks.`,
    },
    {
      question: `How should I think about ${angle.maintenanceAngle}?`,
      answer: `Keep a simple seasonal checklist: look for loose fittings, visible damage and alignment changes. Address impact damage promptly rather than waiting for a larger repair.`,
    },
    {
      question: `Is ${serviceName} completely risk-free?`,
      answer: `No responsible installer should claim that. Correct specification reduces risk for ${angle.application}, but households should keep realistic safety routines and supervision where children use openings.`,
    },
    {
      question: `What should a written quotation include?`,
      answer: `Named materials, opening counts, installation steps, access assumptions and any warranty language that actually applies. Avoid vague phone quotes for ${serviceName} in ${place}.`,
    },
    {
      question: `How do I compare ${angle.comparisonAngle}?`,
      answer: `Compare systems on visibility, ventilation, maintenance and suitability for your openings — not on marketing adjectives. ${company} can explain trade-offs after seeing the site.`,
    },
  ];

  for (const q of baseQs.slice(1, 5)) {
    faqs.push({
      question: q,
      answer: `For ${place}, answers depend on measured openings and ${angle.faqAngle}. ${company} covers this during the free assessment and puts the scope in writing.`,
    });
  }

  return faqs;
}

export function buildUltraLongformSeo(ctx: LongformContext): {
  blocks: ContentBlock[];
  faqs: FaqItem[];
  wordCount: number;
  tableOfContents: { label: string; href: string }[];
  contentAngleId?: string;
  contentVersion?: string;
} {
  const company = ctx.company ?? BUSINESS_CONFIG.name;
  const place = ctx.placeName;
  const city = ctx.cityName ?? "Hyderabad";
  const serviceSlug = ctx.serviceSlug;
  const kb = serviceSlug ? getServiceKnowledge(serviceSlug) : undefined;
  const angle = assignContentAngle({
    serviceSlug: serviceSlug ?? "general",
    areaSlug: ctx.areaSlug,
    pageType: ctx.pageType,
  });
  const serviceName = kb?.serviceName ?? ctx.topic;
  const enabled = new Set(modulesForAngle(angle));
  const blocks: ContentBlock[] = [];

  if (enabled.has("overview")) {
    blocks.push({
      id: "longform-overview",
      anchorId: "seo-overview",
      heading: `${serviceName}: ${angle.primaryIntent.replace(/-/g, " ")}`,
      paragraphs: [
        kb?.definition ??
          `${serviceName} is specified after measuring openings and reviewing how the household uses the space.`,
        `Informational purpose of this page: ${describeAngle(angle)}.`,
        `Location notes for ${place}, ${city} remain secondary. The useful decisions are technical — materials, fixing, spacing and maintenance — not keyword repetition.`,
        kb?.purpose ??
          `${company} provides measurement-led recommendations so households understand realistic options before approving work.`,
      ],
    });
  }

  if (enabled.has("fundamentals")) {
    blocks.push({
      id: "longform-fundamentals",
      anchorId: "seo-fundamentals",
      heading: `Technical fundamentals focused on ${angle.technicalAngle}`,
      paragraphs: [
        `For ${angle.application}, start with opening type, structure and household risk. Then decide components that match ${angle.buildingType} use.`,
        ...expandList(
          (kb?.useCases ?? []).slice(0, 4),
          `A common reason households consider ${serviceName}:`,
        ),
      ],
      listItems: (kb?.components ?? []).slice(0, 8),
    });
  }

  if (enabled.has("process")) {
    blocks.push({
      id: "longform-process",
      anchorId: "seo-process",
      heading: `Installation method — ${angle.installationAngle}`,
      paragraphs: [
        `${company} uses a measurement-first path. Skipping measurement is the most common cause of mismatched quotations for ${serviceName}.`,
      ],
      subSections: (kb?.installationMethod ?? []).map((step, index) => ({
        title: `${index + 1}. ${step}`,
        description: `Applied to ${angle.application} with attention to ${angle.installationAngle}.`,
      })),
    });
  }

  if (enabled.has("materials")) {
    blocks.push({
      id: "longform-materials",
      anchorId: "seo-materials",
      heading: `Materials and verified specifications`,
      paragraphs: [
        `Only verified notes are listed. Numeric grades, load ratings or warranty years are omitted when not confirmed for a specific product line.`,
        `Material decisions for ${angle.buildingType} openings often hinge on ${angle.technicalAngle}.`,
        ...expandList((kb?.materials ?? []).slice(0, 4), "Material consideration:"),
      ],
      listItems: kb?.technicalSpecifications ?? [],
    });
  }

  if (enabled.has("applications")) {
    blocks.push({
      id: "longform-applications",
      anchorId: "seo-applications",
      heading: `Applications — ${angle.application}`,
      paragraphs: [
        `${serviceName} is commonly evaluated for the contexts below. Suitability still depends on structure and household needs.`,
        ...expandList((kb?.applications ?? []).slice(0, 5), "Application note:"),
      ],
      listItems: kb?.buildingTypes.map((b) => `Building context: ${b}`) ?? [],
    });
  }

  if (enabled.has("safety")) {
    blocks.push({
      id: "longform-safety",
      anchorId: "seo-safety",
      heading: `Safety considerations and honest limitations`,
      paragraphs: [
        `Clear limitations improve trust. ${serviceName} reduces risk when correctly specified, but it is not a substitute for supervision or structural advice outside the installer's scope.`,
        ...expandList((kb?.safetyConsiderations ?? []).slice(0, 4), "Safety note:"),
      ],
      listItems: kb?.limitations ?? [],
    });
  }

  if (enabled.has("design")) {
    blocks.push({
      id: "longform-design",
      anchorId: "seo-design",
      heading: `Design and usability considerations`,
      paragraphs: [
        `Design choices affect view, ventilation and daily use. For ${angle.application}, weigh appearance against ${angle.technicalAngle}.`,
        `Ask to see how fixings meet the railing or frame so finishing stays neat after install day.`,
      ],
      listItems: (kb?.advantages ?? []).slice(0, 6),
    });
  }

  if (enabled.has("maintenance") || enabled.has("troubleshooting")) {
    blocks.push({
      id: "longform-maintenance",
      anchorId: "seo-maintenance",
      heading: `Maintenance — ${angle.maintenanceAngle}`,
      paragraphs: [
        `A short seasonal check usually catches loose fittings or damage early.`,
        ...expandList((kb?.maintenance ?? []).slice(0, 4), "Maintenance step:"),
      ],
      listItems: [
        "Problem: visible sag or looseness → Inspect end fittings and tension → Schedule assessment before the opening is used heavily",
        "Problem: impact mark or bent section → Check surrounding fixings → Repair or replace damaged components promptly",
        "Problem: corrosion staining on exposed hardware → Review material grade and cleaning routine → Ask for on-site advice if staining spreads",
      ],
    });
  }

  if (enabled.has("comparison") && (kb?.comparisonNotes.length ?? 0) > 0) {
    blocks.push({
      id: "longform-comparison",
      anchorId: "seo-comparison",
      heading: `Comparison — ${angle.comparisonAngle}`,
      paragraphs: [
        `Fair comparisons help households choose the right system for ${angle.application}.`,
      ],
      listItems: kb!.comparisonNotes,
    });
  }

  if (enabled.has("selection")) {
    blocks.push({
      id: "longform-selection",
      anchorId: "seo-selection",
      heading: `Selection and cost factors`,
      paragraphs: [
        `${company} does not invent flat prices. Quotation depends on measured openings, access and materials.`,
        `When comparing options for ${angle.faqAngle}, insist on named materials and written scope.`,
        ...expandList((kb?.costFactors ?? kb?.selectionFactors ?? []).slice(0, 5), "Cost factor:"),
      ],
    });
  }

  if (enabled.has("mistakes")) {
    blocks.push({
      id: "longform-mistakes",
      anchorId: "seo-mistakes",
      heading: `Common mistakes to avoid`,
      paragraphs: [
        `Most poor outcomes come from skipping measurement or leaving materials unnamed.`,
      ],
      listItems: kb?.commonMistakes ?? [
        "Confirming price from photos alone",
        "Ignoring access and fixing-point condition",
      ],
    });
  }

  if (enabled.has("local")) {
    blocks.push({
      id: "longform-local-context",
      anchorId: "seo-local-context",
      heading: `Local installation context for ${place}`,
      paragraphs: [
        `For ${place}, ${city}, share society hours, lift or terrace access and opening photos when you enquire.`,
        `${company} uses the same measurement and written-quotation process citywide. Locality differences are logistics and building pattern — not a rewritten sales script.`,
      ],
    });
  }

  blocks.push({
    id: "longform-related-services",
    anchorId: "seo-related-services",
    heading: `Related services`,
    paragraphs: [
      `Combine complementary solutions when useful. Links below are service guides — not a dump of locality names.`,
    ],
    subSections: getPublishedServices()
      .filter((s) => s.slug !== serviceSlug)
      .slice(0, 5)
      .map((service) => ({
        title: service.name,
        description: service.summary,
        href: buildServiceInCityPath(service.slug, DEFAULT_LOCATION_SLUG),
      })),
  });

  const faqs = buildAngleFaqs(serviceName, place, company, kb, angle);
  const wordCount = countBlockWords(blocks, faqs);
  const tableOfContents = blocks
    .filter((b) => b.anchorId)
    .map((b) => ({ label: b.heading, href: `#${b.anchorId}` }));

  return {
    blocks,
    faqs,
    wordCount,
    tableOfContents,
    contentAngleId: angle.id,
    contentVersion: angle.contentVersion,
  };
}

export function mergeLongformIntoPageContent(
  base: {
    blocks: ContentBlock[];
    faqs: FaqItem[];
    tableOfContents?: { label: string; href: string }[];
  },
  ctx: LongformContext,
) {
  const longform = buildUltraLongformSeo(ctx);
  const blocks = [...base.blocks, ...longform.blocks];
  const faqs = [...base.faqs, ...longform.faqs];
  const tableOfContents = [
    ...(base.tableOfContents ??
      base.blocks
        .filter((b) => b.anchorId)
        .map((b) => ({ label: b.heading, href: `#${b.anchorId}` }))),
    ...longform.tableOfContents,
  ];
  const wordCount = countBlockWords(blocks, faqs);
  return {
    blocks,
    faqs,
    tableOfContents,
    wordCount,
    longformWordCount: longform.wordCount,
    contentAngleId: longform.contentAngleId,
    contentVersion: longform.contentVersion,
  };
}
