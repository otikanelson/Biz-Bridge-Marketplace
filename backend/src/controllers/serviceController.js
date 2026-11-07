// backend/src/controllers/serviceController.js - Updated for No-Payment System
import Service from '../models/service.js';
import User from '../models/user.js';
import { getFileUrl } from '../middleware/upload.js';

// ========== CATEGORY BREAKDOWN DATA ==========
const CATEGORY_BREAKDOWNS = {
  'Woodworking': [
    { name: 'Furniture Making', defaultPrice: 50000, duration: '2-3 weeks', description: 'Custom furniture creation' },
    { name: 'Cabinet Making', defaultPrice: 75000, duration: '3-4 weeks', description: 'Kitchen and storage cabinets' },
    { name: 'Wood Carving', defaultPrice: 25000, duration: '1-2 weeks', description: 'Decorative wood carving' },
    { name: 'Wood Turning', defaultPrice: 20000, duration: '1 week', description: 'Lathe work and turned items' },
    { name: 'Joinery', defaultPrice: 40000, duration: '2-3 weeks', description: 'Precision wood joining' },
    { name: 'Restoration', defaultPrice: 30000, duration: '1-2 weeks', description: 'Furniture restoration services' },
    { name: 'Custom Shelving', defaultPrice: 35000, duration: '1-2 weeks', description: 'Built-in and custom shelves' },
    { name: 'Decorative Items', defaultPrice: 15000, duration: '1 week', description: 'Small decorative wooden pieces' }
  ],
  'Metalwork': [
    { name: 'Welding', defaultPrice: 40000, duration: '1-2 weeks', description: 'General welding services' },
    { name: 'Blacksmithing', defaultPrice: 45000, duration: '2-3 weeks', description: 'Traditional blacksmith work' },
    { name: 'Metal Fabrication', defaultPrice: 60000, duration: '2-4 weeks', description: 'Custom metal fabrication' },
    { name: 'Jewelry Making', defaultPrice: 20000, duration: '1 week', description: 'Metal jewelry creation' },
    { name: 'Tool Making', defaultPrice: 25000, duration: '1 week', description: 'Custom tool creation' },
    { name: 'Decorative Metalwork', defaultPrice: 50000, duration: '2-3 weeks', description: 'Artistic metal pieces' },
    { name: 'Repair Services', defaultPrice: 15000, duration: '3-5 days', description: 'Metal item repairs' },
    { name: 'Custom Hardware', defaultPrice: 30000, duration: '1-2 weeks', description: 'Door handles, fixtures, etc.' }
  ],
  'Textile Art': [
    { name: 'Weaving', defaultPrice: 30000, duration: '2-3 weeks', description: 'Custom textile weaving' },
    { name: 'Embroidery', defaultPrice: 15000, duration: '1 week', description: 'Decorative embroidery work' },
    { name: 'Tailoring', defaultPrice: 25000, duration: '1-2 weeks', description: 'Custom clothing tailoring' },
    { name: 'Fabric Dyeing', defaultPrice: 20000, duration: '1 week', description: 'Natural and synthetic dyeing' },
    { name: 'Quilting', defaultPrice: 35000, duration: '2-3 weeks', description: 'Traditional and modern quilts' },
    { name: 'Textile Repair', defaultPrice: 10000, duration: '3-5 days', description: 'Clothing and fabric repairs' },
    { name: 'Custom Clothing', defaultPrice: 40000, duration: '2-3 weeks', description: 'Bespoke clothing creation' },
    { name: 'Home Textiles', defaultPrice: 25000, duration: '1-2 weeks', description: 'Curtains, cushions, linens' }
  ]
};

// Helper function to get supported categories
const getSupportedCategories = () => {
  return Object.keys(CATEGORY_BREAKDOWNS);
};

// Helper function to validate pricing type for category
const validatePricingForCategory = (category, pricingType) => {
  const supportedCategories = getSupportedCategories();
  
  if (pricingType === 'categorized' && !supportedCategories.includes(category)) {
    return {
      valid: false,
      message: `Categorized pricing is only available for: ${supportedCategories.join(', ')}`
    };
  }
  
  return { valid: true };
};

