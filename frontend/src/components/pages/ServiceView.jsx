import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BookingForm from '../forms/BookingForm';
import { getServiceById } from '../../api/Services';

const ServiceView = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, userType, logout } = useAuth();
  
  // Data states
  const [service, setService] = useState(null);
  const [artisan, setArtisan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI states
  const [isSaved, setIsSaved] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch service data
  useEffect(() => {
    const fetchServiceData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Fetching service with ID:', serviceId);
        const response = await getServiceById(serviceId);
        
        if (response && response.success && response.service) {
          setService(response.service);
          setArtisan(response.service.artisan);
          console.log('Service loaded successfully:', response.service);
        } else {
          throw new Error('Service not found');
        }
      } catch (err) {
        console.error('Error fetching service:', err);
        setError(err.message || 'Failed to load service. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (serviceId) {
      fetchServiceData();
    }
  }, [serviceId]);

  // Handle booking button click
  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/services/${serviceId}` } });
      return;
    }

    if (userType === 'artisan') {
      alert('As an artisan, you cannot book services.');
      return;
    }

    setShowBookingForm(true);
  };

  // Handle save/unsave service
  const handleSaveService = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/services/${serviceId}` } });
      return;
    }

    setIsSaved(!isSaved);
    // In a real app, make API call to save/unsave
  };

  // Handle show contact info
  const handleShowContact = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/services/${serviceId}` } });
      return;
    }
    
    setShowContactInfo(true);
  };

  // Handle view artisan profile
  const handleViewArtisan = () => {
    if (artisan && artisan._id) {
      navigate(`/artisan/${artisan._id}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading) {
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
              <span onClick={() => navigate('/')} className="hover:text-red-400 cursor-pointer">Home</span>
              {isAuthenticated ? (
                <span onClick={() => navigate('/dashboard')} className="hover:text-red-400 cursor-pointer">Dashboard</span>
              ) : (
                <>
                  <span onClick={() => navigate('/login')} className="hover:text-red-400 cursor-pointer">Login</span>
                  <span onClick={() => navigate('/signup')} className="hover:text-red-400 cursor-pointer">Sign Up</span>
                </>
              )}
            </nav>
          </div>
        </header>
        
        <div className="flex justify-center items-center flex-grow">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
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
              <span onClick={() => navigate('/')} className="hover:text-red-400 cursor-pointer">Home</span>
              <span onClick={() => navigate('/dashboard')} className="hover:text-red-400 cursor-pointer">Dashboard</span>
            </nav>
          </div>
        </header>
        
        <div className="container mx-auto px-4 py-16 text-center flex-grow">
          <div className="bg-red-50 p-8 rounded-lg inline-block">
            <svg className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold mb-2">Error Loading Service</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-2">Service Not Found</h2>
          <p className="text-gray-700">The service you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-6 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

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
            <span onClick={() => navigate('/')} className="hover:text-red-400 cursor-pointer">Home</span>
            {isAuthenticated ? (
              <>
                <span onClick={() => navigate('/dashboard')} className="hover:text-red-400 cursor-pointer">Dashboard</span>
                <span onClick={handleLogout} className="hover:text-red-400 cursor-pointer">Logout</span>
              </>
            ) : (
              <>
                <span onClick={() => navigate('/login')} className="hover:text-red-400 cursor-pointer">Login</span>
                <span onClick={() => navigate('/signup')} className="hover:text-red-400 cursor-pointer">Sign Up</span>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="bg-gray-50 flex-grow py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <span className="hover:text-red-500 cursor-pointer" onClick={() => navigate('/')}>Home</span>
            <span className="mx-2">/</span>
            <span className="hover:text-red-500 cursor-pointer" onClick={() => navigate('/dashboard')}>Services</span>
            <span className="mx-2">/</span>
            <span className="text-gray-700">{service.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Service Details */}
            <div className="lg:col-span-2">
              {/* Service Images */}
              <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
                <div className="h-96 bg-gray-200 relative">
                  {service.images && service.images.length > 0 ? (
                    <img 
                      src={service.images[selectedImageIndex]} 
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <div className="text-center">
                        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500 mt-2">No image available</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Image Thumbnails */}
                {service.images && service.images.length > 1 && (
                  <div className="flex space-x-2 p-4 overflow-x-auto">
                    {service.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${service.title} ${index + 1}`}
                        className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                          selectedImageIndex === index ? 'border-red-500' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Service Information */}
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                        {service.category}
                      </span>
                      <span className="text-gray-600 text-sm">
                        {service.locations && service.locations.length > 0 
                          ? service.locations.map(loc => loc.name).join(', ')
                          : 'Location not specified'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-500 mb-2">
                      {service.price}
                    </div>
                    {service.duration && (
                      <div className="text-sm text-gray-600">
                        Duration: {service.duration}
                      </div>
                    )}
                  </div>
                </div>

                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {service.description}
                  </p>
                </div>

                {/* Tags */}
                {service.tags && service.tags.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {service.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Service Details Grid */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded">
                    <h4 className="font-medium text-gray-900 mb-1">Price Range</h4>
                    <p className="text-lg font-semibold text-red-500">{service.price}</p>
                  </div>
                  
                  {service.duration && (
                    <div className="bg-gray-50 p-4 rounded">
                      <h4 className="font-medium text-gray-900 mb-1">Duration</h4>
                      <p className="text-gray-700">{service.duration}</p>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 p-4 rounded">
                    <h4 className="font-medium text-gray-900 mb-1">Service Locations</h4>
                    <p className="text-gray-700">
                      {service.locations && service.locations.length > 0 
                        ? service.locations.map(loc => loc.name).join(', ')
                        : 'Available on request'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded">
                    <h4 className="font-medium text-gray-900 mb-1">Status</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      service.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {service.isActive ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Booking and Artisan Info */}
            <div className="lg:col-span-1">
              {/* Booking Card */}
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Book This Service</h2>
                
                <div className="mb-4">
                  <div className="text-3xl font-bold text-red-500 mb-2">
                    {service.price}
                  </div>
                  {service.duration && (
                    <div className="text-sm text-gray-600">
                      Estimated Duration: {service.duration}
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium text-green-700">
                      {service.isActive ? 'Available for Booking' : 'Currently Unavailable'}
                    </span>
                  </div>
                </div>

                {service.isActive && (
                  <>
                    <button
                      onClick={handleBookNow}
                      className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition mb-3"
                    >
                      Book Now
                    </button>

                    <button
                      onClick={handleSaveService}
                      className={`w-full py-3 px-4 rounded-lg border transition flex justify-center items-center ${
                        isSaved
                          ? 'border-red-500 text-red-500 hover:bg-red-50'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <svg className={`h-5 w-5 mr-2 ${isSaved ? 'text-red-500' : 'text-gray-400'}`} 
                           fill={isSaved ? 'currentColor' : 'none'} 
                           stroke="currentColor" 
                           viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      {isSaved ? 'Saved' : 'Save for Later'}
                    </button>
                  </>
                )}
              </div>

              {/* Artisan Info Card */}
              {artisan && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">About the Artisan</h2>
                  
                  <div className="flex items-center mb-4">
                    <img
                      src={artisan.profileImage || ''}
                      alt={artisan.businessName || artisan.contactName}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/64?text=Profile';
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-lg">
                        {artisan.businessName || artisan.contactName}
                      </h3>
                      <p className="text-gray-600">{artisan.contactName}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {artisan.localGovernmentArea && (
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{artisan.localGovernmentArea}, {artisan.city || 'Lagos'}</p>
                        </div>
                      </div>
                    )}

                    {artisan.yearEstablished && (
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-500">Established</p>
                          <p className="font-medium">{artisan.yearEstablished}</p>
                        </div>
                      </div>
                    )}

                    {artisan.isCACRegistered && (
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-500">Verification</p>
                          <p className="font-medium text-green-600">CAC Registered</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleShowContact}
                      className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition"
                    >
                      Contact Artisan
                    </button>
                    
                    <button
                      onClick={handleViewArtisan}
                      className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 transition"
                    >
                      View Full Profile
                    </button>
                  </div>

                  {/* Contact Info Modal */}
                  {showContactInfo && artisan.phoneNumber && (
                    <div className="mt-4 bg-blue-50 p-4 rounded">
                      <h4 className="font-semibold text-blue-800 mb-2">Contact Information</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-500">Phone:</span>
                          <span className="ml-2 font-medium">{artisan.phoneNumber}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Email:</span>
                          <span className="ml-2 font-medium">{artisan.email}</span>
                        </div>
                        {artisan.address && (
                          <div>
                            <span className="text-gray-500">Address:</span>
                            <span className="ml-2 font-medium">{artisan.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <BookingForm 
              service={service}
              artisan={artisan}
              onClose={() => setShowBookingForm(false)}
              onSuccess={(booking) => {
                console.log('Booking successful:', booking);
                setShowBookingForm(false);
                // You can add success handling here
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceView;