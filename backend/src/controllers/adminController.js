// backend/src/controllers/adminController.js
import User from '../models/user.js';
import Service from '../models/service.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private - Admin only
export const getAdminStats = async (req, res) => {
  try {
    // Get counts for different user types
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalCustomers = await User.countDocuments({ role: 'customer', isActive: true });
    const totalArtisans = await User.countDocuments({ role: 'artisan', isActive: true });
    const totalServices = await Service.countDocuments({ isActive: true });
    const featuredArtisans = await User.countDocuments({ 
      role: 'artisan', 
      isFeatured: true, 
      isActive: true 
    });

    // Get recent registrations (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo },
      isActive: true 
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalCustomers,
        totalArtisans,
        totalServices,
        featuredArtisans,
        recentUsers
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin stats',
      error: error.message
    });
  }
};

// @desc    Get all artisans for admin management
// @route   GET /api/admin/artisans
// @access  Private - Admin only
export const getAllArtisans = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, featured, verified } = req.query;

    // Build query
    const query = { role: 'artisan' };

    if (search) {
      query.$or = [
        { contactName: { $regex: search, $options: 'i' } },
        { businessName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (featured !== undefined) {
      query.isFeatured = featured === 'true';
    }

    if (verified !== undefined) {
      query.isVerified = verified === 'true';
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const artisans = await User.find(query)
      .select('contactName businessName email profileImage localGovernmentArea city yearEstablished isCACRegistered isVerified isFeatured featuredOrder featuredUntil isActive createdAt')
      .sort({ featuredOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: artisans.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      artisans
    });
  } catch (error) {
    console.error('Get all artisans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve artisans',
      error: error.message
    });
  }
};

// @desc    Get featured artisans
// @route   GET /api/admin/featured-artisans
// @access  Private - Admin only
export const getFeaturedArtisans = async (req, res) => {
  try {
    const featuredArtisans = await User.find({
      role: 'artisan',
      isFeatured: true,
      isActive: true
    })
    .select('contactName businessName profileImage localGovernmentArea city featuredOrder featuredUntil')
    .sort({ featuredOrder: 1, createdAt: -1 });

    res.json({
      success: true,
      count: featuredArtisans.length,
      artisans: featuredArtisans
    });
  } catch (error) {
    console.error('Get featured artisans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve featured artisans',
      error: error.message
    });
  }
};

// @desc    Feature/Unfeature an artisan
// @route   PATCH /api/admin/artisans/:artisanId/feature
// @access  Private - Admin only
export const toggleArtisanFeatured = async (req, res) => {
  try {
    const { artisanId } = req.params;
    const { featured, duration, order } = req.body;

    const artisan = await User.findById(artisanId);

    if (!artisan || artisan.role !== 'artisan') {
      return res.status(404).json({
        success: false,
        message: 'Artisan not found'
      });
    }

    // Use the model method to set featured status
    await artisan.setFeatured(featured, duration, order);

    res.json({
      success: true,
      message: `Artisan ${featured ? 'featured' : 'unfeatured'} successfully`,
      artisan: {
        id: artisan._id,
        contactName: artisan.contactName,
        businessName: artisan.businessName,
        isFeatured: artisan.isFeatured,
        featuredUntil: artisan.featuredUntil,
        featuredOrder: artisan.featuredOrder
      }
    });
  } catch (error) {
    console.error('Toggle artisan featured error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update artisan featured status',
      error: error.message
    });
  }
};

// @desc    Update featured artisan order
// @route   PATCH /api/admin/featured-artisans/reorder
// @access  Private - Admin only
export const reorderFeaturedArtisans = async (req, res) => {
  try {
    const { artisanOrders } = req.body; // Array of { artisanId, order }

    if (!Array.isArray(artisanOrders)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid artisan orders data'
      });
    }

    // Update each artisan's featured order
    const updatePromises = artisanOrders.map(({ artisanId, order }) =>
      User.findByIdAndUpdate(
        artisanId,
        { featuredOrder: order },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Featured artisans reordered successfully'
    });
  } catch (error) {
    console.error('Reorder featured artisans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder featured artisans',
      error: error.message
    });
  }
};

// @desc    Verify/Unverify an artisan
// @route   PATCH /api/admin/artisans/:artisanId/verify
// @access  Private - Admin only
export const toggleArtisanVerified = async (req, res) => {
  try {
    const { artisanId } = req.params;
    const { verified } = req.body;

    const artisan = await User.findById(artisanId);

    if (!artisan || artisan.role !== 'artisan') {
      return res.status(404).json({
        success: false,
        message: 'Artisan not found'
      });
    }

    artisan.isVerified = verified;
    await artisan.save();

    res.json({
      success: true,
      message: `Artisan ${verified ? 'verified' : 'unverified'} successfully`,
      artisan: {
        id: artisan._id,
        contactName: artisan.contactName,
        businessName: artisan.businessName,
        isVerified: artisan.isVerified
      }
    });
  } catch (error) {
    console.error('Toggle artisan verified error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update artisan verification status',
      error: error.message
    });
  }
};

// @desc    Activate/Deactivate a user
// @route   PATCH /api/admin/users/:userId/status
// @access  Private - Admin only
export const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { active } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deactivating other admins
    if (user.role === 'admin' && user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Cannot modify other admin accounts'
      });
    }

    user.isActive = active;
    await user.save();

    res.json({
      success: true,
      message: `User ${active ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error.message
    });
  }
};

// @desc    Get all services for admin management
// @route   GET /api/admin/services
// @access  Private - Admin only
export const getAllServices = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, active } = req.query;

    // Build query
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (active !== undefined) {
      query.isActive = active === 'true';
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Service.countDocuments(query);
    const services = await Service.find(query)
      .populate('artisan', 'contactName businessName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: services.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      services
    });
  } catch (error) {
    console.error('Get all services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve services',
      error: error.message
    });
  }
};