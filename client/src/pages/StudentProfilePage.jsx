import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CompatibilityBadge from '../components/CompatibilityBadge';
import CompatibilityModal from '../components/CompatibilityModal';
import SendRequestModal from '../components/SendRequestModal';
import api from '../api/axios';
import {
  User,
  GraduationCap,
  School,
  BookOpen,
  Code,
  Heart,
  Target,
  Clock,
  Mail,
  Phone,
  Github,
  Linkedin,
  MapPin,
  Sparkles,
  Edit3,
  UserPlus,
  UserCheck,
  ArrowRight,
  ExternalLink,
  Users,
  Compass,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export default function StudentProfilePage() {
  const { id } = useParams();
  const { user: currentUser, showToast } = useAuth();

  const [studentUser, setStudentUser] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [compatibility, setCompatibility] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('none');
  const [loading, setLoading] = useState(true);

  const [showCompModal, setShowCompModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

  const isOwnProfile = !id || id === 'me' || id === currentUser?._id;

  const fetchProfile = async () => {
    try {
      setLoading(true);
      if (isOwnProfile) {
        const res = await api.get('/profiles/me');
        if (res.data.success) {
          setStudentUser(res.data.user || currentUser);
          setStudentProfile(res.data.profile);
          setCompletionPercentage(res.data.completionPercentage || 0);
          setSuggestions(res.data.suggestions || []);
          setConnectionStatus('self');
        }
      } else {
        const res = await api.get(`/profiles/${id}`);
        if (res.data.success) {
          setStudentUser(res.data.user);
          setStudentProfile(res.data.profile);
          setCompatibility(res.data.compatibility);
          setConnectionStatus(res.data.connectionStatus);
        }
      }
    } catch (err) {
      console.error('Failed to load student profile:', err);
      showToast('Error loading student profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id, currentUser]);

  const handleSendRequest = async (receiverId, message) => {
    try {
      const res = await api.post('/requests/send', { receiverId, message });
      if (res.data.success) {
        showToast('Partner request sent successfully!', 'success');
        setConnectionStatus('pending_sent');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send request', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Loading Student Profile...
        </p>
      </div>
    );
  }

  if (!studentUser) {
    return (
      <div className="max-w-md mx-auto text-center py-16 bg-white p-8 rounded-3xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800">Student Profile Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">This student profile does not exist or may have been updated.</p>
        <Link
          to="/find-partners"
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl"
        >
          Explore Other Students
        </Link>
      </div>
    );
  }

  const displayName = studentUser.fullName || studentUser.name;
  const displayYear = studentUser.yearOfStudy || studentUser.year || 'Student';

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 font-sans">
      {/* Profile Header Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
        {/* Banner Gradient */}
        <div className="h-40 sm:h-48 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {!isOwnProfile && compatibility && (
              <CompatibilityBadge
                score={compatibility.score}
                size="md"
                onClick={() => setShowCompModal(true)}
              />
            )}
            {isOwnProfile && (
              <Link
                to="/edit-profile"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-102"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile
              </Link>
            )}
          </div>
        </div>

        {/* Profile Card Body */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-16 sm:-mt-20 gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <img
                src={
                  studentUser.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`
                }
                alt={displayName}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white shadow-xl bg-slate-100"
              />
              <div className="sm:pb-1">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  {displayName}
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-indigo-600 flex items-center gap-1.5 mt-0.5">
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                  {studentUser.department} • {displayYear}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <School className="w-3.5 h-3.5 text-slate-400" />
                  {studentUser.college}
                </p>
              </div>
            </div>

            {/* Connect Action if viewing other student */}
            {!isOwnProfile && (
              <div className="sm:pb-1 w-full sm:w-auto">
                {connectionStatus === 'accepted' ? (
                  <span className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">
                    <UserCheck className="w-4 h-4" />
                    Confirmed Study Partners
                  </span>
                ) : connectionStatus === 'pending_sent' ? (
                  <span className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    <Clock className="w-4 h-4" />
                    Invitation Pending
                  </span>
                ) : connectionStatus === 'pending_received' ? (
                  <Link
                    to="/requests"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition"
                  >
                    Respond to Request
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <button
                    onClick={() => setShowSendModal(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all hover:scale-102"
                  >
                    <UserPlus className="w-4 h-4" />
                    Connect as Partner
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Bio statement */}
          {studentProfile?.bio && (
            <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed italic">
              "{studentProfile.bio}"
            </div>
          )}
        </div>
      </div>

      {/* Profile Completion Card (if own profile) */}
      {isOwnProfile && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Profile Completion Status
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                {completionPercentage === 100
                  ? 'Your profile is 100% complete! Matching engine is operating at full precision.'
                  : 'Complete missing fields to boost compatibility recommendations.'}
              </p>
            </div>
            <span className="text-2xl font-black text-indigo-600">
              {completionPercentage}%
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-3">
            <div
              className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          {suggestions.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-500">Suggestions:</span>
              {suggestions.map((item, idx) => (
                <span key={idx} className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Grid: Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Academic, Goals, Schedule */}
        <div className="md:col-span-2 space-y-6">
          {/* Current Subjects */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Subjects Currently Studying
              </h3>
              <span className="text-xs font-bold text-indigo-600">
                {(studentProfile?.subjects || []).length} Course(s)
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {(studentProfile?.subjects || []).length > 0 ? (
                studentProfile.subjects.map((sub, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-900 border border-indigo-200/80 shadow-sm"
                  >
                    {sub}
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No courses added yet.</p>
              )}
            </div>
          </div>

          {/* Technical Skills & Academic Interests */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Skills */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
                <Code className="w-4 h-4 text-violet-600" />
                Technical Skills
              </h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(studentProfile?.skills || []).length > 0 ? (
                  studentProfile.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-violet-50 text-violet-800 border border-violet-200/80"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No skills listed.</p>
                )}
              </div>
            </div>

            {/* Interests */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
                <Heart className="w-4 h-4 text-pink-500" />
                Academic Interests
              </h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(studentProfile?.interests || []).length > 0 ? (
                  studentProfile.interests.map((int, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-pink-50 text-pink-800 border border-pink-200/80"
                    >
                      {int}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No interests listed.</p>
                )}
              </div>
            </div>
          </div>

          {/* Study Goals */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
              <Target className="w-4 h-4 text-emerald-600" />
              Academic & Study Goals
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {(studentProfile?.studyGoals || []).length > 0 ? (
                studentProfile.studyGoals.map((g, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80"
                  >
                    ✓ {g}
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No study goals specified.</p>
              )}
            </div>
          </div>

          {/* Weekly Availability Schedule */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                Weekly Availability Schedule
              </h3>
              <span className="text-xs text-violet-600 font-semibold">30% Synergy Factor</span>
            </div>

            {studentProfile?.availability && studentProfile.availability.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-3 pt-1">
                {studentProfile.availability.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      {item.day}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {item.slots.map((s, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No regular weekly schedule set.</p>
            )}
          </div>
        </div>

        {/* Right 1 Col: Study Preferences & Contacts */}
        <div className="space-y-6">
          {/* Study Preferences */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-indigo-600" />
              Study Preferences
            </h3>

            <div>
              <span className="text-xs text-slate-400 block font-medium">Study Mode</span>
              <span className="text-sm font-bold text-slate-800">
                {studentProfile?.preferredStudyMode || 'Both (Online & Offline)'}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 block font-medium">Group Size</span>
              <span className="text-sm font-bold text-slate-800">
                {studentProfile?.preferredGroupSize || 'Small group'}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 block font-medium mb-1.5">Learning Styles</span>
              <div className="flex flex-wrap gap-1">
                {(studentProfile?.studyStyles || ['Problem-solving']).map((style, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                  >
                    {style}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 block font-medium">Campus Study Spot</span>
              <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                {studentProfile?.location || 'Main Campus Library'}
              </span>
            </div>
          </div>

          {/* Contact Coordinates */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Contact & Social Channels
            </h3>

            <div className="space-y-2.5 text-xs">
              <a
                href={`mailto:${studentUser.email}`}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200/80 transition"
              >
                <Mail className="w-4 h-4 text-indigo-500" />
                <span className="truncate">{studentUser.email}</span>
              </a>

              {studentProfile?.phone && (
                <a
                  href={`tel:${studentProfile.phone}`}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200/80 transition"
                >
                  <Phone className="w-4 h-4 text-emerald-500" />
                  <span>{studentProfile.phone}</span>
                </a>
              )}

              {studentProfile?.github && (
                <a
                  href={`https://github.com/${studentProfile.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/80 transition"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Github className="w-4 h-4" />
                    <span className="truncate">github.com/{studentProfile.github}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}

              {studentProfile?.linkedin && (
                <a
                  href={`https://linkedin.com/in/${studentProfile.linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/70 hover:bg-blue-100/70 text-blue-700 border border-blue-200/80 transition"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Linkedin className="w-4 h-4" />
                    <span className="truncate">LinkedIn Profile</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-blue-400" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Compatibility Modal */}
      {compatibility && (
        <CompatibilityModal
          isOpen={showCompModal}
          onClose={() => setShowCompModal(false)}
          studentName={displayName}
          compatibility={compatibility}
        />
      )}

      {/* Send Request Modal */}
      {!isOwnProfile && (
        <SendRequestModal
          isOpen={showSendModal}
          onClose={() => setShowSendModal(false)}
          student={studentUser}
          onSend={handleSendRequest}
        />
      )}
    </div>
  );
}
