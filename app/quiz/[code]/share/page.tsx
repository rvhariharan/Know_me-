"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  Sparkles,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Send,
  Eye,
  LayoutDashboard,
  ShieldAlert,
  Download,
  Heart,
} from "lucide-react";
import {
  getQuizUrl,
  getWhatsAppQuizShareUrl,
  getTelegramShareUrl,
  copyToClipboard,
  triggerNativeShare,
} from "@/lib/utils/share";

function ShareQuizContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const code = (params.code as string) || "";
  const token = searchParams.get("token") || "";

  const [copied, setCopied] = useState(false);
  const [downloadingPin, setDownloadingPin] = useState(false);

  const quizUrl = getQuizUrl(code);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(quizUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsApp = () => {
    const url = getWhatsAppQuizShareUrl("me", code);
    window.open(url, "_blank");
  };

  const handleTelegram = () => {
    const text = "How well do you really know me? Take my KnowMe quiz!";
    const url = getTelegramShareUrl(text, quizUrl);
    window.open(url, "_blank");
  };

  const handleNativeShare = async () => {
    const success = await triggerNativeShare({
      title: "KnowMe Friendship Quiz",
      text: "How well do you really know me? Take my KnowMe quiz and find out!",
      url: quizUrl,
    });
    if (!success) {
      handleCopyLink();
    }
  };

  // Generate and download standard Pinterest Invite Pin (1000x1500, 2:3 aspect ratio)
  const handleDownloadInvitePin = async () => {
    setDownloadingPin(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1000;
      canvas.height = 1500;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Dark cute gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 1500);
      bgGrad.addColorStop(0, "#260e2b");
      bgGrad.addColorStop(0.5, "#14081c");
      bgGrad.addColorStop(1, "#07020a");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1000, 1500);

      // Cute outer border
      ctx.strokeStyle = "rgba(244, 114, 182, 0.4)";
      ctx.lineWidth = 14;
      ctx.strokeRect(30, 30, 940, 1440);

      // Top Tag
      ctx.fillStyle = "#f472b6";
      ctx.font = "bold 32px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("KNOWME · 2-CHOICE QUIZ", 500, 110);

      // Main Hook Text
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 60px sans-serif";
      ctx.fillText("HOW WELL DO YOU", 500, 190);
      ctx.fillText("REALLY KNOW ME? 💕", 500, 260);

      // Cat Image
      const catImg = new Image();
      catImg.crossOrigin = "anonymous";
      catImg.src = "/cats/love_cats_couple.jpg";
      await new Promise((resolve) => {
        catImg.onload = resolve;
        catImg.onerror = resolve;
      });

      const imgSize = 520;
      const imgX = (1000 - imgSize) / 2;
      const imgY = 320;

      // Glow behind cat
      ctx.save();
      ctx.fillStyle = "rgba(236, 72, 153, 0.25)";
      ctx.beginPath();
      ctx.arc(500, imgY + imgSize / 2, imgSize / 2 + 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Rounded clip for cat
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgSize, imgSize, 40);
      ctx.clip();
      ctx.drawImage(catImg, imgX, imgY, imgSize, imgSize);
      ctx.restore();

      // Subtitle
      ctx.fillStyle = "#fbcfe8";
      ctx.font = "bold 38px sans-serif";
      ctx.fillText("10 Fast 'This or That' Battles 🐾", 500, 920);

      // Quiz Code Badge
      ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
      ctx.beginPath();
      ctx.roundRect(180, 990, 640, 120, 30);
      ctx.fill();

      ctx.fillStyle = "#f472b6";
      ctx.font = "bold 26px sans-serif";
      ctx.fillText("ENTER QUIZ CODE ON KNOWME.APP:", 500, 1035);

      ctx.fillStyle = "#ffffff";
      ctx.font = "900 56px monospace";
      ctx.fillText(code, 500, 1088);

      // Footer
      ctx.fillStyle = "#9ca3af";
      ctx.font = "bold 28px sans-serif";
      ctx.fillText("Play for free at KnowMe.app ✨", 500, 1380);

      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `KnowMe-${code}-Pinterest-Invite.png`;
      a.click();
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingPin(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 sm:py-14 text-center">
      {/* Celebration Header */}
      <div className="w-20 h-20 mx-auto rounded-3xl overflow-hidden border-2 border-pink-400/50 shadow-xl shadow-pink-600/30 mb-4 animate-bounce duration-1000">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cats/love_cats_couple.jpg"
          alt="Love Cats"
          className="w-full h-full object-cover"
        />
      </div>

      <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
        Your Quiz is Live! 🎉
      </h1>
      <p className="text-sm text-pink-200 max-w-md mx-auto mb-6">
        Share your link or Pinterest Pin with friends and let the guessing begin!
      </p>

      {/* Share Link Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-pink-500/30 shadow-2xl mb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-pink-300 mb-2">
          Your Shareable Quiz Link
        </div>

        <div className="flex items-center gap-2 p-2 bg-black/50 rounded-2xl border border-white/10 mb-5">
          <input
            type="text"
            readOnly
            value={quizUrl}
            className="flex-1 bg-transparent px-3 text-xs sm:text-sm font-mono text-pink-200 truncate focus:outline-none"
          />
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-pink-600 hover:bg-pink-500 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Big Action Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleWhatsApp}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Share on WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadInvitePin}
            disabled={downloadingPin}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Download className="w-5 h-5" />
            <span>{downloadingPin ? "Generating Pin..." : "Download Pinterest Pin (2:3)"}</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleTelegram}
              className="py-3 px-4 rounded-xl bg-[#0088cc]/20 border border-[#0088cc]/40 hover:bg-[#0088cc]/30 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4 text-[#0088cc]" />
              <span>Telegram</span>
            </button>

            <button
              type="button"
              onClick={handleNativeShare}
              className="py-3 px-4 rounded-xl bg-pink-600/20 border border-pink-500/40 hover:bg-pink-600/30 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-pink-400" />
              <span>More...</span>
            </button>
          </div>
        </div>
      </div>

      {/* Creator Secret Admin Key */}
      {token && (
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left mb-6">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300">
              <span className="font-bold text-white">Your Creator Key: </span>
              <span className="font-mono text-amber-300">{token}</span>
              <p className="text-[11px] text-slate-400 mt-1">
                Saved in your browser. Keep this key if you want to access your dashboard from another device.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Next Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={`/quiz/${code}`}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Eye className="w-4 h-4 text-pink-400" />
          <span>Preview Quiz</span>
        </Link>
        <Link
          href={`/dashboard?code=${code}&token=${token}`}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-pink-600/30 hover:bg-pink-600/50 border border-pink-500/30 text-pink-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Creator Dashboard</span>
        </Link>
      </div>
    </div>
  );
}

export default function ShareQuizPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-400">Loading Share Screen...</div>}>
      <ShareQuizContent />
    </Suspense>
  );
}
