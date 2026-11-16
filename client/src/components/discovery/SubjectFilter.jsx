import React, { useState } from 'react';
import { BookOpen, Search, Check, Plus } from 'lucide-react';

const COMMON_SUBJECTS = [
  'Data Structures & Algorithms',
  'Operating Systems',
  'Machine Learning',
  'Database Systems',
  'Computer Networks',
  'Distributed Systems',
  'Cloud Computing',
  'Computer Vision',
  'Bioinformatics',
  'Web Development',
  'Deep Learning',
  'Embedded Systems',
  'Probability & Statistics',
  'Discrete Mathematics'
];

export default function SubjectFilter({ selectedSubjects, onChange }) {
  const [searchCustom, setSearchCustom] = useState('');

  const toggleSubject = (sub) => {
    if (selectedSubjects.includes(sub)) {
      onChange(selectedSubjects.filter(s => s !== sub));
    } else {
      onChange([...selectedSubjects, sub]);
    }
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    const trimmed = searchCustom.trim();
    if (trimmed && !selectedSubjects.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...selectedSubjects, trimmed]);
      setSearchCustom('');
    }
  };

  // Filter common subjects with search input
  const filteredOptions = COMMON_SUBJECTS.filter(s =>
    s.toLowerCase().includes(searchCustom.toLowerCase().trim())
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          Subjects
        </span>
        {selectedSubjects.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition"
          >
            Clear ({selectedSubjects.length})
          </button>
        )}
      </div>

      {/* Quick custom subject search / add */}
      <form onSubmit={handleAddCustom} className="relative">
        <input
          type="text"
          value={searchCustom}
          onChange={(e) => setSearchCustom(e.target.value)}
          placeholder="Filter or add subject..."
          className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
        {searchCustom.trim() && (
          <button
            type="submit"
            className="absolute right-1.5 top-1 px-1.5 py-0.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-bold flex items-center gap-0.5"
            title="Add as filter"
          >
            <Plus className="w-3 h-3" />
          </button>
        )}
      </form>

      {/* Selected tags */}
      {selectedSubjects.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {selectedSubjects.map((sub) => (
            <button
              key={sub}
              type="button"
              onClick={() => toggleSubject(sub)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border border-indigo-200 transition"
            >
              <span>{sub}</span>
              <span className="text-indigo-500 hover:text-indigo-800">×</span>
            </button>
          ))}
        </div>
      )}

      {/* Available choices */}
      <div className="max-h-40 overflow-y-auto space-y-1 pr-1 text-xs scrollbar-thin">
        {filteredOptions.map((sub) => {
          const isSelected = selectedSubjects.includes(sub);
          return (
            <label
              key={sub}
              className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition select-none ${
                isSelected ? 'bg-indigo-50 text-indigo-900 font-medium' : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSubject(sub)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span className="truncate">{sub}</span>
              </div>
              {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />}
            </label>
          );
        })}
      </div>
    </div>
  );
}

