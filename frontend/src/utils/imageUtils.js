// src/utils/imageUtils.js - Fixed Image URL Construction
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com' 
  : 'http://localhost:3000';

/**
 * Construct proper image URL from backend path
 * @param {string} imagePath - Image path from backend
 * @param {string} type - Type of image ('service', 'profile', 'other')
 * @returns {string} - Full image URL or placeholder
 */
export const getImageUrl = (imagePath, type = 'service') => {
  console.log('🖼️ Processing image path:', imagePath, 'type:', type);
  
  if (!imagePath) {
    console.log('🖼️ No image path provided, returning placeholder');
    return getPlaceholderUrl(type);
  }
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    console.log('🖼️ Full URL detected, returning as is:', imagePath);
    return imagePath;
  }
  
  // If it starts with /uploads, construct full URL
  if (imagePath.startsWith('/uploads')) {
    const fullUrl = `${API_BASE_URL}${imagePath}`;
    console.log('🖼️ Uploads path detected, full URL:', fullUrl);
    return fullUrl;
  }
  
  // If it contains uploads but missing leading slash
  if (imagePath.includes('uploads/')) {
    const fixedPath = imagePath.startsWith('/') ? imagePath : '/' + imagePath;
    const fullUrl = `${API_BASE_URL}${fixedPath}`;
    console.log('🖼️ Fixed uploads path, full URL:', fullUrl);
    return fullUrl;
  }
  
  // If it's just a filename, construct full path based on type
  let fullUrl;
  switch (type) {
    case 'profile':
      fullUrl = `${API_BASE_URL}/uploads/profiles/${imagePath}`;
      break;
    case 'service':
      fullUrl = `${API_BASE_URL}/uploads/services/${imagePath}`;
      break;
    default:
      fullUrl = `${API_BASE_URL}/uploads/${imagePath}`;
  }
  
  console.log('🖼️ Filename detected, constructed URL:', fullUrl);
  return fullUrl;
};

/**
 * Get placeholder URL based on type
 * @param {string} type - Type of placeholder needed
 * @returns {string} - Placeholder URL
 */
export const getPlaceholderUrl = (type = 'service') => {
  switch (type) {
    case 'profile':
      return '/api/placeholder/80/80';
    case 'service':
      return '/api/placeholder/300/200';
    case 'avatar':
      return '/api/placeholder/32/32';
    default:
      return '/api/placeholder/300/200';
  }
};

/**
 * Get service image URL with fallback logic
 * @param {Object} service - Service object
 * @returns {string} - Image URL or placeholder
 */
export const getServiceImageUrl = (service) => {
  if (!service) {
    console.log('🖼️ No service provided, returning placeholder');
    return getPlaceholderUrl('service');
  }
  
  // Try different possible image properties in order of preference
  const imageCandidate = 
    service.images?.[0] ||        // First image from array (new format)
    service.serviceImage ||       // Single service image (form upload)
    service.image ||              // Legacy image property
    null;

  if (imageCandidate) {
    console.log('🖼️ Service image candidate found:', imageCandidate);
    return getImageUrl(imageCandidate, 'service');
  }

  console.log('🖼️ No service image found, using placeholder for:', service.title);
  return getServicePlaceholder(service);
};

/**
 * Get all service images with proper URLs
 * @param {Object} service - Service object
 * @returns {Array} - Array of image URLs
 */
export const getServiceImages = (service) => {
  if (!service) return [getPlaceholderUrl('service')];
  
  const images = service.images || [];
  
  if (images.length === 0 && service.serviceImage) {
    // If no images array but has serviceImage, use that
    return [getServiceImageUrl(service)];
  }
  
  if (images.length === 0) {
    // No images at all, return placeholder
    return [getServicePlaceholder(service)];
  }

  // Process all images in the array
  return images.map(image => {
    if (!image) return getServicePlaceholder(service);
    return getImageUrl(image, 'service');
  });
};

/**
 * Get artisan profile image URL with fallback
 * @param {Object} artisan - Artisan/user object
 * @returns {string} - Profile image URL or placeholder
 */
