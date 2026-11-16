import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CompatibilityBadge from './CompatibilityBadge';
import CompatibilityModal from './CompatibilityModal';
import SendRequestModal from './SendRequestModal';
import {
  UserCheck,
  Clock,
  UserPlus,
  Eye,
  Sparkles,
  BookOpen,
  Calendar,
  GraduationCap,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

export default function StudentCard({ studentData, onSendRequest }) {
  const [showCompModal, setShowCompModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

  const user = studentData.user || studentData;
  const profile = studentData.profile || {};
  const compatibility = studentData.compatibility || {
    score: 0,
    category: 'Moderate Match',
    breakdown: {},
    sharedSubjects: [],
    sharedInterests: [],
    matchingAvailability: [],
    overlappingAvailability: [],
    statements: []
  };
  const connectionStatus = studentData.connectionStatus || 'none';

  const avatarUrl =
    user.avatar ||
    profile.avatar ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.fullName || user.name || 'Student')}`;

  const studentName = user.fullName || user.name || 'Student';
  const subjects = profile.subjects || [];
  const interests = profile.interests || [];
  const sharedSubs = compatibility.sharedSubjects || [];
  const sharedAvail = compatibility.overlappingAvailability || compatibility.matchingAvailability || [];
  const sharedInts = compatibility.sharedInterests || [];

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft hover:shadow-card hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
        {/* Card Header & Profile Info */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <img
                  src={avatarUrl}
                  alt={studentName}
                  className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-sm group-hover:scale-102 transition"
                />
                <span
                  className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"
                  title="Verified Student"
                />
              </div>

              <div className="min-w-0">
                <Link
                  to={`/profile/${user._id || user.id}`}
                  className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition line-clamp-1 block"
                >
                  {studentName}
                </Link>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                  <span className="truncate">
                    {user.department} • {user.yearOfStudy || user.year}
                  </span>
                </p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {user.college}
                </p>
              </div>
            </div>

            {/* Deterministic Compatibility Badge */}
            <div className="flex-shrink-0">
              <CompatibilityBadge
                score={compatibility.score}
                size="sm"
                onClick={() => setShowCompModal(true)}
              />
            </div>
          </div>

          {/* Compatibility Highlights Preview Bar */}
          <div className="mt-3.5 pt-2.5 border-t border-slate-100 grid grid-cols-3 gap-1 bg-slate-50/70 p-2 rounded-xl text-[11px] text-slate-600">
            <div className="text-center">
              <span className="block font-bold text-indigo-600 text-xs">
                {sharedSubs.length}
              </span>
              <span className="text-[10px] text-slate-400">Shared Subs</span>
            </div>
            <div className="text-center border-x border-slate-200/70">
              <span className="block font-bold text-violet-600 text-xs">
                {sharedAvail.length}
              </span>
              <span className="text-[10px] text-slate-400">Slot Overlaps</span>
            </div>
            <div className="text-center">
              <span className="block font-bold text-purple-600 text-xs">
                {sharedInts.length}
              </span>
              <span className="text-[10px] text-slate-400">Interests</span>
            </div>
          </div>

          {/* Bio Preview */}
          {profile.bio && (
            <p className="text-xs text-slate-600 mt-3 line-clamp-2 italic leading-relaxed">
              "{profile.bio}"
            </p>
          )}

          {/* Why this match micro-statement */}
          {compatibility.statements && compatibility.statements.length > 0 && (
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-indigo-700 bg-indigo-50/70 px-2.5 py-1.5 rounded-lg border border-indigo-100/80">
              <span className="truncate font-medium">{compatibility.statements[0]}</span>
              <button
                type="button"
                onClick={() => setShowCompModal(true)}
                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-900 ml-1.5 flex items-center gap-0.5 flex-shrink-0"
                title="View full explanation"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Why?</span>
              </button>
            </div>
          )}

          {/* Subjects Tag List */}
          <div className="mt-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-slate-400" />
              Subjects & Coursework
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-16 overflow-hidden">
              {subjects.slice(0, 3).map((sub, idx) => {
                const isShared = sharedSubs.some(
                  (s) => s.toLowerCase() === sub.toLowerCase()
                );
                return (
                  <span
                    key={idx}
                    className={`text-xs px-2 py-0.5 rounded-lg font-medium transition ${
                      isShared
                        ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {sub}
                  </span>
                );
              })}
              {subjects.length > 3 && (
                <span className="text-[11px] px-1.5 py-0.5 rounded-lg bg-slate-50 text-slate-500 font-medium border border-slate-200">
                  +{subjects.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Interests Pills */}
          {interests.length > 0 && (
            <div className="mt-2.5">
              <div className="flex flex-wrap gap-1 max-h-8 overflow-hidden">
                {interests.slice(0, 3).map((intItem, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100"
                  >
                    {intItem}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Availability & Mode row */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5 truncate">
              <Calendar className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
              <span className="truncate">
                {profile.availability && profile.availability.length > 0
                  ? profile.availability.slice(0, 3).map((a) => a.day.slice(0, 3)).join(', ')
                  : 'Flexible'}
              </span>
            </div>
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 text-violet-700 border border-violet-100">
              {profile.preferredStudyMode || 'Hybrid'}
            </span>
          </div>
        </div>

        {/* Card Actions Footer */}
        <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
          <Link
            to={`/profile/${user._id || user.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
          >
            <Eye className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
            <span>View Profile</span>
          </Link>

          {/* Relationship Action Button */}
          {connectionStatus === 'accepted' ? (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              Connected
            </span>
          ) : connectionStatus === 'pending_sent' ? (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Request Sent
            </span>
          ) : connectionStatus === 'pending_received' ? (
            <Link
              to="/requests"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition"
            >
              Respond
              <ArrowRight className="w-3 h-3" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setShowSendModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition hover:scale-102 active:scale-98"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Connect
            </button>
          )}
        </div>
      </div>

      {/* Compatibility Deep-Dive Modal */}
      <CompatibilityModal
        isOpen={showCompModal}
        onClose={() => setShowCompModal(false)}
        studentName={studentName}
        compatibility={compatibility}
      />

      {/* Send Partner Request Modal */}
      <SendRequestModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        student={studentData}
        onSend={onSendRequest}
      />
    </>
  );
}
