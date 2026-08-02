import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { BUSINESS_CONFIG } from "@/config/business";
import { SERVICES_MEGA_MENU, getMegaMenuLinkHref } from "@/config/mega-menu";
import { getServiceImages } from "@/lib/images/get-service-images";
import { getPublishedServices } from "@/data/initial-services";

type HomeServiceCard = {
  title: string;
  description: string;
  href: string;
  image: string;
};

function buildHomeServiceCards(): HomeServiceCard[] {
  const services = getPublishedServices();
  const cards: HomeServiceCard[] = [];

  // Primary published services first
  for (const service of services) {
    const images = getServiceImages(service.slug);
    cards.push({
      title: service.name,
      description: service.summary,
      href: `/services/${service.slug}/`,
      image: images.heroImage || service.heroImage,
    });
  }

  // Extra visible variants from mega menu (same style as reference) — no area SEO dump
  for (const column of SERVICES_MEGA_MENU) {
    for (const link of column.links.slice(0, 3)) {
      if (cards.some((card) => card.title === link.label)) continue;
      const images = getServiceImages(link.serviceSlug);
      cards.push({
        title: link.label,
        description: `${link.label} with professional measurement, quality materials and neat finishing across Hyderabad.`,
        href: getMegaMenuLinkHref(link),
        image: images.heroImage,
      });
      if (cards.length >= 12) break;
    }
    if (cards.length >= 12) break;
  }

  return cards.slice(0, 12);
}

export function HomeServicesImageBlocks() {
  const cards = buildHomeServiceCards();
  const phoneHref = `tel:${BUSINESS_CONFIG.phone.raw}`;

  return (
    <section id="home-services" className="border-b border-[var(--border)]/60 bg-neutral-50">
      <Container className="py-14 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Complete home &amp; building safety solutions
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-500 sm:text-lg">
            From invisible grills to safety nets, bird protection and cloth hangers — everything you
            need from one trusted team.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card, index) => (
            <article
              key={card.title + card.href}
              className="card-surface flex h-full flex-col overflow-hidden p-0 shadow-sm"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  loading={index < 3 ? "eager" : "lazy"}
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-semibold text-neutral-900">{card.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500">
                  {card.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    href={card.href}
                    className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                  >
                    View Details
                    <span aria-hidden="true">→</span>
                  </Link>
                  <a
                    href={phoneHref}
                    className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    Call
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
