"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buildServiceInCityPath } from "@/lib/utils/service-in-city-slug";

type ShowcaseItem = {
  title: string;
  href: string;
  summary: string;
};

type Category = {
  id: string;
  label: string;
  items: ShowcaseItem[];
};

const CITY = "hyderabad";

const CATEGORIES: Category[] = [
  {
    id: "balcony",
    label: "Balcony",
    items: [
      {
        title: "Invisible Grills",
        href: buildServiceInCityPath("invisible-grills", CITY),
        summary: "Open view with child and pet safety for balcony openings.",
      },
      {
        title: "Balcony Safety Nets",
        href: buildServiceInCityPath("balcony-safety-nets", CITY),
        summary: "Strong netting for high-rise balconies and terrace edges.",
      },
      {
        title: "Cloth Hangers",
        href: buildServiceInCityPath("cloth-hangers", CITY),
        summary: "Ceiling-mounted drying solutions for apartment balconies.",
      },
    ],
  },
  {
    id: "windows",
    label: "Windows",
    items: [
      {
        title: "Invisible Grills",
        href: buildServiceInCityPath("invisible-grills", CITY),
        summary: "Window safety without a heavy iron-grill look.",
      },
      {
        title: "Mosquito Nets",
        href: buildServiceInCityPath("mosquito-nets", CITY),
        summary: "Window and door insect protection with neat frames.",
      },
    ],
  },
  {
    id: "apartment",
    label: "Apartment",
    items: [
      {
        title: "Invisible Grills",
        href: buildServiceInCityPath("invisible-grills", CITY),
        summary: "Apartment balcony and window protection systems.",
      },
      {
        title: "Children Safety Nets",
        href: buildServiceInCityPath("children-safety-nets", CITY),
        summary: "Extra protection for homes with kids.",
      },
      {
        title: "Bird Spikes",
        href: buildServiceInCityPath("bird-spikes", CITY),
        summary: "Deterrent spikes for parapets and ledge edges.",
      },
    ],
  },
  {
    id: "villa",
    label: "Villa",
    items: [
      {
        title: "Invisible Grills",
        href: buildServiceInCityPath("invisible-grills", CITY),
        summary: "Villa terrace, staircase and opening protection.",
      },
      {
        title: "Safety Nets",
        href: buildServiceInCityPath("balcony-safety-nets", CITY),
        summary: "Courtyard and terrace edge safety netting.",
      },
      {
        title: "Pet Safety Nets",
        href: buildServiceInCityPath("pet-safety-nets", CITY),
        summary: "Secure openings for homes with pets.",
      },
    ],
  },
  {
    id: "office",
    label: "Office",
    items: [
      {
        title: "Bird Spikes",
        href: buildServiceInCityPath("bird-spikes", CITY),
        summary: "Commercial facade and terrace bird deterrents.",
      },
      {
        title: "Invisible Grills",
        href: buildServiceInCityPath("invisible-grills", CITY),
        summary: "Office opening safety with a clean modern finish.",
      },
    ],
  },
  {
    id: "commercial",
    label: "Commercial",
    items: [
      {
        title: "Cricket Nets",
        href: buildServiceInCityPath("cricket-nets", CITY),
        summary: "Practice nets for clubs, schools and commercial grounds.",
      },
      {
        title: "Bird Spikes",
        href: buildServiceInCityPath("bird-spikes", CITY),
        summary: "Building-edge bird deterrents for commercial properties.",
      },
      {
        title: "Safety Nets",
        href: buildServiceInCityPath("balcony-safety-nets", CITY),
        summary: "Terrace and duct-area netting for commercial sites.",
      },
    ],
  },
];

export function ServiceShowcase() {
  const [active, setActive] = useState(CATEGORIES[0]!.id);
  const current = CATEGORIES.find((c) => c.id === active) ?? CATEGORIES[0]!;

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Solutions by space">
        {CATEGORIES.map((category) => {
          const selected = category.id === active;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={selected}
              id={`space-tab-${category.id}`}
              aria-controls={`space-panel-${category.id}`}
              onClick={() => setActive(category.id)}
              className={cn(
                "border px-3.5 py-2 text-sm font-semibold transition-colors",
                selected
                  ? "border-primary-800 bg-primary-800 text-white"
                  : "border-[var(--border)] bg-white text-neutral-700 hover:border-primary-300 hover:bg-primary-50",
              )}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`space-panel-${current.id}`}
        aria-labelledby={`space-tab-${current.id}`}
        className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {current.items.map((item) => (
          <Link key={item.href + item.title} href={item.href} className="card-surface block p-5">
            <h3 className="font-semibold text-primary-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.summary}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-600">
              View service <span aria-hidden="true">→</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
