// frontend/src/services/ServiceRequests.js - Frontend API calls for Service Requests
import axios from 'axios';

import { API_URL } from '../../api/config';

const API_BASE = API_URL.replace('/api', '');

// Get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Log API calls for debugging
const logApiCall = (method, url, data = null) => {
  console.log(`📡 ServiceRequests API ${method}:`, url, data ? { data } : '');
};

// ========== SERVICE REQUEST CRUD OPERATIONS ==========

// Create a new service request (enhanced for new pricing system)
export const createServiceRequest = async (requestData) => {
  logApiCall('POST', `${API_URL}/service-requests`, requestData);
  
  try {
    console.log('📝 Creating service request with NEW pricing support:', {
      serviceId: requestData.serviceId,
      selectedCategory: requestData.selectedCategory,
      hasPricingContext: !!requestData.selectedCategory
    });
    
    const response = await axios.post(`${API_URL}/service-requests`, requestData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Service request created successfully with pricing context:', {
      requestId: response.data.serviceRequest?._id,
      selectedCategory: response.data.serviceRequest?.selectedCategory,
      pricingType: response.data.serviceRequest?.service?.pricing?.type
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Error creating service request:', error.response || error);
    throw error.response?.data || { message: 'Failed to create service request' };
  }
};

// Get customer's service requests (with pricing context)
export const getMyServiceRequests = async (params = {}) => {
  logApiCall('GET', `${API_URL}/service-requests/my-requests`);
  
  try {
    const searchParams = new URLSearchParams({
      page: params.page || '1',
      limit: params.limit || '10',
      status: params.status || '',
      pricingType: params.pricingType || '' // NEW: Filter by pricing type
    });

    const response = await axios.get(`${API_URL}/service-requests/my-requests?${searchParams}`, {
      headers: getAuthHeaders()
    });

    console.log('✅ Customer service requests fetched with pricing context:', {
      total: response.data.total,
      requestsWithPricing: response.data.serviceRequests?.map(req => ({
        id: req._id,
        servicePricingType: req.service?.pricing?.type || 'legacy',
        selectedCategory: req.selectedCategory,
        hasPricingContext: !!req.pricingContext
      }))
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching service requests:', error.response || error);
    throw error.response?.data || { message: 'Failed to fetch service requests' };
  }
};

// Get artisan's incoming requests (with pricing context)
export const getServiceRequestInbox = async (params = {}) => {
  logApiCall('GET', `${API_URL}/service-requests/inbox`);
  
  try {
    const searchParams = new URLSearchParams({
      page: params.page || '1',
      limit: params.limit || '10',
      status: params.status || '',
      pricingType: params.pricingType || '' // NEW: Filter by pricing type
    });

    const response = await axios.get(`${API_URL}/service-requests/inbox?${searchParams}`, {
      headers: getAuthHeaders()
    });

    console.log('✅ Artisan service requests fetched with pricing context:', {
      total: response.data.total,
      requestsWithPricing: response.data.serviceRequests?.map(req => ({
        id: req._id,
        servicePricingType: req.service?.pricing?.type || 'legacy',
        selectedCategory: req.selectedCategory,
        needsQuote: req.service?.pricing?.type === 'negotiate'
      }))
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching service request inbox:', error.response || error);
    throw error.response?.data || { message: 'Failed to fetch service requests' };
  }
};

// Get single service request details (with enhanced pricing info)
export const getServiceRequestById = async (requestId) => {
  logApiCall('GET', `${API_URL}/service-requests/${requestId}`);
  
  try {
    const response = await axios.get(`${API_URL}/service-requests/${requestId}`, {
      headers: getAuthHeaders()
    });

    console.log('✅ Service request details fetched with pricing context:', {
      requestId: response.data.serviceRequest?._id,
      pricingType: response.data.serviceRequest?.service?.pricing?.type,
      selectedCategory: response.data.serviceRequest?.selectedCategory,
      pricingContext: !!response.data.serviceRequest?.pricingContext
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching service request details:', error.response || error);
    throw error.response?.data || { message: 'Failed to fetch service request details' };
  }
};

// ========== ARTISAN RESPONSE OPERATIONS ==========

// Send quote/response to a service request (enhanced for pricing types)
export const respondToServiceRequest = async (requestId, responseData) => {
  logApiCall('POST', `${API_URL}/service-requests/${requestId}/respond`, responseData);
  
  try {
    console.log('📝 Responding to service request with pricing awareness:', {
      requestId,
      hasQuotedPrice: !!responseData.quotedPrice,
      acceptsTerms: responseData.acceptsTerms,
      responseType: responseData.quotedPrice ? 'quote' : 'acceptance'
    });
    
    const response = await axios.post(`${API_URL}/service-requests/${requestId}/respond`, responseData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Service request response sent successfully');
    return response.data;
  } catch (error) {
    console.error('❌ Error responding to service request:', error.response || error);
    throw error.response?.data || { message: 'Failed to send response' };
  }
};

// Accept a quote/service request (customer)
export const acceptServiceRequest = async (requestId, acceptanceData = {}) => {
  logApiCall('POST', `${API_URL}/service-requests/${requestId}/accept`);
  
  try {
    console.log('📝 Accepting service request with pricing context:', {
      requestId,
      hasSchedule: !!acceptanceData.scheduledDate
    });
    
    const response = await axios.post(`${API_URL}/service-requests/${requestId}/accept`, acceptanceData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Service request accepted - booking created');
    return response.data;
  } catch (error) {
    console.error('❌ Error accepting service request:', error.response || error);
    throw error.response?.data || { message: 'Failed to accept request' };
  }
};

// Decline a service request
export const declineServiceRequest = async (requestId, reason = '') => {
  logApiCall('POST', `${API_URL}/service-requests/${requestId}/decline`);
  
  try {
    const response = await axios.post(`${API_URL}/service-requests/${requestId}/decline`, { reason }, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Service request declined');
    return response.data;
  } catch (error) {
    console.error('❌ Error declining service request:', error.response || error);
    throw error.response?.data || { message: 'Failed to decline request' };
  }
};

// ========== BOOKING CONVERSION OPERATIONS ==========

// Convert accepted request to booking (customer action)
export const convertRequestToBooking = async (requestId, bookingData) => {
  logApiCall('POST', `${API_URL}/service-requests/${requestId}/convert-to-booking`);
  
  try {
    console.log('📝 Converting service request to booking (NO PAYMENT):', {
      requestId,
      scheduledDate: bookingData.scheduledDate,
      hasAgreedTerms: !!bookingData.agreementAccepted
    });
    
    const response = await axios.post(`${API_URL}/service-requests/${requestId}/convert-to-booking`, bookingData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Booking created from service request (payment-free flow)');
    return response.data;
  } catch (error) {
    console.error('❌ Error converting to booking:', error.response || error);
    throw error.response?.data || { message: 'Failed to create booking' };
  }
};

// ========== UTILITY FUNCTIONS ==========

// Format pricing display for service requests
export const formatRequestPricingDisplay = (serviceRequest) => {
  if (!serviceRequest.service?.pricing) {
    return 'Contact for pricing';
  }

  const { service, selectedCategory, pricingContext } = serviceRequest;

  // Use pricing context if available (from backend processing)
  if (pricingContext) {
    return pricingContext.displayPrice;
  }

  // Fallback to manual calculation
  switch (service.pricing.type) {
    case 'fixed':
      return `₦${Number(service.pricing.basePrice).toLocaleString()}`;
    case 'negotiate':
      return serviceRequest.artisanResponse?.quotedPrice 
        ? `₦${Number(serviceRequest.artisanResponse.quotedPrice).toLocaleString()} (quoted)`
        : 'Quote pending';
    case 'categorized':
      if (selectedCategory) {
        const category = service.pricing.categories.find(cat => cat.name === selectedCategory);
        return category ? `₦${Number(category.price).toLocaleString()} (${category.name})` : 'Category not found';
      }
      return 'Category not selected';
    default:
      return 'Contact for pricing';
  }
};

// Get request status display with pricing awareness
export const getRequestStatusDisplay = (serviceRequest) => {
  const baseStatus = serviceRequest.status;
  const pricingType = serviceRequest.service?.pricing?.type;

  const statusDisplays = {
    'pending': {
      text: 'Pending Review',
      color: 'yellow',
      description: 'Waiting for artisan to respond'
    },
    'viewed': {
      text: 'Under Review', 
      color: 'blue',
      description: 'Artisan is reviewing your request'
    },
    'quoted': {
      text: pricingType === 'negotiate' ? 'Quote Received' : 'Response Received',
      color: 'green',
      description: pricingType === 'negotiate' ? 'Review the quote and accept/negotiate' : 'Artisan has responded'
    },
    'accepted': {
      text: 'Accepted',
      color: 'green', 
      description: 'Ready to convert to booking'
    },
    'declined': {
      text: 'Declined',
      color: 'red',
      description: 'Artisan declined this request'
    },
    'converted': {
      text: 'Booking Created',
      color: 'purple',
      description: 'Successfully converted to active booking'
    }
  };

  return statusDisplays[baseStatus] || {
    text: baseStatus,
    color: 'gray',
    description: ''
  };
};

// Check if request needs customer action
export const needsCustomerAction = (serviceRequest) => {
  return ['quoted', 'accepted'].includes(serviceRequest.status) && !serviceRequest.booking;
};

// Check if request needs artisan action  
export const needsArtisanAction = (serviceRequest) => {
  return ['pending', 'viewed'].includes(serviceRequest.status);
};

export default {
  createServiceRequest,
  getMyServiceRequests,
  getServiceRequestInbox,
  getServiceRequestById,
  respondToServiceRequest,
  acceptServiceRequest,
  declineServiceRequest,
  convertRequestToBooking,
  formatRequestPricingDisplay,
  getRequestStatusDisplay,
  needsCustomerAction,
  needsArtisanAction
};