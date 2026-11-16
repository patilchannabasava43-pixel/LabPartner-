const express = require('express');
const router = express.Router();
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const PartnerRequest = require('../models/PartnerRequest');
const { protect } = require('../middleware/auth');
const { calculateCompatibility } = require('../utils/compatibility');

// @route   GET /api/dashboard/overview
// @desc    Get aggregated overview data for the student dashboard
// @access  Private
router.get('/overview', protect, async (req, res, next) => {
  try {
    const currentUserId = req.user._id;

    // 1. Fetch current student's full profile
    let myProfile = await StudentProfile.findOne({ user: currentUserId });
    if (!myProfile) {
      myProfile = await StudentProfile.create({
        user: currentUserId,
        contactEmail: req.user.email
      });
    }

    const { completionPercentage, suggestions } = myProfile.calculateCompletion(req.user);

    // 2. Aggregate partner request statistics
    const [acceptedCount, incomingPendingCount, outgoingPendingCount] = await Promise.all([
      PartnerRequest.countDocuments({
        status: 'accepted',
        $or: [{ sender: currentUserId }, { receiver: currentUserId }]
      }),
      PartnerRequest.countDocuments({
        receiver: currentUserId,
        status: 'pending'
      }),
      PartnerRequest.countDocuments({
        sender: currentUserId,
        status: 'pending'
      })
    ]);

    // 3. Fetch recent incoming requests (latest 3)
    const incomingRaw = await PartnerRequest.find({
      receiver: currentUserId,
      status: 'pending'
    })
      .populate('sender', '-password')
      .sort({ createdAt: -1 })
      .limit(3);

    const incomingRequests = await Promise.all(
      incomingRaw.map(async (r) => {
        const senderProfile = await StudentProfile.findOne({ user: r.sender._id });
        const comp = calculateCompatibility(myProfile, senderProfile);
        return {
          _id: r._id,
          student: r.sender,
          profile: senderProfile,
          message: r.message,
          compatibility: comp,
          createdAt: r.createdAt,
          status: 'pending_received'
        };
      })
    );

    // 4. Fetch recent outgoing requests (latest 3)
    const outgoingRaw = await PartnerRequest.find({
      sender: currentUserId,
      status: 'pending'
    })
      .populate('receiver', '-password')
      .sort({ createdAt: -1 })
      .limit(3);

    const outgoingRequests = await Promise.all(
      outgoingRaw.map(async (r) => {
        const receiverProfile = await StudentProfile.findOne({ user: r.receiver._id });
        const comp = calculateCompatibility(myProfile, receiverProfile);
        return {
          _id: r._id,
          student: r.receiver,
          profile: receiverProfile,
          message: r.message,
          compatibility: comp,
          createdAt: r.createdAt,
          status: 'pending_sent'
        };
      })
    );

    // 5. Fetch recently accepted partners (latest 3)
    const acceptedRaw = await PartnerRequest.find({
      status: 'accepted',
      $or: [{ sender: currentUserId }, { receiver: currentUserId }]
    })
      .populate('sender', '-password')
      .populate('receiver', '-password')
      .sort({ updatedAt: -1 })
      .limit(3);

    const recentPartners = await Promise.all(
      acceptedRaw.map(async (r) => {
        const isSender = r.sender._id.toString() === currentUserId.toString();
        const partner = isSender ? r.receiver : r.sender;
        const partnerProfile = await StudentProfile.findOne({ user: partner._id });
        const comp = calculateCompatibility(myProfile, partnerProfile);
        return {
          _id: r._id,
          student: partner,
          profile: partnerProfile,
          compatibility: comp,
          connectedSince: r.updatedAt,
          status: 'accepted'
        };
      })
    );

    // 6. Compute recommended study partners
    const otherUsers = await User.find({ _id: { $ne: currentUserId } }).select('-password');
    const otherUserIds = otherUsers.map((u) => u._id);
    const otherProfiles = await StudentProfile.find({ user: { $in: otherUserIds } });
    const profileMap = new Map();
    otherProfiles.forEach((p) => profileMap.set(p.user.toString(), p));

    // Fetch existing request map to annotate connection status
    const existingReqs = await PartnerRequest.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }]
    });

    const statusMap = new Map();
    existingReqs.forEach((r) => {
      const otherId =
        r.sender.toString() === currentUserId.toString()
          ? r.receiver.toString()
          : r.sender.toString();
      statusMap.set(otherId, {
        id: r._id,
        status: r.status,
        isSender: r.sender.toString() === currentUserId.toString()
      });
    });

    const candidates = otherUsers.map((u) => {
      const p = profileMap.get(u._id.toString()) || null;
      const comp = calculateCompatibility(myProfile, p);
      const reqInfo = statusMap.get(u._id.toString());
      let connectionStatus = 'none';

      if (reqInfo) {
        if (reqInfo.status === 'accepted') {
          connectionStatus = 'accepted';
        } else if (reqInfo.status === 'pending') {
          connectionStatus = reqInfo.isSender ? 'pending_sent' : 'pending_received';
        } else {
          connectionStatus = reqInfo.status;
        }
      }

      return {
        user: u,
        profile: p,
        compatibility: comp,
        connectionStatus,
        requestId: reqInfo ? reqInfo.id : null
      };
    });

    // Sort by compatibility descending
    candidates.sort((a, b) => b.compatibility.score - a.compatibility.score);
    const recommendedStudents = candidates.slice(0, 4);

    // 7. Assemble real recent activity feed
    const activities = [];

    // Partner requests received
    incomingRaw.forEach((r) => {
      activities.push({
        id: `inc_${r._id}`,
        type: 'request_received',
        title: 'New Partner Request',
        description: `${r.sender.fullName || r.sender.name} sent you a study invitation.`,
        timestamp: r.createdAt,
        user: r.sender
      });
    });

    // Partner requests sent
    outgoingRaw.forEach((r) => {
      activities.push({
        id: `out_${r._id}`,
        type: 'request_sent',
        title: 'Partner Request Sent',
        description: `You invited ${r.receiver.fullName || r.receiver.name} to collaborate.`,
        timestamp: r.createdAt,
        user: r.receiver
      });
    });

    // Accepted partnerships
    acceptedRaw.forEach((r) => {
      const isSender = r.sender._id.toString() === currentUserId.toString();
      const partner = isSender ? r.receiver : r.sender;
      activities.push({
        id: `acc_${r._id}`,
        type: 'partnership_active',
        title: 'Study Partnership Established',
        description: `You and ${partner.fullName || partner.name} are now study partners.`,
        timestamp: r.updatedAt,
        user: partner
      });
    });

    // Profile updated event
    if (myProfile.updatedAt) {
      activities.push({
        id: `prof_${myProfile._id}`,
        type: 'profile_updated',
        title: 'Profile Updated',
        description: 'Your academic profile and availability schedule were synchronized.',
        timestamp: myProfile.updatedAt,
        user: req.user
      });
    }

    // Sort activities chronologically newest first (max 5)
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const recentActivity = activities.slice(0, 5);

    // Return unified dashboard payload
    res.json({
      success: true,
      data: {
        student: {
          _id: req.user._id,
          fullName: req.user.fullName || req.user.name,
          name: req.user.fullName || req.user.name,
          email: req.user.email,
          college: req.user.college,
          department: req.user.department,
          yearOfStudy: req.user.yearOfStudy || req.user.year,
          avatar: req.user.avatar
        },
        profile: myProfile,
        stats: {
          totalPartners: acceptedCount,
          pendingIncoming: incomingPendingCount,
          pendingOutgoing: outgoingPendingCount,
          profileCompletion: completionPercentage,
          totalRecommendations: candidates.length
        },
        profileCompletion: {
          percentage: completionPercentage,
          suggestions
        },
        recommendedStudents,
        requestsSummary: {
          incoming: incomingRequests,
          outgoing: outgoingRequests,
          recentlyAccepted: recentPartners
        },
        recentActivity
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

