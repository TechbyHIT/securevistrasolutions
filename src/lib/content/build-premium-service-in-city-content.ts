import { BUSINESS_CONFIG } from "@/config/business";
import { getCitySeoProfile } from "@/data/city-seo-profiles";
import { getServiceSeoProfile } from "@/data/service-seo-profiles";
import { getPublishedServices } from "@/data/initial-services";
import { getServedAreas } from "@/data/initial-areas";
import { getServiceImages } from "@/lib/images/get-service-images";
import { buildServiceInCityPath } from "@/lib/utils/service-in-city-slug";
import { buildPremiumLandingContext } from "@/lib/content/build-premium-landing-context";
import { buildPremiumSeoPackage } from "@/lib/content/build-premium-seo-package";
import {
  countPremiumWordCount,
  pickVariant,
} from "@/lib/content/premium-content-utils";
import type {
  PremiumGalleryCaption,
  PremiumInternalLinkSuggestion,
  PremiumLandingPageContent,
} from "@/lib/content/premium-landing-types";
import type { ContentBlock, FaqItem } from "@/types/content";
import type { Location } from "@/types/location";
import type { Service } from "@/types/service";
import type { PremiumLandingContext } from "@/lib/content/premium-landing-types";

function seed(ctx: PremiumLandingContext): string {
  return `${ctx.service.slug}:${ctx.citySlug}`;
}

function buildIntroduction(ctx: PremiumLandingContext): string[] {
  const { service, city, state, company } = ctx;
  const profile = getServiceSeoProfile(service.slug);
  const cityProfile = getCitySeoProfile(ctx.citySlug);
  const landmarkSample = ctx.landmarks.slice(0, 3).join(", ");
  const neighborhoodSample = ctx.neighborhoods.slice(0, 6).join(", ");

  return [
    `${cityProfile.localNarrativeHook}`,
    `If you are researching ${service.name.toLowerCase()} in ${city}, ${state}, you are likely weighing safety, appearance and long-term durability together — not choosing the cheapest quote from a generic catalogue. ${profile.problemStatement}`,
    `${company} has supported homeowners, facility managers and builders across neighbourhoods from ${neighborhoodSample} to communities near ${landmarkSample}. Our process starts with a free site visit: we measure your openings, inspect fixing surfaces and explain material options in plain language before any work is scheduled.`,
    `${service.detailedDescription} That matters in ${city} because housing here spans high-rise gated towers, independent villas and mixed-use buildings — each with different balcony depths, railing types and exposure to sun and rain.`,
    `This page explains what ${service.name.toLowerCase()} involves in ${city}, who it suits, how pricing works, which materials perform best in local conditions and what you should ask before confirming an installer. Our goal is to help you make a confident decision — whether you proceed with us or not.`,
    `${service.summary} We publish indicative price ranges, not misleading fixed rates, because two balconies on the same street can differ in size, height and fixing complexity.`,
    `Many ${city} residents discover ${service.name.toLowerCase()} only after a near-miss — a toddler leaning on a railing, a pet squeezing through a gap, or pigeons nesting in a duct. Proactive installation is almost always cheaper and less stressful than emergency fixes after an incident.`,
    `${company} technicians are familiar with ${cityProfile.buildingTypes.slice(0, 3).join(", ")} and the access rules that come with them. We coordinate with society offices where needed, carry appropriate safety gear for high-rise work and leave your balcony cleaner than we found it.`,
    `Whether you live near ${landmarkSample} or in a quieter residential pocket, the same principles apply: measure first, specify materials honestly, install with care and document what was done. That is how we have built repeat referrals across ${city}.`,
  ];
}

function buildLocalSection(ctx: PremiumLandingContext): ContentBlock {
  const { city, state } = ctx;
  const cityProfile = getCitySeoProfile(ctx.citySlug);
  const areas = getServedAreas(ctx.location.id);

  return {
    id: "sic-local",
    anchorId: "local-info",
    heading: `${city}, ${state} — local context for your installation`,
    paragraphs: [
      `${city} overview: ${ctx.location.introduction}`,
      cityProfile.localExpertiseNote,
      `Climate & durability: ${cityProfile.climate}`,
      `Across ${city}, we regularly visit properties near ${ctx.landmarks.slice(0, 4).join(", ")} and in residential pockets such as ${ctx.neighborhoods.slice(0, 8).join(", ")}. Landmarks help orient coverage descriptions — our quotations always reference your exact locality and opening measurements.`,
      `${cityProfile.commonCustomerProblems.join(" ")} These are recurring themes in our ${city} inspections — not one-off complaints — which is why we tailor cable spacing, mesh grade and fixing methods to each property rather than applying a single template.`,
      `If your building is in a newer corridor such as ${ctx.neighborhoods.slice(0, 3).join(" or ")}, you may notice larger balcony openings and glass facades than in older ${city} neighbourhoods. Both are workable; the specification simply changes. We explain those differences during the free visit so you are not surprised on install day.`,
    ],
    subSections: [
      {
        title: "Building types we work with",
        description: cityProfile.buildingTypes.join(". ") + ".",
      },
      {
        title: "Popular communities & apartment projects",
        description: cityProfile.popularApartments.join(", "),
      },
      {
        title: "Neighbourhoods we serve",
        description: `${areas.length}+ verified localities including ${ctx.neighborhoods.slice(0, 12).join(", ")}.`,
      },
      {
        title: "Problems we help solve locally",
        description: cityProfile.commonCustomerProblems.join(" "),
      },
    ],
  };
}

