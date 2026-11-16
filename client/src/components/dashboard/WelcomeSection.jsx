import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Search, Edit3, ArrowRight, BookOpen } from 'lucide-react';

export default function WelcomeSection({ student }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = (student?.fullName || student?.name || 'Student').split(' ')[0];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-10 left-1/3 w-64 h-64 bg-violet-600/10 blur-[80px] pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Academic Command Center</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {getGreeting()}, {firstName}!
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
            Ready to find your perfect study partner? You are studying{' '}
            <span className="text-white font-semibold">{student?.department || 'your coursework'}</span>{' '}
            at {student?.college || 'university'}. Classmates with matching schedules are waiting.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            to="/find-partners"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-102 active:scale-98"
          >
            <Search className="w-4 h-4" />
            Find Study Partners
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            to="/edit-profile"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-semibold text-xs sm:text-sm bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 transition"
          >
            <Edit3 className="w-4 h-4 text-indigo-400" />
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

