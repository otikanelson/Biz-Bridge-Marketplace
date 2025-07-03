// backend/src/routes/bookingRoutes.js - Updated for No-Payment System
import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  getMyBookings,
  cancelBooking,
  markBookingComplete,
  getMyWork,
  getBookingContract,
  downloadContractPDF,
  acceptContract,
  fileDispute,
  getBookingById,
  addMessage,
  addReview,
  getDisputedBookings,
  resolveDispute
} from '../controllers/bookingController.js';

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// ========== CUSTOMER ROUTES ==========

// @desc    Get customer's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private (Customer only)
router.get('/my-bookings', authorize('customer'), getMyBookings);

// @desc    Mark booking as completed
// @route   POST /api/bookings/:bookingId/complete
// @access  Private (Customer only)
router.post('/:bookingId/complete', authorize('customer'), markBookingComplete);

// ========== ARTISAN ROUTES ==========

// @desc    Get artisan's work/bookings
// @route   GET /api/bookings/my-work
// @access  Private (Artisan only)
router.get('/my-work', authorize('artisan'), getMyWork);

// ========== CONTRACT MANAGEMENT ROUTES ==========

// @desc    Get booking contract
// @route   GET /api/bookings/:bookingId/contract
// @access  Private (Customer/Artisan - involved parties)
router.get('/:bookingId/contract', getBookingContract);

// @desc    Download booking contract as PDF
// @route   GET /api/bookings/:bookingId/contract/download
// @access  Private (Customer/Artisan - involved parties)
router.get('/:bookingId/contract/download', downloadContractPDF);

// @desc    Accept booking contract
// @route   POST /api/bookings/:bookingId/accept-contract
// @access  Private (Customer/Artisan - involved parties)
router.post('/:bookingId/accept-contract', acceptContract);

// ========== DISPUTE MANAGEMENT ROUTES ==========

// @desc    File a dispute
// @route   POST /api/bookings/:bookingId/dispute
// @access  Private (Customer/Artisan - involved parties)
router.post('/:bookingId/dispute', fileDispute);

// ========== SHARED ROUTES (CUSTOMER & ARTISAN) ==========

// @desc    Get single booking details
// @route   GET /api/bookings/:bookingId
// @access  Private (Customer/Artisan - involved parties)
router.get('/:bookingId', getBookingById);

// @desc    Cancel booking
// @route   POST /api/bookings/:bookingId/cancel
// @access  Private (Customer/Artisan - involved parties)
router.post('/:bookingId/cancel', cancelBooking);

// @desc    Add message to booking
// @route   POST /api/bookings/:bookingId/messages
// @access  Private (Customer/Artisan - involved parties)
router.post('/:bookingId/messages', addMessage);

// @desc    Add review to booking
// @route   POST /api/bookings/:bookingId/review
// @access  Private (Customer/Artisan - involved parties)
router.post('/:bookingId/review', addReview);

// ========== ADMIN ROUTES ==========

// @desc    Get all disputed bookings
// @route   GET /api/bookings/admin/disputes
// @access  Private (Admin only)
router.get('/admin/disputes', authorize('admin'), getDisputedBookings);

// @desc    Resolve dispute
// @route   POST /api/bookings/:bookingId/resolve-dispute
// @access  Private (Admin only)
router.post('/:bookingId/resolve-dispute', authorize('admin'), resolveDispute);

export default router;