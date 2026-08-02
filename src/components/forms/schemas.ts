import { z } from "zod";

const honeypotField = z.string().max(0, "Spam detected");

export const quoteFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Valid email required").optional().or(z.literal("")),
  service: z.string().min(1, "Please select a service"),
  area: z.string().min(1, "Please enter your area in Hyderabad"),
  propertyType: z.string().optional(),
  message: z.string().max(1000).optional(),
  website: honeypotField.optional(),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Valid email required").optional().or(z.literal("")),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message is required").max(2000),
  website: honeypotField.optional(),
});

export type QuoteFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export type ContactFormState = QuoteFormState;
