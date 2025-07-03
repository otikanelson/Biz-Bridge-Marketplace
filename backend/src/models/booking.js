// models/booking.js - Simplified No-Payment Version
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

  // ========== SIMPLIFIED STATUS SYSTEM ==========
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'cancelled'],
    default: 'in_progress',
    index: true
  },

  // ========== STATUS HISTORY (SIMPLIFIED) ==========
  statusHistory: [{
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'cancelled']
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    reason: String, // For cancellations
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],

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
    }
  },

  // ========== NEW: AGREEMENT TRACKING ==========
  agreement: {
    contractAccepted: {
      customer: { 
        type: Boolean, 
        default: false 
      },
      artisan: { 
        type: Boolean, 
        default: false 
      },
      timestamps: {
        customer: Date,
        artisan: Date
      }
    },
    agreedTerms: {
      pricing: {
        type: String,
        required: false // What was agreed upon (e.g., "₦50,000 for Furniture Making")
      },
      duration: {
        type: String,
        required: false // Expected completion time
      },
      meetingLocation: {
        type: String,
        required: false // Where service will be performed
      },
      specialTerms: {
        type: String,
        maxlength: [500, "Special terms cannot exceed 500 characters"]
      },
      selectedCategory: {
        type: String,
        required: false // For categorized services
      }
    },
    contractText: {
      type: String, // Generated contract content
      required: false
    },
    bothPartiesAccepted: {
      type: Boolean,
      default: false
    }
  },

  // ========== NEW: DISPUTE HANDLING ==========
  dispute: {
    isDisputed: {
      type: Boolean,
      default: false
    },
    filedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    reason: {
      type: String,
      enum: [
        'service_not_delivered',
        'quality_issues', 
        'timeline_exceeded',
        'category_mismatch',
        'artisan_unresponsive',
        'customer_unresponsive',
        'scope_disagreement',
        'other'
      ]
    },
    description: {
      type: String,
      maxlength: [1000, "Dispute description cannot exceed 1000 characters"]
    },
    filedAt: Date,
    status: {
      type: String,
      enum: ['open', 'investigating', 'resolved', 'closed'],
      default: 'open'
    },
    resolution: {
      resolvedBy: {
        type: String,
        enum: ['admin', 'mutual_agreement', 'auto_resolved']
      },
      resolutionDate: Date,
      resolutionNotes: String
    }
  },

  // ========== LOCATION ==========
  location: {
    address: String,
    lga: String,
    state: {
      type: String,
      default: 'Lagos'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },

  // ========== COMMUNICATION ==========
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    message: {
      type: String,
      required: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"]
    },
    attachments: [String], // URLs to attached files
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }],

  // ========== REVIEWS (SIMPLIFIED) ==========
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

  // ========== CANCELLATION (SIMPLIFIED) ==========
  cancellation: {
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    reason: {
      type: String,
      enum: [
        "customer_request", 
        "artisan_unavailable", 
        "scope_changes", 
        "timeline_conflicts", 
        "quality_concerns", 
        "mutual_agreement",
        "other"
      ]
    },
    description: {
      type: String,
      maxlength: [500, "Cancellation description cannot exceed 500 characters"]
    },
    cancellationDate: Date
  },

  // ========== METADATA ==========
  source: {
    type: String,
    enum: ["direct_booking", "service_request", "repeat_customer"],
    default: "service_request"
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

// ========== INDEXES FOR PERFORMANCE ==========
BookingSchema.index({ customer: 1, status: 1 });
BookingSchema.index({ artisan: 1, status: 1 });
BookingSchema.index({ "scheduledDate.startDate": 1 });
BookingSchema.index({ status: 1, createdAt: -1 });
BookingSchema.index({ serviceRequest: 1 });
BookingSchema.index({ "dispute.isDisputed": 1 });
BookingSchema.index({ "agreement.bothPartiesAccepted": 1 });

// ========== VIRTUAL FIELDS ==========
BookingSchema.virtual('totalDuration').get(function() {
  if (this.scheduledDate.endDate && this.scheduledDate.startDate) {
    return this.scheduledDate.endDate - this.scheduledDate.startDate;
  }
  return null;
});

BookingSchema.virtual('isOverdue').get(function() {
  return this.scheduledDate.startDate < new Date() && 
         this.status === 'in_progress';
});

BookingSchema.virtual('contractFullyAccepted').get(function() {
  return this.agreement.contractAccepted.customer && 
         this.agreement.contractAccepted.artisan;
});

BookingSchema.virtual('daysSinceCreated').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// ========== INSTANCE METHODS ==========

// Agreement methods
BookingSchema.methods.acceptContract = function(userId, userType) {
  if (userType === 'customer') {
    this.agreement.contractAccepted.customer = true;
    this.agreement.contractAccepted.timestamps.customer = new Date();
  } else if (userType === 'artisan') {
    this.agreement.contractAccepted.artisan = true;
    this.agreement.contractAccepted.timestamps.artisan = new Date();
  }
  
  // Check if both parties have accepted
  this.agreement.bothPartiesAccepted = 
    this.agreement.contractAccepted.customer && 
    this.agreement.contractAccepted.artisan;
  
  return this.save();
};

// Status management methods
BookingSchema.methods.markAsCompleted = function(customerId) {
  // Only customer can mark as completed
  if (this.customer.toString() !== customerId.toString()) {
    throw new Error('Only the customer can mark a booking as completed');
  }
  
  this.status = 'completed';
  this.statusHistory.push({
    status: 'completed',
    changedBy: customerId,
    timestamp: new Date()
  });
  
  return this.save();
};

BookingSchema.methods.cancel = function(userId, reason, description) {
  this.status = 'cancelled';
  this.cancellation = {
    cancelledBy: userId,
    reason,
    description,
    cancellationDate: new Date()
  };
  
  this.statusHistory.push({
    status: 'cancelled',
    changedBy: userId,
    reason,
    timestamp: new Date()
  });
  
  return this.save();
};

// Dispute methods
BookingSchema.methods.fileDispute = function(userId, reason, description) {
  this.dispute = {
    isDisputed: true,
    filedBy: userId,
    reason,
    description,
    filedAt: new Date(),
    status: 'open'
  };
  
  return this.save();
};

BookingSchema.methods.resolveDispute = function(resolvedBy, resolutionNotes) {
  this.dispute.status = 'resolved';
  this.dispute.resolution = {
    resolvedBy,
    resolutionDate: new Date(),
    resolutionNotes
  };
  
  return this.save();
};

// Communication methods
BookingSchema.methods.addMessage = function(senderId, message, attachments = []) {
  this.messages.push({
    sender: senderId,
    message: message,
    attachments: attachments
  });
  return this.save();
};

// Review methods
BookingSchema.methods.addReview = function(reviewerType, rating, comment) {
  const reviewData = {
    rating,
    comment,
    reviewDate: new Date()
  };

  if (reviewerType === 'customer') {
    this.review.customerReview = reviewData;
  } else if (reviewerType === 'artisan') {
    this.review.artisanReview = reviewData;
  }

  return this.save();
};

// ========== STATIC METHODS ==========
BookingSchema.statics.getActiveBookings = function(userId, userType) {
  const query = {
    status: 'in_progress'
  };
  
  if (userType === 'customer') {
    query.customer = userId;
  } else {
    query.artisan = userId;
  }
  
  return this.find(query)
    .populate('service', 'title category')
    .populate('customer', 'name email')
    .populate('artisan', 'name email')
    .sort({ 'scheduledDate.startDate': 1 });
};

BookingSchema.statics.getBookingHistory = function(userId, userType, limit = 20) {
  const query = {};
  
  if (userType === 'customer') {
    query.customer = userId;
  } else {
    query.artisan = userId;
  }
  
  return this.find(query)
    .populate('service', 'title category')
    .populate('customer', 'name email')
    .populate('artisan', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit);
};

BookingSchema.statics.getDisputedBookings = function() {
  return this.find({ 'dispute.isDisputed': true })
    .populate('service', 'title category')
    .populate('customer', 'name email')
    .populate('artisan', 'name email')
    .populate('dispute.filedBy', 'name email')
    .sort({ 'dispute.filedAt': -1 });
};

BookingSchema.statics.getPendingContracts = function(userId, userType) {
  const acceptanceField = userType === 'customer' ? 
    'agreement.contractAccepted.customer' : 
    'agreement.contractAccepted.artisan';
  
  const query = {
    status: 'in_progress',
    [acceptanceField]: false
  };
  
  if (userType === 'customer') {
    query.customer = userId;
  } else {
    query.artisan = userId;
  }
  
  return this.find(query)
    .populate('service', 'title category')
    .populate('customer', 'name email')
    .populate('artisan', 'name email');
};

BookingSchema.statics.getOverdueBookings = function() {
  return this.find({
    status: 'in_progress',
    'scheduledDate.startDate': { $lt: new Date() }
  }).populate('service', 'title category')
    .populate('customer', 'name email')
    .populate('artisan', 'name email');
};

export default mongoose.model("Booking", BookingSchema);