import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";

type LocationCardProps = {
  name: string;
  description: string;
  href: string;
  propertyTypes?: string[];
};

export function LocationCard({ name, description, href, propertyTypes }: LocationCardProps) {
  return (
    <Card as="article" className="h-full">
      <Link href={href} className="group block h-full">
        <Heading level={3} className="group-hover:text-primary-500">
          {name}
        </Heading>
        <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
        {propertyTypes && propertyTypes.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {propertyTypes.slice(0, 4).map((type) => (
              <Badge key={type} variant="outline">
                {type.replace(/-/g, " ")}
              </Badge>
            ))}
          </div>
        ) : null}
        <span className="mt-4 inline-block text-sm font-medium text-primary-500">View area &rarr;</span>
      </Link>
    </Card>
  );
}
