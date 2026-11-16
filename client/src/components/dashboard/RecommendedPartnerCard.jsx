import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CompatibilityBadge from '../CompatibilityBadge';
import CompatibilityModal from '../CompatibilityModal';
import SendRequestModal from '../SendRequestModal';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Heart,
  Clock,
  UserCheck,
  UserPlus,
  Eye,
  GraduationCap
} from 'lucide-react';

export default function RecommendedPartnerCard({ recommendations = [], onSendRequest }) {
  const [activeModalStudent, setActiveModalStudent] = useState(null);
  const [activeSendStudent, setActiveSendStudent] = useState(null);

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Recommended Study Partners
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked by shared courses, overlapping availability, and academic ambitions.
          </p>
        </div>

        <Link
          to="/find-partners"
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Cards Grid */}
      {recommendations && recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {recommendations.map((item) => {
            const user = item.user;
            const profile = item.profile || {};
            const comp = item.compatibility || { score: 0 };
            const status = item.connectionStatus || 'none';
            const displayName = user.fullName || user.name;
            const displayYear = user.yearOfStudy || user.year || 'Student';

            // Availability snippet
            const availText =
              profile.availability && profile.availability.length > 0
                ? profile.availability.slice(0, 2).map((a) => a.day.slice(0, 3)).join(', ')
                : 'Flexible';

            return (
              <div
                key={user._id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-soft hover:shadow-card hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5 space-y-4">
                  {/* Top: Avatar & Compatibility */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="relative">
                      <img
                        src={
                          user.avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`
                        }
                        alt={displayName}
                        className="w-13 h-13 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
                      />
                      <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>

                    <CompatibilityBadge
                      score={comp.score}
                      size="sm"
                      onClick={() => setActiveModalStudent({ user, compatibility: comp })}
                    />
                  </div>

                  {/* Student Identity */}
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors truncate">
                      {displayName}
                    </h3>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                      <GraduationCap className="w-3 h-3 text-indigo-500 flex-shrink-0" />
                      <span>{user.department} • {displayYear}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {user.college}
                    </p>
                  </div>

                  {/* Shared Subjects */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-indigo-500" /> Coursework
                    </span>
                    <div className="flex flex-wrap gap-1 max-h-12 overflow-hidden">
                      {(profile.subjects || []).slice(0, 2).map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-indigo-50 text-indigo-800 border border-indigo-100"
                        >
                          {s}
                        </span>
                      ))}
                      {(profile.subjects || []).length > 2 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
                          +{(profile.subjects || []).length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 truncate">
                      <Clock className="w-3 h-3 text-violet-500 flex-shrink-0" />
                      <span className="truncate">{availText}</span>
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-violet-50 text-violet-700">
                      {profile.preferredStudyMode || 'Hybrid'}
                    </span>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    to={`/profile/${user._id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </Link>

                  {status === 'accepted' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                      <UserCheck className="w-3.5 h-3.5" /> Partners
                    </span>
                  ) : status === 'pending_sent' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                      <Clock className="w-3.5 h-3.5" /> Sent
                    </span>
                  ) : status === 'pending_received' ? (
                    <Link
                      to="/requests"
                      className="inline-flex items-center gap-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-xl shadow-sm transition"
                    >
                      Respond
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveSendStudent(user)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-xl shadow-sm transition hover:scale-102"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Connect
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3 py-10">
          <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No partner recommendations yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Complete your profile with your enrolled courses and availability schedule to begin generating compatibility matches.
          </p>
          <Link
            to="/edit-profile"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl"
          >
            Complete Profile Now
          </Link>
        </div>
      )}

      {/* Compatibility Modal */}
      {activeModalStudent && (
        <CompatibilityModal
          isOpen={Boolean(activeModalStudent)}
          onClose={() => setActiveModalStudent(null)}
          studentName={activeModalStudent.user.fullName || activeModalStudent.user.name}
          compatibility={activeModalStudent.compatibility}
        />
      )}

      {/* Send Request Modal */}
      {activeSendStudent && (
        <SendRequestModal
          isOpen={Boolean(activeSendStudent)}
          onClose={() => setActiveSendStudent(null)}
          student={activeSendStudent}
          onSend={onSendRequest}
        />
      )}
    </div>
  );
}

