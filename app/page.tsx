"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  KeyRound,
  Zap,
  Heart,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ALL_TIERS } from "@/lib/utils/scoring";
import { AdBanner } from "@/components/ui/AdBanner";
import { LoveCatAnimation } from "@/components/ui/LoveCatAnimation";

export default function HomePage() {
  const router = useRouter();
  const [quickCode, setQuickCode] = useState("");
  const [demoSelected, setDemoSelected] = useState<1 | 2>(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleQuickJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickCode.trim()) {
      router.push(`/quiz/${quickCode.trim()}`);
    }
  };

  const steps = [
    {
      num: "01",
      title: "Pick 2-Choice Battles",
      desc: "Fast, visual 'This or That' image questions.",
      catImg: "/options/pizza.svg",
    },
    {
      num: "02",
      title: "Send to Group Chat",
      desc: "One-click share to WhatsApp & Instagram.",
      catImg: "/cats/love_cats_couple.jpg",
    },
    {
      num: "03",
      title: "Friends Guess & React",
      desc: "Instant feedback with cute cat animations.",
      catImg: "/cats/love_cats_cuddle.jpg",
    },
    {
      num: "04",
      title: "Download Pinterest Pin",
      desc: "Save high-res 2:3 certificate to flex score.",
      catImg: "/cats/cat-crown.jpg",
    },
  ];

  const faqs = [
    {
      q: "Do my friends need to download an app or sign up?",
      a: "No! 100% web-based and frictionless. Open link, tap, and done.",
    },
    {
      q: "Can I download my score as a Pinterest Pin?",
      a: "Yes! Every result has a high-res 2:3 Pinterest Pin card ready to download and post.",
    },
    {
      q: "Are the questions 2 options only?",
      a: "Yes! Fast, visual 'This or That' image choices with zero reading fatigue.",
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-pink-600/20 via-purple-600/20 to-rose-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          {/* Viral Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs font-black text-pink-300 mb-6 shadow-lg backdrop-blur-md">
            <Flame className="w-4 h-4 text-pink-400" />
            <span>2-Option Visual Battles · Love Cat Edition 🐾</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.08] mb-4">
            HOW WELL DO THEY <span className="text-gradient-primary">KNOW YOU?</span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-xl mx-auto mb-8 font-medium">
            Visual 2-choice battles with cute love cats. Pick your vibe, share with your besties, and unlock your Pinterest Pin! 💕
          </p>

          {/* Animated Love Cat Video Card Component */}
          <div className="mb-10">
            <LoveCatAnimation variant="hero" />
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link
              href="/create"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-base text-white bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-xl shadow-pink-600/30 flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Create Your Quiz (Free)</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            {/* Quick Code Join Pill */}
            <form
              onSubmit={handleQuickJoin}
              className="w-full sm:w-auto flex items-center bg-white/[0.06] border border-white/15 rounded-2xl p-1.5 focus-within:border-pink-500 transition-colors"
            >
              <KeyRound className="w-4 h-4 text-slate-400 ml-3 mr-2 shrink-0" />
              <input
                type="text"
                value={quickCode}
                onChange={(e) => setQuickCode(e.target.value.toUpperCase())}
                placeholder="Enter Code"
                maxLength={10}
                className="w-28 sm:w-32 bg-transparent text-sm font-bold uppercase tracking-wider text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-pink-600/80 hover:bg-pink-600 transition-colors cursor-pointer"
              >
                Play
              </button>
            </form>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero Sign Up Required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
              <span>2 Visual Choices Only</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Downloadable Pinterest Pins</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive 2-Option Preview Demo */}
      <section className="py-14 border-t border-white/5 bg-[#0e0717]/60 relative">
        <div className="max-w-xl mx-auto px-4 text-center">
          <span className="text-xs font-black uppercase tracking-widest text-pink-400">
            Live Preview
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 mb-6">
            Pizza or Burgers: Guess Hari&apos;s Pick! 🍕 vs 🍔
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => setDemoSelected(1)}
              className={`rounded-3xl p-4 border-2 transition-all cursor-pointer flex flex-col items-center select-none ${
                demoSelected === 1
                  ? "bg-gradient-to-b from-pink-500/30 to-purple-950/40 border-pink-400 shadow-xl shadow-pink-500/25 scale-105 ring-2 ring-pink-400"
                  : "bg-white/[0.04] border-white/10 hover:border-pink-400/40"
              }`}
            >
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-black/60 text-white mb-2">
                A
              </span>
              <div className="w-28 h-28 rounded-2xl overflow-hidden mb-2 bg-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/options/pizza.svg"
                  alt="Pizza"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-extrabold text-white">Crispy Pizza 🍕</span>
              {demoSelected === 1 && (
                <span className="text-xs font-bold text-pink-300 mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Selected!
                </span>
              )}
            </div>

            <div
              onClick={() => setDemoSelected(2)}
              className={`rounded-3xl p-4 border-2 transition-all cursor-pointer flex flex-col items-center select-none ${
                demoSelected === 2
                  ? "bg-gradient-to-b from-pink-500/30 to-purple-950/40 border-pink-400 shadow-xl shadow-pink-500/25 scale-105 ring-2 ring-pink-400"
                  : "bg-white/[0.04] border-white/10 hover:border-pink-400/40"
              }`}
            >
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-black/60 text-white mb-2">
                B
              </span>
              <div className="w-28 h-28 rounded-2xl overflow-hidden mb-2 bg-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/options/burger.svg"
                  alt="Burger"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-extrabold text-white">Juicy Burger 🍔</span>
              {demoSelected === 2 && (
                <span className="text-xs font-bold text-pink-300 mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Selected!
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Visual Steps */}
      <section className="py-14 border-t border-white/5 bg-[#0a0d1c]/50 relative">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white">How It Works</h2>
            <p className="text-xs text-slate-400 mt-1">
              Zero friction, pure fun with your besties.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((st) => (
              <div
                key={st.num}
                className="glass-card rounded-3xl p-4 sm:p-5 border border-white/10 hover:border-pink-500/40 transition-all text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden mb-3 border border-pink-400/30 bg-black/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={st.catImg} alt={st.title} className="w-full h-full object-cover" />
                </div>
                <div className="text-[10px] font-mono font-bold text-pink-400 mb-1">
                  STEP {st.num}
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{st.title}</h3>
                <p className="text-[11px] text-slate-400">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Result Tiers Showcase with Cute Cats */}
      <section className="py-16 border-t border-white/5 relative">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-pink-400">
              Score Tiers
            </span>
            <h2 className="text-3xl font-black text-white mt-1">
              Unlock Your Cat Certificate
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {ALL_TIERS.map((tier, idx) => (
              <div
                key={idx}
                className={`glass-card rounded-2xl p-3 border border-pink-400/20 bg-gradient-to-b ${tier.gradient} text-center flex flex-col items-center justify-between hover:scale-105 transition-all`}
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden mb-2 border border-white/10 bg-black/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tier.catImage}
                    alt={tier.label}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs font-black text-white">{tier.label}</div>
                <div className="text-[10px] text-pink-300 font-bold mt-1">
                  {tier.minScore}–{tier.maxScore} pts
                </div>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-12 glass-panel rounded-3xl p-8 border border-pink-500/30 text-center">
            <h3 className="text-2xl font-black text-white mb-2">
              Ready to test your friends?
            </h3>
            <p className="text-xs text-pink-200 mb-5">
              Takes 60 seconds. Pick 10 visual choices and share your link!
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-xl shadow-pink-600/30 transition-all hover:scale-105 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Create Quiz Now</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 border-t border-white/5 bg-[#0a0d1c]/40">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-black text-white text-center mb-6">
            Quick Questions
          </h2>
          <div className="space-y-2.5">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="glass-card rounded-2xl border border-white/10 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-sm font-bold text-white">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-pink-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-300 border-t border-white/5 pt-2">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-6 w-full">
        <AdBanner slot="home-bottom" />
      </div>
    </div>
  );
}
