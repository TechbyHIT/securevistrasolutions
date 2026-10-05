import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { BUSINESS_CONFIG } from "@/config/business";
import { cn } from "@/lib/utils";

type HeroProps = {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  /** Brand or trust eyebrow above H1 */
  brandLabel?: string;
  eyebrow?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  variant?: "split" | "overlay";
  className?: string;
};

export function Hero({
  title,
  description,
  image = "/images/services/invisible-grills/01-img-20251025-132727-jpg.jpeg",
  imageAlt,
  brandLabel = BUSINESS_CONFIG.name,
  eyebrow,
  primaryCta = { label: "Get Free Quote", href: "/contact/" },
  secondaryCta = { label: "Call Now", href: `tel:${BUSINESS_CONFIG.phone.raw}` },
  variant = "overlay",
  className,
}: HeroProps) {
  const eyebrowText = eyebrow ?? brandLabel;

  if (variant === "overlay") {
    return (
      <section
        className={cn(
          "relative isolate min-h-[68vh] overflow-hidden text-white sm:min-h-[72vh] lg:min-h-[76vh]",
          className,
        )}
      >
        <Image
          src={image}
          alt={imageAlt ?? title}
          fill
          priority
          fetchPriority="high"
          quality={78}
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(105deg,rgb(9_26_39/0.90)_0%,rgb(9_26_39/0.68)_50%,rgb(9_26_39/0.40)_100%)]"
          aria-hidden="true"
        />
        <Container className="relative z-10 flex min-h-[68vh] max-w-3xl flex-col justify-center py-14 sm:min-h-[72vh] sm:py-18 lg:min-h-[76vh] lg:py-22">
          <p className="fade-up text-xs font-semibold tracking-[0.16em] text-accent-300 uppercase sm:text-sm">
            {eyebrowText}
          </p>
          <Heading
            level={1}
            className="fade-up mt-4 text-[2.25rem] leading-[1.15] text-white sm:text-5xl lg:text-[3.1rem]"
          >
            {title}
          </Heading>
          <p className="fade-up mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            {description}
          </p>
          <div className="fade-up mt-8 flex flex-wrap items-center gap-3">
            <Button href={primaryCta.href} variant="accent" size="lg" className="px-7">
              {primaryCta.label}
            </Button>
            {secondaryCta ? (
              <Button
                href={secondaryCta.href}
                variant="outline"
                size="lg"
                className="border-white/70 px-7 text-white hover:bg-white/10"
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
    <section className={cn("relative overflow-hidden bg-primary-800 text-white", className)}>
      <Container className="grid items-center gap-8 py-12 sm:py-16 lg:grid-cols-2 lg:gap-12 lg:py-20">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-accent-300 uppercase sm:text-sm">
            {eyebrowText}
          </p>
          <Heading level={1} className="mt-3 text-white">
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
        <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-md)]">
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
