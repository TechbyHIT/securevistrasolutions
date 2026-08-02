"use client";

import { useState, type FormEvent } from "react";
import { quoteFormSchema, type QuoteFormState } from "@/components/forms/schemas";
import { buildQuoteWhatsAppUrl } from "@/lib/forms/whatsapp-form";
import { getPublishedServices } from "@/data/initial-services";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type QuoteFormProps = {
  defaultService?: string;
  className?: string;
};

export function QuoteForm({ defaultService, className }: QuoteFormProps) {
  const [state, setState] = useState<QuoteFormState>({ success: false, message: "" });
  const [pending, setPending] = useState(false);
  const services = getPublishedServices();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setState({ success: false, message: "" });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const raw = Object.fromEntries(formData.entries());
    const parsed = quoteFormSchema.safeParse(raw);

    if (!parsed.success) {
      setPending(false);
      setState({
        success: false,
        message: "Please fix the errors below.",
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      });
      return;
    }

    if (parsed.data.website) {
      setPending(false);
      setState({ success: false, message: "Submission rejected." });
      return;
    }

    const url = buildQuoteWhatsAppUrl({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || undefined,
      service: parsed.data.service,
      area: parsed.data.area,
      propertyType: parsed.data.propertyType || undefined,
      message: parsed.data.message || undefined,
    });

    setState({
      success: true,
      message: "Opening WhatsApp with your quote request…",
    });
    window.open(url, "_blank", "noopener,noreferrer");
    setPending(false);
    form.reset();
  }

  return (
    <form onSubmit={onSubmit} className={cn("space-y-4", className)} noValidate>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {state.message ? (
        <p
          role="status"
          className={cn(
            "rounded-lg px-4 py-3 text-sm",
            state.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800",
          )}
        >
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="quote-name" className="mb-1 block text-sm font-medium">
            Name *
          </label>
          <input
            id="quote-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
          />
          {state.errors?.name ? <p className="mt-1 text-xs text-red-600">{state.errors.name[0]}</p> : null}
        </div>
        <div>
          <label htmlFor="quote-phone" className="mb-1 block text-sm font-medium">
            Phone *
          </label>
          <input
            id="quote-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
          />
          {state.errors?.phone ? <p className="mt-1 text-xs text-red-600">{state.errors.phone[0]}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="quote-email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="quote-email"
          name="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="quote-service" className="mb-1 block text-sm font-medium">
          Service *
        </label>
        <select
          id="quote-service"
          name="service"
          required
          defaultValue={defaultService ?? ""}
          className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
        >
          <option value="" disabled>
            Select a service
          </option>
          {services.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
        {state.errors?.service ? <p className="mt-1 text-xs text-red-600">{state.errors.service[0]}</p> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="quote-area" className="mb-1 block text-sm font-medium">
            Area in Hyderabad *
          </label>
          <input
            id="quote-area"
            name="area"
            type="text"
            required
            placeholder="e.g. Gachibowli"
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
          />
          {state.errors?.area ? <p className="mt-1 text-xs text-red-600">{state.errors.area[0]}</p> : null}
        </div>
        <div>
          <label htmlFor="quote-property" className="mb-1 block text-sm font-medium">
            Property type
          </label>
          <input
            id="quote-property"
            name="propertyType"
            type="text"
            placeholder="e.g. Apartment"
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="quote-message" className="mb-1 block text-sm font-medium">
          Additional details
        </label>
        <textarea
          id="quote-message"
          name="message"
          rows={3}
          className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
        />
      </div>

      <Button type="submit" variant="accent" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Opening WhatsApp…" : "Send on WhatsApp"}
      </Button>
      <p className="text-xs text-[var(--muted)]">
        Your details open in WhatsApp so our team can reply instantly.
      </p>
    </form>
  );
}
