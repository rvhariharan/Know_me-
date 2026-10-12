"use client";

import React, { useState } from "react";
import { Trash2, ChevronUp, ChevronDown, CheckCircle2, Image as ImageIcon, Sparkles } from "lucide-react";

export interface QuestionFormData {
  id?: string;
  questionText: string;
  option1: string;
  option2: string;
  option1Image?: string;
  option2Image?: string;
  option3?: string;
  option4?: string;
  correctOption: 1 | 2;
}

const AVAILABLE_IMAGES = [
  { label: "Pizza", src: "/options/pizza.svg" },
  { label: "Burger", src: "/options/burger.svg" },
  { label: "Coffee", src: "/options/coffee.svg" },
  { label: "Boba", src: "/options/boba.svg" },
  { label: "Cat", src: "/options/cat.svg" },
  { label: "Dog", src: "/options/dog.svg" },
  { label: "Beach", src: "/options/beach.svg" },
  { label: "Mountain", src: "/options/mountain.svg" },
  { label: "Stay In", src: "/options/home.svg" },
  { label: "Party", src: "/options/party.svg" },
  { label: "Dessert", src: "/options/sweet.svg" },
  { label: "Spicy", src: "/options/spicy.svg" },
  { label: "Sunrise", src: "/options/morning.svg" },
  { label: "Night Owl", src: "/options/night.svg" },
  { label: "Gaming", src: "/options/gaming.svg" },
  { label: "Movies", src: "/options/movies.svg" },
  { label: "Cuddle", src: "/options/cuddle.svg" },
  { label: "Road Trip", src: "/options/roadtrip.svg" },
  { label: "Love Cats", src: "/cats/love_cats_couple.jpg" },
  { label: "Cuddle Cats", src: "/cats/love_cats_cuddle.jpg" },
  { label: "Cat GIF", src: "/cats/couple_cats.gif" },
];

interface QuestionEditorProps {
  question: QuestionFormData;
  index: number;
  totalQuestions: number;
  onChange: (updated: QuestionFormData) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canDelete: boolean;
}

