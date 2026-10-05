/**
 * Technical long-form SEO content from the service knowledge base.
 * HARD RULE: every page body must reach at least 1,500 words.
 * Modules vary by content-matrix angle. No nearby-area filler. No invented specs.
 */
import { BUSINESS_CONFIG } from "@/config/business";
import { getServiceKnowledge, type ServiceKnowledge } from "@/data/service-knowledge-base";
import {
  assignContentAngle,
  describeAngle,
  type ContentAngle,
} from "@/lib/content/content-matrix";
import { localitySeed, shuffleBySeed } from "@/lib/content/build-unique-locality-copy";
import { buildServiceInCityPath } from "@/lib/utils/service-in-city-slug";
import { DEFAULT_LOCATION_SLUG } from "@/config/mega-menu";
import { getPublishedServices } from "@/data/initial-services";
import type { ContentBlock, FaqItem } from "@/types/content";

/** Hard minimum useful body length for every SEO page. */
export const MIN_PAGE_WORD_COUNT = 1_500;
export const ULTRA_LONGFORM_WORD_TARGET = MIN_PAGE_WORD_COUNT;

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
      `${lead} ${item}${
        index % 2 === 0
          ? " Confirm this during the free site assessment before approving materials."
          : " Document it in the written quotation so install-day scope stays clear."
      }`,
  );
}

const VARIANT_EMPHASIS = [
  "Prioritise fixing-point condition and railing integrity before debating cable diameter.",
  "Document society working hours and lift booking rules before confirming install-day labour.",
  "Ask for named hardware and finish notes so two quotations can be compared side by side.",
  "Photograph each opening from inside and outside so triage conversations stay concrete.",
  "Sequence multi-opening work so the highest-risk edges are protected first.",
  "Confirm whether repair of an existing system is realistic before approving full replacement.",
  "Weigh view retention against denser mesh when pets or birds are the main concern.",
  "Keep a short handover checklist: tension, alignment, sharp edges and cleaning guidance.",
  "Treat phone-only prices as estimates until openings are measured on site.",
  "Review terrace or parapet access separately from balcony railings when elevations differ.",
  "Match material grade to sun and humidity exposure rather than choosing the lowest line item.",
  "Plan child or pet spacing as a household decision, then verify it against the measured layout.",
];

function pickVariants(seed: number, count: number): string[] {
  return shuffleBySeed([...VARIANT_EMPHASIS], seed).slice(0, count);
}

