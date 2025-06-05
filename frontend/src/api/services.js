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
    // Create FormData for file uploads
    const formData = new FormData();
    
    // Add text fields with explicit string conversion
    Object.keys(serviceData).forEach(key => {
      if (key === 'serviceImage' && serviceData[key]) {
        formData.append('images', serviceData[key]);
      } else if (key === 'locations' || key === 'tags') {
        if (serviceData[key] && serviceData[key].length) {
          formData.append(key, JSON.stringify(serviceData[key]));
        }
      } else if (serviceData[key] !== undefined && serviceData[key] !== null) {
        formData.append(key, String(serviceData[key]));
      }
    });
    
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
}