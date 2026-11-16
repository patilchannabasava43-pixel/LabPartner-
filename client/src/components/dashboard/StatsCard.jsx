import React from 'react';
import { UserCheck, Inbox, CheckCircle, Users } from 'lucide-react';

export default function StatsCard({ stats }) {
  const cards = [
    {
      label: 'Total Partners',
      value: stats?.totalPartners ?? 0,
      description: 'Confirmed study partners',
      icon: UserCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-100',
      glow: 'group-hover:border-emerald-300'
    },
    {
      label: 'Pending Requests',
      value: stats?.pendingIncoming ?? 0,
      description: 'Awaiting your response',
      icon: Inbox,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-100',
      glow: 'group-hover:border-indigo-300'
    },
    {
      label: 'Profile Completion',
      value: `${stats?.profileCompletion ?? 0}%`,
      description: 'Algorithm readiness score',
      icon: CheckCircle,
      color: 'text-violet-600',
      bg: 'bg-violet-50 border-violet-100',
      glow: 'group-hover:border-violet-300'
    },
    {
      label: 'Recommended Students',
      value: stats?.totalRecommendations ?? 0,
      description: 'Compatible campus peers',
      icon: Users,
      color: 'text-pink-600',
      bg: 'bg-pink-50 border-pink-100',
      glow: 'group-hover:border-pink-300'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`group bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between ${card.glow}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider truncate">
                {card.label}
              </span>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${card.bg} ${card.color} group-hover:scale-105 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {card.value}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 truncate">{card.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

