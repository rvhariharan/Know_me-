"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react";

interface BreakdownItem {
  questionId: string;
  questionText: string;
  options: [string, string, string?, string?];
  optionImages?: [string?, string?];
  selectedOption: 1 | 2 | 3 | 4;
  correctOption: 1 | 2 | 3 | 4;
  isCorrect: boolean;
}

interface AnswersBreakdownProps {
  breakdown: BreakdownItem[];
  creatorName: string;
}

export function AnswersBreakdown({ breakdown, creatorName }: AnswersBreakdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const letters = ["A", "B", "C", "D"];

  return (
    <div className="w-full glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 shadow-xl">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 text-left cursor-pointer"
      >
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            Detailed Answers Breakdown
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
              {breakdown.filter((b) => b.isCorrect).length}/{breakdown.length} Correct
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            See where you and {creatorName} agreed or disagreed!
          </p>
        </div>
        <div className="p-2 rounded-xl bg-white/5 text-slate-300">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="mt-5 space-y-4 pt-4 border-t border-white/10 animate-in fade-in duration-200">
          {breakdown.map((item, idx) => {
            const yourOptionText = item.options[item.selectedOption - 1] || "";
            const correctOptionText = item.options[item.correctOption - 1] || "";

            return (
              <div
                key={item.questionId || idx}
                className={`p-4 rounded-2xl border transition-all ${
                  item.isCorrect
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-rose-500/10 border-rose-500/30"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-semibold text-white">
                    {idx + 1}. {item.questionText}
                  </h4>
                  {item.isCorrect ? (
                    <span className="shrink-0 flex items-center gap-1 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Correct
                    </span>
                  ) : (
                    <span className="shrink-0 flex items-center gap-1 text-xs font-bold text-rose-400">
                      <XCircle className="w-4 h-4" /> Wrong
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="font-semibold text-slate-400">You picked:</span>
                    <span
                      className={`font-medium ${
                        item.isCorrect ? "text-emerald-300" : "text-rose-300 line-through"
                      }`}
                    >
                      ({letters[item.selectedOption - 1]}) {yourOptionText}
                    </span>
                  </div>

                  {!item.isCorrect && (
                    <div className="flex items-center gap-1.5 text-emerald-300">
                      <span className="font-semibold text-slate-400">
                        {creatorName}&apos;s real answer:
                      </span>
                      <span className="font-bold">
                        ({letters[item.correctOption - 1]}) {correctOptionText}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
