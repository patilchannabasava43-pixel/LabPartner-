import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CompatibilityBadge from '../components/CompatibilityBadge';
import CompatibilityModal from '../components/CompatibilityModal';
import api from '../api/axios';
import {
  UserCheck,
  Mail,
  Phone,
  Github,
  Linkedin,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  BookOpen,
  Clock,
  ExternalLink,
  MessageCircle,
  GraduationCap,
  Target,
  Users,
  Compass,
  AlertCircle,
  RotateCcw
} from 'lucide-react';

export default function MyPartnersPage() {
  const { user, showToast } = useAuth();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedComp, setSelectedComp] = useState(null);
  const [selectedName, setSelectedName] = useState('');

  const fetchPartners = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/partners');
      if (res.data.success) {
        setPartners(res.data.partners || []);
      }
    } catch (err) {
      console.error('Failed to load partners:', err);
      setError(err.response?.data?.message || 'Error loading confirmed partners.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Active Study Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-emerald-600" />
            My Study & Lab Partners
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Confirmed academic collaborators. Access direct contacts, shared coursework, and coordinate study schedules.
          </p>
        </div>

        <Link
          to="/find-partners"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition self-start sm:self-auto"
        >
          <span>Find More Partners</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-bold text-rose-900">Failed to Load Partners</h4>
            <p className="text-xs text-rose-700 mt-0.5">{error}</p>
            <button
              type="button"
              onClick={fetchPartners}
              className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Partners Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="bg-white p-6 rounded-3xl border border-slate-200 animate-pulse h-64 shadow-soft"
            />
          ))}
        </div>
      ) : partners.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {partners.map(({ requestId, connectedSince, partner, profile, compatibility }) => {
            const partnerName = partner.fullName || partner.name || 'Partner';
            const avatarUrl =
              partner.avatar ||
              profile?.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(partnerName)}`;

            const sharedSubs = compatibility?.sharedSubjects || [];
            const sharedInts = compatibility?.sharedInterests || [];

            return (
              <div
                key={requestId}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-soft hover:shadow-card hover:border-emerald-200 transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Partner Card Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="relative flex-shrink-0">
                        <img
                          src={avatarUrl}
                          alt={partnerName}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
                        />
                        <span
                          className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"
                          title="Active Partner"
                        />
                      </div>

                      <div className="min-w-0">
                        <Link
                          to={`/profile/${partner._id || partner.id}`}
                          className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition line-clamp-1 block"
                        >
                          {partnerName}
                        </Link>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                          <GraduationCap className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>{partner.department} • {partner.yearOfStudy || partner.year}</span>
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {partner.college}
                        </p>
                      </div>
                    </div>

                    <CompatibilityBadge
                      score={compatibility?.score || 0}
                      size="sm"
                      onClick={() => {
                        setSelectedComp(compatibility);
                        setSelectedName(partnerName);
                      }}
                    />
                  </div>

                  {/* Partnership connection badge */}
                  <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Active Partners
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Since{' '}
                      {new Date(connectedSince).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Shared Subjects Highlight */}
                  <div className="mt-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-indigo-500" />
                      Shared Academic Focus
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sharedSubs.length > 0 ? (
                        sharedSubs.slice(0, 3).map((sub, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2.5 py-0.5 rounded-lg font-medium bg-indigo-50 text-indigo-800 border border-indigo-100"
                          >
                            {sub}
                          </span>
                        ))
                      ) : (
                        (profile?.subjects || []).slice(0, 3).map((sub, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2.5 py-0.5 rounded-lg font-medium bg-slate-100 text-slate-700"
                          >
                            {sub}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Study Goals */}
                  {(profile?.studyGoals || []).length > 0 && (
                    <div className="mt-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                        <Target className="w-3 h-3 text-emerald-500" />
                        Study Goals
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(profile.studyGoals || []).slice(0, 2).map((g, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Direct Contact Channels */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    {profile?.contactEmail || partner.email ? (
                      <a
                        href={`mailto:${profile?.contactEmail || partner.email}`}
                        className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 font-medium truncate"
                      >
                        <Mail className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                        <span className="truncate">{profile?.contactEmail || partner.email}</span>
                      </a>
                    ) : null}

                    {profile?.discordHandle ? (
                      <div className="flex items-center gap-1.5 text-slate-600 font-medium truncate">
                        <MessageCircle className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" />
                        <span className="truncate">{profile.discordHandle}</span>
                      </div>
                    ) : null}

                    {profile?.githubUrl ? (
                      <a
                        href={profile.githubUrl.startsWith('http') ? profile.githubUrl : `https://${profile.githubUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 font-medium truncate"
                      >
                        <Github className="w-3.5 h-3.5 text-slate-700 flex-shrink-0" />
                        <span className="truncate">GitHub Profile</span>
                      </a>
                    ) : null}

                    {profile?.linkedinUrl ? (
                      <a
                        href={profile.linkedinUrl.startsWith('http') ? profile.linkedinUrl : `https://${profile.linkedinUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 font-medium truncate"
                      >
                        <Linkedin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        <span className="truncate">LinkedIn</span>
                      </a>
                    ) : null}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Preferred: {profile?.preferredStudyMode || 'Hybrid'}
                  </span>

                  <Link
                    to={`/profile/${partner._id || partner.id}`}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-200 text-xs font-bold shadow-sm transition"
                  >
                    <span>Full Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-4">
            <UserCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Confirmed Partners Yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
            You don't have any confirmed study partners at the moment. Browse the directory to connect with classmates studying your courses.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/find-partners"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Discover Partners</span>
            </Link>
            <Link
              to="/requests"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4 text-slate-400" />
              <span>View Incoming Requests</span>
            </Link>
          </div>
        </div>
      )}

      {/* Compatibility Deep-Dive Modal */}
      <CompatibilityModal
        isOpen={!!selectedComp}
        onClose={() => setSelectedComp(null)}
        studentName={selectedName}
        compatibility={selectedComp}
      />
    </div>
  );
}
