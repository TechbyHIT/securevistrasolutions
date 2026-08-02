"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <Container className="py-20 text-center">
          <h1 className="text-2xl font-bold">Application error</h1>
          <p className="mt-2 text-neutral-600">A critical error occurred.</p>
          <div className="mt-6">
            <Button onClick={reset}>Try again</Button>
          </div>
        </Container>
      </body>
    </html>
  );
}
