// File: src/components/cards/ServiceCard.jsx
// FIXED VERSION with proper navigation and ID handling

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getServiceImage, handleImageError } from '../../utils/imageUtils';

/**
 * ServiceCard component for displaying service information in a card format
 * Used in search results, service listings, and dashboard
 */
const ServiceCard = ({ 
  service, 
  showControls = false, 
  onEdit, 
  onDelete, 
  onToggleActive,
  onClick 
}) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Get the service image with proper fallback logic
  const serviceImageUrl = getServiceImage(service);

  // ✅ FIXED: Standardized service ID getter with better error handling
  const getServiceId = (service) => {
    // Try different ID properties in order of preference
    const id = service?._id || service?.id;
    
    if (!id) {
      console.error('❌ ServiceCard: No valid ID found for service:', service);
      return null;
    }
    
    // Convert ObjectId to string if needed
    return typeof id === 'object' ? id.toString() : id;
  };

  // ✅ FIXED: Enhanced card click handler with better error handling
  const handleCardClick = (e) => {
    // Prevent navigation if clicking on control buttons
    if (e.target.closest('.service-controls')) {
      return;
    }
    
    // Prevent navigation if clicking on buttons or interactive elements
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    
    try {
      // If custom onClick is provided, use it
      if (onClick && typeof onClick === 'function') {
        onClick(service);
        return;
      }
      
      // Default behavior: Navigate to service detail page
      const serviceId = getServiceId(service);
      if (serviceId) {
        console.log('🔍 ServiceCard: Navigating to service:', serviceId);
        navigate(`/services/${serviceId}`);
      } else {
        console.error('❌ ServiceCard: Cannot navigate - no valid service ID');
        // Optional: Show user-friendly error
        alert('Sorry, cannot view this service right now. Please try again.');
      }
    } catch (error) {
      console.error('❌ ServiceCard: Navigation error:', error);
      // Optional: Show user-friendly error
      alert('Sorry, there was an error opening this service. Please try again.');
    }
  };

  // Handle image load success
  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  // Handle image load error
  const handleImageErrorEvent = (e) => {
    setImageError(true);
    handleImageError(e, service);
  };

  // ✅ FIXED: Enhanced edit handler with proper ID handling
  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit && typeof onEdit === 'function') {
      onEdit(service);
    } else {
      // Default edit behavior - navigate to edit page
      const serviceId = getServiceId(service);
      if (serviceId) {
        navigate(`/services/edit/${serviceId}`);
      }
    }
  };

  // ✅ FIXED: Enhanced delete handler with proper confirmation
  const handleDelete = (e) => {
    e.stopPropagation();
    
    const serviceTitle = service?.title || 'this service';
    const confirmed = window.confirm(
      `Are you sure you want to delete "${serviceTitle}"?\n\nThis action cannot be undone.`
    );
    
    if (confirmed && onDelete && typeof onDelete === 'function') {
      onDelete(service);
    }
  };

  // ✅ FIXED: Enhanced toggle active handler
  const handleToggleActive = (e) => {
    e.stopPropagation();
    
    if (onToggleActive && typeof onToggleActive === 'function') {
      onToggleActive(service);
    }
  };

  // ✅ ADDED: Validate service object
  if (!service) {
    console.error('❌ ServiceCard: No service data provided');
    return (
      <div className="bg-gray-100 border rounded-lg p-4 text-center text-gray-500">
        <p>Service data not available</p>
      </div>
    );
  }

  return (
    <div 
      className={`bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:scale-105 ${
        !service.isActive ? 'opacity-70' : ''
      }`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick(e);
        }
      }}
    >
      {/* Service Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {/* Loading skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
        
        <img 
          src={serviceImageUrl}
          alt={service.title || 'Service image'} 
          className={`w-full h-full object-cover transition-all duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageErrorEvent}
        />
        
        {/* Status Badge */}
        {showControls && (
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
            service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {service.isActive ? 'Active' : 'Inactive'}
          </div>
        )}

        {/* ✅ IMPROVED: Better hover overlay */}
        {!showControls && (
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
            <div className="bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-full font-medium text-sm">
              View Details
            </div>
          </div>
        )}
      </div>
      
      {/* Service Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 hover:text-red-500 transition-colors">
          {service.title || 'Untitled Service'}
        </h3>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
            {service.category || 'Uncategorized'}
          </span>
          <span className="text-sm text-gray-600">
            {service.locations && service.locations.length > 0 
              ? service.locations[0].name 
              : service.location || 'Location TBD'}
          </span>
        </div>
        
        <p className="text-sm text-gray-700 mb-4 line-clamp-2 leading-relaxed">
          {service.description || 'No description available'}
        </p>
        
        {/* Price and Duration */}
        <div className="flex justify-between items-center text-sm">
          <div className="text-gray-600">
            {service.duration && (
              <>
                <span className="font-medium">Duration: </span>
                {service.duration}
              </>
            )}
          </div>
          <div className="font-bold text-red-500 text-lg">
            {service.price || 'Price varies'}
          </div>
        </div>
        
        {/* Tags */}
        {service.tags && service.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {service.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
            {service.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{service.tags.length - 3} more
              </span>
            )}
          </div>
        )}
        
        {/* ✅ FIXED: Control Buttons with better styling and handlers */}
        {showControls && (
          <div className="service-controls mt-4 pt-3 border-t flex justify-between gap-2">
            <button
              onClick={handleEdit}
              className="flex-1 bg-blue-500 text-white py-2 px-3 rounded text-sm font-medium hover:bg-blue-600 transition-colors"
              type="button"
            >
              Edit
            </button>
            
            <button
              onClick={handleToggleActive}
              className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                service.isActive 
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
              type="button"
            >
              {service.isActive ? 'Deactivate' : 'Activate'}
            </button>
            
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-500 text-white py-2 px-3 rounded text-sm font-medium hover:bg-red-600 transition-colors"
              type="button"
            >
              Delete
            </button>
          </div>
        )}

        {/* ✅ IMPROVED: Click hint for non-control mode */}
        {!showControls && (
          <div className="mt-3 pt-3 border-t text-center">
            <span className="text-xs text-gray-500 hover:text-red-500 transition-colors">
              Click to view details →
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;