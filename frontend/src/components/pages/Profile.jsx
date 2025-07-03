// src/components/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile, getMyProfile } from '../../api/userProfile';

const Profile = () => {
  const navigate = useNavigate();
  const { userId } = useParams(); // Get userId from URL params
  const { currentUser, logout } = useAuth();
  
  const [profileData, setProfileData] = useState(null);
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState({});
  const [context, setContext] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('about');

  // Determine if this is the user's own profile
  const isOwnProfile = !userId || (currentUser && userId === currentUser._id);

  console.log('🔍 Profile Component Debug:', {
    userId,
    currentUser: currentUser?._id,
    isOwnProfile,
    userExists: !!currentUser,
    userRole: currentUser?.role
  });

  useEffect(() => {
    fetchProfile();
  }, [userId, currentUser]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      let response;
      
      if (isOwnProfile) {
        // Viewing own profile - check if user is authenticated first
        if (!currentUser) {
          setError('Please log in to view your profile');
          setLoading(false);
          return;
        }
        
        console.log('🔍 Fetching own profile for user:', currentUser._id);
        response = await getMyProfile();
      } else {
        // Viewing someone else's profile
        console.log('🔍 Fetching profile for user:', userId);
        response = await getUserProfile(userId);
      }

      console.log('📊 Profile API Response:', response);

      if (response && response.success) {
        setProfileData(response.user || response.profile);
        setServices(response.services || []);
        setStats(response.stats || {});
        setContext(response.context || {
          isOwnProfile,
          canEdit: isOwnProfile,
          canContact: !isOwnProfile && currentUser && (response.user?.role === 'artisan' || response.profile?.role === 'artisan'),
          canSave: !isOwnProfile && currentUser,
          isAuthenticated: !!currentUser
        });
      } else {
        const errorMessage = response?.message || 'Failed to load profile';
        console.error('❌ Profile API Error:', errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      console.error('❌ Error fetching profile:', err);
      
      // Handle specific error cases
      if (err.message && err.message.includes('401')) {
        setError('Please log in to view your profile');
      } else if (err.message && err.message.includes('404')) {
        setError('Profile not found');
      } else {
        setError(err.message || 'Error loading profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleContact = () => {
    // Implement contact functionality
    alert('Contact functionality to be implemented');
  };

  const handleSaveArtisan = () => {
    // Implement save artisan functionality
    alert('Save artisan functionality to be implemented');
  };

  const handleEditProfile = () => {
    // Navigate to edit mode - we can implement inline editing or separate page
    navigate('/profile/edit');
  };

  const handleViewArtisanProfile = (artisanId) => {
    // Navigate to artisan's profile
    navigate(`/profile/${artisanId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
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
        
        <main className="flex-1 bg-gray-50 pt-20 py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
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
        
        <main className="flex-1 bg-gray-50 pt-20 py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Profile Not Found</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-black text-white w-full top-0 z-10 fixed">
        <div className="py-2">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center cursor-pointer py-3" onClick={() => navigate('/')}>
              <span className="text-red-500 text-5xl select-none font-bold">𐐒</span>
              <span className="text-white text-4xl select-none font-bold">B</span>
              <span className="text-red-500 text-2xl select-none font-semibold ml-5">BizBridge</span>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate('/dashboard')}>
                <div>Your</div>
                <div className="font-bold">Dashboard</div>
              </div>
              {currentUser && (
                <>
                  {currentUser.userType === 'customer' && (
                    <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate('/bookings/my-bookings')}>
                      <div>Your</div>
                      <div className="font-bold">Bookings</div>
                    </div>
                  )}
                  {currentUser.userType === 'artisan' && (
                    <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate('/ServicesManagement')}>
                      <div>Your</div>
                      <div className="font-bold">Services</div>
                    </div>
                  )}
                  {/* Only show "Your Profile" link if not already viewing own profile */}
                  {!isOwnProfile && (
                    <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate('/profile')}>
                      <div>Your</div>
                      <div className="font-bold">Profile</div>
                    </div>
                  )}
                  <div className="text-xs cursor-pointer hover:text-red-400" onClick={handleLogout}>
                    <div>Sign</div>
                    <div className="font-bold">Out</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 pt-20 py-8">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
                    {profileData.profileImage ? (
                      <img 
                        src={profileData.profileImage} 
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="mb-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {profileData.role === 'artisan' 
                        ? (profileData.businessName || profileData.fullName || 'Artisan Profile')
                        : (profileData.fullName || 'Customer Profile')
                      }
                    </h1>
                    
                    <div className="flex items-center gap-4 text-gray-600">
                      <span className="capitalize">{profileData.role}</span>
                      {profileData.location && (
                        <>
                          <span>•</span>
                          <span>
                            {typeof profileData.location === 'string' 
                              ? profileData.location
                              : `${profileData.location.city || ''}, ${profileData.location.state || ''}`.replace(/^,\s*|,\s*$/g, '')
                            }
                          </span>
                        </>
                      )}
                      {profileData.role === 'artisan' && profileData.isVerified && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats for artisans */}
                  {profileData.role === 'artisan' && (
                    <div className="flex flex-wrap gap-6 text-sm">
                      <div>
                        <span className="font-semibold text-gray-900">{stats.servicesCount || 0}</span>
                        <span className="text-gray-600 ml-1">Services</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">{profileData.profileViews || 0}</span>
                        <span className="text-gray-600 ml-1">Profile Views</span>
                      </div>
                      {profileData.yearEstablished && (
                        <div>
                          <span className="font-semibold text-gray-900">{new Date().getFullYear() - profileData.yearEstablished}</span>
                          <span className="text-gray-600 ml-1">Years Experience</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  {context.canEdit && (
                    <button
                      onClick={handleEditProfile}
                      className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition font-medium"
                    >
                      Edit Profile
                    </button>
                  )}
                  
                  {context.canContact && (
                    <>
                      <button
                        onClick={handleContact}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition font-medium"
                      >
                        Contact Artisan
                      </button>
                      <button
                        onClick={handleSaveArtisan}
                        className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition font-medium"
                      >
                        Save Artisan
                      </button>
                    </>
                  )}

                  {!context.isAuthenticated && profileData.role === 'artisan' && (
                    <button
                      onClick={() => navigate('/login')}
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition font-medium"
                    >
                      Login to Contact
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-t border-gray-200">
              <nav className="flex space-x-8 px-8">
                {[
                  { key: 'about', label: 'About', icon: '👤' },
                  { key: 'services', label: 'Services', icon: '🛠️', count: services.length },
                  ...(profileData.role === 'artisan' ? [{ key: 'contact', label: 'Contact', icon: '📞' }] : [])
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-4 border-b-2 font-medium text-sm transition ${
                      activeTab === tab.key
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                    {tab.count !== undefined && (
                      <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-8">
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {profileData.bio || 'No bio available.'}
                    </p>
                  </div>

                  {profileData.role === 'artisan' && (
                    <>
                      {profileData.specialties && profileData.specialties.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Specialties</h4>
                          <div className="flex flex-wrap gap-2">
                            {profileData.specialties.map((specialty, index) => (
                              <span key={index} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {profileData.experience && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Experience</h4>
                          <p className="text-gray-600">{profileData.experience}</p>
                        </div>
                      )}

                      {profileData.education && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Education</h4>
                          <p className="text-gray-600">{profileData.education}</p>
                        </div>
                      )}
                    </>
                  )}

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Member Since</h4>
                    <p className="text-gray-600">{formatDate(profileData.createdAt)}</p>
                  </div>
                </div>
              )}

              {activeTab === 'services' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Services ({services.length})
                    </h3>
                    {context.canEdit && (
                      <button
                        onClick={() => navigate('/ServicesAdd')}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium text-sm"
                      >
                        Add Service
                      </button>
                    )}
                  </div>

                  {services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {services.map(service => (
                        <div key={service._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                          {service.images && service.images.length > 0 && (
                            <img 
                              src={service.images[0]} 
                              alt={service.title}
                              className="w-full h-48 object-cover"
                            />
                          )}
                          <div className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">{service.title}</h4>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-red-600 font-semibold">
                                {service.pricing?.type === 'fixed' && service.pricing?.amount 
                                  ? `₦${service.pricing.amount.toLocaleString()}`
                                  : 'Contact for pricing'
                                }
                              </span>
                              <button
                                onClick={() => navigate(`/services/${service._id}`)}
                                className="text-red-600 hover:text-red-700 font-medium text-sm"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Services Yet</h3>
                      <p className="text-gray-500 mb-4">
                        {context.canEdit 
                          ? 'Start by adding your first service to showcase your work.'
                          : 'This artisan hasn\'t added any services yet.'
                        }
                      </p>
                      {context.canEdit && (
                        <button
                          onClick={() => navigate('/ServicesAdd')}
                          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition font-medium"
                        >
                          Add Your First Service
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'contact' && profileData.role === 'artisan' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Business Details</h4>
                      <div className="space-y-2 text-gray-600">
                        {profileData.businessName && (
                          <p><span className="font-medium">Business:</span> {profileData.businessName}</p>
                        )}
                        {profileData.email && (
                          <p><span className="font-medium">Email:</span> {profileData.email}</p>
                        )}
                        {profileData.phone && (
                          <p><span className="font-medium">Phone:</span> {profileData.phone}</p>
                        )}
                        {profileData.phoneNumber && (
                          <p><span className="font-medium">Phone:</span> {profileData.phoneNumber}</p>
                        )}
                        {profileData.location && (
                          <p>
                            <span className="font-medium">Location:</span>{' '}
                            {typeof profileData.location === 'string' 
                              ? profileData.location
                              : [
                                  profileData.location.address,
                                  profileData.location.city,
                                  profileData.location.lga,
                                  profileData.location.state
                                ].filter(Boolean).join(', ')
                            }
                          </p>
                        )}
                        {profileData.address && (
                          <p><span className="font-medium">Address:</span> {profileData.address}</p>
                        )}
                        {profileData.city && (
                          <p><span className="font-medium">City:</span> {profileData.city}</p>
                        )}
                        {profileData.localGovernmentArea && (
                          <p><span className="font-medium">LGA:</span> {profileData.localGovernmentArea}</p>
                        )}
                        {profileData.websiteURL && (
                          <p>
                            <span className="font-medium">Website:</span>{' '}
                            <a href={profileData.websiteURL} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700">
                              {profileData.websiteURL}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>

                    {profileData.workingHours && typeof profileData.workingHours === 'object' && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Working Hours</h4>
                        <div className="space-y-1 text-gray-600">
                          {Object.entries(profileData.workingHours).map(([day, hours]) => (
                            <p key={day} className="capitalize">
                              <span className="font-medium">{day}:</span> {hours || 'Closed'}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;