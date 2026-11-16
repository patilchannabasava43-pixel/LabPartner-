import React from 'react';
import { Clock, Users, Calendar, Target, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function WhyChooseUsSection() {
  const points = [
    {
      title: 'Save Time Finding Classmates',
      description: 'Skip unread Discord channels and group chat shoutouts. Connect immediately with students enrolled in your exact courses.',
      icon: Clock,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-100'
    },
    {
      title: 'Better Academic Collaboration',
      description: 'Match with peers whose work ethic and project ambitions align with yours, leading to higher grades and shared milestones.',
      icon: Users,
      color: 'text-violet-600',
      bg: 'bg-violet-50 border-violet-100'
    },
    {
      title: 'Flexible Schedule Matching',
      description: 'Never worry about time conflicts again. Our weekly availability matrix instantly identifies common free study windows.',
      icon: Calendar,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-100'
    },
    {
      title: 'Personalized Partner Recommendations',
      description: 'Receive tailored peer recommendations based on a transparent 4-factor formula that weights subjects, times, skills, and goals.',
      icon: Target,
      color: 'text-pink-600',
      bg: 'bg-pink-50 border-pink-100'
    }
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column Text */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              The Academic Advantage
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Why Students Excel with LabPartner Finder
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Colleges assign complex lab practicals, group term papers, and challenging problem sets. Studying with the right partner transforms stress into productivity.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-slate-700 font-medium">
                  Verified campus community: only genuine students with verified profiles.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-slate-700 font-medium">
                  Zero guesswork: complete visibility into matching subjects and schedule overlap.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-slate-700 font-medium">
                  Privacy-first: contact coordinates are only revealed once partnerships are accepted.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: 2x2 Feature Cards */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
            {points.map((pt, idx) => {
              const Icon = pt.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:shadow-card hover:border-indigo-200 transition-all duration-300"
                >
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${pt.bg} ${pt.color} mb-4`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{pt.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{pt.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

