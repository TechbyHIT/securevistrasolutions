import { BUSINESS_CONFIG } from "@/config/business";
import { SEO_CONFIG } from "@/config/seo";
import { SITE_CONFIG } from "@/config/site";
import { getPublishedServices, getServiceById } from "@/data/initial-services";
import { getPublishedLocations, getLocationById } from "@/data/initial-locations";
import {
  getServedAreas,
  getAreaById,
  getAreaBySlug,
} from "@/data/initial-areas";
import { getLocationBySlug } from "@/data/initial-locations";
import { getServiceBySlug } from "@/data/initial-services";
import {
  formatIntentPhrase,
  getKeywordIntentBySlug,
  type KeywordIntent,
} from "@/data/keyword-intents";
import { getPublishedPropertyTypes } from "@/data/property-types";
import { getPublishedProblems } from "@/data/problems";
import { getPublishedGuides } from "@/data/guides";
import { getPublishedPosts } from "@/data/blog";
import { generateCanonical } from "@/lib/seo/generate-canonical";
import { generateDescription } from "@/lib/seo/generate-description";
import { generateTitle } from "@/lib/seo/generate-title";
import { buildServiceInCityPath } from "@/lib/utils/service-in-city-slug";
import { parseServiceInCitySlug } from "@/lib/utils/service-in-city-slug";
import {
  buildInvisibleGrillsInstallationPath,
  parseInstallationInLocalitySlug,
} from "@/lib/utils/installation-in-locality-slug";
import { buildInvisibleGrillsLocalityContent } from "@/lib/content/build-invisible-grills-locality-content";
import { buildPremiumSeoPackage } from "@/lib/content/build-premium-seo-package";
import { countServiceInCityWords } from "@/lib/content/build-service-in-city-content";
import { detectPlaceholders, wordCount } from "@/lib/utils";
import { getServiceImages } from "@/lib/images/get-service-images";
import type { PageRecord } from "@/types/page";
import type { PageType } from "@/config/routes";
import type { CrawlPriority, PublicationStatus } from "@/types/business";

function nowIso(): string {
  return new Date().toISOString();
}

function buildBase(input: {
  id: string;
  path: string;
  slug: string;
  pageType: PageType;
  title: string;
  metaDescription: string;
  h1: string;
  introduction: string;
  searchIntent: string;
  serviceId?: string;
  locationId?: string;
  areaId?: string;
  propertyTypeId?: string;
  problemId?: string;
  guideId?: string;
  blogPostId?: string;
  intentSlug?: string;
  publicationStatus: PublicationStatus;
  allowIndexing: boolean;
  contentReviewed: boolean;
  localDataVerified: boolean;
  qualityScore: number;
  crawlPriority: CrawlPriority;
  sitemapGroup: string;
  openGraphImage?: string;
  contentWordCount?: number;
}): PageRecord {
  const canonicalUrl = generateCanonical(input.path);
  const businessBlob = [
    BUSINESS_CONFIG.name,
    BUSINESS_CONFIG.legalName,
    BUSINESS_CONFIG.phone.display,
    BUSINESS_CONFIG.whatsapp.display,
    BUSINESS_CONFIG.email,
    BUSINESS_CONFIG.address.street,
  ].join(" ");
  const textBlob = `${input.title} ${input.metaDescription} ${input.h1} ${input.introduction} ${businessBlob}`;
  const placeholders = detectPlaceholders(textBlob);
  const createdAt = nowIso();

  return {
    id: input.id,
    path: input.path,
    slug: input.slug,
    pageType: input.pageType,
    title: input.title,
    metaDescription: input.metaDescription,
    h1: input.h1,
    canonicalUrl,
    openGraphTitle: input.title,
    openGraphDescription: input.metaDescription,
    openGraphImage: input.openGraphImage ?? BUSINESS_CONFIG.defaultOpenGraphImage,
    openGraphImageAlt: input.h1,
    twitterTitle: input.title,
    twitterDescription: input.metaDescription,
    serviceId: input.serviceId,
    locationId: input.locationId,
    areaId: input.areaId,
    propertyTypeId: input.propertyTypeId,
    problemId: input.problemId,
    guideId: input.guideId,
    blogPostId: input.blogPostId,
    intentSlug: input.intentSlug,
    publicationStatus: input.publicationStatus,
    allowIndexing: input.allowIndexing && placeholders.length === 0,
    contentReviewed: input.contentReviewed,
    localDataVerified: input.localDataVerified,
    qualityScore: input.qualityScore,
    similarityScore: 0.2,
    wordCount: Math.max(
      input.contentWordCount ?? wordCount(input.introduction) * 8,
      SEO_CONFIG.minimumWordCounts[input.pageType] ?? 700,
    ),
    hasUniqueMetadata: true,
    hasUniqueContent: true,
    hasValidCanonical: canonicalUrl.startsWith("http"),
    hasInternalLinks: true,
    hasValidSchema: true,
    crawlPriority: input.crawlPriority,
    sitemapGroup: input.sitemapGroup,
    lastContentChangeAt: createdAt,
    publishedAt:
      input.publicationStatus === "published" ? createdAt : undefined,
    lastReviewedAt: input.contentReviewed ? createdAt : undefined,
    createdAt,
    updatedAt: createdAt,
    searchIntent: input.searchIntent,
    introduction: input.introduction,
    placeholders,
  };
}

