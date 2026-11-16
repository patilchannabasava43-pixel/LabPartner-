const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const { protect } = require('../middleware/auth');

// Auth rate limiter to protect against brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.'
  }
});

// Helper to sign JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'super_secret_labpartner_jwt_token_2026_academic_key',
    { expiresIn: '30d' }
  );
};

// Cookie options
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
});

// Helper to normalize year of study input
const normalizeYear = (year) => {
  if (!year) return 'First Year';
  const val = year.toString().toLowerCase().trim();
  if (val.includes('1') || val.includes('first')) return 'First Year';
  if (val.includes('2') || val.includes('second')) return 'Second Year';
  if (val.includes('3') || val.includes('third')) return 'Third Year';
  if (val.includes('4') || val.includes('fourth')) return 'Fourth Year';
  return 'Other';
};

// @route   POST /api/auth/register
// @desc    Register a new student account
// @access  Public
router.post(
  '/register',
  authLimiter,
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('college')
      .trim()
      .notEmpty()
      .withMessage('College/University name is required'),
    body('department')
      .trim()
      .notEmpty()
      .withMessage('Department/Major is required')
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
          errors: errors.array()
        });
      }

      const { fullName, name, email, password, college, department, yearOfStudy, year, avatar } = req.body;
      const resolvedName = (fullName || name || '').trim();
      const resolvedYear = normalizeYear(yearOfStudy || year);

      if (!resolvedName) {
        return res.status(400).json({
          success: false,
          message: 'Full name is required'
        });
      }

      // Check if email already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.'
        });
      }

      // Generate default DiceBear avatar if none provided
      const userAvatar =
        avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(resolvedName)}`;

      // Create new user (pre-save hook hashes password)
      const user = await User.create({
        fullName: resolvedName,
        name: resolvedName,
        email,
        password,
        college: college.trim(),
        department: department.trim(),
        yearOfStudy: resolvedYear,
        avatar: userAvatar
      });

      // Automatically initialize associated StudentProfile
      const profile = await StudentProfile.create({
        user: user._id,
        bio: `Hi! I am studying ${department} at ${college}. Excited to collaborate on coursework and lab sessions!`,
        subjects: ['Data Structures & Algorithms', 'Operating Systems'],
        skills: ['Problem Solving', 'Python', 'Git'],
        interests: ['Artificial Intelligence', 'Software Systems'],
        studyGoals: ['Exam Preparation', 'Lab Project Collaboration'],
        preferredStudyMode: 'Hybrid',
        contactEmail: email,
        location: `${college} Campus Library`
      });

      user.profile = profile._id;
      await user.save();

      const token = generateToken(user._id);

      // Set HttpOnly cookie
      res.cookie('token', token, getCookieOptions());

      res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to LabPartner Finder.',
        token,
        user: {
          _id: user._id,
          fullName: user.fullName,
          name: user.fullName,
          email: user.email,
          college: user.college,
          department: user.department,
          yearOfStudy: user.yearOfStudy,
          role: user.role,
          avatar: user.avatar,
          createdAt: user.createdAt
        },
        profile
      });
    } catch (error) {
      next(error);
    }
  }
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  authLimiter,
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg
        });
      }

      const { email, password } = req.body;

      // Find user and explicitly select password hash
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        // Generic failure message to prevent account enumeration
        return res.status(401).json({
          success: false,
          message: 'Invalid email address or password.'
        });
      }

      // Check password match
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email address or password.'
        });
      }

      // Fetch or initialize profile
      let profile = await StudentProfile.findOne({ user: user._id });
      if (!profile) {
        profile = await StudentProfile.create({
          user: user._id,
          bio: `Student at ${user.college}`,
          contactEmail: user.email
        });
        user.profile = profile._id;
        await user.save();
      }

      const token = generateToken(user._id);

      // Set HttpOnly cookie
      res.cookie('token', token, getCookieOptions());

      res.json({
        success: true,
        message: 'Login successful.',
        token,
        user: {
          _id: user._id,
          fullName: user.fullName,
          name: user.fullName,
          email: user.email,
          college: user.college,
          department: user.department,
          yearOfStudy: user.yearOfStudy,
          role: user.role,
          avatar: user.avatar,
          createdAt: user.createdAt
        },
        profile
      });
    } catch (error) {
      next(error);
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current authenticated user info
// @access  Private
router.get('/me', protect, async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    res.json({
      success: true,
      user: {
        _id: req.user._id,
        fullName: req.user.fullName,
        name: req.user.fullName,
        email: req.user.email,
        college: req.user.college,
        department: req.user.department,
        yearOfStudy: req.user.yearOfStudy,
        role: req.user.role,
        avatar: req.user.avatar,
        createdAt: req.user.createdAt
      },
      profile
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/logout
// @desc    Clear auth cookie & end session
// @access  Public
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });
  res.json({
    success: true,
    message: 'Logged out successfully.'
  });
});

// @route   PUT /api/auth/update-account
// @desc    Update student account details
// @access  Private
router.put('/update-account', protect, async (req, res, next) => {
  try {
    const { fullName, name, college, department, yearOfStudy, year, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (fullName || name) {
      user.fullName = (fullName || name).trim();
    }
    if (college) user.college = college.trim();
    if (department) user.department = department.trim();
    if (yearOfStudy || year) user.yearOfStudy = normalizeYear(yearOfStudy || year);
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      message: 'Account details updated successfully',
      user: {
        _id: user._id,
        fullName: user.fullName,
        name: user.fullName,
        email: user.email,
        college: user.college,
        department: user.department,
        yearOfStudy: user.yearOfStudy,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/auth/update-password
// @desc    Update password securely
// @access  Private
router.put('/update-password', protect, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new passwords'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password does not match.'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully.'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
