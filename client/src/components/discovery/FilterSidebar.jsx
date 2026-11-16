import React from 'react';
import { Filter, RotateCcw, SlidersHorizontal, Check } from 'lucide-react';
import SubjectFilter from './SubjectFilter';
import AvailabilityFilter from './AvailabilityFilter';
import InterestFilter from './InterestFilter';
import DepartmentFilter from './DepartmentFilter';
import StudyModeFilter from './StudyModeFilter';

export default function FilterSidebar({
  selectedSubjects,
  selectedInterests,
  selectedDays,
  selectedSlots,
  selectedDepartment,
  selectedYear,
  selectedMode,
  minScore,
  onSubjectsChange,
  onInterestsChange,
  onDaysChange,
  onSlotsChange,
  onDepartmentChange,
  onYearChange,
  onModeChange,
  onMinScoreChange,
  onResetFilters,
  activeFilterCount
}) {
  return (
    <aside className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 space-y-5">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Filters</h3>
            <p className="text-[11px] text-slate-500">Refine study partners</p>
          </div>
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition"
          >
            <RotateCcw className="w-3 h-3" />
            Clear All ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Min Compatibility Slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
            Min Compatibility
          </span>
          <span className="font-bold text-indigo-600">{minScore}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="80"
          step="5"
          value={minScore}
          onChange={(e) => onMinScoreChange(parseInt(e.target.value, 10))}
          className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>Any (0%)</span>
          <span>Moderate (40%)</span>
          <span>High (80%)</span>
        </div>
      </div>

      {/* 1. Subjects Filter */}
      <SubjectFilter
        selectedSubjects={selectedSubjects}
        onChange={onSubjectsChange}
      />

      {/* 2. Availability Filter */}
      <AvailabilityFilter
        selectedDays={selectedDays}
        selectedSlots={selectedSlots}
        onDaysChange={onDaysChange}
        onSlotsChange={onSlotsChange}
      />

      {/* 3. Interests Filter */}
      <InterestFilter
        selectedInterests={selectedInterests}
        onChange={onInterestsChange}
      />

      {/* 4. Department Filter */}
      <DepartmentFilter
        selectedDepartment={selectedDepartment}
        onChange={onDepartmentChange}
      />

      {/* 5. Study Mode and Year Filter */}
      <StudyModeFilter
        selectedMode={selectedMode}
        selectedYear={selectedYear}
        onModeChange={onModeChange}
        onYearChange={onYearChange}
      />

      {/* Reset Button at bottom */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onResetFilters}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          Reset All Filters
        </button>
      </div>
    </aside>
  );
}