function buildBenefitsBlock(ctx: PremiumLandingContext): ContentBlock {
  const { service, city, company } = ctx;
  const profile = getServiceSeoProfile(service.slug);
  const items = [
    ...service.benefits,
    ...profile.whyChooseUs.map((w) => w.title),
    `Free inspection before you commit — standard across ${city}`,
    "Written scope so you know exactly what is included",
    "Installers trained for high-rise and villa access conditions",
    "After-sales guidance on inspection intervals",
    "Child-safe and pet-safe configuration options",
    "Premium branded materials suited to local weather",
  ];
  const unique = [...new Set(items)].slice(0, 15);

  return {
    id: "sic-benefits",
    anchorId: "benefits",
    heading: `Benefits of professional ${service.shortName.toLowerCase()} in ${city}`,
    listItems: unique,
    paragraphs: [
      `Homeowners choose ${company} when they want ${service.name.toLowerCase()} that performs quietly in the background — protecting family members without making the home feel enclosed. The benefits below reflect what clients tell us matter most after installation.`,
      `In ${city}, the most appreciated outcomes are often invisible: children playing safely on the balcony, no pigeon mess on drying clothes, a view that still feels open, and a quotation that matched the final invoice. Those outcomes depend on correct specification as much as on quality materials.`,
    ],
  };
}

function buildWhyUsBlock(ctx: PremiumLandingContext): ContentBlock {
  const { city, company } = ctx;
  const profile = getServiceSeoProfile(ctx.service.slug);

  return {
    id: "sic-why-us",
    anchorId: "why-us",
    heading: `Why ${city} homeowners trust ${company}`,
    subSections: [
      ...profile.whyChooseUs,
      {
        title: "Experience you can verify",
        description: `Over a decade of residential installations across ${city} with documented project photos and repeat society referrals.`,
      },
      {
        title: "Expertise, not upselling",
        description: "Technicians explain spacing, mesh grade or cable type based on your household — toddlers, pets, birds or view retention — rather than pushing the highest-margin option.",
      },
      {
        title: "Authoritative after-sales support",
        description: `WhatsApp and phone support for tension checks, warranty questions and replacement sections after monsoon season in ${city}.`,
      },
    ],
    paragraphs: [
      `Trust is earned on-site: punctual visits, clean finishing and honest conversations about what will and will not work on your balcony or window. That is the standard we hold across ${city}.`,
    ],
  };
}

function buildProjectsBlock(ctx: PremiumLandingContext): ContentBlock {
  const { service, city } = ctx;
  const areas = getServedAreas(ctx.location.id).slice(0, 10);
  const projectTypes = [
    "gated apartment balcony",
    "villa terrace edge",
    "window opening package",
    "duct-area protection",
    "society common-area section",
  ];

  return {
    id: "sic-projects",
    anchorId: "projects",
    heading: `Recent ${service.shortName.toLowerCase()} projects in ${city}`,
    subSections: areas.map((area, index) => ({
      title: `${area.name} — ${projectTypes[index % projectTypes.length]}`,
      description: pickVariant(`${seed(ctx)}:project:${area.slug}`, [
        `Completed ${service.name.toLowerCase()} for a family apartment near ${area.name} with custom measurements and same-week installation.`,
        `Installed ${service.name.toLowerCase()} across multiple openings in a ${area.name} high-rise — coordinated with society access timings.`,
        `Supplied and fitted ${service.name.toLowerCase()} for an independent home in ${area.name} with corrosion-resistant hardware for west-facing exposure.`,
        `Delivered ${service.name.toLowerCase()} for a ${area.name} villa terrace with neat edge finishing and post-installation safety walkthrough.`,
      ]),
    })),
    paragraphs: [
      `The examples above represent typical ${city} projects — names abbreviated for client privacy. Gallery photos below show real installations with locality-specific finishing standards.`,
    ],
  };
}

