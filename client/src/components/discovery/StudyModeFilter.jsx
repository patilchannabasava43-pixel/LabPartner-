import React from 'react';
import { Award, Monitor } from 'lucide-react';

const YEARS = [
  'All',
  'First Year',
  'Second Year',
  'Third Year',
  'Fourth Year',
  'Graduate / Masters',
  'Other'
];

const MODES = [
  { id: 'All', label: 'All Modes' },
  { id: 'Online', label: 'Online Only' },
  { id: 'Offline', label: 'In-Person / Offline' },
  { id: 'Both', label: 'Hybrid / Both' }
];

export default function StudyModeFilter({
  selectedMode,
  selectedYear,
  onModeChange,
  onYearChange
}) {
  return (
    <div className="space-y-4 pt-3 border-t border-slate-100">
      {/* Year of Study */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-indigo-600" />
            Year of Study
          </span>
          {selectedYear !== 'All' && (
            <button
              type="button"
              onClick={() => onYearChange('All')}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition"
            >
              Reset
            </button>
          )}
        </div>
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer transition"
        >
          {YEARS.map((yr) => (
            <option key={yr} value={yr}>
              {yr === 'All' ? 'All Years' : yr}
            </option>
          ))}
        </select>
      </div>

      {/* Study Mode */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5 text-indigo-600" />
            Study Mode
          </span>
          {selectedMode !== 'All' && (
            <button
              type="button"
              onClick={() => onModeChange('All')}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition"
            >
              Reset
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {MODES.map((mode) => {
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => onModeChange(mode.id)}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium text-center transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

