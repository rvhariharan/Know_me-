import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateSubmissionInput, checkRateLimit, sanitizeText } from "@/lib/utils/validation";
import { getScoreTier } from "@/lib/utils/scoring";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;
    const ip = req.headers.get("x-forwarded-for") || "local";
    if (!checkRateLimit(`submit_${ip}_${code}`, 20, 60000)) {
      return NextResponse.json(
        { error: "Too many submissions. Please slow down." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Fetch quiz with full answers for grading
    const quizWithAnswers = await db.getQuizByCode(code, true);
    if (!quizWithAnswers) {
      return NextResponse.json(
        { error: "Quiz not found or has been deleted." },
        { status: 404 }
      );
    }

    const validation = validateSubmissionInput({
      playerName: body.playerName,
      answers: body.answers,
      expectedQuestionsCount: quizWithAnswers.questions.length,
    });

    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    const playerName = sanitizeText(body.playerName);
    const questions = quizWithAnswers.questions;
    const submittedAnswers: { questionId: string; selectedOption: 1 | 2 | 3 | 4 }[] =
      body.answers;

    // Grade answers
    let score = 0;
    const answersToSave: {
      questionId: string;
      selectedOption: 1 | 2 | 3 | 4;
      isCorrect: boolean;
    }[] = [];

    const breakdown: {
      questionId: string;
      questionText: string;
      options: [string, string, string, string];
      optionImages?: [string?, string?];
      selectedOption: 1 | 2 | 3 | 4;
      correctOption: 1 | 2 | 3 | 4;
      isCorrect: boolean;
    }[] = [];

    for (const q of questions) {
      const userAns = submittedAnswers.find((a) => a.questionId === q.id);
      const selected = userAns?.selectedOption || 1;
      const isCorrect = selected === q.correctOption;

      if (isCorrect) {
        score += 1;
      }

      answersToSave.push({
        questionId: q.id,
        selectedOption: selected,
        isCorrect,
      });

      breakdown.push({
        questionId: q.id,
        questionText: q.questionText,
        options: [q.option1, q.option2, q.option3 || "", q.option4 || ""],
        optionImages: [q.option1Image, q.option2Image],
        selectedOption: selected,
        correctOption: q.correctOption,
        isCorrect,
      });
    }

    const totalQuestions = questions.length;
    const percentage =
      totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const tier = getScoreTier(score, totalQuestions);

    const saved = await db.saveAttempt(
      {
        quizId: quizWithAnswers.id,
        playerName,
        score,
        totalQuestions,
        percentage,
      },
      answersToSave
    );

    return NextResponse.json({
      success: true,
      attemptId: saved.attempt.id,
      shareCode: quizWithAnswers.shareCode,
      creatorName: quizWithAnswers.creatorName,
      playerName,
      score,
      totalQuestions,
      percentage,
      tier,
      breakdown,
    });
  } catch (err: any) {
    console.error("Error submitting quiz:", err);
    return NextResponse.json(
      { error: "Failed to grade and save submission." },
      { status: 500 }
    );
  }
}
