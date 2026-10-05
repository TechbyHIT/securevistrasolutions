import { cn } from "@/lib/utils";

type ProcessTimelineProps = {
  className?: string;
  locality?: string;
};

const STEPS = [
  {
    step: "01",
    title: "Share requirement",
    description: "Tell us the openings, property type and preferred visit time.",
  },
  {
    step: "02",
    title: "Site assessment",
    description: "We measure on site and check fixing points before quoting.",
  },
  {
    step: "03",
    title: "Recommendation",
    description: "Material grade, spacing and a written quotation you can compare.",
  },
  {
    step: "04",
    title: "Professional installation",
    description: "Trained technicians install, tension and finish cleanly.",
  },
  {
    step: "05",
    title: "Final inspection",
    description: "Safety check, care tips and support after handover.",
  },
] as const;

export function ProcessTimeline({ className, locality }: ProcessTimelineProps) {
  return (
    <ol
      className={cn(
        "grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3",
        className,
      )}
    >
      {STEPS.map((item) => (
        <li key={item.step} className="card-surface relative p-5">
          <p className="text-xs font-bold tracking-[0.16em] text-accent-600 uppercase">
            {item.step}
          </p>
          <h3 className="mt-3 text-base font-semibold text-neutral-900">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
            {locality && item.step === "02"
              ? `${item.description.replace("on site", `in ${locality}`)}`
              : item.description}
          </p>
        </li>
      ))}
    </ol>
  );
}
