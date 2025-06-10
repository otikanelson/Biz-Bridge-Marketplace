// backend/src/controllers/profileController.js
import User from '../models/user.js';
import Service from '../models/service.js';
import { getFileUrl } from '../middleware/upload.js';

// @desc    Get user profile by ID (context-aware)
// @route   GET /api/profiles/:userId
// @access  Public (but shows different data based on authentication)
export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log(`👤 Profile request for user: ${userId}`);
    console.log(`👤 Requested by: ${req.user ? req.user._id : 'Anonymous'}`);
    
    // Find the requested user
    const user = await User.findById(userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }
    
    // Determine viewing context
    const isOwnProfile = req.user && req.user._id.toString() === userId;
    const isAuthenticated = !!req.user;
    
    console.log(`👤 Viewing context: ${isOwnProfile ? 'own' : isAuthenticated ? 'authenticated' : 'public'}`);
    
    // Increment profile views for artisans (not for own profile views)
    if (!isOwnProfile && user.role === 'artisan') {
      await user.incrementProfileViews();
      console.log(`👁️ Profile view count incremented for ${user.username}`);
    }
    
    // Get profile data based on context
    let profileData;
    if (isOwnProfile) {
      // Return complete profile data for own profile
      profileData = user.toObject();
      delete profileData.password;
    } else {
      // Return public profile data for others
      profileData = user.getPublicProfile();
    }
    
    // Get user's services if they're an artisan
    let services = [];
    if (user.role === 'artisan') {
      const serviceQuery = isOwnProfile 
        ? { artisan: userId } // Show all services for own profile
        : { artisan: userId, isActive: true }; // Show only active services for public view
      
      services = await Service.find(serviceQuery)
        .sort({ createdAt: -1 })
        .limit(isOwnProfile ? 50 : 20); // More services for own profile
      
      console.log(`🔧 Found ${services.length} services for ${user.username}`);
    }
    
    // Calculate profile stats
    const stats = {
      servicesCount: services.length,
      profileCompletion: user.profileCompletionPercentage,
      memberSince: user.createdAt,
      lastActive: user.lastActive
    };
    
    res.json({
      success: true,
      profile: profileData,
      services,
      stats,
      context: {
        isOwnProfile,
        isAuthenticated,
        canEdit: isOwnProfile,
        canContact: !isOwnProfile && isAuthenticated && user.role === 'artisan',
        canSave: !isOwnProfile && isAuthenticated
      }
    });
    
  } catch (error) {
    console.error('❌ Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
      error: error.message
    });
  }
};

// @desc    Get current user's own profile
// @route   GET /api/profiles/me
// @access  Private
export const getMyProfile = async (req, res) => {
  try {
    console.log(`👤 Getting own profile for user: ${req.user._id}`);
    
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get all user's services if they're an artisan
    let services = [];
    if (user.role === 'artisan') {
      services = await Service.find({ artisan: user._id })
        .sort({ createdAt: -1 });
    }
    
    // Get user's booking history if they're a customer
    let bookings = [];
    if (user.role === 'customer') {
      // TODO: Implement booking retrieval when booking system is ready
      bookings = [];
    }
    
    const stats = {
      servicesCount: services.length,
      profileCompletion: user.profileCompletionPercentage,
      memberSince: user.createdAt,
      lastActive: user.lastActive
    };
    
    res.json({
      success: true,
      profile: user.toObject(),
      services,
      bookings,
      stats,
      context: {
        isOwnProfile: true,
        isAuthenticated: true,
        canEdit: true,
        canContact: false,
        canSave: false
      }
    });
    
  } catch (error) {
    console.error('❌ Get my profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve your profile',
      error: error.message
    });
  }
};

