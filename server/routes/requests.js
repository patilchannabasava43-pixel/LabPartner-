const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const PartnerRequest = require('../models/PartnerRequest');
const { protect } = require('../middleware/auth');
const { calculateCompatibility } = require('../services/matchingService');

// Helper to validate Mongo ObjectIDs safely
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Safe projection for public user objects
const SAFE_USER_FIELDS = 'fullName name email college department yearOfStudy year avatar createdAt';

/**
 * @route   POST /api/requests (and /api/requests/send)
 * @desc    Send a partner request to another student
 * @access  Private
 */
const handleSendRequest = async (req, res, next) => {
  try {
    const senderId = req.user._id;
    const recipientId = req.body.receiverId || req.body.recipientId;
    const message = (req.body.message || '').trim() || 'I would love to collaborate on lab projects and study sessions!';

    // 1. Validation checks
    if (!recipientId) {
      return res.status(400).json({
        success: false,
        message: 'Recipient student ID (recipientId or receiverId) is required'
      });
    }

    if (!isValidId(recipientId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid recipient ID format'
      });
    }

    // 2. Prevent sending request to self
    if (senderId.toString() === recipientId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send a partner request to yourself'
      });
    }

    // 3. Ensure target recipient exists
    const recipient = await User.findById(recipientId).select(SAFE_USER_FIELDS);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Target student not found'
      });
    }

    // 4. Check for existing relationships between both users
    const existingRelationship = await PartnerRequest.findOne({
      $or: [
        { sender: senderId, receiver: recipientId },
        { sender: recipientId, receiver: senderId }
      ]
    });

    if (existingRelationship) {
      // Scenario A: Already connected partners
      if (existingRelationship.status === 'accepted') {
        return res.status(400).json({
          success: false,
          message: 'You are already study partners with this student!'
        });
      }

      // Scenario B: Reciprocal pending request (Target user already sent a pending request to current user!)
      if (
        existingRelationship.status === 'pending' &&
        existingRelationship.sender.toString() === recipientId.toString()
      ) {
        return res.status(409).json({
          success: false,
          isReciprocal: true,
          requestId: existingRelationship._id,
          message: `${recipient.fullName || recipient.name} has already sent you a pending partner request! Please accept or respond to their incoming request instead.`
        });
      }

      // Scenario C: Duplicate outgoing request from current user
      if (
        existingRelationship.status === 'pending' &&
        existingRelationship.sender.toString() === senderId.toString()
      ) {
        return res.status(400).json({
          success: false,
          message: 'A pending partner request has already been sent to this student.'
        });
      }

      // Scenario D: Previous request was rejected or cancelled -> Reactivate safely
      existingRelationship.sender = senderId;
      existingRelationship.receiver = recipientId;
      existingRelationship.status = 'pending';
      existingRelationship.message = message;
      existingRelationship.respondedAt = null;
      await existingRelationship.save();

      return res.status(200).json({
        success: true,
        message: 'Partner request sent successfully!',
        request: existingRelationship
      });
    }

    // 5. Create new partner request
    const newRequest = await PartnerRequest.create({
      sender: senderId,
      receiver: recipientId,
      message,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Partner request sent successfully!',
      request: newRequest
    });
  } catch (error) {
    next(error);
  }
};

router.post('/', protect, handleSendRequest);
router.post('/send', protect, handleSendRequest);

/**
 * @route   GET /api/requests
 * @desc    Get partner requests (type: 'incoming' | 'outgoing', optional status & pagination)
 * @access  Private
 */
