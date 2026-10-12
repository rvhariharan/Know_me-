import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import {
  Trophy,
  Crown,
  Medal,
  Award,
  ArrowRight,
  PlusCircle,
  Play,
  Lock,
} from "lucide-react";

interface PageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  const quiz = await db.getQuizByCode(code, false);

  if (!quiz) {
    return { title: "Leaderboard – KnowMe" };
  }

  return {
    title: `Who Knows ${quiz.creatorName} Best? 🏆 – Leaderboard`,
    description: `See the top scorers on ${quiz.creatorName}'s KnowMe friendship quiz.`,
  };
}

export default async function LeaderboardPage({ params }: PageProps) {
  const { code } = await params;
  const quiz = await db.getQuizByCode(code, false);

  if (!quiz) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-panel rounded-3xl p-8 border border-white/10 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Quiz Not Found</h2>
          <Link href="/" className="text-sm text-violet-400 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!quiz.showLeaderboard) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-panel rounded-3xl p-8 border border-white/10 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Leaderboard Private</h2>
          <p className="text-sm text-slate-300 mb-6">
            The creator of this quiz has chosen to keep the scores and rankings private.
          </p>
          <Link
            href={`/quiz/${code}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Take This Quiz</span>
          </Link>
        </div>
      </div>
    );
  }

  const entries = await db.getLeaderboard(code, 50);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-extrabold text-sm shadow-md shadow-amber-400/20">
          <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-xl bg-slate-300/20 border border-slate-300/40 text-slate-200 flex items-center justify-center font-extrabold text-sm">
          <Medal className="w-4 h-4 text-slate-300" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-xl bg-amber-700/20 border border-amber-700/40 text-amber-600 flex items-center justify-center font-extrabold text-sm">
          <Award className="w-4 h-4 text-amber-600" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-xl bg-white/5 text-slate-400 flex items-center justify-center font-bold text-xs">
        #{rank}
      </div>
    );
  };

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-3 shadow-lg shadow-amber-500/20">
          <Trophy className="w-7 h-7 text-amber-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Who Knows <span className="text-gradient-primary">{quiz.creatorName}</span> Best?
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Official Friend Leaderboard for &ldquo;{quiz.title}&rdquo;
        </p>
      </div>

      {/* Top Action CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
        <Link
          href={`/quiz/${code}`}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-violet-600 hover:bg-violet-500 flex items-center justify-center gap-2 shadow-md shadow-violet-600/30 transition-all cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Take This Quiz</span>
        </Link>
        <Link
          href="/create"
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5 text-pink-400" />
          <span>Create Your Own Quiz</span>
        </Link>
      </div>

      {/* Leaderboard Table / Card List */}
      <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-white/10 shadow-2xl">
        {entries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm font-semibold text-slate-300">
              No attempts yet!
            </p>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Be the first person to take {quiz.creatorName}&apos;s quiz and claim the #1 spot!
            </p>
            <Link
              href={`/quiz/${code}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold text-xs shadow-md"
            >
              Start Quiz
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  entry.rank === 1
                    ? "bg-amber-500/10 border-amber-500/30 shadow-md shadow-amber-500/5"
                    : "bg-white/[0.03] border-white/5 hover:bg-white/[0.06]"
                }`}
              >
                <div className="flex items-center gap-3">
                  {getRankBadge(entry.rank)}
                  <div>
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                      {entry.playerName}
                      {entry.rank === 1 && <span className="text-xs">👑</span>}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {new Date(entry.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm sm:text-base font-black text-white">
                    {entry.score} / {entry.totalQuestions}
                  </div>
                  <div className="text-[11px] font-bold text-violet-400">
                    {Math.round(entry.percentage)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
