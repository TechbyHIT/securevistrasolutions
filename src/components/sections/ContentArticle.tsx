import Link from "next/link";
import type { ContentBlock } from "@/types/content";
import { Heading } from "@/components/ui/Heading";
import { ProcessSteps } from "@/components/sections/ProcessSteps";

type ContentArticleProps = {
  block: ContentBlock;
};

/** Convert bare internal paths in plain text into readable labels (never show raw dumps). */
function humanizeInlinePaths(text: string): string {
  return text
    .replace(/Area hub:\s*\/locations\/hyderabad\/([\w-]+)\/\.?/gi, "")
    .replace(/Installation page:\s*\/[\w\-/]+\/\.?/gi, "")
    .replace(/All services in [^:]+:\s*[^.]+/gi, "")
    .replace(/at\s+\/[\w\-/]+\/?/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+\./g, ".")
    .trim();
}

export function ContentArticle({ block }: ContentArticleProps) {
  const isProcess =
    block.id === "intent-installation" ||
    block.id === "sa-process" ||
    block.id === "longform-process";

  return (
    <article id={block.anchorId} className="scroll-mt-28">
      <Heading level={2}>{block.heading}</Heading>

      {block.highlight ? (
        <p className="mt-3 rounded-lg bg-primary-50 px-4 py-3 text-sm font-medium text-primary-800">
          {block.highlight}
        </p>
      ) : null}

      {block.paragraphs.map((paragraph, index) => (
        <p key={`${block.id}-p-${index}`} className="mt-3 leading-relaxed text-[var(--muted)]">
          {humanizeInlinePaths(paragraph)}
        </p>
      ))}

      {block.tableRows && block.tableRows.length > 0 ? (
        <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-white">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
                <th className="px-3 py-2 text-left font-semibold">Type</th>
                <th className="px-3 py-2 text-left font-semibold">Price range</th>
                <th className="px-3 py-2 text-left font-semibold">Best for</th>
              </tr>
            </thead>
            <tbody>
              {block.tableRows.map((row, index) => (
                <tr key={`${block.id}-row-${index}`} className="border-b border-[var(--border)]">
                  <td className="px-3 py-2">{row.label}</td>
                  <td className="px-3 py-2 font-medium">{row.value}</td>
                  <td className="px-3 py-2 text-[var(--muted)]">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {block.subSections && block.subSections.length > 0 ? (
        isProcess ? (
          <ProcessSteps steps={block.subSections} />
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {block.subSections.map((section, index) => {
              const body = humanizeInlinePaths(section.description);
              const card = (
                <>
                  <p className="font-semibold text-primary-900">{section.title}</p>
                  {body ? (
                    <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{body}</p>
                  ) : null}
                  {section.href ? (
                    <span className="mt-2 inline-block text-xs font-semibold text-accent-600">
                      View page →
                    </span>
                  ) : null}
                </>
              );

              return section.href ? (
                <Link
                  key={`${block.id}-sub-${index}`}
                  href={section.href}
                  className="card-surface p-4 transition-colors hover:border-primary-300 hover:bg-primary-50/40"
                >
                  {card}
                </Link>
              ) : (
                <div
                  key={`${block.id}-sub-${index}`}
                  className="card-surface p-4"
                >
                  {card}
                </div>
              );
            })}
          </div>
        )
      ) : null}

      {block.listItems && block.listItems.length > 0 ? (
        <ul className="mt-4 list-disc space-y-2 pl-5 text-[var(--muted)]">
          {block.listItems.map((item, index) => (
            <li key={`${block.id}-li-${index}`}>{humanizeInlinePaths(item)}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