// Helper function to validate pricing structure
const validatePricingStructure = (pricing, category) => {
  if (!pricing || !pricing.type) {
    return { valid: false, message: 'Pricing type is required' };
  }

  const { type, basePrice, baseDuration, categories } = pricing;

  switch (type) {
    case 'fixed':
      if (!basePrice || basePrice <= 0) {
        return { valid: false, message: 'Base price is required for fixed pricing and must be greater than 0' };
      }
      if (!baseDuration) {
        return { valid: false, message: 'Base duration is required for fixed pricing' };
      }
      break;

    case 'negotiate':
      // No additional validation needed for negotiate pricing
      break;

    case 'categorized':
      const categoryValidation = validatePricingForCategory(category, type);
      if (!categoryValidation.valid) {
        return categoryValidation;
      }
      
      if (!categories || !Array.isArray(categories) || categories.length === 0) {
        return { valid: false, message: 'At least one category is required for categorized pricing' };
      }
      
      // Validate each category
      for (const cat of categories) {
        if (!cat.name || !cat.price || !cat.duration) {
          return { valid: false, message: 'Each category must have name, price, and duration' };
        }
        if (cat.price <= 0) {
          return { valid: false, message: 'Category prices must be greater than 0' };
        }
      }
      break;

    default:
      return { valid: false, message: 'Invalid pricing type. Must be: fixed, negotiate, or categorized' };
  }

  return { valid: true };
};

// ========== SERVICE CRUD OPERATIONS ==========

// @desc    Create a new service
// @route   POST /api/services
// @access  Private - Artisans only
export const createService = async (req, res) => {
  try {
    console.log("📝 Service creation request:", {
      body: req.body,
      filesCount: req.files ? req.files.length : 0
    });
    
    const {
      title, 
      description, 
      category, 
      pricing, // NEW: Pricing structure instead of simple price
      duration, 
      locations, 
      tags, 
      isActive
    } = req.body;

    // Basic validation
    if (!title || !description || !category || !pricing) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        details: {
          title: title ? 'Valid' : 'Missing',
          description: description ? 'Valid' : 'Missing',
          category: category ? 'Valid' : 'Missing',
          pricing: pricing ? 'Valid' : 'Missing'
        }
      });
    }

    // Parse pricing if it's a string
    let parsedPricing;
    try {
      parsedPricing = typeof pricing === 'string' ? JSON.parse(pricing) : pricing;
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pricing structure format'
      });
    }

    // Validate pricing structure
    const pricingValidation = validatePricingStructure(parsedPricing, category);
    if (!pricingValidation.valid) {
      return res.status(400).json({
        success: false,
        message: pricingValidation.message
      });
    }

    // Parse locations safely
    let parsedLocations = [];
    try {
      if (locations) {
        parsedLocations = typeof locations === 'string' ? JSON.parse(locations) : locations;
      }
    } catch (error) {
      console.error('Error parsing locations:', error);
    }

    // Handle tags safely
    let parsedTags = [];
    if (tags) {
      if (typeof tags === 'string') {
        try {
          parsedTags = JSON.parse(tags);
        } catch (e) {
          parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        }
      } else if (Array.isArray(tags)) {
        parsedTags = tags;
      }
    }

    // Create service with new pricing structure
    const service = new Service({
      artisan: req.user._id,
      title,
      description,
      category,
      pricing: parsedPricing, // NEW: Use new pricing structure
      duration: duration || 'Varies', // Keep as fallback for compatibility
      locations: parsedLocations,
      tags: parsedTags,
      isActive: isActive === 'true' || isActive === true
    });

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      console.log('📸 Processing uploaded images...');
      
      const imageUrls = req.files.map(file => {
        const fileUrl = getFileUrl(file.path);
        console.log('📸 Image processed:', {
          originalPath: file.path,
          convertedUrl: fileUrl,
          filename: file.filename
        });
        return fileUrl;
      });
      
      service.images = imageUrls;
      console.log('📸 Final service images:', service.images);
    } else {
      console.log('📸 No images uploaded');
      service.images = [];
    }

    await service.save();
    console.log('✅ Service created with new pricing structure:', service._id);

    // Update artisan's services array
    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { services: service._id } }
    );

    res.status(201).json({
      success: true,
      message: 'Service created successfully with new pricing system',
      service: {
        ...service.toObject(),
        displayPrice: service.displayPrice // Include virtual field
      }
    });
  } catch (error) {
    console.error('❌ Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create service',
      error: error.message
    });
  }
};

