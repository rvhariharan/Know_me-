import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateQuizInput, checkRateLimit, sanitizeText } from "@/lib/utils/validation";
import { generateShareCode, generateCreatorToken } from "@/lib/utils/nanoid";
import { getQuizUrl } from "@/lib/utils/share";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    if (!checkRateLimit(`create_${ip}`, 15, 60000)) {
      return NextResponse.json(
        { error: "Too many quizzes created recently. Please wait a minute." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validation = validateQuizInput(body);

    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    const creatorName = sanitizeText(body.creatorName);
    const title = sanitizeText(body.title);
    const description = sanitizeText(body.description || "");
    const showLeaderboard = body.showLeaderboard !== false;

    // Generate unique share code
    let shareCode = generateShareCode(6);
    let attempts = 0;
    while (attempts < 5) {
      const existing = await db.getQuizByCode(shareCode);
      if (!existing) break;
      shareCode = generateShareCode(7);
      attempts++;
    }

    const creatorToken = generateCreatorToken();

    const questionsData = body.questions.map((q: any, idx: number) => ({
      questionText: sanitizeText(q.questionText),
      option1: sanitizeText(q.option1),
      option2: sanitizeText(q.option2),
      option3: sanitizeText(q.option3),
      option4: sanitizeText(q.option4),
      correctOption: Number(q.correctOption) as 1 | 2 | 3 | 4,
      questionOrder: idx,
    }));

    const result = await db.createQuiz(
      {
        creatorName,
        creatorToken,
        title,
        description,
        shareCode,
        isPublic: true,
        showLeaderboard,
      },
      questionsData
    );

    const quizUrl = getQuizUrl(shareCode);

    return NextResponse.json(
      {
        success: true,
        shareCode,
        creatorToken,
        quizId: result.quiz.id,
        quizUrl,
        quiz: {
          id: result.quiz.id,
          title: result.quiz.title,
          creatorName: result.quiz.creatorName,
          shareCode: result.quiz.shareCode,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error creating quiz:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to create quiz." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Creator token is required to view your quizzes." },
        { status: 400 }
      );
    }

    const quizzes = await db.getQuizzesByCreatorToken(token);
    return NextResponse.json({ success: true, quizzes });
  } catch (err: any) {
    console.error("Error fetching creator quizzes:", err);
    return NextResponse.json(
      { error: "Failed to fetch quizzes." },
      { status: 500 }
    );
  }
}
