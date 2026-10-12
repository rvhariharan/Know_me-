"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Copy,
  Check,
  Eye,
  Trash2,
  Trophy,
  Users,
  TrendingUp,
  Award,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { getQuizUrl, copyToClipboard } from "@/lib/utils/share";

interface StoredQuizRef {
  id: string;
  shareCode: string;
  creatorToken: string;
  title: string;
  createdAt: string;
}

interface QuizDetailedData {
  quiz: {
    id: string;
    title: string;
    creatorName: string;
    shareCode: string;
    showLeaderboard: boolean;
    createdAt: string;
  };
  attemptsCount: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  recentAttempts: {
    id: string;
    playerName: string;
    score: number;
    totalQuestions: number;
    percentage: number;
    createdAt: string;
  }[];
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const urlToken = searchParams.get("token") || "";
  const urlCode = searchParams.get("code") || "";

  const [quizzesList, setQuizzesList] = useState<StoredQuizRef[]>([]);
  const [activeQuizCode, setActiveQuizCode] = useState<string>("");
  const [quizDetails, setQuizDetails] = useState<Record<string, QuizDetailedData>>({});
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Manual token input state
  const [manualCode, setManualCode] = useState("");
  const [manualToken, setManualToken] = useState("");
  const [manualError, setManualError] = useState("");