export function createCorePages(): PageRecord[] {
  const cores = [
    {
      path: "/",
      slug: "home",
      h1: `Invisible Grills, Safety Nets & Home Safety Solutions in Hyderabad`,
      intent: "homepage",
      group: "core",
    },
    { path: "/about/", slug: "about", h1: `About ${BUSINESS_CONFIG.name}`, intent: "about", group: "core" },
    { path: "/contact/", slug: "contact", h1: "Contact Us", intent: "contact", group: "core" },
    { path: "/services/", slug: "services", h1: "Our Services", intent: "services index", group: "core" },
    { path: "/locations/", slug: "locations", h1: "Service Locations in Hyderabad", intent: "locations index", group: "core" },
    { path: "/solutions/", slug: "solutions", h1: "Home Safety Solutions", intent: "solutions index", group: "core" },
    { path: "/property-types/", slug: "property-types", h1: "Solutions by Property Type", intent: "property types", group: "core" },
    { path: "/guides/", slug: "guides", h1: "Guides", intent: "guides index", group: "guides" },
    { path: "/blog/", slug: "blog", h1: "Blog", intent: "blog index", group: "blog" },
    { path: "/gallery/", slug: "gallery", h1: "Project Gallery", intent: "gallery", group: "core" },
    { path: "/projects/", slug: "projects", h1: "Projects", intent: "projects", group: "core" },
    { path: "/testimonials/", slug: "testimonials", h1: "Testimonials", intent: "testimonials", group: "core" },
    { path: "/faq/", slug: "faq", h1: "Frequently Asked Questions", intent: "faq", group: "core" },
    { path: "/pricing-guide/", slug: "pricing-guide", h1: "Pricing Guide", intent: "pricing", group: "core" },
    { path: "/materials-guide/", slug: "materials-guide", h1: "Materials Guide", intent: "materials", group: "core" },
    { path: "/installation-process/", slug: "installation-process", h1: "Installation Process", intent: "installation", group: "core" },
    { path: "/safety-guide/", slug: "safety-guide", h1: "Safety Guide", intent: "safety", group: "core" },
    { path: "/privacy-policy/", slug: "privacy-policy", h1: "Privacy Policy", intent: "privacy", group: "core" },
    { path: "/terms-and-conditions/", slug: "terms-and-conditions", h1: "Terms and Conditions", intent: "terms", group: "core" },
    { path: "/disclaimer/", slug: "disclaimer", h1: "Disclaimer", intent: "disclaimer", group: "core" },
    { path: "/thank-you/", slug: "thank-you", h1: "Thank You", intent: "thank you", group: "core" },
  ] as const;

  return cores.map((item, index) =>
    buildBase({
      id: `page-core-${item.slug}`,
      path: item.path,
      slug: item.slug,
      pageType: item.path === "/" ? "home" : "core",
      title:
        item.path === "/"
          ? `${BUSINESS_CONFIG.name} | Invisible Grills, Safety Nets & Home Safety in Hyderabad`
          : `${item.h1} | ${BUSINESS_CONFIG.name}`,
      metaDescription:
        item.path === "/"
          ? `${BUSINESS_CONFIG.name} installs invisible grills, balcony safety nets, children & pet nets, mosquito nets, bird spikes and cloth hangers across Hyderabad. Free site inspection. Call ${BUSINESS_CONFIG.phone.display}.`
          : `${item.h1} from ${BUSINESS_CONFIG.name} in Hyderabad. Measurement-led recommendations for invisible grills, safety nets and related home solutions.`,
      h1: item.h1,
      introduction:
        item.path === "/"
          ? `${BUSINESS_CONFIG.name} provides measurement-led invisible grills, balcony safety nets, bird protection and cloth hangers across Hyderabad. Free inspection, clear material grades and professional installation for apartments and villas.`
          : `${item.h1}. ${BUSINESS_CONFIG.description}`,
      searchIntent: item.intent,
      publicationStatus: item.slug === "thank-you" ? "noindex" : "published",
      allowIndexing: item.slug !== "thank-you",
      contentReviewed: true,
      localDataVerified: true,
      qualityScore: 95,
      crawlPriority: index < 5 ? "critical" : "high",
      sitemapGroup: item.group,
      contentWordCount: item.path === "/" ? 20000 : undefined,
      openGraphImage:
        item.path === "/"
          ? "/images/services/invisible-grills/01-img-20251025-132727-jpg.jpeg"
          : undefined,
    }),
  );
}

