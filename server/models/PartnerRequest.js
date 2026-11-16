const mongoose = require('mongoose');

const partnerRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender user ID is required'],
      index: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver user ID is required'],
      index: true
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'accepted', 'rejected', 'cancelled'],
        message: '{VALUE} is not a valid request status'
      },
      default: 'pending',
      index: true
    },
    message: {
      type: String,
      default: 'I would love to collaborate on lab projects and study sessions!',
      maxlength: [500, 'Message cannot exceed 500 characters'],
      trim: true
    },
    respondedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound indexes for optimal query performance and constraint enforcement
partnerRequestSchema.index({ sender: 1, receiver: 1, status: 1 });
partnerRequestSchema.index({ receiver: 1, status: 1, createdAt: -1 });
partnerRequestSchema.index({ sender: 1, status: 1, createdAt: -1 });

// Virtual to easily check recipient or sender
partnerRequestSchema.virtual('isPending').get(function () {
  return this.status === 'pending';
});

module.exports = mongoose.model('PartnerRequest', partnerRequestSchema);
