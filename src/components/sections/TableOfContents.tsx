type TableOfContentsProps = {
  items: { label: string; href: string }[];
};

export function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-5"
    >
      <p className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
        On this page
      </p>
      <ol className="mt-3 space-y-2 text-sm">
        {items.map((item, index) => (
          <li key={item.href}>
            <a href={item.href} className="text-primary-600 hover:underline">
              {index + 1}. {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
