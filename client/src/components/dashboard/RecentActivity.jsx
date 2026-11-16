import React from 'react';
import { Activity, Inbox, Send, UserCheck, Edit3, Clock } from 'lucide-react';

export default function RecentActivity({ activities = [] }) {
  const getIcon = (type) => {
    switch (type) {
      case 'request_received':
        return <Inbox className="w-4 h-4 text-indigo-600" />;
      case 'request_sent':
        return <Send className="w-4 h-4 text-violet-600" />;
      case 'partnership_active':
        return <UserCheck className="w-4 h-4 text-emerald-600" />;
      case 'profile_updated':
        return <Edit3 className="w-4 h-4 text-pink-600" />;
      default:
        return <Activity className="w-4 h-4 text-slate-500" />;
    }
  };

  const formatTime = (ts) => {
    if (!ts) return 'Recently';
    const date = new Date(ts);
    const now = new Date();
    const diffMin = Math.round((now - date) / (1000 * 60));

    if (diffMin < 2) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.round(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-soft hover:shadow-card transition-all duration-300">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          Recent Activity Timeline
        </h2>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Live Audit Feed
        </span>
      </div>

      {activities && activities.length > 0 ? (
        <div className="space-y-3.5">
          {activities.map((act) => (
            <div
              key={act.id}
              className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition"
            >
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                {getIcon(act.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{act.title}</h4>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {formatTime(act.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {act.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <Activity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-500">No activity recorded yet.</p>
        </div>
      )}
    </div>
  );
}

