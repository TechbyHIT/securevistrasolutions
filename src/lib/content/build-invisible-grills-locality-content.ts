import { BUSINESS_CONFIG } from "@/config/business";
import { buildIntentPageUrl, buildAreaPageUrl, DEFAULT_LOCATION_SLUG } from "@/config/mega-menu";
import { getAreaById, getServedAreas } from "@/data/initial-areas";
import { getLocationById } from "@/data/initial-locations";
import { getPublishedServices } from "@/data/initial-services";
import {
  formatIntentPhrase,
  getKeywordIntentBySlug,
  getSampleIntentsForService,
} from "@/data/keyword-intents";
import { buildInvisibleGrillsInstallationPath } from "@/lib/utils/installation-in-locality-slug";
import { buildServiceInCityPath } from "@/lib/utils/service-in-city-slug";
import {
  buildLocalityMeta,
  buildUniqueLocalityFaqs,
  buildUniqueLocalityIntro,
  buildUniqueLocalSection,
  classifyPropertyMix,
  localitySeed,
  shuffleBySeed,
} from "@/lib/content/build-unique-locality-copy";
import type { Area } from "@/types/location";
import type { ContentBlock, FaqItem } from "@/types/content";

export type SeoLink = { label: string; href: string; group?: string };

export const WHY_CHOOSE_US = [
  "Premium SS316 Stainless Steel Cables",
  "Professional Installation",
  "Rust & Corrosion Resistant",
  "Child & Pet Safety",
  "Balcony & Window Solutions",
  "10+ Years Experience",
  "Affordable Pricing",
  "Free Site Visit",
  "Warranty Support",
  "Fast Installation",
] as const;

export const OUR_SERVICES = [
  { title: "Balcony Invisible Grills", intentSlug: "invisible-grills-for-balcony" },
  { title: "Window Invisible Grills", intentSlug: "invisible-grills-for-window" },
  { title: "Staircase Invisible Grills", intentSlug: "invisible-grills-for-home" },
  { title: "French Window Grills", intentSlug: "invisible-grills-for-windows" },
  { title: "High-Rise Safety Grills", intentSlug: "invisible-grills-for-high-rise" },
  { title: "Apartment Invisible Grills", intentSlug: "invisible-grills-for-apartment" },
  { title: "Villa Invisible Grills", intentSlug: "invisible-grills-for-villa" },
  { title: "Office Invisible Grills", intentSlug: "invisible-grills-for-building" },
] as const;

export const APPLICATIONS = [
  "Apartments",
  "Villas",
  "Independent Houses",
  "Commercial Buildings",
  "Schools",
  "Hospitals",
  "Hotels",
  "Offices",
] as const;

export const BENEFITS = [
  { title: "Clear Outside View", description: "Thin stainless cables keep your balcony open and bright." },
  { title: "Modern Appearance", description: "A clean finish that suits apartments and premium villas." },
  { title: "Child Safety", description: "Custom spacing planned for toddler and family protection." },
  { title: "Pet Protection", description: "Helps stop pets from slipping through railing gaps." },
  { title: "High Tensile Strength", description: "SS316 cables built for everyday residential use." },
  { title: "Weather Resistant", description: "Corrosion-resistant hardware suited to Hyderabad climate." },
  { title: "Low Maintenance", description: "Simple visual checks — no heavy upkeep required." },
  { title: "Long Life", description: "Durable materials with warranty-backed installation." },
] as const;

export const PROCESS_STEPS = [
  {
    title: "Call or WhatsApp",
    description: "Share your locality, property type and balcony or window photos for a quick assessment.",
  },
  {
    title: "Free site visit",
    description: "We measure openings, inspect fixing points and recommend cable grade and spacing.",
  },
  {
    title: "Written quotation",
    description: "Transparent pricing with material grade, quantity, warranty notes and timeline.",
  },
  {
    title: "Professional installation",
    description: "Trained technicians install, tension and finish with neat border work.",
  },
  {
    title: "Safety handover",
    description: "Final inspection, care tips and warranty support after installation.",
  },
] as const;

