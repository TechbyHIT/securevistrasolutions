import Link from "next/link";
import { ExploreMoreIcon } from "@/components/explore-more/ExploreMoreIcon";
import type { ExploreMoreCard } from "@/types/explore-more";

type Props = {
  card: ExploreMoreCard;
  currentPath: string;
};

function isCurrent(href: string, currentPath: string) {
  const a = href.endsWith("/") ? href : `${href}/`;
  const b = currentPath.endsWith("/") ? currentPath : `${currentPath}/`;
  return a === b;
}

/**
 * Premium explore card. Uses native <details> for mobile accordion;
 * desktop CSS forces panels open for crawlability + scanability.
 */
export function ExploreMoreCardView({ card, currentPath }: Props) {
  const variant = card.variant ?? "standard";

  return (
    <details
      className={`explore-card explore-card--${variant}`}
      open={card.defaultOpen || undefined}
      data-card-id={card.id}
    >
      <summary className="explore-card__summary">
        <span className="explore-card__icon" aria-hidden="true">
          <ExploreMoreIcon name={card.icon} className="explore-card__icon-svg" />
        </span>
        <span className="explore-card__heading-wrap">
          <span className="explore-card__title">{card.title}</span>
          <span className="explore-card__desc">{card.description}</span>
        </span>
        <span className="explore-card__chevron" aria-hidden="true">
          <svg viewBox="0 0 20 20" className="explore-card__chevron-svg" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 7.5L10 12.5L15 7.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </summary>

      <div className="explore-card__body">
        <nav aria-label={card.title}>
          <ul className="explore-card__list">
            {card.links.map((link, index) => {
              const current = isCurrent(link.href, currentPath);
              const external = link.href.startsWith("http") || link.href.startsWith("tel:");
              const className = current
                ? "explore-card__link explore-card__link--current"
                : "explore-card__link";

              return (
                <li key={`${card.id}-${index}-${link.href}`}>
                  {external ? (
                    <a
                      href={link.href}
                      className={className}
                      {...(link.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      aria-current={current ? "page" : undefined}
                    >
                      <span className="explore-card__dot" aria-hidden="true" />
                      <span className="explore-card__label">{link.label}</span>
                      {link.badge ? <span className="explore-card__badge">{link.badge}</span> : null}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className={className}
                      aria-current={current ? "page" : undefined}
                    >
                      <span className="explore-card__dot" aria-hidden="true" />
                      <span className="explore-card__label">{link.label}</span>
                      {link.badge ? <span className="explore-card__badge">{link.badge}</span> : null}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {card.viewAllHref ? (
          <div className="explore-card__footer">
            <Link href={card.viewAllHref} className="explore-card__view-all">
              {card.viewAllLabel ?? "View all"}
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
        ) : null}
      </div>
    </details>
  );
}
