import { BUSINESS_CONFIG } from "@/config/business";

export type QuoteWhatsAppPayload = {
  name: string;
  phone: string;
  email?: string;
  service: string;
  area: string;
  propertyType?: string;
  message?: string;
};

export function getWhatsAppNumber(): string {
  return BUSINESS_CONFIG.whatsapp.raw.replace(/\D/g, "");
}

/** Build a wa.me URL with a prefilled quote message from form fields. */
export function buildQuoteWhatsAppUrl(data: QuoteWhatsAppPayload): string {
  const lines = [
    `Hi ${BUSINESS_CONFIG.name}, I need a free quote.`,
    ``,
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    data.email ? `Email: ${data.email}` : null,
    `Service: ${data.service}`,
    `Area: ${data.area}`,
    data.propertyType ? `Property: ${data.propertyType}` : null,
    data.message ? `Details: ${data.message}` : null,
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${getWhatsAppNumber()}?text=${text}`;
}

export type ContactWhatsAppPayload = {
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
};

export function buildContactWhatsAppUrl(data: ContactWhatsAppPayload): string {
  const lines = [
    `Hi ${BUSINESS_CONFIG.name}, new contact request.`,
    ``,
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    data.email ? `Email: ${data.email}` : null,
    `Subject: ${data.subject}`,
    `Message: ${data.message}`,
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${getWhatsAppNumber()}?text=${text}`;
}
