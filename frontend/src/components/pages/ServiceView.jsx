// src/components/pages/ServiceView.jsx - Updated with Service Request functionality
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getServiceById } from '../../../../backend/src/api/Services';
import ServiceRequestForm from '../forms/ServiceRequestForm';
import DirectBookingForm from '../forms/DirectBookingForm';

const ServiceView = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userType, logout } = useAuth();
  
  // Service data state
  const [service, setService] = useState(null);
  const [artisan, setArtisan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  
  // Search state (for navbar)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Categories and locations for search
  const categories = [
    'Woodworking', 'Pottery & Ceramics', 'Leathercraft', 'Textile Art', 
    'Jewelry Making', 'Metalwork', 'Glass Art', 'Traditional Clothing',
    'Painting & Drawing', 'Sculpture', 'Basket Weaving', 'Beadwork',
    'Paper Crafts', 'Soap & Candle Making', 'Calabash Carving',
    'Musical Instruments', 'Hair Braiding & Styling', 'Furniture Restoration',
    'Shoemaking', 'Sign Writing', 'Tie & Dye', 'Adire Textile',
    'Food Preservation', 'Batik', 'Embroidery', 'Photography', 'Other'
  ];

  const locations = [
    'Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Badagry',
    'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja',
    'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin',
    'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere', 'Yaba'
  ];

  // Fetch service data
  useEffect(() => {
    const fetchServiceData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('🔍 ServiceView: Fetching service data for ID:', serviceId);
        const response = await getServiceById(serviceId);
        
        if (response && response.success && response.service) {
          setService(response.service);
          setArtisan(response.service.artisan);
          console.log('✅ ServiceView: Service loaded successfully:', response.service.title);
        } else {
          throw new Error('Service not found');
        }
      } catch (err) {
        console.error('❌ ServiceView: Error fetching service:', err);
        setError(err.message || 'Failed to load service details');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (serviceId) {
      fetchServiceData();
    }
  }, [serviceId]);

  // Handle navbar search
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

  // Handle direct booking
  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/services/${serviceId}` } });
      return;
    }

    if (userType !== 'customer') {
      alert('Only customers can book services');
      return;
    }

    setShowBookingForm(true);
  };

  // Handle service request
  const handleRequestQuote = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/services/${serviceId}` } });
      return;
    }

    if (userType !== 'customer') {
      alert('Only customers can request quotes');
      return;
    }

    setShowRequestForm(true);
  };

  // Handle save service
  const handleSaveService = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/services/${serviceId}` } });
      return;
    }
    setIsSaved(!isSaved);
    // TODO: Implement actual save/unsave API call
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get service image URL
  const getServiceImageUrl = (imagePath) => {
    if (!imagePath) return '/api/placeholder/400/300';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  // Handle successful request creation
  const handleRequestSuccess = () => {
    setShowRequestForm(false);
    // Navigate to customer dashboard to see the request
    navigate('/dashboard', { 
      state: { 
        message: 'Service request sent successfully! The artisan will respond soon.',
        type: 'success'
      }
    });
  };

  // Handle successful booking creation
  const handleBookingSuccess = () => {
    setShowBookingForm(false);
    // Navigate to bookings page to see the booking
    navigate('/bookings', {
      state: {
        message: 'Booking created successfully! The artisan will confirm soon.',
        type: 'success'
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Service Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/services')}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
          >
            Browse All Services
          </button>
        </div>
      </div>
    );
  }

  if (!service) return null;

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

              {/* Search Bar - Only for customers or unauthenticated users */}
              {userType !== 'artisan' && (
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
                {isAuthenticated ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate('/login')}>
                      <div>Hello,</div>
                      <div className="font-bold">Sign In</div>
                    </div>
                    <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate('/signup')}>
                      <div>New User?</div>
                      <div className="font-bold">Sign Up</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="bg-black border-y-2 border-red-500 py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <span onClick={() => navigate('/services')} className="hover:text-red-400 cursor-pointer font-medium">All Services</span>
                <span onClick={() => navigate('/services?category=Woodworking')} className="hover:text-red-400 cursor-pointer">Woodworking</span>
                <span onClick={() => navigate('/services?category=Textile Art')} className="hover:text-red-400 cursor-pointer">Textile Art</span>
                <span onClick={() => navigate('/services?category=Pottery & Ceramics')} className="hover:text-red-400 cursor-pointer">Pottery</span>
                <span onClick={() => navigate('/services?category=Jewelry Making')} className="hover:text-red-400 cursor-pointer">Jewelry</span>
              </div>
              <div className="text-sm">
                <span className="text-red-400">Free shipping</span> on orders over ₦50,000
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-600 mb-6">
            <span onClick={() => navigate('/')} className="hover:text-red-500 cursor-pointer">Home</span>
            <span className="mx-2">›</span>
            <span onClick={() => navigate('/services')} className="hover:text-red-500 cursor-pointer">Services</span>
            <span className="mx-2">›</span>
            <span onClick={() => navigate(`/services?category=${service.category}`)} className="hover:text-red-500 cursor-pointer">{service.category}</span>
            <span className="mx-2">›</span>
            <span className="text-gray-800 font-medium">{service.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Images Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Main Image */}
                <div className="relative">
                  <img
                    src={getServiceImageUrl(service.images && service.images[selectedImageIndex] || service.images?.[0])}
                    alt={service.title}
                    className="w-full h-96 object-cover"
                  />
                  {!service.isActive && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
                        Currently Unavailable
                      </span>
                    </div>
                  )}
                </div>

                {/* Thumbnail Images */}
                {service.images && service.images.length > 1 && (
                  <div className="p-4">
                    <div className="flex space-x-2 overflow-x-auto">
                      {service.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                            selectedImageIndex === index ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img 
                            src={getServiceImageUrl(image)} 
                            alt={`${service.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Service Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-800 mb-3">{service.title}</h1>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                        {service.category}
                      </span>
                      <span className="text-gray-600 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {service.locations && service.locations.length > 0 
                          ? service.locations[0].name 
                          : service.location || 'Location TBD'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Service Description</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {service.description || 'No description available for this service.'}
                  </p>
                </div>

                {/* Service Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clipRule="evenodd" />
                      </svg>
                      Price Range
                    </h4>
                    <p className="text-xl font-semibold text-red-500">{service.price || 'Contact for pricing'}</p>
                  </div>
                  
                  {service.duration && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Duration
                      </h4>
                      <p className="text-gray-700 font-medium">{service.duration}</p>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {service.tags && service.tags.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Action Buttons */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Get This Service</h3>
                
                {isAuthenticated ? (
                  userType === 'customer' ? (
                    <div className="space-y-3">
                      {/* Direct Booking Button */}
                      <button
                        onClick={handleBookNow}
                        disabled={!service.isActive}
                        className={`w-full py-3 rounded-lg font-medium transition ${
                          !service.isActive
                            ? 'bg-gray-400 cursor-not-allowed text-white'
                            : 'bg-red-500 hover:bg-red-600 text-white'
                        }`}
                      >
                        📅 Book Now
                      </button>

                      {/* Service Request Button */}
                      <button
                        onClick={handleRequestQuote}
                        className="w-full py-3 rounded-lg font-medium transition bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        💬 Request Custom Quote
                      </button>

                      {/* Save Button */}
                      <button
                        onClick={handleSaveService}
                        className={`w-full py-3 rounded-lg font-medium transition border-2 ${
                          isSaved
                            ? 'border-red-500 text-red-500 bg-red-50 hover:bg-red-100'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-center">
                          <svg className={`w-5 h-5 mr-2 ${isSaved ? 'text-red-500' : 'text-gray-400'}`} 
                               fill={isSaved ? 'currentColor' : 'none'} 
                               stroke="currentColor" 
                               viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                          {isSaved ? 'Saved' : 'Save for Later'}
                        </div>
                      </button>

                      <div className="bg-blue-50 p-3 rounded-lg text-sm">
                        <p className="text-blue-800 font-medium mb-1">💡 What's the difference?</p>
                        <p className="text-blue-700 text-xs">
                          <strong>Book Now:</strong> Direct booking for standard service<br/>
                          <strong>Request Quote:</strong> Discuss custom requirements and get personalized pricing
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-gray-100 rounded-lg">
                      <p className="text-gray-600">Only customers can book services</p>
                      <p className="text-sm text-gray-500 mt-1">Switch to a customer account to book</p>
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => navigate('/login', { state: { from: `/services/${serviceId}` } })}
                    className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition font-medium"
                  >
                    Sign In to Book
                  </button>
                )}

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    💡 By booking, you agree to our Terms of Service
                  </p>
                </div>
              </div>

              {/* Artisan Card */}
              {artisan && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Meet Your Artisan</h3>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                      {artisan.profileImage ? (
                        <img 
                          src={`http://localhost:5000${artisan.profileImage}`} 
                          alt={artisan.contactName || artisan.businessName}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-red-500">
                          {(artisan.contactName || artisan.businessName || 'A').charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {artisan.businessName || artisan.contactName || 'Artisan'}
                      </h4>
                      {artisan.contactName && artisan.businessName && (
                        <p className="text-sm text-gray-600">{artisan.contactName}</p>
                      )}
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {artisan.location?.lga || 'Lagos'}
                      </div>
                    </div>
                  </div>

                  {/* Artisan Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-500">
                        {artisan.analytics?.averageRating?.toFixed(1) || '5.0'}
                      </div>
                      <div className="text-xs text-gray-600">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-500">
                        {artisan.analytics?.completedBookings || '0'}
                      </div>
                      <div className="text-xs text-gray-600">Completed</div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/user/${artisan._id}`)}
                    className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition font-medium"
                  >
                    View Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Service Request Form Modal */}
      {showRequestForm && (
        <ServiceRequestForm
          service={service}
          artisan={artisan}
          onClose={() => setShowRequestForm(false)}
          onSuccess={handleRequestSuccess}
        />
      )}

      {/* Direct Booking Form Modal */}
      {showBookingForm && (
        <DirectBookingForm
          service={service}
          artisan={artisan}
          onClose={() => setShowBookingForm(false)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* Footer */}
      <footer className="bg-black text-white py-8">
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

export default ServiceView;