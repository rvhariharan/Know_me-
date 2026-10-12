import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { getScoreTier } from "@/lib/utils/scoring";
import { ScoreCard } from "@/components/result/ScoreCard";
import { ShareButtons } from "@/components/result/ShareButtons";
import { AnswersBreakdown } from "@/components/result/AnswersBreakdown";
import { AdBanner } from "@/components/ui/AdBanner";
import {
  Trophy,
  PlusCircle,
  ArrowRight,
  AlertCircle,
  Home,
  Flame,
} from "lucide-react";

interface PageProps {
  params: Promise<{ attemptId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { attemptId } = await params;
  const data = await db.getAttemptById(attemptId);

  if (!data) {
    return {
      title: "Quiz Result – KnowMe",
      description: "View friendship quiz results on KnowMe.",
    };
  }

  const { attempt, quiz } = data;
  const tier = getScoreTier(attempt.score, attempt.totalQuestions);
  const title = `${attempt.playerName} scored ${attempt.score}/${attempt.totalQuestions} on ${quiz.creatorName}'s Quiz! ${tier.emoji}`;
  const description = `"${tier.quote}" – How well do you know ${quiz.creatorName}? Take the quiz and find out!`;

  return {
    title: `${title} – KnowMe`,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ResultPage({ params }: PageProps) {
  const { attemptId } = await params;
  const data = await db.getAttemptById(attemptId);

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-panel rounded-3xl p-8 border border-white/10 text-center shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Result Not Found</h2>
          <p className="text-sm text-slate-300 mb-6">
            We couldn&apos;t find this attempt result. It may have expired or been removed.
          </p>
          <Link
            href="/"
            className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const { attempt, quiz, answers } = data;
  const tier = getScoreTier(attempt.score, attempt.totalQuestions);

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto px-4 py-8 md:py-12 space-y-8">
      {/* 1. Main Score Certificate Card */}
      <ScoreCard
        score={attempt.score}
        totalQuestions={attempt.totalQuestions}
        percentage={Math.round(attempt.percentage)}
        tier={tier}
        creatorName={quiz.creatorName}
        playerName={attempt.playerName}
      />

      {/* 2. Viral Share Section */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl">
        <ShareButtons
          attemptId={attempt.id}
          shareCode={quiz.shareCode}
          creatorName={quiz.creatorName}
          playerName={attempt.playerName}
          score={attempt.score}
          totalQuestions={attempt.totalQuestions}
        />
      </div>

      {/* 3. The VIRAL LOOP CTA (Section 10 Requirement) */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-violet-900/60 via-pink-950/60 to-purple-900/60 border border-pink-500/40 shadow-2xl overflow-hidden text-center group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-bold mb-3">
            <Flame className="w-3.5 h-3.5" />
            Now It&apos;s Your Turn!
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
            Challenge Your Friends Next! 🔥
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-6">
            Create your own 10-question quiz about yourself in 2 minutes and see what score {quiz.creatorName} gets on YOUR quiz!
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-pink-600 via-violet-600 to-amber-500 hover:from-pink-500 hover:to-violet-500 shadow-xl shadow-pink-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create Your Own Quiz Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 4. Leaderboard & Navigation Actions */}
      {quiz.showLeaderboard && (
        <div className="text-center">
          <Link
            href={`/quiz/${quiz.shareCode}/leaderboard`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs transition-colors"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>View {quiz.creatorName}&apos;s Leaderboard</span>
          </Link>
        </div>
      )}

      {/* 5. Detailed Answers Breakdown */}
      <AnswersBreakdown breakdown={answers} creatorName={quiz.creatorName} />

      {/* 6. Non-intrusive Ad space */}
      <AdBanner slot="result-card" />
    </div>
  );
}
