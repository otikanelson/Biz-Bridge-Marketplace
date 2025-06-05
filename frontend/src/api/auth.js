// frontend/src/api/auth.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Set auth token for requests
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
    console.log('Auth token set successfully');
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
    console.log('Auth token removed');
  }
};

// Initialize token from localStorage on app start
const initializeAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
  }
};

// Call on module load
initializeAuth();

// Helper function to handle API errors
const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with error status
    const errorData = error.response.data;
    throw {
      message: errorData.message || 'Server error occurred',
      status: error.response.status,
      details: errorData
    };
  } else if (error.request) {
    // Network error
    throw {
      message: 'Network error - please check your connection',
      status: 0
    };
  } else {
    // Other error
    throw {
      message: error.message || 'An unexpected error occurred',
      status: 0
    };
  }
};

// Register customer
export const registerCustomer = async (formData) => {
  try {
    console.log('Making customer registration request...');
    
    const response = await axios.post(`${API_URL}/auth/register/customer`, formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
      }
    });
    
    console.log('Customer registration response:', response.data);
    
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Register artisan
export const registerArtisan = async (formData) => {
  try {
    console.log('Making artisan registration request...');
    
    const response = await axios.post(`${API_URL}/auth/register/artisan`, formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
      }
    });
    
    console.log('Artisan registration response:', response.data);
    
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    console.log('Making login request for:', credentials.email);
    
    const response = await axios.post(`${API_URL}/auth/login`, credentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Login response:', response.data);
    
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    console.log('Getting current user...');
    
    const response = await axios.get(`${API_URL}/auth/me`);
    
    console.log('Current user response:', response.data);
    
    return response.data;
  } catch (error) {
    // If unauthorized, remove invalid token
    if (error.response?.status === 401) {
      setAuthToken(null);
    }
    handleApiError(error);
  }
};

// Logout user
export const logoutUser = () => {
  console.log('Logging out user...');
  setAuthToken(null);
};

// Upload CAC document
export const uploadCACDocument = async (userId, file) => {
  try {
    const formData = new FormData();
    formData.append('cacDocument', file);
    
    const response = await axios.post(`${API_URL}/auth/upload-cac/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};