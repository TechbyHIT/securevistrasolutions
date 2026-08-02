import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type CtaBannerProps = {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
};

export function CtaBanner({
  title = "Ready for a measurement-led recommendation?",
  description = "Share your service need, area in Hyderabad and property type. We respond with practical next steps — not generic price lists.",
  ctaLabel = "Request a Quote",
  ctaHref = "/contact/",
  className,
}: CtaBannerProps) {
  return (
    <section className={cn("bg-accent-500 py-[var(--section-py)] text-white", className)}>
      <Container className="text-center">
        <Heading level={2} className="text-white">
          {title}
        </Heading>
        <p className="mx-auto mt-4 max-w-2xl text-accent-100">{description}</p>
        <div className="mt-8">
          <Button href={ctaHref} variant="secondary" size="lg">
            {ctaLabel}
          </Button>
        </div>
      </Container>
    </section>
  );
}
