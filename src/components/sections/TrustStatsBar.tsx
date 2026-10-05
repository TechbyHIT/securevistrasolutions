import { cn } from "@/lib/utils";

type TrustStatsBarProps = {
  className?: string;
  cityName?: string;
};

/** Verified trust signals only — no fabricated project counts or years. */
export function TrustStatsBar({ className, cityName = "Hyderabad" }: TrustStatsBarProps) {
  const stats = [
    { value: "Free", label: "Site inspection" },
    { value: "Written", label: "Quotation" },
    { value: "SS / Net", label: "Quality materials" },
    { value: cityName, label: "Local coverage" },
  ];

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 border border-[var(--border)] bg-white p-4 sm:grid-cols-4 sm:gap-4 sm:p-5",
        className,
      )}
    >
      {stats.map((stat) => (
        <div key={stat.label} className="text-center sm:text-left">
          <p className="text-base font-semibold text-primary-800 sm:text-lg">{stat.value}</p>
          <p className="mt-1 text-xs text-[var(--muted)] sm:text-sm">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
