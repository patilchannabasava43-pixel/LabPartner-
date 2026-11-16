import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Inbox, Send, UserCheck, ArrowRight, Eye, Check, X, Clock } from 'lucide-react';

export default function RequestSummary({ requestsSummary, onAcceptRequest, onRejectRequest }) {
  const [tab, setTab] = useState('incoming'); // 'incoming' | 'outgoing' | 'accepted'

  const incoming = requestsSummary?.incoming || [];
  const outgoing = requestsSummary?.outgoing || [];
  const accepted = requestsSummary?.recentlyAccepted || [];

  return (
    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Inbox className="w-5 h-5 text-indigo-600" />
              Partner Requests
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review collaboration invitations and pending statuses.
            </p>
          </div>

          <Link
            to="/requests"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>Full Inbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 pt-3 pb-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTab('incoming')}
            className={`px-3 py-1.5 rounded-xl transition ${
              tab === 'incoming'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Incoming ({incoming.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('outgoing')}
            className={`px-3 py-1.5 rounded-xl transition ${
              tab === 'outgoing'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Outgoing ({outgoing.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('accepted')}
            className={`px-3 py-1.5 rounded-xl transition ${
              tab === 'accepted'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Active Partners ({accepted.length})
          </button>
        </div>

        {/* List Content */}
        <div className="mt-3 space-y-3">
          {tab === 'incoming' && (
            incoming.length > 0 ? (
              incoming.map((r) => {
                const s = r.student;
                const displayName = s.fullName || s.name;
                return (
                  <div
                    key={r._id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={s.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`}
                        alt={displayName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{displayName}</h4>
                        <p className="text-[11px] text-slate-500 truncate">{s.department}</p>
                        <p className="text-[10px] text-slate-400 italic truncate">"{r.message}"</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Link
                        to={`/profile/${s._id}`}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 text-xs"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => onRejectRequest && onRejectRequest(r._id)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200"
                        title="Decline"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onAcceptRequest && onAcceptRequest(r._id)}
                        className="p-1.5 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                        title="Accept"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 italic py-4 text-center">No incoming partner requests at the moment.</p>
            )
          )}

          {tab === 'outgoing' && (
            outgoing.length > 0 ? (
              outgoing.map((r) => {
                const s = r.student;
                const displayName = s.fullName || s.name;
                return (
                  <div
                    key={r._id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={s.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`}
                        alt={displayName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{displayName}</h4>
                        <p className="text-[11px] text-slate-500 truncate">{s.department}</p>
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 font-semibold">
                          <Clock className="w-3 h-3" /> Pending Response
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/profile/${s._id}`}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 text-xs"
                      title="View Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 italic py-4 text-center">No outgoing partner requests sent yet.</p>
            )
          )}

          {tab === 'accepted' && (
            accepted.length > 0 ? (
              accepted.map((r) => {
                const s = r.student;
                const displayName = s.fullName || s.name;
                return (
                  <div
                    key={r._id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={s.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`}
                        alt={displayName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{displayName}</h4>
                        <p className="text-[11px] text-slate-500 truncate">{s.department}</p>
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                          <UserCheck className="w-3 h-3" /> Study Partners
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/profile/${s._id}`}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 text-xs"
                      title="View Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 italic py-4 text-center">No confirmed study partners yet.</p>
            )
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
        <span className="text-slate-400">Total Requests: {incoming.length + outgoing.length}</span>
        <Link
          to="/requests"
          className="font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          Manage Requests <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

