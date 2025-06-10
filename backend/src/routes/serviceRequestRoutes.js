// backend/src/routes/serviceRequestRoutes.js
import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  createServiceRequest,
  getMyRequests,
  acceptQuote,
  convertToBooking,
  getInbox,
  submitQuote,
  declineRequest,
  getRequestById,
  addMessage,
  markExpiredRequests
} from '../controllers/serviceRequestController.js';

const router = express.Router();

// ========== SYSTEM/ADMIN ROUTES ==========
// @desc    Mark expired requests (can be called by cron job)
// @route   POST /api/service-requests/mark-expired
// @access  Private (Admin/System)
router.post('/mark-expired', protect, markExpiredRequests);

// ========== CUSTOMER ROUTES ==========
// Apply authentication to all routes below
router.use(protect);

// @desc    Create a new service request
// @route   POST /api/service-requests
// @access  Private (Customer only)
router.post('/', authorize('customer'), createServiceRequest);

// @desc    Get customer's service requests
// @route   GET /api/service-requests/my-requests
// @access  Private (Customer only)
router.get('/my-requests', authorize('customer'), getMyRequests);

// @desc    Accept artisan's quote
// @route   POST /api/service-requests/:requestId/accept
// @access  Private (Customer only)
router.post('/:requestId/accept', authorize('customer'), acceptQuote);

// @desc    Convert accepted request to booking
// @route   POST /api/service-requests/:requestId/convert-to-booking
// @access  Private (Customer only)
router.post('/:requestId/convert-to-booking', authorize('customer'), convertToBooking);

// ========== ARTISAN ROUTES ==========
// @desc    Get artisan's incoming service requests
// @route   GET /api/service-requests/inbox
// @access  Private (Artisan only)
router.get('/inbox', authorize('artisan'), getInbox);

// @desc    Submit quote for service request
// @route   POST /api/service-requests/:requestId/quote
// @access  Private (Artisan only)
router.post('/:requestId/quote', authorize('artisan'), submitQuote);

// @desc    Decline service request
// @route   POST /api/service-requests/:requestId/decline
// @access  Private (Artisan only)
router.post('/:requestId/decline', authorize('artisan'), declineRequest);

// ========== SHARED ROUTES (CUSTOMER & ARTISAN) ==========
// @desc    Get single service request details
// @route   GET /api/service-requests/:requestId
// @access  Private (Customer/Artisan - only involved parties)
router.get('/:requestId', getRequestById);

// @desc    Add message to service request
// @route   POST /api/service-requests/:requestId/messages
// @access  Private (Customer/Artisan - only involved parties)
router.post('/:requestId/messages', addMessage);

export default router;