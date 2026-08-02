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
import { buildUltraLongformSeo } from "@/lib/content/build-ultra-longform-seo";
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
    links.push({
      label: `${related.name} in ${area.name}`,
      href: `/${citySlug}/${area.slug}/${related.slug}/`,
      group: "related-service-area",
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

  const title = `Invisible Grills Installation in ${locality} | Balcony & Window Safety | ${company}`;
  const metaDescription = `Looking for invisible grills installation in ${locality}? ${company} provides premium SS316 invisible grills for balconies, windows, apartments, villas, and commercial buildings in ${locality}, ${city}. Free site visit and quotation.`;
  const h1 = `Invisible Grills Installation in ${locality}`;

  const intro = `${company} is a trusted provider of invisible grill installation in ${locality}. We supply high-quality stainless steel cable invisible grills that enhance safety without blocking your view. Our experienced team serves apartments, villas, independent houses, and commercial buildings across ${locality} with professional installation and reliable after-sales support.`;

  const introExtended = [
    intro,
    `Homeowners in ${locality} often search for balcony invisible grills, window invisible grills and child-safe railing protection after comparing conventional iron grills. Stainless cable systems keep natural light and ventilation while reducing fall risk for children and pets.`,
    area.introduction,
    area.localDescription,
    `${company} starts every ${locality} project with a free site visit. We measure openings, check railing posts and slab edges, recommend SS316 or SS304 cable grades, and share a written quotation before installation is scheduled.`,
    `Whether you need a single balcony package or multi-opening coverage for a villa or high-rise flat in ${locality}, our installers coordinate with society access timings and leave a neat finish ready for everyday use.`,
  ];

  const whyLocality = `Many residential apartments and villas in ${locality} require modern balcony safety solutions without affecting ventilation or aesthetics. Our invisible grills provide maximum safety while maintaining an open and elegant appearance.`;

  const whyLocalityExtended = [
    whyLocality,
    `${locality} housing mixes high-rise towers, gated communities and independent homes. Open railing gaps, deep balconies and west-facing windows create different fixing needs — which is why phone-only quotes are rarely accurate.`,
    `Families moving into ${locality} apartments frequently book invisible grills during handover or soon after possession. Early installation is simpler before furniture and AC outdoor units complicate access.`,
    `Local weather in ${city} includes hot summers and monsoon humidity. SS316 stainless cables and corrosion-resistant hardware are preferred for long service life on exposed balconies in ${locality}.`,
    area.serviceDemandNotes.join(" "),
    `Popular property patterns in ${locality} include ${area.propertyTypes.join(", ")}. We adapt cable spacing and frame finishing to each property type rather than using one fixed layout.`,
  ];

  const pricingNotes = [
    `Invisible grills price in ${locality} depends on total square footage, floor height, access difficulty, cable grade (SS304 vs SS316) and custom spacing for child or pet safety.`,
    `Indicative ranges for ${city} projects often fall between economy cable systems and premium SS316 packages. Your free site visit in ${locality} confirms exact quantity and hardware.`,
    `Ask for a written quotation that lists material grade, measured openings, warranty terms and what is included — scaffolding, society permissions or weekend work may affect final cost.`,
    `Compare installers on measurement process and cable quality, not headline rate alone. Loose tension or unmarked cables can fail sooner in ${locality}'s sun and rain exposure.`,
  ];

  const materialsNotes = [
    `For invisible grills installation in ${locality}, we primarily recommend premium SS316 stainless steel cables for superior rust and corrosion resistance.`,
    `SS304 remains a reliable option for standard residential openings with moderate exposure. Frames and end fittings are selected to match railing colour and surface type.`,
    `Cable spacing is planned for your household — tighter layouts for toddlers and pets, balanced spacing where view retention is the priority.`,
    `All hardware used on ${locality} projects is chosen for tensile strength and neat finishing, with warranty support on materials and workmanship.`,
  ];

  const comparisonNotes = [
    `Invisible grills vs conventional iron grills in ${locality}: cable systems preserve views and light; iron grills cost less upfront but dominate the facade and reduce openness.`,
    `Invisible grills vs safety nets: many families combine both — rigid cable protection on edges plus mesh for bird control or extra child safety on selected openings.`,
    `DIY kits vs professional installation: incorrect fixing is the most common failure we see on callback visits. Measurement-led installation protects warranty and safety outcomes.`,
  ];

  const maintenanceNotes = [
    `After invisible grills installation in ${locality}, wipe cables with a dry cloth periodically and avoid harsh chemicals.`,
    `Schedule a quick visual check after monsoon — look for sagging, loose end fittings or impact damage from sports or construction debris.`,
    `${company} provides WhatsApp support for tension checks, section replacements and warranty questions across ${locality} and nearby areas.`,
  ];

  const cta = `Looking for professional invisible grill installation in ${locality}? Contact ${company} today for a free site inspection and quotation.`;

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

  const faqs: FaqItem[] = [
    {
      question: `What is the price of invisible grills in ${locality}?`,
      answer: `Pricing depends on the installation area, floor height and cable specifications in ${locality}. Contact ${company} for a free quotation after site measurement.`,
    },
    {
      question: "Which stainless steel cable do you use?",
      answer:
        "We use premium SS316 stainless steel cables for durability and corrosion resistance, with SS304 options for standard residential applications.",
    },
    {
      question: "Are invisible grills safe for children?",
      answer:
        "Yes. They are designed to provide excellent safety for children and pets when spacing is planned for your household during inspection.",
    },
    {
      question: "How many days does installation take?",
      answer:
        "Most installations are completed within 1–2 days after measurement, depending on opening count and society access timings.",
    },
    {
      question: "Do you provide warranty?",
      answer: "Yes. Warranty is provided on installation and materials as listed in your written quotation.",
    },
    {
      question: `Do you install balcony invisible grills in ${locality} apartments?`,
      answer: `Yes. Balcony and window invisible grills for apartments, villas and high-rise homes are our most common ${locality} projects.`,
    },
    {
      question: `Can I get invisible grills cost per square feet in ${locality}?`,
      answer: `We share indicative per sq ft ranges and confirm exact cost after measuring your openings in ${locality}. Photo-only quotes are not accurate.`,
    },
    {
      question: "Is drilling required for installation?",
      answer:
        "Most installations use secure fixing to railing posts, frames or approved surfaces. We explain the method during the free site visit.",
    },
    {
      question: `Do you serve nearby areas around ${locality}?`,
      answer: `Yes. We regularly install across ${nearbyAreas
        .slice(0, 5)
        .map((a) => a.name)
        .join(", ")} and many more ${city} localities.`,
    },
    {
      question: "How do I book a free site visit?",
      answer: `Call ${BUSINESS_CONFIG.phone.display} or WhatsApp ${BUSINESS_CONFIG.whatsapp.display} with your ${locality} address and opening photos.`,
    },
    {
      question: `Are invisible grills suitable for west-facing balconies in ${locality}?`,
      answer:
        "Yes. We recommend corrosion-resistant SS316 cables and quality end fittings for sun-exposed and monsoon-facing openings.",
    },
    {
      question: "Can you repair or upgrade existing invisible grills?",
      answer: `We handle re-tensioning, section replacement and upgrades for existing installations in ${locality}. Send photos for a preliminary assessment.`,
    },
  ];

  const highIntentLinks = buildHighIntentLinks(area, citySlug);
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
    ...moreLocalityLinks,
    ...serviceLinks,
    ...ourServices.map((s) => ({ label: s.title, href: s.href, group: "service-type" })),
  ];

  const sections: ContentSection[] = [
    {
      id: "overview",
      heading: `Complete guide to invisible grills installation in ${locality}`,
      paragraphs: introExtended,
      listItems: [
        `Balcony invisible grills in ${locality}`,
        `Window invisible grills for apartments and villas`,
        `Child and pet safety cable spacing`,
        `SS316 rust-resistant materials`,
        `Free site visit and written quotation`,
      ],
    },
    {
      id: "pricing",
      heading: `Invisible grills price & cost factors in ${locality}`,
      paragraphs: pricingNotes,
      listItems: [
        "Opening size and total sq ft",
        "Floor height and access",
        "SS304 vs SS316 cable grade",
        "Custom child/pet spacing",
        "Multi-balcony packages",
      ],
    },
    {
      id: "materials",
      heading: `SS316 materials used for ${locality} installations`,
      paragraphs: materialsNotes,
    },
    {
      id: "comparison",
      heading: "Invisible grills vs iron grills vs safety nets",
      paragraphs: comparisonNotes,
    },
    {
      id: "process",
      heading: `Our installation process in ${locality}`,
      paragraphs: [
        `Every ${locality} project follows a clear path: enquire, inspect, quote, install and hand over. Skipping measurement is where cheap installations fail — we do not skip it.`,
      ],
    },
    {
      id: "maintenance",
      heading: "Maintenance, repair & after-sales support",
      paragraphs: maintenanceNotes,
    },
    {
      id: "local-demand",
      heading: `Why homeowners in ${locality} choose invisible grills`,
      paragraphs: whyLocalityExtended,
      listItems: area.localCharacteristics,
    },
  ];

  const longform = buildUltraLongformSeo({
    topic: "Invisible Grills Installation",
    placeName: locality,
    cityName: city,
    company,
    serviceSlug: "invisible-grills",
    areaSlug: area.slug,
    pageType: "invisible-grills-installation-in-locality",
  });

  const combinedFaqs = [...faqs, ...longform.faqs];

  const tableOfContents = [
    { label: "Overview", href: "#overview" },
    { label: "Why choose us", href: "#why-choose-us" },
    { label: "High-intent services", href: "#high-intent" },
    { label: "Our services", href: "#our-services" },
    { label: "Applications", href: "#applications" },
    { label: "Benefits", href: "#benefits" },
    { label: "Pricing", href: "#pricing" },
    { label: "Materials", href: "#materials" },
    { label: "Process", href: "#process" },
    { label: "Comparison", href: "#comparison" },
    { label: `Why ${locality}`, href: "#local-demand" },
    { label: "Gallery", href: "#gallery" },
    { label: "Nearby areas", href: "#nearby-areas" },
    { label: "More localities", href: "#more-localities" },
    { label: "Related services", href: "#related-services" },
    { label: "SEO deep guide", href: "#seo-deep-guide" },
    { label: "Coverage directory", href: "#seo-areas-1" },
    { label: "FAQs", href: "#faqs" },
    { label: "Get a quote", href: "#quote" },
    ...longform.tableOfContents.slice(0, 20),
  ];

  const imageAlts = IMAGE_ALT_TEMPLATES.map((template) => fillLocality(template, locality));

  const whatsappText = encodeURIComponent(
    `Hi, I need invisible grills installation in ${locality}. Please share a free site visit.`,
  );

  const wordCountEstimate =
    estimateWords([
      ...introExtended,
      ...whyLocalityExtended,
      ...pricingNotes,
      ...materialsNotes,
      ...comparisonNotes,
      ...maintenanceNotes,
      ...faqs.flatMap((f) => [f.question, f.answer]),
      cta,
      ...WHY_CHOOSE_US,
      ...APPLICATIONS,
    ]) + longform.wordCount;

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
    applications: [...APPLICATIONS],
    benefits: BENEFITS,
    processSteps: PROCESS_STEPS,
    pricingNotes,
    materialsNotes,
    comparisonNotes,
    maintenanceNotes,
    sections,
    longformBlocks: longform.blocks,
    nearbyAreas,
    moreAreas,
    faqs: combinedFaqs,
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
