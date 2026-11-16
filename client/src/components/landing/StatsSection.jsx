import React from 'react';
import { Users, BookOpen, UserCheck, Sparkles } from 'lucide-react';

export default function StatsSection() {
  const stats = [
    {
      label: 'Students Connected',
      value: '5,000+',
      description: 'Active campus study partners',
      icon: Users,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20'
    },
    {
      label: 'Study Subjects',
      value: '120+',
      description: 'STEM, CS, Engineering & Bio courses',
      icon: BookOpen,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/20'
    },
    {
      label: 'Successful Partnerships',
      value: '1,800+',
      description: 'Collaborative lab groups formed',
      icon: UserCheck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      label: 'Compatibility Matching',
      value: '98%',
      description: 'Weighted 4-factor precision rate',
      icon: Sparkles,
      color: 'text-pink-400',
      bg: 'bg-pink-500/10 border-pink-500/20'
    }
  ];

  return (
    <section className="relative py-12 bg-slate-900 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-slate-850/80 border border-slate-800 shadow-sm hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${stat.bg} ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {stat.value}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{stat.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note on illustrative metrics */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-400 uppercase tracking-widest font-medium">
            * Demonstration metrics illustrating platform capability & matching throughput.
          </p>
        </div>
      </div>
    </section>
  );
}

