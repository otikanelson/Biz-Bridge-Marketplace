import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get any user's profile by ID (context-aware: public or own)
export const getUserProfile = async (userId) => {
  try {
    console.log('🔍 Fetching user profile for ID:', userId);
    
    const response = await axios.get(`${API_URL}/users/${userId}`, {
      headers: getAuthHeaders()
    });
    
    console.log('👤 User profile response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching user profile:', error);
    throw error.response?.data || { message: 'Failed to fetch user profile' };
  }
};

// Get current user's own profile (always private/full data)
export const getMyProfile = async () => {
  try {
    console.log('🔍 Fetching my profile...');
    
    const response = await axios.get(`${API_URL}/users/me/profile`, {
      headers: getAuthHeaders()
    });
    
    console.log('👤 My profile response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching my profile:', error);
    throw error.response?.data || { message: 'Failed to fetch your profile' };
  }
};

// Update current user's profile
export const updateMyProfile = async (profileData) => {
  try {
    console.log('✏️ Updating profile with data:', profileData);
    
    const response = await axios.put(`${API_URL}/users/me/profile`, profileData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Profile updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

// Upload profile image
export const uploadProfileImage = async (imageFile) => {
  try {
    console.log('📸 Uploading profile image...');
    
    const formData = new FormData();
    formData.append('profileImage', imageFile);
    
    const response = await axios.post(`${API_URL}/users/me/profile/image`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log('✅ Profile image uploaded successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error uploading profile image:', error);
    throw error.response?.data || { message: 'Failed to upload profile image' };
  }
};

// Get profile route recommendation based on context
export const getProfileRoute = (userId, currentUserId) => {
  if (!userId) return '/profile'; // Default to own profile
  if (userId === currentUserId) return '/profile'; // Own profile
  return `/user/${userId}`; // Other user's profile
};

// Determine if user can edit profile
export const canEditProfile = (profileUserId, currentUserId) => {
  return profileUserId === currentUserId;
};