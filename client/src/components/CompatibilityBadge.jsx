import React from 'react';
import { Sparkles } from 'lucide-react';

/**
 * Stage 7 Compatibility Badge
 * Categories:
 * 90–100: Excellent Match (Emerald/Green)
 * 75–89: Great Match (Indigo/Purple)
 * 60–74: Good Match (Blue/Indigo)
 * 40–59: Moderate Match (Amber/Orange)
 * 0–39: Low Match (Slate/Gray)
 */
export default function CompatibilityBadge({ score = 0, size = 'md', onClick, showCategory = false }) {
  let colorClasses = 'from-slate-600 to-slate-700 text-white';
  let ringColor = 'ring-slate-300';
  let badgeLabel = 'Low Match';

  if (score >= 90) {
    colorClasses = 'from-emerald-500 to-teal-600 text-white';
    ringColor = 'ring-emerald-300';
    badgeLabel = 'Excellent Match';
  } else if (score >= 75) {
    colorClasses = 'from-indigo-600 to-violet-600 text-white';
    ringColor = 'ring-indigo-300';
    badgeLabel = 'Great Match';
  } else if (score >= 60) {
    colorClasses = 'from-blue-600 to-indigo-600 text-white';
    ringColor = 'ring-blue-300';
    badgeLabel = 'Good Match';
  } else if (score >= 40) {
    colorClasses = 'from-amber-500 to-orange-500 text-white';
    ringColor = 'ring-amber-300';
    badgeLabel = 'Moderate Match';
  }

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center gap-1.5 rounded-full font-bold transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 ${
        isSmall
          ? 'px-2.5 py-0.5 text-xs'
          : isLarge
          ? 'px-4 py-2 text-base'
          : 'px-3 py-1 text-xs sm:text-sm'
      } bg-gradient-to-r ${colorClasses} ring-2 ${ringColor}`}
      title="Click to view full compatibility breakdown"
    >
      <Sparkles className={`${isSmall ? 'w-3 h-3' : isLarge ? 'w-4 h-4' : 'w-3.5 h-3.5'} animate-pulse`} />
      <span>{score}% Match</span>
      {(showCategory || !isSmall) && (
        <span className="hidden sm:inline-block text-[11px] opacity-90 font-medium border-l border-white/30 pl-1.5">
          {badgeLabel}
        </span>
      )}
    </button>
  );
}
