import React from 'react';
import { Clock, Check, Calendar } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SLOTS = [
  'Morning: 6 AM – 12 PM',
  'Afternoon: 12 PM – 5 PM',
  'Evening: 5 PM – 10 PM'
];

export default function SchedulePicker({ value = [], onChange }) {
  // Helper to match slot with flexible string handling
  const isSlotSelected = (day, targetSlot) => {
    const dayObj = value.find((d) => d.day === day);
    if (!dayObj || !Array.isArray(dayObj.slots)) return false;

    const normalizedTarget = targetSlot.toLowerCase().split(':')[0]; // 'morning', 'afternoon', 'evening'
    return dayObj.slots.some(
      (s) =>
        s.toLowerCase() === targetSlot.toLowerCase() ||
        s.toLowerCase().startsWith(normalizedTarget)
    );
  };

  const toggleSlot = (day, targetSlot) => {
    let updated = JSON.parse(JSON.stringify(value || []));
    const dayIndex = updated.findIndex((d) => d.day === day);

    if (dayIndex > -1) {
      const dayObj = updated[dayIndex];
      const slotIndex = dayObj.slots.findIndex(
        (s) =>
          s.toLowerCase() === targetSlot.toLowerCase() ||
          s.toLowerCase().startsWith(targetSlot.toLowerCase().split(':')[0])
      );

      if (slotIndex > -1) {
        dayObj.slots.splice(slotIndex, 1);
        if (dayObj.slots.length === 0) {
          updated.splice(dayIndex, 1);
        }
      } else {
        dayObj.slots.push(targetSlot);
      }
    } else {
      updated.push({
        day,
        slots: [targetSlot]
      });
    }

    onChange(updated);
  };

  const clearAll = () => {
    onChange([]);
  };

  const setWeekdayEvenings = () => {
    const preset = [
      { day: 'Monday', slots: ['Evening: 5 PM – 10 PM'] },
      { day: 'Tuesday', slots: ['Evening: 5 PM – 10 PM'] },
      { day: 'Wednesday', slots: ['Evening: 5 PM – 10 PM'] },
      { day: 'Thursday', slots: ['Evening: 5 PM – 10 PM'] },
      { day: 'Friday', slots: ['Evening: 5 PM – 10 PM'] }
    ];
    onChange(preset);
  };

  const setWeekendFocus = () => {
    const preset = [
      { day: 'Saturday', slots: ['Morning: 6 AM – 12 PM', 'Afternoon: 12 PM – 5 PM'] },
      { day: 'Sunday', slots: ['Morning: 6 AM – 12 PM', 'Afternoon: 12 PM – 5 PM'] }
    ];
    onChange(preset);
  };

  // Calculate total selected slots
  const totalSlotsCount = (value || []).reduce(
    (acc, curr) => acc + (curr.slots ? curr.slots.length : 0),
    0
  );

  return (
    <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            Weekly Availability Schedule
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Select your regular free windows. The matching algorithm weights this by 30% to find compatible study times.
          </p>
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={setWeekdayEvenings}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 font-medium transition"
          >
            + Weekday Evenings
          </button>
          <button
            type="button"
            onClick={setWeekendFocus}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 font-medium transition"
          >
            + Weekend Focus
          </button>
          {totalSlotsCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-[11px] px-2 py-1 text-rose-500 hover:text-rose-700 font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Interactive Matrix Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          {/* Header row */}
          <div className="grid grid-cols-4 gap-2 pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
            <div>Day of Week</div>
            {SLOTS.map((s, idx) => (
              <div key={idx} className="text-center">
                <span className="block text-slate-700">{s.split(':')[0]}</span>
                <span className="block text-[10px] text-slate-400 font-normal">
                  {s.split(':')[1]?.trim() || ''}
                </span>
              </div>
            ))}
          </div>

          {/* Day rows */}
          <div className="divide-y divide-slate-200/70 mt-1">
            {DAYS.map((day) => (
              <div key={day} className="grid grid-cols-4 gap-2 py-2 items-center">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {day}
                </span>

                {SLOTS.map((slot) => {
                  const selected = isSlotSelected(day, slot);
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => toggleSlot(day, slot)}
                      className={`h-9 rounded-xl border text-xs font-semibold flex items-center justify-center transition-all ${
                        selected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40'
                      }`}
                    >
                      {selected ? (
                        <span className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Available</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal">+ Select</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected summary */}
      <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
        <span>
          Selected: <strong className="text-indigo-600 font-bold">{totalSlotsCount}</strong> time window(s) per week
        </span>
        <span className="text-[11px] text-slate-400 italic">
          More matching windows increase student compatibility score
        </span>
      </div>
    </div>
  );
}
