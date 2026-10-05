import { BUSINESS_CONFIG } from "@/config/business";
import { AREAS_MEGA_MENU, buildIntentPageUrl } from "@/config/mega-menu";
import { BLOG_POSTS } from "@/data/blog";
import { getPublishedServices, getServiceById } from "@/data/initial-services";
import { getPublishedLocations, getLocationById } from "@/data/initial-locations";
import { getPublishedAreas, getServedAreas, getAreaById } from "@/data/initial-areas";
import { getSampleIntentsForService } from "@/data/keyword-intents";
import { buildServiceInCityPath } from "@/lib/utils/service-in-city-slug";
import { hashSeed, seededShuffle, seededSlice } from "@/lib/internal-links/seeded-rotate";
import type { PageRecord } from "@/types/page";
import type {
  ExploreMoreCard,
  ExploreMoreCardId,
  ExploreMoreLink,
  ExploreMoreSectionData,
} from "@/types/explore-more";

const LINKS_PER_CARD = 10;
const MAX_CARDS = 12;

type BuildExploreMoreInput = {
  path: string;
  pageType?: PageRecord["pageType"] | "home" | "invisible-grills-locality";
  h1?: string;
  serviceId?: string;
  locationId?: string;
  areaId?: string;
  placeName?: string;
  /** Extra high-intent links from page content builders */
  priorityLinks?: ExploreMoreLink[];
};

function normalizeHref(href: string) {
  if (!href.startsWith("/")) return href;
  return href.endsWith("/") ? href : `${href}/`;
}

function card(
  partial: ExploreMoreCard,
): ExploreMoreCard {
  return {
    ...partial,
    links: partial.links.slice(0, LINKS_PER_CARD),
    variant: partial.variant ?? "standard",
  };
}

/**
 * Builds a unique, deduplicated Explore More board for any programmatic page.
 * Card set + ordering + link offsets are seeded from the page path.
 */
