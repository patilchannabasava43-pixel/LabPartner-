import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import StudentCard from '../components/StudentCard';
import SearchBar from '../components/discovery/SearchBar';
import FilterSidebar from '../components/discovery/FilterSidebar';
import SortDropdown from '../components/discovery/SortDropdown';
import Pagination from '../components/discovery/Pagination';
import api from '../api/axios';
import {
  Users,
  Sparkles,
  SlidersHorizontal,
  X,
  AlertCircle,
  RefreshCw,
  Search,
  BookOpen,
  Filter
} from 'lucide-react';

export default function FindPartnersPage() {
  const { user, showToast } = useAuth();

  // Data states
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalStudents: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedMode, setSelectedMode] = useState('All');
  const [minScore, setMinScore] = useState(0);
  const [sortBy, setSortBy] = useState('compatibility');
  const [currentPage, setCurrentPage] = useState(1);

  // Mobile drawer filter toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // 1. Debounce text search to avoid excessive API requests
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setIsSearching(false);
      setCurrentPage(1); // Reset to page 1 on new search term
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to page 1 when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedSubjects,
    selectedInterests,
    selectedDays,
    selectedSlots,
    selectedDepartment,
    selectedYear,
    selectedMode,
    minScore,
    sortBy
  ]);

  // 2. Fetch students from backend API
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: 9,
        sort: sortBy
      };

      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (selectedSubjects.length > 0) params.subjects = selectedSubjects.join(',');
      if (selectedInterests.length > 0) params.interests = selectedInterests.join(',');
      if (selectedDays.length > 0) params.days = selectedDays.join(',');
      if (selectedSlots.length > 0) params.timeSlots = selectedSlots.join(',');
      if (selectedDepartment !== 'All') params.department = selectedDepartment;
      if (selectedYear !== 'All') params.yearOfStudy = selectedYear;
      if (selectedMode !== 'All') params.studyMode = selectedMode;
      if (minScore > 0) params.minScore = minScore;

      const res = await api.get('/students', { params });
      if (res.data.success) {
        setStudents(res.data.students || res.data.results || []);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.response?.data?.message || 'Failed to load study partners. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [
    debouncedSearch,
    selectedSubjects,
    selectedInterests,
    selectedDays,
    selectedSlots,
    selectedDepartment,
    selectedYear,
    selectedMode,
    minScore,
    sortBy,
    currentPage
  ]);

  // Active filter count
  const activeFilterCount =
    (debouncedSearch ? 1 : 0) +
    selectedSubjects.length +
    selectedInterests.length +
    selectedDays.length +
    selectedSlots.length +
    (selectedDepartment !== 'All' ? 1 : 0) +
    (selectedYear !== 'All' ? 1 : 0) +
    (selectedMode !== 'All' ? 1 : 0) +
    (minScore > 0 ? 1 : 0);

  const handleResetFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedSubjects([]);
    setSelectedInterests([]);
    setSelectedDays([]);
    setSelectedSlots([]);
    setSelectedDepartment('All');
    setSelectedYear('All');
    setSelectedMode('All');
    setMinScore(0);
    setSortBy('compatibility');
    setCurrentPage(1);
  };

  // Handle Send Partner Request callback
  const handleSendRequestSuccess = (targetStudentId, newRequest) => {
    // Update local connection status
    setStudents((prev) =>
      prev.map((s) => {
        const sId = (s.user && (s.user._id || s.user.id)) || s._id;
        if (sId === targetStudentId) {
          return {
            ...s,
            connectionStatus: 'pending_sent',
            requestId: newRequest ? newRequest._id : s.requestId
          };
        }
        return s;
      })
    );
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Driven Match Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Find Your Perfect Study Partner
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            Discover students who share your academic interests, subjects, and study schedule.
          </p>
        </div>

        {/* Quick count badge */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>{pagination.totalStudents} Peers Available</span>
          </div>
        </div>
      </div>

      {/* 2. Search & Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input with debounce */}
        <div className="flex-1 flex items-center gap-2">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            isSearching={isSearching}
            placeholder="Search by student name, college, department, subjects, skills, interests..."
          />

          {/* Mobile Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setShowMobileFilters(true)}
            className="md:hidden inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 text-xs font-bold transition shadow-sm"
          >
            <Filter className="w-4 h-4 text-indigo-600" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 justify-between md:justify-end">
          <span className="text-xs font-medium text-slate-500 hidden sm:inline">Sort by:</span>
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {/* Active filters pill bar (if any selected) */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-900">
          <span className="font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider text-indigo-700">
            <Filter className="w-3.5 h-3.5" />
            Active Filters ({activeFilterCount}):
          </span>

          {debouncedSearch && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-slate-800 font-medium">
              Keyword: "{debouncedSearch}"
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-700 font-bold ml-0.5"
              >
                ×
              </button>
            </span>
          )}

          {selectedSubjects.map((sub) => (
            <span
              key={sub}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-900 font-medium"
            >
              {sub}
              <button
                type="button"
                onClick={() => setSelectedSubjects((prev) => prev.filter((s) => s !== sub))}
                className="text-indigo-400 hover:text-indigo-700 font-bold ml-0.5"
              >
                ×
              </button>
            </span>
          ))}

          {selectedInterests.map((intItem) => (
            <span
              key={intItem}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-purple-200 text-purple-900 font-medium"
            >
              {intItem}
              <button
                type="button"
                onClick={() => setSelectedInterests((prev) => prev.filter((i) => i !== intItem))}
                className="text-purple-400 hover:text-purple-700 font-bold ml-0.5"
              >
                ×
              </button>
            </span>
          ))}

          {selectedDays.map((d) => (
            <span
              key={d}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-slate-800 font-medium"
            >
              {d.slice(0, 3)}
              <button
                type="button"
                onClick={() => setSelectedDays((prev) => prev.filter((item) => item !== d))}
                className="text-slate-400 hover:text-slate-700 font-bold ml-0.5"
              >
                ×
              </button>
            </span>
          ))}

          {selectedDepartment !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-slate-800 font-medium">
              Dept: {selectedDepartment}
              <button
                type="button"
                onClick={() => setSelectedDepartment('All')}
                className="text-slate-400 hover:text-slate-700 font-bold ml-0.5"
              >
                ×
              </button>
            </span>
          )}

          {selectedYear !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-slate-800 font-medium">
              Year: {selectedYear}
              <button
                type="button"
                onClick={() => setSelectedYear('All')}
                className="text-slate-400 hover:text-slate-700 font-bold ml-0.5"
              >
                ×
              </button>
            </span>
          )}

          {selectedMode !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-slate-800 font-medium">
              Mode: {selectedMode}
              <button
                type="button"
                onClick={() => setSelectedMode('All')}
                className="text-slate-400 hover:text-slate-700 font-bold ml-0.5"
              >
                ×
              </button>
            </span>
          )}

          {minScore > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-900 font-medium">
              Min: {minScore}%
              <button
                type="button"
                onClick={() => setMinScore(0)}
                className="text-indigo-400 hover:text-indigo-700 font-bold ml-0.5"
              >
                ×
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs font-bold text-rose-600 hover:text-rose-800 underline ml-auto"
          >
            Reset All
          </button>
        </div>
      )}

      {/* 3. Main Discovery Grid & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Desktop Filter Sidebar (1 col) */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <FilterSidebar
            selectedSubjects={selectedSubjects}
            selectedInterests={selectedInterests}
            selectedDays={selectedDays}
            selectedSlots={selectedSlots}
            selectedDepartment={selectedDepartment}
            selectedYear={selectedYear}
            selectedMode={selectedMode}
            minScore={minScore}
            onSubjectsChange={setSelectedSubjects}
            onInterestsChange={setSelectedInterests}
            onDaysChange={setSelectedDays}
            onSlotsChange={setSelectedSlots}
            onDepartmentChange={setSelectedDepartment}
            onYearChange={setSelectedYear}
            onModeChange={setSelectedMode}
            onMinScoreChange={setMinScore}
            onResetFilters={handleResetFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>

        {/* Student Cards Results Section (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-rose-900">Error Loading Students</h4>
                <p className="text-xs text-rose-700 mt-0.5">{error}</p>
                <button
                  type="button"
                  onClick={fetchStudents}
                  className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Loading Skeletons */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 animate-pulse shadow-soft"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-13 h-13 bg-slate-200 rounded-2xl" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-10 bg-slate-100 rounded-xl" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                  <div className="h-3 bg-slate-100 rounded w-4/5" />
                  <div className="flex gap-2 pt-2">
                    <div className="h-6 bg-slate-200 rounded w-1/3" />
                    <div className="h-6 bg-slate-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : students.length > 0 ? (
            /* Student Results Grid */
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {students.map((student) => {
                  const studentId =
                    (student.user && (student.user._id || student.user.id)) || student._id;
                  return (
                    <StudentCard
                      key={studentId}
                      studentData={student}
                      onSendRequest={(req) => handleSendRequestSuccess(studentId, req)}
                    />
                  );
                })}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalStudents}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-12 text-center max-w-lg mx-auto">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Study Partners Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                We couldn't find any students matching your exact search query or filter criteria.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition"
                >
                  Clear All Filters
                </button>
                <button
                  type="button"
                  onClick={fetchStudents}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
                >
                  Refresh Directory
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Mobile Filters Modal Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto p-5 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                Filter Study Partners
              </h3>
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1">
              <FilterSidebar
                selectedSubjects={selectedSubjects}
                selectedInterests={selectedInterests}
                selectedDays={selectedDays}
                selectedSlots={selectedSlots}
                selectedDepartment={selectedDepartment}
                selectedYear={selectedYear}
                selectedMode={selectedMode}
                minScore={minScore}
                onSubjectsChange={setSelectedSubjects}
                onInterestsChange={setSelectedInterests}
                onDaysChange={setSelectedDays}
                onSlotsChange={setSelectedSlots}
                onDepartmentChange={setSelectedDepartment}
                onYearChange={setSelectedYear}
                onModeChange={setSelectedMode}
                onMinScoreChange={setMinScore}
                onResetFilters={handleResetFilters}
                activeFilterCount={activeFilterCount}
              />
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md transition"
              >
                Show Results ({pagination.totalStudents})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
