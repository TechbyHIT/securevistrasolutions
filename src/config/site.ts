import { BUSINESS_CONFIG } from "./business";

export const SITE_CONFIG = {
  name: BUSINESS_CONFIG.name,
  url: BUSINESS_CONFIG.websiteUrl.replace(/\/$/, ""),
  locale: "en_IN",
  language: "en-IN",
  trailingSlash: true,
  defaultTitleTemplate: `%s | ${BUSINESS_CONFIG.name}`,
  defaultDescription: BUSINESS_CONFIG.description,
  maxSitemapUrlsPerFile: 10_000,
  revalidateSeconds: 86_400,
  currency: "INR",
  timezone: "Asia/Kolkata",
} as const;
