// backend/src/models/serviceRequest.js
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
    required: false, // Can be null for custom requests not tied to specific service
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
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: [
      'Woodworking', 'Pottery & Ceramics', 'Leathercraft', 'Textile Art',
      'Jewelry Making', 'Metalwork', 'Glass Art', 'Traditional Clothing',
      'Painting & Drawing', 'Sculpture', 'Basket Weaving', 'Beadwork',
      'Paper Crafts', 'Soap & Candle Making', 'Calabash Carving',
      'Musical Instruments', 'Hair Braiding & Styling', 'Furniture Restoration',
      'Shoemaking', 'Sign Writing', 'Tie & Dye', 'Adire Textile',
      'Food Preservation', 'Batik', 'Embroidery', 'Photography', 'Other'
    ],
    index: true
  },

  // ========== BUDGET & TIMELINE ==========
  budget: {
    min: {
      type: Number,
      required: [true, "Minimum budget is required"],
      min: [0, "Budget cannot be negative"]
    },
    max: {
      type: Number,
      required: false,
      min: [0, "Budget cannot be negative"],
      validate: {
        validator: function(value) {
          return !value || value >= this.budget.min;
        },
        message: "Maximum budget must be greater than minimum budget"
      }
    },
    currency: {
      type: String,
      default: "NGN",
      enum: ["NGN", "USD"]
    }
  },
  timeline: {
    preferredStartDate: {
      type: Date,
      required: [true, "Preferred start date is required"],
      validate: {
        validator: function(value) {
          return value >= new Date();
        },
        message: "Start date cannot be in the past"
      }
    },
    preferredEndDate: {
      type: Date,
      required: false,
      validate: {
        validator: function(value) {
          return !value || value >= this.timeline.preferredStartDate;
        },
        message: "End date must be after start date"
      }
    },
    flexibility: {
      type: String,
      enum: ["rigid", "somewhat_flexible", "very_flexible"],
      default: "somewhat_flexible"
    }
  },

  // ========== LOCATION & LOGISTICS ==========
  location: {
    type: {
      type: String,
      enum: ["customer_location", "artisan_workshop", "neutral_location", "pickup_delivery"],
      required: [true, "Location type is required"]
    },
    address: {
      type: String,
      required: function() { 
        return this.location.type === "customer_location" || this.location.type === "neutral_location"; 
      },
      trim: true
    },
    city: {
      type: String,
      default: "Lagos",
      required: true
    },
    state: {
      type: String,
      default: "Lagos",
      required: true
    },
    lga: {
      type: String,
      required: true,
      trim: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },

  // ========== STATUS MANAGEMENT ==========
  status: {
    type: String,
    enum: [
      "pending",        // Just submitted, waiting for artisan response
      "viewed",         // Artisan has seen the request
      "negotiating",    // Back-and-forth discussion happening
      "quoted",         // Artisan has provided a quote
      "accepted",       // Customer accepted artisan's proposal
      "declined",       // Either party declined
      "expired",        // Request expired without response
      "converted"       // Successfully converted to booking
    ],
    default: "pending",
    index: true
  },
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    },
    index: true
  },

  // ========== COMMUNICATION SYSTEM ==========
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    message: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
      maxlength: [500, "Message cannot exceed 500 characters"]
    },
    attachments: [{
      url: String,
      filename: String,
      type: {
        type: String,
        enum: ["image", "document", "video"]
      }
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

  // ========== ARTISAN RESPONSE ==========
  artisanResponse: {
    hasResponded: {
      type: Boolean,
      default: false
    },
    respondedAt: {
      type: Date
    },
    proposedPrice: {
      amount: {
        type: Number,
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
      }]
    },
    estimatedDuration: {
      value: Number,
      unit: {
        type: String,
        enum: ["hours", "days", "weeks", "months"]
      }
    },
    proposedStartDate: {
      type: Date
    },
    proposedEndDate: {
      type: Date
    },
    counterOffer: {
      type: String,
      trim: true,
      maxlength: [500, "Counter offer cannot exceed 500 characters"]
    },
    termsAndConditions: {
      type: String,
      trim: true,
      maxlength: [1000, "Terms cannot exceed 1000 characters"]
    }
  },

  // ========== REQUIREMENTS & SPECIFICATIONS ==========
  requirements: {
    materials: [{
      name: String,
      specifications: String,
      customerProvided: {
        type: Boolean,
        default: false
      }
    }],
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        enum: ["cm", "m", "inch", "ft"],
        default: "cm"
      }
    },
    colors: [String],
    specialInstructions: {
      type: String,
      maxlength: [500, "Special instructions cannot exceed 500 characters"]
    },
    referenceImages: [String], // URLs to reference images
    inspiration: {
      type: String,
      maxlength: [300, "Inspiration description cannot exceed 300 characters"]
    }
  },

  // ========== CONVERSION TRACKING ==========
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    default: null
  },
  conversionDate: {
    type: Date
  },

  // ========== METADATA ==========
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium"
  },
  tags: [{
    type: String,
    trim: true
  }],
  source: {
    type: String,
    enum: ["direct_service", "custom_request", "referral", "search"],
    default: "direct_service"
  }
}, { 
  timestamps: true
});

