import { BUSINESS_CONFIG } from "@/config/business";
import { AREAS_MEGA_MENU, buildIntentPageUrl } from "@/config/mega-menu";
import { getPublishedServices } from "@/data/initial-services";
import { getPublishedLocations } from "@/data/initial-locations";
import { buildServiceInCityPath } from "@/lib/utils/service-in-city-slug";
import { buildInvisibleGrillsInstallationPath } from "@/lib/utils/installation-in-locality-slug";
import { getHomeGalleryImages, HOME_HERO_IMAGE } from "@/lib/images/get-service-images";
import type { ContentBlock, FaqItem } from "@/types/content";
import type { CustomerReview } from "@/components/sections/CustomerReviews";
import type { SeoLinkGroup } from "@/components/sections/SeoInternalLinkBoard";

const company = BUSINESS_CONFIG.name;
const phone = BUSINESS_CONFIG.phone.display;
const city = BUSINESS_CONFIG.serviceArea.primaryCity;

export type HomeProjectExample = {
  title: string;
  area: string;
  service: string;
  summary: string;
  href: string;
};

export type HomeContentPackage = {
  seoTitle: string;
  metaTitle: string;
  metaDescription: string;
  urlPath: string;
  h1: string;
  heroDescription: string;
  heroImage: string;
  highlights: string[];
  blocks: ContentBlock[];
  projects: HomeProjectExample[];
  galleryImages: { src: string; alt: string; href?: string }[];
  reviews: CustomerReview[];
  faqs: FaqItem[];
  nearbyAreas: { label: string; href: string }[];
  nearbyCities: { label: string; href: string; note: string }[];
  relatedServices: { label: string; href: string; summary: string }[];
  linkGroups: SeoLinkGroup[];
};

function buildHighlights(): string[] {
  return [
    "Free on-site inspection & written quotation",
    "Invisible grills, safety nets, bird spikes & cloth hangers",
    "350+ Hyderabad localities covered",
    "SS316 / UV-stable materials with warranty support",
    "Most balcony projects finish in 1–2 days",
    "WhatsApp photo quotes & same-week scheduling",
  ];
}