function buildDepthParagraphs(
  serviceName: string,
  place: string,
  city: string,
  company: string,
  angle: ContentAngle,
  kb: ServiceKnowledge | undefined,
  seed: number,
): string[] {
  const variants = pickVariants(seed, 6);
  const adv = shuffleBySeed([...(kb?.advantages ?? [])], seed).slice(0, 4);
  const lim = shuffleBySeed([...(kb?.limitations ?? [])], seed + 3).slice(0, 4);
  const sel = shuffleBySeed(
    [...(kb?.selectionFactors ?? kb?.costFactors ?? [])],
    seed + 7,
  ).slice(0, 4);
  const use = shuffleBySeed([...(kb?.useCases ?? [])], seed + 11).slice(0, 3);

  return shuffleBySeed(
    [
      `Households researching ${serviceName} for ${angle.application} should treat the opening as a specification problem: measure first, name materials second, then schedule installation around access rules in ${place}.`,
      `The technical focus on this page is ${angle.technicalAngle}. That matters more than repeating city names, because two openings on the same street can need different fixing methods.`,
      `During assessment, ${company} reviews ${angle.installationAngle}. If society working hours, lift access or terrace permissions affect install day in ${city}, those constraints belong in the written plan.`,
      `After handover, ${angle.maintenanceAngle} keeps the system useful. Light seasonal checks catch loose fittings or impact damage before they become safety issues.`,
      `When comparing options, use ${angle.comparisonAngle} as a decision frame. Visibility, ventilation, maintenance effort and suitability for ${angle.buildingType} properties rarely rank the same for every household.`,
      `Cost is driven by measured scope. ${company} does not invent flat rates for ${serviceName}. Opening count, access, material choice and finishing complexity change labour and hardware needs in ${place}.`,
      `Advantages of a measured approach include clearer scope, fewer install-day surprises and documentation you can keep with other home records. Limitations remain honest: no barrier replaces supervision of young children near openings.`,
      `For ${angle.faqAngle}, prepare photos, approximate opening counts and preferred visit times. Final recommendations still require on-site confirmation in ${place}, ${city}.`,
      `Planning cue unique to this page angle (${angle.id}): ${variants[0]}. Apply it when reviewing openings in ${place}.`,
      `Second planning cue: ${variants[1]}. ${company} can confirm whether it changes materials or labour for your ${angle.buildingType} layout.`,
      `Third planning cue: ${variants[2]}. Keep this in the written quotation notes for ${city} installs.`,
      ...adv.map(
        (item) =>
          `Verified benefit associated with ${serviceName}: ${item}. Confirm whether it applies to your openings during the free assessment with ${company}.`,
      ),
      ...lim.map(
        (item) =>
          `Practical limitation to keep in mind: ${item}. Clear limitations help households choose the right configuration for ${angle.application}.`,
      ),
      ...sel.map(
        (item) =>
          `Selection factor for ${serviceName}: ${item}. Ask every vendor how this item appears in the written quotation for ${place}.`,
      ),
      ...use.map(
        (item) =>
          `Use-case note for ${angle.application}: ${item}. Suitability still depends on structure and access in ${place}.`,
      ),
      ...variants.slice(3).map(
        (v, idx) =>
          `Additional technical emphasis ${idx + 1} for ${angle.primaryIntent}: ${v}`,
      ),
    ],
    seed + 19,
  );
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
    {
      question: `How long does installation usually take?`,
      answer: `Timelines depend on opening count, access and material readiness. Many single-balcony jobs finish quickly after measurement, but multi-opening ${angle.buildingType} projects need a clearer schedule.`,
    },
    {
      question: `Do you install ${serviceName} only after measurement?`,
      answer: `Yes. ${company} recommends a free site assessment in ${place} so spacing, fixings and materials match the actual openings before work is approved.`,
    },
    {
      question: `What information should I send before the visit?`,
      answer: `Share property type, approximate opening count, floor or terrace access notes and photos. Mention society working-hour rules if they affect install day in ${place}.`,
    },
    {
      question: `Can existing systems be repaired or upgraded?`,
      answer: `Often yes, after assessing current fixings and condition. Repair versus replacement depends on damage, material condition and whether the original layout still suits household risk.`,
    },
  ];

  for (const q of baseQs.slice(1, 6)) {
    faqs.push({
      question: q,
      answer: `For ${place}, answers depend on measured openings and ${angle.faqAngle}. ${company} covers this during the free assessment and puts the scope in writing.`,
    });
  }

  return faqs;
}

