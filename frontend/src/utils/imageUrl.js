// imageUrl.js - Centralized image URL handling
import { API_BASE_URL } from '../config/api';

/**
 * Get properly formatted service image URL from a service object or path
 * @param {Object|string} serviceOrPath - Service object or image path
 * @returns {string} - Full URL or placeholder
 */
export const getServiceImageUrl = (serviceOrPath) => {
  try {
    // If it's a service object, extract the first image
    if (serviceOrPath && typeof serviceOrPath === 'object') {
      const service = serviceOrPath;
      const images = service.images || service.image || [];
      
      // Handle if images is a string (single image)
      if (typeof images === 'string') {
        const imagePath = images;
        if (imagePath.startsWith('http')) return imagePath;
        return `${API_BASE_URL}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
      }
      
      // Handle if images is an array
      if (Array.isArray(images) && images.length > 0) {
        const imagePath = images[0];
        if (!imagePath) return 'https://via.placeholder.com/400x300?text=No+Image';
        if (imagePath.startsWith('http')) return imagePath;
        return `${API_BASE_URL}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
      }
      
      return 'https://via.placeholder.com/400x300?text=No+Image';
    }
    
    // If it's a string path
    if (typeof serviceOrPath === 'string' && serviceOrPath) {
      const imagePath = serviceOrPath;
      if (imagePath.startsWith('http')) return imagePath;
      return `${API_BASE_URL}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
    }
    
    return 'https://via.placeholder.com/400x300?text=No+Image';
  } catch (error) {
    console.error('Error in getServiceImageUrl:', error);
    return 'https://via.placeholder.com/400x300?text=Error';
  }
};

/**
 * Get properly formatted profile image URL
 * @param {string} imagePath - Path from database
 * @returns {string} - Full URL or placeholder
 */
export const getProfileImageUrl = (imagePath) => {
  try {
    if (!imagePath) return 'https://via.placeholder.com/80x80?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
  } catch (error) {
    console.error('Error in getProfileImageUrl:', error);
    return 'https://via.placeholder.com/80x80?text=Error';
  }
};

/**
 * Get the first image from an array of images
 * @param {Array} images - Array of image paths
 * @returns {string} - Full URL or placeholder
 */
export const getFirstServiceImage = (images) => {
  try {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return 'https://via.placeholder.com/400x300?text=No+Image';
    }
    return getServiceImageUrl(images[0]);
  } catch (error) {
    console.error('Error in getFirstServiceImage:', error);
    return 'https://via.placeholder.com/400x300?text=Error';
  }
};
