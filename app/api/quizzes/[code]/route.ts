import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;
    if (!code) {
      return NextResponse.json({ error: "Share code required" }, { status: 400 });
    }

    // Do NOT include answers for public consumption!
    const quiz = await db.getQuizByCode(code, false);

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz not found or has been deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      quiz: {
        id: quiz.id,
        creatorName: quiz.creatorName,
        title: quiz.title,
        description: quiz.description,
        shareCode: quiz.shareCode,
        showLeaderboard: quiz.showLeaderboard,
        totalQuestions: quiz.questions.length,
        questions: quiz.questions.map((q) => ({
          id: q.id,
          questionText: q.questionText,
          option1: q.option1,
          option2: q.option2,
          option3: q.option3,
          option4: q.option4,
          questionOrder: q.questionOrder,
        })),
      },
    });
  } catch (err: any) {
    console.error("Error fetching quiz:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;
    const body = await req.json().catch(() => ({}));
    const authHeader = req.headers.get("authorization") || "";
    const token =
      body.creatorToken ||
      req.nextUrl.searchParams.get("token") ||
      authHeader.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Creator token is required to delete this quiz." },
        { status: 401 }
      );
    }

    const deleted = await db.deleteQuiz(code, token);
    if (!deleted) {
      return NextResponse.json(
        { error: "Failed to delete quiz. Invalid token or quiz does not exist." },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, message: "Quiz deleted successfully." });
  } catch (err: any) {
    console.error("Error deleting quiz:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