function buildContentBlocks(): ContentBlock[] {
  return [
    {
      id: "home-intro",
      anchorId: "introduction",
      heading: `Complete home & building safety solutions in ${city}`,
      paragraphs: [
        `${company} is a measurement-led installer of invisible grills, balcony safety nets, children and pet safety nets, mosquito nets, bird spikes, cloth hangers and cricket nets across ${city}. We help apartment and villa homeowners protect openings without spoiling the view or wasting money on the wrong mesh grade.`,
        `Every project starts with a free site visit. We measure railing gaps, floor height, fixing surfaces and household use — toddlers, pets, birds or laundry — then recommend SS304/SS316 cables, UV-stabilised HDPE nets or the right hanger system before you approve a written quotation.`,
        `From glass-fronted towers in the IT corridor to independent houses near Karmanghat, our teams understand society permissions, high-rise access and monsoon exposure. Call ${phone} or WhatsApp photos of your openings to get started.`,
      ],
    },
    {
      id: "home-local",
      anchorId: "local-information",
      heading: `Local information — serving ${city} homes`,
      paragraphs: [
        `${city} homes face open balcony edges, wide window spans, duct openings and terrace ledges that need practical protection. High-rises in Gachibowli, Kondapur and Hitech City often need neat invisible grills that pass society aesthetic rules, while older independent houses may need full-height nets or bird control on parapets.`,
        `${company} operates from ${BUSINESS_CONFIG.address.street}, ${city} ${BUSINESS_CONFIG.address.postalCode}, and schedules inspections across west, central, north, east and south corridors. We do not claim a branch in every locality — we bring trained technicians to your society with the right materials for your opening.`,
        `Local weather matters: monsoon humidity and sun exposure affect cable grade and net UV stabilisation. That is why we specify materials on-site rather than quoting from a single phone price.`,
      ],
      listItems: [
        "Apartments, villas, duplexes and gated communities",
        "Balcony, window, duct, stair and terrace openings",
        "Society-friendly finishing for premium towers",
        "Support across 350+ verified Hyderabad areas",
      ],
    },
    {
      id: "home-benefits",
      anchorId: "benefits",
      heading: "Benefits of professional home safety installation",
      paragraphs: [
        `Choosing a professional installer for invisible grills and safety nets reduces fall risk for children and pets, discourages birds, improves everyday balcony use and protects laundry areas — without turning your home into a cage.`,
      ],
      listItems: [
        "Clear view retention with stainless invisible grills",
        "Practical fall-risk reduction for toddlers and pets",
        "Bird and pigeon control on ledges and ducts",
        "Neater laundry drying with ceiling cloth hangers",
        "Written scope, material grade and warranty terms",
        "After-sales support for tension checks and repairs",
      ],
    },
    {
      id: "home-features",
      anchorId: "features",
      heading: "Features homeowners look for",
      paragraphs: [
        `Our installations focus on durable hardware, neat finishing and honest specification — so you can compare quotes fairly and know what is going into your balcony or window.`,
      ],
      listItems: [
        "Custom cable spacing for children, pets or view preference",
        "Corrosion-resistant stainless options (SS304 / SS316)",
        "UV-stabilised HDPE / nylon safety netting",
        "Secure hook, rope and frame fixing methods",
        "Opening-by-opening measurement and layout",
        "Clean edge finishing suitable for premium interiors",
      ],
    },
    {
      id: "home-applications",
      anchorId: "applications",
      heading: "Where we install",
      paragraphs: [
        `${company} designs protection around the openings you actually use — not a one-size template.`,
      ],
      listItems: [
        "Apartment and villa balconies",
        "Living-room and bedroom windows",
        "Utility balconies and duct areas",
        "Stair voids and corridor openings",
        "AC ledges, parapets and signage edges (bird spikes)",
        "Society grounds and practice areas (cricket nets)",
      ],
    },
    {
      id: "home-materials",
      anchorId: "materials",
      heading: "Materials we specify",
      paragraphs: [
        `Material grade drives durability, warranty confidence and long-term appearance. During inspection we name the grade we plan to use so you are not comparing vague “standard quality” quotes.`,
      ],
      listItems: [
        "SS304 / SS316 stainless steel cables for invisible grills",
        "Powder-coated or stainless frames and hardware",
        "UV-stabilised HDPE / nylon mesh for safety and bird nets",
        "Polycarbonate or stainless bird spikes",
        "Load-appropriate ceiling / wall cloth hanger systems",
        "Sports-grade netting for cricket practice enclosures",
      ],
      highlight: `Ask for the material grade in writing before you approve installation — ${company} lists it in your quotation.`,
    },
    {
      id: "home-installation",
      anchorId: "installation-process",
      heading: "Installation process",
      paragraphs: [
        `A clear process keeps society access, material readiness and finishing aligned — most single-balcony jobs complete in 1–2 days after approval.`,
      ],
      listItems: [
        "Call or WhatsApp with locality, property type and opening photos",
        "Free site inspection and measurement",
        "Written quotation with scope, grade, timeline and price",
        "Material staging and society permission support",
        "Professional installation, tensioning and edge finishing",
        "Handover with care tips and warranty notes",
      ],
    },
    {
      id: "home-pricing",
      anchorId: "pricing-guide",
      heading: "Pricing guide — what affects cost in Hyderabad",
      paragraphs: [
        `Home safety pricing in ${city} depends on opening size, floor height, access difficulty, material grade and whether you need invisible grills, nets, spikes or hangers. Phone ballparks without measurement often miss railing complexity or high-rise access costs.`,
        `We provide free inspection and a written quote so you can compare scope fairly. Premium SS316 cables, denser child-safety mesh or multi-side balcony coverage increase cost — and we explain why before you decide.`,
      ],
      tableRows: [
        { label: "Invisible grills (typical balcony)", value: "Quote after measure", note: "Depends on sq.ft, cable grade & spacing" },
        { label: "Balcony / children safety nets", value: "Quote after measure", note: "Mesh type, area and fixing method" },
        { label: "Bird spikes (per running ft)", value: "Quote after survey", note: "Ledge width and material" },
        { label: "Cloth hangers", value: "System-based", note: "Rod count and ceiling mount type" },
      ],
      highlight: `Free site visit — call ${phone} for a no-obligation quotation.`,
    },
    {
      id: "home-why",
      anchorId: "why-choose-us",
      heading: `Why choose ${company}`,
      paragraphs: [
        `Homeowners choose ${company} for measurement-first quoting, Hyderabad coverage and transparent after-sales support led by ${BUSINESS_CONFIG.ownerName}.`,
      ],
      listItems: [
        "Free inspection before you pay",
        "350+ localities across Hyderabad",
        "Named material grades in every quote",
        "Trained technicians for high-rise work",
        "Warranty support on materials and workmanship",
        "WhatsApp and phone support after handover",
      ],
    },
    {
      id: "home-buying",
      anchorId: "buying-guide",
      heading: "Buying guide — how to choose the right protection",
      paragraphs: [
        `Start with the problem: child fall risk, pet escape, bird roosting, insect entry or laundry space. Invisible grills suit view-sensitive balconies; denser nets suit toddlers and cats; bird spikes suit ledges; mosquito nets suit windows you want open for air.`,
        `Ask every vendor for on-site measurement, material grade, written scope, warranty terms and finishing photos from similar buildings. Avoid deciding on the lowest headline rate alone — incomplete coverage or soft mesh fails when you need it most.`,
        `If you are unsure, send balcony photos on WhatsApp. We will tell you whether grills, nets or a combination is the better fit before scheduling inspection.`,
      ],
    },
    {
      id: "home-comparison",
      anchorId: "comparison",
      heading: "Comparison — invisible grills vs safety nets",
      paragraphs: [
        `Both solutions improve balcony safety; the right choice depends on view preference, child/pet needs and society rules.`,
      ],
      tableRows: [
        { label: "Invisible grills", value: "Best for clear view", note: "Stainless cables; discreet look; great for premium apartments" },
        { label: "Safety nets", value: "Best for dense coverage", note: "Strong for toddlers/pets/birds; more visible mesh" },
        { label: "Combination", value: "Best for mixed needs", note: "Grills on main balcony + nets on utility sides" },
        { label: "Bird spikes", value: "Best for ledges", note: "Stops roosting; not a fall barrier" },
      ],
    },
    {
      id: "home-maintenance",
      anchorId: "maintenance-tips",
      heading: "Maintenance tips",
      paragraphs: [
        `Simple care extends the life of grills, nets and hangers in ${city} weather.`,
      ],
      listItems: [
        "Wipe cables and frames periodically; avoid harsh acids",
        "Inspect net tension after storms or strong wind",
        "Replace torn mesh sections promptly",
        "Keep bird-spike rows clear of debris and leaves",
        "Do not hang heavy loads on safety netting",
        "Call us for re-tensioning or warranty checks",
      ],
    },
  ];
}

