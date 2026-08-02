import { BUSINESS_CONFIG } from "@/config/business";
import { getServedAreas } from "@/data/initial-areas";
import { getPublishedServices } from "@/data/initial-services";
import { getSampleIntentsForService, formatIntentPhrase } from "@/data/keyword-intents";
import { buildIntentPageUrl, DEFAULT_LOCATION_SLUG } from "@/config/mega-menu";
import { buildInvisibleGrillsInstallationPath } from "@/lib/utils/installation-in-locality-slug";
import { buildServiceInCityPath } from "@/lib/utils/service-in-city-slug";
import type { ContentBlock, FaqItem } from "@/types/content";

export const ULTRA_LONGFORM_WORD_TARGET = 20_000;

export type LongformContext = {
  topic: string;
  placeName: string;
  cityName?: string;
  company?: string;
  serviceSlug?: string;
  areaSlug?: string;
  pageType?: string;
};

const DEPTH_ANGLES = [
  "safety outcomes for children and elderly residents",
  "view retention versus conventional iron grills",
  "SS316 corrosion resistance in monsoon humidity",
  "measurement-led quotation accuracy",
  "high-rise balcony access and society permissions",
  "pet fall-risk reduction on open railings",
  "apartment handover and possession timelines",
  "villa terrace and staircase openings",
  "duct-area and utility balcony protection",
  "window and French-door cable layouts",
  "warranty documentation and after-sales support",
  "material grade trade-offs and lifecycle cost",
  "professional tensioning versus DIY kits",
  "west-facing sun exposure and UV ageing",
  "custom cable spacing for toddlers",
  "multi-opening package pricing",
  "commercial and institutional installations",
  "repair, re-tensioning and upgrades",
  "pre-monsoon inspection checklists",
  "neighbourhood coverage and rapid scheduling",
  "transparent written scope before install day",
  "powder-coated frames and neat finishing",
  "ventilation and natural light preservation",
  "gated community working-hour constraints",
  "independent house multi-storey openings",
  "hotel, school and hospital corridor edges",
  "bird and pigeon control combinations",
  "safety-net pairing strategies",
  "installer credentials and on-site hygiene",
  "same-week installation planning",
];

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

function paragraph(
  company: string,
  topic: string,
  place: string,
  city: string,
  angle: string,
  variation: number,
): string {
  const openers = [
    `${company} supports homeowners researching ${topic} in ${place} with a measurement-first process focused on ${angle}.`,
    `When families in ${place}, ${city} evaluate ${topic}, the deciding factors usually include ${angle} alongside clear pricing.`,
    `Across ${place} and nearby ${city} corridors, demand for ${topic} is driven by ${angle} rather than catalogue one-size layouts.`,
    `Our ${place} installation teams document openings carefully so ${topic} specifications match real ${angle} requirements.`,
    `Residents comparing vendors for ${topic} near ${place} should prioritise ${angle}, written warranty notes and on-site inspection.`,
  ];
  const middles = [
    `We explain material grades, spacing options and fixing methods in plain language before any work is scheduled in ${place}.`,
    `${company} does not quote from photos alone for ${topic} in ${place} because floor height, railing type and access change labour and hardware needs.`,
    `Local ${city} weather — hot summers and humid monsoon months — makes corrosion-resistant hardware especially relevant for long-term performance.`,
    `Whether the property is a high-rise flat, gated villa or independent house in ${place}, the same quality checklist applies from inspection to handover.`,
    `After installation we share simple care guidance so ${topic} continues to perform safely through seasonal changes in ${city}.`,
  ];
  const closers = [
    `Book a free site visit in ${place} to receive a written quotation for ${topic} with transparent scope.`,
    `Call or WhatsApp ${company} to schedule ${topic} assessment across ${place} and surrounding neighbourhoods.`,
    `Explore related high-intent pages and nearby locality guides linked from this ${place} resource for deeper research.`,
    `Our goal is a neat, durable ${topic} outcome in ${place} that protects family members without blocking light or views.`,
    `Share your pin code, property type and opening photos for a faster response on ${topic} installation in ${place}.`,
  ];
  return `${openers[variation % openers.length]} ${middles[variation % middles.length]} ${closers[variation % closers.length]}`;
}