// @desc    Update current user's profile
// @route   PUT /api/profiles/me
// @access  Private
export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateData = { ...req.body };
    
    console.log(`👤 Updating profile for user: ${userId}`);
    console.log(`📝 Update data:`, Object.keys(updateData));
    
    // Remove sensitive fields that shouldn't be updated via this endpoint
    const restrictedFields = [
      'password', 'role', '_id', 'createdAt', 'updatedAt', 
      'analytics', 'featured', 'adminLevel', 'adminPermissions'
    ];
    
    restrictedFields.forEach(field => delete updateData[field]);
    
    // Get current user to validate role-specific updates
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Validate role-specific field updates
    if (user.role === 'customer') {
      // Validate customer-specific fields
      const allowedCustomerFields = [
        'username', 'fullName', 'profileImage', 'customerLocation', 'preferences'
      ];
      
      Object.keys(updateData).forEach(key => {
        if (!allowedCustomerFields.includes(key)) {
          delete updateData[key];
          console.log(`⚠️ Removed non-customer field: ${key}`);
        }
      });
      
    } else if (user.role === 'artisan') {
      // Validate artisan-specific fields
      const allowedArtisanFields = [
        'username', 'contactName', 'businessName', 'businessDescription',
        'phoneNumber', 'whatsappNumber', 'location', 'business', 
        'professional', 'settings', 'profileImage'
      ];
      
      Object.keys(updateData).forEach(key => {
        if (!allowedArtisanFields.includes(key)) {
          delete updateData[key];
          console.log(`⚠️ Removed non-artisan field: ${key}`);
        }
      });
    }
    
    // Validate specific fields
    if (updateData.email && !/\S+@\S+\.\S+/.test(updateData.email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
    
    if (updateData.username) {
      // Check if username is already taken by another user
      const existingUser = await User.findOne({ 
        username: updateData.username,
        _id: { $ne: userId }
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username is already taken'
        });
      }
    }
    
    if (updateData.business?.websiteURL && 
        updateData.business.websiteURL && 
        !updateData.business.websiteURL.match(/^https?:\/\/.+/)) {
      return res.status(400).json({
        success: false,
        message: 'Website URL must start with http:// or https://'
      });
    }
    
    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { 
        new: true, 
        runValidators: true,
        context: 'query' // This ensures conditional validation works
      }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    console.log(`✅ Profile updated successfully for ${updatedUser.username}`);
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: updatedUser.toObject()
    });
    
  } catch (error) {
    console.error('❌ Update profile error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} is already taken`
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// @desc    Upload profile image
// @route   POST /api/profiles/me/image
// @access  Private
export const uploadProfileImage = async (req, res) => {
  try {
    console.log(`📸 Profile image upload request for user: ${req.user._id}`);
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }
    
    console.log(`📸 Uploaded file:`, {
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Convert file path to proper URL
    const imageUrl = getFileUrl(req.file.path);
    
    // Update user's profile image
    user.profileImage = imageUrl;
    await user.save();
    
    console.log(`✅ Profile image updated: ${imageUrl}`);
    
    res.json({
      success: true,
      message: 'Profile image uploaded successfully',
      imageUrl: imageUrl,
      profile: user.getPublicProfile()
    });
    
  } catch (error) {
    console.error('❌ Upload profile image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile image',
      error: error.message
    });
  }
};

// @desc    Get profile analytics (artisans only)
// @route   GET /api/profiles/me/analytics
// @access  Private (Artisans only)
export const getProfileAnalytics = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user || user.role !== 'artisan') {
      return res.status(403).json({
        success: false,
        message: 'Analytics are only available for artisan profiles'
      });
    }
    
    // Get detailed analytics
    const services = await Service.find({ artisan: user._id });
    const activeServices = services.filter(s => s.isActive);
    
    // Calculate additional metrics
    const totalServices = services.length;
    const activeServicesCount = activeServices.length;
    const averageServiceRating = services.reduce((acc, service) => 
      acc + (service.ratings?.average || 0), 0) / totalServices || 0;
    
    // Get monthly profile views (mock data for now - implement proper tracking later)
    const monthlyViews = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000).toISOString().substr(0, 7),
      views: Math.floor(user.analytics.profileViews / 12) + Math.floor(Math.random() * 10)
    }));
    
    const analytics = {
      overview: {
        profileViews: user.analytics.profileViews,
        totalBookings: user.analytics.totalBookings,
        completedBookings: user.analytics.completedBookings,
        responseRate: user.analytics.responseRate,
        averageRating: user.analytics.averageRating,
        totalReviews: user.analytics.totalReviews,
        profileCompletion: user.profileCompletionPercentage
      },
      services: {
        total: totalServices,
        active: activeServicesCount,
        inactive: totalServices - activeServicesCount,
        averageRating: averageServiceRating
      },
      performance: {
        conversionRate: user.analytics.totalBookings > 0 ? 
          (user.analytics.completedBookings / user.analytics.totalBookings * 100) : 0,
        repeatCustomerRate: 0, // TODO: Calculate when booking system is implemented
        averageResponseTime: '2 hours', // TODO: Calculate actual response time
      },
      trends: {
        monthlyViews,
        growthRate: 15.5, // TODO: Calculate actual growth rate
        topPerformingServices: activeServices
          .sort((a, b) => (b.ratings?.average || 0) - (a.ratings?.average || 0))
          .slice(0, 3)
          .map(service => ({
            id: service._id,
            title: service.title,
            rating: service.ratings?.average || 0,
            views: Math.floor(Math.random() * 100) // TODO: Implement service-level analytics
          }))
      }
    };
    
    res.json({
      success: true,
      analytics
    });
    
  } catch (error) {
    console.error('❌ Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve analytics',
      error: error.message
    });
  }
};

