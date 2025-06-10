// src/components/pages/Dashboard.jsx - Updated with real API calls
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { currentUser, userType, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Search states (for customers only)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Dashboard data states
  const [savedArtisans, setSavedArtisans] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [featuredArtisans, setFeaturedArtisans] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [services, setServices] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Success message from navigation state
  const [successMessage, setSuccessMessage] = useState('');

  // Job categories for search
  const categories = [
    'Woodworking', 'Pottery & Ceramics', 'Jewelry Making', 'Textile Art', 
    'Leathercraft', 'Metalwork', 'Basket Weaving', 'Beadwork',
    'Calabash Decoration', 'Glass Blowing', 'Leather Shoes', 'Embroidery',
    'Soap Making', 'Candle Making', 'Hair Braiding & Styling'
  ];

  // Lagos LGAs for search
  const locations = [
    'Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Badagry',
    'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja',
    'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin',
    'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere', 'Yaba'
  ];

  // Check for success message from navigation
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message after showing it
      setTimeout(() => setSuccessMessage(''), 5000);
      // Clear the state to prevent showing again on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  // Load dashboard data on component mount
  useEffect(() => {
    loadDashboardData();
  }, [userType]);

  // API call functions
  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (userType === 'customer') {
        await loadCustomerData();
      } else if (userType === 'artisan') {
        await loadArtisanData();
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load customer-specific data
  const loadCustomerData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Load customer bookings
      const bookingsResponse = await fetch('http://localhost:5000/api/bookings/my-bookings?limit=5', {
        headers
      });
      
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookingHistory(bookingsData.bookings || []);
      }

      // Load customer service requests
      const requestsResponse = await fetch('http://localhost:5000/api/service-requests/my-requests?limit=5', {
        headers
      });
      
      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        setServiceRequests(requestsData.requests || []);
      }

      // Load featured artisans for discovery
      try {
        const featuredResponse = await getFeaturedArtisans(6);
        if (featuredResponse.success && featuredResponse.artisans) {
          setFeaturedArtisans(featuredResponse.artisans);
        }
      } catch (error) {
        console.error('Error loading featured artisans:', error);
      }

      // TODO: Load saved artisans from user preferences
      setSavedArtisans([]); // Placeholder for now

    } catch (error) {
      console.error('Error loading customer data:', error);
      throw error;
    }
  };

  // Load artisan-specific data
  const loadArtisanData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Load artisan's bookings (work)
      const bookingsResponse = await fetch('http://localhost:5000/api/bookings/my-work?limit=5', {
        headers
      });
      
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookingHistory(bookingsData.bookings || []);
      }

      // Load incoming service requests
      const requestsResponse = await fetch('http://localhost:5000/api/service-requests/inbox?limit=5', {
        headers
      });
      
      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        setServiceRequests(requestsData.requests || []);
      }

      // Load artisan's services
      const servicesResponse = await fetch('http://localhost:5000/api/services/my-services', {
        headers
      });
      
      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
        setServices(servicesData.services || []);
      }

      // Load booking analytics
      const analyticsResponse = await fetch('http://localhost:5000/api/bookings/analytics', {
        headers
      });
      
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setDashboardStats(analyticsData.analytics || {});
      }

    } catch (error) {
      console.error('Error loading artisan data:', error);
      throw error;
    }
  };

  // Search handler (customers only)
  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    
    if (searchQuery && searchQuery.trim()) {
      searchParams.set('search', searchQuery.trim());
    }
    if (selectedCategory && selectedCategory !== '') {
      searchParams.set('category', selectedCategory);
    }
    if (selectedLocation && selectedLocation !== '') {
      searchParams.set('location', selectedLocation);
    }
    
    const queryString = searchParams.toString();
    navigate(queryString ? `/services?${queryString}` : '/services');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Helper function to get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'viewed': return 'bg-blue-100 text-blue-800';
      case 'negotiating': return 'bg-purple-100 text-purple-800';
      case 'quoted': return 'bg-indigo-100 text-indigo-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Date not available';
    }
  };

  // Helper function to format price
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `₦${price.toLocaleString()}`;
    }
    if (typeof price === 'string' && price.includes('₦')) {
      return price;
    }
    return `₦${price || 0}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-black text-white sticky top-0 z-50">
        {/* Top Bar */}
        <div className="border-b border-gray-800 py-2">
          <div className="container mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span>📞 Customer Service: +234 800 123 4567</span>
              <span>🚚 Free delivery on orders above ₦50,000</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>🌍 Lagos, Nigeria</span>
              <span>💰 NGN</span>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span onClick={() => navigate('/')} className="text-red-500 text-5xl select-none font-bold cursor-pointer">𐐒</span>
                <span onClick={() => navigate('/')} className="text-white text-4xl select-none font-bold cursor-pointer">B</span>
                <span onClick={() => navigate('/')} className="text-red-500 text-2xl select-none cursor-pointer font-semibold ml-5">BizBridge</span>
              </div>

              {/* Search Bar - Only for customers */}
              {userType === 'customer' && (
                <div className="flex-1 max-w-4xl mx-8">
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Search for services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 px-4 py-2 text-black rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 text-black bg-gray-100 border-l focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="px-3 py-2 text-black bg-gray-100 border-l focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">All Locations</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleSearch}
                      className="bg-red-500 text-white px-6 py-2 rounded-r-md hover:bg-red-600 transition"
                    >
                      🔍
                    </button>
                  </div>
                </div>
              )}

              {/* User Menu */}
              <div className="flex items-center space-x-6">
                <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate('/dashboard')}>
                  <div>Your</div>
                  <div className="font-bold">Dashboard</div>
                </div>

                <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate(userType === 'customer' ? '/bookings' : '/ServicesManagement')}>
                  <div>Your</div>
                  <div className="font-bold">{userType === 'customer' ? 'Bookings' : 'Services'}</div>
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
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              <span className="block sm:inline">{successMessage}</span>
              <span 
                className="float-right cursor-pointer font-bold"
                onClick={() => setSuccessMessage('')}
              >
                ×
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <span className="block sm:inline">{error}</span>
              <button 
                className="float-right font-bold"
                onClick={() => setError(null)}
              >
                ×
              </button>
            </div>
          )}

          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back, {currentUser?.fullName || currentUser?.contactName || 'User'}!
            </h1>
            <p className="text-gray-600">
              {userType === 'customer' 
                ? 'Discover amazing artisan services and manage your bookings.'
                : 'Manage your services, view requests, and track your business.'}
            </p>
          </div>

          {/* Customer Dashboard */}
          {userType === 'customer' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                      <p className="text-3xl font-bold text-gray-900">{bookingHistory.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📅</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Bookings</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {bookingHistory.filter(b => ['pending', 'confirmed', 'in_progress'].includes(b.status)).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">⚡</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {serviceRequests.filter(r => ['pending', 'viewed', 'negotiating'].includes(r.status)).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">💬</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Saved Artisans</p>
                      <p className="text-3xl font-bold text-gray-900">{savedArtisans.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">❤️</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Recent Bookings</h2>
                    <button 
                      onClick={() => navigate("/bookings/my-bookings")}
                      className="text-red-500 hover:text-red-600 font-medium"
                    >
                      View All →
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  {bookingHistory.length > 0 ? (
                    <div className="space-y-4">
                      {bookingHistory.slice(0, 3).map((booking) => (
                        <div key={booking._id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-medium text-gray-800">{booking.title}</h3>
                              <p className="text-sm text-gray-600">
                                with {booking.artisan?.businessName || booking.artisan?.contactName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(booking.scheduledDate?.startDate)}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(booking.status)}`}>
                                {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1).replace('_', ' ')}
                              </span>
                              <span className="text-sm font-medium text-green-600">
                                {formatPrice(booking.pricing?.agreedPrice)}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigate(`/bookings/${booking._id}`)}
                              className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 text-6xl mb-4">📅</div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">No bookings yet</h3>
                      <p className="text-gray-600 mb-4">Start by exploring our amazing artisan services</p>
                      <button 
                        onClick={() => navigate('/services')}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
                      >
                        Browse Services
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Requests */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Your Service Requests</h2>
                    <button 
                      onClick={() => navigate("/services")}
                      className="text-red-500 hover:text-red-600 font-medium"
                    >
                      Make New Request →
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  {serviceRequests.length > 0 ? (
                    <div className="space-y-4">
                      {serviceRequests.slice(0, 3).map((request) => (
                        <div key={request._id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-medium text-gray-800">{request.title}</h3>
                              <p className="text-sm text-gray-600">
                                to {request.artisan?.businessName || request.artisan?.contactName}
                              </p>
                              <p className="text-xs text-gray-500">{formatDate(request.createdAt)}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(request.status)}`}>
                                {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
                              </span>
                              <span className="text-sm font-medium text-blue-600">
                                {formatPrice(request.budget?.min)} - {formatPrice(request.budget?.max)}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigate(`/service-requests/${request._id}`)}
                              className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition"
                            >
                              View Request
                            </button>
                            {request.status === 'quoted' && (
                              <button
                                onClick={() => navigate(`/service-requests/${request._id}/accept`)}
                                className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition"
                              >
                                Review Quote
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 text-6xl mb-4">💬</div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">No service requests yet</h3>
                      <p className="text-gray-600 mb-4">Request custom quotes from artisans for your specific needs</p>
                      <button 
                        onClick={() => navigate('/services')}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                      >
                        Request Custom Service
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Artisan Dashboard */}
          {userType === 'artisan' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Services</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {services.filter(s => s.isActive).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🛠️</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {serviceRequests.filter(r => ['pending', 'viewed'].includes(r.status)).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📨</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Bookings</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {bookingHistory.filter(b => ['confirmed', 'in_progress'].includes(b.status)).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📈</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {dashboardStats.overview?.completionRate || '0'}%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">✅</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => navigate("/ServicesAdd")}
                      className="p-4 border-2 border-dashed border-red-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition text-center"
                    >
                      <div className="text-3xl mb-2">➕</div>
                      <div className="font-medium text-gray-800">Add New Service</div>
                      <div className="text-sm text-gray-600">Create a new service offering</div>
                    </button>

                    <button
                      onClick={() => navigate("/ServicesManagement")}
                      className="p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center"
                    >
                      <div className="text-3xl mb-2">⚙️</div>
                      <div className="font-medium text-gray-800">Manage Services</div>
                      <div className="text-sm text-gray-600">Edit and update your services</div>
                    </button>

                    <button
                      onClick={() => navigate("/profile")}
                      className="p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition text-center"
                    >
                      <div className="text-3xl mb-2">👤</div>
                      <div className="font-medium text-gray-800">Update Profile</div>
                      <div className="text-sm text-gray-600">Enhance your business profile</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Service Requests */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Recent Service Requests</h2>
                    <button 
                      onClick={() => navigate("/service-requests/inbox")}
                      className="text-red-500 hover:text-red-600 font-medium"
                    >
                      View All Requests →
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  {serviceRequests.length > 0 ? (
                    <div className="space-y-4">
                      {serviceRequests.slice(0, 3).map((request) => (
                        <div key={request._id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-medium text-gray-800">{request.title}</h3>
                              <p className="text-sm text-gray-600">
                                from {request.customer?.fullName}
                              </p>
                              <p className="text-xs text-gray-500">{formatDate(request.createdAt)}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(request.status)}`}>
                                {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
                              </span>
                              <span className="text-sm font-medium text-green-600">
                                {formatPrice(request.budget?.min)} - {formatPrice(request.budget?.max)}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigate(`/service-requests/${request._id}`)}
                              className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition"
                            >
                              View Request
                            </button>
                            {request.status === 'pending' && (
                              <button
                                onClick={() => navigate(`/service-requests/${request._id}/quote`)}
                                className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition"
                              >
                                Send Quote
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 text-6xl mb-4">📨</div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">No service requests yet</h3>
                      <p className="text-gray-600 mb-4">When customers request quotes for your services, they'll appear here</p>
                      <button 
                        onClick={() => navigate('/ServicesAdd')}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
                      >
                        Add Your First Service
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Bookings/Work */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Recent Work</h2>
                    <button 
                      onClick={() => navigate("/bookings/my-work")}
                      className="text-red-500 hover:text-red-600 font-medium"
                    >
                      View All Work →
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  {bookingHistory.length > 0 ? (
                    <div className="space-y-4">
                      {bookingHistory.slice(0, 3).map((booking) => (
                        <div key={booking._id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-medium text-gray-800">{booking.title}</h3>
                              <p className="text-sm text-gray-600">
                                for {booking.customer?.fullName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(booking.scheduledDate?.startDate)}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(booking.status)}`}>
                                {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1).replace('_', ' ')}
                              </span>
                              <span className="text-sm font-medium text-green-600">
                                {formatPrice(booking.pricing?.agreedPrice)}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigate(`/bookings/${booking._id}`)}
                              className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition"
                            >
                              View Details
                            </button>
                            {booking.status === 'pending' && (
                              <button
                                onClick={() => navigate(`/bookings/${booking._id}/confirm`)}
                                className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition"
                              >
                                Confirm Booking
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 text-6xl mb-4">💼</div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">No bookings yet</h3>
                      <p className="text-gray-600 mb-4">When customers book your services, they'll appear here</p>
                      <button 
                        onClick={() => navigate('/ServicesAdd')}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                      >
                        Create Your Services
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Featured Artisans (Customer Only) */}
          {userType === 'customer' && featuredArtisans.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Featured Artisans</h2>
                  <button 
                    onClick={() => navigate("/services")}
                    className="text-red-500 hover:text-red-600 font-medium"
                  >
                    View All →
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredArtisans.slice(0, 6).map((artisan) => (
                    <div key={artisan._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                          {artisan.profileImage ? (
                            <img 
                              src={`http://localhost:5000${artisan.profileImage}`} 
                              alt={artisan.businessName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-lg font-bold text-red-500">
                              {(artisan.businessName || artisan.contactName || 'A').charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{artisan.businessName || artisan.contactName}</h3>
                          <p className="text-sm text-gray-600">{artisan.location?.lga || 'Lagos'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <span className="text-yellow-500">⭐</span>
                          <span className="ml-1 font-medium">
                            {artisan.analytics?.averageRating?.toFixed(1) || '5.0'}
                          </span>
                        </div>
                        <button
                          onClick={() => navigate(`/user/${artisan._id}`)}
                          className="text-red-500 hover:text-red-600 font-medium"
                        >
                          View Profile →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-8 mt-auto">
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

export default Dashboard;