export const IMAGE_ALT_TEMPLATES = [
  "Invisible Grills Installation in {Locality}",
  "Balcony Invisible Grills in {Locality}",
  "Window Invisible Grills in {Locality}",
  "SS316 Invisible Grills in {Locality}",
  "Apartment Invisible Grills in {Locality}",
  "Modern Invisible Grills in {Locality}",
  "Child Safety Invisible Grills in {Locality}",
] as const;

/** Priority high-intent keyword slugs for conversion-focused linking. */
const HIGH_INTENT_SLUGS = [
  "invisible-grills-cost",
  "invisible-grills-price",
  "invisible-grills-installation-cost",
  "invisible-grills-cost-per-square-feet",
  "invisible-grills-installation",
  "invisible-grills-installer",
  "invisible-grills-installers",
  "invisible-grills-for-balcony",
  "invisible-grills-for-window",
  "invisible-grills-for-apartment",
  "invisible-grills-for-villa",
  "invisible-grills-for-child-safety",
  "invisible-grills-for-pets",
  "invisible-grills-for-high-rise",
  "invisible-grills-quote",
  "invisible-grills-estimate",
  "invisible-grills-affordable",
  "invisible-grills-best",
  "invisible-grills-company",
  "invisible-grills-contractor",
  "invisible-grills-repair",
  "invisible-grills-maintenance",
  "invisible-grills-anti-rust",
  "invisible-grills-for-fall-protection",
  "invisible-grills-professional-installation",
  "invisible-grills-apartment-installation",
  "invisible-grills-with-installation",
  "invisible-grills-material",
  "invisible-grills-design",
  "invisible-grills-booking",
] as const;

function fillLocality(template: string, locality: string): string {
  return template.replace(/\{Locality\}/g, locality);
}

export function getNearbyAreasForLocality(area: Area, limit = 24): Area[] {
  const fromIds = area.nearbyLocationIds
    .map((id) => getAreaById(id))
    .filter((entry): entry is Area => Boolean(entry?.isServed));

  const siblings = getServedAreas(area.parentId).filter((entry) => entry.id !== area.id);
  const merged = [...fromIds];
  for (const sibling of siblings) {
    if (merged.length >= limit) break;
    if (!merged.some((entry) => entry.id === sibling.id)) {
      merged.push(sibling);
    }
  }
  return merged.slice(0, limit);
}

function buildHighIntentLinks(area: Area, citySlug: string): SeoLink[] {
  const links: SeoLink[] = [];
  const seen = new Set<string>();

  for (const slug of HIGH_INTENT_SLUGS) {
    const intent = getKeywordIntentBySlug(slug);
    if (!intent) continue;
    const href = buildIntentPageUrl(intent.serviceSlug, intent.slug, area.slug, citySlug);
    if (seen.has(href)) continue;
    seen.add(href);
    links.push({
      label: formatIntentPhrase(intent, area.name),
      href,
      group: "high-intent",
    });
  }

  for (const intent of getSampleIntentsForService("invisible-grills", 40)) {
    const href = buildIntentPageUrl(intent.serviceSlug, intent.slug, area.slug, citySlug);
    if (seen.has(href)) continue;
    seen.add(href);
    links.push({
      label: formatIntentPhrase(intent, area.name),
      href,
      group: "intent",
    });
  }

  return links;
}

function buildServiceLinks(area: Area, city: string, citySlug: string): SeoLink[] {
  const links: SeoLink[] = [
    {
      label: `Invisible Grills in ${city}`,
      href: buildServiceInCityPath("invisible-grills", citySlug),
      group: "service",
    },
    {
      label: `Invisible Grills service hub`,
      href: "/services/invisible-grills/",
      group: "service",
    },
    {
      label: `${area.name} area guide`,
      href: buildAreaPageUrl(area.slug, citySlug),
      group: "area",
    },
    {
      label: `${city} locations`,
      href: `/locations/${citySlug}/`,
      group: "area",
    },
    {
      label: "Pricing guide",
      href: "/pricing-guide/",
      group: "guide",
    },
    {
      label: "Installation process",
      href: "/installation-process/",
      group: "guide",
    },
    {
      label: "Materials guide",
      href: "/materials-guide/",
      group: "guide",
    },
    {
      label: "Safety guide",
      href: "/safety-guide/",
      group: "guide",
    },
    {
      label: "Contact for free quote",
      href: "/contact/",
      group: "conversion",
    },
  ];

  for (const related of getPublishedServices().filter((s) => s.slug !== "invisible-grills")) {
    links.push({
      label: `${related.name} in ${city}`,
      href: buildServiceInCityPath(related.slug, citySlug),
      group: "related-service",
    });
  }

  return links;
}