// @desc    Get service by ID
// @route   GET /api/services/:serviceId
// @access  Public
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.serviceId)
      .populate('artisan', 'contactName businessName profileImage phoneNumber localGovernmentArea city yearEstablished isCACRegistered address email');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Add virtual fields to response
    const serviceResponse = {
      ...service.toObject(),
      displayPrice: service.displayPrice,
      supportsCategorizedPricing: service.supportsCategorizedPricing,
      availableCategories: service.pricing.type === 'categorized' ? service.getAvailableCategories() : null
    };

    // Include richContent only if enabled and has blocks
    if (service.richContent && service.richContent.enabled && service.richContent.blocks && service.richContent.blocks.length > 0) {
      serviceResponse.richContent = service.richContent;
    } else {
      // Don't include richContent in response
      delete serviceResponse.richContent;
    }

    res.status(200).json({
      success: true,
      service: serviceResponse
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve service',
      error: error.message
    });
  }
};

// @desc    Update service
// @route   PUT /api/services/:serviceId
// @access  Private - Artisan owner only
export const updateService = async (req, res) => {
  try {
    console.log("📝 Service update request:", {
      serviceId: req.params.serviceId,
      body: req.body,
      filesCount: req.files ? req.files.length : 0
    });

    const service = await Service.findById(req.params.serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check ownership
    if (service.artisan.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this service'
      });
    }

    const {
      title, 
      description, 
      category, 
      pricing, // NEW: Handle pricing updates
      duration, 
      locations, 
      tags, 
      isActive, 
      removeImages
    } = req.body;

    // Update basic fields
    if (title) service.title = title;
    if (description) service.description = description;
    if (category) service.category = category;
    if (duration) service.duration = duration;

    // Handle pricing updates
    if (pricing) {
      let parsedPricing;
      try {
        parsedPricing = typeof pricing === 'string' ? JSON.parse(pricing) : pricing;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid pricing structure format'
        });
      }

      // Validate new pricing structure
      const pricingValidation = validatePricingStructure(parsedPricing, service.category);
      if (!pricingValidation.valid) {
        return res.status(400).json({
          success: false,
          message: pricingValidation.message
        });
      }

      service.pricing = parsedPricing;
    }

    // Update locations
    if (locations) {
      try {
        service.locations = typeof locations === 'string' ? JSON.parse(locations) : locations;
      } catch (error) {
        console.error('Error parsing locations during update:', error);
      }
    }
    
    // Update active status
    if (isActive !== undefined) {
      service.isActive = isActive === 'true' || isActive === true;
    }
    
    // Update tags safely
    if (tags) {
      if (typeof tags === 'string') {
        try {
          service.tags = JSON.parse(tags);
        } catch (e) {
          service.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        }
      } else if (Array.isArray(tags)) {
        service.tags = tags;
      }
    }

    // Handle image removal
    if (removeImages && removeImages.length > 0) {
      const imagesToRemove = typeof removeImages === 'string' ? 
        JSON.parse(removeImages) : removeImages;
      
      service.images = service.images.filter(img => !imagesToRemove.includes(img));
      console.log('🗑️ Images after removal:', service.images);
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      console.log('📸 Adding new images...');
      
      const newImageUrls = req.files.map(file => getFileUrl(file.path));
      service.images = [...service.images, ...newImageUrls];
      
      console.log('📸 Final images after update:', service.images);
    }

    await service.save();
    
    console.log('✅ Service updated successfully:', service._id);

    // Return updated service with virtual fields
    const serviceResponse = {
      ...service.toObject(),
      displayPrice: service.displayPrice,
      supportsCategorizedPricing: service.supportsCategorizedPricing
    };

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      service: serviceResponse
    });
  } catch (error) {
    console.error('❌ Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service',
      error: error.message
    });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:serviceId
// @access  Private - Artisan owner only
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check ownership
    if (service.artisan.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this service'
      });
    }

    await Service.findByIdAndDelete(req.params.serviceId);

    // Remove from artisan's services array
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { services: req.params.serviceId } }
    );

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service',
      error: error.message
    });
  }
};

// ========== NEW PRICING-SPECIFIC ENDPOINTS ==========

// @desc    Get available categories for a service category
// @route   GET /api/services/categories/:category/breakdown
// @access  Public
export const getCategoryBreakdown = async (req, res) => {
  try {
    const { category } = req.params;
    
    if (!CATEGORY_BREAKDOWNS[category]) {
      return res.status(404).json({
        success: false,
        message: `Category breakdown not available for ${category}`
      });
    }

    res.status(200).json({
      success: true,
      category,
      breakdown: CATEGORY_BREAKDOWNS[category],
      supportsCategorizedPricing: true
    });
  } catch (error) {
    console.error('❌ Get category breakdown error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get category breakdown',
      error: error.message
    });
  }
};

