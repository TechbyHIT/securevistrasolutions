import { wordCount } from "@/lib/utils";
import type { ContentBlock, FaqItem } from "@/types/content";

export function hashSeed(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function pickVariant<T>(seed: string, variants: T[]): T {
  if (variants.length === 0) throw new Error("pickVariant requires at least one variant");
  return variants[hashSeed(seed) % variants.length]!;
}

export function countBlocksWordCount(blocks: ContentBlock[]): number {
  return blocks.reduce((total, block) => {
    const parts = [
      block.heading,
      ...block.paragraphs,
      ...(block.listItems ?? []),
      ...(block.subSections?.flatMap((section) => [section.title, section.description]) ?? []),
      ...(block.tableRows?.flatMap((row) => [row.label, row.value, row.note ?? ""]) ?? []),
    ];
    return total + wordCount(parts.join(" "));
  }, 0);
}

export function countFaqsWordCount(faqs: FaqItem[]): number {
  return faqs.reduce((total, faq) => total + wordCount(`${faq.question} ${faq.answer}`), 0);
}

export function countPremiumWordCount(blocks: ContentBlock[], faqs: FaqItem[]): number {
  return countBlocksWordCount(blocks) + countFaqsWordCount(faqs);
}
