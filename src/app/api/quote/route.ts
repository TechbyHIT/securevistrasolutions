import { NextResponse } from "next/server";
import { quoteFormSchema } from "@/components/forms/schemas";
import { buildQuoteWhatsAppUrl } from "@/lib/forms/whatsapp-form";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.website) {
      return NextResponse.json({ success: false, message: "Rejected" }, { status: 400 });
    }

    const parsed = quoteFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
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

    return NextResponse.json({
      success: true,
      message: "Opening WhatsApp with your quote request.",
      whatsappUrl,
    });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
  }
}