// ========== INDEXES FOR PERFORMANCE ==========
ServiceRequestSchema.index({ customer: 1, status: 1 });
ServiceRequestSchema.index({ artisan: 1, status: 1 });
ServiceRequestSchema.index({ status: 1, expiresAt: 1 });
ServiceRequestSchema.index({ category: 1, "location.lga": 1 });
ServiceRequestSchema.index({ createdAt: -1 });
ServiceRequestSchema.index({ "artisanResponse.respondedAt": -1 });

// ========== VIRTUAL FIELDS ==========
ServiceRequestSchema.virtual('isExpired').get(function() {
  return this.expiresAt < new Date();
});

ServiceRequestSchema.virtual('timeRemaining').get(function() {
  const now = new Date();
  const remaining = this.expiresAt - now;
  return Math.max(0, remaining);
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

ServiceRequestSchema.methods.addMessage = function(senderId, message, attachments = []) {
  this.messages.push({
    sender: senderId,
    message: message,
    attachments: attachments
  });
  
  // Update status to negotiating if not already
  if (this.status === 'pending' || this.status === 'viewed') {
    this.status = 'negotiating';
  }
  
  return this.save();
};

ServiceRequestSchema.methods.submitQuote = function(responseData) {
  this.artisanResponse = {
    ...responseData,
    hasResponded: true,
    respondedAt: new Date()
  };
  this.status = 'quoted';
  return this.save();
};

ServiceRequestSchema.methods.acceptQuote = function() {
  this.status = 'accepted';
  return this.save();
};

ServiceRequestSchema.methods.decline = function(reason) {
  this.status = 'declined';
  if (reason) {
    this.addMessage(this.artisan, `Request declined: ${reason}`);
  }
  return this.save();
};

ServiceRequestSchema.methods.convertToBooking = function(bookingId) {
  this.status = 'converted';
  this.booking = bookingId;
  this.conversionDate = new Date();
  return this.save();
};

// ========== STATIC METHODS ==========
ServiceRequestSchema.statics.getExpiredRequests = function() {
  return this.find({
    status: { $in: ['pending', 'viewed', 'negotiating'] },
    expiresAt: { $lt: new Date() }
  });
};

ServiceRequestSchema.statics.markExpiredRequests = function() {
  return this.updateMany(
    {
      status: { $in: ['pending', 'viewed', 'negotiating'] },
      expiresAt: { $lt: new Date() }
    },
    { $set: { status: 'expired' } }
  );
};

export default mongoose.model("ServiceRequest", ServiceRequestSchema);