import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, userType, logout } = useAuth();
  
  // Data states
  const [user, setUser] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [savedArtisans, setSavedArtisans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI states
  const [activeTab, setActiveTab] = useState('profile');

  // Fetch user profile data
  const fetchProfile = async () => {
    try {
      console.log('Fetching user profile for ID:', userId);
      
      // Get user details from users collection
      const response = await axios.get(`${API_URL}/users/${userId}`);
      
      if (response.data && response.data.success) {
        setUser(response.data.user);
        console.log('User profile loaded:', response.data.user);
      } else {
        throw new Error('User not found');
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      
      // If API route doesn't exist, create mock data for now
      const mockUser = {
        _id: userId,
        username: 'john_customer',
        email: 'john@example.com',
        fullName: 'John Doe',
        profileImage: '',
        role: 'customer',
        createdAt: '2025-01-15T10:30:00.000Z',
        bio: 'I love supporting local artisans and finding unique handcrafted items for my home. Always looking for quality craftsmanship and authentic pieces.',
        location: 'Lagos, Nigeria',
        joinedDate: '2025-01-15T10:30:00.000Z',
        totalBookings: 8,
        totalSpent: 450000,
        favoriteCategories: ['Woodworking', 'Pottery & Ceramics', 'Textile Art'],
        phoneNumber: '+234 800 123 4567',
        preferences: {
          notifications: true,
          publicProfile: true,
          showBookings: false
        }
      };
      
      setUser(mockUser);
    }
  };

  // Fetch user bookings
  const fetchUserBookings = async () => {
    try {
      // In a real app, this would be an API call
      // For now, simulate with mock data
      const mockBookings = [
        {
          id: 'b001',
          serviceName: 'Custom Wooden Dining Table',
          artisanName: 'Premium Woodworks',
          artisanId: 'a001',
          date: '2025-04-15T10:00:00',
          status: 'upcoming',
          price: '₦65,000',
          image: '',
          description: 'Handcrafted dining table for 6 people',
          category: 'Woodworking'
        },
        {
          id: 'b002',
          serviceName: 'Leather Wallet Repair',
          artisanName: 'Leather Crafters',
          artisanId: 'a002',
          date: '2025-03-12T14:30:00',
          status: 'completed',
          price: '₦8,500',
          image: '',
          description: 'Professional leather wallet restoration',
          category: 'Leathercraft'
        },
        {
          id: 'b003',
          serviceName: 'Handwoven Storage Basket',
          artisanName: 'Woven Wonders',
          artisanId: 'a003',
          date: '2025-03-05T15:30:00',
          status: 'completed',
          price: '₦12,500',
          image: '',
          description: 'Large handwoven basket with traditional patterns',
          category: 'Basket Weaving'
        },
        {
          id: 'b004',
          serviceName: 'Custom Ceramic Vase Set',
          artisanName: 'Clay Masters',
          artisanId: 'a004',
          date: '2025-02-28T11:00:00',
          status: 'completed',
          price: '₦25,000',
          image: '',
          description: 'Set of 3 matching ceramic vases',
          category: 'Pottery & Ceramics'
        },
        {
          id: 'b005',
          serviceName: 'Adire Textile Design',
          artisanName: 'Heritage Fabrics',
          artisanId: 'a005',
          date: '2025-02-15T13:00:00',
          status: 'cancelled',
          price: '₦18,000',
          image: '',
          description: 'Traditional Adire fabric with custom patterns',
          category: 'Textile Art'
        }
      ];
      
      setUserBookings(mockBookings);
    } catch (err) {
      console.error('Error fetching user bookings:', err);
    }
  };

  // Fetch saved artisans
  const fetchSavedArtisans = async () => {
    try {
      // Mock saved artisans data
      const mockSavedArtisans = [
        {
          id: 'a201',
          contactName: 'Emma Jewelry',
          businessName: 'Elegant Gems',
          profileImage: '',
          category: 'Jewelry Making',
          location: 'Lagos',
          rating: 4.9,
          totalServices: 12,
          isVerified: true,
          savedDate: '2025-03-01T10:00:00'
        },
        {
          id: 'a202',
          contactName: 'Aisha Textiles',
          businessName: 'Heritage Fabrics',
          profileImage: '',
          category: 'Textile Art',
          location: 'Ibadan',
          rating: 4.8,
          totalServices: 8,
          isVerified: true,
          savedDate: '2025-02-20T15:30:00'
        },
        {
          id: 'a203',
          contactName: 'Michael Wood',
          businessName: 'Artisan Woodcraft',
          profileImage: '',
          category: 'Woodworking',
          location: 'Enugu',
          rating: 4.7,
          totalServices: 15,
          isVerified: false,
          savedDate: '2025-02-10T09:45:00'
        }
      ];
      
      setSavedArtisans(mockSavedArtisans);
    } catch (err) {
      console.error('Error fetching saved artisans:', err);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        await Promise.all([
          fetchProfile(),
          fetchUserBookings(),
          fetchSavedArtisans()
        ]);
      } catch (err) {
        setError('Failed to load profile data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userId) {
      loadProfileData();
    }
  }, [userId]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format date with time
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const badges = {
      'upcoming': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'in-progress': 'bg-yellow-100 text-yellow-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  // Calculate completion rate
  const getCompletionRate = () => {
    if (userBookings.length === 0) return 0;
    const completed = userBookings.filter(b => b.status === 'completed').length;
    return Math.round((completed / userBookings.length) * 100);
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

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
          <p className="text-gray-700">The user profile you're looking for doesn't exist.</p>
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
            <span className="hover:text-red-500 cursor-pointer" onClick={() => navigate('/dashboard')}>Users</span>
            <span className="mx-2">/</span>
            <span className="text-gray-700">{user.fullName || user.username}</span>
          </div>

          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            {/* Cover Image */}
            <div className="h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="absolute bottom-4 left-6 text-white">
                <div className="flex items-center space-x-2">
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                    {user.role === 'customer' ? '👤 Customer' : '🎨 Artisan'}
                  </span>
                  {user.preferences?.publicProfile && (
                    <span className="bg-green-500 bg-opacity-80 px-3 py-1 rounded-full text-sm font-medium">
                      ✓ Public Profile
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6 -mt-16">
                {/* Profile Image */}
                <div className="flex-shrink-0 mb-4 sm:mb-0">
                  <img 
                    src={user.profileImage || 'https://via.placeholder.com/120?text=User'} 
                    alt={user.fullName || user.username} 
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white object-cover shadow-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/120?text=User';
                    }}
                  />
                </div>
                
                {/* Profile Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                      <h1 className="text-2xl font-bold text-gray-900">
                        {user.fullName || user.username}
                      </h1>
                      <p className="text-gray-600 text-lg">@{user.username}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                        {user.location && (
                          <div className="flex items-center text-gray-700">
                            <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{user.location}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center text-gray-700">
                          <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Joined {formatDate(user.joinedDate || user.createdAt)}</span>
                        </div>
                        
                        {userBookings.length > 0 && (
                          <div className="flex items-center text-gray-700">
                            <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span>{getCompletionRate()}% completion rate</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {user.bio && (
                    <div className="mt-4">
                      <p className="text-gray-700 leading-relaxed max-w-2xl">{user.bio}</p>
                    </div>
                  )}
                  
                  {user.favoriteCategories && user.favoriteCategories.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Interested In</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.favoriteCategories.map((category, index) => (
                          <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{user.totalBookings || userBookings.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">₦{(user.totalSpent || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Saved Artisans</p>
                  <p className="text-2xl font-bold text-gray-900">{savedArtisans.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{getCompletionRate()}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Tabs */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeTab === 'profile'
                      ? 'border-b-2 border-red-500 text-red-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Profile Details
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeTab === 'bookings'
                      ? 'border-b-2 border-red-500 text-red-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Booking History ({userBookings.length})
                </button>
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeTab === 'saved'
                      ? 'border-b-2 border-red-500 text-red-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Saved Artisans ({savedArtisans.length})
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeTab === 'activity'
                      ? 'border-b-2 border-red-500 text-red-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Activity
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              {/* Profile Details Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                        <p className="text-gray-900 font-medium">{user.email}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Phone Number</h4>
                        <p className="text-gray-900 font-medium">{user.phoneNumber || 'Not provided'}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                        <p className="text-gray-900 font-medium">{user.location || 'Not provided'}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Member Since</h4>
                        <p className="text-gray-900 font-medium">{formatDate(user.createdAt)}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Account Type</h4>
                        <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                          {user.role}
                        </span>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Profile Status</h4>
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                          user.preferences?.publicProfile 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.preferences?.publicProfile ? 'Public' : 'Private'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* About Section */}
                  {user.bio && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Interests */}
                  {user.favoriteCategories && user.favoriteCategories.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Interests & Preferences</h3>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-3">Favorite Categories</h4>
                        <div className="flex flex-wrap gap-2">
                          {user.favoriteCategories.map((category, index) => (
                            <span key={index} className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Booking History Tab */}
              {activeTab === 'bookings' && (
                <div>
                  {userBookings.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Booking History</h3>
                        <div className="text-sm text-gray-500">
                          {userBookings.filter(b => b.status === 'completed').length} completed • {userBookings.filter(b => b.status === 'upcoming').length} upcoming
                        </div>
                      </div>
                      
                      {userBookings.map(booking => (
                        <div key={booking.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                              <img 
                                src={booking.image || 'https://via.placeholder.com/64?text=Service'} 
                                alt={booking.serviceName}
                                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/64?text=Service';
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 mb-1">{booking.serviceName}</h4>
                                <p className="text-sm text-gray-600 mb-1">
                                  by <span 
                                    className="text-blue-600 hover:underline cursor-pointer"
                                    onClick={() => navigate(`/artisan/${booking.artisanId}`)}
                                  >
                                    {booking.artisanName}
                                  </span>
                                </p>
                                <p className="text-sm text-gray-500 mb-2">{booking.description}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {formatDateTime(booking.date)}
                                  </div>
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    {booking.category}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                              <div className="text-right mb-3 sm:mb-0">
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(booking.status)}`}>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                                <p className="text-lg font-bold text-gray-900 mt-1">{booking.price}</p>
                              </div>
                              
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => navigate(`/services/${booking.id}`)}
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  View Details
                                </button>
                                {booking.status === 'completed' && (
                                  <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                                    Review
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No Bookings Yet</h3>
                      <p className="mt-2 text-gray-500">
                        This user hasn't made any bookings yet.
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Saved Artisans Tab */}
              {activeTab === 'saved' && (
                <div>
                  {savedArtisans.length > 0 ? (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Saved Artisans</h3>
                        <div className="text-sm text-gray-500">
                          {savedArtisans.length} saved
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedArtisans.map(artisan => (
                          <div key={artisan.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition cursor-pointer"
                               onClick={() => navigate(`/artisan/${artisan.id}`)}>
                            <div className="flex items-center space-x-4 mb-4">
                              <img 
                                src={artisan.profileImage || 'https://via.placeholder.com/48?text=Artisan'} 
                                alt={artisan.businessName}
                                className="w-12 h-12 rounded-full object-cover"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/48?text=Artisan';
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 truncate">{artisan.businessName}</h4>
                                <p className="text-sm text-gray-600 truncate">{artisan.contactName}</p>
                              </div>
                              {artisan.isVerified && (
                                <div className="flex-shrink-0">
                                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Category</span>
                                <span className="font-medium text-gray-900">{artisan.category}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Location</span>
                                <span className="font-medium text-gray-900">{artisan.location}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Services</span>
                                <span className="font-medium text-gray-900">{artisan.totalServices}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="ml-1 text-sm font-medium text-gray-900">{artisan.rating}</span>
                              </div>
                              <div className="text-xs text-gray-500">
                                Saved {formatDate(artisan.savedDate)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No Saved Artisans</h3>
                      <p className="mt-2 text-gray-500">
                        This user hasn't saved any artisans yet.
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {/* Activity Timeline */}
                    <div className="relative">
                      <div className="absolute left-4 top-6 bottom-0 w-0.5 bg-gray-200"></div>
                      
                      {/* Recent booking */}
                      <div className="relative flex items-start space-x-3 pb-6">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <div className="text-sm">
                              <span className="font-medium text-gray-900">Made a booking</span>
                              <span className="text-gray-500"> for Custom Wooden Dining Table</span>
                            </div>
                            <div className="mt-1 text-sm text-gray-500">
                              2 days ago
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Saved artisan */}
                      <div className="relative flex items-start space-x-3 pb-6">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <div className="text-sm">
                              <span className="font-medium text-gray-900">Saved artisan</span>
                              <span className="text-gray-500"> Elegant Gems</span>
                            </div>
                            <div className="mt-1 text-sm text-gray-500">
                              1 week ago
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Completed booking */}
                      <div className="relative flex items-start space-x-3 pb-6">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <div className="text-sm">
                              <span className="font-medium text-gray-900">Completed booking</span>
                              <span className="text-gray-500"> for Leather Wallet Repair</span>
                            </div>
                            <div className="mt-1 text-sm text-gray-500">
                              2 weeks ago
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Joined platform */}
                      <div className="relative flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <div className="text-sm">
                              <span className="font-medium text-gray-900">Joined BizBridge</span>
                            </div>
                            <div className="mt-1 text-sm text-gray-500">
                              {formatDate(user.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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

export default Profile;