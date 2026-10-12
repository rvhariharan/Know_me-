"use client";

import React, { useState } from "react";
import { X, Sparkles, Plus, Check } from "lucide-react";
import {
  PRESET_CATEGORIES,
  PRESET_QUESTIONS,
  QuestionTemplate,
} from "@/lib/utils/preset-questions";

interface PresetQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuestion: (question: QuestionTemplate) => void;
  existingQuestionsCount: number;
}

export function PresetQuestionsModal({
  isOpen,
  onClose,
  onSelectQuestion,
  existingQuestionsCount,
}: PresetQuestionsModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    PRESET_CATEGORIES[0]
  );
  const [addedTexts, setAddedTexts] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const filteredQuestions = PRESET_QUESTIONS.filter(
    (q) => q.category === selectedCategory
  );

  const handleAdd = (q: QuestionTemplate) => {
    onSelectQuestion(q);
    setAddedTexts((prev) => new Set([...prev, q.questionText]));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#0f1325] border border-white/15 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Question Inspiration Vault</h3>
              <p className="text-xs text-slate-400">
                Pick relatable, hilarious questions to test your friends
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar shrink-0">
          {PRESET_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3 py-2">
          {filteredQuestions.map((q, idx) => {
            const isAdded = addedTexts.has(q.questionText);
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-violet-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1.5">
                  <h4 className="text-sm font-semibold text-slate-100">
                    {q.questionText}
                  </h4>
                  <div className="flex items-center gap-3 pt-1">
                    {q.options.map((opt, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={q.optionImages[i]}
                          alt={opt}
                          className="w-5 h-5 rounded-md object-cover"
                        />
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isAdded || existingQuestionsCount >= 20}
                  onClick={() => handleAdd(q)}
                  className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isAdded
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-violet-600 hover:bg-violet-500 text-white shadow-sm"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Added
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      Add to Quiz
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>{existingQuestionsCount}/20 questions added</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
