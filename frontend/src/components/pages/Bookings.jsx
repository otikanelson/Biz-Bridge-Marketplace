import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Bookings = () => {
  const navigate = useNavigate();
  const { userType, isAuthenticated, logout } = useAuth();
  
  // State for bookings data
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for UI
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  // Ensure only customers can access bookings page
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (userType !== 'customer') {
      navigate('/unauthorized');
      return;
    }
    
    // Fetch bookings data
    fetchBookings();
  }, [isAuthenticated, userType, navigate]);

  // Mock function to fetch bookings (replace with actual API call in production)
  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock bookings data
      const mockBookings = [
        {
          id: 'b001',
          serviceName: 'Custom Wooden Table',
          serviceId: 's101',
          artisanName: 'Premium Woodworks',
          artisanId: 'a001',
          artisanImage: '',
          date: '2025-04-15T10:00:00',
          createdAt: '2025-03-20T14:30:00',
          status: 'upcoming',
          price: '₦65,000',
          location: 'Artisan\'s Workshop',
          description: 'Handcrafted dining table made from reclaimed wood.',
          contactPhone: '+234 801 234 5678'
        },
        {
          id: 'b002',
          serviceName: 'Leather Wallet Repair',
          serviceId: 's102',
          artisanName: 'Leather Crafters',
          artisanId: 'a002',
          artisanImage: '',
          date: '2025-03-12T14:30:00',
          createdAt: '2025-03-01T09:15:00',
          status: 'completed',
          price: '₦8,500',
          location: 'Customer\'s Location',
          description: 'Repair of damaged leather wallet, including stitching and polish.',
          contactPhone: '+234 802 345 6789',
          reviewed: true,
          rating: 4
        },
        {
          id: 'b003',
          serviceName: 'Ceramic Vase Set',
          serviceId: 's103',
          artisanName: 'Creative Pottery',
          artisanId: 'a003',
          artisanImage: '',
          date: '2025-03-18T11:00:00',
          createdAt: '2025-03-10T16:45:00',
          status: 'cancelled',
          price: '₦22,000',
          location: 'Artisan\'s Workshop',
          description: 'Set of 3 handcrafted ceramic vases in varying sizes.',
          contactPhone: '+234 803 456 7890',
          cancellationReason: 'Schedule conflict'
        },
        {
          id: 'b004',
          serviceName: 'Custom Portrait',
          serviceId: 's104',
          artisanName: 'Artistry Studios',
          artisanId: 'a004',
          artisanImage: '',
          date: '2025-04-05T13:00:00',
          createdAt: '2025-03-15T11:20:00',
          status: 'confirmed',
          price: '₦35,000',
          location: 'Artisan\'s Studio',
          description: 'Hand-painted portrait based on provided photograph.',
          contactPhone: '+234 804 567 8901'
        },
        {
          id: 'b005',
          serviceName: 'Handwoven Basket',
          serviceId: 's105',
          artisanName: 'Woven Wonders',
          artisanId: 'a005',
          artisanImage: '',
          date: '2025-03-05T15:30:00',
          createdAt: '2025-02-25T13:10:00',
          status: 'completed',
          price: '₦12,500',
          location: 'Customer\'s Location',
          description: 'Large handwoven storage basket made from natural fibers.',
          contactPhone: '+234 805 678 9012',
          reviewed: false
        }
      ];
      
      setBookings(mockBookings);
      setFilteredBookings(mockBookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters, search, and sorting
  useEffect(() => {
    let result = [...bookings];
    
    // Apply status filter
    if (activeFilter !== 'all') {
      result = result.filter(booking => booking.status === activeFilter);
    }
    
    // Apply search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        booking => 
          booking.serviceName.toLowerCase().includes(query) ||
          booking.artisanName.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const dateA = new Date(sortOrder === 'newest' ? a.createdAt : a.date);
      const dateB = new Date(sortOrder === 'newest' ? b.createdAt : b.date);
      return sortOrder.includes('asc') ? dateA - dateB : dateB - dateA;
    });
    
    setFilteredBookings(result);
  }, [bookings, activeFilter, searchQuery, sortOrder]);

  // Cancel a booking
  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === selectedBooking.id 
          ? { ...booking, status: 'cancelled', cancellationReason: 'Cancelled by customer' } 
          : booking
      ));
      
      // Close modal
      setShowCancelModal(false);
      setSelectedBooking(null);
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError('Failed to cancel booking. Please try again.');
    }
  };

  // Submit a review
  const handleSubmitReview = async () => {
    if (!selectedBooking || !reviewData.rating) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === selectedBooking.id 
          ? { ...booking, reviewed: true, rating: reviewData.rating } 
          : booking
      ));
      
      // Reset review data and close modal
      setReviewData({ rating: 5, comment: '' });
      setShowReviewModal(false);
      setSelectedBooking(null);
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review. Please try again.');
    }
  };

  // Format date string to readable format
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const badges = {
      'upcoming': 'bg-blue-100 text-blue-800',
      'confirmed': 'bg-green-100 text-green-800',
      'completed': 'bg-purple-100 text-purple-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span onClick={() => navigate('/')} className="text-red-500 text-5xl select-none font-bold cursor-pointer">𐐒</span>
            <span onClick={() => navigate('/')} className="text-white text-4xl select-none font-bold cursor-pointer">B</span>
            <span onClick={() => navigate('/')} className="text-red-500 text-2xl select-none cursor-pointer font-semibold ml-5">BizBridge</span>
          </div>
          <nav className="flex space-x-8">
            <span onClick={() => navigate('/dashboard')} className="hover:text-red-400 cursor-pointer">Dashboard</span>
            <span onClick={() => navigate('/bookings')} className="text-red-400 cursor-pointer">My Bookings</span>
            <span onClick={handleLogout} className="hover:text-red-400 cursor-pointer">Logout</span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="bg-white flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
          
          {/* Filters and Search */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-md"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-md ${
                  activeFilter === 'all' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('upcoming')}
                className={`px-4 py-2 rounded-md ${
                  activeFilter === 'upcoming' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveFilter('confirmed')}
                className={`px-4 py-2 rounded-md ${
                  activeFilter === 'confirmed' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Confirmed
              </button>
              <button
                onClick={() => setActiveFilter('completed')}
                className={`px-4 py-2 rounded-md ${
                  activeFilter === 'completed' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setActiveFilter('cancelled')}
                className={`px-4 py-2 rounded-md ${
                  activeFilter === 'cancelled' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Cancelled
              </button>
            </div>
            
            <div className="flex-shrink-0">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="p-3 border border-gray-300 rounded-md"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="date-asc">Date: Upcoming First</option>
                <option value="date-desc">Date: Recent First</option>
              </select>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-700">{error}</p>
              <button 
                onClick={fetchBookings}
                className="mt-2 text-red-600 hover:text-red-800 underline"
              >
                Try Again
              </button>
            </div>
          )}
          
          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="space-y-6">
              {filteredBookings.map(booking => (
                <div key={booking.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                      {/* Booking Info */}
                      <div className="flex items-start mb-4 md:mb-0">
                        <img 
                          src={booking.artisanImage} 
                          alt={booking.artisanName}
                          className="w-12 h-12 rounded-full object-cover mr-4" 
                        />
                        <div>
                          <h2 className="text-xl font-semibold">{booking.serviceName}</h2>
                          <p className="text-gray-600 mb-1">
                            by <span 
                              className="text-blue-600 hover:underline cursor-pointer"
                              onClick={() => navigate(`/artisan/${booking.artisanId}`)}
                            >
                              {booking.artisanName}
                            </span>
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusBadge(booking.status)}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                              {booking.price}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Date and Actions */}
                      <div className="text-right">
                        <p className="font-medium text-gray-800">{formatDate(booking.date)}</p>
                        <p className="text-sm text-gray-500 mb-3">Booked on {new Date(booking.createdAt).toLocaleDateString()}</p>
                        
                        <div className="flex flex-wrap justify-end gap-2">
                          {booking.status === 'completed' && !booking.reviewed && (
                            <button 
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowReviewModal(true);
                              }}
                              className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 transition"
                            >
                              Leave Review
                            </button>
                          )}
                          
                          {booking.status === 'completed' && booking.reviewed && (
                            <div className="flex items-center bg-purple-100 px-3 py-1 rounded">
                              <span className="text-sm text-purple-800 mr-1">Rated:</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg 
                                    key={i} 
                                    className={`w-4 h-4 ${i < booking.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                                    fill="currentColor" 
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {(booking.status === 'upcoming' || booking.status === 'confirmed') && (
                            <button 
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowCancelModal(true);
                              }}
                              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                            >
                              Cancel Booking
                            </button>
                          )}
                          
                          <button 
                            onClick={() => navigate(`/services/${booking.serviceId}`)}
                            className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-300 transition"
                          >
                            View Service
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Additional Details */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Location</p>
                          <p className="font-medium">{booking.location}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Contact Phone</p>
                          <p className="font-medium">{booking.contactPhone}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Service Details</p>
                          <p className="font-medium">{booking.description}</p>
                        </div>
                      </div>
                      
                      {booking.status === 'cancelled' && booking.cancellationReason && (
                        <div className="mt-3 bg-red-50 p-3 rounded">
                          <p className="text-sm text-red-800">
                            <span className="font-medium">Cancellation reason:</span> {booking.cancellationReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No bookings found</h3>
              <p className="mt-2 text-gray-500">
                {searchQuery || activeFilter !== 'all' 
                  ? 'Try adjusting your filters or search criteria.' 
                  : 'You haven\'t booked any services yet.'}
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-6 bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition"
              >
                Explore Services
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Cancel Booking Modal */}
      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Cancel Booking</h3>
            <p className="mb-4">
              Are you sure you want to cancel your booking for <span className="font-medium">{selectedBooking.serviceName}</span> with <span className="font-medium">{selectedBooking.artisanName}</span>?
            </p>
            <p className="text-sm text-gray-600 mb-6">
              This action cannot be undone. The artisan will be notified of your cancellation.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedBooking(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Keep Booking
              </button>
              <button 
                onClick={handleCancelBooking}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Review Modal */}
      {showReviewModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Review Your Experience</h3>
            <p className="mb-4">
              How would you rate your experience with <span className="font-medium">{selectedBooking.artisanName}</span> for <span className="font-medium">{selectedBooking.serviceName}</span>?
            </p>
            
            <div className="mb-4">
              <div className="flex justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1"
                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                  >
                    <svg 
                      className={`w-8 h-8 ${star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
              <p className="text-center mt-2">
                {reviewData.rating === 1 && 'Poor'}
                {reviewData.rating === 2 && 'Fair'}
                {reviewData.rating === 3 && 'Good'}
                {reviewData.rating === 4 && 'Very Good'}
                {reviewData.rating === 5 && 'Excellent'}
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Additional Comments (Optional)</label>
              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md"
                rows="3"
                placeholder="Share your experience..."
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => {
                  setShowReviewModal(false);
                  setSelectedBooking(null);
                  setReviewData({ rating: 5, comment: '' });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitReview}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} BizBridge. All rights reserved.</p>
            <div className="mt-2 flex flex-wrap justify-center">
              <span onClick={() => navigate('/terms')} className="text-red-400 hover:text-red-500 mx-2 cursor-pointer">Terms of Service</span>
              <span onClick={() => navigate('/privacy')} className="text-red-400 hover:text-red-500 mx-2 cursor-pointer">Privacy Policy</span>
              <span onClick={() => navigate('/contact')} className="text-red-400 hover:text-red-500 mx-2 cursor-pointer">Contact Us</span>
              <span onClick={() => navigate('/faq')} className="text-red-400 hover:text-red-500 mx-2 cursor-pointer">FAQ</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Bookings;