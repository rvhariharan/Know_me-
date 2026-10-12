"use client";

import React, { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import { ScoreTier } from "@/types/quiz";
import { Sparkles, Download, Heart } from "lucide-react";

interface ScoreCardProps {
  score: number;
  totalQuestions: number;
  percentage: number;
  tier: ScoreTier;
  creatorName: string;
  playerName: string;
}

export function ScoreCard({
  score,
  totalQuestions,
  percentage,
  tier,
  creatorName,
  playerName,
}: ScoreCardProps) {
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fire confetti for scores 6 and above
    const normalized = totalQuestions > 0 ? (score / totalQuestions) * 10 : 0;
    if (normalized >= 6) {
      try {
        confetti({
          particleCount: 140,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#ec4899", "#8b5cf6", "#fbbf24", "#10b981", "#f43f5e"],
        });
      } catch {
        // non-critical
      }
    }
  }, [score, totalQuestions]);

  // Generate and download standard Pinterest Pin (1000x1500, 2:3 aspect ratio)
  const handleDownloadPinterestPin = async () => {
    setDownloading(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1000;
      canvas.height = 1500;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 1500);
      bgGrad.addColorStop(0, "#200926");
      bgGrad.addColorStop(0.5, "#120718");
      bgGrad.addColorStop(1, "#08030b");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1000, 1500);

      // Cute outer border with rounded corners
      ctx.strokeStyle = "rgba(244, 114, 182, 0.4)";
      ctx.lineWidth = 12;
      ctx.strokeRect(30, 30, 940, 1440);

      // Top Header
      ctx.fillStyle = "#f472b6";
      ctx.font = "bold 32px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("KNOWME · FRIENDSHIP PIN", 500, 110);

      // Player names
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 52px sans-serif";
      ctx.fillText(`${playerName} & ${creatorName}`, 500, 190);

      // Cat Image
      const catImg = new Image();
      catImg.crossOrigin = "anonymous";
      catImg.src = tier.catImage || "/cats/love_cats_couple.jpg";
      await new Promise((resolve) => {
        catImg.onload = resolve;
        catImg.onerror = resolve;
      });

      // Draw Cat in center frame
      const imgSize = 480;
      const imgX = (1000 - imgSize) / 2;
      const imgY = 240;

      // Glow behind cat
      ctx.save();
      ctx.fillStyle = "rgba(236, 72, 153, 0.25)";
      ctx.beginPath();
      ctx.arc(500, imgY + imgSize / 2, imgSize / 2 + 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Rounded clip for cat image
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgSize, imgSize, 40);
      ctx.clip();
      ctx.drawImage(catImg, imgX, imgY, imgSize, imgSize);
      ctx.restore();

      // Score Big Display
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 120px sans-serif";
      ctx.fillText(`${score} / ${totalQuestions}`, 500, 840);

      // Percentage Match
      ctx.fillStyle = "#f472b6";
      ctx.font = "bold 44px sans-serif";
      ctx.fillText(`${percentage}% FRIENDSHIP MATCH 💖`, 500, 920);

      // Tier Badge Pill
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.beginPath();
      ctx.roundRect(250, 970, 500, 70, 35);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 36px sans-serif";
      ctx.fillText(`${tier.emoji}  ${tier.label}`, 500, 1018);

      // Quote
      ctx.fillStyle = "#fbcfe8";
      ctx.font = "italic 38px sans-serif";
      const quoteText = `"${tier.quote}"`;
      ctx.fillText(quoteText, 500, 1120);

      // Watermark
      ctx.fillStyle = "#9ca3af";
      ctx.font = "bold 28px sans-serif";
      ctx.fillText("Test your friendship at KnowMe.app 🐾", 500, 1380);

      // Trigger download
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `KnowMe-${playerName}-${creatorName}-Pin.png`;
      a.click();
    } catch (err) {
      console.error("Pinterest Pin export failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      ref={cardRef}
      id="screenshot-target-card"
      className={`relative w-full rounded-3xl p-6 sm:p-8 border border-pink-400/30 shadow-2xl bg-gradient-to-b ${tier.gradient} backdrop-blur-xl overflow-hidden text-center`}
    >
      {/* Decorative background aura */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-pink-500/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />

      {/* Top Tag */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/40 border border-pink-400/30 text-xs font-semibold text-pink-200 mb-4 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        Official KnowMe Friendship Certificate
      </div>

      {/* Players Header */}
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-200">
          <span className="text-white font-extrabold">{playerName}</span> tested their friendship with{" "}
          <span className="text-gradient-primary font-extrabold">{creatorName}</span>
        </h2>
      </div>

      {/* Cute Animated Cat Mascot Image matching score tier */}
      <div className="my-3 flex items-center justify-center">
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-2 border-pink-400/40 shadow-xl bg-black/40 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tier.catImage || "/cats/love_cats_couple.jpg"}
            alt={tier.label}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-2 right-2 text-xl drop-shadow-md">
            {tier.emoji}
          </div>
        </div>
      </div>

      {/* Score Big Display */}
      <div className="mb-4">
        <div className="text-xs uppercase tracking-widest text-pink-300 font-bold mb-1">
          Final Score
        </div>
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-5xl sm:text-6xl font-black text-white tracking-tight">
            {score}
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-400">
            / {totalQuestions}
          </span>
        </div>
        <div className="text-sm font-semibold text-pink-300 mt-1 flex items-center justify-center gap-1">
          <span>{percentage}% Friendship Match</span>
          <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500 animate-pulse" />
        </div>
      </div>

      {/* Tier Label & Hilarious Quote */}
      <div className="my-4 p-4 rounded-2xl bg-black/50 border border-white/15 max-w-md mx-auto">
        <div className="inline-block text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1.5 border border-pink-400/30 bg-pink-500/20 text-pink-200">
          {tier.label}
        </div>
        <p className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
          &ldquo;{tier.quote}&rdquo;
        </p>
      </div>

      {/* Pinterest Pin Download Button */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleDownloadPinterestPin}
          disabled={downloading}
          className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 cursor-pointer hover:scale-105 transition-all"
        >
          <Download className="w-4 h-4" />
          {downloading ? "Creating Pin..." : "Download Pinterest Pin (2:3)"}
        </button>
      </div>

      {/* Watermark for screenshot */}
      <div className="pt-4 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400">
        <span>Play at</span>
        <span className="text-white font-bold">KnowMe.app</span>
        <span>🐾 How well do your friends know you?</span>
      </div>
    </div>
  );
}
