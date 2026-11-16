import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import WelcomeSection from '../components/dashboard/WelcomeSection';
import StatsCard from '../components/dashboard/StatsCard';
import ProfileCompletionCard from '../components/dashboard/ProfileCompletionCard';
import RecommendedPartnerCard from '../components/dashboard/RecommendedPartnerCard';
import RequestSummary from '../components/dashboard/RequestSummary';
import QuickActionCard from '../components/dashboard/QuickActionCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import api from '../api/axios';
import { Sparkles } from 'lucide-react';

export default function Dashboard() {
  const { user, showToast } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/overview');
      if (res.data.success) {
        setDashboardData(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard overview:', err);
      // Fallback: fetch basic stats if overview route had any network issue
      try {
        const statsRes = await api.get('/partners/stats');
        if (statsRes.data.success) {
          setDashboardData({
            student: user,
            stats: statsRes.data.stats,
            profileCompletion: {
              percentage: statsRes.data.stats.profileCompletion,
              suggestions: []
            },
            recommendedStudents: [],
            requestsSummary: { incoming: [], outgoing: [], recentlyAccepted: [] },
            recentActivity: []
          });
        }
      } catch (fallbackErr) {
        console.error('Fallback error:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleSendRequest = async (receiverId, message) => {
    try {
      const res = await api.post('/requests/send', { receiverId, message });
      if (res.data.success) {
        showToast('Partner invitation dispatched!', 'success');
        fetchDashboard();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send request', 'error');
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const res = await api.put(`/requests/${requestId}/accept`);
      if (res.data.success) {
        showToast('Partner request accepted! Added to My Partners.', 'success');
        fetchDashboard();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to accept', 'error');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const res = await api.put(`/requests/${requestId}/reject`);
      if (res.data.success) {
        showToast('Request declined.', 'info');
        fetchDashboard();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to decline', 'error');
    }
  };

  if (loading && !dashboardData) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto animate-pulse">
        <div className="h-44 bg-slate-200 rounded-3xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-32 bg-slate-200 rounded-3xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 h-64 bg-slate-200 rounded-3xl" />
          <div className="lg:col-span-2 h-64 bg-slate-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  const student = dashboardData?.student || user;
  const stats = dashboardData?.stats;
  const completion = dashboardData?.profileCompletion;
  const recommendedStudents = dashboardData?.recommendedStudents || [];
  const requestsSummary = dashboardData?.requestsSummary;
  const recentActivity = dashboardData?.recentActivity || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* 1. Personalized Welcome Header */}
      <WelcomeSection student={student} />

      {/* 2. Key Dashboard Statistics */}
      <StatsCard stats={stats} />

      {/* 3. Middle Grid: Profile Completion & Partner Requests Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-1 flex flex-col">
          <ProfileCompletionCard completion={completion} />
        </div>

        <div className="lg:col-span-2 flex flex-col">
          <RequestSummary
            requestsSummary={requestsSummary}
            onAcceptRequest={handleAcceptRequest}
            onRejectRequest={handleRejectRequest}
          />
        </div>
      </div>

      {/* 4. Recommended Study Partners */}
      <RecommendedPartnerCard
        recommendations={recommendedStudents}
        onSendRequest={handleSendRequest}
      />

      {/* 5. Quick Actions Section */}
      <QuickActionCard />

      {/* 6. Recent Application Activity Feed */}
      <RecentActivity activities={recentActivity} />
    </div>
  );
}
