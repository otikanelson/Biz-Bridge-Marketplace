// backend/src/controllers/serviceController.js - COMPLETE FIXED VERSION
import Service from '../models/service.js';
import User from '../models/user.js';
import { getFileUrl } from '../middleware/upload.js';

// @desc    Create a new service
// @route   POST /api/services
// @access  Private - Artisans only
export const createService = async (req, res) => {
  try {
    console.log("📝 Service creation request:", {
      body: req.body,
      filesCount: req.files ? req.files.length : 0,
      files: req.files ? req.files.map(f => ({ 
        originalname: f.originalname, 
        filename: f.filename,
        path: f.path,
        size: f.size 
      })) : []
    });
    
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

    // ✅ FIXED: Handle image uploads properly
    if (req.files && req.files.length > 0) {
      console.log('📸 Processing uploaded images...');
      
      // Convert file paths to proper URLs for storage
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
    console.log('✅ Service saved with ID:', service._id);

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
      title, description, category, price, duration, locations, tags, isActive, removeImages
    } = req.body;

    // Update basic fields
    if (title) service.title = title;
    if (description) service.description = description;
    if (category) service.category = category;
    if (price) service.price = price;
    if (duration) service.duration = duration;

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
          service.tags = tags.split(',').map(tag => tag.trim());
        }
      } else if (Array.isArray(tags)) {
        service.tags = tags;
      }
    }

    // ✅ FIXED: Handle image removal
    if (removeImages && removeImages.length > 0) {
      const imagesToRemove = typeof removeImages === 'string' ? JSON.parse(removeImages) : removeImages;
      service.images = service.images.filter(img => !imagesToRemove.includes(img));
      console.log('🗑️ Removed images:', imagesToRemove);
    }

    // ✅ FIXED: Handle new image uploads
    if (req.files && req.files.length > 0) {
      console.log('📸 Processing new uploaded images...');
      
      const newImageUrls = req.files.map(file => {
        const fileUrl = getFileUrl(file.path);
        console.log('📸 New image processed:', {
          originalPath: file.path,
          convertedUrl: fileUrl,
          filename: file.filename
        });
        return fileUrl;
      });
      
      // Add new images to existing ones
      service.images = [...(service.images || []), ...newImageUrls];
      console.log('📸 Updated service images:', service.images);
    }

    await service.save();
    console.log('✅ Service updated successfully');

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      service
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

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);

    console.log(`📋 Retrieved ${services.length} services (page ${pageNum}/${totalPages})`);

    res.status(200).json({
      success: true,
      services,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalResults: total,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
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

// @desc    Get services by artisan ID
// @route   GET /api/services/artisan/:artisanId
// @access  Public
export const getArtisanServices = async (req, res) => {
  try {
    const { artisanId } = req.params;
    const { active = 'true' } = req.query;

    console.log('👤 Getting services for artisan:', artisanId, 'Active only:', active);

    // Build query
    const query = { artisan: artisanId };
    if (active === 'true') {
      query.isActive = true;
    }

    const services = await Service.find(query)
      .populate('artisan', 'contactName businessName profileImage')
      .sort({ createdAt: -1 });

    console.log(`👤 Found ${services.length} services for artisan ${artisanId}`);

    res.status(200).json({
      success: true,
      services,
      count: services.length
    });
  } catch (error) {
    console.error('Get artisan services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve artisan services',
      error: error.message
    });
  }
};

// @desc    Get current user's services
// @route   GET /api/services/my-services
// @access  Private - Artisans only
export const getMyServices = async (req, res) => {
  try {
    console.log('🔧 Getting services for current user:', req.user._id);

    const services = await Service.find({ artisan: req.user._id })
      .sort({ createdAt: -1 });

    console.log(`🔧 Found ${services.length} services for user`);

    res.status(200).json({
      success: true,
      services,
      count: services.length
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

    // Toggle status
    service.isActive = !service.isActive;
    await service.save();

    console.log(`🔄 Service ${service._id} status toggled to: ${service.isActive}`);

    res.status(200).json({
      success: true,
      message: `Service ${service.isActive ? 'activated' : 'deactivated'} successfully`,
      service
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

export const getFeaturedServices = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const limitNum = Math.min(20, Math.max(1, parseInt(limit)));

    const services = await Service.find({ 
      isActive: true 
    })
      .populate('artisan', 'contactName businessName profileImage')
      .sort({ createdAt: -1 })
      .limit(limitNum);

    res.status(200).json({
      success: true,
      services,
      count: services.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve featured services',
      error: error.message
    });
  }
};

// @desc    Search services for customers
// @route   GET /api/services/search
// @access  Public
export const searchServicesForCustomers = async (req, res) => {
  try {
    const { 
      q: query, 
      category, 
      location,
      page = 1,
      limit = 12,
      sort = 'newest'
    } = req.query;

    console.log('🔍 Customer service search:', { query, category, location, page, limit, sort });

    // Build search query - only active services
    const searchQuery = { isActive: true };
    const orConditions = [];

    // Text search across multiple fields
    if (query && query.trim() !== '') {
      const searchRegex = new RegExp(query.trim(), 'i');
      orConditions.push(
        { title: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
        { category: searchRegex }
      );
    }

    // Category filter
    if (category && category !== '') {
      searchQuery.category = { $regex: new RegExp(category, 'i') };
    }

    // Location filter
    if (location && location !== '') {
      orConditions.push(
        { 'locations.name': { $regex: new RegExp(location, 'i') } },
        { 'locations.lga': { $regex: new RegExp(location, 'i') } }
      );
    }

    // Add OR conditions to main query
    if (orConditions.length > 0) {
      searchQuery.$or = orConditions;
    }

    // Sort options
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'title') sortOption = { title: 1 };

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Execute search
    const total = await Service.countDocuments(searchQuery);
    const services = await Service.find(searchQuery)
      .populate('artisan', 'contactName businessName profileImage')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(total / limitNum);

    console.log(`🔍 Search returned ${services.length} services (${total} total)`);

    res.status(200).json({
      success: true,
      services,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalResults: total,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      },
      searchQuery: { query, category, location }
    });
  } catch (error) {
    console.error('Search services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search services',
      error: error.message
    });
  }
};