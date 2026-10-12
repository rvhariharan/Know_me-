import React from "react";
import { ShieldCheck, Lock, EyeOff } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-10">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Last Updated: October 2026 • Effective Immediately
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-white mb-2">1. Our Privacy Pledge</h2>
          <p>
            KnowMe is built around fun, lighthearted social gaming. We believe in minimal data collection and maximum transparency.
          </p>
        </section>

        <section className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
          <h3 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
            <EyeOff className="w-4 h-4" />
            What We NEVER Collect
          </h3>
          <ul className="list-disc list-inside space-y-1 text-slate-300">
            <li>We do NOT collect government IDs (e.g. Aadhaar, PAN, SSN).</li>
            <li>We do NOT collect phone numbers for casual quiz creation or playing.</li>
            <li>We do NOT collect precise GPS or background device location.</li>
            <li>We do NOT sell or broker personal contact lists.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">2. Information We Collect</h2>
          <p>We only collect the minimum information required to operate quizzes:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Quiz Content:</strong> Creator name/nickname, quiz title, questions, options, and chosen answers.</li>
            <li><strong>Attempt Data:</strong> Player name/nickname entered when taking a quiz, question selections, calculated score, and timestamp.</li>
            <li><strong>Usage Logs:</strong> Anonymous aggregate metrics (e.g., number of quizzes created and completed) to maintain system performance and reliability.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">3. How Your Data Is Stored & Protected</h2>
          <p>
            Answers and quiz information are transmitted securely via encrypted HTTPS connections. Answers are evaluated server-side to prevent tampering or client interception.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">4. Your Right to Delete</h2>
          <p>
            Any creator can delete their quiz at any time directly through their Creator Dashboard. Deleting a quiz permanently wipes all associated questions, player attempts, and score records from our database.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">5. Reporting Abuse</h2>
          <p>
            If you encounter a quiz containing harassment, hate speech, or inappropriate personal disclosures, please contact us immediately at{" "}
            <a href="mailto:support@knowme.app" className="text-violet-400 underline">
              support@knowme.app
            </a>{" "}
            with the quiz link. Reported offensive quizzes are reviewed and taken down promptly.
          </p>
        </section>
      </div>
    </div>
  );
}
