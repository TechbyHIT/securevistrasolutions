"use server";

import {
  quoteFormSchema,
  contactFormSchema,
  type QuoteFormState,
  type ContactFormState,
} from "@/components/forms/schemas";
import { buildContactWhatsAppUrl, buildQuoteWhatsAppUrl } from "@/lib/forms/whatsapp-form";

export type QuoteFormResult = QuoteFormState & { whatsappUrl?: string };
export type ContactFormResult = ContactFormState & { whatsappUrl?: string };

export async function submitQuoteForm(
  _prevState: QuoteFormState,
  formData: FormData,
): Promise<QuoteFormResult> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = quoteFormSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  if (parsed.data.website) {
    return { success: false, message: "Submission rejected." };
  }

  const whatsappUrl = buildQuoteWhatsAppUrl({
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email || undefined,
    service: parsed.data.service,
    area: parsed.data.area,
    propertyType: parsed.data.propertyType || undefined,
    message: parsed.data.message || undefined,
  });

  return {
    success: true,
    message: "Opening WhatsApp with your quote request…",
    whatsappUrl,
  };
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormResult> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = contactFormSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  if (parsed.data.website) {
    return { success: false, message: "Submission rejected." };
  }

  const whatsappUrl = buildContactWhatsAppUrl({
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email || undefined,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });

  return {
    success: true,
    message: "Opening WhatsApp with your message…",
    whatsappUrl,
  };
}
