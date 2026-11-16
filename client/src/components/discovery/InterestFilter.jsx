import React, { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';

const COMMON_INTERESTS = [
  'Artificial Intelligence',
  'Competitive Programming',
  'Robotics',
  'Open Source',
  'Distributed Systems',
  'Data Analytics',
  'Cloud Architecture',
  'Cybersecurity',
  'Bioinformatics',
  'Mobile App Development',
  'Natural Language Processing',
  'Deep Learning'
];

export default function InterestFilter({ selectedInterests, onChange }) {
  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      onChange(selectedInterests.filter(i => i !== interest));
    } else {
      onChange([...selectedInterests, interest]);
    }
  };

  return (
    <div className="space-y-3 pt-3 border-t border-slate-100">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          Academic Interests
        </span>
        {selectedInterests.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition"
          >
            Clear ({selectedInterests.length})
          </button>
        )}
      </div>

      <div className="max-h-36 overflow-y-auto space-y-1 pr-1 text-xs scrollbar-thin">
        {COMMON_INTERESTS.map((interest) => {
          const isSelected = selectedInterests.includes(interest);
          return (
            <label
              key={interest}
              className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition select-none ${
                isSelected ? 'bg-indigo-50 text-indigo-900 font-medium' : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleInterest(interest)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span className="truncate">{interest}</span>
              </div>
              {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />}
            </label>
          );
        })}
      </div>
    </div>
  );
}

