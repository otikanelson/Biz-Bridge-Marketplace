// backend/src/models/user.js - FIXED VERSION (No Duplicate Indexes)
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  // ========== CORE FIELDS (ALL USERS) ==========
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // ✅ REMOVED: index: true - using schema.index() instead
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true, // ✅ REMOVED: index: true - using schema.index() instead
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    required: [true, 'User role is required'],
    enum: {
      values: ['customer', 'artisan', 'admin'],
      message: 'Role must be either customer, artisan, or admin'
    }
    // ✅ REMOVED: index: true - using schema.index() instead
  },
  profileImage: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
    // ✅ REMOVED: index: true - using schema.index() instead
  },
  isVerified: {
    type: Boolean,
    default: false
    // ✅ REMOVED: index: true - using schema.index() instead
  },
  lastActive: {
    type: Date,
    default: Date.now
  },

  // ========== CUSTOMER-SPECIFIC FIELDS ==========
  // Personal Information
  fullName: {
    type: String,
    required: function() { return this.role === 'customer'; },
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  
  // Customer Location
  customerLocation: {
    city: {
      type: String,
      required: function() { return this.role === 'customer' && this.customerLocation; }
    },
    state: {
      type: String,
      required: function() { return this.role === 'customer' && this.customerLocation; }
    },
    lga: String
  },
  
  // Customer Preferences
  preferences: {
    favoriteCategories: [{
      type: String,
      enum: [
        'Woodworking', 'Pottery & Ceramics', 'Leathercraft', 'Textile Art',
        'Jewelry Making', 'Metalwork', 'Glass Art', 'Traditional Clothing',
        'Painting & Drawing', 'Sculpture', 'Basket Weaving', 'Beadwork',
        'Paper Crafts', 'Soap & Candle Making', 'Calabash Carving',
        'Musical Instruments', 'Hair Braiding & Styling', 'Furniture Restoration',
        'Shoemaking', 'Sign Writing', 'Tie & Dye', 'Adire Textile',
        'Food Preservation', 'Batik', 'Embroidery', 'Photography', 'Other'
      ]
    }],
    budget: {
      min: {
        type: Number,
        min: 0
      },
      max: {
        type: Number,
        min: 0
      }
    }
  },
  
  // Customer Relationships
  savedArtisans: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  bookingHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],

  // ========== ARTISAN-SPECIFIC FIELDS ==========
  // Business Identity
  contactName: {
    type: String,
    required: function() { return this.role === 'artisan'; },
    trim: true,
    maxlength: [100, 'Contact name cannot exceed 100 characters']
  },
  businessName: {
    type: String,
    trim: true,
    maxlength: [150, 'Business name cannot exceed 150 characters']
  },
  businessDescription: {
    type: String,
    trim: true,
    maxlength: [1000, 'Business description cannot exceed 1000 characters']
  },
  
  // Contact Information
  phoneNumber: {
    type: String,
    required: function() { return this.role === 'artisan'; },
    trim: true,
    match: [/^[\+]?[0-9\s\-\(\)]{10,15}$/, 'Please enter a valid phone number']
  },
  whatsappNumber: {
    type: String,
    trim: true,
    match: [/^[\+]?[0-9\s\-\(\)]{10,15}$/, 'Please enter a valid WhatsApp number']
  },
  
  // Business Location
  location: {
    address: {
      type: String,
      trim: true,
      maxlength: [200, 'Address cannot exceed 200 characters']
    },
    city: {
      type: String,
      required: function() { return this.role === 'artisan'; },
      trim: true
    },
    state: {
      type: String,
      required: function() { return this.role === 'artisan'; },
      trim: true
    },
    lga: {
      type: String,
      required: function() { return this.role === 'artisan'; },
      trim: true
    }
  },
  
  // Business Details
  business: {
    yearEstablished: {
      type: Number,
      min: [1900, 'Year established cannot be before 1900'],
      max: [new Date().getFullYear(), 'Year established cannot be in the future']
    },
    staffStrength: {
      type: Number,
      min: [1, 'Staff strength must be at least 1'],
      max: [1000, 'Staff strength cannot exceed 1000']
    },
    isCACRegistered: {
      type: Boolean,
      default: false
    },
    cacNumber: {
      type: String,
      trim: true,
      uppercase: true,
      match: [/^[A-Z0-9]{2,20}$/, 'Invalid CAC number format']
    },
    cacDocument: {
      type: String, // File path for uploaded CAC document
      default: null
    },
    websiteURL: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'Website URL must start with http:// or https://']
    },
    socialMedia: {
      instagram: {
        type: String,
        trim: true,
        match: [/^@?[\w.]+$/, 'Invalid Instagram username format']
      },
      facebook: {
        type: String,
        trim: true
      },
      twitter: {
        type: String,
        trim: true,
        match: [/^@?[\w]+$/, 'Invalid Twitter username format']
      }
    }
  },
  
  // Professional Information
  professional: {
    specialties: [{
      type: String,
      enum: [
        'Woodworking', 'Pottery & Ceramics', 'Leathercraft', 'Textile Art',
        'Jewelry Making', 'Metalwork', 'Glass Art', 'Traditional Clothing',
        'Painting & Drawing', 'Sculpture', 'Basket Weaving', 'Beadwork',
        'Paper Crafts', 'Soap & Candle Making', 'Calabash Carving',
        'Musical Instruments', 'Hair Braiding & Styling', 'Furniture Restoration',
        'Shoemaking', 'Sign Writing', 'Tie & Dye', 'Adire Textile',
        'Food Preservation', 'Batik', 'Embroidery', 'Photography', 'Other'
      ]
    }],
    experience: {
      type: String,
      trim: true,
      maxlength: [500, 'Experience description cannot exceed 500 characters']
    },
    certifications: [{
      type: String,
      trim: true,
      maxlength: [100, 'Certification name cannot exceed 100 characters']
    }],
    portfolio: [{
      type: String, // Image URLs for portfolio pieces
      match: [/^(https?:\/\/|\/uploads\/)/, 'Invalid portfolio image URL']
    }]
  },
  
  // Service Relationships
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  
  // Analytics & Performance
  analytics: {
    profileViews: {
      type: Number,
      default: 0,
      min: 0
    },
    totalBookings: {
      type: Number,
      default: 0,
      min: 0
    },
    completedBookings: {
      type: Number,
      default: 0,
      min: 0
    },
    responseRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  
  // Featured Status
  featured: {
    isFeatured: {
      type: Boolean,
      default: false
    },
    featuredUntil: {
      type: Date,
      default: null
    },
    featuredOrder: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  
  // Privacy & Settings
  settings: {
    showPhoneNumber: {
      type: Boolean,
      default: true
    },
    showWhatsApp: {
      type: Boolean,
      default: true
    },
    showAddress: {
      type: Boolean,
      default: false
    },
    allowDirectBooking: {
      type: Boolean,
      default: true
    },
    autoAcceptBookings: {
      type: Boolean,
      default: false
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: false
    }
  },

  // ========== ADMIN-SPECIFIC FIELDS ==========
  adminLevel: {
    type: String,
    enum: ['super_admin', 'admin', 'moderator'],
    required: function() { return this.role === 'admin'; }
  },
  adminPermissions: [{
    type: String,
    enum: ['manage_users', 'manage_services', 'manage_featured', 'view_analytics', 'moderate_content']
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ========== INDEXES FOR PERFORMANCE (Fixed - No Duplicates) ==========
// ✅ ONLY schema.index() calls, no field-level index: true
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ isVerified: 1 });
UserSchema.index({ 'location.city': 1, 'location.state': 1 }); // For location searches
UserSchema.index({ 'customerLocation.city': 1, 'customerLocation.state': 1 }); // For customer location searches
UserSchema.index({ 'professional.specialties': 1 }); // For specialty searches
UserSchema.index({ 'featured.isFeatured': 1, 'featured.featuredOrder': 1 }); // For featured queries
UserSchema.index({ 'analytics.averageRating': -1 }); // For rating-based sorting
UserSchema.index({ createdAt: -1 }); // For newest users
UserSchema.index({ lastActive: -1 }); // For active user queries

// ========== VIRTUAL FIELDS ==========
// Check if featured status is currently active
UserSchema.virtual('isCurrentlyFeatured').get(function() {
  if (!this.featured.isFeatured) return false;
  if (!this.featured.featuredUntil) return true;
  return new Date() < this.featured.featuredUntil;
});

// Get display name based on role
UserSchema.virtual('displayName').get(function() {
  if (this.role === 'customer') {
    return this.fullName || this.username;
  } else if (this.role === 'artisan') {
    return this.businessName || this.contactName || this.username;
  }
  return this.username;
});

// Get location display string
UserSchema.virtual('locationDisplay').get(function() {
  if (this.role === 'customer' && this.customerLocation) {
    return `${this.customerLocation.city}, ${this.customerLocation.state}`;
  } else if (this.role === 'artisan' && this.location) {
    return `${this.location.city}, ${this.location.state}`;
  }
  return 'Location not specified';
});

// Get completion percentage
UserSchema.virtual('profileCompletionPercentage').get(function() {
  let totalFields = 0;
  let completedFields = 0;
  
  // Core fields
  const coreFields = ['email', 'username', 'profileImage'];
  totalFields += coreFields.length;
  completedFields += coreFields.filter(field => this[field]).length;
  
  if (this.role === 'customer') {
    const customerFields = ['fullName', 'customerLocation.city', 'customerLocation.state'];
    totalFields += customerFields.length;
    completedFields += customerFields.filter(field => {
      const value = field.includes('.') ? 
        field.split('.').reduce((obj, key) => obj?.[key], this) : this[field];
      return value;
    }).length;
  } else if (this.role === 'artisan') {
    const artisanFields = [
      'contactName', 'businessName', 'phoneNumber', 'location.city', 
      'location.state', 'location.lga', 'businessDescription'
    ];
    totalFields += artisanFields.length;
    completedFields += artisanFields.filter(field => {
      const value = field.includes('.') ? 
        field.split('.').reduce((obj, key) => obj?.[key], this) : this[field];
      return value;
    }).length;
  }
  
  return Math.round((completedFields / totalFields) * 100);
});

// ========== MIDDLEWARE ==========
// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update lastActive on login
UserSchema.pre('save', function(next) {
  if (this.isModified('lastActive') || this.isNew) {
    this.lastActive = new Date();
  }
  next();
});

// ========== INSTANCE METHODS ==========
// Compare password for login
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Feature/unfeature artisan
UserSchema.methods.setFeatured = async function(featured = true, duration = null, order = 0) {
  if (this.role !== 'artisan') {
    throw new Error('Only artisans can be featured');
  }
  
  this.featured.isFeatured = featured;
  this.featured.featuredOrder = order;
  
  if (featured && duration) {
    // Set expiry date if duration is provided (in days)
    this.featured.featuredUntil = new Date(Date.now() + (duration * 24 * 60 * 60 * 1000));
  } else if (!featured) {
    this.featured.featuredUntil = null;
  }
  
  return this.save();
};

// Update analytics
UserSchema.methods.incrementProfileViews = async function() {
  this.analytics.profileViews += 1;
  return this.save();
};

UserSchema.methods.updateRating = async function(newRating) {
  const currentTotal = this.analytics.averageRating * this.analytics.totalReviews;
  this.analytics.totalReviews += 1;
  this.analytics.averageRating = (currentTotal + newRating) / this.analytics.totalReviews;
  return this.save();
};

// Get public profile data
UserSchema.methods.getPublicProfile = function() {
  const publicData = {
    _id: this._id,
    username: this.username,
    role: this.role,
    profileImage: this.profileImage,
    isVerified: this.isVerified,
    isActive: this.isActive,
    createdAt: this.createdAt,
    displayName: this.displayName,
    locationDisplay: this.locationDisplay
  };
  
  if (this.role === 'customer') {
    publicData.fullName = this.fullName;
  } else if (this.role === 'artisan') {
    Object.assign(publicData, {
      contactName: this.contactName,
      businessName: this.businessName,
      businessDescription: this.businessDescription,
      phoneNumber: this.settings.showPhoneNumber ? this.phoneNumber : null,
      whatsappNumber: this.settings.showWhatsApp ? this.whatsappNumber : null,
      location: {
        city: this.location.city,
        state: this.location.state,
        lga: this.location.lga,
        address: this.settings.showAddress ? this.location.address : null
      },
      business: {
        yearEstablished: this.business.yearEstablished,
        isCACRegistered: this.business.isCACRegistered,
        websiteURL: this.business.websiteURL,
        socialMedia: this.business.socialMedia
      },
      professional: this.professional,
      analytics: {
        profileViews: this.analytics.profileViews,
        averageRating: this.analytics.averageRating,
        totalReviews: this.analytics.totalReviews
      },
      featured: this.featured
    });
  }
  
  return publicData;
};

// ========== STATIC METHODS ==========
// Get featured artisans
UserSchema.statics.getFeaturedArtisans = function(limit = 6) {
  return this.find({
    role: 'artisan',
    isActive: true,
    'featured.isFeatured': true,
    $or: [
      { 'featured.featuredUntil': null },
      { 'featured.featuredUntil': { $gt: new Date() } }
    ]
  })
  .sort({ 'featured.featuredOrder': 1, createdAt: -1 })
  .limit(limit)
  .select('contactName businessName profileImage location professional analytics featured');
};

// Search artisans by criteria
UserSchema.statics.searchArtisans = function(criteria = {}) {
  const query = {
    role: 'artisan',
    isActive: true
  };
  
  if (criteria.city) {
    query['location.city'] = new RegExp(criteria.city, 'i');
  }
  
  if (criteria.state) {
    query['location.state'] = new RegExp(criteria.state, 'i');
  }
  
  if (criteria.specialty) {
    query['professional.specialties'] = criteria.specialty;
  }
  
  if (criteria.minRating) {
    query['analytics.averageRating'] = { $gte: criteria.minRating };
  }
  
  return this.find(query)
    .sort({ 'analytics.averageRating': -1, 'analytics.profileViews': -1 })
    .limit(criteria.limit || 20);
};

// Create the model (avoid re-compilation in development)
let User;
try {
  User = mongoose.model('User');
} catch (error) {
  User = mongoose.model('User', UserSchema);
}

export default User;