import axios from 'axios';
import { API_URL } from "./config";


export const getArtisanServices = async (artisanId, activeOnly = false) => {
  const endpoint = `${API_URL}/services/artisan/${artisanId}`;
  console.log("Fetching artisan services from:", endpoint);
  
  try {
    const response = await axios.get(endpoint, {
      params: { activeOnly }
    });
    console.log("Artisan services response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching artisan services:', error.response || error);
    
    // Handle specific error cases
    if (error.response?.status === 404) {
      throw { message: 'Artisan not found', status: 404 };
    } else if (error.response?.status === 500) {
      throw { message: 'Server error. Please try again later.', status: 500 };
    }
    
    throw error.response?.data || { message: 'Failed to fetch artisan services' };
  }
};

// Get artisan profile (you might need to create this API endpoint)
export const getArtisanProfile = async (artisanId) => {
  const endpoint = `${API_URL}/users/${artisanId}`;
  console.log("Fetching artisan profile from:", endpoint);
  
  try {
    const response = await axios.get(endpoint);
    console.log("Artisan profile response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching artisan profile:', error.response || error);
    
    if (error.response?.status === 404) {
      throw { message: 'Artisan profile not found', status: 404 };
    }
    
    throw error.response?.data || { message: 'Failed to fetch artisan profile' };
  }
};

// Get user profile (you might need to create this API endpoint)
export const getProfile = async (userId) => {
  const endpoint = `${API_URL}/users/${userId}`;
  console.log("Fetching user profile from:", endpoint);
  
  try {
    const response = await axios.get(endpoint);
    console.log("User profile response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error.response || error);
    
    if (error.response?.status === 404) {
      throw { message: 'User profile not found', status: 404 };
    }
    
    throw error.response?.data || { message: 'Failed to fetch user profile' };
  }
};

// Fetch all services from the backend
export const getServices = async () => {
  const response = await fetch(`${API_URL}/api/services/all`);
  return response.json();
};

// Navigate to Service Display
export const getServiceById = async (serviceId) => {
  const endpoint = `${API_URL}/services/${serviceId}`;
  console.log("Fetching service details from:", endpoint);
  
  try {
    const response = await axios.get(endpoint);
    console.log("Service details response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching service details:', error.response || error);
    
    // Handle specific error cases
    if (error.response?.status === 404) {
      throw { message: 'Service not found', status: 404 };
    } else if (error.response?.status === 500) {
      throw { message: 'Server error. Please try again later.', status: 500 };
    }
    
    throw error.response?.data || { message: 'Failed to fetch service details' };
  }
};

// Example for the createService function
export const createService = async (serviceData) => {
  try {
    console.log("📝 Creating service with data:", serviceData);
    
    // Create FormData for file uploads
    const formData = new FormData();
    
    // ✅ FIXED: Add text fields with explicit string conversion
    const textFields = ['title', 'description', 'category', 'price', 'duration'];
    
    textFields.forEach(field => {
      if (serviceData[field] !== undefined && serviceData[field] !== null) {
        formData.append(field, String(serviceData[field]));
      }
    });
    
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
    
    // ✅ FIXED: Handle service image properly
    if (serviceData.serviceImage && serviceData.serviceImage instanceof File) {
      console.log("📸 Adding service image:", serviceData.serviceImage.name);
      formData.append('images', serviceData.serviceImage);
    }
    
    // ✅ FIXED: Handle multiple images if available
    if (serviceData.images && Array.isArray(serviceData.images)) {
      serviceData.images.forEach((image, index) => {
        if (image instanceof File) {
          console.log(`📸 Adding image ${index + 1}:`, image.name);
          formData.append('images', image);
        }
      });
    }
    
    // Log FormData entries for debugging
    console.log("📝 FormData contents:");
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
    
    console.log("✅ Service created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Service creation error:", error.response || error);
    throw error.response?.data || { message: 'Failed to create service' };
  }
};