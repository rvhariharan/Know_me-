import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { QuizPlayer } from "@/components/quiz/QuizPlayer";
import { AlertCircle, PlusCircle, ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  const quiz = await db.getQuizByCode(code, false);

  if (!quiz) {
    return {
      title: "Quiz Not Found – KnowMe",
      description: "This KnowMe quiz doesn't exist or has been removed.",
    };
  }

  const title = `How Well Do You Know ${quiz.creatorName}? 😏 – KnowMe`;
  const description = `Take ${quiz.creatorName}'s personal friendship quiz to see how well you really know them!`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: `/api/og?name=${encodeURIComponent(quiz.creatorName)}`,
          width: 1200,
          height: 630,
          alt: `How Well Do You Know ${quiz.creatorName}?`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function QuizPage({ params }: PageProps) {
  const { code } = await params;
  const quiz = await db.getQuizByCode(code, false);

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-panel rounded-3xl p-8 border border-white/10 text-center shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Quiz Not Found</h2>
          <p className="text-sm text-slate-300 mb-6">
            Oops! This quiz code doesn&apos;t exist or has been removed by the creator.
          </p>
          <div className="space-y-3">
            <Link
              href="/"
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/15 flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <Link
              href="/create"
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 flex items-center justify-center gap-2 shadow-lg shadow-pink-600/20 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Create Your Own Quiz
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-center py-6">
      <QuizPlayer
        quiz={{
          id: quiz.id,
          creatorName: quiz.creatorName,
          title: quiz.title,
          description: quiz.description,
          shareCode: quiz.shareCode,
          showLeaderboard: quiz.showLeaderboard,
          questions: quiz.questions,
        }}
      />
    </div>
  );
}
