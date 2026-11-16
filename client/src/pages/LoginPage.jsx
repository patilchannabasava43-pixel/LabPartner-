import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please provide a valid email format.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = await login(email.trim(), password, rememberMe);
    setLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  const handleDemoFill = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    setErrors({});
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (forgotEmail.trim()) {
      setForgotSubmitted(true);
      setTimeout(() => {
        setForgotSubmitted(false);
        setForgotModalOpen(false);
        setForgotEmail('');
      }, 3500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex font-sans">
      {/* Left Column: Form Card */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-12 xl:px-20 z-10">
        <div className="mx-auto w-full max-w-md">
          {/* Brand Header */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                LabPartner<span className="text-indigo-400">.Finder</span>
              </span>
            </Link>

            <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Sign in to your account
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              New to the platform?{' '}
              <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                Create a student profile
              </Link>
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Campus Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    placeholder="student@university.edu"
                    className={`block w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm text-slate-800 border ${
                      errors.email ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-300 focus:ring-indigo-500'
                    } rounded-xl focus:ring-2 focus:border-transparent outline-none transition`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    placeholder="••••••••"
                    className={`block w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-800 border ${
                      errors.password ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-300 focus:ring-indigo-500'
                    } rounded-xl focus:ring-2 focus:border-transparent outline-none transition`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-xs text-slate-600 font-medium">Keep me signed in</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-md shadow-indigo-600/25 transition-all duration-200 disabled:opacity-60"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Fast-Login Demo Buttons */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Demo Quick-Sign In (1-Click)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoFill('alex.chen@campus.edu')}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 text-left transition text-xs"
                >
                  <span className="font-bold text-slate-800 block truncate">Alex Chen</span>
                  <span className="text-[10px] text-slate-500 block truncate">CS • 3rd Year</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill('elena.rostova@campus.edu')}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 text-left transition text-xs"
                >
                  <span className="font-bold text-slate-800 block truncate">Elena Rostova</span>
                  <span className="text-[10px] text-slate-500 block truncate">CS • 3rd Year</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Promotional & Visual Split Screen */}
      <div className="hidden lg:flex lg:flex-1 relative bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-12 items-center justify-center overflow-hidden border-l border-slate-800">
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-violet-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative max-w-md text-white space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Welcome to Your Student Portal</span>
          </div>

          <h2 className="text-3xl font-extrabold leading-tight">
            Connect with peers in your lab sections & courses.
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Access your active study partners, review incoming collaboration requests, and discover classmates ranked by scheduling and coursework synergy.
          </p>

          <div className="p-4 rounded-2xl bg-slate-850/90 border border-slate-700/80 text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Real-Time Pairwise Matching</span>
            </div>
            <p className="text-slate-400">
              Your profile is matched with other students across shared subjects, weekly availability, and academic goals.
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setForgotModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">Reset Password</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter your registered campus email address. A password recovery link will be dispatched to your inbox.
            </p>

            {forgotSubmitted ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Password recovery instructions sent to your college email address.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition"
                >
                  Send Recovery Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
