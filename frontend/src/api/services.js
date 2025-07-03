// src/api/Services.js - Updated for New Pricing System (Correct File Location)
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.yourdomain.com/api' 
  : 'http://localhost:3000/api';

// Get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Log API calls for debugging
const logApiCall = (method, url, data = null) => {
  console.log(`📡 API ${method}:`, url, data ? { data } : '');
};

// ========== SERVICE CRUD OPERATIONS ==========

// Create a new service (private - artisans only)
export const createService = async (serviceData) => {
  try {
    console.log("📝 Creating service with NEW pricing structure:", serviceData);
    
    // Create FormData for file uploads
    const formData = new FormData();
    
    // ✅ UPDATED: Text fields for new pricing system
    const textFields = ['title', 'description', 'category', 'duration'];
    
    textFields.forEach(field => {
      if (serviceData[field] !== undefined && serviceData[field] !== null) {
        formData.append(field, String(serviceData[field]));
      }
    });
    
    // ✅ NEW: Add pricing structure (instead of old 'price' field)
    if (serviceData.pricing) {
      formData.append('pricing', serviceData.pricing); // Already JSON stringified from frontend
    }
    
    // Add isActive status (explicitly as string)
    formData.append('isActive', String(serviceData.isActive === true));
    
    // Add locations as JSON string
    if (serviceData.locations && serviceData.locations.length > 0) {
      formData.append('locations', JSON.stringify(serviceData.locations));
    }
    
    // Add tags if available (as JSON array)
    if (serviceData.tags && serviceData.tags.length > 0) {
      formData.append('tags', JSON.stringify(serviceData.tags));
    }
    
    // ✅ Handle service image properly
    if (serviceData.serviceImage && serviceData.serviceImage instanceof File) {
      console.log("📸 Adding service image:", serviceData.serviceImage.name);
      formData.append('images', serviceData.serviceImage);
    }
    
    // ✅ Handle multiple images if available
    if (serviceData.images && Array.isArray(serviceData.images)) {
      serviceData.images.forEach((image, index) => {
        if (image instanceof File) {
          console.log(`📸 Adding image ${index + 1}:`, image.name);
          formData.append('images', image);
        }
      });
    }
    
    // Log FormData entries for debugging
    console.log("📝 FormData contents for NEW pricing system:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? 
        `File(${pair[1].name}, ${pair[1].size} bytes)` : 
        pair[1]));
    }
    
    const response = await axios.post(`${API_URL}/services`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log("✅ Service created successfully with new pricing:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Service creation error:", error.response || error);
    throw error.response?.data || { message: 'Failed to create service' };
  }
};

// Update an existing service (private - artisans only)
export const updateService = async (serviceId, serviceData) => {
  logApiCall('PUT', `${API_URL}/services/${serviceId}`);
  
  try {
    console.log("Updating service with NEW pricing data:", serviceData);
    
    // Create FormData for file uploads
    const formData = new FormData();
    
    // ✅ UPDATED: Text fields for new pricing system (removed 'price')
    const textFields = [
      'title', 'description', 'category', 
      'duration', 'isActive'
    ];
    
    textFields.forEach(field => {
      if (serviceData[field] !== undefined) {
        formData.append(field, String(serviceData[field]));
      }
    });
    
    // ✅ NEW: Add pricing structure (instead of old 'price' field)
    if (serviceData.pricing) {
      formData.append('pricing', serviceData.pricing); // Already JSON stringified from frontend
    }
    
    // Add locations as JSON string
    if (serviceData.locations && serviceData.locations.length > 0) {
      formData.append('locations', JSON.stringify(serviceData.locations));
    }
    
    // Add tags if available (as JSON array)
    if (serviceData.tags && serviceData.tags.length > 0) {
      formData.append('tags', JSON.stringify(serviceData.tags));
    }
    
    // Add removeImages array if specified
    if (serviceData.removeImages && serviceData.removeImages.length > 0) {
      formData.append('removeImages', JSON.stringify(serviceData.removeImages));
    }
    
    // Add service image if available
    if (serviceData.serviceImage) {
      formData.append('images', serviceData.serviceImage);
    }
    
    // Add additional images if available
    if (serviceData.images && serviceData.images.length) {
      for (const image of serviceData.images) {
        if (image instanceof File) {
          formData.append('images', image);
        }
      }
    }
    
    // Log FormData entries for debugging
    console.log("FormData contents for update with NEW pricing:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? 
        `File(${pair[1].name}, ${pair[1].size} bytes)` : 
        pair[1]));
    }
    
    const response = await axios.put(`${API_URL}/services/${serviceId}`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log("✅ Service updated successfully with new pricing:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Service update error:", error.response || error);
    throw error.response?.data || { message: 'Failed to update service' };
  }
};

// Get all services with pagination and filtering (public)
export const getAllServices = async (page = 1, limit = 10, filters = {}) => {
  logApiCall('GET', `${API_URL}/services`);
  
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
      )
    });

    const response = await axios.get(`${API_URL}/services?${queryParams}`);
    
    // ✅ UPDATED: Log pricing structure instead of old price
    console.log("✅ Services fetched with new pricing structure:", {
      total: response.data.total,
      page: response.data.page,
      servicesWithPricing: response.data.services?.map(s => ({
        id: s._id,
        title: s.title,
        pricingType: s.pricing?.type || 'legacy',
        displayPrice: s.displayPrice || 'N/A'
      }))
    });
    
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch services:", error.response || error);
    if (error.response?.status === 500) {
      return { message: 'Server error. Please try again later.', status: 500 };
    }
    
    throw error.response?.data || { message: 'Failed to fetch services' };
  }
};

