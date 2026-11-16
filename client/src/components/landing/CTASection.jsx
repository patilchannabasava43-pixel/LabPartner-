import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, GraduationCap } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-24 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute -top-10 right-10 w-48 h-48 bg-violet-600/20 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30 backdrop-blur-md">
          <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
          <span>Elevate Your College Experience</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Your Next Great Study Partner Is Waiting.
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Join LabPartner Finder and make every study session more productive.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 rounded-2xl font-bold text-sm bg-white text-indigo-950 hover:bg-slate-100 shadow-2xl transition-all duration-200 hover:scale-105 active:scale-98"
          >
            Get Started Today
            <ArrowRight className="w-4 h-4 text-indigo-700" />
          </Link>

          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 transition"
          >
            Sign In with Demo Account
          </Link>
        </div>
      </div>
    </section>
  );
}

