// backend/src/routes/authRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { uploadProfileImage, uploadCACDocument } from '../middleware/upload.js';
import {
  registerUser,
  loginUser,
  getCurrentUser
} from '../controllers/authController.js';
import User from '../models/user.js';

const router = express.Router();

// @desc    Register customer
// @route   POST /api/auth/register/customer
// @access  Public
router.post('/register/customer', uploadProfileImage.single('profileImage'), (req, res, next) => {
  req.body.role = 'customer';
  next();
}, registerUser);

// @desc    Register artisan
// @route   POST /api/auth/register/artisan
// @access  Public
router.post('/register/artisan', uploadProfileImage.single('profileImage'), (req, res, next) => {
  req.body.role = 'artisan';
  next();
}, registerUser);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginUser);

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, getCurrentUser);

// @desc    Logout user (frontend handles token removal)
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, (req, res) => {
  // Since we're using JWT tokens, logout is handled on the frontend
  // by removing the token from localStorage. This endpoint just confirms logout.
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @desc    Upload CAC document
// @route   POST /api/auth/upload-cac/:userId
// @access  Private
router.post('/upload-cac/:userId', protect, uploadCACDocument.single('cacDocument'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No CAC document uploaded'
      });
    }

    const { userId } = req.params;
    
    // Find the user and ensure they're an artisan
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role !== 'artisan') {
      return res.status(400).json({
        success: false,
        message: 'Only artisans can upload CAC documents'
      });
    }

    // Ensure the user can only upload their own CAC document
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only upload your own CAC document'
      });
    }

    // Update user with CAC document path
    user.CACDocument = req.file.path;
    await user.save();

    console.log('CAC document uploaded for user:', userId);

    res.json({
      success: true,
      message: 'CAC document uploaded successfully',
      documentPath: req.file.path
    });

  } catch (error) {
    console.error('CAC document upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload CAC document',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;