// @desc    Get all supported categories for categorized pricing
// @route   GET /api/services/categorized-pricing/supported
// @access  Public
export const getSupportedCategorizedPricing = async (req, res) => {
  try {
    const supportedCategories = getSupportedCategories();
    
    res.status(200).json({
      success: true,
      supportedCategories,
      breakdowns: CATEGORY_BREAKDOWNS
    });
  } catch (error) {
    console.error('❌ Get supported categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get supported categories',
      error: error.message
    });
  }
};

// @desc    Search services with pricing filters
// @route   GET /api/services/search
// @access  Public
export const searchServicesWithPricing = async (req, res) => {
  try {
    console.log('🔍 Search request query params:', req.query);
    
    const {
      category,
      pricingType,
      location,
      minPrice,
      maxPrice,
      tags,
      artisanId,
      limit = 20,
      page = 1,
      sort = 'newest'
    } = req.query;

    // Build search parameters
    const searchParams = {};
    
    if (category) {
      console.log('🏷️ Searching by category:', category);
      searchParams.category = category;
    }
    if (pricingType) searchParams.pricingType = pricingType;
    if (location) searchParams.location = location;
    if (artisanId) searchParams.artisanId = artisanId;
    
    if (minPrice || maxPrice) {
      searchParams.priceRange = {};
      if (minPrice) searchParams.priceRange.min = parseInt(minPrice);
      if (maxPrice) searchParams.priceRange.max = parseInt(maxPrice);
    }

    console.log('🔍 Search params sent to model:', searchParams);

    // Use the new search method from the model
    let services = await Service.searchWithPricing(searchParams);

    console.log(`✅ Found ${services.length} services from database`);

    // Apply tag filtering if specified
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      services = services.filter(service => 
        service.tags.some(tag => tagArray.includes(tag))
      );
    }

    // Apply sorting
    if (sort) {
      services = services.sort((a, b) => {
        switch (sort) {
          case 'newest':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'oldest':
            return new Date(a.createdAt) - new Date(b.createdAt);
          case 'price_low':
            return (a.pricing.basePrice || 0) - (b.pricing.basePrice || 0);
          case 'price_high':
            return (b.pricing.basePrice || 0) - (a.pricing.basePrice || 0);
          case 'rating':
            return (b.ratings?.average || 0) - (a.ratings?.average || 0);
          default:
            return 0;
        }
      });
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedServices = services.slice(startIndex, endIndex);

    // Add virtual fields to each service
    const servicesWithDisplayPrice = paginatedServices.map(service => ({
      ...service.toObject(),
      displayPrice: service.displayPrice,
      supportsCategorizedPricing: service.supportsCategorizedPricing
    }));

    console.log(`📤 Returning ${servicesWithDisplayPrice.length} services to frontend`);

    res.status(200).json({
      success: true,
      count: paginatedServices.length,
      total: services.length,
      currentPage: parseInt(page),
      totalPages: Math.ceil(services.length / limit),
      services: servicesWithDisplayPrice
    });
  } catch (error) {
    console.error('❌ Search services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search services',
      error: error.message
    });
  }
};

// @desc    Get services by pricing type
// @route   GET /api/services/pricing/:pricingType
// @access  Public
export const getServicesByPricingType = async (req, res) => {
  try {
    const { pricingType } = req.params;
    const { limit = 20, page = 1 } = req.query;

    if (!['fixed', 'negotiate', 'categorized'].includes(pricingType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pricing type. Must be: fixed, negotiate, or categorized'
      });
    }

    const services = await Service.getByPricingType(pricingType);

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedServices = services.slice(startIndex, endIndex);

    // Add virtual fields
    const servicesWithDisplayPrice = paginatedServices.map(service => ({
      ...service.toObject(),
      displayPrice: service.displayPrice,
      supportsCategorizedPricing: service.supportsCategorizedPricing
    }));

    res.status(200).json({
      success: true,
      count: paginatedServices.length,
      total: services.length,
      page: parseInt(page),
      pages: Math.ceil(services.length / limit),
      pricingType,
      services: servicesWithDisplayPrice
    });
  } catch (error) {
    console.error('❌ Get services by pricing type error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get services by pricing type',
      error: error.message
    });
  }
};