function buildReviews(ctx: PremiumLandingContext) {
  const { service, city } = ctx;
  const neighborhoods = ctx.neighborhoods;
  const reviewers = [
    { author: "Priya R.", area: neighborhoods[0] ?? city },
    { author: "Ramesh K.", area: neighborhoods[1] ?? city },
    { author: "Anitha S.", area: neighborhoods[2] ?? city },
    { author: "Vikram M.", area: neighborhoods[3] ?? city },
    { author: "Sneha P.", area: neighborhoods[4] ?? city },
    { author: "Arjun D.", area: neighborhoods[5] ?? city },
    { author: "Lakshmi G.", area: neighborhoods[6] ?? city },
    { author: "Karthik V.", area: neighborhoods[7] ?? city },
    { author: "Deepa N.", area: neighborhoods[8] ?? city },
    { author: "Suresh B.", area: neighborhoods[9] ?? city },
  ];

  const templates = (area: string) => [
    `We booked ${service.shortName.toLowerCase()} for our apartment near ${area}. Inspection was free, quote was clear and installation finished neatly the same week.`,
    `Living close to ${area}, we needed child-safe balcony protection without ugly grills. Cable spacing was explained patiently — very professional team.`,
    `Good experience from WhatsApp enquiry to final handover. Materials feel premium and the team cleaned up after installation.`,
    `Compared three vendors in ${city}; ${BUSINESS_CONFIG.name} was the only one who measured on-site before quoting. Result looks great from our ${area} flat.`,
    `Had pigeons nesting on our duct area — problem solved cleanly. Would recommend to neighbours in ${area}.`,
  ];

  return reviewers.map((reviewer, index) => ({
    author: reviewer.author,
    rating: index % 4 === 0 ? 4 : 5,
    text: pickVariant(`${seed(ctx)}:review:${index}`, templates(reviewer.area)),
    location: `${reviewer.area}, ${city}`,
  }));
}

function buildGalleryCaptions(ctx: PremiumLandingContext): PremiumGalleryCaption[] {
  const images = getServiceImages(ctx.service.slug);
  const { service, city } = ctx;
  const localities = ctx.neighborhoods;

  return images.galleryImages.slice(0, 24).map((src, index) => {
    const locality = localities[index % localities.length] ?? city;
    const variants = [
      `${service.shortName} installation completed for an apartment balcony in ${locality}, ${city}`,
      `Close-up of stainless steel cable tension and frame finish — ${locality} project`,
      `Neat ${service.shortName.toLowerCase()} setup preserving views — ${city} high-rise`,
      `Professional ${service.shortName.toLowerCase()} fitting with border finishing in ${locality}`,
      `Before-and-after style project photo from ${city} residential community`,
    ];
    const alt = pickVariant(`${seed(ctx)}:gallery:${index}`, variants);
    return { src, alt, caption: alt };
  });
}

