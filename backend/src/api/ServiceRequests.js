// backend/src/api/ServiceRequests.js
const API_URL = 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Create a new service request
export const createServiceRequest = async (requestData) => {
  try {
    console.log('📝 Creating service request:', requestData);
    
    const response = await fetch(`${API_URL}/service-requests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create service request');
    }

    console.log('✅ Service request created successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Error creating service request:', error);
    throw error;
  }
};

// Get customer's service requests
export const getMyServiceRequests = async (params = {}) => {
  try {
    const searchParams = new URLSearchParams({
      page: params.page || '1',
      limit: params.limit || '10',
      status: params.status || ''
    });

    const response = await fetch(`${API_URL}/service-requests/my-requests?${searchParams}`, {
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch service requests');
    }

    return data;
  } catch (error) {
    console.error('❌ Error fetching service requests:', error);
    throw error;
  }
};

// Get artisan's incoming requests
export const getServiceRequestInbox = async (params = {}) => {
  try {
    const searchParams = new URLSearchParams({
      page: params.page || '1',
      limit: params.limit || '10',
      status: params.status || ''
    });

    const response = await fetch(`${API_URL}/service-requests/inbox?${searchParams}`, {
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch service requests');
    }

    return data;
  } catch (error) {
    console.error('❌ Error fetching service request inbox:', error);
    throw error;
  }
};

// Get single service request details
export const getServiceRequestById = async (requestId) => {
  try {
    const response = await fetch(`${API_URL}/service-requests/${requestId}`, {
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch service request details');
    }

    return data;
  } catch (error) {
    console.error('❌ Error fetching service request details:', error);
    throw error;
  }
};

// Accept a quote
export const acceptQuote = async (requestId) => {
  try {
    const response = await fetch(`${API_URL}/service-requests/${requestId}/accept`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to accept quote');
    }

    return data;
  } catch (error) {
    console.error('❌ Error accepting quote:', error);
    throw error;
  }
};

// Submit a quote (artisan)
export const submitQuote = async (requestId, quoteData) => {
  try {
    const response = await fetch(`${API_URL}/service-requests/${requestId}/quote`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(quoteData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit quote');
    }

    return data;
  } catch (error) {
    console.error('❌ Error submitting quote:', error);
    throw error;
  }
};

// Decline a request (artisan)
export const declineServiceRequest = async (requestId, reason) => {
  try {
    const response = await fetch(`${API_URL}/service-requests/${requestId}/decline`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to decline request');
    }

    return data;
  } catch (error) {
    console.error('❌ Error declining request:', error);
    throw error;
  }
};