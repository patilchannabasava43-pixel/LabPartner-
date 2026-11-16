import React from 'react';
import { Link } from 'react-router-dom';
import { Search, UserCheck, Clock, User, ArrowRight } from 'lucide-react';

export default function QuickActionCard() {
  const actions = [
    {
      title: 'Find Study Partners',
      description: 'Filter peers by coursework and schedule slots',
      to: '/find-partners',
      icon: Search,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-100',
      btnText: 'Discover'
    },
    {
      title: 'Complete My Profile',
      description: 'Update subjects, technical skills & academic bio',
      to: '/edit-profile',
      icon: User,
      color: 'text-violet-600',
      bg: 'bg-violet-50 border-violet-100',
      btnText: 'Update'
    },
    {
      title: 'Manage Availability',
      description: 'Adjust weekly study days and time windows',
      to: '/edit-profile',
      icon: Clock,
      color: 'text-pink-600',
      bg: 'bg-pink-50 border-pink-100',
      btnText: 'Schedule'
    },
    {
      title: 'View My Partners',
      description: 'Access contact channels and shared subjects',
      to: '/my-partners',
      icon: UserCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-100',
      btnText: 'Partners'
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-slate-900 tracking-tight">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <Link
              key={idx}
              to={act.to}
              className="group bg-white p-5 rounded-3xl border border-slate-200/90 shadow-soft hover:shadow-card hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${act.bg} ${act.color} mb-3 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {act.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {act.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                <span>{act.btnText}</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

