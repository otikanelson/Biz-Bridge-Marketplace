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
    const {
      category,
      pricingType,
      location,
      minPrice,
      maxPrice,
      tags,
      artisanId,
      limit = 20,
      page = 1
    } = req.query;

    // Build search parameters
    const searchParams = {};
    
    if (category) searchParams.category = category;
    if (pricingType) searchParams.pricingType = pricingType;
    if (location) searchParams.location = location;
    if (artisanId) searchParams.artisanId = artisanId;
    
    if (minPrice || maxPrice) {
      searchParams.priceRange = {};
      if (minPrice) searchParams.priceRange.min = parseInt(minPrice);
      if (maxPrice) searchParams.priceRange.max = parseInt(maxPrice);
    }

    // Use the new search method from the model
    let services = await Service.searchWithPricing(searchParams);

    // Apply tag filtering if specified
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      services = services.filter(service => 
        service.tags.some(tag => tagArray.includes(tag))
      );
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

    res.status(200).json({
      success: true,
      count: paginatedServices.length,
      total: services.length,
      page: parseInt(page),
      pages: Math.ceil(services.length / limit),
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
    
    // Get featured services (you can customize this logic)
    // For now, get the newest services with good ratings
    const services = await Service.find({ 
      isActive: true,
      'ratings.average': { $gte: 4.0 } // Only services with 4+ stars
    })
      .populate('artisan', 'contactName businessName profileImage phoneNumber localGovernmentArea city ratings')
      .sort({ 
        'ratings.average': -1, // Sort by rating first
        createdAt: -1 // Then by newest
      })
      .limit(parseInt(limit));

    // If not enough highly rated services, fill with newest services
    if (services.length < limit) {
      const additionalNeeded = limit - services.length;
      const serviceIds = services.map(s => s._id);
      
      const additionalServices = await Service.find({ 
        isActive: true,
        _id: { $nin: serviceIds } // Exclude already selected services
      })
        .populate('artisan', 'contactName businessName profileImage phoneNumber localGovernmentArea city ratings')
        .sort({ createdAt: -1 })
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