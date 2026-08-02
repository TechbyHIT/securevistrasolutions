import { NextResponse } from "next/server";
import { contactFormSchema } from "@/components/forms/schemas";
import { buildContactWhatsAppUrl } from "@/lib/forms/whatsapp-form";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.website) {
      return NextResponse.json({ success: false, message: "Rejected" }, { status: 400 });
    }

    const parsed = contactFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const whatsappUrl = buildContactWhatsAppUrl({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || undefined,
      subject: parsed.data.subject,
      message: parsed.data.message,
    });

    return NextResponse.json({
      success: true,
      message: "Opening WhatsApp with your message.",
      whatsappUrl,
    });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
  }
}
