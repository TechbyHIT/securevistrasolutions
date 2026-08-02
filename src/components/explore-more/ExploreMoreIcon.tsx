import type { ExploreMoreIconName } from "@/types/explore-more";

type Props = {
  name: ExploreMoreIconName;
  className?: string;
};

/** Lightweight stroke icons — no external icon package. */
export function ExploreMoreIcon({ name, className }: Props) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
    focusable: false as const,
  };

  switch (name) {
    case "service":
      return (
        <svg {...common}>
          <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
          <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
        </svg>
      );
    case "related":
      return (
        <svg {...common}>
          <circle cx="6" cy="6" r="2.5" />
          <circle cx="18" cy="6" r="2.5" />
          <circle cx="12" cy="18" r="2.5" />
          <path d="M8 7.5l2.5 7M16 7.5l-2.5 7" />
        </svg>
      );
    case "map":
      return (
        <svg {...common}>
          <path d="M9 4l-5 2v14l5-2 6 2 5-2V4l-5 2-6-2z" />
          <path d="M9 4v14M15 6v14" />
        </svg>
      );
    case "city":
      return (
        <svg {...common}>
          <path d="M4 20V8l5-3 5 3v12M14 20V10l6-2v12" />
          <path d="M7 11h2M7 15h2M16 13h2" />
        </svg>
      );
    case "district":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "state":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16l4 4" />
        </svg>
      );
    case "price":
      return (
        <svg {...common}>
          <path d="M12 3v18M16.5 7.5c0-1.7-2-3-4.5-3s-4.5 1.3-4.5 3 2 3 4.5 3 4.5 1.3 4.5 3-2 3-4.5 3-4.5-1.3-4.5-3" />
        </svg>
      );
    case "guide":
      return (
        <svg {...common}>
          <path d="M5 4h10a2 2 0 012 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 012-2z" />
          <path d="M9 9h6M9 13h6" />
        </svg>
      );
    case "install":
      return (
        <svg {...common}>
          <path d="M14.5 4.5l5 5-9.5 9.5H5v-5L14.5 4.5z" />
          <path d="M12.5 6.5l5 5" />
        </svg>
      );
    case "app":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="7" height="7" rx="1.5" />
          <rect x="13" y="4" width="7" height="7" rx="1.5" />
          <rect x="4" y="13" width="7" height="7" rx="1.5" />
          <path d="M16.5 14.5v5M14 17h5" />
        </svg>
      );
    case "building":
      return (
        <svg {...common}>
          <path d="M5 20V6a1 1 0 011-1h7a1 1 0 011 1v14M14 10h4a1 1 0 011 1v9" />
          <path d="M8 9h2M8 13h2M8 17h2" />
        </svg>
      );
    case "materials":
      return (
        <svg {...common}>
          <path d="M4 8l8-4 8 4-8 4-8-4z" />
          <path d="M4 12l8 4 8-4M4 16l8 4 8-4" />
        </svg>
      );
    case "maintenance":
      return (
        <svg {...common}>
          <path d="M14.7 6.3a4 4 0 015 5L12 19H7v-5l7.7-7.7z" />
          <path d="M3 21h7" />
        </svg>
      );
    case "repair":
      return (
        <svg {...common}>
          <path d="M14 7a4 4 0 105.6 5.6L14 7z" />
          <path d="M8 14l-4 6 6-4" />
        </svg>
      );
    case "faq":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9.5a2.5 2.5 0 114 2c-.7.6-1.5 1.1-1.5 2.5M12 17h.01" />
        </svg>
      );
    case "project":
      return (
        <svg {...common}>
          <path d="M4 7h16v12H4z" />
          <path d="M9 7V5h6v2" />
        </svg>
      );
    case "gallery":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="9" cy="11" r="1.5" />
          <path d="M3 16l5-4 4 3 3-2 6 4" />
        </svg>
      );
    case "blog":
      return (
        <svg {...common}>
          <path d="M5 5h14v14H5z" />
          <path d="M8 9h8M8 13h8M8 17h5" />
        </svg>
      );
    case "landmark":
      return (
        <svg {...common}>
          <path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case "apartment":
      return (
        <svg {...common}>
          <path d="M6 20V4h12v16" />
          <path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2" />
        </svg>
      );
    case "commercial":
      return (
        <svg {...common}>
          <path d="M3 20h18M5 20V9l7-4 7 4v11" />
          <path d="M10 20v-5h4v5" />
        </svg>
      );
    case "itpark":
      return (
        <svg {...common}>
          <rect x="3" y="8" width="7" height="12" rx="1" />
          <rect x="14" y="4" width="7" height="16" rx="1" />
          <path d="M5.5 11h2M5.5 14h2M16.5 8h2M16.5 11h2M16.5 14h2" />
        </svg>
      );
    case "product":
      return (
        <svg {...common}>
          <path d="M4 8h16l-1.5 11h-13L4 8z" />
          <path d="M9 8a3 3 0 016 0" />
        </svg>
      );
    case "review":
      return (
        <svg {...common}>
          <path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.8 7.2 18l.9-5.4L4.2 8.7l5.4-.8L12 3z" />
        </svg>
      );
    case "contact":
      return (
        <svg {...common}>
          <path d="M5 5h14v14H5z" />
          <path d="M5 8l7 5 7-5" />
        </svg>
      );
    case "inspect":
      return (
        <svg {...common}>
          <path d="M8 4h8v4H8z" />
          <path d="M6 8h12v12H6z" />
          <path d="M10 13h4M12 11v4" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}
