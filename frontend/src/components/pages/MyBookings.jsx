// src/components/pages/MyBookings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyBookings, cancelBooking } from '../../../../backend/src/api/Bookings';

const MyBookings = () => {
  const { userType, logout } = useAuth();
  const navigate = useNavigate();

  // State management
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and pagination state
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Ensure only customers can access
  useEffect(() => {
    if (userType !== 'customer') {
      navigate('/unauthorized');
      return;
    }
    fetchBookings();
  }, [userType, navigate, activeFilter, currentPage]);

  // Fetch bookings from API
  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        status: activeFilter === 'all' ? '' : activeFilter,
        page: currentPage.toString(),
        limit: '10'
      };

      const data = await getMyBookings(params);
      setBookings(data.bookings || []);
      setTotalPages(data.pagination?.pages || 1);
      
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Apply search filter
  useEffect(() => {
    let filtered = [...bookings];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(booking =>
        booking.title?.toLowerCase().includes(query) ||
        booking.artisan?.businessName?.toLowerCase().includes(query) ||
        booking.artisan?.contactName?.toLowerCase().includes(query)
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, searchQuery]);

  // Handle cancel booking
  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await cancelBooking(bookingId, 'customer_request', 'Customer requested cancellation');
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking');
    }
  };

  // Helper functions
  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pending_review': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price, currency = 'NGN') => {
    const symbol = currency === 'NGN' ? '₦' : '$';
    return `${symbol}${price?.toLocaleString()}`;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-black text-white sticky top-0 z-50">
        <div className="py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span onClick={() => navigate('/')} className="text-red-500 text-5xl select-none font-bold cursor-pointer">𐐒</span>
                <span onClick={() => navigate('/')} className="text-white text-4xl select-none font-bold cursor-pointer">B</span>
                <span onClick={() => navigate('/')} className="text-red-500 text-2xl select-none cursor-pointer font-semibold ml-5">BizBridge</span>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate('/dashboard')}>
                  <div>Your</div>
                  <div className="font-bold">Dashboard</div>
                </div>
                <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate('/services')}>
                  <div>Browse</div>
                  <div className="font-bold">Services</div>
                </div>
                <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate('/profile')}>
                  <div>Your</div>
                  <div className="font-bold">Profile</div>
                </div>
                <div className="text-xs cursor-pointer hover:text-red-400" onClick={handleLogout}>
                  <div>Sign</div>
                  <div className="font-bold">Out</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
                <p className="text-gray-600">Track and manage your service bookings</p>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Status Filters */}
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'All Bookings', count: bookings.length },
                  { key: 'pending', label: 'Pending', count: bookings.filter(b => b.status === 'pending').length },
                  { key: 'confirmed', label: 'Confirmed', count: bookings.filter(b => b.status === 'confirmed').length },
                  { key: 'in_progress', label: 'In Progress', count: bookings.filter(b => b.status === 'in_progress').length },
                  { key: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => {
                      setActiveFilter(filter.key);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      activeFilter === filter.key
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <div key={booking._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{booking.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(booking.status)}`}>
                          {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1).replace('_', ' ')}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">
                        with {booking.artisan?.businessName || booking.artisan?.contactName}
                      </p>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          {formatDate(booking.scheduledDate?.startDate)}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {booking.location?.lga}, Lagos
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          Booked: {formatDate(booking.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600 mb-1">
                        {formatPrice(booking.pricing?.agreedPrice, booking.pricing?.currency)}
                      </div>
                      <div className="text-sm text-gray-500">Total Price</div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  {booking.description && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{booking.description}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => navigate(`/bookings/${booking._id}`)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-medium"
                    >
                      View Details
                    </button>

                    <div className="flex gap-2">
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium"
                        >
                          Cancel Booking
                        </button>
                      )}
                      
                      {booking.status === 'pending_review' && !booking.review?.customerReview && (
                        <button
                          onClick={() => navigate(`/bookings/${booking._id}/review`)}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-medium"
                        >
                          Leave Review
                        </button>
                      )}

                      {booking.status === 'confirmed' && (
                        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                          Waiting for artisan to start work
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Payment Info */}
                  {booking.pricing?.depositAmount > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Deposit: {formatPrice(booking.pricing.depositAmount)} 
                          {booking.pricing.depositPaid ? ' ✅ Paid' : ' ⏳ Pending'}
                        </span>
                        <span className="text-gray-600">
                          Balance: {formatPrice(booking.pricing.agreedPrice - booking.pricing.depositAmount)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {activeFilter === 'all' ? 'No bookings yet' : `No ${activeFilter} bookings`}
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeFilter === 'all' 
                    ? 'Start by browsing our amazing artisan services.'
                    : `No bookings with status "${activeFilter}" found.`}
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => navigate('/services')}
                    className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
                  >
                    Browse Services
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      currentPage === index + 1
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} BizBridge. All rights reserved.</p>
            <div className="mt-2 flex flex-wrap justify-center">
              <span onClick={() => navigate('/terms')} className="text-red-400 hover:text-red-500 mx-2 cursor-pointer">Terms of Service</span>
              <span onClick={() => navigate('/privacy')} className="text-red-400 hover:text-red-500 mx-2 cursor-pointer">Privacy Policy</span>
              <span onClick={() => navigate('/contact')} className="text-red-400 hover:text-red-500 mx-2 cursor-pointer">Contact Us</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MyBookings;