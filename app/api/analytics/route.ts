import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics Ingest]", body?.event, body?.properties);
    }
    // In production, forward to your preferred analytics provider (PostHog, Mixpanel, Plausible, etc.)
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
