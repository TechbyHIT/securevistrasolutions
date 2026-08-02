import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="py-20 text-center">
      <p className="text-sm font-medium text-primary-500">404</p>
      <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-[var(--muted)]">The page you are looking for does not exist or is not published.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Button href="/">Go home</Button>
        <Button href="/contact/" variant="outline">
          Contact us
        </Button>
      </div>
      <p className="mt-8 text-sm">
        <Link href="/services/" className="text-primary-500 hover:underline">
          Browse services
        </Link>
      </p>
    </Container>
  );
}