export function buildExploreMoreSection(input: BuildExploreMoreInput): ExploreMoreSectionData {
  const path = normalizeHref(input.path);
  const seed = hashSeed(path);
  const service = input.serviceId ? getServiceById(input.serviceId) : undefined;
  const location = input.locationId
    ? getLocationById(input.locationId)
    : getPublishedLocations()[0];
  const area = input.areaId ? getAreaById(input.areaId) : undefined;
  const citySlug = location?.slug ?? "hyderabad";
  const cityName = location?.name ?? BUSINESS_CONFIG.serviceArea.primaryCity;
  const place = input.placeName ?? area?.name ?? cityName;
  const services = getPublishedServices();
  const areas = location ? getServedAreas(location.id) : getPublishedAreas();

  const used = new Set<string>([path]);

  function take(links: ExploreMoreLink[], count = LINKS_PER_CARD): ExploreMoreLink[] {
    const out: ExploreMoreLink[] = [];
    for (const link of links) {
      const href = normalizeHref(link.href);
      if (used.has(href) || href === path) continue;
      used.add(href);
      out.push({ ...link, href });
      if (out.length >= count) break;
    }
    return out;
  }

  const megaAreas = AREAS_MEGA_MENU.flatMap((col) =>
    col.areas.map((a) => ({
      label: a.label,
      href: `/locations/${citySlug}/${a.slug}/`,
    })),
  );

  const nearbyAreaLinks = seededShuffle(
    [
      ...areas.map((a) => ({
        label: `${service?.shortName ?? "Home safety"} in ${a.name}`,
        href: service
          ? `/${citySlug}/${a.slug}/${service.slug}/`
          : `/locations/${citySlug}/${a.slug}/`,
      })),
      ...megaAreas,
    ],
    seed + 11,
  );

  const relatedServiceLinks = seededShuffle(
    services
      .filter((s) => s.id !== service?.id)
      .flatMap((s) => [
        {
          label: `${s.name} in ${cityName}`,
          href: buildServiceInCityPath(s.slug, citySlug),
        },
        {
          label: s.name,
          href: `/services/${s.slug}/`,
        },
      ]),
    seed + 22,
  );

  const popularSearchLinks = service
    ? seededShuffle(
        getSampleIntentsForService(service.slug, 24).map((intent) => ({
          label: intent.label,
          // Indexable service×area (or service-in-city) — never deep noindex intents.
          href: area
            ? `/${citySlug}/${area.slug}/${service.slug}/`
            : buildServiceInCityPath(service.slug, citySlug),
        })),
        seed + 33,
      )
    : seededShuffle(
        [
          { label: "Invisible grills for balcony", href: buildIntentPageUrl("invisible-grills", "invisible-grill-for-balcony") },
          { label: "Invisible grills for apartments", href: buildIntentPageUrl("invisible-grills", "invisible-grills-for-apartment") },
          { label: "Children safety nets", href: buildIntentPageUrl("children-safety-nets", "child-safety-net") },
          { label: "Balcony bird nets", href: buildIntentPageUrl("balcony-safety-nets", "balcony-bird-net") },
          { label: "Ceiling cloth hangers", href: buildIntentPageUrl("cloth-hangers", "ceiling-cloth-hanger") },
          { label: "Bird spikes stainless steel", href: buildIntentPageUrl("bird-spikes", "bird-spikes-stainless-steel") },
          { label: "Pet safety nets", href: buildIntentPageUrl("pet-safety-nets", "pet-safety-net") },
          { label: "Mosquito nets", href: "/services/mosquito-nets/" },
          { label: "Cricket practice nets", href: buildIntentPageUrl("cricket-nets", "cricket-practice-net") },
          { label: "Invisible grills in Hyderabad", href: "/invisible-grills-in-hyderabad/" },
          { label: "Balcony safety nets in Hyderabad", href: "/balcony-safety-nets-in-hyderabad/" },
          { label: "Children safety nets in Hyderabad", href: "/children-safety-nets-in-hyderabad/" },
        ],
        seed + 33,
      );

  const blogLinks = seededSlice(
    BLOG_POSTS.filter((p) => p.publicationStatus === "published").map((p) => ({
      label: p.title,
      href: `/blog/${p.slug}/`,
    })),
    seed + 44,
    LINKS_PER_CARD,
  );

  const guideLinks = seededShuffle(
    [
      { label: "Pricing guide", href: "/pricing-guide/" },
      { label: "Materials guide", href: "/materials-guide/" },
      { label: "Installation process", href: "/installation-process/" },
      { label: "Safety guide", href: "/safety-guide/" },
      { label: "FAQs", href: "/faq/" },
      { label: "Gallery", href: "/gallery/" },
      { label: "Projects", href: "/projects/" },
      { label: "Testimonials", href: "/testimonials/" },
      { label: "Guides hub", href: "/guides/" },
      { label: "Solutions hub", href: "/solutions/" },
      { label: "Property types", href: "/property-types/" },
      { label: "About us", href: "/about/" },
    ],
    seed + 55,
  );

  const cityHubLinks = seededShuffle(
    [
      { label: `${cityName} locations hub`, href: `/locations/${citySlug}/` },
      { label: "All locations", href: "/locations/" },
      { label: "Secunderabad area hub", href: `/locations/${citySlug}/secunderabad/` },
      { label: "Gachibowli area hub", href: `/locations/${citySlug}/gachibowli/` },
      { label: "Madhapur area hub", href: `/locations/${citySlug}/madhapur/` },
      { label: "Kondapur area hub", href: `/locations/${citySlug}/kondapur/` },
      { label: "Kukatpally area hub", href: `/locations/${citySlug}/kukatpally/` },
      { label: "Miyapur area hub", href: `/locations/${citySlug}/miyapur/` },
      { label: "Kompally area hub", href: `/locations/${citySlug}/kompally/` },
      { label: "Shamshabad area hub", href: `/locations/${citySlug}/shamshabad/` },
      { label: "Kokapet area hub", href: `/locations/${citySlug}/kokapet/` },
      { label: "Karmanghat area hub", href: `/locations/${citySlug}/karmanghat/` },
    ],
    seed + 66,
  );

  const buildingTypeLinks = seededShuffle(
    [
      { label: "Apartment invisible grills", href: "/property-types/apartments/invisible-grills/" },
      { label: "Villa invisible grills", href: "/property-types/villas/invisible-grills/" },
      { label: "Duplex balcony nets", href: "/property-types/duplexes/balcony-safety-nets/" },
      { label: "Apartment child safety nets", href: "/property-types/apartments/children-safety-nets/" },
      { label: "Independent house nets", href: "/property-types/independent-houses/balcony-safety-nets/" },
      { label: "Villa balcony safety nets", href: "/property-types/villas/balcony-safety-nets/" },
      { label: "Apartment mosquito nets", href: "/property-types/apartments/mosquito-nets/" },
      { label: "Villa bird spikes", href: "/property-types/villas/bird-spikes/" },
      { label: "All property types", href: "/property-types/" },
      { label: "Solutions by problem", href: "/solutions/" },
    ],
    seed + 77,
  );

  const applicationLinks = seededShuffle(
    [
      { label: "Balcony protection", href: service ? `/services/${service.slug}/` : "/services/balcony-safety-nets/" },
      { label: "Window safety", href: "/services/invisible-grills/" },
      { label: "Child fall protection", href: "/services/children-safety-nets/" },
      { label: "Pet balcony safety", href: "/services/pet-safety-nets/" },
      { label: "Bird & pigeon control", href: "/services/bird-spikes/" },
      { label: "Mosquito protection", href: "/services/mosquito-nets/" },
      { label: "Clothes drying solutions", href: "/services/cloth-hangers/" },
      { label: "Sports practice nets", href: "/services/cricket-nets/" },
      { label: "Terrace safety", href: "/services/balcony-safety-nets/" },
      { label: "Duct area bird nets", href: buildIntentPageUrl("balcony-safety-nets", "duct-area-safety-net") },
    ],
    seed + 88,
  );

  const landmarkLinks = seededSlice(nearbyAreaLinks, seed + 99, LINKS_PER_CARD, 3);
  const apartmentLinks = seededSlice(nearbyAreaLinks, seed + 111, LINKS_PER_CARD, 7);
  const commercialLinks = seededSlice(cityHubLinks, seed + 122, LINKS_PER_CARD, 2);
  const itParkLinks = seededShuffle(
    [
      { label: "Madhapur / HITEC City", href: `/locations/${citySlug}/madhapur/` },
      { label: "Gachibowli IT corridor", href: `/locations/${citySlug}/gachibowli/` },
      { label: "Financial District / Nanakramguda", href: `/locations/${citySlug}/nanakramguda/` },
      { label: "Kondapur tech homes", href: `/locations/${citySlug}/kondapur/` },
      { label: "Raidurg / Cyber Towers area", href: `/locations/${citySlug}/raidurg/` },
      { label: "Kokapet ORR west", href: `/locations/${citySlug}/kokapet/` },
      { label: "Miyapur north corridor", href: `/locations/${citySlug}/miyapur/` },
      { label: "Kompally gated communities", href: `/locations/${citySlug}/kompally/` },
      { label: `${cityName} service coverage`, href: `/locations/${citySlug}/` },
      { label: "All services", href: "/services/" },
    ],
    seed + 133,
  );

  const currentServiceLinks = take(
    [
      ...(service
        ? [
            { label: `${service.name} overview`, href: `/services/${service.slug}/` },
            { label: `${service.name} in ${cityName}`, href: buildServiceInCityPath(service.slug, citySlug) },
            ...(area
              ? [{ label: `${service.name} in ${area.name}`, href: `/${citySlug}/${area.slug}/${service.slug}/` }]
              : []),
          ]
        : []),
      ...(input.priorityLinks ?? []),
      ...popularSearchLinks,
      ...relatedServiceLinks,
    ],
    LINKS_PER_CARD,
  );

  const pool: ExploreMoreCard[] = [
    card({
      id: "current-service",
      title: service ? service.name : `Home safety in ${place}`,
      description: `Core pages for ${service?.shortName.toLowerCase() ?? "installation"} around ${place}.`,
      icon: "service",
      links: currentServiceLinks,
      viewAllHref: service ? `/services/${service.slug}/` : "/services/",
      viewAllLabel: "View service hub",
      variant: "featured",
      defaultOpen: true,
    }),
    card({
      id: "related-services",
      title: "Related services",
      description: "Complementary installations homeowners often book together.",
      icon: "related",
      links: take(relatedServiceLinks),
      viewAllHref: "/services/",
      viewAllLabel: "All services",
    }),
    card({
      id: "nearby-areas",
      title: "Nearby areas",
      description: `Local landing pages near ${place} for faster discovery.`,
      icon: "map",
      links: take(nearbyAreaLinks),
      viewAllHref: `/locations/${citySlug}/`,
      viewAllLabel: `All ${cityName} areas`,
      defaultOpen: true,
    }),
    card({
      id: "nearby-cities",
      title: "City hubs",
      description: "Primary city and twin-city coverage pages.",
      icon: "city",
      links: take(cityHubLinks),
      viewAllHref: "/locations/",
      viewAllLabel: "Browse locations",
    }),
    card({
      id: "nearby-districts",
      title: "District & corridor hubs",
      description: "High-density residential and ORR corridor clusters.",
      icon: "district",
      links: take(seededSlice(nearbyAreaLinks, seed + 141, 16, 5)),
      viewAllHref: `/locations/${citySlug}/`,
    }),
    card({
      id: "nearby-states",
      title: "Regional coverage",
      description: "State and metro-region context for Telangana homeowners.",
      icon: "state",
      links: take([
        { label: `${cityName}, Telangana`, href: `/locations/${citySlug}/` },
        { label: "About Secure Vista Solutions", href: "/about/" },
        { label: "Contact our Hyderabad team", href: "/contact/" },
        { label: "Service areas overview", href: "/locations/" },
        { label: "Installation process", href: "/installation-process/" },
        { label: "Safety guide", href: "/safety-guide/" },
        { label: "Materials guide", href: "/materials-guide/" },
        { label: "Pricing guide", href: "/pricing-guide/" },
        { label: "FAQs", href: "/faq/" },
        { label: "Projects", href: "/projects/" },
      ]),
      viewAllHref: "/locations/",
    }),
    card({
      id: "popular-searches",
      title: "Popular searches",
      description: "High-intent topics people research before booking.",
      icon: "search",
      links: take(popularSearchLinks),
      viewAllHref: "/solutions/",
      viewAllLabel: "Explore solutions",
    }),
    card({
      id: "price-guides",
      title: "Price guides",
      description: "Cost factors, quotes and transparent pricing notes.",
      icon: "price",
      links: take(
        seededShuffle(
          [
            { label: "Pricing guide", href: "/pricing-guide/" },
            { label: "Materials & grade pricing context", href: "/materials-guide/" },
            { label: "Request a free quote", href: "/contact/" },
            { label: "Installation process", href: "/installation-process/" },
            { label: `${service?.name ?? "Service"} in ${cityName}`, href: service ? buildServiceInCityPath(service.slug, citySlug) : `/locations/${citySlug}/` },
            ...relatedServiceLinks.slice(0, 6),
          ],
          seed + 150,
        ),
      ),
      viewAllHref: "/pricing-guide/",
      viewAllLabel: "Open pricing guide",
    }),
    card({
      id: "buying-guides",
      title: "Buying guides",
      description: "Helpful research pages before you choose a system.",
      icon: "guide",
      links: take(guideLinks),
      viewAllHref: "/guides/",
    }),
    card({
      id: "installation-guides",
      title: "Installation guides",
      description: "How measurement, fitting and handover typically work.",
      icon: "install",
      links: take(
        seededShuffle(
          [
            { label: "Installation process", href: "/installation-process/" },
            { label: "Safety guide", href: "/safety-guide/" },
            { label: "Materials guide", href: "/materials-guide/" },
            { label: "Book free inspection", href: "/contact/" },
            { label: "FAQs", href: "/faq/" },
            ...popularSearchLinks.slice(0, 6),
          ],
          seed + 160,
        ),
      ),
      viewAllHref: "/installation-process/",
    }),
    card({
      id: "applications",
      title: "Applications",
      description: "Where homeowners and property managers usually install.",
      icon: "app",
      links: take(applicationLinks),
      viewAllHref: "/solutions/",
    }),
    card({
      id: "building-types",
      title: "Building types",
      description: "Apartment, villa, office and institutional use-cases.",
      icon: "building",
      links: take(buildingTypeLinks),
      viewAllHref: "/property-types/",
    }),
    card({
      id: "materials",
      title: "Materials",
      description: "SS grades, mesh types and durability considerations.",
      icon: "materials",
      links: take([
        { label: "Materials guide", href: "/materials-guide/" },
        { label: "Safety guide", href: "/safety-guide/" },
        { label: "Pricing factors", href: "/pricing-guide/" },
        { label: "Invisible grills overview", href: "/services/invisible-grills/" },
        { label: "Balcony safety nets overview", href: "/services/balcony-safety-nets/" },
        { label: "Mosquito nets overview", href: "/services/mosquito-nets/" },
        { label: "Bird spikes overview", href: "/services/bird-spikes/" },
        { label: "Installation process", href: "/installation-process/" },
        { label: "FAQs", href: "/faq/" },
        { label: "Contact for site advice", href: "/contact/" },
      ]),
      viewAllHref: "/materials-guide/",
    }),
    card({
      id: "maintenance",
      title: "Maintenance",
      description: "Care tips and long-term ownership pages.",
      icon: "maintenance",
      links: take(
        seededShuffle(
          [
            { label: "Safety guide", href: "/safety-guide/" },
            { label: "Materials guide", href: "/materials-guide/" },
            { label: "FAQs", href: "/faq/" },
            { label: "Contact for service support", href: "/contact/" },
            ...blogLinks,
          ],
          seed + 170,
        ),
      ),
      viewAllHref: "/faq/",
    }),
    card({
      id: "repair",
      title: "Repair & replacement",
      description: "Support paths when an existing installation needs attention.",
      icon: "repair",
      links: take([
        { label: "Contact for repair assessment", href: "/contact/" },
        { label: "Installation process", href: "/installation-process/" },
        { label: "Materials guide", href: "/materials-guide/" },
        { label: "Safety guide", href: "/safety-guide/" },
        { label: "Pricing guide", href: "/pricing-guide/" },
        { label: "Invisible grills service", href: "/services/invisible-grills/" },
        { label: "Balcony nets service", href: "/services/balcony-safety-nets/" },
        { label: "Mosquito nets service", href: "/services/mosquito-nets/" },
        { label: "FAQs", href: "/faq/" },
        { label: "Testimonials", href: "/testimonials/" },
      ]),
      viewAllHref: "/contact/",
      viewAllLabel: "Request assessment",
    }),
    card({
      id: "faqs",
      title: "FAQs",
      description: "Common questions before inspection and installation.",
      icon: "faq",
      links: take([
        { label: "Full FAQ page", href: "/faq/" },
        { label: "Pricing questions", href: "/pricing-guide/" },
        { label: "Materials questions", href: "/materials-guide/" },
        { label: "Installation questions", href: "/installation-process/" },
        { label: "Safety questions", href: "/safety-guide/" },
        { label: "Contact support", href: "/contact/" },
        ...blogLinks.slice(0, 4),
      ]),
      viewAllHref: "/faq/",
    }),
    card({
      id: "recent-projects",
      title: "Recent projects",
      description: "Proof of work across Hyderabad neighbourhoods.",
      icon: "project",
      links: take([
        { label: "Projects gallery", href: "/projects/" },
        { label: "Photo gallery", href: "/gallery/" },
        { label: "Customer testimonials", href: "/testimonials/" },
        ...nearbyAreaLinks.slice(0, 8).map((l) => ({ label: l.label, href: l.href })),
      ]),
      viewAllHref: "/projects/",
    }),
    card({
      id: "gallery",
      title: "Gallery",
      description: "Installation photos for apartments, villas and terraces.",
      icon: "gallery",
      links: take([
        { label: "Open gallery", href: "/gallery/" },
        { label: "Projects", href: "/projects/" },
        { label: "Testimonials", href: "/testimonials/" },
        ...relatedServiceLinks.slice(0, 7),
      ]),
      viewAllHref: "/gallery/",
    }),
    card({
      id: "latest-blogs",
      title: "Latest articles",
      description: "Guides that deepen topical authority around home safety.",
      icon: "blog",
      links: take(blogLinks.length ? blogLinks : guideLinks),
      viewAllHref: "/blog/",
      viewAllLabel: "All articles",
    }),
    card({
      id: "nearby-landmarks",
      title: "Nearby landmarks",
      description: `Locality pages useful around ${place}.`,
      icon: "landmark",
      links: take(landmarkLinks),
      viewAllHref: `/locations/${citySlug}/`,
    }),
    card({
      id: "nearby-apartments",
      title: "Apartment corridors",
      description: "High-rise and gated-community focused hubs.",
      icon: "apartment",
      links: take(apartmentLinks),
      viewAllHref: "/property-types/",
    }),
    card({
      id: "nearby-commercial",
      title: "Commercial areas",
      description: "Office and mixed-use clusters with related coverage pages.",
      icon: "commercial",
      links: take(commercialLinks),
      viewAllHref: "/property-types/",
    }),
    card({
      id: "nearby-it-parks",
      title: "IT park corridors",
      description: "Tech-corridor neighbourhoods with strong apartment demand.",
      icon: "itpark",
      links: take(itParkLinks),
      viewAllHref: `/locations/${citySlug}/`,
    }),
    card({
      id: "related-products",
      title: "Related products",
      description: "Complementary product pages for complete home protection.",
      icon: "product",
      links: take(relatedServiceLinks),
      viewAllHref: "/services/",
    }),
    card({
      id: "customer-reviews",
      title: "Customer reviews",
      description: "Social proof and local installation feedback.",
      icon: "review",
      links: take([
        { label: "Testimonials", href: "/testimonials/" },
        { label: "Projects", href: "/projects/" },
        { label: "Gallery", href: "/gallery/" },
        { label: "Contact us", href: "/contact/" },
        { label: "About the company", href: "/about/" },
        ...nearbyAreaLinks.slice(0, 5),
      ]),
      viewAllHref: "/testimonials/",
    }),
    card({
      id: "contact",
      title: "Contact",
      description: `Talk to ${BUSINESS_CONFIG.name} for ${place}.`,
      icon: "contact",
      links: take([
        { label: "Contact page", href: "/contact/" },
        { label: "Request a quote", href: "/contact/" },
        { label: `Call ${BUSINESS_CONFIG.phone.display}`, href: `tel:${BUSINESS_CONFIG.phone.raw}` },
        { label: "About us", href: "/about/" },
        { label: "FAQs", href: "/faq/" },
        { label: "Pricing guide", href: "/pricing-guide/" },
        { label: "Installation process", href: "/installation-process/" },
        { label: "Privacy policy", href: "/privacy-policy/" },
        { label: "Terms", href: "/terms-and-conditions/" },
      ]),
      viewAllHref: "/contact/",
      variant: "cta",
    }),
    card({
      id: "book-inspection",
      title: "Book free inspection",
      description: "High-converting next step after reading this page.",
      icon: "inspect",
      links: take([
        { label: "Book free inspection", href: "/contact/" },
        { label: `Call ${BUSINESS_CONFIG.phone.display}`, href: `tel:${BUSINESS_CONFIG.phone.raw}` },
        { label: "WhatsApp us", href: `https://wa.me/${BUSINESS_CONFIG.whatsapp.raw}` },
        { label: "Pricing guide", href: "/pricing-guide/" },
        { label: "Installation process", href: "/installation-process/" },
        { label: "Safety guide", href: "/safety-guide/" },
        { label: "Gallery", href: "/gallery/" },
        { label: "Testimonials", href: "/testimonials/" },
        { label: `Services in ${cityName}`, href: `/locations/${citySlug}/` },
        { label: "All services", href: "/services/" },
      ]),
      viewAllHref: "/contact/",
      viewAllLabel: "Book now",
      variant: "cta",
      defaultOpen: true,
    }),
  ].filter((c) => c.links.length >= 4);

  const preferredOrder: ExploreMoreCardId[] = seededShuffle(
    [
      "current-service",
      "related-services",
      "nearby-areas",
      "popular-searches",
      "price-guides",
      "buying-guides",
      "applications",
      "building-types",
      "nearby-cities",
      "nearby-it-parks",
      "installation-guides",
      "materials",
      "latest-blogs",
      "faqs",
      "recent-projects",
      "gallery",
      "customer-reviews",
      "nearby-apartments",
      "nearby-landmarks",
      "nearby-commercial",
      "nearby-districts",
      "maintenance",
      "repair",
      "related-products",
      "nearby-states",
      "contact",
      "book-inspection",
    ],
    seed,
  );

  // Always keep conversion cards visible, but rotate mid-board uniqueness.
  const byId = new Map(pool.map((c) => [c.id, c]));
  const selected: ExploreMoreCard[] = [];
  const mustHave: ExploreMoreCardId[] = ["nearby-areas", "related-services", "book-inspection"];
  if (service) mustHave.unshift("current-service");

  for (const id of mustHave) {
    const c = byId.get(id);
    if (c && !selected.find((s) => s.id === id)) selected.push(c);
  }
  for (const id of preferredOrder) {
    if (selected.length >= MAX_CARDS) break;
    const c = byId.get(id);
    if (c && !selected.find((s) => s.id === id)) selected.push(c);
  }

  // Final card order: featured first, CTA last-ish, rest seeded.
  const featured = selected.filter((c) => c.variant === "featured");
  const ctas = selected.filter((c) => c.variant === "cta");
  const rest = seededShuffle(
    selected.filter((c) => c.variant !== "featured" && c.variant !== "cta"),
    seed + 999,
  );

  return {
    title: `Explore more around ${place}`,
    intro: `Curated internal links for ${place} — services, nearby areas, guides and high-intent topics. Unique layout for this page to help readers and crawlers discover the next best step.`,
    currentPath: path,
    cards: [...featured, ...rest, ...ctas].slice(0, MAX_CARDS),
  };
}

export function buildExploreMoreFromPage(page: PageRecord, priorityLinks?: ExploreMoreLink[]) {
  return buildExploreMoreSection({
    path: page.path,
    pageType: page.pageType,
    h1: page.h1,
    serviceId: page.serviceId,
    locationId: page.locationId,
    areaId: page.areaId,
    priorityLinks,
  });
}
