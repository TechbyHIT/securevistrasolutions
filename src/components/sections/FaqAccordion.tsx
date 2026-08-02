"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/types/content";

type FaqAccordionProps = {
  faqs: FaqItem[];
  className?: string;
};

export function FaqAccordion({ faqs, className }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  return (
    <div className={cn("divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-white shadow-sm", className)}>
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={faq.question}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium text-[var(--foreground)] hover:bg-primary-50/50"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span>{faq.question}</span>
              <svg
                className={cn("h-5 w-5 shrink-0 transition-transform", isOpen && "rotate-180")}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isOpen ? (
              <div className="px-5 pb-4 text-sm leading-relaxed text-[var(--muted)]">{faq.answer}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
