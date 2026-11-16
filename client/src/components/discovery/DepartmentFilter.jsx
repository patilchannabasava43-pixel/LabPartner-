import React from 'react';
import { GraduationCap } from 'lucide-react';

const DEPARTMENTS = [
  'All',
  'Computer Science',
  'Information Technology',
  'Data Science',
  'Artificial Intelligence',
  'Electrical & Computer Eng',
  'Electronics',
  'Mechanical',
  'Civil',
  'Bioengineering',
  'Other'
];

export default function DepartmentFilter({ selectedDepartment, onChange }) {
  return (
    <div className="space-y-2 pt-3 border-t border-slate-100">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
          Department
        </span>
        {selectedDepartment !== 'All' && (
          <button
            type="button"
            onClick={() => onChange('All')}
            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition"
          >
            Reset
          </button>
        )}
      </div>

      <select
        value={selectedDepartment}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer transition"
      >
        {DEPARTMENTS.map((dept) => (
          <option key={dept} value={dept}>
            {dept === 'All' ? 'All Departments' : dept}
          </option>
        ))}
      </select>
    </div>
  );
}

