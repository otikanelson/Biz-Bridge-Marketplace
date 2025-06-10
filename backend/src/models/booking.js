// backend/src/models/booking.js - Enhanced version
import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  // ========== CORE RELATIONSHIPS ==========
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Customer is required"],
    index: true
  },
  artisan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Artisan is required"],
    index: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: [true, "Service is required"],
    index: true
  },
  serviceRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceRequest",
    default: null // Only populated if booking came from a service request
  },

  // ========== BOOKING DETAILS ==========
  title: {
    type: String,
    required: [true, "Booking title is required"],
    trim: true
  },
  description: {
    type: String,
    required: false,
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"]
  },

  // ========== SCHEDULING ==========
  scheduledDate: {
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      validate: {
        validator: function(value) {
          return value >= new Date();
        },
        message: "Start date cannot be in the past"
      }
    },
    endDate: {
      type: Date,
      required: false
    },
    startTime: {
      type: String, // Format: "HH:MM" (24-hour)
      validate: {
        validator: function(value) {
          return !value || /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
        },
        message: "Invalid time format. Use HH:MM (24-hour format)"
      }
    },
    endTime: {
      type: String,
      validate: {
        validator: function(value) {
          return !value || /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
        },
        message: "Invalid time format. Use HH:MM (24-hour format)"
      }
    },
    duration: {
      value: Number,
      unit: {
        type: String,
        enum: ["minutes", "hours", "days", "weeks"]
      }
    }
  },

  // ========== PRICING ==========
  pricing: {
    agreedPrice: {
      type: Number,
      required: [true, "Agreed price is required"],
      min: [0, "Price cannot be negative"]
    },
    currency: {
      type: String,
      default: "NGN",
      enum: ["NGN", "USD"]
    },
    breakdown: [{
      item: String,
      cost: Number,
      description: String
    }],
    paymentTerms: {
      type: String,
      enum: ["full_upfront", "deposit_balance", "milestone_based", "on_completion"],
      default: "deposit_balance"
    },
    depositAmount: {
      type: Number,
      min: [0, "Deposit cannot be negative"]
    },
    depositPaid: {
      type: Boolean,
      default: false
    },
    finalPaymentDue: {
      type: Date
    }
  },

  // ========== LOCATION ==========
  location: {
    type: {
      type: String,
      enum: ["customer_location", "artisan_workshop", "neutral_location", "pickup_delivery"],
      required: [true, "Location type is required"]
    },
    address: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      default: "Lagos"
    },
    state: {
      type: String,
      default: "Lagos"
    },
    lga: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    meetingPoint: {
      type: String,
      trim: true
    }
  },

  // ========== STATUS MANAGEMENT ==========
  status: {
    type: String,
    enum: [
      "pending",        // Just created, waiting for artisan confirmation
      "confirmed",      // Artisan confirmed, booking is active
      "in_progress",    // Work has begun
      "pending_review", // Work completed, waiting for customer review
      "completed",      // Successfully completed
      "cancelled",      // Cancelled by either party
      "disputed",       // There's a dispute
      "refunded"        // Payment was refunded
    ],
    default: "pending",
    index: true
  },
  statusHistory: [{
    status: String,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    reason: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],

  // ========== COMMUNICATION ==========
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    message: {
      type: String,
      required: [true, "Message content is required"],
      trim: true
    },
    attachments: [{
      url: String,
      filename: String,
      type: String
    }],
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }],

  // ========== PROGRESS TRACKING ==========
  milestones: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    dueDate: Date,
    completedDate: Date,
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "overdue"],
      default: "pending"
    },
    images: [String] // Progress photos
  }],

  // ========== REVIEW & RATING ==========
  review: {
    customerReview: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: {
        type: String,
        maxlength: [500, "Review comment cannot exceed 500 characters"]
      },
      images: [String],
      reviewDate: Date
    },
    artisanReview: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: {
        type: String,
        maxlength: [500, "Review comment cannot exceed 500 characters"]
      },
      reviewDate: Date
    }
  },

  // ========== CANCELLATION ==========
  cancellation: {
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    reason: {
      type: String,
      enum: [
        "customer_request", "artisan_unavailable", "payment_issues", 
        "scope_changes", "timeline_conflicts", "quality_concerns", "other"
      ]
    },
    description: String,
    cancellationDate: Date,
    refundAmount: Number,
    refundProcessed: {
      type: Boolean,
      default: false
    }
  },

  // ========== METADATA ==========
  source: {
    type: String,
    enum: ["direct_booking", "service_request", "repeat_customer"],
    default: "direct_booking"
  },
  tags: [String],
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium"
  }
}, { 
  timestamps: true 
});