// @desc    Get featured services
// @route   GET /api/services/featured
// @access  Public
export const getFeaturedServices = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    console.log(`⭐ Getting featured services, limit: ${limit}`);
    
    // Honor featured flags first, then fallback to ratings
    let services = await Service.find({ 
      isActive: true,
      'featured.isFeatured': true
    })
      .populate('artisan', 'contactName businessName profileImage phoneNumber localGovernmentArea city ratings')
      .sort({ 
        'featured.featuredOrder': 1,  // Sort by featured order first
        'ratings.average': -1,         // Then by rating
        createdAt: -1                  // Then by newest
      })
      .limit(parseInt(limit));

    // If not enough featured services, fill with highly rated services
    if (services.length < limit) {
      const additionalNeeded = limit - services.length;
      const serviceIds = services.map(s => s._id);
      
      const additionalServices = await Service.find({ 
        isActive: true,
        _id: { $nin: serviceIds },
        'ratings.average': { $gte: 4.0 }
      })
        .populate('artisan', 'contactName businessName profileImage phoneNumber localGovernmentArea city ratings')
        .sort({ 
          'ratings.average': -1,
          createdAt: -1
        })
        .limit(additionalNeeded);
      
      services.push(...additionalServices);
    }

    // Add virtual fields to response
    const servicesWithDisplayPrice = services.map(service => ({
      ...service.toObject(),
      displayPrice: service.displayPrice,
      supportsCategorizedPricing: service.supportsCategorizedPricing
    }));

    console.log(`✅ Found ${services.length} featured services`);

    res.status(200).json({
      success: true,
      count: services.length,
      services: servicesWithDisplayPrice
    });
  } catch (error) {
    console.error('❌ Get featured services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve featured services',
      error: error.message
    });
  }
};

// ========== EXISTING ENDPOINTS (Updated) ==========

// @desc    Get all services
// @route   GET /api/services
// @access  Public
export const getAllServices = async (req, res) => {
  try {
    const {
      category, 
      location, 
      tags, 
      isActive = true,
      limit = 20,
      page = 1,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { isActive };
    
    if (category) {
      query.category = category;
    }
    
    if (location) {
      query['locations.lga'] = new RegExp(location, 'i');
    }
    
    if (tags) {
      const tagArray = tags.split(',');
      query.tags = { $in: tagArray };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const services = await Service.find(query)
      .populate('artisan', 'contactName businessName profileImage phoneNumber localGovernmentArea city')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Service.countDocuments(query);

    // Add virtual fields to response
    const servicesWithDisplayPrice = services.map(service => ({
      ...service.toObject(),
      displayPrice: service.displayPrice,
      supportsCategorizedPricing: service.supportsCategorizedPricing
    }));

    res.status(200).json({
      success: true,
      count: services.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      services: servicesWithDisplayPrice
    });
  } catch (error) {
    console.error('❌ Get all services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve services',
      error: error.message
    });
  }
};

// @desc    Get artisan's services
// @route   GET /api/services/my-services
// @access  Private - Artisan only
export const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ artisan: req.user._id })
      .sort({ createdAt: -1 });

    // Add virtual fields to response
    const servicesWithDisplayPrice = services.map(service => ({
      ...service.toObject(),
      displayPrice: service.displayPrice,
      supportsCategorizedPricing: service.supportsCategorizedPricing
    }));

    res.status(200).json({
      success: true,
      count: services.length,
      services: servicesWithDisplayPrice
    });
  } catch (error) {
    console.error('❌ Get my services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve your services',
      error: error.message
    });
  }
};

// ========== RICH CONTENT / ADVERT MANAGEMENT ==========

// Allowed icon names for feature strips
const ALLOWED_ICONS = [
  'hammer', 'ruler', 'truck', 'shield', 'clock', 'award', 
  'leaf', 'sparkles', 'palette', 'wrench', 'star', 'heart',
  'check-circle', 'zap', 'package', 'users'
];

// Content limits
const CONTENT_LIMITS = {
  maxBlocks: 12,
  maxTitleLength: 80,
  maxSubtitleLength: 160,
  maxTextLength: 600,
  maxFeatureTextLength: 60,
  maxFeatureItems: 4,
  maxGalleryImages: 4,
  minGalleryImages: 2
};

// Helper function to sanitize text (strip HTML)
const sanitizeText = (text) => {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '').trim();
};

// Helper function to validate image URL
const isValidImageUrl = (url) => {
  if (!url) return false;
  return url.startsWith('/uploads/') || url.startsWith('https://');
};

