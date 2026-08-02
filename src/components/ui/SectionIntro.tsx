import { Heading } from "@/components/ui/Heading";
import { cn } from "@/lib/utils";

type SectionIntroProps = {
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionIntro({
  title,
  description,
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
      <Heading level={2}>{title}</Heading>
      {description ? (
        <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">{description}</p>
      ) : null}
    </div>
  );
}
