// frontend/src/components/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile, getMyProfile, canEditProfile } from '../../api/userProfile';
import ServiceCard from '../cards/ServiceCard';
import ProfileEditForm from '../forms/ProfileEditForm';
import LoadingSpinner from '../common/LoadingSpinner';

const Profile = () => {
  const { userId } = useParams(); // Get userId from URL params
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, currentUser, userType, logout } = useAuth();
  
  // State management
  const [profileData, setProfileData] = useState(null);
  const [userServices, setUserServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [isEditing, setIsEditing] = useState(false);
  
  // Context determination
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [profileContext, setProfileContext] = useState('public'); // 'own' or 'public'
  
  // Interaction states (for public profiles)
  const [isSaved, setIsSaved] = useState(false);

  // Determine profile context and load data
  useEffect(() => {
    loadProfileData();
  }, [userId, currentUser]);

  const loadProfileData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let response;
      
      // Determine which profile to load
      if (!userId || (currentUser && userId === currentUser._id)) {
        // Load own profile (no userId or userId matches current user)
        console.log('📱 Loading own profile');
        response = await getMyProfile();
        setIsOwnProfile(true);
        setProfileContext('own');
      } else {
        // Load specific user's profile
        console.log('👀 Loading public profile for user:', userId);
        response = await getUserProfile(userId);
        setIsOwnProfile(response.isOwnProfile || false);
        setProfileContext(response.context || 'public');
      }
      
      if (response.success) {
        setProfileData(response.user);
        setUserServices(response.services || []);
        
        console.log('✅ Profile loaded:', {
          userId: response.user._id,
          isOwnProfile: response.isOwnProfile,
          context: response.context
        });
      } else {
        throw new Error(response.message || 'Failed to load profile');
      }
      
    } catch (err) {
      console.error('❌ Profile loading error:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile update
  const handleProfileUpdate = (updatedProfile) => {
    setProfileData(updatedProfile);
    setIsEditing(false);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Handle service view
  const handleViewService = (service) => {
    navigate(`/services/${service._id}`);
  };

  // Handle contact user (for public profiles)
  const handleContactUser = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    // Implement contact functionality
    console.log('🔗 Contact user:', profileData._id);
    alert(`Contact functionality would open here for ${profileData.contactName || profileData.username}`);
  };

  // Handle save/unsave profile (for public profiles)
  const handleSaveProfile = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setIsSaved(!isSaved);
    console.log('💾 Save/unsave user:', profileData._id);
  };

  // Get display name based on user type and data
  const getDisplayName = () => {
    if (!profileData) return 'User';
    
    if (profileData.role === 'customer') {
      return profileData.username ||  profileData.contactName;
    } else if (profileData.role === 'artisan') {
      return  profileData.username || profileData.contactName || profileData.businessName ;
    }
    return profileData.username;
  };

  // Get contact name for artisans
  const getContactName = () => {
    if (profileData?.role === 'artisan') {
      return profileData.contactName || profileData.username;
    }
    return null;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="bg-black text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <span onClick={() => navigate('/')} className="text-red-500 text-5xl select-none font-bold cursor-pointer">𐐒</span>
              <span onClick={() => navigate('/')} className="text-white text-4xl select-none font-bold cursor-pointer">B</span>
              <span onClick={() => navigate('/')} className="text-red-500 text-2xl select-none cursor-pointer font-semibold ml-5">BizBridge</span>
            </div>
            <nav className="flex space-x-8">
              <span onClick={() => navigate('/')} className="hover:text-red-400 cursor-pointer">Home</span>
              {isAuthenticated && (
                <span onClick={() => navigate('/dashboard')} className="hover:text-red-400 cursor-pointer">Dashboard</span>
              )}
            </nav>
          </div>
        </header>
        <div className="flex-grow flex items-center justify-center">
          <LoadingSpinner message="Loading profile..." />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !profileData) {
    return (
      <div className="flex flex-col min-h-screen">
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
            <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
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
        {/* Profile Header */}
        <div className="bg-white shadow-sm">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-red-500 to-orange-500 relative">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            {/* Context Indicator for Development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm">
                Context: {profileContext} | Own: {isOwnProfile ? 'Yes' : 'No'}
              </div>
            )}
          </div>
          
          <div className="container mx-auto px-4 relative">
            <div className="flex flex-col lg:flex-row lg:items-end lg:space-x-6 pb-6">
              {/* Profile Picture */}
              <div className="flex-shrink-0 -mt-16 lg:-mt-20 mb-4 lg:mb-0">
                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 border-white bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-xl">
                  {profileData.profileImage ? (
                    <img 
                      src={profileData.profileImage} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-white text-4xl lg:text-6xl font-bold">
                      {getDisplayName().charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end">
                  <div className="mb-4 lg:mb-0">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {getDisplayName()}
                    </h1>
                    
                    {profileData.role === 'artisan' && getContactName() && profileData.businessName && (
                      <p className="text-xl text-gray-600 mb-2">by {getContactName()}</p>
                    )}
                    
                    <p className="text-gray-600 mb-3">@{profileData.username}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center text-gray-700">
                        <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="capitalize font-medium">{profileData.role}</span>
                      </div>
                      
                      {profileData.localGovernmentArea && (
                        <div className="flex items-center text-gray-700">
                          <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{profileData.localGovernmentArea}, {profileData.city}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-gray-700">
                        <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Joined {new Date(profileData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                      </div>
                      
                      {profileData.isCACRegistered && (
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Verified
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons - Context Dependent */}
                  <div className="flex flex-wrap gap-3">
                    {/* Own Profile Actions */}
                    {isOwnProfile && (
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
                      </button>
                    )}
                    
                    {/* Public Profile Actions */}
                    {!isOwnProfile && isAuthenticated && (
                      <>
                        <button
                          onClick={handleContactUser}
                          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span>Contact</span>
                        </button>
                        
                        <button
                          onClick={handleSaveProfile}
                          className={`border px-6 py-2 rounded-lg transition flex items-center space-x-2 ${
                            isSaved 
                              ? 'border-red-500 text-red-500 bg-red-50 hover:bg-red-100' 
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <svg className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                          <span>{isSaved ? 'Saved' : 'Save'}</span>
                        </button>
                      </>
                    )}
                    
                    {/* Login prompt for unauthenticated users viewing public profiles */}
                    {!isOwnProfile && !isAuthenticated && (
                      <button
                        onClick={() => navigate('/login', { state: { from: location.pathname } })}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
                      >
                        Login to Contact
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar - Only for Artisans */}
        {profileData.role === 'artisan' && (
          <div className="bg-white border-t">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-wrap justify-center lg:justify-start gap-8 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{profileData.profileViews || 0}</p>
                  <p className="text-sm text-gray-600">Profile Views</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{userServices.length}</p>
                  <p className="text-sm text-gray-600">Services Offered</p>
                </div>
                {profileData.yearEstablished && (
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{new Date().getFullYear() - profileData.yearEstablished}</p>
                    <p className="text-sm text-gray-600">Years Experience</p>
                  </div>
                )}
                {/* Add rating if available */}
                {profileData.rating && (
                  <div>
                    <div className="flex items-center justify-center">
                      <p className="text-2xl font-bold text-gray-900 mr-1">{profileData.rating}</p>
                      <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600">{profileData.reviewCount || 0} Reviews</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="container mx-auto px-4 py-8">
          {/* Edit Mode */}
          {isEditing && isOwnProfile && (
            <div className="bg-white rounded-lg shadow-sm mb-8">
              <ProfileEditForm 
                user={profileData}
                onSave={handleProfileUpdate}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          )}

          {/* View Mode */}
          {!isEditing && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('about')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'about'
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    About
                  </button>
                  
                  {profileData.role === 'artisan' && userServices.length > 0 && (
                    <button
                      onClick={() => setActiveTab('services')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'services'
                          ? 'border-red-500 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Services ({userServices.length})
                    </button>
                  )}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'about' && (
                  <div className="space-y-6">
                    {/* Contact Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Email - Show for own profile or if public artisan */}
                        {(isOwnProfile || (profileData.role === 'artisan' && profileData.email)) && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                            <p className="text-gray-900">{profileData.email}</p>
                          </div>
                        )}
                        
                        {/* Phone - Show for own profile or if public artisan */}
                        {profileData.phoneNumber && (isOwnProfile || profileData.role === 'artisan') && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Phone</h4>
                            <p className="text-gray-900">{profileData.phoneNumber}</p>
                          </div>
                        )}
                        
                        {/* Address - Show for own profile or if public artisan */}
                        {profileData.address && (isOwnProfile || profileData.role === 'artisan') && (
                          <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Address</h4>
                            <p className="text-gray-900">{profileData.address}</p>
                            {(profileData.city || profileData.localGovernmentArea) && (
                              <p className="text-gray-600 text-sm mt-1">
                                {profileData.localGovernmentArea}{profileData.city && `, ${profileData.city}`}
                              </p>
                            )}
                          </div>
                        )}
                        
                        {/* Website - Show for artisans */}
                        {profileData.websiteURL && profileData.role === 'artisan' && (
                          <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Website</h4>
                            <a 
                              href={profileData.websiteURL} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 break-all"
                            >
                              {profileData.websiteURL}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Business Information - Only for Artisans */}
                    {profileData.role === 'artisan' && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {profileData.yearEstablished && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Year Established</h4>
                              <p className="text-gray-900">{profileData.yearEstablished}</p>
                            </div>
                          )}
                          
                          {profileData.staffStrength && isOwnProfile && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Staff Strength</h4>
                              <p className="text-gray-900">{profileData.staffStrength}</p>
                            </div>
                          )}
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Business Registration</h4>
                            <p className="text-gray-900">
                              {profileData.isCACRegistered ? 'CAC Registered' : 'Not CAC Registered'}
                            </p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Account Status</h4>
                            <p className="text-gray-900">
                              {profileData.isVerified ? 'Verified' : 'Unverified'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Services Tab - Only for Artisans */}
                {activeTab === 'services' && profileData.role === 'artisan' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Services ({userServices.length})
                      </h3>
                      {isOwnProfile && (
                        <button
                          onClick={() => navigate('/ServicesAdd')}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                          Add Service
                        </button>
                      )}
                    </div>
                    
                    {userServices.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userServices.map(service => (
                          <ServiceCard
                            key={service._id}
                            service={service}
                            onClick={() => handleViewService(service)}
                            showControls={isOwnProfile}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No Services Available</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {isOwnProfile 
                            ? "You haven't added any services yet." 
                            : "This artisan hasn't added any services yet."}
                        </p>
                        {isOwnProfile && (
                          <button
                            onClick={() => navigate('/ServicesAdd')}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                          >
                            Add Your First Service
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
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