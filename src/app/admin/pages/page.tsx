import { requireAdmin } from "@/lib/admin/auth";
import { AdminShell } from "@/components/admin/AdminClient";
import { getAllPages, countByStatus } from "@/lib/pages/registry";

export default async function AdminPagesPage() {
  await requireAdmin();
  const counts = countByStatus();
  const pages = getAllPages().slice(0, 50);

  return (
    <AdminShell title="Pages">
      <div className="mb-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Object.entries(counts).map(([key, value]) => (
          <div key={key} className="rounded-lg border border-[var(--border)] p-4">
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm capitalize text-[var(--muted)]">{key}</p>
          </div>
        ))}
      </div>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className="py-2 pr-4">Path</th>
            <th className="py-2 pr-4">Type</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2">Indexable</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((p) => (
            <tr key={p.id} className="border-b border-[var(--border)]">
              <td className="py-2 pr-4 font-mono text-xs">{p.path}</td>
              <td className="py-2 pr-4">{p.pageType}</td>
              <td className="py-2 pr-4">{p.publicationStatus}</td>
              <td className="py-2">{p.allowIndexing ? "yes" : "no"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-sm text-[var(--muted)]">Showing first 50 of {counts.total} pages.</p>
    </AdminShell>
  );
}