function buildAreaDirectoryBlocks(
  topic: string,
  place: string,
  city: string,
  company: string,
  serviceSlug?: string,
): ContentBlock[] {
  const areas = getServedAreas();
  const chunks: ContentBlock[] = [];
  const chunkSize = 25;

  for (let i = 0; i < areas.length; i += chunkSize) {
    const slice = areas.slice(i, i + chunkSize);
    const start = i + 1;
    const end = i + slice.length;
    chunks.push({
      id: `longform-areas-${start}`,
      anchorId: `seo-areas-${start}`,
      heading: `${topic} coverage directory in ${city} (areas ${start}–${end})`,
      paragraphs: [
        `${company} lists verified ${city} localities where homeowners commonly request ${topic}. Use these neighbourhood notes as a research aid — every quotation still depends on on-site measurement in ${place} or the selected area.`,
      ],
      subSections: slice.map((area) => {
        const href =
          serviceSlug === "invisible-grills" || !serviceSlug
            ? buildInvisibleGrillsInstallationPath(area.slug)
            : `/${DEFAULT_LOCATION_SLUG}/${area.slug}/${serviceSlug}/`;
        return {
          title: `${topic} in ${area.name}`,
          description: `${area.introduction} Typical homes include ${area.propertyTypes.join(", ")}. ${area.localDescription} Book a free site visit with ${company} for accurate measurements in ${area.name}.`,
          href,
        };
      }),
    });
  }

  return chunks;
}

function buildFaqBank(
  topic: string,
  place: string,
  city: string,
  company: string,
  serviceSlug?: string,
): FaqItem[] {
  const faqs: FaqItem[] = [];
  const bases = [
    [`What is the cost of ${topic} in ${place}?`, `Cost for ${topic} in ${place} depends on opening size, floor height, material grade and access. ${company} provides a free site visit and written quotation.`],
    [`Who installs ${topic} near ${place}?`, `${company} installs ${topic} across ${place} and ${city} with trained technicians, branded materials and after-sales support.`],
    [`How long does ${topic} installation take in ${place}?`, `Most ${topic} projects in ${place} finish in 1–2 days after measurement, subject to society access and material readiness.`],
    [`Is ${topic} safe for children in ${place} apartments?`, `Yes — when spacing and fixing are planned for toddlers, ${topic} is an effective fall-risk reduction measure for ${place} homes.`],
    [`Do you use SS316 for ${topic} in ${place}?`, `We recommend SS316 stainless options for exposed balconies in ${place} where monsoon humidity and long warranty expectations matter.`],
    [`Can I get a free inspection for ${topic} in ${place}?`, `Yes. Call ${BUSINESS_CONFIG.phone.display} or WhatsApp ${BUSINESS_CONFIG.whatsapp.display} to book a free ${topic} inspection in ${place}.`],
    [`Do you serve villas and apartments for ${topic} in ${place}?`, `Yes. ${company} installs ${topic} in apartments, villas, independent houses and selected commercial buildings across ${place}.`],
    [`What warranty applies to ${topic} in ${place}?`, `Warranty terms for ${topic} in ${place} are listed in your written quotation and cover selected materials and workmanship.`],
    [`How do I compare ${topic} vendors in ${city}?`, `Compare on-site measurement, cable/mesh grade, written scope, warranty and finishing photos — not headline price alone for ${topic} in ${place}.`],
    [`Can you repair existing ${topic} in ${place}?`, `We handle re-tensioning, section replacement and upgrades for existing ${topic} installations in ${place} after photo assessment.`],
  ] as const;

  for (const [q, a] of bases) {
    faqs.push({ question: q, answer: a });
  }

  for (const angle of DEPTH_ANGLES) {
    faqs.push({
      question: `How does ${company} handle ${angle} for ${topic} in ${place}?`,
      answer: `During the free ${place} inspection we review ${angle} as it relates to your openings, then specify ${topic} materials and spacing accordingly. Documentation is included in the quotation for ${city} clients.`,
    });
  }

  const areas = getServedAreas().slice(0, 80);
  for (const area of areas) {
    faqs.push({
      question: `Do you provide ${topic} in ${area.name}?`,
      answer: `Yes. ${company} provides ${topic} installation support in ${area.name}, ${city}. ${area.introduction} Book a free visit to confirm measurements.`,
    });
  }

  if (serviceSlug) {
    for (const intent of getSampleIntentsForService(serviceSlug, 24)) {
      const phrase = formatIntentPhrase(intent, place);
      faqs.push({
        question: `Do you cover ${phrase}?`,
        answer: `Yes. ${company} provides guidance and installation support for ${phrase}. During the free inspection we confirm materials, spacing and timeline for your ${place} property.`,
      });
    }
  }

  return faqs;
}

