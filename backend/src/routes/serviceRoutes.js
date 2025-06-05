// backend/src/routes/serviceRoutes.js - FIXED VERSION
import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { handleUploadErrors } from '../middleware/uploadMiddleware.js';
import {
  createService,
  getServiceById,
  updateService,
  deleteService,
  getArtisanServices,
  getAllServices,
  toggleServiceStatus,
  getMyServices,
  getFeaturedServices,
  searchServicesForCustomers
} from '../controllers/serviceController.js';

const router = express.Router();

// ✅ PUBLIC routes (no authentication required) - ORDER MATTERS!
router.get('/', getAllServices);
router.get('/search', searchServicesForCustomers);
router.get('/featured', getFeaturedServices);
router.get('/artisan/:artisanId', getArtisanServices);

// ✅ PROTECTED routes - require authentication
router.use(protect);

// ✅ SPECIFIC ARTISAN ROUTES - These MUST come BEFORE the /:serviceId route
router.get('/my-services', authorize('artisan'), getMyServices);

// ✅ ARTISAN-ONLY routes for managing services
router.post('/', authorize('artisan'), handleUploadErrors, createService);
router.put('/:serviceId', authorize('artisan'), handleUploadErrors, updateService);
router.delete('/:serviceId', authorize('artisan'), deleteService);
router.patch('/:serviceId/status', authorize('artisan'), toggleServiceStatus);

// ✅ PARAMETERIZED routes - These MUST come LAST
router.get('/:serviceId', getServiceById);

export default router;