import { truncate } from "@/lib/utils";
import { SEO_CONFIG } from "@/config/seo";
import { getCitySeoProfile } from "@/data/city-seo-profiles";
import { buildServiceInCityPath } from "@/lib/utils/service-in-city-slug";
import { buildPremiumLandingContext } from "@/lib/content/build-premium-landing-context";
import type { PremiumLandingContext, PremiumSeoPackage } from "@/lib/content/premium-landing-types";
import type { Service } from "@/types/service";
import type { Location } from "@/types/location";

export function buildPremiumHeroIntroduction(ctx: PremiumLandingContext): string {
  const { service, city, company } = ctx;
  const profile = getCitySeoProfile(ctx.citySlug);
  return [
    `${company} installs ${service.name.toLowerCase()} across ${city}, ${ctx.state} with free site inspection, written quotations and professional fitting.`,
    service.summary,
    profile.localNarrativeHook,
  ].join(" ");
}

export function buildPremiumSeoPackage(
  service: Service,
  location: Location,
  company: string,
): PremiumSeoPackage {
  const path = buildServiceInCityPath(service.slug, location.slug);
  const city = location.name;
  const ctx = buildPremiumLandingContext(service, location, company);

  const seoTitle = truncate(
    `${service.name} in ${city} | ${company}`,
    SEO_CONFIG.titleMaxLength,
  );

  const metaDescription = truncate(
    `Professional ${service.name.toLowerCase()} in ${city}, ${location.state}. Free site inspection, premium materials, expert installation & warranty. Call for a written quote today.`,
    SEO_CONFIG.descriptionMaxLength,
  );

  return {
    seoTitle,
    metaTitle: seoTitle,
    metaDescription,
    url: path,
    slug: `${service.slug}-in-${location.slug}`,
    h1: `${service.name} in ${city}`,
    heroIntroduction: buildPremiumHeroIntroduction(ctx),
    canonical: path,
  };
}
