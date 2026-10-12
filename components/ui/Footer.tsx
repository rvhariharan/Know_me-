import React from "react";
import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#070912] mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-lg text-white">
                Know<span className="text-gradient-primary">Me</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              The viral friendship quiz platform. Test who truly knows your secrets, cravings, quirks, and real personality.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Play & Create
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/create" className="hover:text-white transition-colors">
                  Create a Quiz
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Take a Quiz
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Creator Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Business & Growth */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Partnerships
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/advertise" className="hover:text-white transition-colors">
                  Advertise With Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About KnowMe
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Trust & Legal
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@knowme.app"
                  className="hover:text-white transition-colors"
                >
                  Report Abuse
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} KnowMe Social. Built for genuine friendships & laughs.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 inline" /> for viral fun.
          </p>
        </div>
      </div>
    </footer>
  );
}
