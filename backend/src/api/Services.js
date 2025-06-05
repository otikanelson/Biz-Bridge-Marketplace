// src/api/Services.js
import axios from 'axios';

// API base URL from environment variables
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No authentication token found');
    return {};
  }
  return { Authorization: `Bearer ${token}` };
};

// Log API calls in development
const logApiCall = (method, endpoint, data = null) => {
  console.log(`API ${method}: ${endpoint}`, data ? data : '');
};

// Get all services (public)
export const getAllServices = async (params = {}) => {
  logApiCall('GET', `${API_URL}/services`, params);
  try {
    const response = await axios.get(`${API_URL}/services`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error.response || error);
    throw error.response?.data || { message: 'Failed to fetch services' };
  }
};

// Get a specific service by ID (public)
export const getServiceById = async (serviceId) => {
  logApiCall('GET', `${API_URL}/services/${serviceId}`);
  try {
    const response = await axios.get(`${API_URL}/services/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service details:', error.response || error);
    throw error.response?.data || { message: 'Failed to fetch service details' };
  }
};

// Get services for the authenticated artisan (private)
export const getMyServices = async () => {
    const endpoint = `${API_URL}/services/my-services`;
    console.log("Fetching services from:", endpoint);
    
    try {
      const response = await axios.get(endpoint, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching my services:', error.response || error);
      throw error.response?.data || { message: 'Failed to fetch your services' };
    }
  };

// Create a new service (private - artisans only)
export const createService = async (serviceData) => {
  logApiCall('POST', `${API_URL}/services`);
  
  try {
    console.log("Creating service with data:", serviceData);
    
    // Create FormData for file uploads
    const formData = new FormData();
    
    // Add basic text fields with explicit string conversion
    formData.append('title', String(serviceData.title || ''));
    formData.append('description', String(serviceData.description || ''));
    formData.append('price', String(serviceData.price || ''));
    
    if (serviceData.duration) {
      formData.append('duration', String(serviceData.duration));
    }
    
    // Add category (from first selected job)
    if (serviceData.category) {
      formData.append('category', String(serviceData.category));
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
    
    // Add service image if available
    if (serviceData.serviceImage) {
      formData.append('images', serviceData.serviceImage);
    }
    
    // Log FormData entries for debugging
    console.log("FormData contents:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
    }
    
    const response = await axios.post(`${API_URL}/services`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Service creation error:", error.response || error);
    throw error.response?.data || { message: 'Failed to create service' };
  }
};

// Update an existing service (private - artisans only)
export const updateService = async (serviceId, serviceData) => {
  logApiCall('PUT', `${API_URL}/services/${serviceId}`);
  
  try {
    console.log("Updating service with data:", serviceData);
    
    // Create FormData for file uploads
    const formData = new FormData();
    
    // Add all text fields to FormData with explicit string conversion
    const textFields = [
      'title', 'description', 'category', 'price', 
      'duration', 'isActive'
    ];
    
    textFields.forEach(field => {
      if (serviceData[field] !== undefined) {
        formData.append(field, String(serviceData[field]));
      }
    });
    
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
    console.log("FormData contents for update:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
    }
    
    const response = await axios.put(`${API_URL}/services/${serviceId}`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Service update error:', error.response || error);
    throw error.response?.data || { message: 'Failed to update service' };
  }
};

// Delete a service (private - artisans only)
export const deleteService = async (serviceId) => {
  logApiCall('DELETE', `${API_URL}/services/${serviceId}`);
  
  try {
    const response = await axios.delete(`${API_URL}/services/${serviceId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Service deletion error:', error.response || error);
    throw error.response?.data || { message: 'Failed to delete service' };
  }
};

// Toggle service active status (private - artisans only)
export const toggleServiceStatus = async (serviceId) => {
  logApiCall('PATCH', `${API_URL}/services/${serviceId}/status`);
  
  try {
    const response = await axios.patch(`${API_URL}/services/${serviceId}/status`, {}, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Service status toggle error:', error.response || error);
    throw error.response?.data || { message: 'Failed to update service status' };
  }
};

// Search for services
export const searchServices = async (query) => {
  logApiCall('GET', `${API_URL}/services`, query);
  
  try {
    const response = await axios.get(`${API_URL}/services`, {
      params: query
    });
    return response.data;
  } catch (error) {
    console.error('Service search error:', error.response || error);
    throw error.response?.data || { message: 'Failed to search services' };
  }
};

// Get featured services
export const getFeaturedServices = async (limit = 6) => {
  logApiCall('GET', `${API_URL}/services/featured`, { limit });
  
  try {
    const response = await axios.get(`${API_URL}/services/featured`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Featured services error:', error.response || error);
    throw error.response?.data || { message: 'Failed to fetch featured services' };
  }
};

// Get services by artisan
export const getArtisanServices = async (artisanId, activeOnly = true) => {
  logApiCall('GET', `${API_URL}/services/artisan/${artisanId}`, { active: activeOnly });
  
  try {
    const response = await axios.get(`${API_URL}/services/artisan/${artisanId}`, {
      params: { active: activeOnly }
    });
    return response.data;
  } catch (error) {
    console.error('Artisan services error:', error.response || error);
    throw error.response?.data || { message: 'Failed to fetch artisan services' };
  }
};