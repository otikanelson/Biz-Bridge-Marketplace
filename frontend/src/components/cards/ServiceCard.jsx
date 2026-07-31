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

  const artisanName =
    service.artisan?.businessName ||
    service.artisan?.contactName ||
    service.artisan?.username ||
    'Unknown';

  const artisanLocation =
    service.artisan?.location?.city ||
    service.artisan?.location?.lga ||
    'Lagos';

  const imageUrl = getServiceImage();

  return (
    <div
      onClick={handleViewDetails}
      className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden group"
    >
      {/* ── Mobile: horizontal layout (image left, content right) ── */}
      {/* ── sm+: vertical card layout ── */}

      {/* IMAGE */}
      {/* On mobile this sits above nothing — the flex col wraps both parts */}
      <div className="flex flex-row sm:flex-col">

        {/* Thumbnail — square on mobile, full-width on sm+ */}
        <div className="relative flex-shrink-0 w-28 h-28 sm:w-full sm:h-40 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={service.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}

          {/* Fallback placeholder */}
          <div
            className="w-full h-full bg-gray-100 flex items-center justify-center"
            style={{ display: imageUrl ? 'none' : 'flex' }}
          >
            <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Rating badge — always visible */}
          {service.ratings?.average > 0 && (
            <div className="absolute bottom-1.5 right-1.5 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
              <span className="text-yellow-400 text-[10px] leading-none">⭐</span>
              <span className="text-gray-800 text-[10px] font-semibold leading-none">
                {service.ratings.average.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex flex-col justify-between flex-1 p-2.5 sm:p-3 min-w-0">

          {/* Category pill */}
          <span className="inline-block self-start bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px] font-medium truncate max-w-full mb-1">
            {service.category}
          </span>

          {/* Title */}
          <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-snug line-clamp-2 mb-1">
            {service.title}
          </h3>

          {/* Price */}
          <p className="text-red-500 font-extrabold text-sm sm:text-base mb-1.5">
            {getPriceDisplay()}
          </p>

          {/* Artisan row */}
          <div
            onClick={handleViewArtisan}
            className="flex items-center gap-1.5 mb-2"
          >
            <ProfilePicture
              imagePath={service.artisan?.profileImage}
              name={artisanName}
              size="small"
            />
            <div className="min-w-0">
              <p className="font-medium text-gray-800 text-[11px] truncate leading-tight">
                {artisanName}
              </p>
              <p className="text-gray-400 text-[10px] truncate leading-tight">
                📍 {artisanLocation}
              </p>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={(e) => { e.stopPropagation(); handleViewDetails(); }}
            className="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

// Service Listing Grid Component
const ServiceListing = ({ services }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Services</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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