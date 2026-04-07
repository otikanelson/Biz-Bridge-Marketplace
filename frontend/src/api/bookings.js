import { API_URL } from './config';

const BOOKINGS_URL = `${API_URL}/bookings`;

const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

// Book a service
export const bookService = async (serviceId, token) => {
  const response = await fetch(`${BOOKINGS_URL}/book`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ serviceId, date: new Date().toISOString() }),
  });
  return response.json();
};

// Get artisan's work (bookings where they are the provider)
export const getMyWork = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const token = localStorage.getItem('token');
  const response = await fetch(`${BOOKINGS_URL}/my-work?${query}`, {
    headers: authHeaders(token),
  });
  if (!response.ok) throw new Error('Failed to fetch work');
  return response.json();
};

// Confirm a booking
export const confirmBooking = async (bookingId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BOOKINGS_URL}/${bookingId}/confirm`, {
    method: 'PATCH',
    headers: authHeaders(token),
  });
  if (!response.ok) throw new Error('Failed to confirm booking');
  return response.json();
};

// Start work on a booking
export const startWork = async (bookingId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BOOKINGS_URL}/${bookingId}/start`, {
    method: 'PATCH',
    headers: authHeaders(token),
  });
  if (!response.ok) throw new Error('Failed to start work');
  return response.json();
};

// Mark work as complete
export const completeWork = async (bookingId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BOOKINGS_URL}/${bookingId}/complete`, {
    method: 'PATCH',
    headers: authHeaders(token),
  });
  if (!response.ok) throw new Error('Failed to complete work');
  return response.json();
};
