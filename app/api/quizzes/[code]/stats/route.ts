import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;
    const { searchParams } = new URL(req.url);
    const token =
      searchParams.get("token") ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Creator token is required to view detailed stats." },
        { status: 401 }
      );
    }

    const stats = await db.getQuizStats(code, token);
    if (!stats) {
      return NextResponse.json(
        { error: "Quiz not found or unauthorized token." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (err: any) {
    console.error("Error fetching quiz stats:", err);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
