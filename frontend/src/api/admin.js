// frontend/src/api/admin.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return { Authorization: `Bearer ${token}` };
};

// Get admin dashboard stats
export const getAdminStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/stats`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw error.response?.data || { message: 'Failed to fetch admin stats' };
  }
};

// Get all artisans for admin management
export const getAllArtisansForAdmin = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/admin/artisans`, {
      headers: getAuthHeaders(),
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching artisans for admin:', error);
    throw error.response?.data || { message: 'Failed to fetch artisans' };
  }
};

// Get featured artisans
export const getFeaturedArtisansForAdmin = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/featured-artisans`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching featured artisans:', error);
    throw error.response?.data || { message: 'Failed to fetch featured artisans' };
  }
};

// Feature/Unfeature an artisan
export const toggleArtisanFeatured = async (artisanId, featuredData) => {
  try {
    const response = await axios.patch(
      `${API_URL}/admin/artisans/${artisanId}/feature`,
      featuredData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error toggling artisan featured status:', error);
    throw error.response?.data || { message: 'Failed to update featured status' };
  }
};

// Reorder featured artisans
export const reorderFeaturedArtisans = async (artisanOrders) => {
  try {
    const response = await axios.patch(
      `${API_URL}/admin/featured-artisans/reorder`,
      { artisanOrders },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error reordering featured artisans:', error);
    throw error.response?.data || { message: 'Failed to reorder featured artisans' };
  }
};

// Verify/Unverify an artisan
export const toggleArtisanVerified = async (artisanId, verified) => {
  try {
    const response = await axios.patch(
      `${API_URL}/admin/artisans/${artisanId}/verify`,
      { verified },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error toggling artisan verification:', error);
    throw error.response?.data || { message: 'Failed to update verification status' };
  }
};

// Activate/Deactivate a user
export const toggleUserStatus = async (userId, active) => {
  try {
    const response = await axios.patch(
      `${API_URL}/admin/users/${userId}/status`,
      { active },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error toggling user status:', error);
    throw error.response?.data || { message: 'Failed to update user status' };
  }
};

// Get all services for admin
export const getAllServicesForAdmin = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/admin/services`, {
      headers: getAuthHeaders(),
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching services for admin:', error);
    throw error.response?.data || { message: 'Failed to fetch services' };
  }
};

// Get featured artisans for public display (non-admin)
export const getFeaturedArtisans = async (limit = 4) => {
  try {
    console.log('🌟 Fetching featured artisans, limit:', limit);
    
    const response = await axios.get(`${API_URL}/users/featured`, {
      params: { limit }
    });
    
    console.log('🌟 Featured artisans response:', response.data);
    return response.data;
  } catch (error) {
    console.error('🌟 Error fetching featured artisans:', error);
    
    // Return empty array as fallback instead of throwing
    return {
      success: false,
      artisans: [],
      count: 0,
      message: 'Failed to fetch featured artisans'
    };
  }
};