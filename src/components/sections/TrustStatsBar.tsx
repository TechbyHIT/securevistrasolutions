import { cn } from "@/lib/utils";

type TrustStatsBarProps = {
  className?: string;
  cityName?: string;
};

export function TrustStatsBar({ className, cityName = "Hyderabad" }: TrustStatsBarProps) {
  const stats = [
    { value: "5000+", label: "Projects completed" },
    { value: "10+", label: "Years experience" },
    { value: "3–8 yr", label: "Warranty" },
    { value: "Free", label: "Site inspection" },
    { value: cityName, label: "Wide coverage" },
  ];
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 card-surface p-5 sm:grid-cols-3 lg:grid-cols-5",
        className,
      )}
    >
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <p className="text-xl font-bold text-primary-600 sm:text-2xl">{stat.value}</p>
          <p className="mt-1 text-xs text-[var(--muted)] sm:text-sm">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
