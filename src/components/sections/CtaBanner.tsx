import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { BUSINESS_CONFIG } from "@/config/business";
import { cn } from "@/lib/utils";

type CtaBannerProps = {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
};

export function CtaBanner({
  title = "Need a free site inspection?",
  description = "Tell us your service need and Hyderabad locality. We respond with a clear recommendation after measurement — not a generic price list.",
  ctaLabel = "Get Free Quote",
  ctaHref = "/contact/",
  className,
}: CtaBannerProps) {
  return (
    <section className={cn("bg-primary-900 py-[var(--section-py)] text-white", className)}>
      <Container className="max-w-3xl text-center">
        <Heading level={2} className="text-white">
          {title}
        </Heading>
        <p className="mx-auto mt-4 max-w-2xl text-primary-100">{description}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href={ctaHref} variant="accent" size="lg">
            {ctaLabel}
          </Button>
          <Button
            href={`tel:${BUSINESS_CONFIG.phone.raw}`}
            variant="outline"
            size="lg"
            className="border-white/60 text-white hover:bg-white/10"
          >
            Call Now
          </Button>
        </div>
      </Container>
    </section>
  );
}
