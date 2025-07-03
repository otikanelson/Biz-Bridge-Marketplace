// src/components/cards/ServiceCard.jsx - Fixed Image URL Handling
import React from 'react';
import { useNavigate } from 'react-router-dom';

// API Base URL for constructing image URLs
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com' 
  : 'http://localhost:3000';

// Helper function to construct proper image URLs
const getImageUrl = (imagePath, type = 'service') => {
  if (!imagePath) {
    // Return appropriate placeholder based on type
    return type === 'profile' 
      ? '/api/placeholder/32/32' 
      : '/api/placeholder/300/200';
  }
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it starts with /uploads, construct full URL
  if (imagePath.startsWith('/uploads')) {
    return `${API_BASE_URL}${imagePath}`;
  }
  
  // If it's just a filename, construct full path
  if (type === 'profile') {
    return `${API_BASE_URL}/uploads/profiles/${imagePath}`;
  } else {
    return `${API_BASE_URL}/uploads/services/${imagePath}`;
  }
};

// Enhanced pricing display component
const PricingDisplay = ({ service }) => {
  const getPricingInfo = () => {
    if (!service.pricing) {
      return {
        display: 'Contact for Pricing',
        subtitle: 'Custom quote required',
        badge: 'Quote',
        badgeColor: 'bg-blue-100 text-blue-800'
      };
    }

    switch (service.pricing.type) {
      case 'fixed':
        const price = service.pricing.basePrice;
        return {
          display: price ? `₦${parseInt(price).toLocaleString()}` : 'Contact for Pricing',
          subtitle: service.pricing.baseDuration || 'Duration varies',
          badge: 'Fixed Price',
          badgeColor: 'bg-green-100 text-green-800'
        };

      case 'negotiate':
        return {
          display: 'Contact for Pricing',
          subtitle: 'Price negotiable',
          badge: 'Negotiable',
          badgeColor: 'bg-orange-100 text-orange-800'
        };

      case 'categorized':
        const categories = service.pricing.categories || [];
        if (categories.length === 0) {
          return {
            display: 'Contact for Pricing',
            subtitle: 'Category-based pricing',
            badge: 'Categories',
            badgeColor: 'bg-purple-100 text-purple-800'
          };
        }
        
        const prices = categories.map(cat => cat.price).filter(Boolean);
        if (prices.length === 0) {
          return {
            display: 'Contact for Pricing',
            subtitle: 'Category-based pricing',
            badge: 'Categories',
            badgeColor: 'bg-purple-100 text-purple-800'
          };
        }
        
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        return {
          display: minPrice === maxPrice 
            ? `₦${minPrice.toLocaleString()}`
            : `₦${minPrice.toLocaleString()} - ₦${maxPrice.toLocaleString()}`,
          subtitle: `${categories.length} categories available`,
          badge: 'Categories',
          badgeColor: 'bg-purple-100 text-purple-800'
        };

      default:
        return {
          display: 'Contact for Pricing',
          subtitle: 'Custom quote required',
          badge: 'Quote',
          badgeColor: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const pricingInfo = getPricingInfo();

  return (
    <div className="space-y-2">
      {/* Pricing Badge */}
      <div className="flex justify-between items-center">
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${pricingInfo.badgeColor}`}>
          {pricingInfo.badge}
        </span>
        {service.pricing?.type === 'categorized' && (
          <span className="text-xs text-purple-600 font-medium">⭐ Protected</span>
        )}
      </div>
      
      {/* Price Display */}
      <div>
        <div className="text-lg font-bold text-gray-900">{pricingInfo.display}</div>
        <div className="text-sm text-gray-600">{pricingInfo.subtitle}</div>
      </div>
      
      {/* Additional Info for Categorized */}
      {service.pricing?.type === 'categorized' && service.pricing.categories && (
        <div className="text-xs text-gray-500">
          Categories: {service.pricing.categories.slice(0, 2).map(cat => cat.name).join(', ')}
          {service.pricing.categories.length > 2 && ` +${service.pricing.categories.length - 2} more`}
        </div>
      )}
    </div>
  );
};

// Enhanced Service Card Component with Fixed Image URLs
const ServiceCard = ({ service, onClick, showActions = false, onEdit, onDelete, onToggleStatus }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onClick) {
      onClick(service);
    } else {
      navigate(`/services/${service._id || service.id}`);
    }
  };

  const handleViewProfile = (e) => {
    e.stopPropagation();
    navigate(`/profile/${service.artisan?._id || service.artisanId}`);
  };

  const handleAction = (action, e) => {
    e.stopPropagation();
    switch (action) {
      case 'edit':
        onEdit && onEdit(service);
        break;
      case 'delete':
        onDelete && onDelete(service);
        break;
      case 'toggle':
        onToggleStatus && onToggleStatus(service);
        break;
      default:
        break;
    }
  };

  // Get service image URL with proper fallback
  const getServiceImage = () => {
    // Try multiple possible image properties
    const imageCandidate = 
      service?.images?.[0] ||      // First image from array
      service?.serviceImage ||     // Single service image
      service?.image ||            // Legacy image property
      null;

    return getImageUrl(imageCandidate, 'service');
  };

  // Get artisan profile image URL with proper fallback
  const getArtisanImage = () => {
    if (!service.artisan) return '/api/placeholder/32/32';
    
    const profileImageCandidate = 
      service.artisan.profileImage ||
      service.artisan.image ||
      null;

    return getImageUrl(profileImageCandidate, 'profile');
  };

  // Handle image loading errors
  const handleImageError = (e, type = 'service') => {
    console.log(`❌ Image failed to load for ${type}:`, e.target.src);
    
    if (type === 'profile') {
      e.target.src = '/api/placeholder/32/32';
    } else {
      e.target.src = '/api/placeholder/300/200';
    }
    
    // Prevent infinite error loops
    e.target.onerror = null;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      {/* Service Image */}
      <div className="relative h-48 bg-gray-200" onClick={handleCardClick}>
        <img 
          src={getServiceImage()}
          alt={service.title || 'Service image'}
          className="w-full h-full object-cover"
          onError={(e) => handleImageError(e, 'service')}
          onLoad={() => console.log('✅ Service image loaded successfully:', getServiceImage())}
        />
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            service.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {service.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Service Content */}
      <div className="p-4">
        {/* Service Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer" onClick={handleCardClick}>
          {service.title}
        </h3>

        {/* Service Category */}
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          {service.category || 'Uncategorized'}
        </div>

        {/* Service Locations */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>
            {service.locations && service.locations.length > 0
              ? service.locations.slice(0, 2).map(loc => loc.name || loc.lga || loc).join(', ')
              : 'Location not specified'
            }
            {service.locations && service.locations.length > 2 && ` +${service.locations.length - 2} more`}
          </span>
        </div>

        {/* Pricing Information */}
        <PricingDisplay service={service} />

        {/* Artisan Info */}
        {service.artisan && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center">
              <img
                src={getArtisanImage()}
                alt={service.artisan.contactName || service.artisan.businessName || 'Artisan'}
                className="w-8 h-8 rounded-full object-cover mr-2 border border-gray-200"
                onError={(e) => handleImageError(e, 'profile')}
                onLoad={() => console.log('✅ Artisan profile image loaded:', getArtisanImage())}
              />
              <span className="text-sm text-gray-700 truncate">
                {service.artisan.contactName || service.artisan.businessName || 'Unknown Artisan'}
              </span>
            </div>
            <button
              onClick={handleViewProfile}
              className="text-sm text-red-600 hover:text-red-700 font-medium flex-shrink-0"
            >
              View Profile
            </button>
          </div>
        )}

        {/* Service Actions (for service management) */}
        {showActions && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <div className="flex space-x-2">
              <button
                onClick={(e) => handleAction('edit', e)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Edit
              </button>
              <button
                onClick={(e) => handleAction('toggle', e)}
                className={`text-sm font-medium ${
                  service.isActive 
                    ? 'text-orange-600 hover:text-orange-700' 
                    : 'text-green-600 hover:text-green-700'
                }`}
              >
                {service.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
            <button
              onClick={(e) => handleAction('delete', e)}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;