function buildProjects(): HomeProjectExample[] {
  return [
    {
      title: "SS316 balcony invisible grills",
      area: "Gachibowli",
      service: "Invisible Grills",
      summary: "Full balcony cable layout for a high-rise apartment with toddler safety spacing and society-approved finishing.",
      href: buildInvisibleGrillsInstallationPath("gachibowli"),
    },
    {
      title: "Window invisible grills",
      area: "Kondapur",
      service: "Invisible Grills",
      summary: "Living-room and bedroom window protection retaining natural light for a gated-community flat.",
      href: "/hyderabad/kondapur/invisible-grills/",
    },
    {
      title: "Children safety nets",
      area: "Hitech City",
      service: "Children Safety Nets",
      summary: "Dense mesh on utility balcony and corridor opening for a family with young kids.",
      href: "/hyderabad/hitech-city/children-safety-nets/",
    },
    {
      title: "Balcony bird netting",
      area: "Madhapur",
      service: "Balcony Safety Nets",
      summary: "UV-stable HDPE net to stop pigeons nesting on a west-facing balcony ledge.",
      href: "/hyderabad/madhapur/balcony-safety-nets/",
    },
    {
      title: "Pet safety nets",
      area: "Jubilee Hills",
      service: "Pet Safety Nets",
      summary: "Cat-safe balcony enclosure with secure edge fixing for a villa-style apartment.",
      href: "/hyderabad/jubilee-hills/pet-safety-nets/",
    },
    {
      title: "Mosquito net windows",
      area: "Kukatpally",
      service: "Mosquito Nets",
      summary: "Sliding-window mosquito mesh for bedrooms facing a busy internal road.",
      href: "/hyderabad/kukatpally/mosquito-nets/",
    },
    {
      title: "AC ledge bird spikes",
      area: "Miyapur",
      service: "Bird Spikes",
      summary: "Continuous stainless spike coverage on AC ledges to stop roosting and droppings.",
      href: "/hyderabad/miyapur/bird-spikes/",
    },
    {
      title: "Ceiling cloth hangers",
      area: "Manikonda",
      service: "Cloth Hangers",
      summary: "Multi-rod ceiling drying system for a compact utility balcony.",
      href: "/hyderabad/manikonda/cloth-hangers/",
    },
    {
      title: "Invisible grills for apartments",
      area: "LB Nagar",
      service: "Invisible Grills",
      summary: "Two-side balcony grill installation with neat corner finishing for an east Hyderabad tower.",
      href: buildInvisibleGrillsInstallationPath("lbnagar"),
    },
    {
      title: "Safety nets near Karmanghat",
      area: "Karmanghat",
      service: "Balcony Safety Nets",
      summary: "Independent-house balcony and stair opening protection close to our base locality.",
      href: "/hyderabad/karmanghat/balcony-safety-nets/",
    },
  ];
}

