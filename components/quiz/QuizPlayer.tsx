"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Sparkles,
  User,
  ShieldCheck,
  Heart,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { LoveCatAnimation } from "@/components/ui/LoveCatAnimation";

interface PlayerQuestion {
  id: string;
  questionText: string;
  option1: string;
  option2: string;
  option1Image?: string;
  option2Image?: string;
  option3?: string;
  option4?: string;
  questionOrder: number;
}

interface QuizPlayerProps {
  quiz: {
    id: string;
    creatorName: string;
    title: string;
    description?: string;
    shareCode: string;
    showLeaderboard: boolean;
    questions: PlayerQuestion[];
  };
}

export function QuizPlayer({ quiz }: QuizPlayerProps) {
  const router = useRouter();
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 1 | 2>>({});
  const [playerName, setPlayerName] = useState("");
  const [isSubmittingModalOpen, setIsSubmittingModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [heartBurst, setHeartBurst] = useState<number | null>(null);

  const storageKey = `knowme_answers_${quiz.shareCode}`;
  const nameStorageKey = `knowme_player_name`;

  useEffect(() => {
    trackEvent("quiz_opened", { shareCode: quiz.shareCode, creator: quiz.creatorName });
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setAnswers(parsed);
        if (Object.keys(parsed).length > 0) {
          setHasStarted(true);
        }
      }
      const savedName = localStorage.getItem(nameStorageKey);
      if (savedName) {
        setPlayerName(savedName);
      }
    } catch {
      // non-critical
    }
  }, [quiz.shareCode, quiz.creatorName, storageKey, nameStorageKey]);

  const currentQuestion = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const selectedOption = answers[currentQuestion.id];

  const handleSelectOption = (optionNum: 1 | 2) => {
    const updated = { ...answers, [currentQuestion.id]: optionNum };
    setAnswers(updated);
    setHeartBurst(Date.now());

    try {
      sessionStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Auto-advance to next question smoothly after short delay for awesome mobile feel
    if (currentIndex < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
      }, 350);
    } else {
      // Last question selected, prompt submit modal
      setTimeout(() => {
        setIsSubmittingModalOpen(true);
      }, 450);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsSubmittingModalOpen(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const answeredCount = Object.keys(answers).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = playerName.trim();
    if (!cleanName) {
      setErrorMsg("Please enter your name!");
      return;
    }

    if (cleanName.length > 40) {
      setErrorMsg("Name is too long (max 40 chars).");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      localStorage.setItem(nameStorageKey, cleanName);

      // Build payload
      const formattedAnswers = quiz.questions.map((q) => ({
        questionId: q.id,
        selectedOption: answers[q.id] || (1 as const),
      }));

      const res = await fetch(`/api/quizzes/${quiz.shareCode}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName: cleanName,
          answers: formattedAnswers,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      try {
        sessionStorage.removeItem(storageKey);
      } catch {}

      trackEvent("quiz_completed", {
        shareCode: quiz.shareCode,
        score: data.score,
        total: data.totalQuestions,
      });

      router.push(`/result/${data.attemptId}`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || "Failed to submit quiz. Please try again.");
      setIsSubmitting(false);
    }
  };

  // 1. CUTE REFERENCE WELCOME SCREEN (IMAGE 2 INSPIRATION)
  if (!hasStarted) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-8 sm:py-12 select-none text-center animate-in fade-in duration-300">
        {/* Floating Clouds & Sparkles Background Atmosphere */}
        <div className="relative mb-6">
          {/* Speech Bubble */}
          <div className="relative inline-block mb-3 animate-bounce duration-1000">
            <div className="px-5 py-2.5 rounded-3xl bg-white text-slate-800 font-extrabold text-xs sm:text-sm shadow-xl border border-pink-200/60 flex items-center gap-1.5">
              <span>i will find & block my fake friends</span>
              <span className="text-pink-500 text-base">😂</span>
            </div>
            {/* Bubble Tail */}
            <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[9px] border-t-white mx-auto -mt-[1px]" />
          </div>

          {/* Cute Couple Cat GIF Mascot sitting on notebook */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto -mb-6 z-20 hover:scale-105 transition-transform duration-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cats/couple_cats.gif"
              alt="Couple Cats GIF"
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>

          {/* Taped Notebook Paper Card (Reference Style) */}
          <div className="relative bg-[#ffffff] text-slate-900 rounded-[32px] p-7 pt-12 shadow-2xl border-2 border-pink-100/80 max-w-sm mx-auto overflow-hidden">
            {/* Washi Tape sticker at top left */}
            <div className="absolute top-3 left-6 w-24 h-6 bg-pink-300/80 -rotate-6 rounded-sm shadow-sm backdrop-blur-sm pointer-events-none" />

            {/* Notebook Subtle Details */}
            <div className="text-center space-y-1.5 pt-2">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
                will <span className="text-sky-500">{quiz.creatorName}</span>
              </h2>
              <div className="relative inline-block">
                <h3 className="text-3xl sm:text-4xl font-black text-pink-500 tracking-tight leading-tight">
                  block you?
                </h3>
                {/* Cute yellow scribble highlight */}
                <div className="h-2 w-full bg-amber-300/80 rounded-full -mt-1" />
              </div>

              <p className="text-xs sm:text-sm font-extrabold text-slate-500 pt-3">
                let&apos;s see how well you know {quiz.creatorName}
              </p>
            </div>

            {/* Cute doodles and stickers */}
            <div className="absolute bottom-3 left-4 text-xl">🌸</div>
            <div className="absolute bottom-3 right-4 text-xl">⭐</div>
            <div className="absolute top-10 right-4 text-lg">💙</div>
            <div className="absolute top-14 left-4 text-base">✨</div>
          </div>

          {/* Big Friendly Rounded Pill Button */}
          <div className="mt-7 max-w-sm mx-auto">
            <button
              type="button"
              onClick={() => setHasStarted(true)}
              className="w-full py-4 px-8 rounded-full bg-sky-500 hover:bg-sky-400 active:scale-95 text-white font-black text-lg sm:text-xl flex items-center justify-center gap-3 shadow-xl shadow-sky-500/30 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <span>start quiz</span>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. 2-OPTION VISUAL QUIZ QUESTIONS
  const opt1Img = currentQuestion.option1Image || "/options/pizza.svg";
  const opt2Img = currentQuestion.option2Image || "/options/burger.svg";

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 select-none animate-in fade-in duration-200">
      {/* Top Cute Love Cat Mascot */}
      <div className="text-center mb-6">
        <LoveCatAnimation
          variant="compact"
          speechText={`What would ${quiz.creatorName} pick? Tap their real vibe! 💕`}
        />
      </div>

      {/* Progress Header */}
      <div className="glass-panel rounded-2xl p-4 mb-6 shadow-xl">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
          <span className="text-pink-300 flex items-center gap-1.5">
            <span>🐾 Round #{currentIndex + 1} of {totalQuestions}</span>
          </span>
          <span className="text-slate-400">{answeredCount}/{totalQuestions} Answered</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden p-0.5 border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card with Pinterest Aesthetic */}
      <div className="glass-card rounded-3xl p-5 sm:p-8 border border-white/15 shadow-2xl relative overflow-hidden">
        {/* Floating Heart Burst Effect on selection */}
        {heartBurst && (
          <div
            key={heartBurst}
            className="absolute inset-0 pointer-events-none flex items-center justify-center z-30"
          >
            <span className="text-5xl animate-ping opacity-75">💖</span>
          </div>
        )}

        {/* Question Header */}
        <div className="text-center mb-6">
          <span className="inline-block text-[11px] font-black uppercase tracking-widest text-pink-400 mb-1">
            This or That Battle
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
            {currentQuestion.questionText}
          </h2>
        </div>

        {/* 2 Big Pinterest-style Option Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-6">
          {/* OPTION 1 */}
          <div
            onClick={() => handleSelectOption(1)}
            className={`group rounded-3xl p-3 sm:p-4 border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
              selectedOption === 1
                ? "bg-gradient-to-b from-pink-500/25 to-purple-900/40 border-pink-400 shadow-xl shadow-pink-500/25 scale-[1.02] ring-2 ring-pink-400"
                : "bg-white/[0.04] border-white/10 hover:border-pink-400/50 hover:bg-white/[0.07]"
            }`}
          >
            {/* Pinterest Pin Badge */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10">
                A
              </span>
              {selectedOption === 1 && (
                <span className="text-xs font-bold text-pink-300 flex items-center gap-1 bg-pink-500/30 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Picked
                </span>
              )}
            </div>

            {/* Pinterest Image Container */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-3 border border-white/10 bg-black/40 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={opt1Img}
                alt={currentQuestion.option1}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Title / Label */}
            <div className="text-center pt-1">
              <h3 className="font-extrabold text-sm sm:text-base text-white leading-snug">
                {currentQuestion.option1}
              </h3>
            </div>
          </div>

          {/* OPTION 2 */}
          <div
            onClick={() => handleSelectOption(2)}
            className={`group rounded-3xl p-3 sm:p-4 border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
              selectedOption === 2
                ? "bg-gradient-to-b from-pink-500/25 to-purple-900/40 border-pink-400 shadow-xl shadow-pink-500/25 scale-[1.02] ring-2 ring-pink-400"
                : "bg-white/[0.04] border-white/10 hover:border-pink-400/50 hover:bg-white/[0.07]"
            }`}
          >
            {/* Pinterest Pin Badge */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10">
                B
              </span>
              {selectedOption === 2 && (
                <span className="text-xs font-bold text-pink-300 flex items-center gap-1 bg-pink-500/30 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Picked
                </span>
              )}
            </div>

            {/* Pinterest Image Container */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-3 border border-white/10 bg-black/40 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={opt2Img}
                alt={currentQuestion.option2}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Title / Label */}
            <div className="text-center pt-1">
              <h3 className="font-extrabold text-sm sm:text-base text-white leading-snug">
                {currentQuestion.option2}
              </h3>
            </div>
          </div>
        </div>

        {/* Bottom Nav Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {currentIndex === totalQuestions - 1 ? (
            <button
              type="button"
              onClick={() => setIsSubmittingModalOpen(true)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-md shadow-pink-600/30 flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-all"
            >
              Finish & Reveal
              <Send className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-pink-600 hover:bg-pink-500 flex items-center gap-1.5 shadow-md shadow-pink-600/30 cursor-pointer hover:scale-105 transition-all"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Answer Persistence Indicator */}
      <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        Choices auto-saved. Anti-cheat server verified.
      </div>

      {/* Submission Modal */}
      {isSubmittingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#160f24] border border-pink-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
            {/* Modal Cute Mascot */}
            <div className="text-center mb-5">
              <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden border border-pink-400/40 shadow-lg shadow-pink-500/20 mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/cats/couple_cats.gif"
                  alt="Couple Cats GIF"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-black text-white">All Answers Locked!</h3>
              <p className="text-xs text-pink-300 mt-1 font-medium">
                Enter your name to unlock your Friendship Certificate with <span className="font-bold text-white">{quiz.creatorName}</span>
              </p>
            </div>

            {answeredCount < totalQuestions && (
              <div className="p-3 mb-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span>
                  You answered {answeredCount} of {totalQuestions} questions. You can still submit now!
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Your Name / Nickname
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => {
                      setPlayerName(e.target.value);
                      setErrorMsg("");
                    }}
                    placeholder="e.g. Priya, Alex, Kumar..."
                    autoFocus
                    maxLength={40}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 text-sm font-semibold"
                  />
                </div>
                {errorMsg && (
                  <p className="text-xs text-rose-400 mt-1.5">{errorMsg}</p>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmittingModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10"
                >
                  Review
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Calculating Score...</span>
                  ) : (
                    <>
                      <span>Reveal Score!</span>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
