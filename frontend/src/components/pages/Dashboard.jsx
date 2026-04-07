import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { API_URL } from "../../api/config";

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
      setTimeout(() => setSuccessMessage(''), 3000);
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
      const bookingsResponse = await fetch(`${API_URL}/bookings/my-bookings?limit=5`, {
        headers
      });
      
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookingHistory(bookingsData.bookings || []);
      }

      // Load customer service requests
      const requestsResponse = await fetch(`${API_URL}/service-requests/my-requests?limit=5`, {
        headers
      });
      
      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        setServiceRequests(requestsData.serviceRequests || []);
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
      const bookingsResponse = await fetch(`${API_URL}/bookings/my-work?limit=5`, {
        headers
      });
      
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookingHistory(bookingsData.bookings || []);
      }

      // Load incoming service requests
      const requestsResponse = await fetch(`${API_URL}/service-requests/inbox?limit=5`, {
        headers
      });
      
      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        setServiceRequests(requestsData.serviceRequests || []);
      }

      // Load artisan's services
      const servicesResponse = await fetch(`${API_URL}/services/my-services`, {
        headers
      });
      
      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
        setServices(servicesData.services || []);
      }

      // Load booking analytics
      const analyticsResponse = await fetch(`${API_URL}/bookings/analytics`, {
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
                    {/* Category Selector */}
                    <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-gray-200 text-black px-3 py-2 rounded-l-md border-r border-gray-300 focus:outline-none text-sm min-w-[140px]"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    
                    {/* Search Input */}
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Search for services, artisans, or crafts..."
                      className="flex-1 px-4 py-2 text-black focus:outline-none text-sm"
                    />
                    
                    {/* Location Selector */}
                    <select 
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="bg-gray-200 text-black px-3 py-2 border-l border-gray-300 focus:outline-none text-sm min-w-[120px]"
                    >
                      <option value="">All LGAs</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                    
                    {/* Search Button */}
                    <button 
                      onClick={handleSearch}
                      className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-r-md transition"
                    >
                      <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* User Menu */}
              <div className="flex items-center space-x-6">

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
                      View All Bookings→
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
                      onClick={() => navigate("/customer-requests/history")}
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
              {serviceRequests.filter(r => r.status === 'pending').length}
            </p>
          </div>
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">📬</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Work</p>
            <p className="text-3xl font-bold text-gray-900">
              {bookingHistory.filter(b => ['confirmed', 'in_progress'].includes(b.status)).length}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🔨</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Completed Jobs</p>
            <p className="text-3xl font-bold text-gray-900">
              {bookingHistory.filter(b => b.status === 'completed').length}
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">✅</span>
          </div>
        </div>
      </div>
    </div>

    {/* Your Services Section */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Your Services</h2>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/ServicesManagement')}
              className="text-red-500 hover:text-red-600 font-medium text-sm"
            >
              Manage All →
            </button>
            <button 
              onClick={() => navigate('/ServicesAdd')}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm"
            >
              + Add Service
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {services.length > 0 ? (
          <div>
            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {services.slice(0, 6).map((service) => (
                <div key={service._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  {/* Service Image */}
                <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  {service.images && service.images.length > 0 ? (
                    <img 
                      src={(() => {
                        const imagePath = service.images[0];
                        const BASE = API_URL.replace('/api', '');
                        // Handle different image path formats
                        if (imagePath.startsWith('http')) {
                          return imagePath;
                        } else if (imagePath.startsWith('/uploads')) {
                          return `${BASE}${imagePath}`;
                        } else if (imagePath.startsWith('uploads/')) {
                          return `${BASE}/${imagePath}`;
                        } else {
                          return `${BASE}/uploads/${imagePath}`;
                        }
                      })()} 
                      alt={service.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback when image fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  
                  {/* Fallback placeholder - always present but hidden when image loads */}
                  <div 
                    className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100"
                    style={{ display: (service.images && service.images.length > 0) ? 'none' : 'flex' }}
                  >
                    <div className="text-center">
                      <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs">{service.category || 'Service'}</span>
                    </div>
                  </div>
                </div>
                  {/* Service Info */}
                  <div className="mb-3">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                        {service.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        service.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-2">
                      {service.category} • {service.location?.lga || 'Lagos'}
                    </p>
                    
                    {/* Pricing Display */}
                    <div className="mb-2">
                      {service.pricing?.type === 'fixed' && service.pricing?.basePrice && (
                        <p className="text-sm font-medium text-green-600">
                          ₦{service.pricing.basePrice.toLocaleString()}
                        </p>
                      )}
                      {service.pricing?.type === 'negotiate' && (
                        <p className="text-sm font-medium text-blue-600">
                          Price Negotiable
                        </p>
                      )}
                      {service.pricing?.type === 'categorized' && (
                        <p className="text-sm font-medium text-purple-600">
                          Category-Based Pricing
                        </p>
                      )}
                      {(!service.pricing || !service.pricing.type) && service.displayPrice && (
                        <p className="text-sm font-medium text-green-600">
                          {service.displayPrice}
                        </p>
                      )}
                    </div>

                    {/* Service Stats */}
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{service.requestCount || 0} requests</span>
                      <span>{service.viewCount || 0} views</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/services/${service._id}`)}
                      className="flex-1 text-xs bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/services/${service._id}/edit`)}
                      className="flex-1 text-xs bg-blue-100 text-blue-700 px-3 py-2 rounded hover:bg-blue-200 transition"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Service Analytics Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Service Performance Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {services.reduce((sum, s) => sum + (s.viewCount || 0), 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Views</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {services.reduce((sum, s) => sum + (s.requestCount || 0), 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Requests</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {(services.reduce((sum, s) => sum + (s.rating || 0), 0) / services.length || 0).toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {services.filter(s => s.isActive).length}/{services.length}
                  </p>
                  <p className="text-sm text-gray-600">Active Services</p>
                </div>
              </div>
            </div>

            {services.length > 6 && (
              <div className="text-center mt-4">
                <button 
                  onClick={() => navigate('/ServicesManagement')}
                  className="text-red-500 hover:text-red-600 font-medium"
                >
                  View All {services.length} Services →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No services yet</h3>
            <p className="text-gray-600 mb-6">Start showcasing your skills by creating your first service listing</p>
            <button 
              onClick={() => navigate('/ServicesAdd')}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
            >
              Create Your First Service
            </button>
          </div>
        )}
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
            View All →
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {serviceRequests.length > 0 ? (
          <div className="space-y-4">
            {serviceRequests.slice(0, 4).map((request) => (
              <div key={request._id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 mb-1">
                      {request.title || request.service?.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      from {request.customer?.fullName}
                    </p>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {request.description}
                    </p>
                  </div>
                  <div className="ml-4 text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'quoted' ? 'bg-blue-100 text-blue-800' :
                      request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
                    </span>
                    {request.budget && (
                      <p className="text-sm font-medium text-green-600 mt-1">
                        {request.budget.min && request.budget.max 
                          ? `₦${request.budget.min.toLocaleString()} - ₦${request.budget.max.toLocaleString()}`
                          : request.budget.min 
                          ? `From ₦${request.budget.min.toLocaleString()}`
                          : request.budget.max 
                          ? `Up to ₦${request.budget.max.toLocaleString()}`
                          : 'Budget TBD'
                        }
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    {formatDate(request.createdAt)}
                  </p>
                  <div className="flex gap-2">
                    {request.status === 'pending' && (
                      <button
                        onClick={() => navigate(`/service-requests/inbox`)}
                        className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition"
                      >
                        Respond
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/service-requests/${request._id}`)}
                      className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">📬</div>
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

    {/* Recent Work/Bookings */}
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
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/bookings/${booking._id}`)}
                    className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => navigate(`/messages/${booking._id}`)}
                    className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition"
                  >
                    Message Customer
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">🔨</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-4">Confirmed bookings and active work will appear here</p>
            <button 
              onClick={() => navigate('/ServicesAdd')}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Create Services to Get Started
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
                              src={`${API_URL.replace('/api', '')}${artisan.profileImage}`} 
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
