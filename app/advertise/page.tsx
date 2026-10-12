"use client";

import React, { useState } from "react";
import {
  Megaphone,
  Sparkles,
  Users,
  Target,
  Send,
  CheckCircle,
  HelpCircle,
  Award,
} from "lucide-react";

export default function AdvertisePage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const adFormats = [
    {
      title: "Sponsored Quiz Questions",
      desc: "Integrate your brand natively into user-created quizzes as fun, engaging trivia questions.",
      badge: "Highest Engagement",
      icon: "🎯",
    },
    {
      title: "Native Banner Placements",
      desc: "High-visibility, non-intrusive placements on Home, Result cards, and Quiz completion screens.",
      badge: "Brand Awareness",
      icon: "📱",
    },
    {
      title: "Custom Branded Challenges",
      desc: "Launch branded social viral quizzes for product launches, film releases, or campus events.",
      badge: "Viral Growth",
      icon: "🔥",
    },
    {
      title: "Custom Certificate Badges",
      desc: "Co-brand the downloadable and screenshot-ready result cards shared directly on WhatsApp & Instagram stories.",
      badge: "High Virality",
      icon: "👑",
    },
  ];

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-12 md:py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-xs font-semibold text-violet-300 mb-3">
          <Megaphone className="w-3.5 h-3.5 text-pink-400" />
          Brand Partnerships & Media Kit
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Advertise With <span className="text-gradient-primary">KnowMe</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
          Connect your brand with an active, highly-engaged audience of friends, students, and young adults sharing authentic moments.
        </p>

        {/* MVP Status Notice */}
        <div className="inline-block mt-4 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold">
          📢 Official advertising opportunities coming soon. Accepting early partner inquiries below.
        </div>
      </div>

      {/* Audience & Value Proposition (Honest, no fake stats) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass-card rounded-3xl p-6 border border-white/10 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-violet-600/20 flex items-center justify-center mb-3">
            <Users className="w-6 h-6 text-violet-400" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Target Demographic</h3>
          <p className="text-xs text-slate-400">
            Gen-Z, millennials, college students, close peer groups, and active group-chat communities.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-white/10 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-pink-600/20 flex items-center justify-center mb-3">
            <Target className="w-6 h-6 text-pink-400" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Peer-to-Peer Distribution</h3>
          <p className="text-xs text-slate-400">
            Organic 1-to-many sharing loop via WhatsApp, Instagram Bio, Snapchat, and Telegram.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-white/10 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-600/20 flex items-center justify-center mb-3">
            <Award className="w-6 h-6 text-amber-400" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">High Attention Duration</h3>
          <p className="text-xs text-slate-400">
            100% active screen attention as players carefully read and debate each question.
          </p>
        </div>
      </div>

      {/* Available Advertising Formats */}
      <div className="mb-12">
        <h2 className="text-2xl font-black text-white text-center mb-6">
          Upcoming Advertising Formats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {adFormats.map((format, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl p-5 border border-white/10 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{format.icon}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/30">
                  {format.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-white">{format.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {format.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Inquiry Contact Form */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl max-w-xl mx-auto">
        <h2 className="text-xl font-bold text-white mb-1 text-center">
          Partner With Us
        </h2>
        <p className="text-xs text-slate-400 mb-6 text-center">
          Submit your brand or agency details to join our early pilot launch.
        </p>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Thank You!</h3>
            <p className="text-xs text-slate-300">
              We received your inquiry. Our partnerships team will reach out within 2 business days.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Alex Morgan"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                Brand / Company
              </label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Spotify, Red Bull, Campus Agency"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                Business Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="partnerships@brand.com"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                Campaign Goals & Message
              </label>
              <textarea
                rows={3}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us what you'd like to promote or collaborate on..."
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-violet-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 flex items-center justify-center gap-2 shadow-lg shadow-pink-600/20 transition-all cursor-pointer"
            >
              <span>Submit Partnership Inquiry</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
