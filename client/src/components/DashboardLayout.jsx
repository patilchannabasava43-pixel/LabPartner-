import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import TopNavbar from './dashboard/TopNavbar';
import Toast from './Toast';
import api from '../api/axios';
import { X } from 'lucide-react';

export default function DashboardLayout() {
  const { user, loading } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Fetch pending requests badge count periodically
  useEffect(() => {
    const fetchStats = async () => {
      if (user) {
        try {
          const res = await api.get('/partners/stats');
          if (res.data.success) {
            setPendingRequestsCount(res.data.stats.pendingIncoming || 0);
          }
        } catch (err) {
          // Graceful fallback
        }
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 20000);
    return () => clearInterval(interval);
  }, [user, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Loading Workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Toast />

      {/* Desktop Persistent Left Sidebar */}
      <div className="hidden lg:block h-full">
        <Sidebar pendingRequestsCount={pendingRequestsCount} />
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 z-10 animate-in slide-in-from-left duration-200">
            <div className="absolute top-3 right-3 z-20">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar
              pendingRequestsCount={pendingRequestsCount}
              onCloseMobile={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          pendingCount={pendingRequestsCount}
        />

        {/* Scrollable Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/70">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
