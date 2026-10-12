"use client";

import React, { useState } from "react";
import { Heart, Sparkles } from "lucide-react";

interface LoveCatAnimationProps {
  variant?: "hero" | "compact" | "banner";
  speechText?: string;
}

export function LoveCatAnimation({
  variant = "compact",
  speechText,
}: LoveCatAnimationProps) {
  const [isLoved, setIsLoved] = useState(false);
  const [heartBurst, setHeartBurst] = useState<number[]>([]);

  const handlePet = () => {
    setIsLoved(true);
    setHeartBurst((prev) => [...prev, Date.now()]);
    setTimeout(() => setIsLoved(false), 800);
  };

  if (variant === "hero") {
    return (
      <div className="relative inline-block mx-auto group select-none">
        {/* Ambient neon heart glow */}
        <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/30 via-rose-500/20 to-purple-500/30 rounded-3xl blur-2xl animate-pulse pointer-events-none" />

        {/* Video / Animation Frame (Pinterest Pin ratio 3:4 style) */}
        <div
          onClick={handlePet}
          className={`relative w-72 sm:w-80 rounded-3xl overflow-hidden border-2 border-pink-400/40 bg-gradient-to-b from-[#2a132e] via-[#1a0f24] to-[#0d0716] shadow-2xl transition-transform duration-300 cursor-pointer ${
            isLoved ? "scale-105" : "hover:scale-[1.02]"
          }`}
        >
          {/* Top Live Badge */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-bold text-pink-300 shadow">
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
            Love Cat Animation
          </div>

          <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            Tap to Pet!
          </div>

          {/* Floating animated hearts */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            <div className="absolute bottom-6 left-8 text-pink-400 animate-bounce duration-1000 opacity-80 text-xl">
              💖
            </div>
            <div className="absolute bottom-16 right-10 text-rose-400 animate-pulse duration-700 opacity-75 text-lg">
              ✨
            </div>
            <div className="absolute top-14 left-10 text-pink-300 animate-bounce duration-1000 delay-300 opacity-70 text-base">
              🐾
            </div>
            <div className="absolute top-20 right-8 text-rose-300 animate-bounce duration-1000 delay-500 opacity-70 text-lg">
              💕
            </div>

            {heartBurst.map((id) => (
              <span
                key={id}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl animate-ping"
              >
                💖
              </span>
            ))}
          </div>

          {/* User's Uploaded Love Cat Image */}
          <div className="relative aspect-square w-full overflow-hidden flex items-center justify-center p-3 pt-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cats/love_cats_couple.jpg"
              alt="Love Cats"
              className="w-full h-full object-contain rounded-2xl drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Bottom Card Caption */}
          <div className="p-4 text-center border-t border-white/10 bg-black/40 backdrop-blur-md">
            <p className="text-sm font-black text-pink-200 tracking-tight flex items-center justify-center gap-1.5">
              <span>Bestie Match Radar</span>
              <Heart className="w-4 h-4 fill-pink-500 text-pink-500 animate-pulse" />
            </p>
            <p className="text-[11px] text-pink-300/80 mt-0.5 font-medium">
              Only 2 Options · Image Battles · Instant Proof
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Compact variant for quiz header and result
  return (
    <div
      onClick={handlePet}
      className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-pink-500/15 border border-pink-400/30 backdrop-blur-md shadow-lg cursor-pointer hover:border-pink-400/60 transition-all select-none group"
    >
      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-pink-400/40 shadow-inner bg-black/30 group-hover:scale-110 transition-transform">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cats/couple_cats.gif"
          alt="Couple Cats GIF"
          className="w-full h-full object-cover"
        />
        <div className="absolute -top-1 -right-1 text-xs">💖</div>
      </div>

      <div className="text-left">
        <div className="text-xs font-black text-pink-200 flex items-center gap-1">
          <span>Love Cat Mascot</span>
          <Sparkles className="w-3 h-3 text-amber-300" />
        </div>
        <p className="text-[11px] font-semibold text-slate-300 max-w-[240px] truncate">
          {speechText || "Pick your instinct! Which one is their true vibe? 🐾"}
        </p>
      </div>
    </div>
  );
}
