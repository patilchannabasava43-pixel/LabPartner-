const express = require('express');
const router = express.Router();
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const PartnerRequest = require('../models/PartnerRequest');
const { protect } = require('../middleware/auth');
const { calculateCompatibility } = require('../services/matchingService');

const SAFE_USER_FIELDS = 'fullName name email college department yearOfStudy year avatar createdAt';

/**
 * @route   GET /api/partners (and /api/partners/my-partners)
 * @desc    Get all accepted study partners for the authenticated student
 * @access  Private
 */
const handleGetPartners = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const myProfile = await StudentProfile.findOne({ user: currentUserId });

    // Find all accepted partnerships involving current user
    const acceptedRequests = await PartnerRequest.find({
      status: 'accepted',
      $or: [{ sender: currentUserId }, { receiver: currentUserId }]
    })
      .populate('sender', SAFE_USER_FIELDS)
      .populate('receiver', SAFE_USER_FIELDS)
      .sort({ updatedAt: -1 });

    // Deduplicate and assemble detailed partner items
    const partnerMap = new Map();

    for (const reqItem of acceptedRequests) {
      const isSender = reqItem.sender._id.toString() === currentUserId.toString();
      const partnerUser = isSender ? reqItem.receiver : reqItem.sender;
      const partnerIdStr = partnerUser._id.toString();

      if (!partnerMap.has(partnerIdStr)) {
        const partnerProfile = await StudentProfile.findOne({ user: partnerUser._id });
        const comp = calculateCompatibility(myProfile, partnerProfile);

        partnerMap.set(partnerIdStr, {
          requestId: reqItem._id,
          id: reqItem._id,
          connectedSince: reqItem.respondedAt || reqItem.updatedAt,
          partner: {
            _id: partnerUser._id,
            id: partnerUser._id,
            fullName: partnerUser.fullName || partnerUser.name,
            name: partnerUser.fullName || partnerUser.name,
            college: partnerUser.college,
            department: partnerUser.department,
            yearOfStudy: partnerUser.yearOfStudy || partnerUser.year,
            year: partnerUser.yearOfStudy || partnerUser.year,
            email: partnerUser.email,
            avatar: (partnerProfile && partnerProfile.avatar) || partnerUser.avatar || '',
            createdAt: partnerUser.createdAt
          },
          profile: partnerProfile ? {
            _id: partnerProfile._id,
            bio: partnerProfile.bio,
            subjects: partnerProfile.subjects || [],
            skills: partnerProfile.skills || [],
            interests: partnerProfile.interests || [],
            studyGoals: partnerProfile.studyGoals || [],
            preferredStudyMode: partnerProfile.preferredStudyMode,
            availability: partnerProfile.availability || [],
            contactEmail: partnerProfile.contactEmail,
            contactPhone: partnerProfile.contactPhone,
            linkedinUrl: partnerProfile.linkedinUrl,
            githubUrl: partnerProfile.githubUrl,
            discordHandle: partnerProfile.discordHandle
          } : null,
          compatibility: comp
        });
      }
    }

    const partners = Array.from(partnerMap.values());

    res.json({
      success: true,
      count: partners.length,
      partners
    });
  } catch (error) {
    next(error);
  }
};

router.get('/', protect, handleGetPartners);
router.get('/my-partners', protect, handleGetPartners);

/**
 * @route   GET /api/partners/stats
 * @desc    Get dashboard metrics for current user
 * @access  Private
 */
router.get('/stats', protect, async (req, res, next) => {
  try {
    const currentUserId = req.user._id;

    // 1. Accepted partners count
    const acceptedCount = await PartnerRequest.countDocuments({
      status: 'accepted',
      $or: [{ sender: currentUserId }, { receiver: currentUserId }]
    });

    // 2. Incoming pending requests count
    const pendingIncomingCount = await PartnerRequest.countDocuments({
      receiver: currentUserId,
      status: 'pending'
    });

    // 3. Outgoing pending requests count
    const pendingOutgoingCount = await PartnerRequest.countDocuments({
      sender: currentUserId,
      status: 'pending'
    });

    // 4. Total other students in platform
    const totalStudents = await User.countDocuments({ _id: { $ne: currentUserId } });

    // 5. User Profile completion
    const myProfile = await StudentProfile.findOne({ user: currentUserId });
    const profileCompletion = myProfile ? myProfile.calculateCompletion() : 0;

    res.json({
      success: true,
      stats: {
        acceptedPartners: acceptedCount,
        pendingIncoming: pendingIncomingCount,
        pendingOutgoing: pendingOutgoingCount,
        totalAvailableStudents: totalStudents,
        profileCompletion
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
