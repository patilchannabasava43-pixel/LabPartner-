import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  School,
  BookOpen,
  Calendar,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    department: '',
    yearOfStudy: 'First Year'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Password Strength Calculator
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 75, label: 'Good', color: 'bg-indigo-500' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email Address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid campus email format.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Confirmation password is required.';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.college.trim()) errs.college = 'College/University name is required.';
    if (!formData.department.trim()) errs.department = 'Department/Major is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    const result = await register({
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      college: formData.college.trim(),
      department: formData.department.trim(),
      yearOfStudy: formData.yearOfStudy
    });
    setSubmitting(false);

    if (result.success) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex font-sans">
      {/* Left Column: Form Section */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-12 xl:px-20 z-10 overflow-y-auto">
        <div className="mx-auto w-full max-w-lg">
          {/* Brand Logo Header */}
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
              Create student account
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              Already registered?{' '}
              <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                Sign in to your account
              </Link>
            </p>
          </div>

          {/* Registration Form Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Jordan Smith"
                    className={`block w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm text-slate-800 border ${
                      errors.fullName ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-300 focus:ring-indigo-500'
                    } rounded-xl focus:ring-2 focus:border-transparent outline-none transition`}
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
                  </p>
                )}
              </div>

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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
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

              {/* College & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    College / University
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <School className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      placeholder="e.g. Stanford University"
                      className={`block w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm text-slate-800 border ${
                        errors.college ? 'border-rose-400' : 'border-slate-300 focus:ring-indigo-500'
                      } rounded-xl focus:ring-2 focus:border-transparent outline-none transition`}
                    />
                  </div>
                  {errors.college && (
                    <p className="mt-1 text-[11px] text-rose-500">{errors.college}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Department / Major
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="e.g. Computer Science"
                      className={`block w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm text-slate-800 border ${
                        errors.department ? 'border-rose-400' : 'border-slate-300 focus:ring-indigo-500'
                      } rounded-xl focus:ring-2 focus:border-transparent outline-none transition`}
                    />
                  </div>
                  {errors.department && (
                    <p className="mt-1 text-[11px] text-rose-500">{errors.department}</p>
                  )}
                </div>
              </div>

              {/* Year of Study */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Year of Study
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <select
                    name="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm text-slate-800 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition bg-white"
                  >
                    <option value="First Year">First Year (Freshman)</option>
                    <option value="Second Year">Second Year (Sophomore)</option>
                    <option value="Third Year">Third Year (Junior)</option>
                    <option value="Fourth Year">Fourth Year (Senior)</option>
                    <option value="Other">Other (Graduate / Masters / PhD)</option>
                  </select>
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 6 chars"
                      className={`block w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm text-slate-800 border ${
                        errors.password ? 'border-rose-400' : 'border-slate-300 focus:ring-indigo-500'
                      } rounded-xl focus:ring-2 focus:border-transparent outline-none transition`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-type password"
                      className={`block w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm text-slate-800 border ${
                        errors.confirmPassword ? 'border-rose-400' : 'border-slate-300 focus:ring-indigo-500'
                      } rounded-xl focus:ring-2 focus:border-transparent outline-none transition`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password strength bar */}
              {formData.password && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Password Strength:</span>
                    <span className="font-semibold text-slate-700">{strength.label}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.password}
                </p>
              )}
              {errors.confirmPassword && (
                <p className="text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.confirmPassword}
                </p>
              )}

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-md shadow-indigo-600/25 transition-all duration-200 disabled:opacity-60"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Profile...</span>
                    </div>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Column: Promotional & Visual Split Screen */}
      <div className="hidden lg:flex lg:flex-1 relative bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-12 items-center justify-center overflow-hidden border-l border-slate-800">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative max-w-md text-white space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join Verified Campus Peers</span>
          </div>

          <h2 className="text-3xl font-extrabold leading-tight">
            Stop studying alone. <br />
            Find classmates who match your schedule & coursework.
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            LabPartner Finder mathematically matches your courses, schedule windows, and project ambitions to ensure high-synergy study groups.
          </p>

          <div className="space-y-3 pt-4 border-t border-slate-800 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>35% Course Alignment Weight</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>30% Weekly Schedule Overlap Matrix</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Free, secure, and college-student focused</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
