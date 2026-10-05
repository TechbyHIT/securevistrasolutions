import { Heading } from "@/components/ui/Heading";
import { cn } from "@/lib/utils";

type SectionIntroProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionIntro({
  title,
  description,
  eyebrow,
  align = "left",
  className,
}: SectionIntroProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
          {eyebrow}
        </p>
      ) : null}
      <Heading level={2}>{title}</Heading>
      {description ? (
        <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">{description}</p>
      ) : null}
    </div>
  );
}
