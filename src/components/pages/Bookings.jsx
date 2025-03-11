import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Bookings = () => {
  const navigate = useNavigate();
  const { userType, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Mock booking data
  const mockBookings = [
    {
      id: 'b1001',
      artisanId: 'a201',
      artisanName: 'Emma Jewelry',
      businessName: 'Elegant Gems',
      serviceName: 'Custom Gold Necklace',
      serviceImage: 'https://via.placeholder.com/100',
      bookingDate: '2025-03-20',
      bookingTime: '10:00 AM',
      status: 'upcoming',
      price: '₦75,000',
      location: 'Lagos',
      contactPhone: '+234 123 456 7890',
      createdAt: '2025-03-01'
    },
    {
      id: 'b1002',
      artisanId: 'a202',
      artisanName: 'David Leatherworks',
      businessName: 'Precision Leather',
      serviceName: 'Handcrafted Leather Wallet',
      serviceImage: 'https://via.placeholder.com/100',
      bookingDate: '2025-03-15',
      bookingTime: '2:00 PM',
      status: 'upcoming',
      price: '₦25,000',
      location: 'Port Harcourt',
      contactPhone: '+234 123 456 7891',
      createdAt: '2025-02-25'
    },
    {
      id: 'b1003',
      artisanId: 'a203',
      artisanName: 'Aisha Textiles',
      businessName: 'Heritage Fabrics',
      serviceName: 'Custom Adire Fabric (5 yards)',
      serviceImage: 'https://via.placeholder.com/100',
      bookingDate: '2025-03-05',
      bookingTime: '11:30 AM',
      status: 'completed',
      price: '₦35,000',
      location: 'Ibadan',
      contactPhone: '+234 123 456 7892',
      createdAt: '2025-02-20',
      completedAt: '2025-03-05'
    },
    {
      id: 'b1004',
      artisanId: 'a204',
      artisanName: 'Michael Woodcrafts',
      businessName: 'Natural Creations',
      serviceName: 'Custom Dining Table',
      serviceImage: 'https://via.placeholder.com/100',
      bookingDate: '2025-02-10',
      bookingTime: '9:00 AM',
      status: 'cancelled',
      price: '₦120,000',
      location: 'Enugu',
      contactPhone: '+234 123 456 7893',
      createdAt: '2025-01-20',
      cancelledAt: '2025-01-30',
      cancellationReason: 'Schedule conflict'
    },
    {
      id: 'b1005',
      artisanId: 'a205',
      artisanName: 'John Metalworks',
      businessName: 'Creative Metals',
      serviceName: 'Decorative Metal Gate',
      serviceImage: 'https://via.placeholder.com/100',
      bookingDate: '2025-04-05',
      bookingTime: '10:00 AM',
      status: 'upcoming',
      price: '₦150,000',
      location: 'Lagos',
      contactPhone: '+234 123 456 7894',
      createdAt: '2025-03-01'
    }
  ];
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  // Fetch bookings
  useEffect(() => {
    // Check if user is customer
    if (userType !== 'customer') {
      navigate('/unauthorized');
      return;
    }
    
    // Simulate API call to get bookings
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBookings(mockBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, [userType, navigate]);
  
  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    return booking.status === activeTab;
  }).filter(booking => {
    if (filterStatus === 'all') return true;
    return booking.status === filterStatus;
  });
  
  const confirmCancelBooking = (booking) => {
    setBookingToCancel(booking);
    setShowCancelModal(true);
  };
  
  const handleCancelBooking = () => {
    // In a real app, this would call an API
    setBookings(bookings.map(booking => 
      booking.id === bookingToCancel.id 
        ? { 
            ...booking, 
            status: 'cancelled', 
            cancelledAt: new Date().toISOString().split('T')[0],
            cancellationReason
          } 
        : booking
    ));
    
    setShowCancelModal(false);
    setBookingToCancel(null);
    setCancellationReason('');
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
            <span onClick={handleLogout} className="hover:text-red-400 cursor-pointer">Logout</span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="bg-white flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
          
          {/* Booking Filters */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px space-x-8">
                    <button
                      onClick={() => setActiveTab('upcoming')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'upcoming'
                          ? 'border-red-500 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Upcoming
                    </button>
                    <button
                      onClick={() => setActiveTab('completed')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'completed'
                          ? 'border-red-500 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Completed
                    </button>
                    <button
                      onClick={() => setActiveTab('cancelled')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'cancelled'
                          ? 'border-red-500 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Cancelled
                    </button>
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'all'
                          ? 'border-red-500 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      All Bookings
                    </button>
                  </nav>
                </div>
              </div>
              
              <div className="w-full sm:w-auto">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block w-full sm:w-auto py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Booking List */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="space-y-6">
              {filteredBookings.map(booking => (
                <div 
                  key={booking.id} 
                  className={`bg-white border rounded-lg overflow-hidden shadow-sm ${
                    booking.status === 'cancelled' ? 'opacity-75' : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex flex-wrap md:flex-nowrap">
                      {/* Service Image */}
                      <div className="w-full md:w-auto mb-4 md:mb-0 md:mr-6">
                        <img 
                          src={booking.serviceImage} 
                          alt={booking.serviceName} 
                          className="w-full md:w-24 h-24 object-cover rounded-md"
                        />
                      </div>
                      
                      {/* Booking Details */}
                      <div className="flex-1">
                        <div className="flex flex-wrap justify-between mb-2">
                          <h3 className="text-lg font-semibold">{booking.serviceName}</h3>
                          <div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                              booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4">
                          <span className="font-medium">{booking.businessName}</span> ({booking.artisanName})
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Date & Time</p>
                            <p className="font-medium">
                              {formatDate(booking.bookingDate)} at {booking.bookingTime}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="font-medium">{booking.location}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Price</p>
                            <p className="font-medium">{booking.price}</p>
                          </div>
                        </div>
                        
                        {booking.status === 'cancelled' && (
                          <div className="mb-4 p-3 bg-gray-50 rounded">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Cancellation Reason:</span> {booking.cancellationReason || 'No reason provided'}
                            </p>
                            <p className="text-sm text-gray-700 mt-1">
                              <span className="font-medium">Cancelled on:</span> {formatDate(booking.cancelledAt)}
                            </p>
                          </div>
                        )}
                        
                        {booking.status === 'completed' && (
                          <div className="mb-4 p-3 bg-gray-50 rounded">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Completed on:</span> {formatDate(booking.completedAt)}
                            </p>
                          </div>
                        )}
                        
                        {/* Actions */}
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => navigate(`/artisan/${booking.artisanId}`)} 
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              View Artisan
                            </button>
                            <span className="text-gray-300">|</span>
                            <button 
                              onClick={() => navigate(`/booking/${booking.id}`)} 
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              Booking Details
                            </button>
                          </div>
                          
                          {booking.status === 'upcoming' && (
                            <button 
                              onClick={() => confirmCancelBooking(booking)}
                              className="bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-4 rounded transition"
                            >
                              Cancel Booking
                            </button>
                          )}
                          
                          {booking.status === 'completed' && (
                            <button 
                              onClick={() => navigate(`/review/${booking.id}`)}
                              className="bg-gray-800 hover:bg-gray-900 text-white text-sm py-2 px-4 rounded transition"
                            >
                              Leave Review
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings found</h3>
              <p className="mt-1 text-gray-500">
                {activeTab === 'all' 
                  ? "You haven't made any bookings yet." 
                  : `You don't have any ${activeTab} bookings.`}
              </p>
              <div className="mt-6">
                <button 
                  onClick={() => navigate('/search')}
                  className="bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition"
                >
                  Find Artisans
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Cancel Booking Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Cancel Booking</h3>
            <p className="mb-4">
              Are you sure you want to cancel your booking for <span className="font-medium">{bookingToCancel.serviceName}</span> with <span className="font-medium">{bookingToCancel.businessName}</span>?
            </p>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Reason for cancellation (optional)</label>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows="3"
                placeholder="Please provide a reason for cancellation..."
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => {
                  setShowCancelModal(false);
                  setBookingToCancel(null);
                  setCancellationReason('');
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Keep Booking
              </button>
              <button 
                onClick={handleCancelBooking}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Cancel Booking
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