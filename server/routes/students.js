const express = require('express');
const router = express.Router();
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const PartnerRequest = require('../models/PartnerRequest');
const { protect } = require('../middleware/auth');
const { calculateCompatibility } = require('../utils/compatibility');

// Helper to normalize strings for comparison
const norm = (s) => (s || '').toString().toLowerCase().trim();

// @route   GET /api/students
// @desc    Find & filter students with compatibility, pagination, and multi-filters
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const {
      search,
      query,
      subjects,
      subject,
      interests,
      interest,
      days,
      day,
      timeSlots,
      slot,
      department,
      yearOfStudy,
      year,
      studyMode,
      minScore,
      sort,
      sortBy,
      page = 1,
      limit = 9
    } = req.query;

    const searchTerm = (search || query || '').trim();
    const targetDept = department && department !== 'All' ? department : null;
    const targetYear = (yearOfStudy || year) && (yearOfStudy !== 'All' && year !== 'All') ? (yearOfStudy || year) : null;
    const targetMode = studyMode && studyMode !== 'All' ? studyMode : null;

    // Parse array filters (which can come as comma-separated strings or arrays)
    const parseList = (val) => {
      if (!val || val === 'All') return [];
      if (Array.isArray(val)) return val.map(norm);
      return val.split(',').map(norm).filter(Boolean);
    };

    const targetSubjects = parseList(subjects || subject);
    const targetInterests = parseList(interests || interest);
    const targetDays = parseList(days || day);
    const targetSlots = parseList(timeSlots || slot);

    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const pageLimit = Math.max(1, Math.min(50, parseInt(limit, 10) || 9));

    // Current user profile
    const myProfile = await StudentProfile.findOne({ user: currentUserId });

    // Fetch other users (exclude current user)
    const userFilter = { _id: { $ne: currentUserId } };
    if (targetDept) {
      userFilter.department = { $regex: new RegExp(`^${targetDept}$`, 'i') };
    }
    if (targetYear) {
      userFilter.yearOfStudy = { $regex: new RegExp(`^${targetYear}$`, 'i') };
    }

    const otherUsers = await User.find(userFilter).select('-password');
    const otherUserIds = otherUsers.map(u => u._id);

    // Fetch profiles of other users
    const profileFilter = { user: { $in: otherUserIds } };
    if (targetMode) {
      profileFilter.preferredStudyMode = { $regex: new RegExp(`^${targetMode}$`, 'i') };
    }

    const profiles = await StudentProfile.find(profileFilter);
    const profileMap = new Map();
    profiles.forEach(p => profileMap.set(p.user.toString(), p));

    // Fetch active request connections involving current user
    const existingRequests = await PartnerRequest.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }]
    });

    const requestMap = new Map();
    existingRequests.forEach(r => {
      const otherId = r.sender.toString() === currentUserId.toString()
        ? r.receiver.toString()
        : r.sender.toString();
      requestMap.set(otherId, {
        id: r._id,
        status: r.status,
        isSender: r.sender.toString() === currentUserId.toString(),
        message: r.message,
        createdAt: r.createdAt
      });
    });

    // Evaluate matching & filter candidates
    let candidates = [];

    for (const user of otherUsers) {
      const profile = profileMap.get(user._id.toString());
      if (!profile) continue; // Only surface students who have an initialized profile

      // 1. Text Search (Full Name, College, Department, Subjects, Skills, Interests, Bio)
      if (searchTerm) {
        const q = norm(searchTerm);
        const matchesName = norm(user.fullName || user.name).includes(q);
        const matchesCollege = norm(user.college).includes(q);
        const matchesDept = norm(user.department).includes(q);
        const matchesBio = norm(profile.bio).includes(q);
        const matchesSubject = (profile.subjects || []).some(s => norm(s).includes(q));
        const matchesSkill = (profile.skills || []).some(s => norm(s).includes(q));
        const matchesInterest = (profile.interests || []).some(i => norm(i).includes(q));

        if (!matchesName && !matchesCollege && !matchesDept && !matchesBio && !matchesSubject && !matchesSkill && !matchesInterest) {
          continue;
        }
      }

      // 2. Subjects Multi-Filter
      if (targetSubjects.length > 0) {
        const studentSubs = (profile.subjects || []).map(norm);
        const hasAnySubject = targetSubjects.some(ts => studentSubs.includes(ts) || studentSubs.some(s => s.includes(ts)));
        if (!hasAnySubject) continue;
      }

      // 3. Interests Multi-Filter
      if (targetInterests.length > 0) {
        const studentInts = (profile.interests || []).map(norm);
        const hasAnyInterest = targetInterests.some(ti => studentInts.includes(ti) || studentInts.some(i => i.includes(ti)));
        if (!hasAnyInterest) continue;
      }

      // 4. Availability Days Filter
      if (targetDays.length > 0) {
        const studentDays = (profile.availability || [])
          .filter(a => a && a.slots && a.slots.length > 0)
          .map(a => norm(a.day));
        const hasDay = targetDays.some(td => studentDays.includes(td));
        if (!hasDay) continue;
      }

      // 5. Availability Slots / Time Filter
      if (targetSlots.length > 0) {
        const studentSlots = [];
        (profile.availability || []).forEach(a => {
          (a.slots || []).forEach(s => studentSlots.push(norm(s)));
        });
        const hasSlot = targetSlots.some(ts => studentSlots.some(s => s.includes(ts)));
        if (!hasSlot) continue;
      }

      // 6. Calculate Compatibility
      const comp = calculateCompatibility(myProfile, profile);

      // Min Score Filter
      if (minScore && comp.score < parseInt(minScore, 10)) {
        continue;
      }

      // Connection state resolution
      const reqInfo = requestMap.get(user._id.toString());
      let connectionStatus = 'none'; // 'none' | 'pending_sent' | 'pending_received' | 'accepted' | 'rejected'
      let requestId = null;

      if (reqInfo) {
        requestId = reqInfo.id;
        if (reqInfo.status === 'accepted') {
          connectionStatus = 'accepted';
        } else if (reqInfo.status === 'pending') {
          connectionStatus = reqInfo.isSender ? 'pending_sent' : 'pending_received';
        } else {
          connectionStatus = reqInfo.status;
        }
      }

      candidates.push({
        user: {
          _id: user._id,
          id: user._id,
          fullName: user.fullName || user.name,
          name: user.fullName || user.name,
          college: user.college,
          department: user.department,
          yearOfStudy: user.yearOfStudy,
          avatar: profile.avatar || user.avatar || '',
          createdAt: user.createdAt
        },
        profile: {
          _id: profile._id,
          bio: profile.bio,
          subjects: profile.subjects,
          favoriteSubjects: profile.favoriteSubjects,
          skills: profile.skills,
          interests: profile.interests,
          studyGoals: profile.studyGoals,
          preferredStudyMode: profile.preferredStudyMode,
          preferredGroupSize: profile.preferredGroupSize,
          studyStyles: profile.studyStyles,
          availability: profile.availability
        },
        compatibility: comp,
        connectionStatus,
        requestId
      });
    }

    // 7. Sorting
    const sortCriteria = sort || sortBy || 'compatibility';
    if (sortCriteria === 'subjects' || sortCriteria === 'shared-subjects') {
      candidates.sort((a, b) => b.compatibility.sharedSubjects.length - a.compatibility.sharedSubjects.length || b.compatibility.score - a.compatibility.score);
    } else if (sortCriteria === 'interests' || sortCriteria === 'shared-interests') {
      candidates.sort((a, b) => b.compatibility.sharedInterests.length - a.compatibility.sharedInterests.length || b.compatibility.score - a.compatibility.score);
    } else if (sortCriteria === 'availability' || sortCriteria === 'time-overlap') {
      candidates.sort((a, b) => b.compatibility.matchingAvailability.length - a.compatibility.matchingAvailability.length || b.compatibility.score - a.compatibility.score);
    } else if (sortCriteria === 'recent' || sortCriteria === 'newest') {
      candidates.sort((a, b) => new Date(b.user.createdAt) - new Date(a.user.createdAt));
    } else if (sortCriteria === 'name') {
      candidates.sort((a, b) => a.user.fullName.localeCompare(b.user.fullName));
    } else {
      // Default: Best Match (compatibility score descending)
      candidates.sort((a, b) => b.compatibility.score - a.compatibility.score);
    }

    // 8. Pagination
    const totalStudents = candidates.length;
    const totalPages = Math.ceil(totalStudents / pageLimit) || 1;
    const startIndex = (currentPage - 1) * pageLimit;
    const paginatedStudents = candidates.slice(startIndex, startIndex + pageLimit);

    res.json({
      success: true,
      students: paginatedStudents,
      results: paginatedStudents, // backwards compatibility
      pagination: {
        currentPage,
        totalPages,
        totalStudents,
        limit: pageLimit,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/students/recommendations
// @desc    Get top recommended study partners ranked by compatibility algorithm
// @access  Private
router.get('/recommendations', protect, async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const { page = 1, limit = 10, minScore = 0 } = req.query;

    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const pageLimit = Math.max(1, Math.min(50, parseInt(limit, 10) || 10));

    const myProfile = await StudentProfile.findOne({ user: currentUserId });

    // Fetch other eligible users
    const otherUsers = await User.find({ _id: { $ne: currentUserId } }).select('-password');
    const otherUserIds = otherUsers.map(u => u._id);

    const profiles = await StudentProfile.find({ user: { $in: otherUserIds } });
    const profileMap = new Map();
    profiles.forEach(p => profileMap.set(p.user.toString(), p));

    // Fetch existing partnership requests
    const existingRequests = await PartnerRequest.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }]
    });

    const requestMap = new Map();
    existingRequests.forEach(r => {
      const otherId = r.sender.toString() === currentUserId.toString()
        ? r.receiver.toString()
        : r.sender.toString();
      requestMap.set(otherId, {
        id: r._id,
        status: r.status,
        isSender: r.sender.toString() === currentUserId.toString()
      });
    });

    // Score and rank candidates
    const rankedCandidates = [];
    for (const user of otherUsers) {
      const profile = profileMap.get(user._id.toString());
      if (!profile) continue;

      const comp = calculateCompatibility(myProfile, profile);
      if (minScore && comp.score < parseInt(minScore, 10)) continue;

      const reqInfo = requestMap.get(user._id.toString());
      let connectionStatus = 'none';
      let requestId = null;

      if (reqInfo) {
        requestId = reqInfo.id;
        if (reqInfo.status === 'accepted') {
          connectionStatus = 'accepted';
        } else if (reqInfo.status === 'pending') {
          connectionStatus = reqInfo.isSender ? 'pending_sent' : 'pending_received';
        } else {
          connectionStatus = reqInfo.status;
        }
      }

      rankedCandidates.push({
        user: {
          _id: user._id,
          id: user._id,
          fullName: user.fullName || user.name,
          name: user.fullName || user.name,
          college: user.college,
          department: user.department,
          yearOfStudy: user.yearOfStudy,
          avatar: profile.avatar || user.avatar || '',
          createdAt: user.createdAt
        },
        profile: {
          _id: profile._id,
          bio: profile.bio,
          subjects: profile.subjects,
          skills: profile.skills,
          interests: profile.interests,
          studyGoals: profile.studyGoals,
          preferredStudyMode: profile.preferredStudyMode,
          availability: profile.availability
        },
        compatibility: comp,
        connectionStatus,
        requestId
      });
    }

    // Rank from highest to lowest compatibility score
    rankedCandidates.sort((a, b) => b.compatibility.score - a.compatibility.score);

    // Apply pagination
    const totalStudents = rankedCandidates.length;
    const totalPages = Math.ceil(totalStudents / pageLimit) || 1;
    const startIndex = (currentPage - 1) * pageLimit;
    const paginated = rankedCandidates.slice(startIndex, startIndex + pageLimit);

    res.json({
      success: true,
      recommendations: paginated,
      students: paginated,
      pagination: {
        currentPage,
        totalPages,
        totalStudents,
        limit: pageLimit,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/students/:id
// @desc    Get public student profile by user ID or profile ID
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const targetId = req.params.id;

    // Check if target is a User or StudentProfile
    let targetUser = await User.findById(targetId).select('-password');
    let profile = null;

    if (targetUser) {
      profile = await StudentProfile.findOne({ user: targetUser._id });
    } else {
      profile = await StudentProfile.findById(targetId).populate('user', '-password');
      if (profile) {
        targetUser = profile.user;
      }
    }

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const myProfile = await StudentProfile.findOne({ user: currentUserId });
    const comp = calculateCompatibility(myProfile, profile);

    // Check relationship status
    const existingReq = await PartnerRequest.findOne({
      $or: [
        { sender: currentUserId, receiver: targetUser._id },
        { sender: targetUser._id, receiver: currentUserId }
      ]
    });

    let connectionStatus = 'none';
    let requestId = null;
    if (existingReq) {
      requestId = existingReq._id;
      if (existingReq.status === 'accepted') {
        connectionStatus = 'accepted';
      } else if (existingReq.status === 'pending') {
        connectionStatus = existingReq.sender.toString() === currentUserId.toString()
          ? 'pending_sent'
          : 'pending_received';
      } else {
        connectionStatus = existingReq.status;
      }
    }

    res.json({
      success: true,
      student: {
        user: {
          _id: targetUser._id,
          id: targetUser._id,
          fullName: targetUser.fullName || targetUser.name,
          college: targetUser.college,
          department: targetUser.department,
          yearOfStudy: targetUser.yearOfStudy,
          avatar: (profile && profile.avatar) || targetUser.avatar || '',
          email: targetUser.email,
          createdAt: targetUser.createdAt
        },
        profile: profile ? {
          _id: profile._id,
          bio: profile.bio,
          subjects: profile.subjects,
          favoriteSubjects: profile.favoriteSubjects,
          skills: profile.skills,
          interests: profile.interests,
          studyGoals: profile.studyGoals,
          preferredStudyMode: profile.preferredStudyMode,
          preferredGroupSize: profile.preferredGroupSize,
          studyStyles: profile.studyStyles,
          availability: profile.availability,
          contactEmail: profile.contactEmail,
          contactPhone: profile.contactPhone,
          linkedinUrl: profile.linkedinUrl,
          githubUrl: profile.githubUrl,
          discordHandle: profile.discordHandle
        } : null,
        compatibility: comp,
        connectionStatus,
        requestId,
        isSelf: currentUserId.toString() === targetUser._id.toString()
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
