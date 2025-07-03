// frontend/src/api/search.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Search services for customers (uses the search endpoint)
export const searchServices = async (searchParams) => {
  try {
    console.log('🔍 Searching services with params:', searchParams);
    
    const response = await axios.get(`${API_URL}/services/search`, {
      params: {
        category: searchParams.jobCategory || searchParams.category,
        location: searchParams.location,
        search: searchParams.search,
        page: searchParams.page || 1,
        limit: searchParams.limit || 12,
        sort: searchParams.sort || 'newest'
      }
    });
    
    console.log('🔍 Search response:', response.data);
    return response.data;
  } catch (error) {
    console.error('🔍 Search error:', error);
    throw error.response?.data || { message: 'Search failed' };
  }
};

// Get all services (for browse all/homepage)
export const getAllServices = async (params = {}) => {
  try {
    console.log('📋 Fetching all services with params:', params);
    
    const response = await axios.get(`${API_URL}/services`, { 
      params: {
        page: params.page || 1,
        limit: params.limit || 12,
        sort: params.sort || 'newest',
        ...params
      }
    });
    
    console.log('📋 All services response:', response.data);
    return response.data;
  } catch (error) {
    console.error('📋 Error fetching services:', error);
    throw error.response?.data || { message: 'Failed to fetch services' };
  }
};

// Get featured services (for homepage)
export const getFeaturedServices = async (limit = 6) => {
  try {
    console.log('⭐ Fetching featured services, limit:', limit);
    
    const response = await axios.get(`${API_URL}/services/featured`, {
      params: { limit }
    });
    
    console.log('⭐ Featured services response:', response.data);
    return response.data;
  } catch (error) {
    console.error('⭐ Error fetching featured services:', error);
    throw error.response?.data || { message: 'Failed to fetch featured services' };
  }
};

// Get services by category
export const getServicesByCategory = async (category, params = {}) => {
  try {
    console.log('🏷️ Fetching services by category:', category);
    
    const response = await axios.get(`${API_URL}/services`, {
      params: {
        category,
        page: params.page || 1,
        limit: params.limit || 12,
        sort: params.sort || 'newest',
        ...params
      }
    });
    
    console.log('🏷️ Category services response:', response.data);
    return response.data;
  } catch (error) {
    console.error('🏷️ Error fetching category services:', error);
    throw error.response?.data || { message: 'Failed to fetch category services' };
  }
};

// Get services by location
export const getServicesByLocation = async (location, params = {}) => {
  try {
    console.log('📍 Fetching services by location:', location);
    
    const response = await axios.get(`${API_URL}/services`, {
      params: {
        location,
        page: params.page || 1,
        limit: params.limit || 12,
        sort: params.sort || 'newest',
        ...params
      }
    });
    
    console.log('📍 Location services response:', response.data);
    return response.data;
  } catch (error) {
    console.error('📍 Error fetching location services:', error);
    throw error.response?.data || { message: 'Failed to fetch location services' };
  }
};

// Advanced search with multiple filters
export const advancedSearch = async (filters) => {
  try {
    console.log('🔎 Advanced search with filters:', filters);
    
    const response = await axios.get(`${API_URL}/services/search`, {
      params: {
        category: filters.category,
        location: filters.location,
        search: filters.search,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sortBy: filters.sortBy || 'newest',
        page: filters.page || 1,
        limit: filters.limit || 12
      }
    });
    
    console.log('🔎 Advanced search response:', response.data);
    return response.data;
  } catch (error) {
    console.error('🔎 Advanced search error:', error);
    throw error.response?.data || { message: 'Advanced search failed' };
  }
};