// Helper function to validate block data
const validateBlockData = (block, blockIndex) => {
  const errors = [];
  
  if (!block.id || !block.type || block.order === undefined) {
    errors.push(`Block ${blockIndex}: Missing required fields (id, type, or order)`);
    return errors;
  }

  if (!block.data) {
    errors.push(`Block ${blockIndex}: Missing data field`);
    return errors;
  }

  switch (block.type) {
    case 'banner':
      if (!isValidImageUrl(block.data.image)) {
        errors.push(`Block ${blockIndex}: Invalid or missing banner image URL`);
      }
      if (block.data.alt && block.data.alt.length > 100) {
        errors.push(`Block ${blockIndex}: Alt text too long (max 100 characters)`);
      }
      break;

    case 'heading':
      if (!block.data.title) {
        errors.push(`Block ${blockIndex}: Heading title is required`);
      } else if (block.data.title.length > CONTENT_LIMITS.maxTitleLength) {
        errors.push(`Block ${blockIndex}: Title too long (max ${CONTENT_LIMITS.maxTitleLength} characters)`);
      }
      if (block.data.subtitle && block.data.subtitle.length > CONTENT_LIMITS.maxSubtitleLength) {
        errors.push(`Block ${blockIndex}: Subtitle too long (max ${CONTENT_LIMITS.maxSubtitleLength} characters)`);
      }
      break;

    case 'featureStrip':
      if (!Array.isArray(block.data.items) || block.data.items.length === 0) {
        errors.push(`Block ${blockIndex}: Feature strip must have at least one item`);
      } else if (block.data.items.length > CONTENT_LIMITS.maxFeatureItems) {
        errors.push(`Block ${blockIndex}: Too many feature items (max ${CONTENT_LIMITS.maxFeatureItems})`);
      } else {
        block.data.items.forEach((item, idx) => {
          if (!item.icon || !ALLOWED_ICONS.includes(item.icon)) {
            errors.push(`Block ${blockIndex}, Item ${idx}: Invalid icon. Must be one of: ${ALLOWED_ICONS.join(', ')}`);
          }
          if (!item.title || item.title.length > 40) {
            errors.push(`Block ${blockIndex}, Item ${idx}: Invalid title (required, max 40 characters)`);
          }
          if (!item.text || item.text.length > CONTENT_LIMITS.maxFeatureTextLength) {
            errors.push(`Block ${blockIndex}, Item ${idx}: Invalid text (required, max ${CONTENT_LIMITS.maxFeatureTextLength} characters)`);
          }
        });
      }
      break;

    case 'imageText':
      if (!isValidImageUrl(block.data.image)) {
        errors.push(`Block ${blockIndex}: Invalid or missing image URL`);
      }
      if (!block.data.title || block.data.title.length > CONTENT_LIMITS.maxTitleLength) {
        errors.push(`Block ${blockIndex}: Invalid title (required, max ${CONTENT_LIMITS.maxTitleLength} characters)`);
      }
      if (!block.data.text || block.data.text.length > CONTENT_LIMITS.maxTextLength) {
        errors.push(`Block ${blockIndex}: Invalid text (required, max ${CONTENT_LIMITS.maxTextLength} characters)`);
      }
      if (!['left', 'right'].includes(block.data.imagePosition)) {
        errors.push(`Block ${blockIndex}: Image position must be 'left' or 'right'`);
      }
      break;

    case 'gallery':
      if (!Array.isArray(block.data.images) || 
          block.data.images.length < CONTENT_LIMITS.minGalleryImages || 
          block.data.images.length > CONTENT_LIMITS.maxGalleryImages) {
        errors.push(`Block ${blockIndex}: Gallery must have ${CONTENT_LIMITS.minGalleryImages}-${CONTENT_LIMITS.maxGalleryImages} images`);
      } else {
        block.data.images.forEach((img, idx) => {
          if (!isValidImageUrl(img.image)) {
            errors.push(`Block ${blockIndex}, Image ${idx}: Invalid image URL`);
          }
        });
      }
      break;

    default:
      errors.push(`Block ${blockIndex}: Invalid block type '${block.type}'`);
  }

  return errors;
};

// Helper function to sanitize block data
const sanitizeBlockData = (block) => {
  const sanitized = { ...block };

  switch (block.type) {
    case 'heading':
      sanitized.data.title = sanitizeText(block.data.title);
      sanitized.data.subtitle = sanitizeText(block.data.subtitle);
      break;

    case 'featureStrip':
      sanitized.data.items = block.data.items.map(item => ({
        icon: item.icon,
        title: sanitizeText(item.title),
        text: sanitizeText(item.text)
      }));
      break;

    case 'imageText':
      sanitized.data.title = sanitizeText(block.data.title);
      sanitized.data.text = sanitizeText(block.data.text);
      break;
  }

  return sanitized;
};

