import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { BUSINESS_CONFIG } from "@/config/business";
import { buildHomeServiceCards } from "@/lib/content/build-home-service-cards";

export function HomeServicesImageBlocks() {
  const cards = buildHomeServiceCards();

  return (
    <section id="home-services" className="border-b border-[var(--border)] bg-white">
      <Container className="py-14 lg:py-20">
        <div className="max-w-3xl">
          <p className="section-eyebrow text-accent-600">Our solutions</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Our safety &amp; protection solutions
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            Practical installation solutions for homes, apartments, commercial spaces and more —
            measured on site by {BUSINESS_CONFIG.name}.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card, index) => (
            <article
              key={card.title + card.href}
              className="group card-surface flex h-full flex-col overflow-hidden p-0"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  loading={index < 3 ? "eager" : "lazy"}
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-semibold text-primary-900">{card.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted)]">
                  {card.description}
                </p>
                <Link
                  href={card.href}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent-600 transition-colors group-hover:text-accent-700"
                >
                  Learn more
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