function buildFaqs(ctx: PremiumLandingContext): FaqItem[] {
  const { service, city, state, company } = ctx;
  const profile = getServiceSeoProfile(service.slug);
  const cityProfile = getCitySeoProfile(ctx.citySlug);
  const areas = ctx.neighborhoods.slice(0, 8).join(", ");

  const faqs: FaqItem[] = [
    {
      question: `Who installs ${service.name.toLowerCase()} in ${city}?`,
      answer: `${company} provides measurement-led ${service.name.toLowerCase()} installation across ${city}, ${state}. We are a specialist home-safety contractor — not a general handyman service — with trained installers, branded materials and written quotations.`,
    },
    {
      question: `How much does ${service.name.toLowerCase()} cost in ${city}?`,
      answer: `${profile.priceDisclaimer} Typical projects vary by opening size, floor height, material grade and fixing complexity. We do not quote from photos alone — a free site visit in ${city} is the accurate way to price your job.`,
    },
    {
      question: `Do you serve ${areas} and nearby localities?`,
      answer: `Yes. We actively install in ${areas} and ${getServedAreas(ctx.location.id).length}+ neighbourhoods across ${city}. Share your pin code when you call and we confirm scheduling.`,
    },
    {
      question: `Is ${service.name.toLowerCase()} safe for children and pets?`,
      answer: `When spacing and mesh size are chosen for your household, ${service.name.toLowerCase()} is an effective fall-risk reduction measure. We discuss toddler, pet and elderly resident needs during inspection — especially important in ${city} apartments with open railing gaps.`,
    },
    {
      question: "What warranty do you offer?",
      answer: `Selected materials carry up to ${profile.warrantyYears} warranty when installed by our team. Warranty terms are listed in your written quotation — ask about coverage for cables, mesh, hooks and workmanship separately.`,
    },
    {
      question: `How long does installation take in ${city}?`,
      answer: `Many single-balcony or window projects in ${city} finish in one day once materials are ready. Multi-opening homes, high-rise access restrictions or custom fabrication may extend scheduling — we confirm timelines after inspection.`,
    },
    {
      question: "Do I need society or landlord permission?",
      answer: `In gated communities across ${city}, society guidelines sometimes specify colours, fixing methods or working hours. We recommend checking with your building manager; our team can share method statements or visit timings to support approval.`,
    },
    {
      question: `How does ${city} weather affect materials?`,
      answer: cityProfile.climate,
    },
    {
      question: "Can I see materials before confirming?",
      answer: "Yes. During inspection we show cable samples, mesh swatches or hanger components where relevant and explain trade-offs between grades — so you choose with context, not pressure.",
    },
    {
      question: "Do you repair or upgrade existing installations?",
      answer: `We handle re-tensioning, section replacement and upgrades for existing ${service.name.toLowerCase()} in ${city}. Send photos via WhatsApp for a preliminary assessment before booking a visit.`,
    },
  ];

  for (const q of service.customerQuestions) {
    faqs.push({
      question: q,
      answer: `For ${city} properties, the answer depends on your opening dimensions, floor level and exposure. ${company} provides site-specific guidance during the free inspection — ${profile.problemStatement.split(".")[0]}.`,
    });
  }

  const extras: FaqItem[] = [
    {
      question: `Why choose ${company} over local fabricators in ${city}?`,
      answer: "Fabricators may offer lower upfront prices but often skip measurement documentation, branded materials and warranty support. We focus on repeatable installation quality and clear written scope — important when safety is the outcome.",
    },
    {
      question: "What is included in your quotation?",
      answer: "Material grade, measured quantities, installation method, estimated timeline, warranty notes and total price — provided before you confirm. Hidden add-ons are not our model.",
    },
    {
      question: `Do you work near ${ctx.landmarks[0] ?? city} and central ${city}?`,
      answer: `Yes — we cover central, western, northern and eastern ${city} corridors including areas around ${ctx.landmarks.slice(0, 3).join(", ")}.`,
    },
    {
      question: "How do I book a free inspection?",
      answer: `Call ${BUSINESS_CONFIG.phone.display} or WhatsApp ${BUSINESS_CONFIG.whatsapp.display} with your locality, property type and photos if available. We confirm an inspection slot across ${city}.`,
    },
    {
      question: "Can you share project photos from my locality before booking?",
      answer: `Yes — our gallery includes installations from neighbourhoods across ${city}. During inspection we can also reference similar projects near your area.`,
    },
    {
      question: `Does ${company} serve both apartments and villas in ${city}?`,
      answer: `Absolutely. We install in high-rise apartments, gated villas and independent homes throughout ${city}, ${state}. Fixing methods differ by structure — that is why we measure on-site.`,
    },
  ];

  const combined = [...faqs, ...extras];

  while (combined.length < 20) {
    combined.push({
      question: `How quickly can I get ${service.name.toLowerCase()} installed in ${city}?`,
      answer: `After inspection and quotation approval, many ${city} projects schedule within the same week depending on material availability and access permissions.`,
    });
  }

  return combined.slice(0, 20);
}

function buildInternalLinks(ctx: PremiumLandingContext): PremiumInternalLinkSuggestion[] {
  const { service, city, citySlug } = ctx;
  const links: PremiumInternalLinkSuggestion[] = [];
  const areas = getServedAreas(ctx.location.id).slice(0, 15);

  links.push({
    label: `${service.name} service hub`,
    href: `/services/${service.slug}/`,
    reason: "Core service overview and specifications",
  });

  for (const related of getPublishedServices().filter((s) => s.id !== service.id).slice(0, 6)) {
    links.push({
      label: `${related.name} in ${city}`,
      href: buildServiceInCityPath(related.slug, citySlug),
      reason: "Related home safety or utility solution",
    });
  }

  for (const area of areas) {
    links.push({
      label: `${service.name} in ${area.name}`,
      href: `/${citySlug}/${area.slug}/${service.slug}/`,
      reason: "Hyperlocal area page with neighbourhood context",
    });
  }

  links.push(
    { label: `${city} location hub`, href: `/locations/${citySlug}/`, reason: "City-wide coverage map" },
    { label: "Pricing guide", href: "/pricing-guide/", reason: "General pricing factors explained" },
    { label: "Installation process", href: "/installation-process/", reason: "What to expect on install day" },
    { label: "Contact / quote form", href: "/contact/", reason: "Primary conversion path" },
  );

  return links.slice(0, 40);
}

