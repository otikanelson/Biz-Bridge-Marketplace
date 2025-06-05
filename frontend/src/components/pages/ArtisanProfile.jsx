import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ServiceCard from '../cards/ServiceCard';
import { getArtisanServices } from '../../api/Services';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const ArtisanProfile = () => {
  const { artisanId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, userType, logout } = useAuth();
  
  // Data states
  const [artisan, setArtisan] = useState(null);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI states
  const [isSaved, setIsSaved] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [activeTab, setActiveTab] = useState('services');

  // Fetch artisan profile data
  const fetchArtisanProfile = async () => {
    try {
      console.log('Fetching artisan profile for ID:', artisanId);
      
      // Get artisan details from users collection
      const response = await axios.get(`${API_URL}/users/${artisanId}`);
      
      if (response.data && response.data.success) {
        setArtisan(response.data.user);
        console.log('Artisan profile loaded:', response.data.user);
      } else {
        throw new Error('Artisan not found');
      }
    } catch (err) {
      console.error('Error fetching artisan profile:', err);
      
      // If API route doesn't exist, create mock data for now
      const mockArtisan = {
        _id: artisanId,
        contactName: 'John Adebayo',
        businessName: 'Premium Woodworks',
        email: 'john@premiumwoodworks.com',
        phoneNumber: '+234 123 456 7890',
        profileImage: '',
        address: '123 Craftsman Avenue, Lekki, Lagos',
        city: 'Lagos',
        localGovernmentArea: 'Eti-Osa',
        yearEstablished: 2018,
        staffStrength: '1-10',
        isCACRegistered: true,
        websiteURL: 'https://premiumwoodworks.com',
        role: 'artisan',
        createdAt: '2025-01-15T10:30:00.000Z',
        description: 'Premium Woodworks specializes in creating high-quality custom wooden furniture using traditional techniques and locally-sourced materials. With over 7 years of experience, we take pride in our craftsmanship and attention to detail.',
        specialties: ['Custom Furniture', 'Wood Carving', 'Furniture Restoration', 'Cabinet Making'],
        businessHours: 'Monday - Friday: 9AM - 5PM, Saturday: 10AM - 2PM',
        averageRating: 4.8,
        totalReviews: 12
      };
      
      setArtisan(mockArtisan);
    }
  };

  // Fetch artisan services
  const fetchArtisanServices = async () => {
    try {
      console.log('Fetching services for artisan:', artisanId);
      const response = await getArtisanServices(artisanId, true); // Only active services
      
      if (response && response.success) {
        setServices(response.services || []);
        console.log('Artisan services loaded:', response.services?.length || 0);
      }
    } catch (err) {
      console.error('Error fetching artisan services:', err);
      
      // Mock services data
      const mockServices = [
        {
          _id: 's1',
          title: 'Custom Wooden Furniture',
          description: 'Handcrafted wooden furniture made to your specifications.',
          category: 'Woodworking',
          price: 'From ₦50,000',
          duration: '2-4 weeks',
          location: 'Lagos',
          images: [],
          isActive: true,
          artisan: artisanId
        },
        {
          _id: 's2',
          title: 'Wood Carving',
          description: 'Detailed wood carvings for decorative items and sculptures.',
          category: 'Woodworking',
          price: 'From ₦15,000',
          duration: '1-2 weeks',
          location: 'Lagos',
          images: [],
          isActive: true,
          artisan: artisanId
        },
        {
          _id: 's3',
          title: 'Furniture Restoration',
          description: 'Restore and refresh your old furniture to bring back its original beauty.',
          category: 'Woodworking',
          price: 'From ₦25,000',
          duration: '1-3 weeks',
          location: 'Lagos',
          images: [],
          isActive: true,
          artisan: artisanId
        }
      ];
      
      setServices(mockServices);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        await Promise.all([
          fetchArtisanProfile(),
          fetchArtisanServices()
        ]);
      } catch (err) {
        setError('Failed to load profile data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (artisanId) {
      loadProfileData();
    }
  }, [artisanId]);

  // Handle save/unsave artisan
  const handleSaveArtisan = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/artisan/${artisanId}` } });
      return;
    }
    
    setIsSaved(!isSaved);
    // In a real app, make API call to save/unsave
  };

  // Handle show contact info
  const handleShowContact = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/artisan/${artisanId}` } });
      return;
    }
    
    setShowContactInfo(true);
  };

  // Handle view service
  const handleViewService = (service) => {
    navigate(`/services/${service._id || service.id}`);
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
            <h2 className="text-2xl font-bold mb-2">Error Loading Profile</h2>
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

  if (!artisan) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-2">Artisan Not Found</h2>
          <p className="text-gray-700">The artisan profile you're looking for doesn't exist.</p>
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
      <div className="bg-gray-50 flex-grow">
        {/* Cover Image */}
        <div className="h-64 bg-gradient-to-r from-red-500 to-red-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h1 className="text-3xl font-bold">{artisan.businessName}</h1>
            <p className="text-xl opacity-90">{artisan.contactName}</p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 -mt-16 relative z-10">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <div className="flex flex-col md:flex-row">
                {/* Profile Image */}
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                  <img 
                    src={artisan.profileImage || 'https://via.placeholder.com/128?text=Profile'} 
                    alt={artisan.businessName} 
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white object-cover shadow-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/128?text=Profile';
                    }}
                  />
                </div>
                
                {/* Profile Info */}
                <div className="flex-grow">
                  <div className="flex flex-wrap justify-between items-start">
                    <div className="mb-4">
                      <h1 className="text-2xl font-bold mb-1">{artisan.businessName}</h1>
                      <p className="text-gray-600 mb-2">{artisan.contactName}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        {artisan.localGovernmentArea && (
                          <div className="flex items-center text-gray-700">
                            <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{artisan.localGovernmentArea}, {artisan.city}</span>
                          </div>
                        )}
                        
                        {artisan.yearEstablished && (
                          <div className="flex items-center text-gray-700">
                            <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Since {artisan.yearEstablished}</span>
                          </div>
                        )}
                        
                        {artisan.averageRating && (
                          <div className="flex items-center text-gray-700">
                            <svg className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span>{artisan.averageRating} ({artisan.totalReviews} reviews)</span>
                          </div>
                        )}
                        
                        {artisan.isCACRegistered && (
                          <div className="flex items-center text-green-600">
                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>CAC Verified</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={handleSaveArtisan}
                        className={`p-2 rounded-full ${
                          isSaved ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-500'
                        } hover:bg-gray-200 transition focus:outline-none`}
                      >
                        <svg 
                          className="h-6 w-6" 
                          fill={isSaved ? 'currentColor' : 'none'} 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                      
                      <button 
                        onClick={handleShowContact}
                        className="bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition"
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                  
                  {artisan.description && (
                    <div className="mt-4">
                      <h2 className="font-semibold mb-2">About</h2>
                      <p className="text-gray-700 leading-relaxed">{artisan.description}</p>
                    </div>
                  )}
                  
                  {artisan.specialties && artisan.specialties.length > 0 && (
                    <div className="mt-4">
                      <h2 className="font-semibold mb-2">Specialties</h2>
                      <div className="flex flex-wrap gap-2">
                        {artisan.specialties.map((specialty, index) => (
                          <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Contact Info (shown when requested) */}
              {showContactInfo && (
                <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-blue-800">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {artisan.phoneNumber && (
                      <div>
                        <p className="text-gray-500">Phone Number</p>
                        <p className="font-medium">{artisan.phoneNumber}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium">{artisan.email}</p>
                    </div>
                    {artisan.address && (
                      <div>
                        <p className="text-gray-500">Address</p>
                        <p className="font-medium">{artisan.address}</p>
                      </div>
                    )}
                    {artisan.businessHours && (
                      <div>
                        <p className="text-gray-500">Business Hours</p>
                        <p className="font-medium">{artisan.businessHours}</p>
                      </div>
                    )}
                    {artisan.websiteURL && (
                      <div>
                        <p className="text-gray-500">Website</p>
                        <a href={artisan.websiteURL} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                          {artisan.websiteURL}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Profile Tabs */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('services')}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeTab === 'services'
                      ? 'border-b-2 border-red-500 text-red-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Services ({services.length})
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeTab === 'about'
                      ? 'border-b-2 border-red-500 text-red-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  About Business
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeTab === 'reviews'
                      ? 'border-b-2 border-red-500 text-red-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Reviews
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              {/* Services Tab */}
              {activeTab === 'services' && (
                <div>
                  {services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {services.map(service => (
                        <ServiceCard 
                          key={service._id || service.id} 
                          service={service}
                          onClick={handleViewService}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <h3 className="mt-2 text-lg font-medium text-gray-900">No Services Available</h3>
                      <p className="mt-1 text-gray-500">
                        This artisan hasn't listed any services yet.
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {/* About Tab */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {artisan.yearEstablished && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-1">Year Established</h4>
                        <p className="text-gray-700">{artisan.yearEstablished}</p>
                      </div>
                    )}
                    
                    {artisan.staffStrength && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-1">Team Size</h4>
                        <p className="text-gray-700">{artisan.staffStrength} employees</p>
                      </div>
                    )}
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-1">Registration Status</h4>
                      <p className="text-gray-700">
                        {artisan.isCACRegistered ? 'CAC Registered Business' : 'Individual Artisan'}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-1">Member Since</h4>
                      <p className="text-gray-700">
                        {new Date(artisan.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long' 
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {artisan.description && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Business Description</h4>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {artisan.description}
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Reviews Coming Soon</h3>
                  <p className="mt-1 text-gray-500">
                    Customer reviews and ratings will be displayed here.
                  </p>
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
    </div>
  );
};

export default ArtisanProfile;