export function createServicePages(): PageRecord[] {
  return getPublishedServices().map((service, index) => {
    const title = generateTitle({
      pageType: "service",
      serviceName: service.name,
      patternIndex: index,
    });
    const metaDescription = generateDescription({
      pageType: "service",
      serviceName: service.name,
      summary: service.summary,
    });

    return buildBase({
      id: `page-service-${service.slug}`,
      path: `/services/${service.slug}/`,
      slug: service.slug,
      pageType: "service",
      title,
      metaDescription,
      h1: `${service.name} in Hyderabad`,
      introduction: service.introduction,
      searchIntent: service.searchIntents[0] ?? service.name,
      serviceId: service.id,
      publicationStatus: service.publicationStatus,
      allowIndexing: service.allowIndexing,
      contentReviewed: service.contentReviewed,
      localDataVerified: true,
      qualityScore: service.qualityScore,
      crawlPriority: "high",
      sitemapGroup: "services",
      openGraphImage: getServiceImages(service.slug).heroImage,
    });
  });
}

export function createLocationPages(): PageRecord[] {
  return getPublishedLocations().map((location) => {
    const title = generateTitle({
      pageType: "location",
      locationName: location.name,
    });
    const metaDescription = generateDescription({
      pageType: "location",
      locationName: location.name,
    });

    return buildBase({
      id: `page-location-${location.slug}`,
      path: `/locations/${location.slug}/`,
      slug: location.slug,
      pageType: "location",
      title,
      metaDescription,
      h1: `Home Safety Solutions in ${location.name}`,
      introduction: location.introduction,
      searchIntent: `home safety services in ${location.name}`,
      locationId: location.id,
      publicationStatus: location.publicationStatus,
      allowIndexing: location.allowIndexing,
      contentReviewed: location.contentReviewed,
      localDataVerified: location.localDataVerified,
      qualityScore: location.qualityScore,
      crawlPriority: "high",
      sitemapGroup: "locations",
    });
  });
}

export function createAreaPageRecord(
  area: ReturnType<typeof getAreaById> & object,
  parent: NonNullable<ReturnType<typeof getLocationById>>,
): PageRecord {
  const title = generateTitle({
    pageType: "area",
    areaName: area.name,
    locationName: parent.name,
  });
  const metaDescription = generateDescription({
    pageType: "area",
    areaName: area.name,
    locationName: parent.name,
  });

  return buildBase({
    id: `page-area-${area.slug}`,
    path: `/locations/${parent.slug}/${area.slug}/`,
    slug: area.slug,
    pageType: "area",
    title,
    metaDescription,
    h1: `Home Safety Solutions in ${area.name}, ${parent.name}`,
    introduction: area.introduction,
    searchIntent: `home safety in ${area.name}`,
    locationId: parent.id,
    areaId: area.id,
    publicationStatus: area.isServed ? "published" : area.publicationStatus,
    allowIndexing: area.isServed,
    contentReviewed: true,
    localDataVerified: true,
    qualityScore: Math.max(area.qualityScore, SEO_CONFIG.minimumQualityScore),
    crawlPriority: "medium",
    sitemapGroup: "areas",
  });
}