// @desc    Update profile privacy settings
// @route   PUT /api/profiles/me/settings
// @access  Private
export const updateProfileSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const { settings } = req.body;
    
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid settings data'
      });
    }
    
    // Validate settings based on user role
    if (user.role === 'artisan') {
      const allowedSettings = [
        'showPhoneNumber', 'showWhatsApp', 'showAddress', 
        'allowDirectBooking', 'autoAcceptBookings', 
        'emailNotifications', 'smsNotifications'
      ];
      
      const validSettings = {};
      allowedSettings.forEach(key => {
        if (settings.hasOwnProperty(key) && typeof settings[key] === 'boolean') {
          validSettings[key] = settings[key];
        }
      });
      
      // Update user settings
      user.settings = { ...user.settings.toObject(), ...validSettings };
      
    } else if (user.role === 'customer') {
      const allowedSettings = ['emailNotifications', 'smsNotifications'];
      
      const validSettings = {};
      allowedSettings.forEach(key => {
        if (settings.hasOwnProperty(key) && typeof settings[key] === 'boolean') {
          validSettings[key] = settings[key];
        }
      });
      
      user.settings = { ...user.settings?.toObject() || {}, ...validSettings };
    }
    
    await user.save();
    
    console.log(`⚙️ Settings updated for ${user.username}`);
    
    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings: user.settings
    });
    
  } catch (error) {
    console.error('❌ Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings',
      error: error.message
    });
  }
};

// @desc    Search profiles (artisans)
// @route   GET /api/profiles/search
// @access  Public
export const searchProfiles = async (req, res) => {
  try {
    const { 
      q: query, 
      city, 
      state, 
      specialty, 
      minRating = 0,
      page = 1, 
      limit = 20 
    } = req.query;
    
    console.log(`🔍 Profile search:`, { query, city, state, specialty, minRating });
    
    // Build search criteria
    const searchCriteria = {
      role: 'artisan',
      isActive: true
    };
    
    // Text search across multiple fields
    if (query) {
      const searchRegex = new RegExp(query, 'i');
      searchCriteria.$or = [
        { contactName: searchRegex },
        { businessName: searchRegex },
        { businessDescription: searchRegex },
        { 'professional.specialties': searchRegex }
      ];
    }
    
    // Location filters
    if (city) {
      searchCriteria['location.city'] = new RegExp(city, 'i');
    }
    
    if (state) {
      searchCriteria['location.state'] = new RegExp(state, 'i');
    }
    
    // Specialty filter
    if (specialty) {
      searchCriteria['professional.specialties'] = specialty;
    }
    
    // Rating filter
    if (minRating > 0) {
      searchCriteria['analytics.averageRating'] = { $gte: parseFloat(minRating) };
    }
    
    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;
    
    // Execute search
    const total = await User.countDocuments(searchCriteria);
    const profiles = await User.find(searchCriteria)
      .select('-password')
      .sort({ 
        'featured.isFeatured': -1, // Featured profiles first
        'analytics.averageRating': -1, // Then by rating
        'analytics.profileViews': -1 // Then by popularity
      })
      .skip(skip)
      .limit(limitNum);
    
    // Transform to public profile data
    const publicProfiles = profiles.map(user => user.getPublicProfile());
    
    console.log(`🔍 Found ${profiles.length} profiles (${total} total)`);
    
    res.json({
      success: true,
      profiles: publicProfiles,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalResults: total,
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1
      },
      searchCriteria: { query, city, state, specialty, minRating }
    });
    
  } catch (error) {
    console.error('❌ Search profiles error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search profiles',
      error: error.message
    });
  }
};

// @desc    Get featured artisans
// @route   GET /api/profiles/featured
// @access  Public
export const getFeaturedProfiles = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const limitNum = Math.min(20, Math.max(1, parseInt(limit)));
    
    console.log(`🌟 Getting featured profiles, limit: ${limitNum}`);
    
    const featuredArtisans = await User.getFeaturedArtisans(limitNum);
    const publicProfiles = featuredArtisans.map(user => user.getPublicProfile());
    
    console.log(`🌟 Found ${publicProfiles.length} featured artisans`);
    
    res.json({
      success: true,
      profiles: publicProfiles,
      count: publicProfiles.length
    });
    
  } catch (error) {
    console.error('❌ Get featured profiles error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve featured profiles',
      error: error.message
    });
  }
};