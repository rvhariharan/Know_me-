import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;
    const quiz = await db.getQuizByCode(code, false);

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if (!quiz.showLeaderboard) {
      return NextResponse.json({
        success: true,
        disabled: true,
        message: "The creator has chosen to keep the leaderboard private.",
      });
    }

    const leaderboard = await db.getLeaderboard(code, 30);

    return NextResponse.json({
      success: true,
      disabled: false,
      quiz: {
        title: quiz.title,
        creatorName: quiz.creatorName,
        shareCode: quiz.shareCode,
      },
      leaderboard,
    });
  } catch (err: any) {
    console.error("Error fetching leaderboard:", err);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
