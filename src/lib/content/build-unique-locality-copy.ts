import type { Area } from "@/types/location";

/** Deterministic 32-bit seed from slug — same locality always gets the same variants. */
export function localitySeed(slug: string): number {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pickBySeed<T>(items: readonly T[], seed: number, offset = 0): T {
  if (items.length === 0) {
    throw new Error("pickBySeed: empty list");
  }
  return items[(seed + offset) % items.length]!;
}

export function shuffleBySeed<T>(items: readonly T[], seed: number): T[] {
  const arr = [...items];
  let s = seed || 1;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

export function clampMeta(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

export function wordCountText(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/** Property-type labels that affect application mix. */
export function classifyPropertyMix(area: Area): {
  hasApartments: boolean;
  hasVillas: boolean;
  hasGated: boolean;
  hasCommercial: boolean;
  primaryLabel: string;
} {
  const types = area.propertyTypes.map((t) => t.toLowerCase());
  const hasApartments = types.some((t) => t.includes("apartment"));
  const hasVillas = types.some((t) => t.includes("villa") || t.includes("independent"));
  const hasGated = types.some((t) => t.includes("gated"));
  const hasCommercial = types.some((t) => t.includes("commercial") || t.includes("office"));
  const primaryLabel =
    area.propertyTypes[0] ??
    (hasApartments ? "apartments" : hasVillas ? "villas" : "homes");
  return { hasApartments, hasVillas, hasGated, hasCommercial, primaryLabel };
}

export function buildUniqueLocalityIntro(input: {
  company: string;
  locality: string;
  city: string;
  area: Area;
  nearbyNames: string[];
}): { intro: string; paragraphs: string[]; wordCount: number } {
  const { company, locality, city, area, nearbyNames } = input;
  const seed = localitySeed(area.slug);
  const mix = classifyPropertyMix(area);
  const traits = area.localCharacteristics.filter(Boolean);
  const demand = area.serviceDemandNotes.filter(Boolean);
  const nearby =
    nearbyNames.slice(0, 3).join(", ") || `other ${city} neighbourhoods we already serve`;

  const openers = [
    `${company} installs stainless-steel invisible grills for homes and ${mix.primaryLabel} across ${locality}, ${city}.`,
    `Families in ${locality} book ${company} for balcony and window invisible grills that keep views open while improving fall protection.`,
    `For ${mix.primaryLabel} in ${locality}, ${company} plans invisible grill spacing, cable grade and fixing points after an on-site measurement — not a phone-only estimate.`,
  ];

  const midA = [
    mix.hasApartments
      ? `High-rise and mid-rise apartments in ${locality} often need discreet cable systems that work with existing railings, society entry rules and limited balcony depth.`
      : `Residential openings in ${locality} vary in railing height and span, so we size frames and tension points to the actual structure rather than a one-size layout.`,
    mix.hasVillas
      ? `Villa and independent-house openings in ${locality} may combine deep balconies, staircase voids and wider french windows — each measured separately before quotation.`
      : `We map every balcony and window opening in ${locality} during a free site visit so cable quantity and hardware match the property.`,
    traits[0]
      ? `Local housing notes for ${locality} include ${traits.slice(0, 2).join(" and ").toLowerCase()}, which influences access planning and finish choices.`
      : `Installation scheduling in ${locality} is coordinated around household routines and building access windows common across ${city}.`,
  ];

  // Always keep verified area fields — these are the uniqueness anchors after name normalisation
  const anchors = [
    area.introduction?.trim(),
    area.localDescription?.trim(),
    area.propertyTypes.length
      ? `Property patterns we plan for in ${locality}: ${area.propertyTypes.join(", ")}.`
      : null,
    traits.length
      ? `Characteristics noted for ${locality}: ${traits.join("; ")}.`
      : null,
    demand.length ? `Service demand notes for ${locality}: ${demand.join(" ")}` : null,
    area.verifiedLocalFacts?.length
      ? `Verified local facts: ${area.verifiedLocalFacts.slice(0, 2).join(" ")}`
      : null,
    nearbyNames.length
      ? `From ${locality} we also schedule visits toward ${nearbyNames.slice(0, 5).join(", ")}.`
      : `Share a landmark in ${locality} when you enquire so the ${city} team confirms the next slot.`,
    `${locality} is listed in our ${city}${area.district ? ` / ${area.district}` : ""} coverage for invisible grill measurement and installation.`,
  ].filter((p): p is string => Boolean(p && p.trim()));

  const closer = [
    `Whether you need a single balcony package or multi-opening protection in ${locality}, ${company} confirms grade, spacing and timeline before work begins.`,
    `After installation in ${locality}, you receive a neat finish, basic care guidance and warranty-backed support from ${company}.`,
    `Coverage keeps ${locality} connected to nearby installs in ${nearby}, so mobilisation and after-care stay local.`,
  ];

  const paragraphs = [
    pickBySeed(openers, seed, 0),
    pickBySeed(midA, seed, 1),
    ...shuffleBySeed(anchors, seed + 17).slice(0, 4),
    pickBySeed(closer, seed, 3),
  ];

  const intro = paragraphs[0]!;
  return { intro, paragraphs, wordCount: wordCountText(paragraphs.join(" ")) };
}

export function buildUniqueLocalSection(input: {
  locality: string;
  city: string;
  area: Area;
  nearbyNames: string[];
}): { lead: string; paragraphs: string[]; listItems: string[]; wordCount: number } {
  const { locality, city, area, nearbyNames } = input;
  const seed = localitySeed(area.slug);
  const mix = classifyPropertyMix(area);
  const apps = shuffleBySeed(
    [
      mix.hasApartments ? "apartment balconies" : null,
      mix.hasApartments ? "high-rise window openings" : null,
      mix.hasVillas ? "villa terraces and sit-outs" : null,
      mix.hasVillas ? "staircase and void edges" : null,
      mix.hasGated ? "gated-community balconies" : null,
      mix.hasCommercial ? "office and commercial ledges" : null,
      "child-safety balcony edges",
      "pet-safe railing gaps",
      "french-window protection",
    ].filter(Boolean) as string[],
    seed,
  ).slice(0, 5);

  const leadOptions = [
    `Invisible grills are relevant in ${locality} because ${mix.primaryLabel} here often keep open railings that need fall protection without heavy iron work.`,
    `${locality} homes commonly prioritise light and ventilation; stainless cable grills protect edges while keeping the ${city} skyline view.`,
    `In ${locality}, installation planning starts from how the balcony or window is built — railing posts, slab edge and access — not from a generic city-wide template.`,
  ];

  const body = [
    pickBySeed(leadOptions, seed, 0),
    `Typical applications we plan for ${locality} include ${apps.join(", ")}.`,
    area.introduction?.trim() || null,
    area.localDescription?.trim() || null,
    area.localCharacteristics.length
      ? `Verified local characteristics: ${area.localCharacteristics.join("; ")}.`
      : `We confirm fixing points on site in ${locality} because railing designs differ even within the same society.`,
    area.serviceDemandNotes.length
      ? `Service notes for ${locality}: ${area.serviceDemandNotes.join(" ")}`
      : `Households in ${locality} usually compare cable grade, spacing for children or pets, and how long installation will take once society permission is ready.`,
    area.propertyTypes.length
      ? `Property types referenced for ${locality} planning: ${area.propertyTypes.join(", ")}.`
      : null,
    nearbyNames.length
      ? `Teams serving ${locality} also cover ${nearbyNames.slice(0, 6).join(", ")}, which keeps site visits and callbacks practical.`
      : `${locality} sits inside our active ${city} route plan for measurement and installation days.`,
    `Monsoon humidity and summer heat across ${city} favour corrosion-resistant hardware on exposed ${locality} balconies — we discuss SS304 vs SS316 during the visit.`,
    area.district
      ? `${locality} projects are coordinated within ${area.district}, ${area.state || "Telangana"}, under our ${city} operations.`
      : null,
  ].filter((p): p is string => Boolean(p && p.trim()));

  const listItems = [
    ...apps.map((a) => `${a} in ${locality}`),
    ...area.propertyTypes.slice(0, 3).map((p) => `${p} projects in ${locality}`),
  ].slice(0, 8);

  return {
    lead: body[0]!,
    paragraphs: body,
    listItems,
    wordCount: wordCountText(body.join(" ")),
  };
}

type FaqDraft = { question: string; answer: string };

export function buildUniqueLocalityFaqs(input: {
  locality: string;
  city: string;
  company: string;
  area: Area;
  nearbyNames: string[];
}): FaqDraft[] {
  const { locality, city, company, area, nearbyNames } = input;
  const seed = localitySeed(area.slug);
  const mix = classifyPropertyMix(area);

  const pool: FaqDraft[] = [
    {
      question: `What type of invisible grill suits balconies in ${locality}?`,
      answer: mix.hasApartments
        ? `Most ${locality} apartments use stainless cable invisible grills sized to the railing and child/pet spacing needs. ${company} confirms grade and layout after measuring the balcony on site.`
        : `In ${locality}, balcony systems are chosen after measuring span, railing posts and household safety needs. ${company} recommends SS304 or SS316 based on exposure and budget.`,
    },
    {
      question: `How is invisible grill installation carried out in ${locality}?`,
      answer: `We visit ${locality} for measurement, share a written quotation, schedule installation around building access, then fix, tension and inspect the cables before handover.`,
    },
    {
      question: `Can invisible grills be installed on apartment balconies in ${locality}?`,
      answer: mix.hasApartments
        ? `Yes. Apartment balconies in ${locality} are a common request. We plan fixing points that suit the existing railing and follow society entry rules where required.`
        : `Where apartments exist in or near ${locality}, we install after confirming railing structure and access. Independent homes follow the same measurement-led process.`,
    },
    {
      question: `How long does installation take in ${locality}?`,
      answer: `Most single-balcony jobs in ${locality} finish within a day once materials and permissions are ready. Multi-opening villas may need a longer slot that we confirm in the quotation.`,
    },
    {
      question: `What affects invisible grill price in ${locality}?`,
      answer: `Price depends on measured square footage, floor access, cable grade, custom spacing and how many openings you protect in ${locality}. Free inspection avoids guesswork quotes.`,
    },
    {
      question: `Do you serve areas near ${locality}?`,
      answer: nearbyNames.length
        ? `Yes. Along with ${locality}, ${company} regularly serves ${nearbyNames.slice(0, 4).join(", ")} and other ${city} localities in our coverage list.`
        : `Yes. ${locality} is inside our ${city} service map; share your landmark during the enquiry so we confirm the next visit slot.`,
    },
    {
      question: `Is SS316 required for ${locality} balconies?`,
      answer: `SS316 is preferred for exposed ${city} balconies that see strong sun and monsoon moisture. SS304 can suit sheltered openings — we explain the trade-off during the ${locality} site visit.`,
    },
    {
      question: `Can invisible grills help with child or pet safety in ${locality}?`,
      answer: `Yes. Spacing is planned for toddlers and pets so gaps are harder to slip through, while keeping the open feel that ${locality} homes usually want.`,
    },
    {
      question: `Do gated communities in ${locality} allow installation?`,
      answer: mix.hasGated
        ? `Many gated communities around ${locality} allow invisible grills after a simple entry or renovation intimation. We help you plan timing around society rules.`
        : `Where society rules apply near ${locality}, we install after your building’s entry process is clear. Measurement can often happen first.`,
    },
    {
      question: `What should I prepare before the ${locality} site visit?`,
      answer: `Share photos of the balcony or windows, floor number, and preferred time. If you know railing material or prior grill work in ${locality}, mention it so we arrive with the right hardware options.`,
    },
    {
      question: `Are invisible grills better than iron grills for ${locality} homes?`,
      answer: `Cable systems keep views and light — a frequent preference in ${locality} — while iron grills are more opaque. Choice depends on facade goals, budget and safety needs we review on site.`,
    },
    {
      question: `Does ${company} provide warranty support after installing in ${locality}?`,
      answer: `Yes. After installation in ${locality} we share care tips and warranty-backed support for workmanship and agreed materials. WhatsApp helps for tension checks or follow-up visits.`,
    },
  ];

  return shuffleBySeed(pool, seed).slice(0, 8);
}

export function buildLocalityMeta(input: {
  locality: string;
  city: string;
  company: string;
  area: Area;
}): { title: string; metaDescription: string; h1: string } {
  const { locality, city, company, area } = input;
  const seed = localitySeed(area.slug);
  const mix = classifyPropertyMix(area);

  const titleOptions = [
    `Invisible Grills in ${locality} | ${company}`,
    `${locality} Invisible Grill Installation | ${company}`,
    `Invisible Grills Installation in ${locality} | ${company}`,
  ];
  const descOptions = [
    `Book invisible grill installation in ${locality}, ${city}. ${company} measures ${mix.primaryLabel} balconies and windows, recommends SS cable grade, and shares a free written quotation.`,
    `Need balcony or window invisible grills in ${locality}? ${company} provides measurement-led SS304/SS316 installation for ${mix.primaryLabel} across ${city}.`,
    `Invisible grills for ${mix.primaryLabel} in ${locality}. Free site visit, transparent pricing and professional installation by ${company} in ${city}.`,
  ];

  return {
    title: clampMeta(pickBySeed(titleOptions, seed, 0), 60),
    metaDescription: clampMeta(pickBySeed(descOptions, seed, 2), 160),
    h1: `Invisible Grills Installation in ${locality}`,
  };
}