// @desc    Update service rich content
// @route   PUT /api/services/:serviceId/content
// @access  Private - Artisan owner only
export const updateServiceContent = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { enabled, blocks } = req.body;

    console.log('📝 Updating rich content for service:', serviceId);

    // Find service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check ownership
    if (service.artisan.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this service content'
      });
    }

    // Validate blocks array
    if (!Array.isArray(blocks)) {
      return res.status(400).json({
        success: false,
        message: 'Blocks must be an array'
      });
    }

    if (blocks.length > CONTENT_LIMITS.maxBlocks) {
      return res.status(400).json({
        success: false,
        message: `Maximum ${CONTENT_LIMITS.maxBlocks} blocks allowed`
      });
    }

    // Validate each block
    const allErrors = [];
    blocks.forEach((block, index) => {
      const blockErrors = validateBlockData(block, index);
      allErrors.push(...blockErrors);
    });

    if (allErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors found',
        errors: allErrors
      });
    }

    // Sanitize blocks
    const sanitizedBlocks = blocks.map(sanitizeBlockData);

    // Update service
    service.richContent = {
      enabled: enabled === true,
      blocks: sanitizedBlocks,
      updatedAt: new Date()
    };

    await service.save();

    console.log('✅ Rich content updated successfully');

    res.status(200).json({
      success: true,
      message: 'Service content updated successfully',
      richContent: service.richContent
    });
  } catch (error) {
    console.error('❌ Update service content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service content',
      error: error.message
    });
  }
};

// @desc    Upload content image
// @route   POST /api/services/:serviceId/content/images
// @access  Private - Artisan owner only
export const uploadContentImage = async (req, res) => {
  try {
    const { serviceId } = req.params;

    // Find service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check ownership
    if (service.artisan.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to upload images for this service'
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Get file URL
    const imageUrl = getFileUrl(req.file.path);

    console.log('✅ Content image uploaded:', imageUrl);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: imageUrl
    });
  } catch (error) {
    console.error('❌ Upload content image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
};

// @desc    Delete service rich content
// @route   DELETE /api/services/:serviceId/content
// @access  Private - Artisan owner only
export const deleteServiceContent = async (req, res) => {
  try {
    const { serviceId } = req.params;

    // Find service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check ownership
    if (service.artisan.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this service content'
      });
    }

    // Clear rich content
    service.richContent = {
      enabled: false,
      blocks: [],
      updatedAt: new Date()
    };

    await service.save();

    console.log('✅ Rich content deleted');

    res.status(200).json({
      success: true,
      message: 'Service content deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete service content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service content',
      error: error.message
    });
  }
};

// @desc    Get available icons for feature strips
// @route   GET /api/services/content/icons
// @access  Public
export const getAvailableIcons = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      icons: ALLOWED_ICONS,
      limits: CONTENT_LIMITS
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve icons',
      error: error.message
    });
  }
};

// ========== HOME PAGE RAILS ==========

