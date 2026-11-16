import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = [
  { id: 'morning', label: 'Morning (6 AM – 12 PM)' },
  { id: 'afternoon', label: 'Afternoon (12 PM – 5 PM)' },
  { id: 'evening', label: 'Evening (5 PM – 10 PM)' }
];

export default function AvailabilityFilter({ selectedDays, selectedSlots, onDaysChange, onSlotsChange }) {
  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      onDaysChange(selectedDays.filter(d => d !== day));
    } else {
      onDaysChange([...selectedDays, day]);
    }
  };

  const toggleSlot = (slotId) => {
    if (selectedSlots.includes(slotId)) {
      onSlotsChange(selectedSlots.filter(s => s !== slotId));
    } else {
      onSlotsChange([...selectedSlots, slotId]);
    }
  };

  return (
    <div className="space-y-3 pt-3 border-t border-slate-100">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
          Availability Overlap
        </span>
        {(selectedDays.length > 0 || selectedSlots.length > 0) && (
          <button
            type="button"
            onClick={() => {
              onDaysChange([]);
              onSlotsChange([]);
            }}
            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition"
          >
            Clear
          </button>
        )}
      </div>

      {/* Days of week pill selector */}
      <div>
        <span className="text-[11px] font-medium text-slate-500 block mb-1.5">Select Days:</span>
        <div className="grid grid-cols-4 gap-1">
          {DAYS.map((day) => {
            const isSelected = selectedDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`py-1 px-1.5 text-[11px] rounded-lg font-medium text-center transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      <div>
        <span className="text-[11px] font-medium text-slate-500 block mb-1.5 flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" />
          Preferred Time Windows:
        </span>
        <div className="space-y-1">
          {TIME_SLOTS.map((slot) => {
            const isSelected = selectedSlots.includes(slot.id);
            return (
              <label
                key={slot.id}
                className={`flex items-center gap-2 p-1.5 rounded-lg text-xs cursor-pointer transition select-none ${
                  isSelected ? 'bg-indigo-50 text-indigo-900 font-medium' : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSlot(slot.id)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span>{slot.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

