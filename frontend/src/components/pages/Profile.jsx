// src/components/Profile.jsx - PERFECTLY CONSISTENT Design
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile, getMyProfile } from '../../api/userProfile';

// Payment Warning Component - Consistent with app styling
const PaymentWarning = ({ 
  className = "",
  size = "default",
  variant = "warning"
}) => {
  const sizeClasses = {
    small: "p-3 text-sm",
    default: "p-4",
    large: "p-6 text-lg"
  };

  const variantClasses = {
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800", 
    critical: "bg-red-50 border-red-200 text-red-800"
  };

  return (
    <div className={`
      border rounded-lg mb-6 
      ${sizeClasses[size]} 
      ${variantClasses[variant]} 
      ${className}
    `}>
      <div className="flex items-start">
        <svg className="w-5 h-5 text-current mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div className="flex-1">
          <p className="font-medium">⚠️ Payment Notice</p>
          <p className="mt-1 font-normal">
            BizBridge does NOT process payments. All financial transactions 
            must be handled directly between customer and artisan.
          </p>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { currentUser, logout } = useAuth();
  
  const [profileData, setProfileData] = useState(null);
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState({});
  const [context, setContext] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Dynamic profile detection
  const isOwnProfile = !userId || (currentUser && userId === currentUser._id);

  useEffect(() => {
    fetchProfile();
  }, [userId, currentUser]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      let response;
      
      if (isOwnProfile) {
        if (!currentUser) {
          setError('Please log in to view your profile');
          setLoading(false);
          return;
        }
        response = await getMyProfile();
      } else {
        response = await getUserProfile(userId);
      }

      if (response && response.success) {
        setProfileData(response.user || response.profile);
        setServices(response.services || []);
        setStats(response.stats || {});
        
        setContext({
          isOwnProfile,
          canEdit: isOwnProfile,
          canContact: !isOwnProfile && currentUser && (response.user?.role === 'artisan' || response.profile?.role === 'artisan'),
          canSave: !isOwnProfile && currentUser,
          isAuthenticated: !!currentUser,
          viewerRole: currentUser?.role || 'guest'
        });
      } else {
        setError(response?.message || 'Profile not found');
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* EXACT HEADER PATTERN FROM APP */}
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
            <p className="text-gray-600 text-lg">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* EXACT HEADER PATTERN FROM APP */}
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
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition font-bold"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* EXACT HEADER PATTERN FROM APP */}
      <header className="bg-black text-white w-full top-0 z-10 fixed">
        <div className="py-2">
          <div className="container mx-auto px-4 flex items-center justify-between">
            {/* Logo - EXACT PATTERN */}
            <div className="flex items-center cursor-pointer py-3" onClick={() => navigate('/')}>
              <span className="text-red-500 text-5xl select-none font-bold">𐐒</span>
              <span className="text-white text-4xl select-none font-bold">B</span>
              <span className="text-red-500 text-2xl select-none font-semibold ml-5">BizBridge</span>
            </div>

            {/* Navigation*/}
            <div className="flex items-center space-x-6">
              <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate('/dashboard')}>
                <div>Your</div>
                <div className="font-bold">Dashboard</div>
              </div>
              {currentUser && currentUser.role === 'customer' && (
                <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate('/bookings/my-bookings')}>
                  <div>Your</div>
                  <div className="font-bold">Bookings</div>
                </div>
              )}
              {currentUser && currentUser.role === 'customer' && (
                <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate('/customer-requests/history')}>
                  <div>Your</div>
                  <div className="font-bold">requests</div>
                </div>
              )}
              {currentUser && currentUser.role === 'artisan' && (
                <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate('/ServicesManagement')}>
                  <div>Your</div>
                  <div className="font-bold">Services</div>
                </div>
              )}
              {currentUser && !context.isOwnProfile && (
                <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate('/profile')}>
                  <div>Your</div>
                  <div className="font-bold">Profile</div>
                </div>
              )}
              <div className="text-xs cursor-pointer hover:text-red-400" onClick={handleLogout}>
                <div>Sign</div>
                <div className="font-bold">Out</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="bg-gray-50 flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          
          {/* Profile Header Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center mb-4 lg:mb-0">
                {/* Profile Image */}
                <div className="w-20 h-20 bg-gray-300 rounded-full overflow-hidden mr-6 flex-shrink-0">
                  {profileData.profileImage ? (
                    <img 
                      src={profileData.profileImage} 
                      alt={profileData.name || profileData.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {(profileData.name || profileData.username || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {profileData.name || profileData.username}
                  </h1>
                  <p className="text-xl text-gray-600 mb-1 capitalize">
                    {profileData.role === 'artisan' ? 
                      `${profileData.specialties?.[0] || 'Artisan'}` : 
                      'Customer'
                    }
                  </p>
                  <p className="text-gray-500">
                    📍 {profileData.location?.lga || 'Lagos'}, {profileData.location?.state || 'Lagos'}, Nigeria
                  </p>
                  {profileData.role === 'artisan' && profileData.rating && (
                    <div className="flex items-center mt-2">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(profileData.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="text-gray-600 text-sm">
                        ({profileData.rating}/5.0)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {context.canEdit && (
                  <button
                    onClick={() => navigate('/profile/edit')}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold transition inline-flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </button>
                )}
                
                {context.canContact && (
                  <>
                    <button
                      onClick={() => alert('Contact functionality to be implemented')}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-bold transition inline-flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Contact
                    </button>
                    <button
                      onClick={() => alert('Save functionality to be implemented')}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-bold transition inline-flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Save
                    </button>
                  </>
                )}

                {!context.isAuthenticated && profileData.role === 'artisan' && (
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold transition"
                  >
                    Login to Contact
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { key: 'overview', label: 'Overview', icon: '📋' },
                  ...(profileData.role === 'artisan' ? [
                    { key: 'contact', label: 'Contact', icon: '📞' }
                  ] : [
                    { key: 'activity', label: 'Activity', icon: '📊' },
                    { key: 'preferences', label: 'Preferences', icon: '⚙️' }
                  ])
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition ${
                      activeTab === tab.key
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Payment Warning for Contact Tab */}
          {activeTab === 'contact' && profileData.role === 'artisan' && (
            <PaymentWarning />
          )}

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* About Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">About</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {profileData.bio || profileData.description || 'No description available.'}
                  </p>
                </div>

                {/* Artisan Specialties */}
                {profileData.role === 'artisan' && profileData.specialties && profileData.specialties.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.specialties.map((specialty, index) => (
                        <span key={index} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Services for Artisans */}
                {profileData.role === 'artisan' && services.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">Recent Services</h3>
                      {currentUser && currentUser.role === 'artisan' && (
                      <button
                        onClick={() => navigate('/ServicesManagement')}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        Manage All Services ({services.length})
                      </button>)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.slice(0, 4).map(service => (
                        <div key={service._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                          {service.images && service.images.length > 0 && (
                            <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                              <img 
                                src={service.images[0]} 
                                alt={service.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <h4 className="font-bold text-gray-900 text-sm mb-1">{service.title}</h4>
                          <p className="text-gray-600 text-xs mb-2 line-clamp-2">{service.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-red-600 font-bold text-sm">
                              {service.pricing?.type === 'fixed' && service.pricing?.amount 
                                ? `₦${service.pricing.amount.toLocaleString()}`
                                : service.pricing?.type === 'negotiate' 
                                ? 'Contact for Price'
                                : 'Categorized Pricing'
                              }
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              service.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {service.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Services Message for Artisans */}
                {profileData.role === 'artisan' && services.length === 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                    <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {context.canEdit ? 'No Services Yet' : 'No Services Available'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {context.canEdit 
                        ? 'Start showcasing your skills by adding your first service.'
                        : 'This artisan hasn\'t added any services yet.'
                      }
                    </p>
                    {context.canEdit && (
                      <button
                        onClick={() => navigate('/ServicesAdd')}
                        className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition font-bold"
                      >
                        Add Your First Service
                      </button>
                    )}
                  </div>
                )}

                {/* Customer Service Interests */}
                {profileData.role === 'customer' && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Service Interests</h3>
                    <div className="text-center py-8 text-gray-500">
                      <p>Set your preferences to get personalized recommendations</p>
                      {context.canEdit && (
                        <button 
                          onClick={() => setActiveTab('preferences')}
                          className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-bold"
                        >
                          Update Preferences
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Profile Stats */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Profile Completion</span>
                      <span className="font-bold">{stats.profileCompletion || 75}%</span>
                    </div>
                    {profileData.role === 'artisan' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Services</span>
                          <span className="font-bold">{services.length}</span>
                        </div>
                        {context.isOwnProfile && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Profile Views</span>
                            <span className="font-bold">{profileData.profileViews || 0}</span>
                          </div>
                        )}
                      </>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Member Since</span>
                      <span className="font-bold">
                        {new Date(stats.memberSince || profileData.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Tab (Artisan Only) */}
          {activeTab === 'contact' && profileData.role === 'artisan' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Business Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.773-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <div>
                      <div className="font-medium text-gray-900">Phone</div>
                      <div className="text-gray-600">{profileData.phoneNumber || 'Not provided'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <div>
                      <div className="font-medium text-gray-900">Email</div>
                      <div className="text-gray-600">{profileData.email || 'Not provided'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-medium text-gray-900">Service Area</div>
                      <div className="text-gray-600">
                        {profileData.location?.lga || 'Lagos'}, {profileData.location?.state || 'Lagos'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Availability</h3>
                <div className="space-y-4">
                  {profileData.workingHours && (
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-2">Working Hours</div>
                        <div className="space-y-1">
                          {Object.entries(profileData.workingHours).map(([day, hours]) => (
                            <div key={day} className="flex justify-between text-sm">
                              <span className="capitalize text-gray-600">{day}:</span>
                              <span className="text-gray-900">{hours || 'Closed'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-medium text-gray-900">Response Time</div>
                      <div className="text-gray-600">Usually responds within 24 hours</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity Tab (Customer Only) */}
          {activeTab === 'activity' && profileData.role === 'customer' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Bookings</h3>
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-500 mb-4">No bookings yet</p>
                <button 
                  onClick={() => navigate('/services')}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition font-bold"
                >
                  Browse Services
                </button>
              </div>
            </div>
          )}

          {/* Preferences Tab (Customer Only) */}
          {activeTab === 'preferences' && profileData.role === 'customer' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Service Preferences</h3>
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-gray-500 mb-4">Customize your experience</p>
                {context.canEdit && (
                  <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition font-bold">
                    Set Preferences
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;