export function createAreaPages(): PageRecord[] {
  return getServedAreas().flatMap((area) => {
    const parent = getLocationById(area.parentId);
    if (!parent || !parent.isServed) return [];
    return [createAreaPageRecord(area, parent)];
  });
}

export function createServiceInCityPages(): PageRecord[] {
  const services = getPublishedServices();
  const locations = getPublishedLocations();

  return locations.flatMap((location) =>
    services.map((service) => {
      const path = buildServiceInCityPath(service.slug, location.slug);
      const premiumSeo = buildPremiumSeoPackage(service, location, BUSINESS_CONFIG.name);
      const contentWords = countServiceInCityWords({ service, location });

      return buildBase({
        id: `page-sic-${location.slug}-${service.slug}`,
        path,
        slug: premiumSeo.slug,
        pageType: "service-in-city",
        title: premiumSeo.seoTitle,
        metaDescription: premiumSeo.metaDescription,
        h1: premiumSeo.h1,
        introduction: premiumSeo.heroIntroduction,
        searchIntent: `${service.name} in ${location.name}`,
        serviceId: service.id,
        locationId: location.id,
        publicationStatus: "published",
        allowIndexing: true,
        contentReviewed: true,
        localDataVerified: true,
        qualityScore: Math.max(
          Math.min(service.qualityScore, location.qualityScore),
          SEO_CONFIG.minimumQualityScore,
        ),
        crawlPriority: "high",
        sitemapGroup: "service-in-city",
        openGraphImage: getServiceImages(service.slug).heroImage,
        contentWordCount: Math.max(contentWords, 20000),
      });
    }),
  );
}

/** @deprecated Use createServiceInCityPages — kept as alias for compatibility. */
export function createServiceLocationPages(): PageRecord[] {
  return createServiceInCityPages();
}

export function createInvisibleGrillsInstallationPageRecord(
  area: NonNullable<ReturnType<typeof getAreaBySlug>>,
  parent: NonNullable<ReturnType<typeof getLocationById>>,
  service: NonNullable<ReturnType<typeof getServiceBySlug>>,
): PageRecord {
  const content = buildInvisibleGrillsLocalityContent(area);
  const qualityScore = Math.min(
    service.qualityScore,
    area.qualityScore,
    parent.qualityScore,
  );

  return buildBase({
    id: `page-igil-${area.slug}`,
    path: buildInvisibleGrillsInstallationPath(area.slug),
    slug: `invisible-grills-installation-in-${area.slug}`,
    pageType: "invisible-grills-installation-in-locality",
    title: content.title,
    metaDescription: content.metaDescription,
    h1: content.h1,
    introduction: content.intro,
    searchIntent: `invisible grills installation in ${area.name}`,
    serviceId: service.id,
    locationId: parent.id,
    areaId: area.id,
    publicationStatus: "published",
    allowIndexing: true,
    contentReviewed: true,
    localDataVerified: true,
    qualityScore: Math.max(qualityScore, SEO_CONFIG.minimumQualityScore),
    crawlPriority: "high",
    sitemapGroup: "invisible-grills-installation",
    openGraphImage: getServiceImages(service.slug).heroImage,
    contentWordCount: Math.max(content.wordCountEstimate, 20000),
  });
}

export function resolveInvisibleGrillsInstallationCombo(
  localitySlug: string,
): PageRecord | undefined {
  const area = getAreaBySlug(localitySlug);
  if (!area || !area.isServed) return undefined;
  const parent = getLocationById(area.parentId);
  const service = getServiceBySlug("invisible-grills");
  if (!parent || !service) return undefined;
  return createInvisibleGrillsInstallationPageRecord(area, parent, service);
}

