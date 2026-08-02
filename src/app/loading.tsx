import { Container } from "@/components/ui/Container";

export default function Loading() {
  return (
    <Container className="py-20">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-2/3 rounded bg-neutral-200" />
        <div className="h-4 w-full rounded bg-neutral-200" />
        <div className="h-4 w-5/6 rounded bg-neutral-200" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-xl bg-neutral-200" />
          ))}
        </div>
      </div>
    </Container>
  );
}
