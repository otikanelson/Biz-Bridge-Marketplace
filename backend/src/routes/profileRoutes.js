// backend/src/routes/bookingRoutes.js - Enhanced version
import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  createDirectBooking,
  getMyBookings,
  cancelBooking,
  addCustomerReview,
  getMyWork,
  confirmBooking,
  startWork,
  completeWork,
  addArtisanReview,
  getBookingById,
  addMessage,
  addMilestone,
  updateMilestone,
  getBookingAnalytics
} from '../controllers/bookingController.js';

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// ========== CUSTOMER ROUTES ==========
// @desc    Create direct booking (without service request)
// @route   POST /api/bookings
// @access  Private (Customer only)
router.post('/', authorize('customer'), createDirectBooking);

// @desc    Get customer's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private (Customer only)
router.get('/my-bookings', authorize('customer'), getMyBookings);

// @desc    Cancel booking
// @route   POST /api/bookings/:bookingId/cancel
// @access  Private (Customer only)
router.post('/:bookingId/cancel', authorize('customer'), cancelBooking);

// @desc    Add customer review
// @route   POST /api/bookings/:bookingId/review
// @access  Private (Customer only)
router.post('/:bookingId/review', authorize('customer'), addCustomerReview);

// ========== ARTISAN ROUTES ==========
// @desc    Get artisan's bookings
// @route   GET /api/bookings/my-work
// @access  Private (Artisan only)
router.get('/my-work', authorize('artisan'), getMyWork);

// @desc    Confirm booking
// @route   POST /api/bookings/:bookingId/confirm
// @access  Private (Artisan only)
router.post('/:bookingId/confirm', authorize('artisan'), confirmBooking);

// @desc    Start work on booking
// @route   POST /api/bookings/:bookingId/start
// @access  Private (Artisan only)
router.post('/:bookingId/start', authorize('artisan'), startWork);

// @desc    Complete work on booking
// @route   POST /api/bookings/:bookingId/complete
// @access  Private (Artisan only)
router.post('/:bookingId/complete', authorize('artisan'), completeWork);

// @desc    Add artisan review for customer
// @route   POST /api/bookings/:bookingId/artisan-review
// @access  Private (Artisan only)
router.post('/:bookingId/artisan-review', authorize('artisan'), addArtisanReview);

// @desc    Add milestone to booking
// @route   POST /api/bookings/:bookingId/milestones
// @access  Private (Artisan only)
router.post('/:bookingId/milestones', authorize('artisan'), addMilestone);

// @desc    Update milestone
// @route   PUT /api/bookings/:bookingId/milestones/:milestoneId
// @access  Private (Artisan only)
router.put('/:bookingId/milestones/:milestoneId', authorize('artisan'), updateMilestone);

// @desc    Get booking analytics
// @route   GET /api/bookings/analytics
// @access  Private (Artisan only)
router.get('/analytics', authorize('artisan'), getBookingAnalytics);

// ========== SHARED ROUTES (CUSTOMER & ARTISAN) ==========
// @desc    Get single booking details
// @route   GET /api/bookings/:bookingId
// @access  Private (Customer/Artisan - only involved parties)
router.get('/:bookingId', getBookingById);

// @desc    Add message to booking
// @route   POST /api/bookings/:bookingId/messages
// @access  Private (Customer/Artisan - only involved parties)
router.post('/:bookingId/messages', addMessage);

export default router;