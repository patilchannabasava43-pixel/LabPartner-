import React from 'react';
import { X, CheckCircle, Clock, BookOpen, Target, Sparkles, Heart, AlertTriangle, Info } from 'lucide-react';

export default function CompatibilityModal({ isOpen, onClose, studentName, compatibility }) {
  if (!isOpen || !compatibility) return null;

  const {
    score = 0,
    category = 'Moderate Match',
    breakdown = {},
    sharedSubjects = [],
    sharedInterests = [],
    sharedGoals = [],
    overlappingAvailability = [],
    matchingAvailability = [],
    explanation,
    statements = [],
    completenessWarning
  } = compatibility;

  const activeAvail = overlappingAvailability.length > 0 ? overlappingAvailability : matchingAvailability;
  const weights = breakdown?.maxWeights || { subjects: 35, availability: 30, interests: 20, goals: 15 };

  const subScore = breakdown?.subjects !== undefined ? breakdown.subjects : (breakdown?.subjectsScore || 0);
  const availScore = breakdown?.availability !== undefined ? breakdown.availability : (breakdown?.availabilityScore || 0);
  const intScore = breakdown?.interests !== undefined ? breakdown.interests : (breakdown?.interestsScore || 0);
  const goalScore = breakdown?.goals !== undefined ? breakdown.goals : (breakdown?.goalsScore || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg">Compatibility Intelligence</h3>
              <p className="text-xs text-slate-300">Detailed synergy breakdown with {studentName || 'Student'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Overall Score Banner */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-slate-50 border border-indigo-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 mb-1">
                <Sparkles className="w-3 h-3" />
                {category}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1 leading-relaxed">{explanation}</p>
            </div>
            <div className="flex flex-col items-center justify-center bg-white px-4 py-2.5 rounded-2xl border border-indigo-200 shadow-sm ml-4 flex-shrink-0">
              <span className="text-3xl font-black text-indigo-600">{score}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jaccard Score</span>
            </div>
          </div>

          {/* Completeness Warning if present */}
          {completenessWarning && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>{completenessWarning}</span>
            </div>
          )}

          {/* Why this match? bullet points */}
          {statements && statements.length > 0 && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-600" />
                Why You Match
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {statements.map((stmt, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{stmt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Factor Breakdown Bars */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              4-Factor Jaccard Weight Breakdown
            </h4>

            {/* 1. Subjects (35%) */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
                <span className="flex items-center gap-1.5 font-bold text-slate-800">
                  <BookOpen className="w-4 h-4 text-indigo-600" /> Shared Academic Subjects
                </span>
                <span className="font-bold text-indigo-600">
                  {subScore} / {weights.subjects} pts (35%)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (subScore / weights.subjects) * 100)}%` }}
                />
              </div>
              {sharedSubjects && sharedSubjects.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {sharedSubjects.map((sub, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                      <CheckCircle className="w-3 h-3 text-indigo-600" /> {sub}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No exact common subjects registered yet.</p>
              )}
            </div>

            {/* 2. Availability (30%) */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
                <span className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Clock className="w-4 h-4 text-violet-600" /> Overlapping Availability Schedule
                </span>
                <span className="font-bold text-violet-600">
                  {availScore} / {weights.availability} pts (30%)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-violet-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (availScore / weights.availability) * 100)}%` }}
                />
              </div>
              {activeAvail && activeAvail.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {activeAvail.map((slot, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md bg-violet-100 text-violet-800">
                      <Clock className="w-3 h-3 text-violet-600" /> {slot}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No overlapping study windows found in schedules.</p>
              )}
            </div>

            {/* 3. Interests (20%) */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
                <span className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Sparkles className="w-4 h-4 text-purple-600" /> Shared Academic Interests
                </span>
                <span className="font-bold text-purple-600">
                  {intScore} / {weights.interests} pts (20%)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-purple-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (intScore / weights.interests) * 100)}%` }}
                />
              </div>
              {sharedInterests && sharedInterests.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {sharedInterests.map((interest, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                      <CheckCircle className="w-3 h-3 text-purple-600" /> {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No shared academic interests listed.</p>
              )}
            </div>

            {/* 4. Study Goals (15%) */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
                <span className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Target className="w-4 h-4 text-emerald-600" /> Compatible Study Goals
                </span>
                <span className="font-bold text-emerald-600">
                  {goalScore} / {weights.goals} pts (15%)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (goalScore / weights.goals) * 100)}%` }}
                />
              </div>
              {sharedGoals && sharedGoals.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {sharedGoals.map((goal, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      <CheckCircle className="w-3 h-3 text-emerald-600" /> {goal}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No shared study goals selected.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">Deterministic Jaccard Coefficient Model</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-sm transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
