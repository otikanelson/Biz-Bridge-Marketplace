// Updated Service Card Component with Fixed Profile Pictures
import React from 'react';

// Profile Picture Utility Component
const ProfilePicture = ({ 
  imagePath, 
  name = 'User', 
  size = 'medium', 
  className = '',
  onClick = null 
}) => {
  // Get API base URL
  const getApiBaseUrl = () => {
    return process.env.NODE_ENV === 'production' 
      ? process.env.REACT_APP_API_URL || 'https://your-api-domain.com'
      : 'http://localhost:3000';
  };

  // Get proper image URL
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

  // Generate consistent color based on name
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
    small: 'w-8 h-8 text-xs',
    medium: 'w-10 h-10 text-sm', 
    large: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl'
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
      className={`${sizeClasses[size]} rounded-full overflow-hidden relative ${className} ${onClick ? 'cursor-pointer' : ''}`}
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
          {/* Fallback placeholder */}
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

// Updated Service Card Component
const ServiceCard = ({ service, navigate, currentUser }) => {
  // Navigation helper
  const navigateToArtisanProfile = (artisanId) => {
    if (currentUser && artisanId === currentUser._id) {
      navigate('/profile');
    } else {
      navigate(`/profile/${artisanId}`);
    }
  };

  const handleServiceView = () => {
    navigate(`/services/${service._id}`);
  };

  const handleRequestService = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    navigate(`/services/${service._id}/request`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
      {/* Service Image */}
      <div className="relative">
        {service.images && service.images.length > 0 ? (
          <img 
            src={(() => {
              const imagePath = service.images[0];
              if (imagePath.startsWith('http')) {
                return imagePath;
              } else if (imagePath.startsWith('/uploads')) {
                return `http://localhost:3000${imagePath}`;
              } else if (imagePath.startsWith('uploads/')) {
                return `http://localhost:3000/${imagePath}`;
              } else {
                return `http://localhost:3000/uploads/${imagePath}`;
              }
            })()} 
            alt={service.title}
            className="w-full h-48 object-cover rounded-t-lg"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Fallback for service image */}
        <div 
          className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center"
          style={{ display: (service.images && service.images.length > 0) ? 'none' : 'flex' }}
        >
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium">
            {service.category}
          </span>
        </div>
      </div>

      {/* Service Content */}
      <div className="p-4">
        {/* Service Title & Description */}
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
          {service.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {service.description}
        </p>

        {/* Pricing Display */}
        <div className="mb-4">
          <span className="text-red-600 font-bold text-lg">
            {service.pricing?.type === 'fixed' && service.pricing?.amount 
              ? `₦${service.pricing.amount.toLocaleString()}`
              : service.pricing?.type === 'negotiate' 
              ? 'Contact for Price'
              : 'Categorized Pricing'
            }
          </span>
          {service.pricing?.type === 'categorized' && (
            <p className="text-xs text-gray-500 mt-1">
              Prices vary by project scope
            </p>
          )}
        </div>

        {/* Artisan Info - FIXED PROFILE PICTURE */}
        <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
          {/* Fixed Profile Picture */}
          <ProfilePicture
            imagePath={service.artisan?.profileImage}
            name={service.artisan?.name || service.artisan?.username || 'Artisan'}
            size="medium"
            className="mr-3 flex-shrink-0"
          />
          
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm truncate">
              {service.artisan?.name || service.artisan?.username || 'Unknown Artisan'}
            </p>
            <p className="text-gray-500 text-xs">
              📍 {service.artisan?.location?.lga || 'Lagos'}
            </p>
            {service.artisan?.rating && (
              <div className="flex items-center mt-1">
                <span className="text-yellow-400 text-xs mr-1">⭐</span>
                <span className="text-gray-600 text-xs">
                  {service.artisan.rating}/5.0
                </span>
              </div>
            )}
          </div>

          {/* View Artisan Profile Button */}
          <button
            onClick={() => navigateToArtisanProfile(service.artisan?._id)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-xs font-medium transition ml-2"
            title="View Artisan Profile"
          >
            View Profile
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleServiceView}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition"
          >
            View Details
          </button>
          <button
            onClick={handleRequestService}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition"
          >
            Request Service
          </button>
        </div>

        {/* Payment Warning */}
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <div className="flex items-center">
            <svg className="w-3 h-3 text-yellow-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-yellow-700">
              Payment handled directly with artisan
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Service Listing Grid Component
const ServiceListing = ({ services, navigate, currentUser }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Services</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <ServiceCard 
            key={service._id} 
            service={service} 
            navigate={navigate}
            currentUser={currentUser}
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

// Example of how to use ProfilePicture in other components
const ProfilePictureExamples = () => {
  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Picture Examples</h2>
      
      {/* Different sizes */}
      <div className="flex items-center space-x-4">
        <ProfilePicture name="John Doe" size="small" />
        <ProfilePicture name="Jane Smith" size="medium" />
        <ProfilePicture name="Bob Wilson" size="large" />
        <ProfilePicture name="Alice Johnson" size="xl" />
      </div>

      {/* With actual images (will fallback to placeholder if image fails) */}
      <div className="flex items-center space-x-4">
        <ProfilePicture 
          imagePath="/uploads/profile1.jpg" 
          name="John Doe" 
          size="medium"
        />
        <ProfilePicture 
          imagePath="https://example.com/invalid-image.jpg" 
          name="Jane Smith" 
          size="medium"
        />
        <ProfilePicture 
          imagePath="" 
          name="No Image User" 
          size="medium"
        />
      </div>

      {/* Clickable profile pictures */}
      <div className="flex items-center space-x-4">
        <ProfilePicture 
          name="Clickable User" 
          size="large"
          onClick={() => alert('Profile clicked!')}
          className="border-2 border-red-500"
        />
      </div>
    </div>
  );
};

export default ServiceCard;
export { ServiceListing, ProfilePicture, ProfilePictureExamples };