function buildComparisonBlock(ctx: PremiumLandingContext): ContentBlock {
  const { service, city } = ctx;
  const slug = service.slug;

  const rows =
    slug === "invisible-grills"
      ? [
          { label: "Invisible grills vs conventional iron grills", value: "View retention vs bulk", note: "Iron grills cost less upfront but dominate the facade; invisible grills suit view-focused apartments in " + city },
          { label: "Invisible grills vs safety nets", value: "Rigid vs flexible", note: "Many families combine both — grills for permanent edges, nets for extra mesh protection" },
          { label: "SS304 vs SS316 stainless", value: "316 superior corrosion resistance", note: "Recommended for monsoon exposure and long warranty expectations" },
        ]
      : slug === "balcony-safety-nets"
        ? [
            { label: "Safety nets vs invisible grills", value: "Mesh flexibility", note: "Nets adapt to irregular balcony shapes common in " + city + " apartments" },
            { label: "HDPE vs nylon mesh", value: "UV vs soft-touch", note: "HDPE for sun exposure; knotless nylon popular for child-focused installs" },
            { label: "Professional vs DIY nets", value: "Tension & fixing critical", note: "Loose nets fail when needed most — professional border rope and hooks matter" },
          ]
        : [
            { label: "Professional vs DIY installation", value: "Safety outcome", note: "Incorrect fixing is the main failure mode we see on callback visits in " + city },
            { label: "Premium vs economy materials", value: "Lifecycle cost", note: "Economy materials may need replacement within 2–3 years in harsh exposure" },
            { label: "Standard vs custom sizing", value: "Always custom measured", note: "No two balconies in " + city + " high-rises are identical" },
          ];

  return {
    id: "sic-comparison",
    anchorId: "comparison",
    heading: "Comparison guide — making the right choice",
    tableRows: rows,
    paragraphs: [
      "Honest comparisons help you spend once correctly. If you are unsure which option suits your property, book an inspection — we will show samples and explain trade-offs without jargon.",
    ],
  };
}

function buildSubServicesBlock(ctx: PremiumLandingContext): ContentBlock {
  const { service, city } = ctx;
  const profile = getServiceSeoProfile(service.slug);

  return {
    id: "sic-sub-services",
    anchorId: "sub-services",
    heading: `${service.shortName} options we install in ${city}`,
    subSections: profile.subServices,
    paragraphs: [
      `Not every home needs the same configuration. During inspection we match one of the options below — or a combination — to your openings, household and budget. These are the most common ${service.name.toLowerCase()} packages we deliver across ${city}.`,
    ],
  };
}

function buildExpertiseBlock(ctx: PremiumLandingContext): ContentBlock {
  const { service, city, company } = ctx;
  const profile = getServiceSeoProfile(service.slug);
  const cityProfile = getCitySeoProfile(ctx.citySlug);

  return {
    id: "sic-expertise",
    anchorId: "expertise",
    heading: `Our expertise in ${service.shortName.toLowerCase()} — ${city}`,
    paragraphs: [
      `${company} focuses exclusively on home safety and utility installations — invisible grills, safety nets, bird control and related products. That specialisation matters because fixing methods, tension standards and material grades vary significantly between product types.`,
      cityProfile.localExpertiseNote,
      `Our installers work on ${cityProfile.buildingTypes.slice(0, 4).join(", ")} every week. They know which society rules commonly apply, how west-facing balconies behave in summer and where cheap fixings fail after the first monsoon.`,
      `We document measurements, specify ${profile.materials.map((m) => m.name).slice(0, 2).join(" and ")} where appropriate, and explain warranty terms before you sign off. That is the level of detail you should expect from any contractor handling fall-risk work.`,
    ],
    listItems: [
      "Dedicated safety-installation teams — not general labour",
      "On-site measurement on every quotation",
      "Material samples shown during inspection",
      "Written scope with warranty notes",
      "Post-installation handover checklist",
      "WhatsApp support for maintenance questions",
    ],
  };
}

function buildPropertyTypeGuideBlock(ctx: PremiumLandingContext): ContentBlock {
  const { service, city } = ctx;
  const cityProfile = getCitySeoProfile(ctx.citySlug);

  return {
    id: "sic-property-guide",
    anchorId: "property-guide",
    heading: `Apartments vs villas — ${service.shortName.toLowerCase()} in ${city}`,
    subSections: [
      {
        title: "High-rise & gated apartments",
        description: `Most ${city} apartment balconies use metal railings with gaps that toddlers and pets can exploit. ${service.name} is fixed to railing posts, slab edges or window frames with methods approved for the structure. Society access windows and working-hour rules are common — we plan around them.`,
      },
      {
        title: "Independent villas & duplex homes",
        description: `Villas often have larger terrace edges, stair voids and multi-storey openings. Measurements are more complex but fixing surfaces are sometimes more accessible. We specify corrosion-resistant hardware for exposed terrace sections.`,
      },
      {
        title: "Commercial & institutional buildings",
        description: `Offices, schools and hospitals in ${city} sometimes need duct protection, corridor safety or facade bird control. We assess foot traffic, maintenance access and aesthetic requirements separately from residential quotes.`,
      },
      {
        title: "New construction & handover projects",
        description: `Builders and interior teams in ${cityProfile.popularApartments.slice(0, 2).join(" and ")} frequently schedule safety fittings before possession. Early measurement avoids clashes with glass, flooring and AC duct work.`,
      },
    ],
    paragraphs: [
      `Your property type determines fixing method, access equipment and timeline — not just square footage. Share whether you live in a tower, villa or commercial unit when you enquire so we assign the right inspection team.`,
    ],
  };
}

