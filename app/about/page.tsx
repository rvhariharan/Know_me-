import React from "react";
import Link from "next/link";
import { Sparkles, Heart, Shield, Users, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-10">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center mb-3 shadow-lg shadow-violet-600/30">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          About KnowMe
        </h1>
        <p className="text-sm text-slate-300 mt-2">
          The fun social quiz platform built for real laughs, friendly roasts, and deeper connections.
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 text-sm text-slate-300 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>Our Mission</span>
          </h2>
          <p>
            In a world filled with endless scrolling, KnowMe was created to bring genuine, interactive fun back to group chats. We believe personal quizzes shouldn&apos;t be full of invasive tracking, paywalls, or complicated sign-up forms. KnowMe lets anyone create a customized friendship quiz in two minutes and share it with friends across the world.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">
            Built for Everyone
          </h2>
          <p>
            KnowMe is not just for romantic partners. It is built for childhood best friends, college roommates, sibling rivalries, office teams, and internet group chats. Whether you want to know who remembers your favorite 2 AM snack or who knows your biggest pet peeves, KnowMe puts friendship to the test.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">
            Privacy First
          </h2>
          <p>
            We take privacy seriously. We never ask for sensitive government identifiers, phone numbers, or private tracking cookies. You can create, play, and delete quizzes at any time without leaving personal footprints.
          </p>
        </section>

        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-400">
            Ready to test your friendships?
          </span>
          <Link
            href="/create"
            className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 shadow-md"
          >
            Create Your Quiz Now
          </Link>
        </div>
      </div>
    </div>
  );
}
