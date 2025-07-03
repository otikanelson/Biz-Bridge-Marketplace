// backend/src/routes/serviceRoutes.js - FIXED Route Order
import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { uploadServiceImages } from '../middleware/upload.js';
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  getMyServices,
  getCategoryBreakdown,
  getSupportedCategorizedPricing,
  searchServicesWithPricing,
  getServicesByPricingType,
  getFeaturedServices // ✅ Add this import
} from '../controllers/serviceController.js';

const router = express.Router();

// ========== PUBLIC ROUTES (SPECIFIC ROUTES FIRST) ==========

// @desc    Get all services with pagination and filtering
// @route   GET /api/services
// @access  Public
router.get('/', getAllServices);

// ✅ FEATURED SERVICES - Must come before /:serviceId
// @desc    Get featured services
// @route   GET /api/services/featured
// @access  Public
router.get('/featured', getFeaturedServices);

// ✅ SEARCH - Must come before /:serviceId
// @desc    Search services with pricing filters
// @route   GET /api/services/search
// @access  Public
router.get('/search', searchServicesWithPricing);

// ✅ PRICING-SPECIFIC ROUTES - Must come before /:serviceId
// @desc    Get available category breakdown for a service category
// @route   GET /api/services/categories/:category/breakdown
// @access  Public
router.get('/categories/:category/breakdown', getCategoryBreakdown);

// @desc    Get all supported categories for categorized pricing
// @route   GET /api/services/categorized-pricing/supported
// @access  Public
router.get('/categorized-pricing/supported', getSupportedCategorizedPricing);

// @desc    Get services by pricing type (fixed/negotiate/categorized)
// @route   GET /api/services/pricing/:pricingType
// @access  Public
router.get('/pricing/:pricingType', getServicesByPricingType);

// ✅ PROTECTED ROUTES (SPECIFIC ROUTES FIRST)
// Apply authentication to routes that need it
router.use('/my-services', protect);

// @desc    Get artisan's own services
// @route   GET /api/services/my-services
// @access  Private (Artisan only)
router.get('/my-services', authorize('artisan'), getMyServices);

// ✅ CATCH-ALL ROUTE - Must come LAST among GET routes
// @desc    Get single service by ID
// @route   GET /api/services/:serviceId
// @access  Public
router.get('/:serviceId', getServiceById);

// ========== PROTECTED ROUTES ==========
// Apply authentication to all routes below
router.use(protect);

// ========== ARTISAN-ONLY ROUTES ==========

// @desc    Create a new service
// @route   POST /api/services
// @access  Private (Artisan only)
router.post('/', 
  authorize('artisan'), 
  uploadServiceImages.array('images', 5), // Allow up to 5 images
  createService
);

// @desc    Update service
// @route   PUT /api/services/:serviceId
// @access  Private (Artisan owner only)
router.put('/:serviceId', 
  authorize('artisan'), 
  uploadServiceImages.array('images', 5), 
  updateService
);

// @desc    Delete service
// @route   DELETE /api/services/:serviceId
// @access  Private (Artisan owner only)
router.delete('/:serviceId', authorize('artisan'), deleteService);

export default router;