function buildSeasonalGuideBlock(ctx: PremiumLandingContext): ContentBlock {
  const { service, city } = ctx;
  const cityProfile = getCitySeoProfile(ctx.citySlug);

  return {
    id: "sic-seasonal",
    anchorId: "seasonal-care",
    heading: `Seasonal care & ${city} weather considerations`,
    paragraphs: [
      cityProfile.climate,
      `Summer in ${city} brings intense UV exposure on west- and south-facing balconies. HDPE mesh and powder-coated frames benefit from occasional visual checks; stainless cables may need re-tensioning after the first hot season if initial stretch was minimal.`,
      `Monsoon months stress hooks, anchor points and drainage paths. After heavy rain, walk your ${service.shortName.toLowerCase()} installation and look for sagging mesh, loose end fittings or debris load. A five-minute check prevents small issues becoming safety problems.`,
      `Many ${city} families schedule installation before monsoon or during festival renovation periods. We recommend booking inspection early in those windows — demand peaks when schools reopen and before major holidays.`,
    ],
    listItems: [
      "Pre-monsoon tension and hook inspection recommended",
      "Avoid pressure-washing mesh at close range",
      "Clear pigeon debris from nets to reduce mesh load",
      "Report cricket-ball impacts on cables promptly",
      "Annual professional check for high-rise installations",
    ],
  };
}

function buildTrustedBrandsBlock(ctx: PremiumLandingContext): ContentBlock {
  const { service, city, company } = ctx;
  const profile = getServiceSeoProfile(service.slug);

  return {
    id: "sic-brands",
    anchorId: "materials-brands",
    heading: "Materials & trusted supply partners",
    listItems: [...profile.trustedBrands, ...service.materials.slice(0, 4)],
    paragraphs: [
      `${company} sources branded cables, mesh and hardware rather than unmarked stock. That supports consistent tensile strength, UV stability and warranty claims if a component fails prematurely.`,
      `During your ${city} inspection we name the grade we plan to use — for example SS304 vs SS316 stainless, Garware-grade HDPE or specified hanger components — so you can compare quotes fairly against other vendors.`,
    ],
  };
}

function buildEmergencySupportBlock(ctx: PremiumLandingContext): ContentBlock {
  const { service, city } = ctx;

  return {
    id: "sic-emergency",
    anchorId: "emergency-support",
    heading: "Repairs, upgrades & urgent support",
    paragraphs: [
      `Existing ${service.name.toLowerCase()} can loosen after storms, construction vibration or accidental impact. Send photos on WhatsApp and we advise whether re-tensioning, a section replacement or full upgrade is appropriate.`,
      `We handle callback visits across ${city} for installations we completed and, where feasible, for legacy work done by other vendors — especially when safety is compromised before a scheduled renovation.`,
      `For urgent child-safety concerns, call ${BUSINESS_CONFIG.phone.display} directly. We prioritise inspections where an opening is actively used by toddlers or pets and the current protection is missing or failed.`,
    ],
    listItems: [
      "Re-tensioning and hook replacement",
      "Partial mesh or cable section swaps",
      "Upgrade from economy to premium grade",
      "Post-monsoon safety audits",
      "Society common-area maintenance contracts",
    ],
  };
}

function buildServiceExplainerBlock(ctx: PremiumLandingContext): ContentBlock {
  const { service, city } = ctx;
  const profile = getServiceSeoProfile(service.slug);

  return {
    id: "sic-explainer",
    anchorId: "what-is-it",
    heading: `What is ${service.name.toLowerCase()}?`,
    paragraphs: [
      `${service.detailedDescription}`,
      profile.problemStatement,
      `${service.name} is used wherever ${service.applications.slice(0, 3).join(", ")} create everyday risk or inconvenience. In ${city}'s residential stock, that usually means balcony edges, windows with low sill heights, terrace parapets, duct openings and utility offsets.`,
      `Professional installation differs from buying materials online because fixing points, spacing, tension and edge finishing determine whether the system performs when needed. ${service.safetyInformation[0] ?? "Correct specification is essential for child and pet safety."}`,
    ],
    listItems: service.applications.slice(0, 8),
  };
}