export const getProfileImageUrl = (artisan) => {
  if (!artisan) {
    console.log('🖼️ No artisan provided, returning profile placeholder');
    return getPlaceholderUrl('profile');
  }
  
  // Try different possible profile image properties
  const imageCandidate = 
    artisan.profileImage ||
    artisan.image ||
    artisan.avatar ||
    null;

  if (imageCandidate) {
    console.log('🖼️ Profile image candidate found:', imageCandidate);
    return getImageUrl(imageCandidate, 'profile');
  }

  console.log('🖼️ No profile image found for:', artisan.contactName || artisan.businessName);
  return getPlaceholderUrl('profile');
};

/**
 * Get service placeholder image based on category
 * @param {Object} service - Service object  
 * @returns {string} - Category-appropriate placeholder image URL
 */
export const getServicePlaceholder = (service) => {
  const category = service?.category?.toLowerCase() || 'general';
  
  // Map categories to appropriate placeholder images
  const placeholderMap = {
    'woodworking': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop&q=80',
    'pottery': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&q=80',
    'pottery & ceramics': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&q=80',
    'jewelry making': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop&q=80',
    'textile art': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop&q=80',
    'leathercraft': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop&q=80',
    'metalwork': 'https://images.unsplash.com/photo-1567361808960-dec9cb578182?w=300&h=200&fit=crop&q=80',
    'glasswork': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop&q=80',
    'glass blowing': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop&q=80',
    'basket weaving': 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=300&h=200&fit=crop&q=80',
    'beadwork': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop&q=80',
    'photography': 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=300&h=200&fit=crop&q=80',
    'calabash decoration': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&q=80',
    'leather shoes': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop&q=80',
    'embroidery': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop&q=80',
    'soap making': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=200&fit=crop&q=80',
    'candle making': 'https://images.unsplash.com/photo-1602874801006-fd8d8ecc0e2b?w=300&h=200&fit=crop&q=80',
    'hair braiding & styling': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=200&fit=crop&q=80'
  };

  // Return category-specific placeholder or default
  return placeholderMap[category] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop&q=80';
};

/**
 * Handle image loading errors consistently across the app
 * @param {Event} event - Image error event
 * @param {string} type - Type of image ('service', 'profile', etc.)
 * @param {Object} fallbackData - Additional data for fallbacks (service for category-based placeholders)
 */
export const handleImageError = (event, type = 'service', fallbackData = null) => {
  console.log('❌ Image failed to load:', event.target.src);
  
  // Prevent infinite error loops
  if (event.target.dataset.errorHandled) {
    console.log('❌ Error already handled for this image, skipping');
    return;
  }
  
  event.target.dataset.errorHandled = 'true';
  
  // Set appropriate fallback based on type
  switch (type) {
    case 'service':
      event.target.src = fallbackData ? getServicePlaceholder(fallbackData) : getPlaceholderUrl('service');
      break;
    case 'profile':
      event.target.src = getPlaceholderUrl('profile');
      break;
    case 'avatar':
      event.target.src = getPlaceholderUrl('avatar');
      break;
    default:
      event.target.src = getPlaceholderUrl('service');
  }
  
  console.log('🔄 Fallback image set:', event.target.src);
};

/**
 * Preload image to check if it exists
 * @param {string} url - Image URL to test
 * @returns {Promise<boolean>} - Whether image loads successfully
 */
export const preloadImage = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

/**
 * Get optimized image URL for different screen sizes
 * @param {string} imagePath - Original image path
 * @param {string} size - Size variant ('thumbnail', 'medium', 'large')
 * @returns {string} - Optimized image URL
 */
export const getOptimizedImageUrl = (imagePath, size = 'medium') => {
  const baseUrl = getImageUrl(imagePath);
  
  // If it's already a placeholder or external URL, return as is
  if (!baseUrl.includes(API_BASE_URL) || baseUrl.includes('placeholder') || baseUrl.includes('unsplash')) {
    return baseUrl;
  }
  
  // Add size parameter for backend image optimization (if implemented)
  const sizeMap = {
    thumbnail: '150x150',
    medium: '400x300',
    large: '800x600'
  };
  
  const sizeParam = sizeMap[size] || sizeMap.medium;
  return `${baseUrl}?size=${sizeParam}`;
};