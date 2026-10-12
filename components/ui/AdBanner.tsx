import React from "react";
import Link from "next/link";
import { Megaphone, Sparkles } from "lucide-react";

interface AdBannerProps {
  slot: "home-bottom" | "result-card" | "dashboard-sidebar" | "quiz-footer";
  className?: string;
}

export function AdBanner({ slot, className = "" }: AdBannerProps) {
  return (
    <div
      className={`w-full rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-center ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
            <Megaphone className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-slate-400">
                Sponsor Space
              </span>
              <span className="text-xs font-semibold text-slate-200">
                Promote your brand to thousands of Gen-Z friends
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Native brand challenges & sponsored quiz spots available.
            </p>
          </div>
        </div>

        <Link
          href="/advertise"
          className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-violet-600/30 text-violet-300 hover:bg-violet-600/50 border border-violet-500/30 transition-colors flex items-center gap-1.5"
        >
          <Sparkles className="w-3 h-3 text-amber-300" />
          Advertise Here
        </Link>
      </div>
    </div>
  );
}
