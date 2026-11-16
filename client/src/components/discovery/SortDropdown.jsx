import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export default function SortDropdown({ value, onChange }) {
  const SORT_OPTIONS = [
    { value: 'compatibility', label: 'Best Match (Highest Compatibility)' },
    { value: 'subjects', label: 'Most Shared Subjects' },
    { value: 'interests', label: 'Most Shared Interests' },
    { value: 'availability', label: 'Most Available Time Overlap' },
    { value: 'recent', label: 'Recently Joined' },
    { value: 'name', label: 'Name (A to Z)' }
  ];

  return (
    <div className="relative inline-flex items-center">
      <div className="absolute left-3 pointer-events-none text-slate-400">
        <ArrowUpDown className="w-3.5 h-3.5" />
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-sm appearance-none cursor-pointer transition"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 pointer-events-none text-slate-400 text-xs">
        ▼
      </div>
    </div>
  );
}

