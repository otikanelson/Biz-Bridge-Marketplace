// backend/src/routes/adminRoutes.js
import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  getAdminStats,
  getAllArtisans,
  getFeaturedArtisans,
  toggleArtisanFeatured,
  reorderFeaturedArtisans,
  toggleArtisanVerified,
  toggleUserStatus,
  getAllServices
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard stats
router.get('/stats', getAdminStats);

// User management
router.get('/artisans', getAllArtisans);
router.patch('/artisans/:artisanId/feature', toggleArtisanFeatured);
router.patch('/artisans/:artisanId/verify', toggleArtisanVerified);
router.patch('/users/:userId/status', toggleUserStatus);

// Featured artisans management
router.get('/featured-artisans', getFeaturedArtisans);
router.patch('/featured-artisans/reorder', reorderFeaturedArtisans);

// Service management
router.get('/services', getAllServices);

export default router;