  // Load quizzes from localStorage or query params
  useEffect(() => {
    try {
      const stored: StoredQuizRef[] = JSON.parse(
        localStorage.getItem("knowme_my_quizzes") || "[]"
      );

      if (urlCode && urlToken) {
        const exists = stored.some(
          (q) => q.shareCode.toLowerCase() === urlCode.toLowerCase()
        );
        if (!exists) {
          stored.unshift({
            id: urlCode,
            shareCode: urlCode,
            creatorToken: urlToken,
            title: `Quiz (${urlCode})`,
            createdAt: new Date().toISOString(),
          });
          localStorage.setItem("knowme_my_quizzes", JSON.stringify(stored));
        }
      }

      setQuizzesList(stored);
      if (stored.length > 0) {
        setActiveQuizCode(stored[0].shareCode);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [urlCode, urlToken]);

  // Fetch detailed stats for active quiz
  useEffect(() => {
    if (!activeQuizCode) return;
    const currentRef = quizzesList.find(
      (q) => q.shareCode.toLowerCase() === activeQuizCode.toLowerCase()
    );
    if (!currentRef) return;

    fetch(`/api/quizzes/${activeQuizCode}/stats?token=${encodeURIComponent(currentRef.creatorToken)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stats) {
          setQuizDetails((prev) => ({
            ...prev,
            [activeQuizCode]: data.stats,
          }));
        }
      })
      .catch((err) => console.error("Error loading stats:", err));
  }, [activeQuizCode, quizzesList]);

  const handleCopy = async (code: string) => {
    const url = getQuizUrl(code);
    const success = await copyToClipboard(url);
    if (success) {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const handleDeleteQuiz = async (code: string, token: string) => {
    if (!confirm("Are you sure you want to delete this quiz? All attempts will be permanently erased.")) {
      return;
    }

    try {
      const res = await fetch(`/api/quizzes/${code}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creatorToken: token }),
      });

      if (res.ok) {
        const updated = quizzesList.filter(
          (q) => q.shareCode.toLowerCase() !== code.toLowerCase()
        );
        setQuizzesList(updated);
        localStorage.setItem("knowme_my_quizzes", JSON.stringify(updated));
        if (activeQuizCode.toLowerCase() === code.toLowerCase()) {
          setActiveQuizCode(updated[0]?.shareCode || "");
        }
      } else {
        alert("Failed to delete quiz.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting quiz.");
    }
  };

  const handleAddManualQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    setManualError("");
    const cleanCode = manualCode.trim().toUpperCase();
    const cleanToken = manualToken.trim();

    if (!cleanCode || !cleanToken) {
      setManualError("Please provide both Quiz Code and Creator Admin Token.");
      return;
    }

    fetch(`/api/quizzes/${cleanCode}/stats?token=${encodeURIComponent(cleanToken)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stats) {
          const item: StoredQuizRef = {
            id: data.stats.quiz.id,
            shareCode: data.stats.quiz.shareCode,
            creatorToken: cleanToken,
            title: data.stats.quiz.title,
            createdAt: data.stats.quiz.createdAt,
          };
          const updated = [item, ...quizzesList.filter((q) => q.shareCode !== cleanCode)];
          setQuizzesList(updated);
          localStorage.setItem("knowme_my_quizzes", JSON.stringify(updated));
          setActiveQuizCode(cleanCode);
          setQuizDetails((prev) => ({ ...prev, [cleanCode]: data.stats }));
          setManualCode("");
          setManualToken("");
        } else {
          setManualError("Invalid code or admin token.");
        }
      })
      .catch(() => setManualError("Failed to verify quiz."));
  };

  const currentStats = activeQuizCode ? quizDetails[activeQuizCode] : null;

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-xs font-semibold text-violet-300 mb-2">
            <LayoutDashboard className="w-3.5 h-3.5 text-pink-400" />
            Creator Hub
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            My Quizzes & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Track who took your quiz, average scores, and individual friend answers.
          </p>
        </div>

        <Link
          href="/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 shadow-md shadow-pink-600/20 transition-all cursor-pointer hover:scale-105 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Quiz</span>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading your quizzes...</div>
      ) : quizzesList.length === 0 ? (
        <div className="glass-panel rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto border border-white/10 shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-amber-300" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Quizzes Found Yet</h2>
          <p className="text-sm text-slate-300 mb-6">
            You haven&apos;t created any quizzes on this device yet. Create one now or connect an existing quiz with your Admin Token!
          </p>
          <div className="space-y-4">
            <Link
              href="/create"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 shadow-lg shadow-pink-600/25"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Your First Quiz</span>
            </Link>

            <div className="pt-4 border-t border-white/10 text-left">
              <span className="text-xs font-semibold text-slate-400 block mb-2">
                Already have a quiz code & token from another device?
              </span>
              <form onSubmit={handleAddManualQuiz} className="space-y-2">
                <input
                  type="text"
                  placeholder="Quiz Code (e.g. 7XbK9Q)"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-lg text-white"
                />
                <input
                  type="text"
                  placeholder="Creator Admin Token (e.g. cr_...)"
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-lg text-white"
                />
                {manualError && (
                  <p className="text-xs text-rose-400">{manualError}</p>
                )}
                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-bold text-white"
                >
                  Connect Quiz
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Quiz Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {quizzesList.map((q) => {
              const isActive = q.shareCode.toLowerCase() === activeQuizCode.toLowerCase();
              return (
                <button
                  key={q.shareCode}
                  type="button"
                  onClick={() => setActiveQuizCode(q.shareCode)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-lg shadow-pink-600/20 scale-[1.02]"
                      : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{q.title || `Quiz ${q.shareCode}`}</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/30">
                    {q.shareCode}
                  </span>
                </button>
              );
            })}
          </div>

          {currentStats ? (
            <div className="space-y-6">
              {/* Top Controls */}
              <div className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white">
                    {currentStats.quiz.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Share Code: <span className="font-mono text-violet-300 font-bold">{currentStats.quiz.shareCode}</span> • Created on {new Date(currentStats.quiz.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(currentStats.quiz.shareCode)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedCode === currentStats.quiz.shareCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Share Link</span>
                      </>
                    )}
                  </button>

                  <Link
                    href={`/quiz/${currentStats.quiz.shareCode}`}
                    target="_blank"
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/15 flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Quiz</span>
                  </Link>

                  <Link
                    href={`/quiz/${currentStats.quiz.shareCode}/leaderboard`}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400/20 flex items-center gap-1.5 transition-colors"
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Leaderboard</span>
                  </Link>

                  {(() => {
                    const ref = quizzesList.find(
                      (q) => q.shareCode.toLowerCase() === currentStats.quiz.shareCode.toLowerCase()
                    );
                    return ref ? (
                      <button
                        type="button"
                        onClick={() => handleDeleteQuiz(ref.shareCode, ref.creatorToken)}
                        className="p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                        title="Delete Quiz"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : null;
                  })()}
                </div>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card rounded-2xl p-5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Total Attempts
                    </span>
                    <Users className="w-4 h-4 text-violet-400" />
                  </div>
                  <div className="text-3xl font-black text-white">
                    {currentStats.attemptsCount}
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Average Score
                    </span>
                    <TrendingUp className="w-4 h-4 text-pink-400" />
                  </div>
                  <div className="text-3xl font-black text-white">
                    {currentStats.averageScore}
                    <span className="text-base text-slate-400 font-normal"> / 10</span>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Highest Score
                    </span>
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-3xl font-black text-white">
                    {currentStats.highestScore}
                    <span className="text-base text-slate-400 font-normal"> pts</span>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Lowest Score
                    </span>
                    <span className="text-base">💀</span>
                  </div>
                  <div className="text-3xl font-black text-white">
                    {currentStats.lowestScore}
                    <span className="text-base text-slate-400 font-normal"> pts</span>
                  </div>
                </div>
              </div>

              {/* Attempts Table */}
              <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4">
                  Recent Submissions ({currentStats.recentAttempts.length})
                </h3>

                {currentStats.recentAttempts.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    No friends have taken this quiz yet. Send your link on WhatsApp!
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider">
                          <th className="pb-3 font-bold">Player Name</th>
                          <th className="pb-3 font-bold">Score</th>
                          <th className="pb-3 font-bold">Accuracy</th>
                          <th className="pb-3 font-bold">Date & Time</th>
                          <th className="pb-3 font-bold text-right">Certificate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {currentStats.recentAttempts.map((attempt) => (
                          <tr key={attempt.id} className="hover:bg-white/[0.02]">
                            <td className="py-3 font-bold text-white">
                              {attempt.playerName}
                            </td>
                            <td className="py-3 font-mono text-violet-300 font-bold">
                              {attempt.score} / {attempt.totalQuestions}
                            </td>
                            <td className="py-3 font-semibold text-pink-300">
                              {Math.round(attempt.percentage)}%
                            </td>
                            <td className="py-3 text-slate-400">
                              {new Date(attempt.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td className="py-3 text-right">
                              <Link
                                href={`/result/${attempt.id}`}
                                target="_blank"
                                className="inline-flex items-center gap-1 text-violet-400 hover:text-violet-300 font-semibold"
                              >
                                <span>View</span>
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              Loading quiz statistics...
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-400">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