/**
 * Builds ultra long-form SEO blocks + FAQs targeting 20,000+ words.
 * Content is locality/topic-aware and internally link-rich.
 */
export function buildUltraLongformSeo(ctx: LongformContext): {
  blocks: ContentBlock[];
  faqs: FaqItem[];
  wordCount: number;
  tableOfContents: { label: string; href: string }[];
} {
  const company = ctx.company ?? BUSINESS_CONFIG.name;
  const topic = ctx.topic;
  const place = ctx.placeName;
  const city = ctx.cityName ?? "Hyderabad";
  const serviceSlug = ctx.serviceSlug;
  const areaSlug = ctx.areaSlug ?? "gachibowli";

  const blocks: ContentBlock[] = [];
  const paragraphs: string[] = [];

  for (let i = 0; i < DEPTH_ANGLES.length; i++) {
    paragraphs.push(paragraph(company, topic, place, city, DEPTH_ANGLES[i]!, i));
  }

  // Extra variation loops to deepen word count with unique angle combos
  for (let round = 0; round < 3; round++) {
    for (let i = 0; i < DEPTH_ANGLES.length; i++) {
      const angle = DEPTH_ANGLES[(i + round * 7) % DEPTH_ANGLES.length]!;
      paragraphs.push(
        `Further guidance on ${topic} in ${place} focuses on ${angle}. ${paragraph(company, topic, place, city, angle, i + round + 3)} Homeowners in ${city} should treat ${topic} as a safety specification — not a decorative add-on — especially where toddlers, pets or elderly residents use balconies daily in ${place}.`,
      );
    }
  }

  blocks.push({
    id: "longform-deep-guide",
    anchorId: "seo-deep-guide",
    heading: `In-depth ${topic} guide for ${place}, ${city}`,
    paragraphs: paragraphs.slice(0, 40),
  });

  blocks.push({
    id: "longform-deep-guide-2",
    anchorId: "seo-deep-guide-2",
    heading: `Extended ${topic} research notes for ${place} homeowners`,
    paragraphs: paragraphs.slice(40, 80),
  });

  blocks.push({
    id: "longform-deep-guide-3",
    anchorId: "seo-deep-guide-3",
    heading: `Advanced planning checklist for ${topic} in ${place}`,
    paragraphs: paragraphs.slice(80),
    listItems: DEPTH_ANGLES.map(
      (angle) => `Check ${angle} during your ${place} site inspection for ${topic}.`,
    ),
  });

  blocks.push({
    id: "longform-process",
    anchorId: "seo-process-detail",
    heading: `Step-by-step ${topic} process used in ${place}`,
    paragraphs: [
      `${company} follows a repeatable quality path for ${topic} in ${place}: enquiry, free inspection, material recommendation, written quotation, scheduled installation, tension/finish checks and handover.`,
      `Skipping measurement is the most common failure mode we see on cheap ${topic} jobs in ${city}. Our technicians measure openings, note railing materials and photograph fixing points before confirming price.`,
      `Society permissions, working hours and lift or terrace access in ${place} are discussed upfront so install day stays predictable for your household.`,
    ],
    subSections: [
      { title: "1. Enquiry", description: `Share locality (${place}), property type and photos via call or WhatsApp.` },
      { title: "2. Free inspection", description: `On-site measurement and plain-language options for ${topic}.` },
      { title: "3. Quotation", description: "Material grade, quantities, warranty notes and total price in writing." },
      { title: "4. Installation", description: `Professional fitting and neat finishing for ${place} openings.` },
      { title: "5. Handover", description: "Safety check, care tips and support contacts from " + company + "." },
    ],
  });

  blocks.push({
    id: "longform-materials",
    anchorId: "seo-materials-detail",
    heading: `Materials & specifications for ${topic} in ${place}`,
    paragraphs: [
      `Material choice for ${topic} in ${place} should match exposure, household risk and budget. Premium SS316 stainless cables are preferred for west-facing and monsoon-exposed balconies in ${city}.`,
      `We show samples during inspection so you can compare grades without pressure. Hardware, end fittings and frame finishes are selected for the railing or window surface present in your ${place} property.`,
      `Ask every vendor which grade they will install, what warranty covers, and what is excluded. ${company} lists these details in the quotation for ${topic}.`,
    ],
    listItems: [
      "SS316 / SS304 stainless cable options",
      "Corrosion-resistant fasteners and end fittings",
      "Custom spacing for child and pet safety",
      "Powder-coated frame colour matching",
      "Documented warranty terms",
    ],
  });

  blocks.push({
    id: "longform-related-services",
    anchorId: "seo-related-services",
    heading: `Related home safety services near ${place}`,
    paragraphs: [
      `Many ${place} households combine ${topic} with balcony safety nets, bird spikes or cloth hangers. Browse related services below for complete home safety planning in ${city}.`,
    ],
    subSections: getPublishedServices().map((service) => ({
      title: `${service.name} in ${city}`,
      description: `${service.summary} ${company} provides free inspection for ${service.name.toLowerCase()} across ${city}, including neighbourhoods near ${place}.`,
      href: buildServiceInCityPath(service.slug, DEFAULT_LOCATION_SLUG),
    })),
  });

  if (serviceSlug) {
    const intents = getSampleIntentsForService(serviceSlug, 36);
    blocks.push({
      id: "longform-high-intent",
      anchorId: "seo-high-intent",
      heading: `Popular ${topic} topics in ${place}`,
      paragraphs: [
        `These topics help residents of ${place} research ${topic} before booking. Each card opens a dedicated local guide with measurement and installation notes for ${city}.`,
      ],
      subSections: intents.map((intent) => ({
        title: formatIntentPhrase(intent, place),
        description: `${company} covers measurement, materials and installation guidance for this topic across ${city}. Tap through for locality-specific details in ${place}.`,
        href: buildIntentPageUrl(intent.serviceSlug, intent.slug, areaSlug, DEFAULT_LOCATION_SLUG),
      })),
    });
  }

  blocks.push({
    id: "longform-buyer-checklist",
    anchorId: "seo-buyer-checklist",
    heading: `Buyer checklist before booking ${topic} in ${place}`,
    paragraphs: [
      `Use this checklist when shortlisting installers for ${topic} in ${place}. It reduces surprises on install day and helps you compare quotations fairly across ${city}.`,
      `Confirm the vendor will visit your property, measure openings, and put material grade plus warranty in writing. Ask about society access, working hours and whether scaffolding or special equipment is included.`,
      `For child or pet safety, discuss cable spacing or mesh size explicitly. For west-facing balconies in ${place}, prefer corrosion-resistant grades suited to ${city} summer heat and monsoon humidity.`,
    ],
    listItems: [
      "Free on-site measurement before final price",
      "Written scope with material grade named",
      "Warranty terms for materials and workmanship",
      "Photos of similar projects in Hyderabad",
      "Clear timeline after quotation approval",
      "After-sales contact for tension checks",
      "Society permission / working-hour plan",
      "Cleanup and handover checklist",
    ],
  });

  blocks.push({
    id: "longform-mistakes",
    anchorId: "seo-common-mistakes",
    heading: `Common mistakes to avoid with ${topic} in ${place}`,
    paragraphs: [
      `Choosing the lowest phone quote without measurement is the most frequent mistake we see in ${place}. Two balconies on the same street can need different hook counts and access time.`,
      `Another issue is installing economy materials on exposed elevations, then facing early corrosion or sagging after monsoon. Spend once on the correct grade for ${city} weather.`,
      `Skipping society approval or weekend restrictions can delay install day. Share access rules early so ${company} can schedule ${topic} work smoothly in your community.`,
    ],
    listItems: [
      "Do not confirm price from photos alone",
      "Do not ignore floor height and access",
      "Do not mix unmarked cables or mesh",
      "Do not delay post-monsoon visual checks",
    ],
  });

  blocks.push(...buildAreaDirectoryBlocks(topic, place, city, company, serviceSlug));

  blocks.push({
    id: "longform-eeat",
    anchorId: "seo-eeat",
    heading: `Why ${company} for ${topic} in ${place}`,
    paragraphs: [
      `${company}, led by ${BUSINESS_CONFIG.ownerName}, focuses on home safety installations across ${city} from ${BUSINESS_CONFIG.address.street}.`,
      `Experience shows in measurement discipline, neat finishing and honest conversations about what will and will not work on a given balcony in ${place}.`,
      `Contact ${BUSINESS_CONFIG.phone.display} or email ${BUSINESS_CONFIG.email} for ${topic} support in ${place}. WhatsApp ${BUSINESS_CONFIG.whatsapp.display} is available for photos and quick scheduling.`,
      `This page is maintained as a comprehensive ${topic} resource for ${place} so homeowners can research thoroughly before requesting a free site inspection.`,
      `From apartments near IT corridors to independent houses across ${city}, our process stays the same: inspect, specify, install, verify and support — with transparent communication at every step.`,
    ],
  });

  const faqs = buildFaqBank(topic, place, city, company, serviceSlug);

  // Pad with natural locality FAQs (readable — not "question 1, 2, 3")
  let wordCount = countBlockWords(blocks, faqs);
  const padAreas = getServedAreas().slice(80);
  let pad = 0;
  while (wordCount < ULTRA_LONGFORM_WORD_TARGET && pad < padAreas.length) {
    const area = padAreas[pad]!;
    const angle = DEPTH_ANGLES[pad % DEPTH_ANGLES.length]!;
    faqs.push({
      question: `Is ${topic} available in ${area.name} near ${place}?`,
      answer: `Yes. ${company} installs ${topic} in ${area.name} and nearby ${city} localities. We review ${angle} during inspection and share a written quotation for your openings. ${area.introduction}`,
    });
    pad += 1;
    wordCount = countBlockWords(blocks, faqs);
  }

  const tableOfContents = blocks
    .filter((b) => b.anchorId)
    .map((b) => ({ label: b.heading, href: `#${b.anchorId}` }));

  return { blocks, faqs, wordCount, tableOfContents };
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
    ...(base.tableOfContents ?? base.blocks.filter((b) => b.anchorId).map((b) => ({ label: b.heading, href: `#${b.anchorId}` }))),
    ...longform.tableOfContents,
  ];
  const wordCount = countBlockWords(blocks, faqs);
  return { blocks, faqs, tableOfContents, wordCount, longformWordCount: longform.wordCount };
}