function buildReviews(): CustomerReview[] {
  return [
    { author: "Priya S.", rating: 5, location: "Gachibowli", text: "Clean invisible grill work on our 12th-floor balcony. Measurement was thorough and the team finished in a day." },
    { author: "Rahul M.", rating: 5, location: "Kondapur", text: "We compared three vendors — GTR explained SS316 vs SS304 clearly. Quote matched the final invoice." },
    { author: "Ananya K.", rating: 5, location: "Hitech City", text: "Children safety nets look neat and feel secure. Helpful WhatsApp updates before installation day." },
    { author: "Sandeep R.", rating: 5, location: "Madhapur", text: "Pigeon netting solved our balcony mess. Mesh quality is solid after one monsoon already." },
    { author: "Meera D.", rating: 5, location: "Jubilee Hills", text: "Pet nets for our cats — no loose edges, polite technicians, society rules handled smoothly." },
    { author: "Vikram N.", rating: 4, location: "Kukatpally", text: "Good mosquito nets for three bedrooms. Slight delay on hardware, but finishing was careful." },
    { author: "Lakshmi P.", rating: 5, location: "Miyapur", text: "Bird spikes on AC ledges worked immediately. Fair pricing and clear warranty note." },
    { author: "Arjun T.", rating: 5, location: "Manikonda", text: "Ceiling cloth hanger is sturdy. They checked the slab before drilling — appreciated that." },
    { author: "Fatima H.", rating: 5, location: "Secunderabad", text: "Window invisible grills look almost invisible from inside. Highly recommend for apartments." },
    { author: "Karthik B.", rating: 5, location: "LB Nagar", text: "Called for a free visit, got a written quote same day. Installation team was punctual and tidy." },
  ];
}

