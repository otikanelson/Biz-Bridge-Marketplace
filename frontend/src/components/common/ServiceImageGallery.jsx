import React, { useState } from 'react';
import { getServiceImages, getServiceImage, handleImageError } from '../../utils/imageUtils';

const ServiceImageGallery = ({ service, className = "" }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageLoadStates, setImageLoadStates] = useState({});
  
  // Get all service images (with fallbacks)
  const serviceImages = getServiceImages(service);
  
  // If no images, use single placeholder
  const images = serviceImages.length > 0 ? serviceImages : [getServiceImage(service)];
  
  const handleImageLoad = (index) => {
    setImageLoadStates(prev => ({
      ...prev,
      [index]: 'loaded'
    }));
  };
  
  const handleImageErrorEvent = (e, index) => {
    setImageLoadStates(prev => ({
      ...prev,
      [index]: 'error'
    }));
    handleImageError(e, service);
  };
  
  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };
  
  const handlePrevImage = () => {
    setSelectedImageIndex(prev => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };
  
  const handleNextImage = () => {
    setSelectedImageIndex(prev => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };
  
  return (
    <div className={`${className}`}>
      {/* Main Image Display */}
      <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden mb-4">
        {/* Loading skeleton for main image */}
        {imageLoadStates[selectedImageIndex] !== 'loaded' && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
        
        <img
          src={images[selectedImageIndex]}
          alt={`${service.title} - Image ${selectedImageIndex + 1}`}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoadStates[selectedImageIndex] === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => handleImageLoad(selectedImageIndex)}
          onError={(e) => handleImageErrorEvent(e, selectedImageIndex)}
        />
        
        {/* Navigation arrows (only show if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
              aria-label="Next image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        
        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            {selectedImageIndex + 1} / {images.length}
          </div>
        )}
        
        {/* Zoom icon */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      {/* Thumbnail Navigation (only show if multiple images) */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                selectedImageIndex === index 
                  ? 'border-red-500 ring-2 ring-red-200' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${service.title} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => handleImageError(e, service)}
              />
            </button>
          ))}
        </div>
      )}
      
      {/* Image info */}
      <div className="mt-4 text-sm text-gray-600">
        {images.length === 1 ? (
          <p>Service image</p>
        ) : (
          <p>{images.length} images available</p>
        )}
      </div>
    </div>
  );
};

export default ServiceImageGallery;