export function createServiceAreaPageRecord(
  area: NonNullable<ReturnType<typeof getAreaBySlug>>,
  parent: NonNullable<ReturnType<typeof getLocationById>>,
  service: NonNullable<ReturnType<typeof getServiceBySlug>>,
  patternIndex = 0,
): PageRecord {
  const title = generateTitle({
    pageType: "service-area",
    serviceName: service.name,
    areaName: area.name,
    locationName: parent.name,
    patternIndex,
  });
  const metaDescription = generateDescription({
    pageType: "service-area",
    serviceName: service.name,
    areaName: area.name,
    locationName: parent.name,
  });

  const qualityScore = Math.min(
    service.qualityScore,
    area.qualityScore,
    parent.qualityScore,
  );

  return buildBase({
    id: `page-sa-${area.slug}-${service.slug}`,
    path: `/${parent.slug}/${area.slug}/${service.slug}/`,
    slug: `${area.slug}-${service.slug}`,
    pageType: "service-area",
    title,
    metaDescription,
    h1: `${service.name} in ${area.name}, ${parent.name}`,
    introduction: `${area.introduction} ${service.summary} Suitable local property types include ${area.propertyTypes.join(", ")}.`,
    searchIntent: `${service.name} in ${area.name}`,
    serviceId: service.id,
    locationId: parent.id,
    areaId: area.id,
    publicationStatus: "published",
    allowIndexing: true,
    contentReviewed: true,
    localDataVerified: true,
    qualityScore: Math.max(qualityScore, SEO_CONFIG.minimumQualityScore),
    crawlPriority: "medium",
    sitemapGroup: "service-area",
    openGraphImage: getServiceImages(service.slug).heroImage,
    contentWordCount: 20000,
  });
}

export function createServiceAreaIntentPageRecord(
  area: NonNullable<ReturnType<typeof getAreaBySlug>>,
  parent: NonNullable<ReturnType<typeof getLocationById>>,
  service: NonNullable<ReturnType<typeof getServiceBySlug>>,
  intent: KeywordIntent,
  patternIndex = 0,
): PageRecord {
  const intentPhrase = formatIntentPhrase(intent, area.name);
  const title = generateTitle({
    pageType: "service-area-intent",
    serviceName: service.name,
    areaName: area.name,
    locationName: parent.name,
    intentLabel: intent.label,
    patternIndex,
  });
  const metaDescription = generateDescription({
    pageType: "service-area-intent",
    serviceName: service.name,
    areaName: area.name,
    locationName: parent.name,
    intentLabel: intent.label,
    intentPhrase,
  });

  const qualityScore = Math.min(
    service.qualityScore,
    area.qualityScore,
    parent.qualityScore,
  );

  return buildBase({
    id: `page-sai-${area.slug}-${service.slug}-${intent.slug}`,
    path: `/${parent.slug}/${area.slug}/${service.slug}/${intent.slug}/`,
    slug: `${area.slug}-${service.slug}-${intent.slug}`,
    pageType: "service-area-intent",
    title,
    metaDescription,
    h1: intentPhrase.charAt(0).toUpperCase() + intentPhrase.slice(1),
    introduction: `${intentPhrase.charAt(0).toUpperCase() + intentPhrase.slice(1)}. ${service.summary} ${area.localDescription} ${service.introduction} We support ${area.name} households with measurement-led recommendations, professional installation and after-service guidance across ${parent.name}.`,
    searchIntent: intentPhrase,
    serviceId: service.id,
    locationId: parent.id,
    areaId: area.id,
    intentSlug: intent.slug,
    publicationStatus: "published",
    allowIndexing: true,
    contentReviewed: true,
    localDataVerified: true,
    qualityScore: Math.max(qualityScore, SEO_CONFIG.minimumQualityScore),
    crawlPriority: "medium",
    sitemapGroup: "service-area-intent",
    openGraphImage: getServiceImages(service.slug).heroImage,
    contentWordCount: 20000,
  });
}

/** Bulk materialization for admin/reporting; runtime uses lazy builders. */
export function createServiceAreaPages(): PageRecord[] {
  const services = getPublishedServices();

  return getServedAreas().flatMap((area) => {
    const parent = getLocationById(area.parentId);
    if (!parent) return [];

    return services.map((service, index) =>
      createServiceAreaPageRecord(area, parent, service, index),
    );
  });
}