function buildFaqs(): FaqItem[] {
  return [
    { question: `Do you install invisible grills across ${city}?`, answer: `Yes. ${company} installs invisible grills and related home safety solutions across 350+ localities in ${city}, including Gachibowli, Kondapur, Hitech City, Madhapur, Jubilee Hills, Secunderabad, Uppal and LB Nagar.` },
    { question: "Is site inspection free?", answer: "Yes. On-site measurement and quotation are free with no obligation. Accurate pricing needs physical measurement of openings and fixing points." },
    { question: "How long does installation take?", answer: "Most single-balcony invisible grill or safety net projects finish in 1–2 days after quotation approval, subject to material readiness and society access." },
    { question: "Which is better — invisible grills or safety nets?", answer: "Invisible grills suit view-sensitive balconies; denser safety nets suit toddlers, pets or bird control. Many homes use a combination. We recommend after seeing your openings." },
    { question: "Do you use SS316 stainless cables?", answer: "We offer SS304 and SS316 options. For exposed high-rise balconies and longer warranty expectations we often recommend SS316 and list the grade in your written quote." },
    { question: "Can you work in high-rise societies?", answer: "Yes. Our technicians are experienced with high-rise access, balcony edge work and society permission processes common in Hyderabad IT corridor towers." },
    { question: "Do you provide warranty?", answer: "Warranty terms for materials and workmanship are stated in your quotation. Keep the handover note for any tension checks or section replacements." },
    { question: "How do I get a quote quickly?", answer: `Call ${phone} or WhatsApp photos of your balcony/windows with your locality. We schedule a free inspection and share a written quotation.` },
    { question: "Do you install children and pet safety nets?", answer: "Yes. Mesh size and fixing height are planned for toddlers or pets so coverage matches the real risk on each opening." },
    { question: "Can you stop pigeons on my balcony?", answer: "Yes — using balcony bird nets, duct nets or bird spikes on ledges, depending on where birds roost. Inspection confirms the right method." },
    { question: "Do you install mosquito nets?", answer: "Yes. Window and door mosquito net systems are measured to your frame type — fixed, sliding or magnetic options as suitable." },
    { question: "Are cloth hangers available for small balconies?", answer: "Yes. We recommend ceiling or wall systems based on slab strength, balcony depth and how much laundry you typically dry." },
    { question: "Do you cover Secunderabad and east Hyderabad?", answer: "Yes. We serve Secunderabad, Malkajgiri, Uppal, LB Nagar, Dilsukhnagar and surrounding neighbourhoods with the same measurement-led process." },
    { question: "Will invisible grills block my view?", answer: "Properly spaced stainless cables remain discreet from inside while reducing fall gaps. Spacing can be tuned for children versus view preference." },
    { question: "Can I compare your quote with other vendors?", answer: "Please do — compare material grade, written scope, warranty and finishing photos, not only the headline price." },
    { question: "Do you remove old nets or grills?", answer: "Where safe and requested, we can remove or replace existing nets/grills as part of the new scope. This is itemised in the quotation." },
    { question: "What payment terms do you follow?", answer: "Payment milestones are confirmed in writing with your quotation. We keep pricing transparent with no surprise add-ons for standard scope." },
    { question: "Do you install cricket nets?", answer: "Yes, for suitable residential society grounds and practice areas, planned around height, mesh and support structure needs." },
    { question: `Where is ${company} based?`, answer: `${company} is based at ${BUSINESS_CONFIG.address.street}, ${city} ${BUSINESS_CONFIG.address.postalCode}. Owner: ${BUSINESS_CONFIG.ownerName}. Phone: ${phone}.` },
    { question: "How do I book an inspection today?", answer: `Call or WhatsApp ${phone}, share your area and opening photos, and we will confirm the earliest free inspection slot.` },
  ];
}

function buildNearbyAreas(): { label: string; href: string }[] {
  return AREAS_MEGA_MENU.flatMap((column) =>
    column.areas.map((area) => ({
      label: area.label,
      href: `/locations/hyderabad/${area.slug}/`,
    })),
  );
}

function buildNearbyCities(): { label: string; href: string; note: string }[] {
  return [
    { label: "Hyderabad", href: "/locations/hyderabad/", note: "Primary service city — 350+ localities" },
    { label: "Secunderabad", href: "/locations/hyderabad/secunderabad/", note: "Twin city coverage for apartments & villas" },
    { label: "Shamshabad", href: "/locations/hyderabad/shamshabad/", note: "Airport corridor homes & independent houses" },
    { label: "Kompally", href: "/locations/hyderabad/kompally/", note: "North Hyderabad gated communities" },
    { label: "Narsingi / Kokapet", href: "/locations/hyderabad/kokapet/", note: "ORR west high-rise corridor" },
  ];
}

