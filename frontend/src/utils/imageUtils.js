const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * Get the primary service image with fallback to placeholder
 * @param {Object} service - Service object
 * @returns {string} - Image URL or placeholder
 */
export const getServiceImage = (service) => {
  // Try different possible image properties in order of preference
  const imageCandidate = 
    service?.images?.[0] ||            // First image from array (primary)
    service?.serviceImage ||           // Single image upload (legacy)
    service?.image ||                  // Alternative property name
    null;

  if (imageCandidate) {
    console.log('🖼️ Processing service image:', imageCandidate);
    
    // Handle different URL formats
    if (imageCandidate.startsWith('http')) {
      // Already a full URL
      return imageCandidate;
    } else if (imageCandidate.startsWith('/uploads')) {
      // Proper relative path from backend
      const fullUrl = `${API_URL}${imageCandidate}`;
      console.log('🖼️ Generated URL:', fullUrl);
      return fullUrl;
    } else if (imageCandidate.includes('uploads/')) {
      // Path that includes uploads but missing leading slash
      const fixedPath = imageCandidate.startsWith('/') ? imageCandidate : '/' + imageCandidate;
      const fullUrl = `${API_URL}${fixedPath}`;
      console.log('🖼️ Fixed and generated URL:', fullUrl);
      return fullUrl;
    } else {
      // Assume it's a filename in uploads/services
      const fullUrl = `${API_URL}/uploads/services/${imageCandidate}`;
      console.log('🖼️ Filename-based URL:', fullUrl);
      return fullUrl;
    }
  }

  console.log('🖼️ No image found, using placeholder for service:', service?.title);
  // Return placeholder if no image found
  return getServicePlaceholder(service);
};

/**
 * Get all service images with proper URLs
 * @param {Object} service - Service object
 * @returns {Array} - Array of image URLs
 */
export const getServiceImages = (service) => {
  const images = service?.images || [];
  
  if (images.length === 0 && service?.serviceImage) {
    // If no images array but has serviceImage, use that
    return [getServiceImage(service)];
  }

  // Process all images in the array
  return images.map(image => {
    if (!image) return getServicePlaceholder(service);
    
    if (image.startsWith('http')) {
      return image;
    } else if (image.startsWith('/uploads')) {
      return `${API_URL}${image}`;
    } else if (image.includes('uploads/')) {
      const fixedPath = image.startsWith('/') ? image : '/' + image;
      return `${API_URL}${fixedPath}`;
    } else {
      return `${API_URL}/uploads/services/${image}`;
    }
  });
};

/**
 * Get service placeholder image based on category
 * @param {Object} service - Service object  
 * @returns {string} - Placeholder image URL
 */
export const getServicePlaceholder = (service) => {
  const category = service?.category?.toLowerCase() || 'general';
  
  // Map categories to appropriate Unsplash images
  const placeholderMap = {
    'woodworking': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop&q=80',
    'pottery': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&q=80',
    'jewelry making': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop&q=80',
    'textile art': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop&q=80',
    'leathercraft': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop&q=80',
    'metalwork': 'https://images.unsplash.com/photo-1567361808960-dec9cb578182?w=300&h=200&fit=crop&q=80',
    'glasswork': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop&q=80',
    'basket weaving': 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=300&h=200&fit=crop&q=80',
    'beadwork': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop&q=80',
    'photography': 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=300&h=200&fit=crop&q=80'
  };

  // Return category-specific placeholder or default
  return placeholderMap[category] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop&q=80';
};

/**
 * Handle image loading errors consistently
 * @param {Event} event - Image error event
 * @param {Object} service - Service object for context
 */
export const handleImageError = (event, service) => {
  console.log('❌ Image failed to load for service:', service?.title);
  console.log('❌ Failed URL:', event.target.src);
  
  // Set fallback to placeholder
  event.target.src = getServicePlaceholder(service);
  
  // Prevent infinite error loops
  event.target.onerror = null;
};