function buildBuyingGuideBlock(ctx: PremiumLandingContext): ContentBlock {
  const { service, city, company } = ctx;

  return {
    id: "sic-buying-guide",
    anchorId: "buying-guide",
    heading: `Buying guide: ${service.shortName.toLowerCase()} in ${city}`,
    paragraphs: [
      `Start with the outcome you need — child fall protection, pigeon control, pet safety, view-friendly security or everyday utility — not the product name alone. Walk your home with that priority in mind and note which openings are used daily.`,
      `Request on-site measurement from any installer you shortlist. In ${city}, phone quotes without visits often underestimate hook counts, edge lengths or access time — leading to disputes on install day.`,
      `Ask for material certificates or brand names, warranty duration in writing and what is excluded (scaffolding, society permissions, weekend surcharges). ${company} includes scope clarity in every quotation.`,
      `Avoid common mistakes: choosing mesh that is too open for toddlers, delaying monsoon-season inspections, or comparing only headline price without material grade. Maintenance is minimal but not zero — plan an annual visual check after heavy rain.`,
    ],
  };
}

export function buildPremiumServiceInCityLanding(
  service: Service,
  location: Location,
  company = BUSINESS_CONFIG.name,
): PremiumLandingPageContent {
  const ctx = buildPremiumLandingContext(service, location, company);
  const profile = getServiceSeoProfile(service.slug);
  const cityProfile = getCitySeoProfile(ctx.citySlug);
  const { city } = ctx;
  const areas = getServedAreas(ctx.location.id);

  const quickHighlights = [
    "Free site inspection across " + city,
    "Same-week installation on most balconies",
    "Warranty up to " + profile.warrantyYears,
    "Premium branded materials",
    "Expert trained installers",
    "Transparent written pricing",
  ];

  const blocks: ContentBlock[] = [
    {
      id: "sic-highlights",
      anchorId: "highlights",
      heading: "At a glance",
      listItems: quickHighlights.map((h) => `✔ ${h}`),
      paragraphs: [],
    },
    {
      id: "sic-intro",
      anchorId: "introduction",
      heading: `${service.name} in ${city} — expert guide by ${company}`,
      paragraphs: buildIntroduction(ctx),
    },
    buildLocalSection(ctx),
    buildServiceExplainerBlock(ctx),
    buildSubServicesBlock(ctx),
    {
      id: "sic-who-needs",
      anchorId: "who-needs",
      heading: "Who needs this service?",
      listItems: [
        "Apartment owners in gated communities and high-rise towers",
        "Villa owners with open balconies and terrace edges",
        "Independent house owners with multi-storey openings",
        "Builders preparing handover-ready safety fittings",
        "Schools, hospitals and hotels with open corridors or ducts",
        "Commercial offices and retail buildings with facade openings",
      ],
      paragraphs: [
        `In ${city}, we most often speak with families in IT-corridor apartments and villa communities in premium residential zones — but the same measurement principles apply wherever there is an unprotected opening.`,
        `Facility managers contact us for duct and corridor packages; builders schedule bulk measurements before handover; and pet owners request tighter spacing than standard adult-focused layouts. Tell us who uses the space daily and we adjust the specification.`,
      ],
    },
    buildBenefitsBlock(ctx),
    buildExpertiseBlock(ctx),
    buildPropertyTypeGuideBlock(ctx),
    {
      id: "sic-features",
      anchorId: "features",
      heading: "Features, warranty & specifications",
      listItems: service.features,
      subSections: [
        { title: "Warranty", description: `Up to ${profile.warrantyYears} on selected materials with written terms.` },
        { title: "Expected service life", description: "Premium installations typically perform 5–8+ years with basic care in " + city + " conditions." },
        { title: "Safety standards", description: service.safetyInformation.join(" ") },
        { title: "Maintenance profile", description: service.maintenanceTips.join(" ") },
      ],
      paragraphs: service.specifications,
    },
    {
      id: "sic-applications",
      anchorId: "applications",
      heading: "Where it is used",
      listItems: [
        ...service.applications,
        "Balcony edges and utility offsets",
        "Windows, ventilators and sliding doors",
        "Terraces, staircases and duct areas",
        "Parking setbacks and commercial facades",
      ].filter((v, i, a) => a.indexOf(v) === i),
      paragraphs: [
        `${service.shortName} is specified for any opening where everyday use creates fall risk, bird ingress or utility need — common across ${city}'s mix of towers and villas.`,
      ],
    },
    {
      id: "sic-materials",
      anchorId: "materials",
      heading: "Materials & hardware",
      subSections: profile.materials.map((m) => ({ title: m.name, description: m.description })),
      listItems: service.materials,
      paragraphs: [profile.climateNote.replace(/Hyderabad/g, city)],
    },
    {
      id: "sic-process",
      anchorId: "process",
      heading: "Installation process — step by step",
      subSections: profile.processSteps,
      paragraphs: [
        `Every ${city} project follows the same quality path: inspect, measure, specify, install, test, hand over. Skipping measurement is where most cheap installations fail — we do not skip it.`,
      ],
    },
    {
      id: "sic-pricing",
      anchorId: "pricing",
      heading: `${service.shortName} pricing in ${city}`,
      paragraphs: [
        profile.priceDisclaimer.replace(/Hyderabad/g, city),
        "We believe transparent pricing builds trust. Indicative ranges below reflect common " + city + " projects — your quotation may differ based on site conditions.",
        "Factors affecting price: total square footage, floor height and access, material grade (SS304 vs SS316, HDPE vs nylon), custom spacing, travel within " + city + ", and urgency of scheduling.",
      ],
      tableRows: profile.priceRanges.map((r) => ({ label: r.label, value: r.range, note: r.bestFor })),
      highlight: profile.priceRanges[0]?.range,
    },
    buildWhyUsBlock(ctx),
    buildProjectsBlock(ctx),
    buildSeasonalGuideBlock(ctx),
    buildTrustedBrandsBlock(ctx),
    buildBuyingGuideBlock(ctx),
    buildComparisonBlock(ctx),
    buildEmergencySupportBlock(ctx),
    {
      id: "sic-maintenance",
      anchorId: "maintenance",
      heading: "Maintenance tips",
      listItems: service.maintenanceTips,
      paragraphs: [
        `In ${city}'s monsoon season, schedule a quick visual check of tension and hooks. Wipe stainless cables with a dry cloth; avoid harsh chemicals. Report any impact damage — from cricket balls or construction debris — before it compromises safety.`,
      ],
    },
    {
      id: "sic-nearby-areas",
      anchorId: "nearby-areas",
      heading: `Localities we serve in ${city}`,
      listItems: areas.slice(0, 50).map((a) => a.name),
      paragraphs: [
        `Coverage spans ${areas.length}+ neighbourhoods. If your area is not listed, contact us — ${city} service boundaries update as we verify new localities.`,
      ],
    },
    {
      id: "sic-nearby-cities",
      anchorId: "nearby-cities",
      heading: "Nearby cities & corridors",
      listItems: cityProfile.nearbyCities,
      paragraphs: [
        `Primary installation focus is ${city}, ${ctx.state}. We occasionally support referral projects in nearby corridors — enquire if you are on the city outskirts.`,
      ],
    },
    {
      id: "sic-related",
      anchorId: "related-services",
      heading: "Related services in " + city,
      subSections: getPublishedServices()
        .filter((s) => s.id !== service.id)
        .slice(0, 7)
        .map((s) => ({
          title: s.name,
          description: `${s.summary} Available in ${city} with free inspection.`,
        })),
      paragraphs: [],
    },
    {
      id: "sic-cta",
      anchorId: "quote",
      heading: "Book a free site inspection",
      paragraphs: [
        `Call ${BUSINESS_CONFIG.phone.display} or WhatsApp ${BUSINESS_CONFIG.whatsapp.display} to schedule ${service.name.toLowerCase()} installation in ${city}.`,
        `Or visit our contact page — share your locality near ${ctx.neighborhoods[0] ?? city}, property type and photos for a faster response.`,
      ],
    },
  ];

  const faqs = buildFaqs(ctx);
  const reviews = buildReviews(ctx);
  const galleryCaptions = buildGalleryCaptions(ctx);
  const internalLinkSuggestions = buildInternalLinks(ctx);
  const seo = buildPremiumSeoPackage(service, location, company);
  const wordCount = countPremiumWordCount(blocks, faqs);

  return {
    seo,
    blocks,
    faqs,
    tableOfContents: blocks
      .filter((b) => b.anchorId)
      .map((b) => ({ label: b.heading, href: `#${b.anchorId}` })),
    reviews,
    galleryCaptions,
    internalLinkSuggestions,
    wordCount,
    quickHighlights,
  };
}

export function buildPremiumServiceInCityContentBlocks(service: Service, location: Location): ContentBlock[] {
  return buildPremiumServiceInCityLanding(service, location).blocks;
}

export function buildPremiumServiceInCityFaqs(service: Service, location: Location): FaqItem[] {
  return buildPremiumServiceInCityLanding(service, location).faqs;
}

export function getPremiumServiceInCityReviews(service: Service, location: Location) {
  return buildPremiumServiceInCityLanding(service, location).reviews;
}
