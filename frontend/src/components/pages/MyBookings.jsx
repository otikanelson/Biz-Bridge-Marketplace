import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../api/config'; = () => {
  const navigate = useNavigate();
  const { userType, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  
  // Form states
  const [cancelReason, setCancelReason] = useState('');
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  // Ensure only customers can access
  useEffect(() => {
    if (userType !== 'customer') {
      navigate('/dashboard');
      return;
    }
    fetchBookings();
  }, [userType, navigate]);

  useEffect(() => {
    applyFilters();
  }, [bookings, activeFilter, searchQuery]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const baseURL = API_URL;
        
      const response = await fetch(`${baseURL}/bookings/my-bookings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || data || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      setError('Error loading bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    // Apply status filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === activeFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(booking =>
        booking.title?.toLowerCase().includes(query) ||
        booking.description?.toLowerCase().includes(query) ||
        booking.artisan?.businessName?.toLowerCase().includes(query) ||
        booking.artisan?.contactName?.toLowerCase().includes(query) ||
        booking.service?.title?.toLowerCase().includes(query)
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredBookings(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case 'confirmed':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'in_progress':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
          </svg>
        );
      case 'completed':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'cancelled':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  // API Functions
  const handleMarkComplete = async () => {
    try {
      const baseURL = API_URL;
        
      const response = await fetch(`${baseURL}/bookings/${selectedBooking._id}/complete`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchBookings();
        setShowCompleteModal(false);
        setSelectedBooking(null);
        alert('Booking marked as completed successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to update booking status');
      }
    } catch (err) {
      alert('Error updating booking');
      console.error('Error updating booking:', err);
    }
  };

  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    try {
      const baseURL = API_URL;
        
      const response = await fetch(`${baseURL}/bookings/${selectedBooking._id}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: cancelReason })
      });

      if (response.ok) {
        await fetchBookings();
        setShowCancelModal(false);
        setCancelReason('');
        setSelectedBooking(null);
        alert('Booking cancelled successfully');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to cancel booking');
      }
    } catch (err) {
      alert('Error cancelling booking');
      console.error('Error cancelling booking:', err);
    }
  };

  const handleAcceptContract = async (bookingId) => {
    try {
      const baseURL = API_URL;
        
      const response = await fetch(`${baseURL}/bookings/${bookingId}/accept-contract`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchBookings();
        alert('Contract accepted successfully!');
        setShowContractModal(false);
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to accept contract');
      }
    } catch (err) {
      alert('Error accepting contract');
      console.error('Error accepting contract:', err);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
      alert('Please provide a rating between 1 and 5');
      return;
    }

    try {
      const baseURL = API_URL;
        
      const response = await fetch(`${baseURL}/bookings/${selectedBooking._id}/review`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
      });

      if (response.ok) {
        await fetchBookings();
        setShowReviewModal(false);
        setReviewData({ rating: 5, comment: '' });
        setSelectedBooking(null);
        alert('Review submitted successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to submit review');
      }
    } catch (err) {
      alert('Error submitting review');
      console.error('Error submitting review:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Calculate filter counts
  const filterCounts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    in_progress: bookings.filter(b => b.status === 'in_progress').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  };

  const filters = [
    { key: 'all', label: 'All Bookings', count: filterCounts.all },
    { key: 'pending', label: 'Pending', count: filterCounts.pending },
    { key: 'confirmed', label: 'Confirmed', count: filterCounts.confirmed },
    { key: 'in_progress', label: 'In Progress', count: filterCounts.in_progress },
    { key: 'completed', label: 'Completed', count: filterCounts.completed },
    { key: 'cancelled', label: 'Cancelled', count: filterCounts.cancelled }
  ];

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="bg-black text-white w-full top-0 z-10 fixed">
          <div className="py-2">
            <div className="container mx-auto px-4 flex items-center justify-between">
              <div className="flex items-center cursor-pointer py-3" onClick={() => navigate('/')}>
                <span className="text-red-500 text-5xl select-none font-bold">𐐒</span>
                <span className="text-white text-4xl select-none font-bold">B</span>
                <span className="text-red-500 text-2xl select-none font-semibold ml-5">BizBridge</span>
              </div>
            </div>
          </div>
        </header>
        
        <div className="bg-gray-50 flex-grow pt-16 flex items-center justify-center">
          <div className="text-center">
            <svg className="animate-spin w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <p className="text-gray-600 text-lg">Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-black text-white w-full top-0 z-10 fixed">
        <div className="py-2">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center cursor-pointer py-3" onClick={() => navigate('/')}>
              <span className="text-red-500 text-5xl select-none font-bold">𐐒</span>
              <span className="text-white text-4xl select-none font-bold">B</span>
              <span className="text-red-500 text-2xl select-none font-semibold ml-5">BizBridge</span>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate('/dashboard')}>
                <div>Your</div>
                <div className="font-bold">Dashboard</div>
              </div>
              <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate('/customer-requests/history')}>
                <div>Your</div>
                <div className="font-bold">Requests</div>
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
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 pt-20 py-8 mt-5">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
                <p className="text-gray-600">Track your service bookings and manage your orders</p>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition font-medium"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          )}

          <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      activeFilter === filter.key
                        ? 'bg-red-500 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search bookings by service, artisan, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <div key={booking._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {booking.title || booking.service?.title}
                          </h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1">{booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1).replace('_', ' ')}</span>
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            {booking.artisan?.businessName || booking.artisan?.contactName}
                          </span>
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
                            {booking.location?.address || booking.location?.lga || 'Location TBD'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {booking.description && (
                      <div className="mb-4">
                        <p className="text-gray-700">{booking.description}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => navigate(`/messages/${booking._id}`)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Message
                      </button>

                      <button
                        onClick={() => navigate(`/profile/${booking.artisan?._id}`)}
                        className="inline-flex items-center px-4 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        View Artisan
                      </button>

                      {booking.status === 'in_progress' && (
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowCompleteModal(true);
                          }}
                          className="inline-flex items-center px-4 py-2 border border-green-300 shadow-sm text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 transition"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Mark Complete
                        </button>
                      )}

                      {(booking.status === 'pending' || booking.status === 'confirmed' || booking.status === 'in_progress') && (
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowCancelModal(true);
                          }}
                          className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 transition"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No {activeFilter !== 'all' ? activeFilter : ''} bookings found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchQuery
                    ? 'No bookings match your search criteria. Try adjusting your search terms.'
                    : 'You haven\'t made any bookings yet. Start by browsing our amazing artisan services!'}
                </p>
                <button
                  onClick={() => navigate('/services')}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition font-medium"
                >
                  Browse Services
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Mark as Complete</h3>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to mark this booking as completed? This action confirms that the service has been delivered to your satisfaction.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Once marked as complete, you'll be able to leave a review for the artisan.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleMarkComplete}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
              >
                Mark Complete
              </button>
              <button
                onClick={() => {
                  setShowCompleteModal(false);
                  setSelectedBooking(null);
                }}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Cancel Booking</h3>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Please provide a reason for cancelling this booking. This will help us improve our service.
              </p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows={4}
              />
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleCancelBooking}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium"
              >
                Cancel Booking
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                  setSelectedBooking(null);
                }}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;