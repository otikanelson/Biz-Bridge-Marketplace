import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ServiceRequestForm from '../../components/forms/ServiceRequestForm';

// API function to get service by ID
const getServiceById = async (serviceId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/services/${serviceId}`);
    if (!response.ok) {
      throw new Error('Service not found');
    }
    return await response.json();
  } catch (error) {
    console.error('❌ Error fetching service:', error);
    throw error;
  }
};

function ServiceView() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, userType, logout } = useAuth();
  
  const [service, setService] = useState(null);
  const [artisan, setArtisan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Navbar search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Categories and locations for search
  const categories = [
    'Woodworking', 'Pottery', 'Jewelry Making', 'Textile Art', 
    'Leathercraft', 'Metalwork', 'Basket Weaving', 'Beadwork',
    'Calabash Decoration', 'Glass Blowing', 'Leather Shoes', 'Embroidery',
    'Soap Making', 'Candle Making', 'Hair Braiding & Styling'
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
      try {
        setIsLoading(true);
        console.log('🔍 ServiceView: Fetching service data for ID:', serviceId);
        
        const response = await getServiceById(serviceId);
        
        if (response && response.success && response.service) {
          setService(response.service);
          setArtisan(response.service.artisan);
          console.log('✅ ServiceView: Service loaded with pricing structure:', {
            title: response.service.title,
            pricingType: response.service.pricing?.type || 'legacy',
            hasCategories: response.service.pricing?.categories?.length || 0
          });
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

  // Handle service request
  const handleRequestQuote = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/service/${serviceId}` } });
      return;
    }

    if (userType !== 'customer') {
      alert('Only customers can request services');
      return;
    }

    setShowRequestForm(true);
  };

  // Handle save service
  const handleSaveService = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/service/${serviceId}` } });
      return;
    }
    setIsSaved(!isSaved);
    // TODO: Implement actual save/unsave API call
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

    const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Get service image URL with proper path construction
  const getServiceImageUrl = (imagePath) => {
    if (!imagePath) return '/api/placeholder/400/300';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3000${imagePath}`;
  };

  // Get artisan profile image URL
  const getProfileImageUrl = (imagePath) => {
    if (!imagePath) return '/api/placeholder/80/80';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3000${imagePath}`;
  };

  // Get all service images
  const getServiceImages = () => {
    if (!service) return ['/api/placeholder/400/300'];
    
    const images = service.images || [];
    if (images.length === 0 && service.image) {
      return [getServiceImageUrl(service.image)];
    }
    
    return images.length > 0 
      ? images.map(img => getServiceImageUrl(img))
      : ['/api/placeholder/400/300'];
  };

  // Enhanced pricing display component
  const PricingDisplay = () => {
    if (!service?.pricing) {
      return (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Pricing</h3>
          <div className="text-xl font-bold text-gray-900">Contact for Pricing</div>
          <p className="text-sm text-gray-600">Custom quote required</p>
        </div>
      );
    }

    const { pricing } = service;

    switch (pricing.type) {
      case 'fixed':
        return (
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-900">Fixed Pricing</h3>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Fixed Price
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              ₦{pricing.basePrice ? Number(pricing.basePrice).toLocaleString() : 'Contact for pricing'}
            </div>
            <p className="text-sm text-gray-600">
              Duration: {pricing.baseDuration || 'To be discussed'}
            </p>
          </div>
        );

      case 'negotiate':
        return (
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-900">Negotiable Pricing</h3>
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                Negotiable
              </span>
            </div>
            <div className="text-xl font-bold text-gray-900 mb-1">Contact for Pricing</div>
            <p className="text-sm text-gray-600">
              Price will be negotiated based on your specific requirements
            </p>
          </div>
        );

      case 'categorized':
        const categories = pricing.categories || [];
        const prices = categories.map(cat => cat.price).filter(Boolean);
        const minPrice = prices.length > 0 ? Math.min(...prices) : null;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

        return (
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-900">Category-Based Pricing</h3>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                  Categories
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  ⭐ Protected
                </span>
              </div>
            </div>
            
            {minPrice && maxPrice ? (
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {minPrice === maxPrice 
                  ? `₦${minPrice.toLocaleString()}`
                  : `₦${minPrice.toLocaleString()} - ₦${maxPrice.toLocaleString()}`
                }
              </div>
            ) : (
              <div className="text-xl font-bold text-gray-900 mb-1">Contact for Pricing</div>
            )}
            
            <p className="text-sm text-gray-600 mb-3">
              {categories.length} categories available with fixed pricing
            </p>

            {/* Category List */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Available Categories:</h4>
              {categories.slice(0, 3).map((category, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">{category.name}</span>
                  <span className="font-medium text-gray-900">
                    ₦{Number(category.price).toLocaleString()} - {category.duration}
                  </span>
                </div>
              ))}
              {categories.length > 3 && (
                <p className="text-xs text-gray-500">+{categories.length - 3} more categories</p>
              )}
            </div>

            {/* Enhanced Protection Notice */}
            <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
              <p className="text-xs text-blue-800">
                <strong>Enhanced Protection:</strong> Category prices are fixed and protected by BizBridge's dispute resolution system.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Pricing</h3>
            <div className="text-xl font-bold text-gray-900">Contact for Pricing</div>
            <p className="text-sm text-gray-600">Custom quote required</p>
          </div>
        );
    }
  };

  // Handle successful request creation
  const handleRequestSuccess = () => {
    setShowRequestForm(false);
    // Navigate to customer dashboard to see the request
    navigate('/dashboard', { 
      state: { 
        message: 'Service request sent successfully! The artisan will respond soon.'
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/services')}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Browse Services
          </button>
        </div>
      </div>
    );
  }

  const serviceImages = getServiceImages();

  return (
    <div className="flex flex-col min-h-screen">
      {/* ✅ AMAZON-STYLE HEADER WITH SEARCH BAR */}
      <header className="bg-black text-white w-full top-0 z-10 fixed">
        {/* Main Header */}
        <div className="py-2">
          <div className="container mx-auto px-4 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <span className="text-red-500 text-4xl select-none font-bold">𐐒</span>
              <span className="text-white text-3xl select-none font-bold">B</span>
              <span className="text-red-500 text-lg select-none font-semibold ml-3">BizBridge</span>
            </div>

            {/* ✅ AMAZON-STYLE SEARCH BAR */}
            <div className="flex-1 max-w-3xl mx-8">
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

            {/* Account & Navigation */}
            <div className="flex items-center space-x-6">
              {!isAuthenticated ? (
                <>
                  <div className="text-center cursor-pointer hover:text-red-400" onClick={() => navigate('/login')}>
                    <div className="text-xs">Hey, sign up/in</div>
                    <div className="text-sm font-bold">to Book a service</div>
                  </div>
                  <div className="text-center cursor-pointer hover:text-red-400" onClick={() => navigate('/signup?type=artisan')}>
                    <div className="text-xs">Get your</div>
                    <div className="text-sm font-bold">Professional service listed</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <div className="text-xs">Hello, {userType}</div>
                    <div className="text-sm font-bold">Dashboard</div>
                  </div>
                  {userType === 'customer' && (
                    <div className="text-center cursor-pointer" onClick={() => navigate('/bookings')}>
                      <div className="text-xs">Your</div>
                      <div className="text-sm font-bold">Bookings</div>
                    </div>
                  )}
                  {userType === 'artisan' && (
                    <div className="text-center cursor-pointer" onClick={() => navigate('/ServicesManagement')}>
                      <div className="text-xs">Your</div>
                      <div className="text-sm font-bold">Services</div>
                    </div>
                  )}
                  <div className="text-center cursor-pointer" onClick={handleLogout}>
                    <div className="text-xs">Sign</div>
                    <div className="text-sm font-bold">Out</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

      </header>

      {/* Main Content */}
      <div className="bg-gray-50 flex-grow pt-32">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="text-sm">
              <span onClick={() => navigate('/services')} className="text-red-600 hover:text-red-800 cursor-pointer">
                Services
              </span>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-600">{service?.category}</span>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-900">{service?.title}</span>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Service Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Service Images */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="relative">
                  <img
                    src={serviceImages[selectedImageIndex]}
                    alt={service?.title}
                    className="w-full h-96 object-cover"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/800/400';
                    }}
                  />
                  
                  {/* Image Navigation */}
                  {serviceImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : serviceImages.length - 1)}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => setSelectedImageIndex(selectedImageIndex < serviceImages.length - 1 ? selectedImageIndex + 1 : 0)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                      >
                        →
                      </button>
                    </>
                  )}
                </div>

                {/* Image Thumbnails */}
                {serviceImages.length > 1 && (
                  <div className="p-4 flex space-x-2 overflow-x-auto">
                    {serviceImages.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${service?.title} ${index + 1}`}
                        className={`w-16 h-16 object-cover rounded cursor-pointer ${
                          index === selectedImageIndex ? 'ring-2 ring-red-500' : ''
                        }`}
                        onClick={() => setSelectedImageIndex(index)}
                        onError={(e) => {
                          e.target.src = '/api/placeholder/64/64';
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Service Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{service?.title}</h1>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {service?.category}
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSaveService}
                    className={`p-2 rounded-full ${
                      isSaved ? 'text-red-600' : 'text-gray-400 hover:text-red-600'
                    }`}
                  >
                    <svg className="w-6 h-6" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                {/* Service Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{service?.description}</p>
                </div>

                {/* Service Locations */}
                {service?.locations && service.locations.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Service Areas</h3>
                    <div className="flex flex-wrap gap-2">
                      {service.locations.map((location, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {location.name || location.lga || location}
                          {location.type === 'locality' && location.lga && (
                            <span className="text-gray-500 ml-1">({location.lga})</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* NO PAYMENT PROCESSING WARNING */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="text-yellow-600">
                    <svg className="w-6 h-6 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Important Payment Notice</h3>
                    <div className="text-sm text-yellow-700 mt-1">
                      <p><strong>BizBridge does not process payments.</strong> All payment arrangements and transactions are made directly between you and the artisan. We facilitate connections and provide dispute resolution support where applicable.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Pricing and Action */}
            <div className="space-y-6">
              {/* Pricing Display */}
              <PricingDisplay />

              {/* Artisan Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Artisan</h3>
                
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={getProfileImageUrl(artisan?.profileImage)}
                    alt={artisan?.contactName || artisan?.businessName}
                    className="w-16 h-16 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/64/64';
                    }}
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {artisan?.businessName || artisan?.contactName}
                    </h4>
                    <p className="text-sm text-gray-600">{artisan?.contactName}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {artisan?.city || 'Lagos'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/profile/${artisan?._id}`)}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition"
                >
                  View Artisan Profile
                </button>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleRequestQuote}
                  className="w-full bg-red-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-600 transition"
                >
                  {service?.pricing?.type === 'negotiate' ? 'Request Quote' : 'Request This Service'}
                </button>
                
                <button
                  onClick={handleSaveService}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition"
                >
                  {isSaved ? 'Saved ❤️' : 'Save for Later'}
                </button>
              </div>

              {/* Platform Responsibility Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Platform Support</h4>
                <p className="text-xs text-blue-700">
                  {service?.pricing?.type === 'categorized' 
                    ? 'Enhanced dispute resolution and price protection available for this service.'
                    : service?.pricing?.type === 'fixed'
                    ? 'Basic dispute mediation available based on agreed terms.'
                    : 'Platform facilitates communication only - all negotiations between parties.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Request Form Modal */}
      {showRequestForm && (
        <ServiceRequestForm
          service={service}
          artisan={artisan}
          onClose={() => setShowRequestForm(false)}
          onSuccess={handleRequestSuccess}
        />
      )}
    </div>
  );
}

export default ServiceView;