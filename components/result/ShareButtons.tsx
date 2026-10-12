"use client";

import React, { useState } from "react";
import {
  Share2,
  Copy,
  Check,
  Send,
  MessageCircle,
  Camera,
} from "lucide-react";
import {
  getQuizUrl,
  getResultUrl,
  getWhatsAppResultShareUrl,
  getTelegramShareUrl,
  copyToClipboard,
  triggerNativeShare,
} from "@/lib/utils/share";
import { trackEvent } from "@/lib/analytics";

interface ShareButtonsProps {
  attemptId: string;
  shareCode: string;
  creatorName: string;
  playerName: string;
  score: number;
  totalQuestions: number;
}

export function ShareButtons({
  attemptId,
  shareCode,
  creatorName,
  playerName,
  score,
  totalQuestions,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const quizUrl = getQuizUrl(shareCode);
  const resultUrl = getResultUrl(attemptId);

  const handleCopyLink = async () => {
    trackEvent("result_shared", { method: "copy_link", shareCode });
    const success = await copyToClipboard(quizUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsApp = () => {
    trackEvent("result_shared", { method: "whatsapp", shareCode });
    const url = getWhatsAppResultShareUrl(
      creatorName,
      playerName,
      score,
      totalQuestions,
      attemptId,
      shareCode
    );
    window.open(url, "_blank");
  };

  const handleTelegram = () => {
    trackEvent("result_shared", { method: "telegram", shareCode });
    const text = `I just scored ${score}/${totalQuestions} on ${creatorName}'s KnowMe quiz! Can you beat me?`;
    const url = getTelegramShareUrl(text, quizUrl);
    window.open(url, "_blank");
  };

  const handleNativeShare = async () => {
    trackEvent("result_shared", { method: "native_share", shareCode });
    const success = await triggerNativeShare({
      title: `${creatorName}'s KnowMe Quiz Result`,
      text: `I scored ${score}/${totalQuestions} on ${creatorName}'s quiz! Can you beat my score?`,
      url: quizUrl,
    });
    if (!success) {
      handleCopyLink();
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="text-center">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          Share Your Score
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Flex on your friends or challenge them to beat you!
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* WhatsApp */}
        <button
          type="button"
          onClick={handleWhatsApp}
          className="p-3 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/40 hover:bg-[#25D366]/30 text-white font-semibold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-105"
        >
          <MessageCircle className="w-5 h-5 text-[#25D366]" />
          <span>WhatsApp</span>
        </button>

        {/* Telegram */}
        <button
          type="button"
          onClick={handleTelegram}
          className="p-3 rounded-2xl bg-[#0088cc]/20 border border-[#0088cc]/40 hover:bg-[#0088cc]/30 text-white font-semibold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-105"
        >
          <Send className="w-5 h-5 text-[#0088cc]" />
          <span>Telegram</span>
        </button>

        {/* Copy Link */}
        <button
          type="button"
          onClick={handleCopyLink}
          className="p-3 rounded-2xl bg-violet-600/20 border border-violet-500/40 hover:bg-violet-600/30 text-white font-semibold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-105"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-300">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-5 h-5 text-violet-400" />
              <span>Copy Link</span>
            </>
          )}
        </button>

        {/* Native Web Share */}
        <button
          type="button"
          onClick={handleNativeShare}
          className="p-3 rounded-2xl bg-pink-600/20 border border-pink-500/40 hover:bg-pink-600/30 text-white font-semibold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-105"
        >
          <Share2 className="w-5 h-5 text-pink-400" />
          <span>More...</span>
        </button>
      </div>

      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center gap-2 text-xs text-slate-400">
        <Camera className="w-4 h-4 text-slate-400 shrink-0" />
        <span>Tip: Screenshot the card above for Instagram Stories & Snapchat! 📸</span>
      </div>
    </div>
  );
}