export type ContentSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  listItems?: string[];
};

export type InvisibleGrillsLocalityContent = {
  locality: string;
  city: string;
  citySlug: string;
  company: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  introExtended: string[];
  whyLocality: string;
  whyLocalityExtended: string[];
  cta: string;
  whyChooseUs: string[];
  ourServices: { title: string; href: string; description: string }[];
  applications: string[];
  benefits: typeof BENEFITS;
  processSteps: typeof PROCESS_STEPS;
  pricingNotes: string[];
  materialsNotes: string[];
  comparisonNotes: string[];
  maintenanceNotes: string[];
  sections: ContentSection[];
  longformBlocks: ContentBlock[];
  nearbyAreas: Area[];
  moreAreas: Area[];
  faqs: FaqItem[];
  highIntentLinks: SeoLink[];
  nearbyLocalityLinks: SeoLink[];
  moreLocalityLinks: SeoLink[];
  serviceLinks: SeoLink[];
  allInternalLinks: SeoLink[];
  tableOfContents: { label: string; href: string }[];
  imageAlts: string[];
  whatsappHref: string;
  phoneHref: string;
  wordCountEstimate: number;
};

function estimateWords(parts: string[]): number {
  return parts.join(" ").split(/\s+/).filter(Boolean).length;
}

export function buildInvisibleGrillsLocalityContent(area: Area): InvisibleGrillsLocalityContent {
  const locality = area.name;
  const parent = getLocationById(area.parentId);
  const city = parent?.name ?? BUSINESS_CONFIG.address.city;
  const citySlug = parent?.slug ?? DEFAULT_LOCATION_SLUG;
  const company = BUSINESS_CONFIG.name;
  const nearbyAreas = getNearbyAreasForLocality(area, 12);
  const moreAreas = getNearbyAreasForLocality(area, 48).slice(12);
  const nearbyNames = nearbyAreas.map((a) => a.name);
  const seed = localitySeed(area.slug);
  const mix = classifyPropertyMix(area);

  const meta = buildLocalityMeta({ locality, city, company, area });
  const uniqueIntro = buildUniqueLocalityIntro({
    company,
    locality,
    city,
    area,
    nearbyNames,
  });
  const uniqueLocal = buildUniqueLocalSection({
    locality,
    city,
    area,
    nearbyNames,
  });

  const title = meta.title;
  const metaDescription = meta.metaDescription;
  const h1 = meta.h1;
  const intro = uniqueIntro.intro;
  const introExtended = uniqueIntro.paragraphs;
  const whyLocality = uniqueLocal.lead;
  const whyLocalityExtended = uniqueLocal.paragraphs;

  const pricingNotes = shuffleBySeed(
    [
      `Invisible grill pricing in ${locality} depends on measured openings, floor access, cable grade and child/pet spacing — confirmed after a free site visit.`,
      `Ask for a written quotation for ${locality} that lists SS304/SS316 grade, quantity and warranty rather than a phone-only rate.`,
      mix.hasApartments
        ? `Apartment jobs in ${locality} may need society entry timing; that labour window is reflected in the final quote when applicable.`
        : `Villa or independent-home openings in ${locality} are priced per opening once spans and fixing points are measured.`,
      `Compare ${locality} installers on measurement process and cable quality, not headline cost alone.`,
    ],
    seed,
  );

  const materialsNotes = shuffleBySeed(
    [
      `For exposed ${locality} balconies, ${company} often recommends SS316 stainless cables for corrosion resistance in ${city} weather.`,
      `SS304 remains suitable for sheltered openings in ${locality}; we explain the trade-off during inspection.`,
      `Cable spacing for ${mix.primaryLabel} in ${locality} is planned around who uses the space — toddlers, pets or view-first households.`,
      `Hardware and end fittings are matched to railing colour and surface type found on the ${locality} property.`,
    ],
    seed + 3,
  );

  const comparisonNotes = shuffleBySeed(
    [
      `Invisible grills vs iron grills in ${locality}: cables keep light and skyline views; iron work is more opaque and facade-heavy.`,
      `Some ${locality} families pair invisible grills on edges with safety nets where bird control is also needed.`,
      `Professional installation in ${locality} reduces the callback risk we see from poorly tensioned DIY kits.`,
    ],
    seed + 7,
  );

  const maintenanceNotes = [
    `After installation in ${locality}, wipe cables with a soft dry cloth and avoid harsh chemicals.`,
    `Check for sagging or impact damage after monsoon — ${company} can advise on re-tensioning for ${locality} sites.`,
    `WhatsApp support covers warranty questions and follow-up visits across ${locality} and nearby ${city} areas.`,
  ];

  const cta = `Looking for invisible grill installation in ${locality}? Request a free site assessment from ${company}.`;

  const applicationPool = [
    mix.hasApartments ? "Apartment balconies" : null,
    mix.hasApartments ? "High-rise windows" : null,
    mix.hasVillas ? "Villa sit-outs" : null,
    mix.hasVillas ? "Staircase edges" : null,
    mix.hasGated ? "Gated-community balconies" : null,
    mix.hasCommercial ? "Commercial ledges" : null,
    "Child-safety openings",
    "Pet-safe railing gaps",
    "French windows",
    "Terrace edges",
  ].filter(Boolean) as string[];
  const applications = shuffleBySeed(applicationPool, seed).slice(0, 6);

  const ourServices = OUR_SERVICES.map((item) => {
    const intent = getKeywordIntentBySlug(item.intentSlug);
    return {
      title: item.title,
      href: buildIntentPageUrl("invisible-grills", item.intentSlug, area.slug, citySlug),
      description: intent
        ? formatIntentPhrase(intent, locality)
        : `${item.title} installation in ${locality}`,
    };
  });

  const faqs: FaqItem[] = buildUniqueLocalityFaqs({
    locality,
    city,
    company,
    area,
    nearbyNames,
  });

  const highIntentLinks = buildHighIntentLinks(area, citySlug).slice(0, 24);
  const nearbyLocalityLinks = nearbyAreas.map((nearby) => ({
    label: `Invisible Grills Installation in ${nearby.name}`,
    href: buildInvisibleGrillsInstallationPath(nearby.slug),
    group: "nearby-locality",
  }));
  const moreLocalityLinks = moreAreas.map((nearby) => ({
    label: `Invisible Grills Installation in ${nearby.name}`,
    href: buildInvisibleGrillsInstallationPath(nearby.slug),
    group: "more-locality",
  }));
  const serviceLinks = buildServiceLinks(area, city, citySlug);

  const allInternalLinks = [
    ...highIntentLinks,
    ...nearbyLocalityLinks,
    ...moreLocalityLinks.slice(0, 24),
    ...serviceLinks,
    ...ourServices.map((s) => ({ label: s.title, href: s.href, group: "service-type" })),
  ];

  const processParagraphs = shuffleBySeed(
    [
      `In ${locality} we start with enquiry and photos, then an on-site measurement of every opening you want protected.`,
      `Next comes material recommendation (SS304 or SS316), spacing for safety needs, and a written quotation for ${locality}.`,
      `Installation day covers frame/anchor preparation, cable fixing, tensioning and a final safety check before handover.`,
      `Society or gated-community access in ${locality} is planned up front so technicians arrive in the approved window.`,
    ],
    seed + 11,
  );

  const sections: ContentSection[] = [
    {
      id: "overview",
      heading: `Invisible grills installation in ${locality}`,
      paragraphs: introExtended,
      listItems: uniqueLocal.listItems.slice(0, 6),
    },
    {
      id: "local-demand",
      heading: `Why this service matters in ${locality}`,
      paragraphs: whyLocalityExtended,
      listItems: area.localCharacteristics.slice(0, 6),
    },
    {
      id: "pricing",
      heading: `Pricing factors for ${locality}`,
      paragraphs: pricingNotes,
      listItems: [
        "Measured opening size",
        "Floor access",
        "Cable grade",
        "Custom spacing",
        "Number of openings",
      ],
    },
    {
      id: "materials",
      heading: `Materials & quality for ${locality} installs`,
      paragraphs: materialsNotes,
    },
    {
      id: "comparison",
      heading: "Invisible grills vs other options",
      paragraphs: comparisonNotes,
    },
    {
      id: "process",
      heading: `Installation process in ${locality}`,
      paragraphs: processParagraphs,
    },
    {
      id: "maintenance",
      heading: "Maintenance & after-sales",
      paragraphs: maintenanceNotes,
    },
  ];

  // Lightweight related blocks — no 45k-word padding bank
  const longformBlocks: ContentBlock[] = [
    {
      type: "rich-text",
      heading: `Service coverage around ${locality}`,
      paragraphs: [
        `${company} serves ${locality} within ${city}${area.district ? `, ${area.district}` : ""}${area.state ? `, ${area.state}` : ""}.`,
        nearbyNames.length
          ? `Nearby localities with active coverage include ${nearbyNames.slice(0, 8).join(", ")}.`
          : `Share your landmark in ${locality} when you enquire so we confirm the next inspection slot.`,
      ],
    },
  ];

  const tableOfContents = [
    { label: "Overview", href: "#overview" },
    { label: `Why ${locality}`, href: "#local-demand" },
    { label: "Why choose us", href: "#why-choose-us" },
    { label: "Applications", href: "#applications" },
    { label: "Benefits", href: "#benefits" },
    { label: "Pricing", href: "#pricing" },
    { label: "Materials", href: "#materials" },
    { label: "Process", href: "#process" },
    { label: "Gallery", href: "#gallery" },
    { label: "Nearby areas", href: "#nearby-areas" },
    { label: "FAQs", href: "#faqs" },
    { label: "Get a quote", href: "#quote" },
  ];

  const imageAlts = IMAGE_ALT_TEMPLATES.map((template) => fillLocality(template, locality));

  const whatsappText = encodeURIComponent(
    `Hi, I need invisible grills installation in ${locality}. Please share a free site visit.`,
  );

  const wordCountEstimate = estimateWords([
    ...introExtended,
    ...whyLocalityExtended,
    ...pricingNotes,
    ...materialsNotes,
    ...comparisonNotes,
    ...maintenanceNotes,
    ...processParagraphs,
    ...faqs.flatMap((f) => [f.question, f.answer]),
    cta,
    ...WHY_CHOOSE_US,
    ...applications,
  ]);

  return {
    locality,
    city,
    citySlug,
    company,
    title,
    metaDescription,
    h1,
    intro,
    introExtended,
    whyLocality,
    whyLocalityExtended,
    cta,
    whyChooseUs: [...WHY_CHOOSE_US],
    ourServices,
    applications,
    benefits: BENEFITS,
    processSteps: PROCESS_STEPS,
    pricingNotes,
    materialsNotes,
    comparisonNotes,
    maintenanceNotes,
    sections,
    longformBlocks,
    nearbyAreas,
    moreAreas,
    faqs,
    highIntentLinks,
    nearbyLocalityLinks,
    moreLocalityLinks,
    serviceLinks,
    allInternalLinks,
    tableOfContents,
    imageAlts,
    whatsappHref: `https://wa.me/${BUSINESS_CONFIG.whatsapp.raw}?text=${whatsappText}`,
    phoneHref: `tel:${BUSINESS_CONFIG.phone.raw}`,
    wordCountEstimate,
  };
}
