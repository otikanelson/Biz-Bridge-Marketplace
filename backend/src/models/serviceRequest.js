// backend/src/models/serviceRequest.js - Simplified Structure
import mongoose from 'mongoose';

const ServiceRequestSchema = new mongoose.Schema({
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

  // ========== REQUEST DETAILS ==========
  title: {
    type: String,
    required: [true, "Request title is required"],
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"]
  },
  description: {
    type: String,
    required: [true, "Request description is required"],
    trim: true,
    maxlength: [1000, "Description cannot exceed 1000 characters"]
  },
  
  // For categorized services - which category was selected
  selectedCategory: {
    type: String,
    trim: true,
    default: null
  },
  
  specialRequirements: {
    type: String,
    trim: true,
    maxlength: [500, "Special requirements cannot exceed 500 characters"]
  },

  // ========== PREFERRED TIMELINE ==========
  preferredSchedule: {
    startDate: {
      type: Date,
      required: false
    },
    endDate: {
      type: Date,
      required: false
    },
    flexibility: {
      type: String,
      enum: ['flexible', 'somewhat_flexible', 'fixed'],
      default: 'flexible'
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [200, "Schedule notes cannot exceed 200 characters"]
    }
  },

  // ========== STATUS MANAGEMENT ==========
  status: {
    type: String,
    enum: [
      'pending',     // Just sent by customer
      'viewed',      // Artisan has seen it
      'accepted',    // Artisan accepted (ready to convert to booking)
      'declined',    // Artisan declined
      'retracted',   // Customer retracted before artisan response
      'converted',   // Converted to booking
      'expired'      // Expired due to time limit
    ],
    default: 'pending',
    index: true
  },

  // ========== ARTISAN RESPONSE ==========
  artisanResponse: {
    hasResponded: {
      type: Boolean,
      default: false
    },
    respondedAt: {
      type: Date
    },
    responseType: {
      type: String,
      enum: ['accepted', 'declined', 'counter_offer'],
      default: null
    },
    message: {
      type: String,
      trim: true,
      maxlength: [500, "Response message cannot exceed 500 characters"]
    },
    // For negotiable services - artisan's proposed terms
    proposedTerms: {
      priceRange: {
        type: String,
        trim: true
      },
      duration: {
        type: String,
        trim: true
      },
      conditions: {
        type: String,
        trim: true,
        maxlength: [300, "Conditions cannot exceed 300 characters"]
      }
    },
    declineReason: {
      type: String,
      trim: true,
      maxlength: [300, "Decline reason cannot exceed 300 characters"]
    }
  },

  // ========== COMMUNICATION ==========
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, "Message cannot exceed 500 characters"]
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }],

  // ========== CONVERSION TO BOOKING ==========
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    default: null
  },
  conversionDate: {
    type: Date,
    default: null
  },

  // ========== AUTO-EXPIRY ==========
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from creation
    },
    index: { expireAfterSeconds: 0 }
  }
}, { 
  timestamps: true 
});

// Add indexes for faster querying
ServiceRequestSchema.index({ customer: 1, status: 1 });
ServiceRequestSchema.index({ artisan: 1, status: 1 });
ServiceRequestSchema.index({ createdAt: -1 });
ServiceRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ========== VIRTUALS ==========
ServiceRequestSchema.virtual('daysRemaining').get(function() {
  if (!this.expiresAt) return null;
  const remaining = this.expiresAt.getTime() - Date.now();
  return Math.max(0, Math.ceil(remaining / (1000 * 60 * 60 * 24)));
});

ServiceRequestSchema.virtual('responseTime').get(function() {
  if (!this.artisanResponse.respondedAt) return null;
  return this.artisanResponse.respondedAt - this.createdAt;
});

// ========== METHODS ==========
ServiceRequestSchema.methods.markAsViewed = function() {
  if (this.status === 'pending') {
    this.status = 'viewed';
    return this.save();
  }
  return this;
};

ServiceRequestSchema.methods.acceptRequest = function(artisanId, message = '', proposedTerms = {}) {
  if (this.artisan.toString() !== artisanId.toString()) {
    throw new Error('Only the target artisan can accept this request');
  }
  
  if (this.status !== 'pending' && this.status !== 'viewed') {
    throw new Error('Can only accept pending or viewed requests');
  }
  
  this.status = 'accepted';
  this.artisanResponse = {
    hasResponded: true,
    respondedAt: new Date(),
    responseType: 'accepted',
    message,
    proposedTerms
  };
  
  return this.save();
};

ServiceRequestSchema.methods.declineRequest = function(artisanId, reason) {
  if (this.artisan.toString() !== artisanId.toString()) {
    throw new Error('Only the target artisan can decline this request');
  }
  
  if (this.status !== 'pending' && this.status !== 'viewed') {
    throw new Error('Can only decline pending or viewed requests');
  }
  
  this.status = 'declined';
  this.artisanResponse = {
    hasResponded: true,
    respondedAt: new Date(),
    responseType: 'declined',
    declineReason: reason
  };
  
  return this.save();
};

ServiceRequestSchema.methods.retractRequest = function(customerId) {
  if (this.customer.toString() !== customerId.toString()) {
    throw new Error('Only the customer can retract their own request');
  }
  
  if (this.status !== 'pending') {
    throw new Error('Can only retract pending requests');
  }
  
  this.status = 'retracted';
  return this.save();
};

ServiceRequestSchema.methods.addMessage = function(senderId, message) {
  if (this.customer.toString() !== senderId.toString() && 
      this.artisan.toString() !== senderId.toString()) {
    throw new Error('Only request participants can send messages');
  }
  
  this.messages.push({
    sender: senderId,
    message: message
  });
  
  return this.save();
};

ServiceRequestSchema.methods.convertToBooking = function(bookingId) {
  if (this.status !== 'accepted') {
    throw new Error('Can only convert accepted requests to bookings');
  }
  
  this.status = 'converted';
  this.booking = bookingId;
  this.conversionDate = new Date();
  return this.save();
};

// ========== STATIC METHODS ==========
ServiceRequestSchema.statics.getExpiredRequests = function() {
  return this.find({
    status: { $in: ['pending', 'viewed'] },
    expiresAt: { $lt: new Date() }
  });
};

ServiceRequestSchema.statics.markExpiredRequests = function() {
  return this.updateMany(
    {
      status: { $in: ['pending', 'viewed'] },
      expiresAt: { $lt: new Date() }
    },
    { $set: { status: 'expired' } }
  );
};

// Get customer's sent requests
ServiceRequestSchema.statics.getCustomerRequests = function(customerId, status = null) {
  const query = { customer: customerId };
  if (status && status !== 'all') {
    query.status = status;
  }
  
  return this.find(query)
    .populate('artisan', 'businessName contactName profileImage')
    .populate('service', 'title category images')
    .sort({ createdAt: -1 });
};

// Get artisan's received requests
ServiceRequestSchema.statics.getArtisanRequests = function(artisanId, status = null) {
  const query = { artisan: artisanId };
  if (status && status !== 'all') {
    query.status = status;
  }
  
  return this.find(query)
    .populate('customer', 'fullName profileImage')
    .populate('service', 'title category images')
    .sort({ createdAt: -1 });
};

export default mongoose.model("ServiceRequest", ServiceRequestSchema);