export function QuestionEditor({
  question,
  index,
  totalQuestions,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  canDelete,
}: QuestionEditorProps) {
  const [activeImagePicker, setActiveImagePicker] = useState<1 | 2 | null>(null);

  const opt1Img = question.option1Image || "/options/pizza.svg";
  const opt2Img = question.option2Image || "/options/burger.svg";

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-6 transition-all border border-white/10 hover:border-pink-500/40 relative shadow-xl">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white font-black text-sm flex items-center justify-center shadow-md">
            #{index + 1}
          </span>
          <span className="text-xs uppercase tracking-wider font-bold text-slate-300">
            2-Choice Battle
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={index === 0}
            onClick={onMoveUp}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
            title="Move Up"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={index === totalQuestions - 1}
            onClick={onMoveDown}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
            title="Move Down"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={!canDelete}
            onClick={onDelete}
            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 disabled:opacity-30 disabled:hover:bg-transparent ml-1"
            title={canDelete ? "Delete Question" : "Minimum 5 questions required"}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Question Text */}
      <div className="mb-5">
        <input
          type="text"
          value={question.questionText}
          onChange={(e) =>
            onChange({ ...question, questionText: e.target.value })
          }
          placeholder="e.g. Pizza or Burger: Which do I love more?"
          maxLength={120}
          className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 text-base font-bold transition-colors"
        />
      </div>

      {/* 2 Pinterest-style Option Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* OPTION 1 */}
        <div
          onClick={() => onChange({ ...question, correctOption: 1 })}
          className={`rounded-2xl p-4 border transition-all cursor-pointer relative flex flex-col justify-between ${
            question.correctOption === 1
              ? "bg-gradient-to-b from-emerald-500/20 to-emerald-950/30 border-emerald-400 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/40"
              : "bg-white/[0.03] border-white/10 hover:border-white/20"
          }`}
        >
          {/* Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white">
              Option A
            </span>
            {question.correctOption === 1 && (
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> My True Pick
              </span>
            )}
          </div>

          {/* Pinterest Image Preview */}
          <div className="relative aspect-square w-full max-w-[160px] mx-auto rounded-2xl overflow-hidden mb-3 border border-white/10 bg-black/40 shadow-inner group/img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={opt1Img}
              alt="Option 1"
              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveImagePicker(activeImagePicker === 1 ? null : 1);
              }}
              className="absolute bottom-2 right-2 p-1.5 rounded-xl bg-black/70 hover:bg-black text-white text-xs flex items-center gap-1 backdrop-blur-md border border-white/20"
              title="Change Picture"
            >
              <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
            </button>
          </div>

          {/* Image Picker Dropdown */}
          {activeImagePicker === 1 && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="mb-3 p-2.5 rounded-xl bg-black/80 border border-white/20 max-h-40 overflow-y-auto grid grid-cols-4 gap-1.5"
            >
              {AVAILABLE_IMAGES.map((img) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => {
                    onChange({ ...question, option1Image: img.src });
                    setActiveImagePicker(null);
                  }}
                  className={`p-1 rounded-lg border flex flex-col items-center gap-1 hover:border-pink-500 transition-colors ${
                    opt1Img === img.src ? "border-pink-500 bg-pink-500/20" : "border-white/10 bg-white/5"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt={img.label} className="w-8 h-8 rounded object-cover" />
                  <span className="text-[10px] text-slate-300 truncate w-full text-center">{img.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Label Input */}
          <input
            type="text"
            value={question.option1}
            onChange={(e) =>
              onChange({ ...question, option1: e.target.value })
            }
            onClick={(e) => e.stopPropagation()}
            placeholder="Option A label"
            maxLength={60}
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white font-bold text-sm text-center placeholder-slate-500 focus:outline-none focus:border-pink-500 mb-2"
          />

          {/* Pick Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange({ ...question, correctOption: 1 });
            }}
            className={`w-full py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
              question.correctOption === 1
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30"
                : "bg-white/10 text-slate-300 hover:bg-white/20"
            }`}
          >
            {question.correctOption === 1 ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> This is me!
              </>
            ) : (
              "Tap if this is you"
            )}
          </button>
        </div>

        {/* OPTION 2 */}
        <div
          onClick={() => onChange({ ...question, correctOption: 2 })}
          className={`rounded-2xl p-4 border transition-all cursor-pointer relative flex flex-col justify-between ${
            question.correctOption === 2
              ? "bg-gradient-to-b from-emerald-500/20 to-emerald-950/30 border-emerald-400 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/40"
              : "bg-white/[0.03] border-white/10 hover:border-white/20"
          }`}
        >
          {/* Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white">
              Option B
            </span>
            {question.correctOption === 2 && (
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> My True Pick
              </span>
            )}
          </div>

          {/* Pinterest Image Preview */}
          <div className="relative aspect-square w-full max-w-[160px] mx-auto rounded-2xl overflow-hidden mb-3 border border-white/10 bg-black/40 shadow-inner group/img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={opt2Img}
              alt="Option 2"
              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveImagePicker(activeImagePicker === 2 ? null : 2);
              }}
              className="absolute bottom-2 right-2 p-1.5 rounded-xl bg-black/70 hover:bg-black text-white text-xs flex items-center gap-1 backdrop-blur-md border border-white/20"
              title="Change Picture"
            >
              <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
            </button>
          </div>

          {/* Image Picker Dropdown */}
          {activeImagePicker === 2 && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="mb-3 p-2.5 rounded-xl bg-black/80 border border-white/20 max-h-40 overflow-y-auto grid grid-cols-4 gap-1.5"
            >
              {AVAILABLE_IMAGES.map((img) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => {
                    onChange({ ...question, option2Image: img.src });
                    setActiveImagePicker(null);
                  }}
                  className={`p-1 rounded-lg border flex flex-col items-center gap-1 hover:border-pink-500 transition-colors ${
                    opt2Img === img.src ? "border-pink-500 bg-pink-500/20" : "border-white/10 bg-white/5"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt={img.label} className="w-8 h-8 rounded object-cover" />
                  <span className="text-[10px] text-slate-300 truncate w-full text-center">{img.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Label Input */}
          <input
            type="text"
            value={question.option2}
            onChange={(e) =>
              onChange({ ...question, option2: e.target.value })
            }
            onClick={(e) => e.stopPropagation()}
            placeholder="Option B label"
            maxLength={60}
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white font-bold text-sm text-center placeholder-slate-500 focus:outline-none focus:border-pink-500 mb-2"
          />

          {/* Pick Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange({ ...question, correctOption: 2 });
            }}
            className={`w-full py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
              question.correctOption === 2
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30"
                : "bg-white/10 text-slate-300 hover:bg-white/20"
            }`}
          >
            {question.correctOption === 2 ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> This is me!
              </>
            ) : (
              "Tap if this is you"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
