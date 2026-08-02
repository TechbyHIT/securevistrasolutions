import { requireAdmin } from "@/lib/admin/auth";
import { AdminShell } from "@/components/admin/AdminClient";
import { getPublishedServices } from "@/data/initial-services";

export default async function AdminServicesPage() {
  await requireAdmin();
  const services = getPublishedServices();

  return (
    <AdminShell title="Services">
      <p className="mb-4 text-sm text-[var(--muted)]">
        Data-driven from <code>src/data/initial-services.ts</code>. Edit source files to update.
      </p>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className="py-2 pr-4">Name</th>
            <th className="py-2 pr-4">Slug</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s.id} className="border-b border-[var(--border)]">
              <td className="py-2 pr-4">{s.name}</td>
              <td className="py-2 pr-4">{s.slug}</td>
              <td className="py-2 pr-4">{s.publicationStatus}</td>
              <td className="py-2">{s.qualityScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
