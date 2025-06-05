// controllers/serviceController.js - FIXED VERSION with proper search
import Service from '../models/service.js';
import User from '../models/user.js';

// @desc    Create a new service
// @route   POST /api/services
// @access  Private - Artisans only
export const createService = async (req, res) => {
  try {
    console.log("Service creation request body:", req.body);
    console.log("Service creation request files:", req.files);
    
    const {
      title, description, category, price, duration, locations, tags, isActive
    } = req.body;

    // Validation check before DB operation
    if (!title || !description || !price) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        details: {
          title: title ? 'Valid' : 'Missing',
          description: description ? 'Valid' : 'Missing',
          price: price ? 'Valid' : 'Missing'
        }
      });
    }

    // Parse locations more safely
    let parsedLocations = [];
    try {
      if (locations) {
        parsedLocations = typeof locations === 'string' ? JSON.parse(locations) : locations;
      }
    } catch (error) {
      console.error('Error parsing locations:', error);
    }

    // Handle tags more safely
    let parsedTags = [];
    if (tags) {
      if (typeof tags === 'string') {
        try {
          parsedTags = JSON.parse(tags);
        } catch (e) {
          parsedTags = tags.split(',').map(tag => tag.trim());
        }
      } else if (Array.isArray(tags)) {
        parsedTags = tags;
      }
    }

    // Create service
    const service = new Service({
      artisan: req.user._id,
      title,
      description,
      category: category || 'Other',
      price,
      duration: duration || 'Varies',
      locations: parsedLocations,
      tags: parsedTags,
      isActive: isActive === 'true' || isActive === true
    });

    // Add image URLs if available
    if (req.files && req.files.length > 0) {
      service.images = req.files.map(file => file.path);
    }

    await service.save();

    // Update artisan's services array
    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { services: service._id } }
    );

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    console.error('Create service error:', error);
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

    res.status(200).json({
      success: true,
      service
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

// @desc    Get all services with filtering and search
// @route   GET /api/services
// @access  Public
export const getAllServices = async (req, res) => {
  try {
    const { 
      category, 
      location, 
      search,
      page = 1,
      limit = 12,
      sort = 'newest'
    } = req.query;

    console.log('📋 getAllServices params:', { category, location, search, page, limit, sort });

    // Build query - only show active services
    const query = { isActive: true };

    // Apply category filter
    if (category && category !== '') {
      query.category = { $regex: new RegExp(category, 'i') };
    }

    // Apply location filter - search in locations array
    if (location && location !== '') {
      query.$or = [
        { 'locations.name': { $regex: new RegExp(location, 'i') } },
        { 'locations.lga': { $regex: new RegExp(location, 'i') } }
      ];
    }

    // Apply search filter - search in title, description, and tags
    if (search && search !== '') {
      query.$or = [
        { title: { $regex: new RegExp(search, 'i') } },
        { description: { $regex: new RegExp(search, 'i') } },
        { tags: { $regex: new RegExp(search, 'i') } },
        { category: { $regex: new RegExp(search, 'i') } }
      ];
    }

    // Determine sort order
    let sortOption = {};
    switch (sort) {
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'title':
        sortOption = { title: 1 };
        break;
      case 'popular':
        sortOption = { 'ratings.average': -1, createdAt: -1 };
        break;
      case 'newest':
      default:
        sortOption = { createdAt: -1 };
    }

    // Convert page and limit to numbers
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit))); // Max 50 per page
    const skip = (pageNum - 1) * limitNum;

    console.log('📋 Final query:', query);
    console.log('📋 Sort option:', sortOption);

    // Count total documents for pagination
    const total = await Service.countDocuments(query);

    // Fetch services with pagination
    const services = await Service.find(query)
      .populate('artisan', 'contactName businessName profileImage phoneNumber localGovernmentArea')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    console.log(`📋 Found ${services.length} services out of ${total} total`);

    res.status(200).json({
      success: true,
      count: services.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      services
    });
  } catch (error) {
    console.error('Get all services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve services',
      error: error.message
    });
  }
};

// @desc    Search services for customers (dedicated search endpoint)
// @route   GET /api/services/search
// @access  Public
export const searchServicesForCustomers = async (req, res) => {
  try {
    const { 
      category, 
      location, 
      search,
      page = 1,
      limit = 12,
      sort = 'newest'
    } = req.query;

    console.log('🔍 Customer search params:', { category, location, search, page, limit, sort });

    // Build query for active services only
    const query = { isActive: true };

    // Apply category filter
    if (category && category !== '') {
      query.category = { $regex: new RegExp(category, 'i') };
    }

    // Apply location filter
    if (location && location !== '') {
      query.$or = [
        { 'locations.name': { $regex: new RegExp(location, 'i') } },
        { 'locations.lga': { $regex: new RegExp(location, 'i') } }
      ];
    }

    // Apply text search filter
    if (search && search !== '') {
      // Use $or to search across multiple fields
      const searchRegex = { $regex: new RegExp(search, 'i') };
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { tags: searchRegex },
          { category: searchRegex }
        ]
      });
    }

    console.log('🔍 Search query:', JSON.stringify(query, null, 2));

    // Determine sort order
    let sortOption = {};
    switch (sort) {
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'title':
        sortOption = { title: 1 };
        break;
      case 'popular':
        sortOption = { 'ratings.average': -1, createdAt: -1 };
        break;
      case 'newest':
      default:
        sortOption = { createdAt: -1 };
    }

    // Convert page and limit to numbers
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Count total documents for pagination
    const total = await Service.countDocuments(query);

    // Fetch services with pagination and populate artisan info
    const services = await Service.find(query)
      .populate('artisan', 'contactName businessName profileImage phoneNumber localGovernmentArea city')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    console.log(`🔍 Search found ${services.length} services out of ${total} total`);

    res.status(200).json({
      success: true,
      count: services.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      services,
      searchParams: { category, location, search } // Include search params for debugging
    });
  } catch (error) {
    console.error('🔍 Customer search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search services',
      error: error.message
    });
  }
};

