import { KEYWORD_INTENTS, getSitemapKeywordIntents } from "@/data/keyword-intents";
import { getPublishedLocations } from "@/data/initial-locations";
import { getServedAreas } from "@/data/initial-areas";
import { getPublishedServices } from "@/data/initial-services";
import { isSeoIndexablePage } from "@/lib/seo/is-page-sitemap-indexable";
import type { PageRecord } from "@/types/page";
import type { CrawlPriority } from "@/types/business";
import {
  createAreaPageRecord,
  createInvisibleGrillsInstallationPageRecord,
  createServiceAreaIntentPageRecord,
  createServiceAreaPageRecord,
} from "./page-factory";
import { buildInvisibleGrillsInstallationPath } from "@/lib/utils/installation-in-locality-slug";

export type ProgrammaticPathEntry = {
  path: string;
  sitemapGroup: string;
  updatedAt: string;
  crawlPriority: CrawlPriority;
};

type ProgrammaticContext = {
  location: NonNullable<ReturnType<typeof getPublishedLocations>[number]>;
  areas: ReturnType<typeof getServedAreas>;
  services: ReturnType<typeof getPublishedServices>;
  intents: typeof KEYWORD_INTENTS;
  serviceSlugs: Set<string>;
};

function passesIndexability(page: PageRecord): boolean {
  return isSeoIndexablePage(page) && page.allowIndexing && page.publicationStatus === "published";
}

export function getProgrammaticContext(): ProgrammaticContext | null {
  const location = getPublishedLocations()[0];
  if (!location) return null;

  const services = getPublishedServices();
  const serviceSlugs = new Set(services.map((service) => service.slug));
  // Include every served published area so all URLs enter the sitemap.
  const areas = getServedAreas(location.id).sort((a, b) => a.slug.localeCompare(b.slug));
  const intents = KEYWORD_INTENTS.filter((intent) => serviceSlugs.has(intent.serviceSlug));

  return { location, areas, services, intents, serviceSlugs };
}

function verifyProgrammaticIndexability(ctx: ProgrammaticContext): {
  areas: boolean;
  serviceAreas: boolean;
  serviceAreaIntents: boolean;
  invisibleGrillsInstallation: boolean;
} {
  const sampleArea = ctx.areas[0];
  const sampleService = ctx.services[0];
  const sampleIntent = ctx.intents[0];
  const invisibleGrills = ctx.services.find((service) => service.slug === "invisible-grills");

  if (!sampleArea || !sampleService || !sampleIntent) {
    return {
      areas: false,
      serviceAreas: false,
      serviceAreaIntents: false,
      invisibleGrillsInstallation: false,
    };
  }

  const intentService = ctx.services.find((service) => service.slug === sampleIntent.serviceSlug);

  return {
    areas: passesIndexability(createAreaPageRecord(sampleArea, ctx.location)),
    serviceAreas: passesIndexability(
      createServiceAreaPageRecord(sampleArea, ctx.location, sampleService),
    ),
    serviceAreaIntents:
      !!intentService &&
      passesIndexability(
        createServiceAreaIntentPageRecord(
          sampleArea,
          ctx.location,
          intentService,
          sampleIntent,
        ),
      ),
    invisibleGrillsInstallation:
      !!invisibleGrills &&
      passesIndexability(
        createInvisibleGrillsInstallationPageRecord(
          sampleArea,
          ctx.location,
          invisibleGrills,
        ),
      ),
  };
}

export function countProgrammaticIndexablePages(): {
  areas: number;
  serviceAreas: number;
  serviceAreaIntents: number;
  invisibleGrillsInstallation: number;
  total: number;
} {
  const ctx = getProgrammaticContext();
  if (!ctx) {
    return {
      areas: 0,
      serviceAreas: 0,
      serviceAreaIntents: 0,
      invisibleGrillsInstallation: 0,
      total: 0,
    };
  }

  const flags = verifyProgrammaticIndexability(ctx);
  const areas = flags.areas ? ctx.areas.length : 0;
  const serviceAreas = flags.serviceAreas ? ctx.areas.length * ctx.services.length : 0;
  const serviceAreaIntents = flags.serviceAreaIntents
    ? ctx.areas.length * getSitemapKeywordIntents().length
    : 0;
  const invisibleGrillsInstallation = flags.invisibleGrillsInstallation
    ? ctx.areas.length
    : 0;

  return {
    areas,
    serviceAreas,
    serviceAreaIntents,
    invisibleGrillsInstallation,
    total: areas + serviceAreas + serviceAreaIntents + invisibleGrillsInstallation,
  };
}

export function* iterateProgrammaticPathEntries(
  group?: string,
): Generator<ProgrammaticPathEntry> {
  const ctx = getProgrammaticContext();
  if (!ctx) return;

  const { location, areas, services } = ctx;
  const highIntents = getSitemapKeywordIntents();
  const updatedAt = new Date().toISOString();

  if (!group || group === "area") {
    if (!group) {
      // Area hub URLs are not included in sitemaps (high-intent only).
    } else {
      for (const area of areas) {
        yield {
          path: `/locations/${location.slug}/${area.slug}/`,
          sitemapGroup: "area",
          updatedAt,
          crawlPriority: "medium",
        };
      }
    }
  }

  if (!group || group === "service-area") {
    if (group === "service-area") {
      for (const area of areas) {
        for (const service of services) {
          yield {
            path: `/${location.slug}/${area.slug}/${service.slug}/`,
            sitemapGroup: "service-area",
            updatedAt,
            crawlPriority: "medium",
          };
        }
      }
    }
  }

  if (!group || group === "service-area-intent") {
    for (const area of areas) {
      for (const intent of highIntents) {
        yield {
          path: `/${location.slug}/${area.slug}/${intent.serviceSlug}/${intent.slug}/`,
          sitemapGroup: "service-area-intent",
          updatedAt,
          crawlPriority: "high",
        };
      }
    }
  }

  if (!group || group === "invisible-grills-installation") {
    for (const area of areas) {
      yield {
        path: buildInvisibleGrillsInstallationPath(area.slug),
        sitemapGroup: "invisible-grills-installation",
        updatedAt,
        crawlPriority: "high",
      };
    }
  }
}

/** Materializes a small sample for reporting — not for full-scale enumeration. */
export function buildProgrammaticIndexablePageSample(limit = 20): PageRecord[] {
  const ctx = getProgrammaticContext();
  if (!ctx) return [];

  const pages: PageRecord[] = [];
  const { location, areas, services, intents } = ctx;

  const invisibleGrills = services.find((entry) => entry.slug === "invisible-grills");

  for (const area of areas.slice(0, 2)) {
    pages.push(createAreaPageRecord(area, location));
    if (invisibleGrills) {
      pages.push(createInvisibleGrillsInstallationPageRecord(area, location, invisibleGrills));
    }
    for (const service of services.slice(0, 2)) {
      pages.push(createServiceAreaPageRecord(area, location, service));
    }
    for (const intent of intents.slice(0, 5)) {
      const service = services.find((entry) => entry.slug === intent.serviceSlug);
      if (!service) continue;
      pages.push(createServiceAreaIntentPageRecord(area, location, service, intent));
    }
    if (pages.length >= limit) break;
  }

  return pages.filter((page) => passesIndexability(page)).slice(0, limit);
}
