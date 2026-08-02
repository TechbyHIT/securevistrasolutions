import Image from "next/image";
import Link from "next/link";
import { Heading } from "@/components/ui/Heading";
import { cn } from "@/lib/utils";

export type GalleryImage = {
  src: string;
  alt: string;
  href?: string;
};

type ImageGalleryProps = {
  id?: string;
  title?: string;
  description?: string;
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
  className?: string;
};

export function ImageGallery({
  id,
  title = "Installation photos",
  description,
  images,
  columns = 3,
  className,
}: ImageGalleryProps) {
  if (images.length === 0) return null;

  const gridClass =
    columns === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : columns === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section className={cn("space-y-6", className)} id={id ?? "gallery"}>
      <div>
        <Heading level={2}>{title}</Heading>
        {description ? <p className="mt-2 max-w-3xl text-[var(--muted)]">{description}</p> : null}
      </div>
      <div className={cn("grid gap-4", gridClass)}>
        {images.map((image) => {
          const card = (
            <div className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] shadow-sm">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          );

          return image.href ? (
            <Link key={image.src} href={image.href} className="block">
              {card}
            </Link>
          ) : (
            <div key={image.src}>{card}</div>
          );
        })}
      </div>
    </section>
  );
}
