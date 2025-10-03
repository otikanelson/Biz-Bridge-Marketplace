// backend/src/controllers/userController.js
import User from '../models/user.js';
import Service from '../models/service.js';

// @desc    Get user profile by ID (public view)
// @route   GET /api/users/:userId
// @access  Public (but context-aware)
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if this is the user viewing their own profile
    const isOwnProfile = req.user && req.user._id.toString() === userId;
    
    // Increment profile views if it's not the user viewing their own profile
    if (!isOwnProfile && user.role === 'artisan') {
      user.profileViews = (user.profileViews || 0) + 1;
      await user.save();
    }

    // Prepare response based on profile type and ownership
    let profileData = {
      _id: user._id,
      username: user.username,
      role: user.role,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
      isActive: user.isActive,
      isVerified: user.isVerified
    };

    // Add role-specific public information
    if (user.role === 'customer') {
      profileData = {
        ...profileData,
        fullName: user.fullName
      };
    } else if (user.role === 'artisan') {
      profileData = {
        ...profileData,
        contactName: user.contactName,
        businessName: user.businessName,
        localGovernmentArea: user.localGovernmentArea,
        city: user.city,
        yearEstablished: user.yearEstablished,
        isCACRegistered: user.isCACRegistered,
        profileViews: user.profileViews,
        featuredOrder: user.featuredOrder,
        isFeatured: user.isFeatured,
        // Public contact info for artisans (even in public view)
        phoneNumber: user.phoneNumber,
        websiteURL: user.websiteURL,
        address: user.address
      };
    }

    // If viewing own profile, include ALL private information
    if (isOwnProfile) {
      profileData = {
        ...profileData,
        email: user.email,
        staffStrength: user.staffStrength,
        CACDocument: user.CACDocument,
        lastActive: user.lastActive
      };
    }

    // Get user's services if they're an artisan
    let services = [];
    if (user.role === 'artisan') {
      // Show all services for own profile, only active for public view
      const query = isOwnProfile ? { artisan: userId } : { artisan: userId, isActive: true };
      services = await Service.find(query).sort({ createdAt: -1 });
    }

    res.json({
      success: true,
      user: profileData,
      services,
      isOwnProfile,
      context: isOwnProfile ? 'own' : 'public'
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile',
      error: error.message
    });
  }
};

// @desc    Get current user's own profile (private view)
// @route   GET /api/users/me/profile
// @access  Private
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's services if they're an artisan (all services, including inactive)
    let services = [];
    if (user.role === 'artisan') {
      services = await Service.find({ artisan: user._id }).sort({ createdAt: -1 });
    }

    res.json({
      success: true,
      user,
      services,
      isOwnProfile: true,
      context: 'own'
    });

  } catch (error) {
    console.error('Get my profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/me/profile
// @access  Private
export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateData = { ...req.body };

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updateData.password;
    delete updateData.role;
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.profileViews;
    delete updateData.isFeatured;
    delete updateData.featuredOrder;

    // Validate email format if provided
    if (updateData.email && !/\S+@\S+\.\S+/.test(updateData.email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate website URL if provided
    if (updateData.websiteURL && !updateData.websiteURL.match(/^https?:\/\/.+/)) {
      return res.status(400).json({
        success: false,
        message: 'Website URL must start with http:// or https://'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
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
// @route   POST /api/users/me/profile/image
// @access  Private
export const uploadProfileImage = async (req, res) => {
  try {
    console.log('📸 Profile image upload request for user:', req.user._id);
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    console.log('📸 Uploaded file:', {
      filename: req.file.filename,
      path: req.file.path,
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

    // ✅ FIX: Store the proper URL path format
    // Convert file path to proper URL format: /uploads/profiles/filename.jpg
    const relativePath = req.file.path.replace(/\\/g, '/'); // Convert Windows backslashes
    let imageUrl;
    
    if (relativePath.includes('uploads/')) {
      // Extract the uploads/... portion
      const uploadsIndex = relativePath.indexOf('uploads/');
      imageUrl = '/' + relativePath.substring(uploadsIndex);
    } else {
      // Fallback: construct path manually
      imageUrl = `/uploads/profiles/${req.file.filename}`;
    }

    console.log('📸 Storing image URL:', imageUrl);

    // Update user's profile image
    user.profileImage = imageUrl;
    await user.save();

    console.log('✅ Profile image updated successfully');

    res.json({
      success: true,
      message: 'Profile image uploaded successfully',
      imageUrl: imageUrl,
      profileImage: imageUrl // Send both for compatibility
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

// @desc    Get featured artisans (public)
// @route   GET /api/users/featured
// @access  Public
export const getFeaturedArtisans = async (req, res) => {
  try {
    const { limit = 4 } = req.query;
    
    console.log('🌟 Getting featured artisans for homepage, limit:', limit);
    
    // Use the static method from User model
    const featuredArtisans = await User.getFeaturedArtisans(parseInt(limit));
    
    console.log(`🌟 Found ${featuredArtisans.length} featured artisans`);
    
    res.json({
      success: true,
      count: featuredArtisans.length,
      artisans: featuredArtisans
    });
  } catch (error) {
    console.error('🌟 Get featured artisans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve featured artisans',
      error: error.message
    });
  }
};