// ========== INDEXES ==========
BookingSchema.index({ customer: 1, status: 1 });
BookingSchema.index({ artisan: 1, status: 1 });
BookingSchema.index({ "scheduledDate.startDate": 1 });
BookingSchema.index({ status: 1, createdAt: -1 });
BookingSchema.index({ serviceRequest: 1 });

// ========== VIRTUAL FIELDS ==========
BookingSchema.virtual('totalDuration').get(function() {
  if (this.scheduledDate.endDate && this.scheduledDate.startDate) {
    return this.scheduledDate.endDate - this.scheduledDate.startDate;
  }
  return null;
});

BookingSchema.virtual('isOverdue').get(function() {
  return this.scheduledDate.startDate < new Date() && 
         !['completed', 'cancelled'].includes(this.status);
});

// ========== METHODS ==========
BookingSchema.methods.confirm = function() {
  this.status = 'confirmed';
  this.statusHistory.push({
    status: 'confirmed',
    changedBy: this.artisan,
    timestamp: new Date()
  });
  return this.save();
};

BookingSchema.methods.startWork = function() {
  this.status = 'in_progress';
  this.statusHistory.push({
    status: 'in_progress',
    changedBy: this.artisan,
    timestamp: new Date()
  });
  return this.save();
};

BookingSchema.methods.complete = function() {
  this.status = 'pending_review';
  this.statusHistory.push({
    status: 'pending_review',
    changedBy: this.artisan,
    timestamp: new Date()
  });
  return this.save();
};

BookingSchema.methods.cancel = function(cancelledBy, reason, description) {
  this.status = 'cancelled';
  this.cancellation = {
    cancelledBy,
    reason,
    description,
    cancellationDate: new Date()
  };
  this.statusHistory.push({
    status: 'cancelled',
    changedBy: cancelledBy,
    reason,
    timestamp: new Date()
  });
  return this.save();
};

BookingSchema.methods.addReview = function(reviewerType, rating, comment, images = []) {
  const reviewData = {
    rating,
    comment,
    images,
    reviewDate: new Date()
  };

  if (reviewerType === 'customer') {
    this.review.customerReview = reviewData;
  } else if (reviewerType === 'artisan') {
    this.review.artisanReview = reviewData;
  }

  // Mark as completed if both parties have reviewed
  if (this.review.customerReview && this.review.artisanReview) {
    this.status = 'completed';
  }

  return this.save();
};

BookingSchema.methods.addMessage = function(senderId, message, attachments = []) {
  this.messages.push({
    sender: senderId,
    message: message,
    attachments: attachments
  });
  return this.save();
};

BookingSchema.methods.addMilestone = function(milestoneData) {
  this.milestones.push(milestoneData);
  return this.save();
};

BookingSchema.methods.updateMilestone = function(milestoneId, updateData) {
  const milestone = this.milestones.id(milestoneId);
  if (milestone) {
    Object.assign(milestone, updateData);
    return this.save();
  }
  throw new Error('Milestone not found');
};

// ========== STATIC METHODS ==========
BookingSchema.statics.getUpcomingBookings = function(artisanId, days = 7) {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + days);
  
  return this.find({
    artisan: artisanId,
    status: { $in: ['confirmed', 'in_progress'] },
    'scheduledDate.startDate': {
      $gte: new Date(),
      $lte: endDate
    }
  }).sort({ 'scheduledDate.startDate': 1 });
};

BookingSchema.statics.getOverdueBookings = function(artisanId) {
  return this.find({
    artisan: artisanId,
    status: { $in: ['confirmed', 'in_progress'] },
    'scheduledDate.startDate': { $lt: new Date() }
  });
};

export default mongoose.model("Booking", BookingSchema);