// src/components/forms/ServiceRequestForm.jsx - Day 7: Updated for New Pricing System
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// API function for creating service requests (assuming this exists in your services)
const createServiceRequest = async (requestData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/service-requests', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create service request');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Error creating service request:', error);
    throw error;
  }
};

const ServiceRequestForm = ({ service, artisan, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    customerMessage: '',
    specialRequirements: '',
    selectedCategory: '', // NEW: For categorized pricing
    contactPreference: 'phone',
    urgency: 'medium',
    budget: {
      min: '',
      max: '',
      currency: 'NGN'
    },
    timeline: {
      preferredStartDate: '',
      isFlexible: true
    },
    location: {
      meetingLocation: '',
      isRemote: false
    }
  });

  // Initialize selected category for categorized services
  useEffect(() => {
    if (service?.pricing?.type === 'categorized' && service.pricing.categories?.length > 0) {
      // Don't auto-select, let user choose
      setFormData(prev => ({ ...prev, selectedCategory: '' }));
    }
  }, [service]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Get pricing display for the service
  const getPricingDisplay = () => {
    if (!service?.pricing) return 'Contact for pricing';
    
    switch (service.pricing.type) {
      case 'fixed':
        return service.pricing.basePrice 
          ? `₦${Number(service.pricing.basePrice).toLocaleString()} - ${service.pricing.baseDuration}`
          : 'Contact for pricing';
      case 'negotiate':
        return 'Price will be negotiated based on your requirements';
      case 'categorized':
        if (formData.selectedCategory) {
          const category = service.pricing.categories.find(cat => cat.name === formData.selectedCategory);
          return category 
            ? `₦${Number(category.price).toLocaleString()} - ${category.duration}`
            : 'Select a category';
        }
        return 'Select a service category';
      default:
        return 'Contact for pricing';
    }
  };

  // Get selected category details
  const getSelectedCategoryDetails = () => {
    if (service?.pricing?.type === 'categorized' && formData.selectedCategory) {
      return service.pricing.categories.find(cat => cat.name === formData.selectedCategory);
    }
    return null;
  };

  // Check if categorized pricing is supported
  const supportsCategorizedPricing = (category) => {
    const allowedCategories = ['Woodworking', 'Metalwork', 'Textile Art'];
    return allowedCategories.includes(category);
  };

  // Get platform responsibility level
  const getPlatformResponsibility = () => {
    if (!service?.pricing) return 'Platform facilitates connection only';
    
    switch (service.pricing.type) {
      case 'fixed':
        return 'Platform will help mediate disputes based on agreed terms';
      case 'negotiate':
        return 'Platform facilitates communication only - all negotiations between you and artisan';
      case 'categorized':
        return 'Platform provides enhanced dispute resolution and price protection for this service';
      default:
        return 'Platform facilitates connection only';
    }
  };

  // Validate form
  const validateForm = () => {
    if (!formData.customerMessage.trim()) {
      setError('Please describe what you need');
      return false;
    }

    if (service?.pricing?.type === 'categorized' && !formData.selectedCategory) {
      setError('Please select a service category');
      return false;
    }

    if (!formData.timeline.preferredStartDate) {
      setError('Please provide your preferred start date');
      return false;
    }

    // Ensure minimum budget is provided (backend requirement)
    if (!formData.budget.min || Number(formData.budget.min) <= 0) {
      setError('Please provide a minimum budget amount');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Prepare request data to match backend expectations
      const requestData = {
        // Required fields that backend expects
        artisanId: artisan._id,
        serviceId: service._id,
        title: `${service.title} Request`,
        description: formData.customerMessage,
        category: service.category,
        
        // Budget information (backend expects budget.min)
        budget: {
          min: formData.budget.min ? Number(formData.budget.min) : 1000, // Default minimum if not provided
          max: formData.budget.max ? Number(formData.budget.max) : null,
          currency: 'NGN'
        },
        
        // Timeline (backend expects timeline.preferredStartDate)
        timeline: {
          preferredStartDate: formData.timeline.preferredStartDate,
          preferredEndDate: null, // Can be added later if needed
          flexibility: formData.timeline.isFlexible ? 'flexible' : 'fixed'
        },
        
        // Location (backend expects location.lga)
        location: {
          lga: formData.location.meetingLocation || 'Lagos', // Default to Lagos if not specified
          address: formData.location.meetingLocation,
          isRemote: formData.location.isRemote
        },
        
        // Additional fields for enhanced functionality
        selectedCategory: formData.selectedCategory || null,
        requirements: formData.specialRequirements,
        priority: formData.urgency,
        source: 'web'
      };

      console.log('📝 Sending service request with backend-compatible format:', requestData);

      // Send request to backend
      const response = await createServiceRequest(requestData);

      console.log('✅ Service request created successfully:', response);

      // Success - call success callback and close form
      if (onSuccess) {
        onSuccess(response.serviceRequest);
      }
      
      onClose();
      
      // Navigate to customer dashboard with success message
      navigate('/dashboard', { 
        state: { message: 'Service request sent successfully! The artisan will respond soon.' }
      });
      
    } catch (error) {
      console.error('❌ Error creating service request:', error);
      setError(error.message || 'Failed to send request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get service image URL
  const getServiceImageUrl = (imagePath) => {
    if (!imagePath) return '/api/placeholder/80/80';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3000${imagePath}`;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white my-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Request Service</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Service Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-4">
            <img
              src={getServiceImageUrl(service?.images?.[0] || service?.image)}
              alt={service?.title}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{service?.title}</h3>
              <p className="text-sm text-gray-600 mb-2">by {artisan?.businessName || artisan?.contactName}</p>
              <div className="text-sm">
                <span className="font-medium text-gray-700">Pricing: </span>
                <span className="text-red-600 font-medium">{getPricingDisplay()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* NO PAYMENT WARNING */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="text-yellow-600">
              <svg className="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
              <div className="text-sm text-yellow-700 mt-1">
                <strong>BizBridge does not process payments.</strong> All payment arrangements and negotiations are made directly between you and the artisan. {getPlatformResponsibility()}
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Category Selection for Categorized Pricing */}
          {service?.pricing?.type === 'categorized' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Service Category *
              </label>
              <select
                name="selectedCategory"
                value={formData.selectedCategory}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              >
                <option value="">-- Choose a category --</option>
                {service.pricing.categories?.map((category, index) => (
                  <option key={index} value={category.name}>
                    {category.name} - ₦{Number(category.price).toLocaleString()} ({category.duration})
                  </option>
                ))}
              </select>
              
              {/* Category Benefits Notice */}
              {supportsCategorizedPricing(service.category) && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="text-blue-500 mr-2">⭐</div>
                    <div className="text-sm text-blue-800">
                      <strong>Enhanced Protection:</strong> Categorized pricing includes special dispute resolution support from BizBridge. 
                      Your selected category price is fixed and protected.
                    </div>
                  </div>
                </div>
              )}

              {/* Selected Category Details */}
              {getSelectedCategoryDetails() && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-1">{getSelectedCategoryDetails().name}</h4>
                  <p className="text-sm text-green-700">
                    <strong>Price:</strong> ₦{Number(getSelectedCategoryDetails().price).toLocaleString()} | 
                    <strong> Duration:</strong> {getSelectedCategoryDetails().duration}
                  </p>
                  {getSelectedCategoryDetails().description && (
                    <p className="text-sm text-green-600 mt-1">{getSelectedCategoryDetails().description}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Service Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe what you need *
            </label>
            <textarea
              name="customerMessage"
              value={formData.customerMessage}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Please provide detailed information about your requirements..."
              required
            />
          </div>

          {/* Budget Range (Required for backend) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Range * (Required for request processing)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="budget.min"
                  value={formData.budget.min}
                  onChange={handleInputChange}
                  placeholder="Min (₦) *"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                  min="1000"
                />
                <input
                  type="number"
                  name="budget.max"
                  value={formData.budget.max}
                  onChange={handleInputChange}
                  placeholder="Max (₦)"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  min={formData.budget.min || "1000"}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Minimum budget helps artisans understand if they can meet your needs. This is for reference only - final pricing is negotiated directly.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Start Date *
              </label>
              <input
                type="date"
                name="timeline.preferredStartDate"
                value={formData.timeline.preferredStartDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
          </div>

          {/* Timeline Flexibility */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="timeline.isFlexible"
                checked={formData.timeline.isFlexible}
                onChange={handleInputChange}
                className="text-red-500 focus:ring-red-500"
              />
              <span className="ml-2 text-sm text-gray-700">My timeline is flexible</span>
            </label>
          </div>

          {/* Meeting Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Meeting Location
            </label>
            <input
              type="text"
              name="location.meetingLocation"
              value={formData.location.meetingLocation}
              onChange={handleInputChange}
              placeholder="e.g., My home in Ikeja, Your workshop, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Special Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Requirements or Notes
            </label>
            <textarea
              name="specialRequirements"
              value={formData.specialRequirements}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Any specific materials, techniques, or other requirements..."
            />
          </div>

          {/* Contact Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How would you like the artisan to contact you?
            </label>
            <select
              name="contactPreference"
              value={formData.contactPreference}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="phone">Phone call</option>
              <option value="sms">SMS/Text</option>
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="any">Any method is fine</option>
            </select>
          </div>

          {/* Urgency Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How urgent is this request?
            </label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="low">Not urgent - within a few weeks</option>
              <option value="medium">Moderately urgent - within a week</option>
              <option value="high">Very urgent - within a few days</option>
            </select>
          </div>

          {/* Contract Preview Section */}
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">What happens next?</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p>1. The artisan will review your request and respond within 24-48 hours</p>
              <p>2. You'll discuss details and finalize terms directly with the artisan</p>
              <p>3. Once both parties agree, a simple contract will be generated</p>
              <p>4. You'll meet in person to complete the service and payment</p>
              <p>5. You can mark the service as complete when finished</p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-lg transition ${
                isSubmitting
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              {isSubmitting ? 'Sending Request...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceRequestForm;