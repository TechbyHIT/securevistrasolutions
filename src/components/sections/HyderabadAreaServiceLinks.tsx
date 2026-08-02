import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import {
  buildHyderabadAreaLinkGraph,
  chunkAreaLinks,
  countHyderabadLinkGraph,
  groupAreaLinksByLetter,
} from "@/lib/internal-links/hyderabad-link-graph";
import { getPublishedServices } from "@/data/initial-services";
import { buildServiceInCityPath } from "@/lib/utils/service-in-city-slug";
import { DEFAULT_LOCATION_SLUG } from "@/config/mega-menu";

type Props = {
  title?: string;
  description?: string;
  /** When true, show A–Z letter navigation. */
  showAlphabet?: boolean;
  className?: string;
};

export function HyderabadAreaServiceLinks({
  title = "Hyderabad areas we serve",
  description = "Internal links from every Hyderabad area into each service and sub-location page. Use this directory to open area hubs, service-in-area pages, and invisible grills installation landings.",
  showAlphabet = true,
  className,
}: Props) {
  const nodes = buildHyderabadAreaLinkGraph();
  const stats = countHyderabadLinkGraph();
  const letters = groupAreaLinksByLetter(nodes);
  const chunks = chunkAreaLinks(nodes, 20);
  const services = getPublishedServices();

  return (
    <section
      id="hyderabad-area-service-links"
      className={className ?? "border-t border-[var(--border)] bg-neutral-50"}
    >
      <Container className="py-12 lg:py-16">
        <div className="max-w-3xl">
          <Heading level={2}>{title}</Heading>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{description}</p>
          <p className="mt-3 text-xs font-medium text-primary-700">
            {stats.areas} areas · {stats.serviceLinks.toLocaleString()} service-area links ·{" "}
            {stats.total.toLocaleString()} total internal URLs
          </p>
        </div>

        {/* City-level service hubs */}
        <div className="mt-8 rounded-2xl border border-[var(--border)] bg-white p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-800">
            Services across Hyderabad
          </h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={buildServiceInCityPath(service.slug, DEFAULT_LOCATION_SLUG)}
                  className="inline-block rounded-full bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-600"
                >
                  {service.name} in Hyderabad
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/locations/hyderabad/"
                className="inline-block rounded-full border border-primary-300 bg-white px-3 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-50"
              >
                All Hyderabad locations
              </Link>
            </li>
          </ul>
        </div>

        {showAlphabet ? (
          <nav aria-label="Areas A to Z" className="mt-6 flex flex-wrap gap-1.5">
            {letters.map(({ letter }) => (
              <a
                key={letter}
                href={`#areas-letter-${letter}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] bg-white text-xs font-bold text-primary-700 hover:bg-primary-50"
              >
                {letter}
              </a>
            ))}
          </nav>
        ) : null}

        {/* Alphabetical full directory */}
        <div className="mt-8 space-y-10">
          {letters.map(({ letter, areas }) => (
            <div key={letter} id={`areas-letter-${letter}`} className="scroll-mt-28">
              <h3 className="sticky top-[calc(var(--site-header-offset)+0.5rem)] z-10 mb-4 inline-flex rounded-lg bg-primary-500 px-3 py-1 text-sm font-bold text-white">
                {letter}
              </h3>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {areas.map((area) => (
                  <article
                    key={area.slug}
                    className="rounded-xl border border-[var(--border)] bg-white p-4"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h4 className="font-semibold text-primary-900">
                        <Link href={area.areaHubHref} className="hover:text-accent-600">
                          {area.name}
                        </Link>
                      </h4>
                      <Link
                        href={area.installationHref}
                        className="text-[11px] font-semibold text-accent-600 hover:underline"
                      >
                        Invisible grills install →
                      </Link>
                    </div>
                    <p className="mt-1 text-[11px] text-[var(--muted)]">
                      Area hub · services · sub-location pages
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      <li>
                        <Link
                          href={area.areaHubHref}
                          className="inline-block rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700 hover:bg-primary-50 hover:text-primary-700"
                        >
                          {area.name} hub
                        </Link>
                      </li>
                      {area.serviceLinks.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="inline-block rounded-full border border-primary-100 bg-primary-50/60 px-2 py-0.5 text-[11px] font-medium text-primary-700 hover:border-accent-300 hover:bg-accent-50"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Chunked SEO mirror for crawlers / long scroll */}
        <div className="mt-14 space-y-8 border-t border-[var(--border)] pt-10">
          <Heading level={3}>Service × locality index (chunked)</Heading>
          <p className="max-w-3xl text-sm text-[var(--muted)]">
            Additional crawlable index of all Hyderabad sub-locations mapped into each service URL
            pattern <code className="text-xs">/hyderabad/&#123;area&#125;/&#123;service&#125;/</code>.
          </p>
          {chunks.map((chunk, index) => (
            <div key={chunk[0]?.slug ?? index} id={`area-chunk-${index + 1}`} className="scroll-mt-28">
              <h4 className="text-sm font-semibold text-primary-800">
                Localities {index * 20 + 1}–{index * 20 + chunk.length}
              </h4>
              <ul className="mt-3 columns-1 gap-x-6 text-sm sm:columns-2 lg:columns-3">
                {chunk.flatMap((area) =>
                  area.serviceLinks.map((link) => (
                    <li key={link.href} className="mb-1 break-inside-avoid">
                      <Link href={link.href} className="text-primary-600 hover:underline">
                        {link.label}
                      </Link>
                    </li>
                  )),
                )}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
