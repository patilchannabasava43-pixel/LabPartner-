import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  LayoutDashboard,
  User,
  Users,
  Inbox,
  UserCheck,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ pendingRequestsCount = 0, onCloseMobile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', to: '/profile', icon: User },
    { name: 'Find Partners', to: '/find-partners', icon: Users },
    {
      name: 'Partner Requests',
      to: '/requests',
      icon: Inbox,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : null
    },
    { name: 'My Partners', to: '/my-partners', icon: UserCheck },
    { name: 'Settings', to: '/settings', icon: Settings },
  ];

  const displayName = user?.fullName || user?.name || 'Student';

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between h-full border-r border-slate-800 flex-shrink-0">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight flex items-center">
                LabPartner<span className="text-indigo-400">.Finder</span>
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1 tracking-wider uppercase font-semibold">
                Student Portal
              </span>
            </div>
          </NavLink>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Workspace
          </div>

          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-rose-500 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer User Profile & Logout */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        {user && (
          <div className="p-3 bg-slate-850 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={
                  user.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`
                }
                alt={displayName}
                className="w-9 h-9 rounded-xl object-cover border border-slate-700 flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{displayName}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.department}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
