import React, { useState } from 'react';
import { getUserProfileImage, handleImageError } from '../../utils/imageUtils';

const FeaturedArtisanCard = ({ artisan, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const profileImageUrl = getUserProfileImage(artisan);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageErrorEvent = (e) => {
    setImageError(true);
    handleImageError(e);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(artisan);
    }
  };

  return (
    <div 
      className="border-4 border-red-400 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow bg-white"
      onClick={handleCardClick}
    >
      <div className="relative">
        {/* Loading skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center h-48">
            <div className="text-gray-400">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
        
        <img 
          src={profileImageUrl}
          alt={artisan.businessName || artisan.contactName} 
          className={`w-full h-48 object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageErrorEvent}
        />
        
        {/* Featured Badge */}
        <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          ⭐ FEATURED
        </div>
        
        {/* Verification Badge */}
        {artisan.isCACRegistered && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            ✓ VERIFIED
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-1">
          {artisan.businessName || artisan.contactName}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-1">
          {artisan.contactName || artisan.name}
        </p>
        
        {/* Description if available */}
        {artisan.description && (
          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
            {artisan.description}
          </p>
        )}
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-700 line-clamp-1">
            {artisan.localGovernmentArea ? 
              `${artisan.localGovernmentArea}, ${artisan.city}` : 
              artisan.location}
          </span>
          
          {artisan.rating ? (
            <div className="flex items-center">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-1 text-sm font-medium">{artisan.rating}</span>
            </div>
          ) : artisan.yearEstablished ? (
            <span className="text-gray-500 text-xs">Est. {artisan.yearEstablished}</span>
          ) : null}
        </div>
        
        {/* Price if available */}
        {artisan.price && (
          <div className="mt-2 text-sm font-semibold text-red-500">
            {artisan.price}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedArtisanCard;