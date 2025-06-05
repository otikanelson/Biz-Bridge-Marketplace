// backend/src/models/User.js - Updated with Admin role
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  // Common fields for all users
  username: { 
    type: String, 
    required: [true, 'Username is required'],
    unique: true, 
    trim: true,
    minlength: [3, 'Username must be at least 3 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true, 
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: { 
    type: String, 
    enum: ["customer", "artisan", "admin"], // ✅ Added admin role
    required: [true, 'User role is required']
  },
  profileImage: { 
    type: String, 
    default: null 
  },
  
  // Customer-specific fields
  fullName: { 
    type: String, 
    required: function() { return this.role === 'customer'; }
  },
  
  // Artisan-specific fields
  contactName: { 
    type: String, 
    required: function() { return this.role === 'artisan'; }
  },
  phoneNumber: { 
    type: String, 
    required: function() { return this.role === 'artisan'; }
  },
  businessName: { 
    type: String, 
    required: function() { return this.role === 'artisan'; }
  },
  yearEstablished: { 
    type: Number, 
    default: null 
  },
  staffStrength: { 
    type: String, 
    default: null 
  },
  isCACRegistered: { 
    type: Boolean, 
    default: false 
  },
  CACDocument: { 
    type: String, 
    default: null 
  },
  address: { 
    type: String, 
    default: null 
  },
  city: { 
    type: String, 
    default: null 
  },
  localGovernmentArea: { 
    type: String, 
    default: null 
  },
  websiteURL: { 
    type: String, 
    default: null 
  },
  
  // Admin-specific fields
  adminLevel: {
    type: String,
    enum: ['super', 'moderator', 'support'],
    default: function() { return this.role === 'admin' ? 'moderator' : undefined; }
  },
  adminPermissions: [{
    type: String,
    enum: ['manage_users', 'manage_services', 'manage_featured', 'view_analytics', 'moderate_content']
  }],
  
  // Verification and status
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: { // ✅ New field to mark featured artisans
    type: Boolean,
    default: false
  },
  featuredUntil: { // ✅ Optional expiry date for featured status
    type: Date,
    default: null
  },
  featuredOrder: { // ✅ Order for displaying featured artisans
    type: Number,
    default: 0
  },
  
  // Service relationship
  services: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Service" 
  }],
  
  // Analytics fields
  profileViews: {
    type: Number,
    default: 0
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

// Indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isFeatured: 1, featuredOrder: 1 }); // ✅ Index for featured queries
UserSchema.index({ isActive: 1 });

// Virtual for checking if featured status is still valid
UserSchema.virtual('isCurrentlyFeatured').get(function() {
  if (!this.isFeatured) return false;
  if (!this.featuredUntil) return true;
  return new Date() < this.featuredUntil;
});

// Static method to get featured artisans
UserSchema.statics.getFeaturedArtisans = function(limit = 6) {
  return this.find({
    role: 'artisan',
    isActive: true,
    isFeatured: true,
    $or: [
      { featuredUntil: null },
      { featuredUntil: { $gt: new Date() } }
    ]
  })
  .sort({ featuredOrder: 1, createdAt: -1 })
  .limit(limit)
  .select('contactName businessName profileImage localGovernmentArea city yearEstablished isCACRegistered featuredOrder');
};

// Method to feature an artisan
UserSchema.methods.setFeatured = function(featured = true, duration = null, order = 0) {
  this.isFeatured = featured;
  this.featuredOrder = order;
  
  if (featured && duration) {
    // Set expiry date if duration is provided (in days)
    this.featuredUntil = new Date(Date.now() + (duration * 24 * 60 * 60 * 1000));
  } else if (!featured) {
    this.featuredUntil = null;
  }
  
  return this.save();
};

// Check if model already exists before creating
let User;
try {
  User = mongoose.model("User");
} catch (error) {
  User = mongoose.model("User", UserSchema);
}

export default User;