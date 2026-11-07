// backend/src/routes/userRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { uploadProfileImage } from '../middleware/upload.js';
import {
  getUserProfile,
  getMyProfile,
  updateMyProfile,
  uploadProfileImage as uploadImage,
  getFeaturedArtisans,
  getSavedAddresses,
  addSavedAddress,
  updateSavedAddress,
  deleteSavedAddress
} from '../controllers/userController.js';

const router = express.Router();

// @desc    Get featured artisans (public)
// @route   GET /api/users/featured
// @access  Public
router.get('/featured', getFeaturedArtisans);

// @desc    Get current user's own profile (private view)
// @route   GET /api/users/me/profile
// @access  Private
router.get('/me/profile', protect, getMyProfile);

// @desc    Update current user's profile
// @route   PUT /api/users/me/profile
// @access  Private
router.put('/me/profile', protect, updateMyProfile);

// @desc    Upload profile image
// @route   POST /api/users/me/profile/image
// @access  Private
router.post('/me/profile/image', protect, uploadProfileImage.single('profileImage'), uploadImage);

// ========== SAVED ADDRESSES ==========

// @desc    Get saved addresses
// @route   GET /api/users/me/addresses
// @access  Private
router.get('/me/addresses', protect, getSavedAddresses);

// @desc    Add a new saved address
// @route   POST /api/users/me/addresses
// @access  Private
router.post('/me/addresses', protect, addSavedAddress);

// @desc    Update a saved address
// @route   PUT /api/users/me/addresses/:addressId
// @access  Private
router.put('/me/addresses/:addressId', protect, updateSavedAddress);

// @desc    Delete a saved address
// @route   DELETE /api/users/me/addresses/:addressId
// @access  Private
router.delete('/me/addresses/:addressId', protect, deleteSavedAddress);

// @desc    Get any user's profile by ID (public view, but context-aware if authenticated)
// @route   GET /api/users/:userId
// @access  Public (but adds user context if logged in)
router.get('/:userId', (req, res, next) => {
  // Optional authentication middleware - adds user context if token is present
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // User is authenticated, add context
    protect(req, res, next);
  } else {
    // User is not authenticated, proceed without user context
    req.user = null;
    next();
  }
}, getUserProfile);

export default router;