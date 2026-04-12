// Updated Service Card Component with Fixed Profile Pictures
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../api/config';

// Profile Picture Utility Component
const ProfilePicture = ({ 
  imagePath, 
  name = 'User', 
  size = 'small', 
  className = '',
  onClick = null 
}) => {
  const getApiBaseUrl = () => API_URL.replace('/api', '');

  const getImageUrl = (path) => {
    if (!path) return null;
    
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    } else if (path.startsWith('/uploads/')) {
      return `${getApiBaseUrl()}${path}`;
    } else if (path.startsWith('uploads/')) {
      return `${getApiBaseUrl()}/${path}`;
    } else {
      return `${getApiBaseUrl()}/uploads/${path}`;
    }
  };

  const getPlaceholderColor = (userName) => {
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

    const hash = userName.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);

    return colors[hash % colors.length];
  };

  const sizeClasses = {
    small: 'w-6 h-6 text-xs',
    medium: 'w-8 h-8 text-sm', 
    large: 'w-12 h-12 text-base'
  };

  const imageUrl = getImageUrl(imagePath);
  const colorConfig = getPlaceholderColor(name);
  const initial = name.charAt(0).toUpperCase();

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  return (
    <div 
      className={`${sizeClasses[size]} rounded-full overflow-hidden relative flex-shrink-0 ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {imageUrl ? (
        <>
          <img 
            src={imageUrl}
            alt={`${name}'s profile`}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
          <div 
            className={`w-full h-full ${colorConfig.bg} ${colorConfig.text} flex items-center justify-center font-bold absolute top-0 left-0`}
            style={{ display: 'none' }}
          >
            {initial}
          </div>
        </>
      ) : (
        <div className={`w-full h-full ${colorConfig.bg} ${colorConfig.text} flex items-center justify-center font-bold`}>
          {initial}
        </div>
      )}
    </div>
  );
};

// Compact Service Card Component
const ServiceCard = ({ service, showControls = false }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/services/${service._id}`);
  };

  const handleViewArtisan = (e) => {
    e.stopPropagation();
    navigate(`/profile/${service.artisan?._id}`);
  };

  const getServiceImage = () => {
    if (!service.images || service.images.length === 0) return null;
    
    const imagePath = service.images[0];
    const BASE = API_URL.replace('/api', '');
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    } else if (imagePath.startsWith('/uploads')) {
      return `${BASE}${imagePath}`;
    } else if (imagePath.startsWith('uploads/')) {
      return `${BASE}/${imagePath}`;
    } else {
      return `${BASE}/uploads/${imagePath}`;
    }
  };

  const getPriceDisplay = () => {
    if (service.pricing?.type === 'fixed' && service.pricing?.basePrice) {
      return `₦${service.pricing.basePrice.toLocaleString()}`;
    } else if (service.pricing?.type === 'negotiate') {
      return 'Negotiate';
    } else if (service.pricing?.type === 'categorized') {
      return 'Varies';
    }
    return 'Contact';
  };

  return (
    <div 
      onClick={handleViewDetails}
      className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden group"
    >
      {/* Compact Image */}
      <div className="relative h-32 overflow-hidden">
        {getServiceImage() ? (
          <img 
            src={getServiceImage()} 
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        <div 
          className="w-full h-full bg-gray-200 flex items-center justify-center"
          style={{ display: getServiceImage() ? 'none' : 'flex' }}
        >
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-black bg-opacity-70 text-white px-2 py-0.5 rounded text-xs font-medium">
            {service.category}
          </span>
        </div>

        {/* Rating Badge */}
        {service.ratings?.average > 0 && (
          <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-1.5 py-0.5 rounded flex items-center">
            <span className="text-yellow-400 text-xs mr-0.5">⭐</span>
            <span className="text-gray-800 text-xs font-medium">{service.ratings.average.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Compact Content */}
      <div className="p-3">
        {/* Title */}
        <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">
          {service.title}
        </h3>

        {/* Price */}
        <div className="mb-2">
          <span className="text-red-600 font-bold text-base">
            {getPriceDisplay()}
          </span>
        </div>

        {/* Artisan Info - Compact */}
        <div 
          onClick={handleViewArtisan}
          className="flex items-center gap-2 p-2 bg-gray-50 rounded hover:bg-gray-100 transition mb-2"
        >
          <ProfilePicture
            imagePath={service.artisan?.profileImage}
            name={service.artisan?.contactName || service.artisan?.businessName || service.artisan?.username || 'Artisan'}
            size="small"
          />
          
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 text-xs truncate">
              {service.artisan?.businessName || service.artisan?.contactName || service.artisan?.username || 'Unknown'}
            </p>
            <p className="text-gray-500 text-xs truncate">
              📍 {service.artisan?.location?.city || service.artisan?.location?.lga || 'Lagos'}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleViewDetails}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-1.5 rounded text-xs font-bold transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

// Service Listing Grid Component
const ServiceListing = ({ services }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Services</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {services.map(service => (
          <ServiceCard 
            key={service._id} 
            service={service}
          />
        ))}
      </div>
      
      {services.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.885-4.29-4.209 0-.747.161-1.458.448-2.078l1.257-2.96a.5.5 0 01.92 0l1.257 2.96A3.97 3.97 0 0112 10.791z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Services Found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or browse all categories.</p>
        </div>
      )}
    </div>
  );
};

export default ServiceCard;
export { ServiceListing, ProfilePicture };