// @desc    Get featured services (from featured artisans)
// @route   GET /api/services/featured
// @access  Public
export const getFeaturedServices = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    console.log('⭐ Getting featured services, limit:', limit);
    
    // Get featured artisans first
    const featuredArtisans = await User.find({
      role: 'artisan',
      isFeatured: true,
      isActive: true,
      $or: [
        { featuredUntil: null },
        { featuredUntil: { $gt: new Date() } }
      ]
    })
    .sort({ featuredOrder: 1, createdAt: -1 })
    .limit(parseInt(limit))
    .select('_id');

    if (featuredArtisans.length === 0) {
      // Fallback to regular services if no featured artisans
      const services = await Service.find({ isActive: true })
        .populate('artisan', 'contactName businessName profileImage')
        .sort({ 'ratings.average': -1, createdAt: -1 })
        .limit(parseInt(limit));

      return res.status(200).json({
        success: true,
        count: services.length,
        services,
        source: 'fallback'
      });
    }

    // Get one service from each featured artisan
    const featuredArtisanIds = featuredArtisans.map(artisan => artisan._id);
    
    const services = await Service.aggregate([
      // Match active services from featured artisans
      { $match: { 
        isActive: true, 
        artisan: { $in: featuredArtisanIds } 
      }},
      // Group by artisan and get the best service from each
      { $group: {
        _id: '$artisan',
        service: { $first: '$ROOT' }
      }},
      // Replace root with the service
      { $replaceRoot: { newRoot: '$service' } },
      // Limit results
      { $limit: parseInt(limit) },
      // Lookup artisan details
      { $lookup: {
        from: 'users',
        localField: 'artisan',
        foreignField: '_id',
        as: 'artisan'
      }},
      { $unwind: '$artisan' },
      // Project only needed artisan fields
      { $addFields: {
        'artisan.contactName': '$artisan.contactName',
        'artisan.businessName': '$artisan.businessName',
        'artisan.profileImage': '$artisan.profileImage',
        'artisan._id': '$artisan._id'
      }}
    ]);

    console.log(`⭐ Found ${services.length} featured services from featured artisans`);

    res.status(200).json({
      success: true,
      count: services.length,
      services,
      source: 'featured_artisans'
    });
  } catch (error) {
    console.error('⭐ Get featured services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve featured services',
      error: error.message
    });
  }
};

// @desc    Get services for authenticated artisan
// @route   GET /api/services/my-services
// @access  Private - Artisans only
export const getMyServices = async (req, res) => {
  try {
    console.log("Getting services for user:", req.user._id);
    
    const services = await Service.find({ artisan: req.user._id })
      .sort({ createdAt: -1 });
    
    console.log(`Found ${services.length} services for artisan`);
    
    res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    console.error('Get my services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve your services',
      error: error.message
    });
  }
};

// @desc    Get all services by an artisan
// @route   GET /api/services/artisan/:artisanId
// @access  Public
export const getArtisanServices = async (req, res) => {
  try {
    const { active } = req.query;
    
    // Build query
    const query = { artisan: req.params.artisanId };
    
    // Filter by active status if specified
    if (active !== undefined) {
      query.isActive = active === 'true' || active === true;
    } else {
      // Default to active services only for public access
      query.isActive = true;
    }
    
    const services = await Service.find(query)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    console.error('Get artisan services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve services',
      error: error.message
    });
  }
};

// @desc    Update service
// @route   PUT /api/services/:serviceId
// @access  Private - Artisan owner only
export const updateService = async (req, res) => {
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
        message: 'Not authorized to update this service'
      });
    }

    // Update service fields
    const {
      title, description, category, price, duration, locations, isActive, tags
    } = req.body;

    // Update all provided fields
    if (title) service.title = title;
    if (description) service.description = description;
    if (category) service.category = category;
    if (price) service.price = price;
    if (duration) service.duration = duration;
    
    // Parse locations safely
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
          service.tags = tags.split(',').map(tag => tag.trim());
        }
      } else if (Array.isArray(tags)) {
        service.tags = tags;
      }
    }

    // Handle new images if provided
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      service.images = [...service.images, ...newImages];
    }

    await service.save();

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    console.error('Update service error:', error);
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

    // Remove service from artisan's services array
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { services: service._id } }
    );

    // Delete the service
    await Service.findByIdAndDelete(req.params.serviceId);

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service',
      error: error.message
    });
  }
};

// @desc    Toggle service active status
// @route   PATCH /api/services/:serviceId/status
// @access  Private - Artisan owner only
export const toggleServiceStatus = async (req, res) => {
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
        message: 'Not authorized to update this service'
      });
    }

    // Toggle the isActive status
    service.isActive = !service.isActive;
    await service.save();

    res.status(200).json({
      success: true,
      message: `Service ${service.isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: service.isActive
    });
  } catch (error) {
    console.error('Toggle service status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service status',
      error: error.message
    });
  }
};