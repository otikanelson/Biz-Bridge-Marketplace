// backend/src/api/Bookings.js
const API_URL = 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Create a direct booking
export const createDirectBooking = async (bookingData) => {
  try {
    console.log('📅 Creating direct booking:', bookingData);
    
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create booking');
    }

    console.log('✅ Direct booking created successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Error creating direct booking:', error);
    throw error;
  }
};

// Get customer's bookings
export const getMyBookings = async (params = {}) => {
  try {
    const searchParams = new URLSearchParams({
      page: params.page || '1',
      limit: params.limit || '10',
      status: params.status || ''
    });

    const response = await fetch(`${API_URL}/bookings/my-bookings?${searchParams}`, {
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch bookings');
    }

    return data;
  } catch (error) {
    console.error('❌ Error fetching bookings:', error);
    throw error;
  }
};

// Get artisan's work
export const getMyWork = async (params = {}) => {
  try {
    const searchParams = new URLSearchParams({
      page: params.page || '1',
      limit: params.limit || '10',
      status: params.status || ''
    });

    const response = await fetch(`${API_URL}/bookings/my-work?${searchParams}`, {
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch work');
    }

    return data;
  } catch (error) {
    console.error('❌ Error fetching work:', error);
    throw error;
  }
};

// Get single booking details
export const getBookingById = async (bookingId) => {
  try {
    const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch booking details');
    }

    return data;
  } catch (error) {
    console.error('❌ Error fetching booking details:', error);
    throw error;
  }
};

// Cancel a booking
export const cancelBooking = async (bookingId, reason, description) => {
  try {
    const response = await fetch(`${API_URL}/bookings/${bookingId}/cancel`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason, description })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to cancel booking');
    }

    return data;
  } catch (error) {
    console.error('❌ Error cancelling booking:', error);
    throw error;
  }
};

// Confirm a booking (artisan)
export const confirmBooking = async (bookingId) => {
  try {
    const response = await fetch(`${API_URL}/bookings/${bookingId}/confirm`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to confirm booking');
    }

    return data;
  } catch (error) {
    console.error('❌ Error confirming booking:', error);
    throw error;
  }
};

// Start work (artisan)
export const startWork = async (bookingId) => {
  try {
    const response = await fetch(`${API_URL}/bookings/${bookingId}/start`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to start work');
    }

    return data;
  } catch (error) {
    console.error('❌ Error starting work:', error);
    throw error;
  }
};

// Complete work (artisan)
export const completeWork = async (bookingId) => {
  try {
    const response = await fetch(`${API_URL}/bookings/${bookingId}/complete`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to complete work');
    }

    return data;
  } catch (error) {
    console.error('❌ Error completing work:', error);
    throw error;
  }
};