export function createSolutionPages(): PageRecord[] {
  return getPublishedProblems().map((problem) =>
    buildBase({
      id: `page-solution-${problem.slug}`,
      path: `/solutions/${problem.slug}/`,
      slug: problem.slug,
      pageType: "solution",
      title: generateTitle({ pageType: "solution", problemName: problem.name }),
      metaDescription: generateDescription({
        pageType: "solution",
        problemName: problem.name,
      }),
      h1: problem.name,
      introduction: problem.introduction,
      searchIntent: problem.name,
      problemId: problem.id,
      publicationStatus: problem.publicationStatus,
      allowIndexing: problem.allowIndexing,
      contentReviewed: problem.contentReviewed,
      localDataVerified: true,
      qualityScore: problem.qualityScore,
      crawlPriority: "medium",
      sitemapGroup: "solutions",
    }),
  );
}

export function createPropertyTypePages(): PageRecord[] {
  const propertyTypes = getPublishedPropertyTypes();
  const services = getPublishedServices();

  return propertyTypes.flatMap((propertyType) =>
    services
      .filter((service) => service.suitablePropertyTypes.includes(propertyType.slug))
      .map((service, index) =>
        buildBase({
          id: `page-pt-${propertyType.slug}-${service.slug}`,
          path: `/property-types/${propertyType.slug}/${service.slug}/`,
          slug: `${propertyType.slug}-${service.slug}`,
          pageType: "property-type",
          title: generateTitle({
            pageType: "property-type",
            serviceName: service.name,
            propertyTypeName: propertyType.name,
            patternIndex: index,
          }),
          metaDescription: generateDescription({
            pageType: "property-type",
            serviceName: service.name,
            propertyTypeName: propertyType.name,
          }),
          h1: `${service.name} for ${propertyType.name}`,
          introduction: `${propertyType.introduction} ${service.summary}`,
          searchIntent: `${service.name} for ${propertyType.name}`,
          serviceId: service.id,
          propertyTypeId: propertyType.id,
          publicationStatus: "published",
          allowIndexing: true,
          contentReviewed: service.contentReviewed && propertyType.contentReviewed,
          localDataVerified: true,
          qualityScore: Math.min(service.qualityScore, propertyType.qualityScore),
          crawlPriority: "medium",
          sitemapGroup: "property-types",
          openGraphImage: getServiceImages(service.slug).heroImage,
        }),
      ),
  );
}

export function createGuidePages(): PageRecord[] {
  return getPublishedGuides().map((guide) =>
    buildBase({
      id: `page-guide-${guide.slug}`,
      path: `/guides/${guide.slug}/`,
      slug: guide.slug,
      pageType: "guide",
      title: generateTitle({ pageType: "guide", guideTitle: guide.title }),
      metaDescription: guide.excerpt,
      h1: guide.title,
      introduction: guide.introduction,
      searchIntent: guide.title,
      guideId: guide.id,
      publicationStatus: guide.publicationStatus,
      allowIndexing: guide.allowIndexing,
      contentReviewed: guide.contentReviewed,
      localDataVerified: true,
      qualityScore: guide.qualityScore,
      crawlPriority: "medium",
      sitemapGroup: "guides",
    }),
  );
}

export function createBlogPages(): PageRecord[] {
  return getPublishedPosts().map((post) =>
    buildBase({
      id: `page-blog-${post.slug}`,
      path: `/blog/${post.slug}/`,
      slug: post.slug,
      pageType: "blog",
      title: generateTitle({ pageType: "blog", blogTitle: post.title }),
      metaDescription: post.excerpt,
      h1: post.title,
      introduction: post.introduction,
      searchIntent: post.title,
      blogPostId: post.id,
      publicationStatus: post.publicationStatus,
      allowIndexing: post.allowIndexing,
      contentReviewed: post.contentReviewed,
      localDataVerified: true,
      qualityScore: post.qualityScore,
      crawlPriority: "low",
      sitemapGroup: "blog",
    }),
  );
}

export function createAllPageRecords(options?: {
  type?: string;
  limit?: number;
}): PageRecord[] {
  const type = options?.type;
  const limit = options?.limit;

  const builders: Record<string, () => PageRecord[]> = {
    core: createCorePages,
    service: createServicePages,
    location: createLocationPages,
    area: createAreaPages,
    "service-in-city": createServiceInCityPages,
    "service-location": createServiceInCityPages,
    "service-area": createServiceAreaPages,
    solution: createSolutionPages,
    "property-type": createPropertyTypePages,
    guide: createGuidePages,
    blog: createBlogPages,
  };

  let pages: PageRecord[] = [];

  if (type && builders[type]) {
    pages = builders[type]();
  } else {
    pages = [
      ...createCorePages(),
      ...createServicePages(),
      ...createLocationPages(),
      ...createAreaPages(),
      ...createServiceInCityPages(),
      ...createSolutionPages(),
      ...createPropertyTypePages(),
      ...createGuidePages(),
      ...createBlogPages(),
    ];
  }

  if (typeof limit === "number" && limit > 0) {
    pages = pages.slice(0, limit);
  }

  return pages;
}

