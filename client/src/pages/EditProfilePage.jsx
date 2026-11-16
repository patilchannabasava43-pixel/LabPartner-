import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SchedulePicker from '../components/SchedulePicker';
import api from '../api/axios';
import {
  Save,
  User,
  GraduationCap,
  School,
  BookOpen,
  Code,
  Heart,
  Target,
  Clock,
  Sparkles,
  X,
  Plus,
  AlertCircle,
  CheckCircle2,
  Users,
  Compass,
  MapPin,
  Phone,
  Github,
  Linkedin
} from 'lucide-react';

const SUGGESTED_SUBJECTS = [
  'Data Structures',
  'Database Management Systems',
  'Operating Systems',
  'Computer Networks',
  'Web Development',
  'Artificial Intelligence',
  'Machine Learning',
  'Software Engineering',
  'Cloud Computing',
  'Algorithms'
];

const SUGGESTED_SKILLS = [
  'Python',
  'JavaScript',
  'React',
  'Java',
  'C++',
  'MongoDB',
  'SQL',
  'Git',
  'Docker',
  'UI/UX Design',
  'Data Analysis'
];

const SUGGESTED_INTERESTS = [
  'Artificial Intelligence',
  'Web Development',
  'Robotics',
  'Competitive Programming',
  'Research',
  'Software Projects',
  'Open Source',
  'Distributed Systems'
];

const SUGGESTED_GOALS = [
  'Preparing for examinations',
  'Completing laboratory assignments',
  'Building academic projects',
  'Learning new technologies',
  'Preparing for placements',
  'Research collaboration'
];

const STUDY_STYLES_OPTIONS = [
  'Discussion-based',
  'Problem-solving',
  'Practical learning',
  'Exam preparation',
  'Project-based learning'
];

