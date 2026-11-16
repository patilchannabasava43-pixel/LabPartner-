import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Clock,
  BookOpen,
  CheckCircle2,
  Users,
  Compass,
  Star,
  Layers
} from 'lucide-react';

export default function HeroSection() {
  const scrollToHowItWorks = () => {
    const elem = document.querySelector('#how-it-works');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-violet-600/15 blur-[110px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[280px] h-[280px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines and CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>Smart Academic Collaboration Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Find Your Perfect{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-200">
                Study Partner.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Connect with students who share your subjects, interests, and schedule. Make studying smarter, easier, and more collaborative.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-102 active:scale-98"
              >
                Find Your Study Partner
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={scrollToHowItWorks}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-semibold text-sm bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all hover:border-slate-600"
              >
                <Compass className="w-4 h-4 text-indigo-400" />
                Explore How It Works
              </button>
            </div>

            {/* Quick Micro-Benefits */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Verified College Peers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Deterministic 4-Factor Matching</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Zero Awkward Cold Emails</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Student Cards Illustration */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              {/* Back Card (Layered & Angled) */}
              <div className="transform rotate-3 translate-x-2 translate-y-3 bg-slate-800/60 backdrop-blur-md rounded-3xl p-5 border border-slate-700/60 shadow-xl opacity-75 hidden sm:block">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-600/30 flex items-center justify-center text-violet-300 font-bold">
                      ER
                    </div>
                    <div>
                      <div className="h-3 w-24 bg-slate-600 rounded"></div>
                      <div className="h-2 w-16 bg-slate-700 rounded mt-1.5"></div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    88% Match
                  </span>
                </div>
              </div>

              {/* Main Prominent Student Card */}
              <div className="relative z-10 bg-gradient-to-b from-slate-800/95 via-slate-850/95 to-slate-900/95 backdrop-blur-xl p-6 rounded-3xl border border-slate-700 shadow-2xl hover:border-indigo-500/50 transition-all duration-300">
                {/* Card Top */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                        alt="Alex Chen"
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-md"
                      />
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base">Alex Chen</h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          CS • 3rd Year
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">California Institute of Technology</p>
                    </div>
                  </div>

                  {/* Compatibility Badge */}
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm ring-2 ring-emerald-400/30">
                      <Sparkles className="w-3 h-3" />
                      96% Match
                    </span>
                  </div>
                </div>

                {/* Subject Tags */}
                <div className="mt-4 pt-3 border-t border-slate-700/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    Enrolled Courses & Focus
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-xs px-2.5 py-1 rounded-lg font-medium bg-indigo-500/15 text-indigo-200 border border-indigo-500/30">
                      Data Structures & Algorithms
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-lg font-medium bg-indigo-500/15 text-indigo-200 border border-indigo-500/30">
                      Operating Systems
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-lg font-medium bg-violet-500/15 text-violet-200 border border-violet-500/30">
                      Machine Learning
                    </span>
                  </div>
                </div>

                {/* Availability Summary */}
                <div className="mt-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    <span>Mon & Wed (Evening) • Sat (Morning)</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Free Slot
                  </span>
                </div>

                {/* Direct Action Mock */}
                <div className="mt-4 pt-3 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400 italic">
                    "Looking for partners for OS lab milestones"
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300">
                    Connect Request <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Floating Synergy Callout Widget */}
              <div className="hidden sm:flex absolute -bottom-6 -left-6 z-20 items-center gap-3 p-3.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700 shadow-2xl animate-bounce-slow">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">3 Shared Subjects Found</div>
                  <div className="text-[11px] text-slate-400">Mutual focus on midterm prep</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

