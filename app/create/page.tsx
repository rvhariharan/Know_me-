"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Plus,
  ArrowRight,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Trophy,
} from "lucide-react";
import {
  QuestionFormData,
  QuestionEditor,
} from "@/components/quiz/QuestionEditor";
import { PresetQuestionsModal } from "@/components/quiz/PresetQuestionsModal";
import { DEFAULT_INITIAL_QUESTIONS, QuestionTemplate } from "@/lib/utils/preset-questions";
import { trackEvent } from "@/lib/analytics";

export default function CreateQuizPage() {
  const router = useRouter();

  const [creatorName, setCreatorName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showLeaderboard, setShowLeaderboard] = useState(true);

  // Initialize with 10 fun preset questions (2 options each with images)
  const [questions, setQuestions] = useState<QuestionFormData[]>(
    DEFAULT_INITIAL_QUESTIONS.map((q) => ({
      questionText: q.questionText,
      option1: q.options[0],
      option2: q.options[1],
      option1Image: q.optionImages[0],
      option2Image: q.optionImages[1],
      correctOption: q.defaultCorrectOption,
    }))
  );

  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Auto-fill default title when creator name changes if title hasn't been heavily customized
  const handleNameChange = (name: string) => {
    setCreatorName(name);
    if (!title || title.startsWith("How Well Do You Know")) {
      setTitle(name.trim() ? `How Well Do You Know ${name.trim()}?` : "");
    }
  };

  const handleAddCustomQuestion = () => {
    if (questions.length >= 20) return;
    setQuestions((prev) => [
      ...prev,
      {
        questionText: "",
        option1: "Choice A",
        option2: "Choice B",
        option1Image: "/options/pizza.svg",
        option2Image: "/options/burger.svg",
        correctOption: 1,
      },
    ]);
  };

  const handleAddPresetQuestion = (template: QuestionTemplate) => {
    if (questions.length >= 20) return;
    setQuestions((prev) => [
      ...prev,
      {
        questionText: template.questionText,
        option1: template.options[0],
        option2: template.options[1],
        option1Image: template.optionImages[0],
        option2Image: template.optionImages[1],
        correctOption: template.defaultCorrectOption,
      },
    ]);
  };

  const handleDeleteQuestion = (index: number) => {
    if (questions.length <= 5) return;
    setQuestions((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setQuestions((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === questions.length - 1) return;
    setQuestions((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleQuestionChange = (index: number, updated: QuestionFormData) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[index] = updated;
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const cleanCreator = creatorName.trim();
    if (!cleanCreator) {
      setErrorMessage("Please enter your name.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const cleanTitle = title.trim() || `How Well Do You Know ${cleanCreator}?`;

    // Validate questions
    if (questions.length < 5) {
      setErrorMessage("Please include at least 5 questions.");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        setErrorMessage(`Question #${i + 1} text is empty.`);
        return;
      }
      if (!q.option1.trim() || !q.option2.trim()) {
        setErrorMessage(`Both options must be filled for Question #${i + 1}.`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorName: cleanCreator,
          title: cleanTitle,
          description: description.trim(),
          showLeaderboard,
          questions,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create quiz.");
      }

      // Save creator token to localStorage so user can access dashboard without account
      try {
        const stored = JSON.parse(localStorage.getItem("knowme_my_quizzes") || "[]");
        stored.unshift({
          id: data.quizId,
          shareCode: data.shareCode,
          creatorToken: data.creatorToken,
          title: cleanTitle,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem("knowme_my_quizzes", JSON.stringify(stored));
      } catch {}

      trackEvent("quiz_created", { shareCode: data.shareCode });

      // Redirect to the share celebration screen
      router.push(`/quiz/${data.shareCode}/share?token=${data.creatorToken}`);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || "An error occurred while creating your quiz.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Page Title */}
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Create Your Personal Quiz
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
          Pick your answers honestly! Your friends will guess your true vibe.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Creator Info Card - Clean & Minimal */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-pink-500/25 shadow-xl relative overflow-hidden">
          {/* Cute Cat Mascot header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-pink-400/40 bg-black/40 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/cats/couple_cats.gif"
                alt="Couple Cats"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">1. Who is this quiz about?</h2>
              <p className="text-xs text-pink-300 font-medium">Enter your name so your friends know who they&apos;re playing with!</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Your Name <span className="text-pink-400">*</span>
              </label>
              <input
                type="text"
                value={creatorName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Hari, Priya, Alex"
                maxLength={40}
                required
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-600 focus:outline-none focus:border-pink-500 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Quiz Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How Well Do You Know Hari?"
                maxLength={80}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-600 focus:outline-none focus:border-pink-500 text-sm font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Questions Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <span>2. Your Questions</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-violet-600/30 text-violet-300 border border-violet-500/30">
                {questions.length} / 20
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Minimum 5 questions. Make sure to tap your true answer!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPresetModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400/20 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Question Ideas Vault
            </button>

            <button
              type="button"
              disabled={questions.length >= 20}
              onClick={handleAddCustomQuestion}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-40 flex items-center gap-1.5 shadow-md shadow-violet-600/25 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Blank Question
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <QuestionEditor
              key={idx}
              index={idx}
              question={q}
              totalQuestions={questions.length}
              canDelete={questions.length > 5}
              onChange={(updated) => handleQuestionChange(idx, updated)}
              onDelete={() => handleDeleteQuestion(idx)}
              onMoveUp={() => handleMoveUp(idx)}
              onMoveDown={() => handleMoveDown(idx)}
            />
          ))}
        </div>

        {/* Bottom CTA Bar */}
        <div className="glass-panel sticky bottom-4 z-30 rounded-2xl p-4 border border-white/15 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            <span className="font-bold text-white">{questions.length} Questions</span> ready.
            Click below to generate your shareable link!
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 hover:from-violet-500 hover:via-pink-500 hover:to-amber-400 shadow-xl shadow-pink-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-105 active:scale-95 transition-all"
          >
            {isSubmitting ? (
              <span>Building Your Quiz...</span>
            ) : (
              <>
                <span>Create Quiz & Get Share Link</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preset Modal */}
      <PresetQuestionsModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        onSelectQuestion={handleAddPresetQuestion}
        existingQuestionsCount={questions.length}
      />
    </div>
  );
}
