import Link from "next/link";
import { Heading } from "@/components/ui/Heading";

export type SeoLinkGroup = {
  title: string;
  description?: string;
  links: { label: string; href: string }[];
};

type Props = {
  title?: string;
  intro?: string;
  groups: SeoLinkGroup[];
  className?: string;
};

function dedupeLinks(links: { label: string; href: string }[]) {
  const seen = new Set<string>();
  return links.filter((link) => {
    if (seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
}

/**
 * Structured internal-link board — grouped, readable labels only (no raw URL dumps).
 */
export function SeoInternalLinkBoard({
  title = "Useful pages & local guides",
  intro = "Organised internal links to help you explore services, localities and high-intent topics.",
  groups,
  className,
}: Props) {
  const visible = groups.filter((group) => group.links.length > 0);
  if (visible.length === 0) return null;

  return (
    <section
      id="seo-internal-links"
      className={className ?? "border-t border-[var(--border)] bg-neutral-50"}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="max-w-3xl">
          <Heading level={2}>{title}</Heading>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{intro}</p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((group) => (
            <div
              key={group.title}
              className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm"
            >
              <h3 className="text-sm font-bold uppercase tracking-wide text-primary-800">
                {group.title}
              </h3>
              {group.description ? (
                <p className="mt-1 text-xs text-[var(--muted)]">{group.description}</p>
              ) : null}
              <ul className="mt-4 space-y-2">
                {dedupeLinks(group.links).map((link, index) => (
                  <li key={`${link.href}::${link.label}::${index}`}>
                    <Link
                      href={link.href}
                      className="group flex items-start gap-2 text-sm text-primary-700 hover:text-accent-600"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500"
                      />
                      <span className="leading-snug group-hover:underline">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