export default function EditProfilePage() {
  const { user, profile, refreshMe, showToast } = useAuth();
  const navigate = useNavigate();

  // Basic User Academic Info
  const [fullName, setFullName] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('First Year');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');

  // Coursework & Skills
  const [subjects, setSubjects] = useState([]);
  const [subjectInput, setSubjectInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [interests, setInterests] = useState([]);
  const [interestInput, setInterestInput] = useState('');
  const [studyGoals, setStudyGoals] = useState([]);
  const [goalInput, setGoalInput] = useState('');

  // Study Preferences
  const [preferredStudyMode, setPreferredStudyMode] = useState('Both');
  const [preferredGroupSize, setPreferredGroupSize] = useState('Small group');
  const [studyStyles, setStudyStyles] = useState(['Problem-solving']);

  // Weekly Schedule
  const [availability, setAvailability] = useState([]);

  // Contacts & Campus Spot
  const [location, setLocation] = useState('Main Campus Library');
  const [phone, setPhone] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [suggestions, setSuggestions] = useState([]);

  // Prepopulate existing profile information
  useEffect(() => {
    const fetchCurrentProfile = async () => {
      try {
        setFetchLoading(true);
        const res = await api.get('/profiles/me');
        if (res.data.success) {
          const u = res.data.user || user;
          const p = res.data.profile || profile;

          if (u) {
            setFullName(u.fullName || u.name || '');
            setCollege(u.college || '');
            setDepartment(u.department || '');
            setYearOfStudy(u.yearOfStudy || u.year || 'First Year');
            setAvatar(u.avatar || '');
          }

          if (p) {
            setBio(p.bio || '');
            setSubjects(p.subjects || []);
            setSkills(p.skills || []);
            setInterests(p.interests || []);
            setStudyGoals(p.studyGoals || []);
            setPreferredStudyMode(p.preferredStudyMode || 'Both');
            setPreferredGroupSize(p.preferredGroupSize || 'Small group');
            setStudyStyles(p.studyStyles || ['Problem-solving']);
            setAvailability(p.availability || []);
            setLocation(p.location || 'Main Campus Library');
            setPhone(p.phone || '');
            setGithub(p.github || '');
            setLinkedin(p.linkedin || '');
            setCompletionPercentage(res.data.completionPercentage || p.profileCompletion || 0);
            setSuggestions(res.data.suggestions || []);
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchCurrentProfile();
  }, []);

  // Tag list helper: Add item avoiding duplicates
  const addTag = (list, setList, value, setInput) => {
    const trimmed = (value || '').trim();
    if (!trimmed) return;
    const exists = list.some((item) => item.toLowerCase() === trimmed.toLowerCase());
    if (!exists) {
      setList([...list, trimmed]);
    } else {
      showToast(`"${trimmed}" is already added.`, 'info');
    }
    if (setInput) setInput('');
  };

  // Tag list helper: Remove item
  const removeTag = (list, setList, target) => {
    setList(list.filter((item) => item !== target));
  };

  // Toggle study style selection
  const toggleStyle = (style) => {
    if (studyStyles.includes(style)) {
      setStudyStyles(studyStyles.filter((s) => s !== style));
    } else {
      setStudyStyles([...studyStyles, style]);
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      showToast('Full name is required.', 'error');
      return;
    }
    if (!college.trim()) {
      showToast('College name is required.', 'error');
      return;
    }
    if (!department.trim()) {
      showToast('Department is required.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.put('/profiles/me', {
        fullName: fullName.trim(),
        college: college.trim(),
        department: department.trim(),
        yearOfStudy,
        avatar: avatar.trim(),
        bio: bio.trim(),
        subjects,
        skills,
        interests,
        studyGoals,
        preferredStudyMode,
        preferredGroupSize,
        studyStyles,
        availability,
        location: location.trim(),
        phone: phone.trim(),
        github: github.trim(),
        linkedin: linkedin.trim()
      });

      if (res.data.success) {
        showToast('Profile updated successfully!', 'success');
        await refreshMe();
        navigate('/profile');
      }
    } catch (err) {
      console.error('Failed to save profile:', err);
      showToast(err.response?.data?.message || 'Error saving profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Loading Profile Details...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Edit Student Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Update your courses, weekly availability, and study preferences to calibrate partner matching.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="self-start sm:self-auto px-4 py-2 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition"
        >
          Cancel
        </button>
      </div>

      {/* Profile Completion Progress Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Profile Readiness Meter
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Higher completion percentages increase partner matching accuracy by up to 85%.
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
          <div className="mt-3.5 pt-3 border-t border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Suggestions for 100% Completion:
            </span>
            <ul className="space-y-1">
              {suggestions.map((item, idx) => (
                <li key={idx} className="text-xs text-slate-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Academic & Personal Details */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <User className="w-5 h-5 text-indigo-600" />
            1. Personal & Academic Information
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Jordan Smith"
                className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                College / University *
              </label>
              <input
                type="text"
                required
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. Stanford University"
                className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Department / Major *
              </label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science"
                className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Year of Study *
              </label>
              <select
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="First Year">First Year (Freshman)</option>
                <option value="Second Year">Second Year (Sophomore)</option>
                <option value="Third Year">Third Year (Junior)</option>
                <option value="Fourth Year">Fourth Year (Senior)</option>
                <option value="Other">Other (Masters / PhD)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Avatar Image URL
            </label>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://images.unsplash.com/... or DiceBear URL"
              className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Study Bio / About You
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell potential study partners about your academic focus, work style, and courses you are targeting..."
              maxLength={600}
              className="w-full p-3 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Write a clear introduction to attract compatible partners</span>
              <span>{bio.length} / 600</span>
            </div>
          </div>
        </div>

        {/* Section 2: Coursework & Subjects Management */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              2. Subjects Currently Studying
            </h2>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
              35% Matching Weight
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Add all active courses and laboratory classes. Enter your own or pick from recommended subjects.
          </p>

          {/* Add Subject Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag(subjects, setSubjects, subjectInput, setSubjectInput);
                }
              }}
              placeholder="Type course name (e.g. Operating Systems) and press Enter..."
              className="flex-1 p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              type="button"
              onClick={() => addTag(subjects, setSubjects, subjectInput, setSubjectInput)}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition"
            >
              Add Subject
            </button>
          </div>

          {/* Quick Subject Suggestions */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Quick Course Suggestions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_SUBJECTS.map((sub) => (
                <button
                  type="button"
                  key={sub}
                  onClick={() => addTag(subjects, setSubjects, sub)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200 transition"
                >
                  + {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Enrolled Subjects List */}
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-700 block mb-2">
              Enrolled Subjects ({subjects.length}):
            </span>
            {subjects.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {subjects.map((sub) => (
                  <span
                    key={sub}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-900 border border-indigo-200"
                  >
                    <span>{sub}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(subjects, setSubjects, sub)}
                      className="text-indigo-400 hover:text-indigo-700 p-0.5 rounded-md"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-rose-500 italic">No subjects added yet. Please add at least one subject.</p>
            )}
          </div>
        </div>

        {/* Section 3: Technical Skills & Academic Interests */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Skills */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Code className="w-4 h-4 text-violet-600" />
              Technical & Lab Skills
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag(skills, setSkills, skillInput, setSkillInput);
                  }
                }}
                placeholder="Add skill (e.g. Python, Git)..."
                className="flex-1 p-2 text-xs border border-slate-300 rounded-xl outline-none"
              />
              <button
                type="button"
                onClick={() => addTag(skills, setSkills, skillInput, setSkillInput)}
                className="px-3 py-1.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1">
              {SUGGESTED_SKILLS.slice(0, 6).map((sk) => (
                <button
                  type="button"
                  key={sk}
                  onClick={() => addTag(skills, setSkills, sk)}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-violet-50 text-slate-600"
                >
                  + {sk}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {skills.map((sk) => (
                <span
                  key={sk}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-violet-50 text-violet-800 border border-violet-200"
                >
                  {sk}
                  <button type="button" onClick={() => removeTag(skills, setSkills, sk)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Heart className="w-4 h-4 text-pink-500" />
              Academic Interests
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag(interests, setInterests, interestInput, setInterestInput);
                  }
                }}
                placeholder="Add interest (e.g. Robotics)..."
                className="flex-1 p-2 text-xs border border-slate-300 rounded-xl outline-none"
              />
              <button
                type="button"
                onClick={() => addTag(interests, setInterests, interestInput, setInterestInput)}
                className="px-3 py-1.5 text-xs font-bold text-white bg-pink-500 hover:bg-pink-600 rounded-xl"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1">
              {SUGGESTED_INTERESTS.slice(0, 6).map((inItem) => (
                <button
                  type="button"
                  key={inItem}
                  onClick={() => addTag(interests, setInterests, inItem)}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-pink-50 text-slate-600"
                >
                  + {inItem}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {interests.map((inItem) => (
                <span
                  key={inItem}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-pink-50 text-pink-800 border border-pink-200"
                >
                  {inItem}
                  <button type="button" onClick={() => removeTag(interests, setInterests, inItem)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Study Goals */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              4. Study & Project Goals
            </h2>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              15% Matching Weight
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Select or enter your primary academic targets so the platform can connect you with students with matching ambitions.
          </p>

          {/* Quick Select Chips */}
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_GOALS.map((goal) => {
              const isSelected = studyGoals.includes(goal);
              return (
                <button
                  key={goal}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      removeTag(studyGoals, setStudyGoals, goal);
                    } else {
                      addTag(studyGoals, setStudyGoals, goal);
                    }
                  }}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium border transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {isSelected ? `✓ ${goal}` : `+ ${goal}`}
                </button>
              );
            })}
          </div>

          {/* Custom Goal Input */}
          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag(studyGoals, setStudyGoals, goalInput, setGoalInput);
                }
              }}
              placeholder="Add custom study goal..."
              className="flex-1 p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={() => addTag(studyGoals, setStudyGoals, goalInput, setGoalInput)}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
            >
              Add Goal
            </button>
          </div>
        </div>

        {/* Section 5: Study Preferences */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Compass className="w-5 h-5 text-indigo-600" />
            5. Collaboration Preferences
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Preferred Study Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Online', 'Offline', 'Both'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPreferredStudyMode(mode)}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      preferredStudyMode === mode
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Preferred Group Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['One-to-one', 'Small group', 'Any'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setPreferredGroupSize(size)}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      preferredGroupSize === size
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Preferred Study Styles (Multi-select)
            </label>
            <div className="flex flex-wrap gap-2">
              {STUDY_STYLES_OPTIONS.map((style) => {
                const active = studyStyles.includes(style);
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => toggleStyle(style)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-medium border transition ${
                      active
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {active ? `✓ ${style}` : `+ ${style}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 6: Weekly Availability Grid (SchedulePicker) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              6. Weekly Availability Matrix
            </h2>
            <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-100">
              30% Matching Weight
            </span>
          </div>

          <SchedulePicker
            value={availability}
            onChange={(newSched) => setAvailability(newSched)}
          />
        </div>

        {/* Section 7: Study Spot & Contacts */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <MapPin className="w-5 h-5 text-indigo-600" />
            7. Campus Location & Contact Coordinates
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Preferred Campus Study Spot
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Science Library 3rd Floor"
                className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number (Optional)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                GitHub Username (Optional)
              </label>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="e.g. octocat"
                className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                LinkedIn Profile / Username (Optional)
              </label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="e.g. in/alex-chen"
                className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="px-5 py-3 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-7 py-3 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 rounded-xl shadow-lg shadow-indigo-600/25 transition-all hover:scale-102 active:scale-98 disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving Profile...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
