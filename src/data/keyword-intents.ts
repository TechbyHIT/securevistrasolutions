export type KeywordIntentCategory =
  | "invisible-grill"
  | "safety-net"
  | "cloth-hanger"
  | "sports-net"
  | "bird-spikes";

export type KeywordIntent = {
  slug: string;
  label: string;
  phraseTemplate: string;
  serviceSlug: string;
  category: KeywordIntentCategory;
  tags?: string[];
};

import {
  SITEMAP_INTENT_TAGS,
  SITEMAP_MAX_INTENTS_PER_SERVICE,
} from "@/config/sitemap-indexing";
import { KEYWORD_INTENTS_DATA } from "./keyword-intents-data";

export const KEYWORD_INTENTS = KEYWORD_INTENTS_DATA as KeywordIntent[];

const intentBySlug = new Map(KEYWORD_INTENTS.map((intent) => [intent.slug, intent]));

export function getKeywordIntentBySlug(slug: string): KeywordIntent | undefined {
  return intentBySlug.get(slug);
}

export function getIntentsForService(serviceSlug: string): KeywordIntent[] {
  return KEYWORD_INTENTS.filter((intent) => intent.serviceSlug === serviceSlug);
}

export function getIntentsForCategory(category: KeywordIntentCategory): KeywordIntent[] {
  return KEYWORD_INTENTS.filter((intent) => intent.category === category);
}

/** Representative intent subset for internal linking on high-volume pages. */
export function getSampleIntentsForLinking(limit = 24): KeywordIntent[] {
  const samples: KeywordIntent[] = [];
  const seen = new Set<string>();

  function add(intent: KeywordIntent | undefined) {
    if (!intent || seen.has(intent.slug)) return;
    seen.add(intent.slug);
    samples.push(intent);
  }

  const pickByTag = (category: KeywordIntentCategory, tag: string) =>
    KEYWORD_INTENTS.find((intent) => intent.category === category && intent.tags?.includes(tag));

  const categories: KeywordIntentCategory[] = [
    "invisible-grill",
    "safety-net",
    "cloth-hanger",
    "sports-net",
    "bird-spikes",
  ];

  for (const category of categories) {
    add(KEYWORD_INTENTS.find((intent) => intent.category === category));
    add(pickByTag(category, "pricing"));
    add(pickByTag(category, "installation"));
    add(pickByTag(category, "safety"));
  }

  for (const intent of KEYWORD_INTENTS) {
    if (samples.length >= limit) break;
    add(intent);
  }

  return samples.slice(0, limit);
}

export function getSampleIntentsForService(serviceSlug: string, limit = 20): KeywordIntent[] {
  const intents = getIntentsForService(serviceSlug);
  if (intents.length <= limit) return intents;

  const samples: KeywordIntent[] = [];
  const seen = new Set<string>();

  function add(intent: KeywordIntent | undefined) {
    if (!intent || seen.has(intent.slug)) return;
    seen.add(intent.slug);
    samples.push(intent);
  }

  add(intents[0]);
  for (const tag of ["pricing", "installation", "provider", "application", "safety", "material", "design"]) {
    add(intents.find((intent) => intent.tags?.includes(tag)));
  }

  for (const intent of intents) {
    if (samples.length >= limit) break;
    add(intent);
  }

  return samples.slice(0, limit);
}

export function formatIntentPhrase(intent: KeywordIntent, areaName: string): string {
  return intent.phraseTemplate.replace("{area}", areaName);
}

export function countKeywordIntents(): number {
  return KEYWORD_INTENTS.length;
}

/** Broader commercial pool (not capped) — used for linking samples / legacy checks. */
export function getHighIntentKeywordIntents(): KeywordIntent[] {
  return KEYWORD_INTENTS.filter((intent) => {
    const tags = intent.tags ?? [];
    return tags.some((tag) => SITEMAP_INTENT_TAGS.has(tag));
  });
}

/**
 * Capped commercial intents for sitemaps + indexability.
 * Keeps area×intent under Google-friendly volume (~areas × intentsPerService).
 */
export function getSitemapKeywordIntents(): KeywordIntent[] {
  const byService = new Map<string, KeywordIntent[]>();

  for (const intent of getHighIntentKeywordIntents()) {
    const list = byService.get(intent.serviceSlug) ?? [];
    list.push(intent);
    byService.set(intent.serviceSlug, list);
  }

  const selected: KeywordIntent[] = [];
  for (const list of byService.values()) {
    list.sort((a, b) => a.slug.localeCompare(b.slug));
    selected.push(...list.slice(0, SITEMAP_MAX_INTENTS_PER_SERVICE));
  }

  selected.sort((a, b) => a.slug.localeCompare(b.slug));
  return selected;
}

export function countHighIntentKeywordIntents(): number {
  return getSitemapKeywordIntents().length;
}
