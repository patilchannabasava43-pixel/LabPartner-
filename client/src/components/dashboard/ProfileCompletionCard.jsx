import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProfileCompletionCard({ completion }) {
  const percentage = completion?.percentage ?? 0;
  const suggestions = completion?.suggestions ?? [];

  return (
    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Synergy Engine Readiness
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">Profile Completion</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              A comprehensive profile increases algorithmic partner recommendation accuracy by up to 85%.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-indigo-50 border border-indigo-100 flex-shrink-0">
            <span className="text-2xl font-black text-indigo-600">{percentage}%</span>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
              {percentage === 100 ? 'Optimal' : 'Active'}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5">
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Missing Profile Items */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          {percentage < 100 && suggestions.length > 0 ? (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Recommended Actions:
              </span>
              <ul className="space-y-1 text-xs text-slate-600">
                {suggestions.slice(0, 3).map((sug, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <span className="truncate">{sug}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>Your profile is 100% complete! Your coursework & schedule are fully synchronized.</span>
            </div>
          )}
        </div>
      </div>

      {/* Button */}
      <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
        <Link
          to="/edit-profile"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
        >
          <span>Complete Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

