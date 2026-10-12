"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, PlusCircle, LayoutDashboard, KeyRound, Menu, X, ArrowRight } from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [quizCodeInput, setQuizCodeInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleJoinQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = quizCodeInput.trim();
    if (!clean) {
      setErrorMsg("Please enter a quiz code");
      return;
    }
    setCodeModalOpen(false);
    setQuizCodeInput("");
    setErrorMsg("");
    router.push(`/quiz/${clean}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/10 glass-panel">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-pink-500 to-amber-400 p-[2px] shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0d1020] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-pink-400 group-hover:text-amber-300 transition-colors" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                Know<span className="text-gradient-primary">Me</span>
                <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  Beta
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-lg shadow-pink-600/25 hover:scale-105 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Create Quiz
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setCodeModalOpen(true)}
              className="p-2 text-violet-400 hover:bg-violet-950/40 rounded-lg text-xs flex items-center gap-1 font-semibold"
            >
              <KeyRound className="w-4 h-4" />
              Join
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#0d1124] px-4 py-4 space-y-3">
            <Link
              href="/create"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600"
            >
              <PlusCircle className="w-4 h-4" />
              Create Your Quiz
            </Link>
          </div>
        )}
      </header>

      {/* Code Modal */}
      {codeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#12162a] border border-white/15 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setCodeModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-5">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mb-3">
                <KeyRound className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Enter Quiz Code</h3>
              <p className="text-sm text-slate-400 mt-1">
                Got a share code from a friend? Paste it below to start!
              </p>
            </div>

            <form onSubmit={handleJoinQuiz} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={quizCodeInput}
                  onChange={(e) => {
                    setQuizCodeInput(e.target.value.toUpperCase());
                    setErrorMsg("");
                  }}
                  placeholder="e.g. 7XbK9Q"
                  autoFocus
                  maxLength={12}
                  className="w-full text-center text-2xl font-mono uppercase tracking-widest px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
                />
                {errorMsg && (
                  <p className="text-xs text-rose-400 mt-1.5 text-center">{errorMsg}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 flex items-center justify-center gap-2 shadow-lg shadow-violet-600/25 cursor-pointer"
              >
                Take Quiz
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