router.get('/', protect, async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const { type = 'incoming', status, page = 1, limit = 20 } = req.query;

    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const pageLimit = Math.max(1, Math.min(50, parseInt(limit, 10) || 20));

    const myProfile = await StudentProfile.findOne({ user: currentUserId });

    const query = {};
    if (type === 'outgoing') {
      query.sender = currentUserId;
    } else {
      // Default: incoming requests
      query.receiver = currentUserId;
    }

    // Optional status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    const totalCount = await PartnerRequest.countDocuments(query);
    const totalPages = Math.ceil(totalCount / pageLimit) || 1;

    const requests = await PartnerRequest.find(query)
      .populate('sender', SAFE_USER_FIELDS)
      .populate('receiver', SAFE_USER_FIELDS)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit);

    // Attach profile, compatibility breakdown, and clean public fields
    const formattedRequests = await Promise.all(
      requests.map(async (item) => {
        const isIncoming = item.receiver._id.toString() === currentUserId.toString();
        const otherUser = isIncoming ? item.sender : item.receiver;
        const otherProfile = await StudentProfile.findOne({ user: otherUser._id });

        const comp = calculateCompatibility(myProfile, otherProfile);

        return {
          _id: item._id,
          id: item._id,
          sender: item.sender,
          receiver: item.receiver,
          otherUser,
          profile: otherProfile ? {
            _id: otherProfile._id,
            bio: otherProfile.bio,
            subjects: otherProfile.subjects,
            skills: otherProfile.skills,
            interests: otherProfile.interests,
            studyGoals: otherProfile.studyGoals,
            preferredStudyMode: otherProfile.preferredStudyMode,
            availability: otherProfile.availability
          } : null,
          message: item.message,
          status: item.status,
          isIncoming,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          respondedAt: item.respondedAt,
          compatibility: comp
        };
      })
    );

    res.json({
      success: true,
      type,
      requests: formattedRequests,
      pagination: {
        currentPage,
        totalPages,
        totalRequests: totalCount,
        limit: pageLimit,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Backward compatibility:
 * @route   GET /api/requests/incoming
 * @route   GET /api/requests/outgoing
 */
router.get('/incoming', protect, async (req, res, next) => {
  req.query.type = 'incoming';
  req.query.status = 'pending';
  return router.handle(req, res, next);
});

router.get('/outgoing', protect, async (req, res, next) => {
  req.query.type = 'outgoing';
  req.query.status = 'pending';
  return router.handle(req, res, next);
});

/**
 * Accept Request Handler (supports PATCH and PUT /api/requests/:id/accept)
 */
const handleAcceptRequest = async (req, res, next) => {
  try {
    const requestId = req.params.id;
    const currentUserId = req.user._id;

    if (!isValidId(requestId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format'
      });
    }

    const request = await PartnerRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Partner request not found'
      });
    }

    // Permission: Only the intended recipient can accept
    if (request.receiver.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to accept this request (only the recipient can accept)'
      });
    }

    // State check: Only pending requests can be accepted
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `This request cannot be accepted because it is already ${request.status}.`
      });
    }

    // Atomic update
    request.status = 'accepted';
    request.respondedAt = new Date();
    await request.save();

    res.json({
      success: true,
      message: 'Partner request accepted! You are now study partners.',
      request
    });
  } catch (error) {
    next(error);
  }
};

router.patch('/:id/accept', protect, handleAcceptRequest);
router.put('/:id/accept', protect, handleAcceptRequest);

/**
 * Reject Request Handler (supports PATCH and PUT /api/requests/:id/reject)
 */
const handleRejectRequest = async (req, res, next) => {
  try {
    const requestId = req.params.id;
    const currentUserId = req.user._id;

    if (!isValidId(requestId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format'
      });
    }

    const request = await PartnerRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Partner request not found'
      });
    }

    // Permission: Only the intended recipient can reject
    if (request.receiver.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to decline this request (only the recipient can decline)'
      });
    }

    // State check: Only pending requests can be rejected
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `This request cannot be rejected because it is already ${request.status}.`
      });
    }

    request.status = 'rejected';
    request.respondedAt = new Date();
    await request.save();

    res.json({
      success: true,
      message: 'Partner request declined.',
      request
    });
  } catch (error) {
    next(error);
  }
};

router.patch('/:id/reject', protect, handleRejectRequest);
router.put('/:id/reject', protect, handleRejectRequest);

/**
 * Cancel Request Handler (supports PATCH and PUT /api/requests/:id/cancel)
 */
const handleCancelRequest = async (req, res, next) => {
  try {
    const requestId = req.params.id;
    const currentUserId = req.user._id;

    if (!isValidId(requestId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format'
      });
    }

    const request = await PartnerRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Partner request not found'
      });
    }

    // Permission: Only the original sender can cancel
    if (request.sender.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this request (only the sender can cancel)'
      });
    }

    // State check: Only pending requests can be cancelled
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `This request cannot be cancelled because it is already ${request.status}.`
      });
    }

    request.status = 'cancelled';
    request.respondedAt = new Date();
    await request.save();

    res.json({
      success: true,
      message: 'Partner request cancelled.',
      request
    });
  } catch (error) {
    next(error);
  }
};

router.patch('/:id/cancel', protect, handleCancelRequest);
router.put('/:id/cancel', protect, handleCancelRequest);

module.exports = router;
