import React from "react";
import { FileText, CheckCircle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-10">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mb-3">
          <FileText className="w-6 h-6 text-violet-400" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Last Updated: October 2026
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-white mb-2">1. Acceptance of Terms</h2>
          <p>
            By creating, sharing, or taking a quiz on KnowMe, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use the service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">2. Acceptable Use & Conduct</h2>
          <p>KnowMe is designed for playful, positive entertainment. You agree NOT to:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Post or distribute content that is defamatory, abusive, harassing, threatening, or sexually explicit.</li>
            <li>Post confidential personal data belonging to someone else without their consent.</li>
            <li>Use automated bots, scrapers, or scripts to spam quiz creation or flood quiz leaderboards.</li>
            <li>Impersonate any person or entity in a deceptive or malicious manner.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">3. User Content & Intellectual Property</h2>
          <p>
            You retain ownership of any custom questions and answers you author. By posting content to KnowMe, you grant us a non-exclusive license to store and transmit that content solely for the purpose of operating the quiz service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">4. Disclaimers & Limitation of Liability</h2>
          <p>
            KnowMe is provided &ldquo;as is&rdquo; without warranties of any kind. Scores and result certificates are generated for recreational amusement only and should not be used as serious psychometric evaluations.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">5. Termination & Content Removal</h2>
          <p>
            We reserve the right to remove any quiz or restrict access to any user found violating these terms without prior notice.
          </p>
        </section>
      </div>
    </div>
  );
}