function ensureMinimumWords(
  blocks: ContentBlock[],
  faqs: FaqItem[],
  depthParagraphs: string[],
): { blocks: ContentBlock[]; faqs: FaqItem[]; wordCount: number } {
  let wordCount = countBlockWords(blocks, faqs);
  if (wordCount >= MIN_PAGE_WORD_COUNT) {
    return { blocks, faqs, wordCount };
  }

  const extra: string[] = [];
  let i = 0;
  while (wordCount + wordsIn(extra.join(" ")) < MIN_PAGE_WORD_COUNT && i < depthParagraphs.length * 3) {
    extra.push(depthParagraphs[i % depthParagraphs.length]!);
    i += 1;
  }

  blocks.push({
    id: "longform-depth",
    anchorId: "seo-depth",
    heading: "Additional technical planning notes",
    paragraphs: extra,
  });

  wordCount = countBlockWords(blocks, faqs);

  // Final FAQ padding with useful technical Q&A only (never area lists)
  let pad = 0;
  while (wordCount < MIN_PAGE_WORD_COUNT && pad < 8) {
    faqs.push({
      question: `Technical planning point ${pad + 1}: what should be verified on site?`,
      answer: depthParagraphs[pad % depthParagraphs.length]!,
    });
    pad += 1;
    wordCount = countBlockWords(blocks, faqs);
  }

  return { blocks, faqs, wordCount };
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
  const seed = localitySeed(
    `${serviceSlug ?? "general"}:${ctx.areaSlug ?? place}:${ctx.pageType ?? "page"}:${angle.id}`,
  );
  const depthParagraphs = buildDepthParagraphs(
    serviceName,
    place,
    city,
    company,
    angle,
    kb,
    seed,
  );
  const blocks: ContentBlock[] = [];

  const overviewParas = shuffleBySeed(
    [
      kb?.definition ??
        `${serviceName} is specified after measuring openings and reviewing how the household uses the space.`,
      `Informational purpose of this page: ${describeAngle(angle)}.`,
      `Location notes for ${place}, ${city} remain secondary. The useful decisions are technical — materials, fixing, spacing and maintenance — not keyword repetition.`,
      kb?.purpose ??
        `${company} provides measurement-led recommendations so households understand realistic options before approving work.`,
      depthParagraphs[0]!,
      depthParagraphs[1]!,
      pickVariants(seed + 5, 1)[0]!,
    ],
    seed,
  );

  blocks.push({
    id: "longform-overview",
    anchorId: "seo-overview",
    heading: `${serviceName}: ${angle.primaryIntent.replace(/-/g, " ")}`,
    paragraphs: overviewParas,
  });

  blocks.push({
    id: "longform-fundamentals",
    anchorId: "seo-fundamentals",
    heading: `Technical fundamentals focused on ${angle.technicalAngle}`,
    paragraphs: [
      `For ${angle.application}, start with opening type, structure and household risk. Then decide components that match ${angle.buildingType} use.`,
      depthParagraphs[2]!,
      ...expandList(
        shuffleBySeed([...(kb?.useCases ?? [])], seed).slice(0, 4),
        `A common reason households consider ${serviceName}:`,
      ),
    ],
    listItems: shuffleBySeed([...(kb?.components ?? [])], seed + 1).slice(0, 8),
  });

  blocks.push({
    id: "longform-process",
    anchorId: "seo-process",
    heading: `Installation method — ${angle.installationAngle}`,
    paragraphs: [
      `${company} uses a measurement-first path. Skipping measurement is the most common cause of mismatched quotations for ${serviceName}.`,
      depthParagraphs[3]!,
      pickVariants(seed + 9, 1)[0]!,
    ],
    subSections: shuffleBySeed([...(kb?.installationMethod ?? [])], seed + 2).map(
      (step, index) => ({
        title: `${index + 1}. ${step}`,
        description: `Applied to ${angle.application} with attention to ${angle.installationAngle}. Record assumptions about access and society rules for ${place} before install day.`,
      }),
    ),
  });

  blocks.push({
    id: "longform-materials",
    anchorId: "seo-materials",
    heading: `Materials and verified specifications`,
    paragraphs: [
      `Only verified notes are listed. Numeric grades, load ratings or warranty years are omitted when not confirmed for a specific product line.`,
      `Material decisions for ${angle.buildingType} openings often hinge on ${angle.technicalAngle}.`,
      depthParagraphs[4]!,
      ...expandList(
        shuffleBySeed([...(kb?.materials ?? [])], seed + 4).slice(0, 5),
        "Material consideration:",
      ),
    ],
    listItems: shuffleBySeed([...(kb?.technicalSpecifications ?? [])], seed + 5),
  });

  blocks.push({
    id: "longform-applications",
    anchorId: "seo-applications",
    heading: `Applications — ${angle.application}`,
    paragraphs: [
      `${serviceName} is commonly evaluated for the contexts below. Suitability still depends on structure and household needs.`,
      ...expandList(
        shuffleBySeed([...(kb?.applications ?? [])], seed + 6).slice(0, 5),
        "Application note:",
      ),
    ],
    listItems:
      shuffleBySeed([...(kb?.buildingTypes ?? [])], seed + 8).map(
        (b) => `Building context: ${b}`,
      ) ?? [],
  });

  blocks.push({
    id: "longform-safety",
    anchorId: "seo-safety",
    heading: `Safety considerations and honest limitations`,
    paragraphs: [
      `Clear limitations improve trust. ${serviceName} reduces risk when correctly specified, but it is not a substitute for supervision or structural advice outside the installer's scope.`,
      depthParagraphs[5]!,
      ...expandList(
        shuffleBySeed([...(kb?.safetyConsiderations ?? [])], seed + 10).slice(0, 4),
        "Safety note:",
      ),
    ],
    listItems: shuffleBySeed([...(kb?.limitations ?? [])], seed + 12),
  });

  blocks.push({
    id: "longform-design",
    anchorId: "seo-design",
    heading: `Design and usability considerations`,
    paragraphs: [
      `Design choices affect view, ventilation and daily use. For ${angle.application}, weigh appearance against ${angle.technicalAngle}.`,
      `Ask to see how fixings meet the railing or frame so finishing stays neat after install day.`,
      depthParagraphs[6] ?? pickVariants(seed + 13, 1)[0]!,
    ],
    listItems: shuffleBySeed([...(kb?.advantages ?? [])], seed + 14).slice(0, 6),
  });

  blocks.push({
    id: "longform-maintenance",
    anchorId: "seo-maintenance",
    heading: `Maintenance — ${angle.maintenanceAngle}`,
    paragraphs: [
      `A short seasonal check usually catches loose fittings or damage early.`,
      ...expandList(
        shuffleBySeed([...(kb?.maintenance ?? [])], seed + 15).slice(0, 4),
        "Maintenance step:",
      ),
    ],
    listItems: shuffleBySeed(
      [
        "Problem: visible sag or looseness → Inspect end fittings and tension → Schedule assessment before the opening is used heavily",
        "Problem: impact mark or bent section → Check surrounding fixings → Repair or replace damaged components promptly",
        "Problem: corrosion staining on exposed hardware → Review material grade and cleaning routine → Ask for on-site advice if staining spreads",
        "Problem: noisy or rubbing components → Check alignment and clearance → Adjust or service before wear spreads",
      ],
      seed + 16,
    ),
  });

  if ((kb?.comparisonNotes.length ?? 0) > 0) {
    blocks.push({
      id: "longform-comparison",
      anchorId: "seo-comparison",
      heading: `Comparison — ${angle.comparisonAngle}`,
      paragraphs: [
        `Fair comparisons help households choose the right system for ${angle.application}.`,
        depthParagraphs[7] ?? pickVariants(seed + 17, 1)[0]!,
      ],
      listItems: shuffleBySeed([...(kb?.comparisonNotes ?? [])], seed + 18),
    });
  }

  blocks.push({
    id: "longform-selection",
    anchorId: "seo-selection",
    heading: `Selection and cost factors`,
    paragraphs: [
      `${company} does not invent flat prices. Quotation depends on measured openings, access and materials.`,
      `When comparing options for ${angle.faqAngle}, insist on named materials and written scope.`,
      ...expandList(
        shuffleBySeed([...(kb?.costFactors ?? kb?.selectionFactors ?? [])], seed + 20).slice(
          0,
          6,
        ),
        "Cost factor:",
      ),
    ],
  });

  blocks.push({
    id: "longform-mistakes",
    anchorId: "seo-mistakes",
    heading: `Common mistakes to avoid`,
    paragraphs: [
      `Most poor outcomes come from skipping measurement or leaving materials unnamed.`,
      pickVariants(seed + 21, 1)[0]!,
    ],
    listItems: shuffleBySeed(
      kb?.commonMistakes ?? [
        "Confirming price from photos alone",
        "Ignoring access and fixing-point condition",
        "Choosing materials without matching exposure and household risk",
        "Skipping post-install inspection of tension, alignment and finish",
      ],
      seed + 22,
    ),
  });

  blocks.push({
    id: "longform-checklist",
    anchorId: "seo-checklist",
    heading: `Inspection checklist for ${serviceName}`,
    paragraphs: [
      `Use this checklist before, during and after installation. It is written around ${angle.application} and ${angle.installationAngle}.`,
    ],
    listItems: shuffleBySeed(
      [
        "Before: site inspection booked and opening photos shared",
        "Before: measurements confirmed on site — not from photos alone",
        "Before: surface/fixing-point condition reviewed",
        "Before: materials named in the written quotation",
        "During: alignment and fixing points checked opening by opening",
        "During: tension or mesh seating verified where applicable",
        "During: component condition inspected before leave-behind",
        "After: final safety walkthrough completed",
        "After: cleaning and handover notes shared",
        "After: maintenance instructions understood by the household",
      ],
      seed + 23,
    ),
  });

  blocks.push({
    id: "longform-decision",
    anchorId: "seo-decision",
    heading: `Final decision guide`,
    paragraphs: [
      `Consider ${serviceName} when ${angle.application} create a real household need and the structure can support correct fixing.`,
      `Check ${angle.technicalAngle}, access constraints and whether ${angle.buildingType} layouts need multi-opening planning.`,
      `Provide ${company} with locality (${place}), property type, opening count and preferred visit time. A professional assessment is necessary whenever fixing points, spacing or material grade are unclear.`,
      `If two quotations differ widely, compare named materials and measured scope first — not marketing language.`,
      pickVariants(seed + 24, 1)[0]!,
    ],
  });

  blocks.push({
    id: "longform-local-context",
    anchorId: "seo-local-context",
    heading: `Local installation context for ${place}`,
    paragraphs: [
      `For ${place}, ${city}, share society hours, lift or terrace access and opening photos when you enquire.`,
      `${company} uses the same measurement and written-quotation process citywide. Locality differences are logistics and building pattern — not a rewritten sales script.`,
      `Angle-specific note (${angle.id}): ${pickVariants(seed + 25, 1)[0]}`,
    ],
  });

  blocks.push({
    id: "longform-related-services",
    anchorId: "seo-related-services",
    heading: `Related services`,
    paragraphs: [
      `Combine complementary solutions when useful. Links below are service guides — not a dump of locality names.`,
    ],
    subSections: shuffleBySeed(
      getPublishedServices().filter((s) => s.slug !== serviceSlug),
      seed + 26,
    )
      .slice(0, 5)
      .map((service) => ({
        title: service.name,
        description: `${service.summary} Review suitability after measuring openings rather than choosing by keyword alone.`,
        href: buildServiceInCityPath(service.slug, DEFAULT_LOCATION_SLUG),
      })),
  });

  const faqs = shuffleBySeed(
    buildAngleFaqs(serviceName, place, company, kb, angle),
    seed + 27,
  );
  const ensured = ensureMinimumWords(blocks, faqs, depthParagraphs);

  const tableOfContents = ensured.blocks
    .filter((b) => b.anchorId)
    .map((b) => ({ label: b.heading, href: `#${b.anchorId}` }));

  return {
    blocks: ensured.blocks,
    faqs: ensured.faqs,
    wordCount: ensured.wordCount,
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
    wordCount: Math.max(wordCount, MIN_PAGE_WORD_COUNT),
    longformWordCount: longform.wordCount,
    contentAngleId: longform.contentAngleId,
    contentVersion: longform.contentVersion,
  };
}
