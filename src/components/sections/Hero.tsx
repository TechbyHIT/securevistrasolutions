import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type HeroProps = {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  badge?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** Full-width background with dark overlay (homepage style). */
  variant?: "split" | "overlay";
  className?: string;
};

export function Hero({
  title,
  description,
  image = "/images/services/invisible-grills/01-img-20251025-132727-jpg.jpeg",
  imageAlt,
  badge,
  primaryCta = { label: "Get a Free Quote", href: "/contact/" },
  secondaryCta = { label: "View Services", href: "/services/" },
  variant = "split",
  className,
}: HeroProps) {
  if (variant === "overlay") {
    return (
      <section className={cn("relative min-h-[420px] overflow-hidden text-white sm:min-h-[480px] lg:min-h-[520px]", className)}>
        <Image
          src={image}
          alt={imageAlt ?? title}
          fill
          priority
          fetchPriority="high"
          quality={75}
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-neutral-950/85 via-neutral-900/70 to-neutral-900/40"
          aria-hidden="true"
        />
        <Container className="relative z-10 flex min-h-[420px] max-w-4xl flex-col justify-center py-16 sm:min-h-[480px] sm:py-20 lg:min-h-[520px] lg:py-24">
          {badge ? (
            <p className="mb-4 inline-flex w-fit rounded-full bg-accent-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-neutral-900 sm:text-sm">
              {badge}
            </p>
          ) : null}
          <Heading level={1} className="text-3xl leading-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </Heading>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-200 sm:text-lg">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              href={primaryCta.href}
              variant="accent"
              size="lg"
              className="rounded-full px-8 shadow-md"
            >
              {primaryCta.label}
            </Button>
            {secondaryCta ? (
              <Button
                href={secondaryCta.href}
                variant="outline"
                size="lg"
                className="rounded-full border-white/70 px-8 text-white hover:bg-white/10"
              >
                {secondaryCta.label}
              </Button>
            ) : null}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className={cn("relative overflow-hidden bg-primary-500 text-white", className)}>
      <Container className="grid items-center gap-8 py-12 sm:py-16 lg:grid-cols-2 lg:gap-12 lg:py-20">
        <div>
          {badge ? (
            <p className="mb-3 inline-flex rounded-full bg-accent-500 px-3 py-1 text-xs font-bold uppercase text-neutral-900">
              {badge}
            </p>
          ) : null}
          <Heading level={1} className="text-white">
            {title}
          </Heading>
          <p className="mt-4 max-w-xl text-lg text-primary-100">{description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={primaryCta.href} variant="accent" size="lg">
              {primaryCta.label}
            </Button>
            <Button
              href={secondaryCta.href}
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              {secondaryCta.label}
            </Button>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-2xl">
          <Image
            src={image}
            alt={imageAlt ?? title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </Container>
    </section>
  );
}