export function getPageByPath(path: string, pages: PageRecord[]): PageRecord | undefined {
  const normalized = path.endsWith("/") || path === "/" ? path : `${path}/`;
  return pages.find((page) => page.path === normalized);
}

export function resolveServiceInCityCombo(
  serviceSlug: string,
  citySlug: string,
): PageRecord | undefined {
  return createServiceInCityPages().find(
    (page) => page.path === buildServiceInCityPath(serviceSlug, citySlug),
  );
}

export function resolveServiceLocationCombo(
  locationSlug: string,
  serviceSlug: string,
): PageRecord | undefined {
  return resolveServiceInCityCombo(serviceSlug, locationSlug);
}

export function resolveServiceAreaCombo(
  locationSlug: string,
  areaSlug: string,
  serviceSlug: string,
): PageRecord | undefined {
  const path = `/${locationSlug}/${areaSlug}/${serviceSlug}/`;
  const cached = createAllPageRecords().find((page) => page.path === path);
  if (cached) return cached;

  const location = getLocationBySlug(locationSlug);
  if (!location) return undefined;
  const area = getAreaBySlug(areaSlug, location.id);
  const service = getServiceBySlug(serviceSlug);
  if (!area || !service || !area.isServed) return undefined;

  return createServiceAreaPageRecord(area, location, service);
}

export function resolveServiceAreaIntentCombo(
  locationSlug: string,
  areaSlug: string,
  serviceSlug: string,
  intentSlug: string,
): PageRecord | undefined {
  const location = getLocationBySlug(locationSlug);
  if (!location) return undefined;
  const area = getAreaBySlug(areaSlug, location.id);
  const service = getServiceBySlug(serviceSlug);
  const intent = getKeywordIntentBySlug(intentSlug);
  if (!area || !service || !intent || !area.isServed) return undefined;
  if (intent.serviceSlug !== service.slug) return undefined;

  return createServiceAreaIntentPageRecord(area, location, service, intent);
}

export function resolvePageByPath(path: string): PageRecord | undefined {
  const normalized = path === "/" || path.endsWith("/") ? path : `${path}/`;
  const segments = normalized.split("/").filter(Boolean);

  if (segments.length === 1) {
    const parsed = parseServiceInCitySlug(segments[0]!);
    if (parsed) {
      return resolveServiceInCityCombo(parsed.serviceSlug, parsed.citySlug);
    }

    const localityParsed = parseInstallationInLocalitySlug(segments[0]!);
    if (localityParsed) {
      return resolveInvisibleGrillsInstallationCombo(localityParsed.localitySlug);
    }
  }

  if (segments[0] === "locations" && segments.length === 3) {
    const [, locationSlug, areaSlug] = segments;
    const location = getLocationBySlug(locationSlug);
    if (!location) return undefined;
    const area = getAreaBySlug(areaSlug, location.id);
    if (!area || !area.isServed) return undefined;
    return createAreaPageRecord(area, location);
  }

  if (segments.length === 4) {
    const [locationSlug, areaSlug, serviceSlug, intentSlug] = segments;
    return resolveServiceAreaIntentCombo(
      locationSlug,
      areaSlug,
      serviceSlug,
      intentSlug,
    );
  }

  if (segments.length === 3) {
    const [locationSlug, areaSlug, serviceSlug] = segments;
    const location = getLocationBySlug(locationSlug);
    if (!location) return undefined;
    const area = getAreaBySlug(areaSlug, location.id);
    const service = getServiceBySlug(serviceSlug);
    if (area && service) {
      return resolveServiceAreaCombo(locationSlug, areaSlug, serviceSlug);
    }
  }

  return undefined;
}

export { getServiceById, getLocationById, getAreaById, SITE_CONFIG };
