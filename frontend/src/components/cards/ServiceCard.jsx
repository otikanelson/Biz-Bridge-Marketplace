import React from 'react';
import { useNavigate } from 'react-router-dom';

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

  // Handle service card click
  const handleCardClick = (e) => {
    // If the click is on a control button, don't navigate
    if (e.target.closest('.service-controls')) {
      return;
    }
    
    // If onClick prop is provided, use it (for custom behavior)
    if (onClick) {
      onClick(service);
    } else {
      // ✅ DEFAULT BEHAVIOR: Navigate to service view page
      const serviceId = service.id || service._id;
      if (serviceId) {
        navigate(`/services/${serviceId}`);
      } else {
        console.error('Service ID not found:', service);
      }
    }
  };

  return (
    <div 
      className={`bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer ${!service.isActive ? 'opacity-70' : ''}`}
      onClick={handleCardClick}
    >
      {/* Service Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={service.serviceImage || service.images?.[0] || ''}
          alt={service.title} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
        
        {/* Status Badge */}
        {showControls && (
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
            service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {service.isActive ? 'Active' : 'Inactive'}
          </div>
        )}

        {/* View Details Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
          <span className="text-white font-semibold bg-red-500 px-4 py-2 rounded-full">
            View Details
          </span>
        </div>
      </div>
      
      {/* Service Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 hover:text-red-500 transition-colors">
          {service.title}
        </h3>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
            {service.category}
          </span>
          <span className="text-sm text-gray-600">
            {service.locations && service.locations.length > 0 
              ? service.locations[0].name 
              : service.location || 'Location TBD'}
          </span>
        </div>
        
        <p className="text-sm text-gray-700 mb-4 line-clamp-2 leading-relaxed">
          {service.description}
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
        
        {/* Control Buttons - Only shown when showControls is true */}
        {showControls && (
          <div className="service-controls mt-4 pt-3 border-t flex justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit && onEdit(service);
              }}
              className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              Edit
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleActive && onToggleActive(service);
              }}
              className="text-amber-500 hover:text-amber-700 text-sm font-medium transition-colors"
            >
              {service.isActive ? 'Deactivate' : 'Activate'}
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Are you sure you want to delete "${service.title}"?`)) {
                  onDelete && onDelete(service);
                }
              }}
              className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        )}

        {/* Click to View Hint */}
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