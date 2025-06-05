// backend/src/routes/userRoutes.js
import express from 'express';
import User from '../models/user.js';

const router = express.Router();

// @desc    Get featured artisans (public)
// @route   GET /api/users/featured
// @access  Public
router.get('/featured', async (req, res) => {
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
});

// @desc    Get artisan profile by ID (public)
// @route   GET /api/users/:userId
// @access  Public
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password -adminPermissions')
      .populate('services');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Increment profile views if it's an artisan
    if (user.role === 'artisan') {
      user.profileViews = (user.profileViews || 0) + 1;
      await user.save();
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile',
      error: error.message
    });
  }
});

export default router;