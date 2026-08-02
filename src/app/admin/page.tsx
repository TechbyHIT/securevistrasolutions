import { isAdminAuthenticated } from "@/lib/admin/auth";
import { AdminLoginForm } from "@/components/admin/AdminClient";
import { Container } from "@/components/ui/Container";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin/services/");
  }

  return (
    <Container className="py-20">
      <AdminLoginForm />
    </Container>
  );
}
