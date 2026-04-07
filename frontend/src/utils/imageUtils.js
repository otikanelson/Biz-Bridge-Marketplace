/**
 * Get the API base URL for image requests
 * @returns {string} Base URL for API
 */
import { API_URL } from '../api/config';

const getApiBaseUrl = () => API_URL.replace('/api', '');

/**
 * Get the correct image URL for profile pictures
 * @param {string} imagePath - The image path from the database
 * @param {string} fallbackInitial - Initial for placeholder (optional)
 * @returns {object} Image configuration object
 */
export const getProfileImageUrl = (imagePath, type = 'profile') => {
  console.log('🖼️ Processing image path:', imagePath);
  
  if (!imagePath) {
    console.log('🖼️ No image path, returning null');
    return null;
  }
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    console.log('🖼️ Full URL detected:', imagePath);
    return imagePath;
  }
  
  // Get API base URL
  const API_BASE_URL = getApiBaseUrl();
  
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
    console.log('🖼️ Fixed uploads path:', fullUrl);
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
 * Profile Picture Component - Reusable component for displaying profile pictures
 * @param {object} props - Component props
 * @param {string} props.imagePath - Image path from database
 * @param {string} props.name - User's name for fallback initial
 * @param {string} props.size - Size variant (small, medium, large, xl)
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Profile picture component
 */
export const ProfilePicture = ({ 
  imagePath, 
  name = 'User', 
  size = 'medium', 
  className = '',
  onClick = null 
}) => {
  const imageConfig = getProfileImageUrl(imagePath, name);
  
  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-12 h-12 text-sm',
    large: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl',
    xxl: 'w-32 h-32 text-4xl'
  };

  const handleImageError = (e) => {
    // Hide the broken image and show placeholder
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  return (
    <div 
      className={`${sizeClasses[size]} rounded-full overflow-hidden relative ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {imageConfig.hasImage ? (
        <>
          <img 
            src={imageConfig.imageUrl}
            alt={`${name}'s profile`}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
          {/* Fallback placeholder - hidden by default, shown when image fails */}
          <div 
            className={`w-full h-full ${imageConfig.placeholder.bgColor} ${imageConfig.placeholder.textColor} flex items-center justify-center font-bold absolute top-0 left-0`}
            style={{ display: 'none' }}
          >
            {imageConfig.placeholder.initial}
          </div>
        </>
      ) : (
        <div className={`w-full h-full ${imageConfig.placeholder.bgColor} ${imageConfig.placeholder.textColor} flex items-center justify-center font-bold`}>
          {imageConfig.placeholder.initial}
        </div>
      )}
    </div>
  );
};

/**
 * Service Card Profile Picture - Specialized for service cards
 * @param {object} artisan - Artisan object from service data
 * @returns {JSX.Element} Service card profile picture
 */
export const ServiceCardProfilePicture = ({ artisan }) => {
  if (!artisan) {
    return (
      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
        <span className="text-white text-sm font-bold">A</span>
      </div>
    );
  }

  return (
    <ProfilePicture
      imagePath={artisan.profileImage}
      name={artisan.name || artisan.username}
      size="medium"
      className="flex-shrink-0"
    />
  );
};

/**
 * Validate image file for upload
 * @param {File} file - File object to validate
 * @returns {object} Validation result
 */
export const validateImageFile = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (!file) {
    return {
      isValid: false,
      error: 'No file selected'
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please select a valid image file (JPG, PNG, GIF, or WebP)'
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Image size must be less than 5MB'
    };
  }

  return {
    isValid: true,
    error: null
  };
};

/**
 * Create image preview from file
 * @param {File} file - Image file
 * @returns {Promise<string>} Promise that resolves to data URL
 */
export const createImagePreview = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Generate a consistent color for placeholder based on name
 * @param {string} name - User's name
 * @returns {object} Color configuration
 */
export const getPlaceholderColor = (name) => {
  const colors = [
    { bg: 'bg-red-400', text: 'text-white' },
    { bg: 'bg-blue-400', text: 'text-white' },
    { bg: 'bg-green-400', text: 'text-white' },
    { bg: 'bg-yellow-400', text: 'text-white' },
    { bg: 'bg-purple-400', text: 'text-white' },
    { bg: 'bg-pink-400', text: 'text-white' },
    { bg: 'bg-indigo-400', text: 'text-white' },
    { bg: 'bg-gray-400', text: 'text-white' }
  ];

  // Generate consistent color based on name
  const hash = name.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);

  return colors[hash % colors.length];
};

/**
 * Enhanced Profile Picture with color-coded placeholders
 * @param {object} props - Component props
 */
export const ColoredProfilePicture = ({ 
  imagePath, 
  name = 'User', 
  size = 'medium', 
  className = '',
  onClick = null 
}) => {
  const imageConfig = getProfileImageUrl(imagePath, name);
  const colorConfig = getPlaceholderColor(name);
  
  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-12 h-12 text-sm',
    large: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl',
    xxl: 'w-32 h-32 text-4xl'
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  return (
    <div 
      className={`${sizeClasses[size]} rounded-full overflow-hidden relative ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {imageConfig.hasImage ? (
        <>
          <img 
            src={imageConfig.imageUrl}
            alt={`${name}'s profile`}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
          <div 
            className={`w-full h-full ${colorConfig.bg} ${colorConfig.text} flex items-center justify-center font-bold absolute top-0 left-0`}
            style={{ display: 'none' }}
          >
            {imageConfig.placeholder.initial}
          </div>
        </>
      ) : (
        <div className={`w-full h-full ${colorConfig.bg} ${colorConfig.text} flex items-center justify-center font-bold`}>
          {imageConfig.placeholder.initial}
        </div>
      )}
    </div>
  );
};

// Export all utilities
export default {
  getProfileImageUrl,
  ProfilePicture,
  ServiceCardProfilePicture,
  ColoredProfilePicture,
  validateImageFile,
  createImagePreview,
  getPlaceholderColor
};