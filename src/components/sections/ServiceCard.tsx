import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";

type ServiceCardProps = {
  name: string;
  summary: string;
  href: string;
  image?: string;
  tag?: string;
};

export function ServiceCard({
  name,
  summary,
  href,
  image = "/images/services/invisible-grills/01-img-20251025-132727-jpg.jpeg",
  tag,
}: ServiceCardProps) {
  return (
    <Card as="article" className="flex h-full flex-col overflow-hidden p-0">
      <Link href={href} className="group flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="flex flex-1 flex-col p-5">
          {tag ? <Badge variant="primary" className="mb-2 w-fit">{tag}</Badge> : null}
          <Heading level={3} className="group-hover:text-primary-500">
            {name}
          </Heading>
          <p className="mt-2 flex-1 text-sm text-[var(--muted)]">{summary}</p>
          <span className="mt-4 text-sm font-medium text-primary-500">Learn more &rarr;</span>
        </div>
      </Link>
    </Card>
  );
}
