import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "Revalidation not configured" }, { status: 501 });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { path?: string };
    if (body.path) {
      revalidatePath(body.path);
      return NextResponse.json({ revalidated: true, path: body.path });
    }

    revalidatePath("/", "layout");
    return NextResponse.json({ revalidated: true, path: "/" });
  } catch {
    return NextResponse.json({ message: "Revalidation failed" }, { status: 500 });
  }
}
