const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const PartnerRequest = require('../models/PartnerRequest');
const { protect } = require('../middleware/auth');
const { calculateCompatibility } = require('../utils/compatibility');

// Helper to normalize array of strings (trim, remove duplicates, filter empty)
const cleanArray = (val) => {
  if (!val) return [];
  const arr = Array.isArray(val) ? val : val.toString().split(',');
  const cleaned = [];
  const seen = new Set();
  arr.forEach((item) => {
    const trimmed = typeof item === 'string' ? item.trim() : '';
    if (trimmed && !seen.has(trimmed.toLowerCase())) {
      seen.add(trimmed.toLowerCase());
      cleaned.push(trimmed);
    }
  });
  return cleaned;
};

// @route   GET /api/profiles/me or /api/profile/me
// @desc    Get current student's full profile and completion diagnostics
// @access  Private
router.get('/me', protect, async (req, res, next) => {
  try {
    let profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = await StudentProfile.create({
        user: req.user._id,
        contactEmail: req.user.email,
        bio: `Hi, I am studying ${req.user.department} at ${req.user.college}. Looking for study partners!`,
        subjects: ['Data Structures & Algorithms'],
        skills: ['Python'],
        interests: ['Artificial Intelligence'],
        studyGoals: ['Exam Preparation'],
        preferredStudyMode: 'Both'
      });
    }

    const { completionPercentage, suggestions } = profile.calculateCompletion(req.user);
    await profile.save();

    res.json({
      success: true,
      user: {
        _id: req.user._id,
        fullName: req.user.fullName || req.user.name,
        name: req.user.fullName || req.user.name,
        email: req.user.email,
        college: req.user.college,
        department: req.user.department,
        yearOfStudy: req.user.yearOfStudy || req.user.year,
        avatar: req.user.avatar,
        role: req.user.role
      },
      profile,
      completionPercentage,
      suggestions
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/profiles/me or /api/profile/me
// @desc    Update current student profile and user academic details
// @access  Private
router.put('/me', protect, async (req, res, next) => {
  try {
    const {
      fullName,
      name,
      college,
      department,
      yearOfStudy,
      year,
      avatar,
      bio,
      subjects,
      favoriteSubjects,
      skills,
      interests,
      studyGoals,
      preferredStudyMode,
      preferredGroupSize,
      studyStyles,
      availability,
      contactEmail,
      phone,
      github,
      linkedin,
      location
    } = req.body;

    // 1. Update User basic info
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (fullName || name) user.fullName = (fullName || name).trim();
    if (college) user.college = college.trim();
    if (department) user.department = department.trim();
    if (yearOfStudy || year) user.yearOfStudy = yearOfStudy || year;
    if (avatar !== undefined) user.avatar = avatar;
    await user.save();

    // 2. Update Student Profile
    let profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new StudentProfile({ user: req.user._id });
    }

    if (bio !== undefined) profile.bio = bio.trim();
    if (subjects !== undefined) profile.subjects = cleanArray(subjects);
    if (favoriteSubjects !== undefined) profile.favoriteSubjects = cleanArray(favoriteSubjects);
    if (skills !== undefined) profile.skills = cleanArray(skills);
    if (interests !== undefined) profile.interests = cleanArray(interests);
    if (studyGoals !== undefined) profile.studyGoals = cleanArray(studyGoals);
    if (preferredStudyMode !== undefined) profile.preferredStudyMode = preferredStudyMode;
    if (preferredGroupSize !== undefined) profile.preferredGroupSize = preferredGroupSize;
    if (studyStyles !== undefined) profile.studyStyles = cleanArray(studyStyles);
    if (availability !== undefined) profile.availability = availability;
    if (contactEmail !== undefined) profile.contactEmail = contactEmail.trim();
    if (phone !== undefined) profile.phone = phone.trim();
    if (github !== undefined) profile.github = github.trim().replace(/^@/, '');
    if (linkedin !== undefined) profile.linkedin = linkedin.trim();
    if (location !== undefined) profile.location = location.trim();
    if (user.avatar) profile.avatar = user.avatar;

    const { completionPercentage, suggestions } = profile.calculateCompletion(user);
    await profile.save();

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        _id: user._id,
        fullName: user.fullName,
        name: user.fullName,
        email: user.email,
        college: user.college,
        department: user.department,
        yearOfStudy: user.yearOfStudy,
        avatar: user.avatar,
        role: user.role
      },
      profile,
      completionPercentage,
      suggestions
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/profiles/:id or /api/profile/:id
// @desc    Get any student's public profile by User ID with pairwise compatibility
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const targetId = req.params.id;

    // Handle 'me' alias
    if (targetId === 'me' || targetId === req.user._id.toString()) {
      let profile = await StudentProfile.findOne({ user: req.user._id });
      const { completionPercentage, suggestions } = profile ? profile.calculateCompletion(req.user) : { completionPercentage: 0, suggestions: [] };
      return res.json({
        success: true,
        user: req.user,
        profile,
        completionPercentage,
        suggestions,
        connectionStatus: 'self'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID format'
      });
    }

    const targetUser = await User.findById(targetId).select('-password');
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const targetProfile = await StudentProfile.findOne({ user: targetId });
    const myProfile = await StudentProfile.findOne({ user: req.user._id });

    // Calculate pairwise compatibility
    const compatibility = calculateCompatibility(myProfile, targetProfile);

    // Check request status between logged-in user and target
    let connectionStatus = 'none';
    let activeRequest = null;

    const existingReq = await PartnerRequest.findOne({
      $or: [
        { sender: req.user._id, receiver: targetId },
        { sender: targetId, receiver: req.user._id }
      ]
    });

    if (existingReq) {
      activeRequest = existingReq;
      if (existingReq.status === 'accepted') {
        connectionStatus = 'accepted';
      } else if (existingReq.status === 'pending') {
        connectionStatus =
          existingReq.sender.toString() === req.user._id.toString()
            ? 'pending_sent'
            : 'pending_received';
      } else {
        connectionStatus = existingReq.status;
      }
    }

    res.json({
      success: true,
      user: targetUser,
      profile: targetProfile,
      compatibility,
      connectionStatus,
      requestId: activeRequest ? activeRequest._id : null
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
