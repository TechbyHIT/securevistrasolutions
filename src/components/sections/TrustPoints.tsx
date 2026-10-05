import { cn } from "@/lib/utils";

type TrustPointsProps = {
  className?: string;
  cityName?: string;
};

const POINTS = [
  {
    title: "Professional installation",
    description: "Measurement-led fitting with neat finishing and clear handover.",
  },
  {
    title: "Quality materials",
    description: "SS cable systems, nets and hardware selected for Hyderabad conditions.",
  },
  {
    title: "Local Hyderabad coverage",
    description: "Active service across verified neighbourhoods citywide.",
  },
  {
    title: "Transparent consultation",
    description: "Written quotations after site assessment — no guesswork rates.",
  },
  {
    title: "Multiple safety solutions",
    description: "Invisible grills, safety nets, bird protection, mosquito nets and more.",
  },
  {
    title: "Responsive support",
    description: "Call or WhatsApp for inspections, timelines and after-care.",
  },
] as const;

export function TrustPoints({ className, cityName = "Hyderabad" }: TrustPointsProps) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {POINTS.map((point) => (
        <article key={point.title} className="card-surface p-5 sm:p-6">
          <h3 className="text-base font-semibold text-primary-800">{point.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
            {point.description.includes("neighbourhoods")
              ? point.description.replace("neighbourhoods", `${cityName} neighbourhoods`)
              : point.description}
          </p>
        </article>
      ))}
    </div>
  );
}
