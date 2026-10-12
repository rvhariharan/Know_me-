import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getScoreTier } from "@/lib/utils/scoring";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ attemptId: string }> }
) {
  try {
    const { attemptId } = await context.params;
    if (!attemptId) {
      return NextResponse.json({ error: "Attempt ID required" }, { status: 400 });
    }

    const data = await db.getAttemptById(attemptId);
    if (!data) {
      return NextResponse.json(
        { error: "Result not found. It may have expired or been removed." },
        { status: 404 }
      );
    }

    const tier = getScoreTier(data.attempt.score, data.attempt.totalQuestions);

    return NextResponse.json({
      success: true,
      attempt: data.attempt,
      quiz: {
        id: data.quiz.id,
        creatorName: data.quiz.creatorName,
        title: data.quiz.title,
        shareCode: data.quiz.shareCode,
        showLeaderboard: data.quiz.showLeaderboard,
      },
      tier,
      breakdown: data.answers.map((ans) => ({
        questionId: ans.questionId,
        questionText: ans.questionText,
        options: ans.options,
        selectedOption: ans.selectedOption,
        correctOption: ans.correctOption,
        isCorrect: ans.isCorrect,
      })),
    });
  } catch (err: any) {
    console.error("Error fetching attempt result:", err);
    return NextResponse.json(
      { error: "Failed to load result" },
      { status: 500 }
    );
  }
}