// @desc    Get all data for home page rails in one request
// @route   GET /api/services/home-rails
// @access  Public
export const getHomeRails = async (req, res) => {
  try {
    console.log('📊 Fetching home page rails data...');

    // Use aggregation to get everything in one efficient query
    const results = await Service.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $facet: {
          // Category tiles with top 4 services per category
          categoryTiles: [
            {
              $group: {
                _id: '$category',
                count: { $sum: 1 },
                services: {
                  $push: {
                    _id: '$_id',
                    title: '$title',
                    image: { $arrayElemAt: ['$images', 0] },
                    category: '$category',
                    pricingType: '$pricing.type',
                    basePrice: '$pricing.basePrice',
                    ratings: '$ratings'
                  }
                }
              }
            },
            {
              $project: {
                category: '$_id',
                count: 1,
                services: { $slice: ['$services', 4] }
              }
            },
            { $sort: { count: -1 } }
          ],
          
          // Featured services (honor featured flags)
          featured: [
            {
              $match: { 'featured.isFeatured': true }
            },
            { $sort: { 'featured.featuredOrder': 1, 'ratings.average': -1 } },
            { $limit: 6 },
            {
              $lookup: {
                from: 'users',
                localField: 'artisan',
                foreignField: '_id',
                as: 'artisanData'
              }
            },
            {
              $project: {
                _id: 1,
                title: 1,
                image: { $arrayElemAt: ['$images', 0] },
                category: 1,
                pricingType: '$pricing.type',
                basePrice: '$pricing.basePrice',
                ratings: 1,
                artisan: {
                  businessName: { $arrayElemAt: ['$artisanData.businessName', 0] },
                  contactName: { $arrayElemAt: ['$artisanData.contactName', 0] }
                }
              }
            }
          ],

          // Top rated (at least 3 reviews, highest average)
          topRated: [
            {
              $match: {
                'ratings.count': { $gte: 3 }
              }
            },
            { $sort: { 'ratings.average': -1 } },
            { $limit: 10 },
            {
              $lookup: {
                from: 'users',
                localField: 'artisan',
                foreignField: '_id',
                as: 'artisanData'
              }
            },
            {
              $project: {
                _id: 1,
                title: 1,
                image: { $arrayElemAt: ['$images', 0] },
                category: 1,
                pricingType: '$pricing.type',
                basePrice: '$pricing.basePrice',
                ratings: 1,
                artisan: {
                  businessName: { $arrayElemAt: ['$artisanData.businessName', 0] },
                  contactName: { $arrayElemAt: ['$artisanData.contactName', 0] }
                }
              }
            }
          ],

          // New this week
          newThisWeek: [
            {
              $match: {
                createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
              }
            },
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
            {
              $lookup: {
                from: 'users',
                localField: 'artisan',
                foreignField: '_id',
                as: 'artisanData'
              }
            },
            {
              $project: {
                _id: 1,
                title: 1,
                image: { $arrayElemAt: ['$images', 0] },
                category: 1,
                pricingType: '$pricing.type',
                basePrice: '$pricing.basePrice',
                ratings: 1,
                artisan: {
                  businessName: { $arrayElemAt: ['$artisanData.businessName', 0] },
                  contactName: { $arrayElemAt: ['$artisanData.contactName', 0] }
                }
              }
            }
          ],

          // Under budget (₦50,000)
          underBudget: [
            {
              $match: {
                'pricing.type': 'fixed',
                'pricing.basePrice': { $lt: 50000, $gt: 0 }
              }
            },
            { $sort: { 'pricing.basePrice': 1 } },
            { $limit: 10 },
            {
              $lookup: {
                from: 'users',
                localField: 'artisan',
                foreignField: '_id',
                as: 'artisanData'
              }
            },
            {
              $project: {
                _id: 1,
                title: 1,
                image: { $arrayElemAt: ['$images', 0] },
                category: 1,
                pricingType: '$pricing.type',
                basePrice: '$pricing.basePrice',
                ratings: 1,
                artisan: {
                  businessName: { $arrayElemAt: ['$artisanData.businessName', 0] },
                  contactName: { $arrayElemAt: ['$artisanData.contactName', 0] }
                }
              }
            }
          ]
        }
      }
    ]);

    const data = results[0];

    // Get featured artisan (pick one randomly from featured)
    const featuredArtisan = data.featured && data.featured.length > 0
      ? data.featured[Math.floor(Math.random() * Math.min(3, data.featured.length))]
      : null;

    // Filter out categories with no services
    const categoryTiles = data.categoryTiles.filter(cat => cat.count > 0);

    console.log(`✅ Home rails data loaded: ${categoryTiles.length} categories, ${data.topRated.length} top rated`);

    // Set cache header (60 seconds)
    res.set('Cache-Control', 'public, max-age=60');

    res.status(200).json({
      success: true,
      data: {
        categoryTiles,
        featuredArtisan,
        topRated: data.topRated,
        newThisWeek: data.newThisWeek,
        underBudget: data.underBudget
      }
    });
  } catch (error) {
    console.error('❌ Get home rails error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load home page data',
      error: error.message
    });
  }
};

// @desc    Get services by IDs (for recently viewed, recommendations)
// @route   GET /api/services/by-ids
// @access  Public
export const getServicesByIds = async (req, res) => {
  try {
    const { ids } = req.query;

    if (!ids) {
      return res.status(400).json({
        success: false,
        message: 'Service IDs are required'
      });
    }

    // Parse and limit to 10 IDs
    const idArray = ids.split(',').slice(0, 10);

    const services = await Service.find({
      _id: { $in: idArray },
      isActive: true
    })
      .select('_id title images category pricing ratings')
      .populate('artisan', 'businessName contactName')
      .lean();

    // Add display price virtual
    const servicesWithPrice = services.map(service => ({
      ...service,
      image: service.images && service.images[0] ? service.images[0] : null,
      pricingType: service.pricing?.type,
      basePrice: service.pricing?.basePrice,
      artisan: {
        businessName: service.artisan?.businessName,
        contactName: service.artisan?.contactName
      }
    }));

    res.status(200).json({
      success: true,
      services: servicesWithPrice
    });
  } catch (error) {
    console.error('❌ Get services by IDs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load services',
      error: error.message
    });
  }
};
