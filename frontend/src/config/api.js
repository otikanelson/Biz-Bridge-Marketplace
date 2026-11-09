// Centralized API configuration
const getApiUrl = () => {
  // In production, use environment variable
  if (import.meta.env.VITE_APP_ENV === 'production') {
    return import.meta.env.VITE_API_BASE_URL || 'https://biz-bridge-marketplacebackend.vercel.app/api';
  }
  
  // In development, use local or environment variable
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
};

const getApiBaseUrl = () => {
  // Get base URL without /api suffix
  return getApiUrl().replace('/api', '');
};

export const API_URL = getApiUrl();
export const API_BASE_URL = getApiBaseUrl();

// Export default for convenience
export default {
  API_URL,
  API_BASE_URL,
};