function buildRelatedServices(): { label: string; href: string; summary: string }[] {
  return getPublishedServices().map((service) => ({
    label: service.name,
    href: `/services/${service.slug}/`,
    summary: service.summary,
  }));
}

function buildLinkGroups(): SeoLinkGroup[] {
  const citySlug = getPublishedLocations()[0]?.slug ?? "hyderabad";
  const services = getPublishedServices();

  return [
    {
      title: "Services in Hyderabad",
      description: "City-level landing pages for each product.",
      links: services.map((service) => ({
        label: `${service.name} in Hyderabad`,
        href: buildServiceInCityPath(service.slug, citySlug),
      })),
    },
    {
      title: "Popular service pages",
      description: "Core product guides with pricing and materials.",
      links: services.map((service) => ({
        label: service.name,
        href: `/services/${service.slug}/`,
      })),
    },
    {
      title: "High-intent topics",
      description: "Common homeowner searches we install for.",
      links: [
        { label: "Invisible grills for balcony", href: buildIntentPageUrl("invisible-grills", "invisible-grill-for-balcony") },
        { label: "Invisible grills for apartments", href: buildIntentPageUrl("invisible-grills", "invisible-grills-for-apartment") },
        { label: "Children safety nets", href: buildIntentPageUrl("children-safety-nets", "child-safety-net") },
        { label: "Balcony bird nets", href: buildIntentPageUrl("balcony-safety-nets", "balcony-bird-net") },
        { label: "Ceiling cloth hangers", href: buildIntentPageUrl("cloth-hangers", "ceiling-cloth-hanger") },
        { label: "Bird spikes stainless steel", href: buildIntentPageUrl("bird-spikes", "bird-spikes-stainless-steel") },
      ],
    },
    {
      title: "Guides & help",
      description: "Research before you book an inspection.",
      links: [
        { label: "Pricing guide", href: "/pricing-guide/" },
        { label: "Materials guide", href: "/materials-guide/" },
        { label: "Installation process", href: "/installation-process/" },
        { label: "Safety guide", href: "/safety-guide/" },
        { label: "FAQs", href: "/faq/" },
        { label: "Contact & free quote", href: "/contact/" },
      ],
    },
    {
      title: "Nearby area hubs",
      description: "Local landing pages for popular neighbourhoods.",
      links: buildNearbyAreas().slice(0, 12),
    },
  ];
}

export function buildHomeContent(): HomeContentPackage {
  const seoTitle = `${company} | Invisible Grills, Safety Nets & Home Safety in ${city}`;
  const metaTitle = seoTitle;
  const metaDescription = `${company} installs invisible grills, balcony safety nets, children & pet nets, mosquito nets, bird spikes and cloth hangers across ${city}. Free site inspection, transparent pricing. Call ${phone}.`;
  const h1 = `Invisible Grills, Safety Nets & Home Safety Solutions in ${city}`;

  return {
    seoTitle,
    metaTitle,
    metaDescription,
    urlPath: "/",
    h1,
    heroDescription: `${company} provides measurement-led invisible grills, balcony safety nets, bird protection and cloth hangers across ${city}. Free inspection, clear material grades and professional installation for apartments and villas.`,
    heroImage: HOME_HERO_IMAGE,
    highlights: buildHighlights(),
    blocks: buildContentBlocks(),
    projects: buildProjects(),
    galleryImages: getHomeGalleryImages().slice(0, 12).map((img, index) => ({
      ...img,
      alt: img.alt || `${company} project photo ${index + 1} in ${city}`,
    })),
    reviews: buildReviews(),
    faqs: buildFaqs(),
    nearbyAreas: buildNearbyAreas(),
    nearbyCities: buildNearbyCities(),
    relatedServices: buildRelatedServices(),
    linkGroups: buildLinkGroups(),
  };
}