// Get single service by ID (public)
export const getServiceById = async (serviceId) => {
  logApiCall('GET', `${API_URL}/services/${serviceId}`);
  
  try {
    const response = await axios.get(`${API_URL}/services/${serviceId}`);
    
    // ✅ UPDATED: Log pricing structure
    console.log("✅ Service fetched with pricing:", {
      id: response.data.service._id,
      title: response.data.service.title,
      pricingType: response.data.service.pricing?.type || 'legacy',
      hasCategories: response.data.service.pricing?.categories?.length || 0
    });
    
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch service details:", error.response || error);
    if (error.response?.status === 500) {
      return { message: 'Server error. Please try again later.', status: 500 };
    }
    
    throw error.response?.data || { message: 'Failed to fetch service details' };
  }
};

// Get artisan's own services (private - artisans only)
export const getMyServices = async (page = 1, limit = 10) => {
  logApiCall('GET', `${API_URL}/services/my-services`);
  
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await axios.get(`${API_URL}/services/my-services?${queryParams}`, {
      headers: getAuthHeaders()
    });
    
    console.log("✅ My services fetched with new pricing structure");
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch my services:", error.response || error);
    throw error.response?.data || { message: 'Failed to fetch your services' };
  }
};

// Delete a service (private - artisan owner only)
export const deleteService = async (serviceId) => {
  logApiCall('DELETE', `${API_URL}/services/${serviceId}`);
  
  try {
    const response = await axios.delete(`${API_URL}/services/${serviceId}`, {
      headers: getAuthHeaders()
    });
    
    console.log("✅ Service deleted successfully");
    return response.data;
  } catch (error) {
    console.error("❌ Failed to delete service:", error.response || error);
    throw error.response?.data || { message: 'Failed to delete service' };
  }
};

// ========== NEW: PRICING-SPECIFIC API FUNCTIONS ==========

// Get available category breakdown for a service category
export const getCategoryBreakdown = async (category) => {
  logApiCall('GET', `${API_URL}/services/categories/${category}/breakdown`);
  
  try {
    const response = await axios.get(`${API_URL}/services/categories/${category}/breakdown`);
    console.log(`✅ Category breakdown fetched for ${category}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to fetch breakdown for ${category}:`, error.response || error);
    throw error.response?.data || { message: 'Failed to fetch category breakdown' };
  }
};

// Get all supported categories for categorized pricing
export const getSupportedCategorizedPricing = async () => {
  logApiCall('GET', `${API_URL}/services/categorized-pricing/supported`);
  
  try {
    const response = await axios.get(`${API_URL}/services/categorized-pricing/supported`);
    console.log("✅ Supported categorized pricing categories:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch supported categories:", error.response || error);
    throw error.response?.data || { message: 'Failed to fetch supported categories' };
  }
};

// Get services by pricing type (fixed/negotiate/categorized)
export const getServicesByPricingType = async (pricingType, page = 1, limit = 10) => {
  logApiCall('GET', `${API_URL}/services/pricing/${pricingType}`);
  
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await axios.get(`${API_URL}/services/pricing/${pricingType}?${queryParams}`);
    console.log(`✅ Services fetched for pricing type ${pricingType}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to fetch services for ${pricingType} pricing:`, error.response || error);
    throw error.response?.data || { message: `Failed to fetch ${pricingType} pricing services` };
  }
};

// Search services with pricing filters
export const searchServicesWithPricing = async (searchParams = {}) => {
  logApiCall('GET', `${API_URL}/services/search`, searchParams);
  
  try {
    const queryParams = new URLSearchParams(
      Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== undefined && value !== '')
      )
    );

    const response = await axios.get(`${API_URL}/services/search?${queryParams}`);
    console.log("✅ Services search completed with pricing filters:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to search services:", error.response || error);
    throw error.response?.data || { message: 'Failed to search services' };
  }
};

// ========== UTILITY FUNCTIONS ==========

// Helper function to format pricing display
export const formatPricingDisplay = (service) => {
  if (!service.pricing) {
    // Legacy service - try to extract from old price field
    return service.price || 'Contact for pricing';
  }

  switch (service.pricing.type) {
    case 'fixed':
      return `₦${Number(service.pricing.basePrice).toLocaleString()}`;
    case 'negotiate':
      return 'Price on consultation';
    case 'categorized':
      if (service.pricing.categories && service.pricing.categories.length > 0) {
        const prices = service.pricing.categories.map(cat => cat.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return `₦${min.toLocaleString()} - ₦${max.toLocaleString()}`;
      }
      return 'Contact for pricing';
    default:
      return 'Contact for pricing';
  }
};

// Helper function to get pricing type display name
export const getPricingTypeDisplayName = (pricingType) => {
  const displayNames = {
    'fixed': 'Fixed Price',
    'negotiate': 'Negotiate Price',
    'categorized': 'Categorized Pricing'
  };
  return displayNames[pricingType] || 'Contact for pricing';
};

// Helper function to check if category supports categorized pricing
export const supportsCategorizedPricing = (category) => {
  const supportedCategories = ['Woodworking', 'Metalwork', 'Textile Art'];
  return supportedCategories.includes(category);
};

export default {
  createService,
  updateService,
  getAllServices,
  getServiceById,
  getMyServices,
  deleteService,
  getCategoryBreakdown,
  getSupportedCategorizedPricing,
  getServicesByPricingType,
  searchServicesWithPricing,
  formatPricingDisplay,
  getPricingTypeDisplayName,
  supportsCategorizedPricing
};