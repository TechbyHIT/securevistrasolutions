"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.get("username"),
        password: formData.get("password"),
      }),
    });

    setPending(false);

    if (!res.ok) {
      setError("Invalid credentials");
      return;
    }

    router.push("/admin/services/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-4">
      <Heading level={2}>Admin Login</Heading>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div>
        <label htmlFor="username" className="mb-1 block text-sm font-medium">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
        />
      </div>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}

export function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <Container className="py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <Heading level={1}>{title}</Heading>
        <nav className="flex flex-wrap gap-3 text-sm">
          <Link href="/admin/services/" className="text-primary-500 hover:underline">
            Services
          </Link>
          <Link href="/admin/locations/" className="text-primary-500 hover:underline">
            Locations
          </Link>
          <Link href="/admin/pages/" className="text-primary-500 hover:underline">
            Pages
          </Link>
          <Link href="/admin/publishing/" className="text-primary-500 hover:underline">
            Publishing
          </Link>
          <Link href="/admin/audits/" className="text-primary-500 hover:underline">
            Audits
          </Link>
        </nav>
      </div>
      {children}
    </Container>
  );
}
