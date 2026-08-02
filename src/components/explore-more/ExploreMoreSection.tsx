import { ExploreMoreCardView } from "@/components/explore-more/ExploreMoreCardView";
import type { ExploreMoreSectionData } from "@/types/explore-more";
import { cn } from "@/lib/utils";

type Props = {
  data: ExploreMoreSectionData;
  className?: string;
};

/**
 * Enterprise "Explore More / Related Pages" board for programmatic SEO pages.
 * Mobile: accordion cards. Tablet/Desktop: adaptive CSS grid with featured spans.
 */
export function ExploreMoreSection({ data, className }: Props) {
  if (!data.cards.length) return null;

  return (
    <section
      id="explore-more"
      className={cn("explore-more", className)}
      aria-labelledby="explore-more-heading"
    >
      <div className="explore-more__inner">
        <header className="explore-more__header">
          <p className="explore-more__eyebrow">Related pages</p>
          <h2 id="explore-more-heading" className="explore-more__title">
            {data.title}
          </h2>
          <p className="explore-more__intro">{data.intro}</p>
        </header>

        <div className="explore-more__grid">
          {data.cards.map((card) => (
            <ExploreMoreCardView
              key={card.id}
              card={card}
              currentPath={data.currentPath}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
