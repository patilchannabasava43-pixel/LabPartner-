import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CompatibilityBadge from '../components/CompatibilityBadge';
import CompatibilityModal from '../components/CompatibilityModal';
import api from '../api/axios';
import {
  Inbox,
  Send,
  Check,
  X,
  Clock,
  Sparkles,
  ArrowRight,
  UserX,
  Eye,
  MessageSquare,
  GraduationCap,
  Calendar,
  AlertCircle,
  RotateCcw,
  BookOpen,
  Target,
  CheckCircle2,
  XCircle,
  Ban
} from 'lucide-react';

export default function PartnerRequestsPage() {
  const { user, showToast } = useAuth();
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' | 'outgoing'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'accepted' | 'rejected' | 'cancelled'
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Compatibility modal state
  const [selectedComp, setSelectedComp] = useState(null);
  const [selectedName, setSelectedName] = useState('');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { type: activeTab };
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      const res = await api.get('/requests', { params });
      if (res.data.success) {
        setRequests(res.data.requests || []);
      }
    } catch (err) {
      console.error('Failed to load requests:', err);
      setError(err.response?.data?.message || 'Error loading partner requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [activeTab, statusFilter]);

  const handleAccept = async (id) => {
    try {
      setActionLoadingId(id);
      const res = await api.patch(`/requests/${id}/accept`);
      if (res.data.success) {
        showToast('Partner request accepted! Added to My Partners.', 'success');
        fetchRequests();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to accept request', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoadingId(id);
      const res = await api.patch(`/requests/${id}/reject`);
      if (res.data.success) {
        showToast('Partner request declined.', 'info');
        fetchRequests();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to decline request', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancel = async (id) => {
    try {
      setActionLoadingId(id);
      const res = await api.patch(`/requests/${id}/cancel`);
      if (res.data.success) {
        showToast('Partner request cancelled.', 'info');
        fetchRequests();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel request', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Declined
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <Ban className="w-3.5 h-3.5 text-slate-500" />
            Cancelled
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            Pending Response
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Collaboration Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Inbox className="w-7 h-7 text-indigo-600" />
            Partner Requests Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review incoming invitations from classmates or monitor your outgoing collaboration requests.
          </p>
        </div>

        <Link
          to="/find-partners"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition self-start sm:self-auto"
        >
          <span>Find Study Partners</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Tabs & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Direction Tabs */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('incoming')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm ${
              activeTab === 'incoming'
                ? 'bg-indigo-600 text-white shadow-indigo-200'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Received Requests</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('outgoing')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm ${
              activeTab === 'outgoing'
                ? 'bg-indigo-600 text-white shadow-indigo-200'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Sent Requests</span>
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 hidden sm:inline">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Only</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Declined</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-bold text-rose-900">Failed to Load Requests</h4>
            <p className="text-xs text-rose-700 mt-0.5">{error}</p>
            <button
              type="button"
              onClick={fetchRequests}
              className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Requests List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 animate-pulse shadow-soft"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-200" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                </div>
              </div>
              <div className="h-10 bg-slate-50 rounded-xl" />
            </div>
          ))}
        </div>
      ) : requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((item) => {
            const otherUser = item.otherUser || (activeTab === 'incoming' ? item.sender : item.receiver);
            const otherProfile = item.profile || {};
            const comp = item.compatibility || { score: 0 };
            const isPending = item.status === 'pending';

            const name = otherUser?.fullName || otherUser?.name || 'Classmate';
            const avatarUrl =
              otherUser?.avatar ||
              otherProfile?.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-soft hover:shadow-card hover:border-indigo-100 transition-all p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                {/* Left Profile & Message Details */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="relative flex-shrink-0">
                    <img
                      src={avatarUrl}
                      alt={name}
                      className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
                    />
                    <span
                      className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"
                      title="Active Student"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/profile/${otherUser?._id}`}
                        className="font-bold text-slate-900 text-base hover:text-indigo-600 transition"
                      >
                        {name}
                      </Link>
                      {renderStatusBadge(item.status)}
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 truncate">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                      <span>{otherUser?.department} • {otherUser?.yearOfStudy || otherUser?.year}</span>
                      <span className="text-slate-300">•</span>
                      <span className="truncate">{otherUser?.college}</span>
                    </p>

                    {/* Introductory Message Bubble */}
                    {item.message && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 flex items-start gap-2">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 mt-0.5" />
                        <span className="italic leading-relaxed">"{item.message}"</span>
                      </div>
                    )}

                    {/* Tags preview: subjects & interests */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                      {(otherProfile.subjects || []).slice(0, 2).map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-medium border border-indigo-100 flex items-center gap-1"
                        >
                          <BookOpen className="w-3 h-3 text-indigo-500" />
                          {s}
                        </span>
                      ))}

                      {(otherProfile.studyGoals || []).slice(0, 1).map((g, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-100 flex items-center gap-1"
                        >
                          <Target className="w-3 h-3 text-emerald-500" />
                          {g}
                        </span>
                      ))}

                      <span className="text-[11px] text-slate-400 ml-auto flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Actions & Compatibility Tile */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 flex-shrink-0">
                  <CompatibilityBadge
                    score={comp.score}
                    size="sm"
                    showCategory={true}
                    onClick={() => {
                      setSelectedComp(comp);
                      setSelectedName(name);
                    }}
                  />

                  {/* Actions for Incoming Pending Requests */}
                  {activeTab === 'incoming' && isPending && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAccept(item._id)}
                        disabled={actionLoadingId === item._id}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(item._id)}
                        disabled={actionLoadingId === item._id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" />
                        Decline
                      </button>
                    </div>
                  )}

                  {/* Action for Outgoing Pending Requests */}
                  {activeTab === 'outgoing' && isPending && (
                    <button
                      type="button"
                      onClick={() => handleCancel(item._id)}
                      disabled={actionLoadingId === item._id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold transition disabled:opacity-50"
                    >
                      <UserX className="w-3.5 h-3.5 text-slate-500" />
                      Cancel Request
                    </button>
                  )}

                  {/* View Public Profile Link */}
                  <Link
                    to={`/profile/${otherUser?._id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Profile</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-12 text-center max-w-lg mx-auto">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-4">
            {activeTab === 'incoming' ? <Inbox className="w-6 h-6" /> : <Send className="w-6 h-6" />}
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {activeTab === 'incoming' ? 'No Incoming Requests' : 'No Sent Requests'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {activeTab === 'incoming'
              ? 'When classmates discover your profile and send collaboration invitations, they will appear right here.'
              : 'You have not sent any pending partner invitations recently. Explore the student directory to connect!'}
          </p>

          <div className="mt-6">
            <Link
              to="/find-partners"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition"
            >
              <span>Explore Potential Study Partners</span>
              <ArrowRight className="w-3.5 h-3.5" />
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
