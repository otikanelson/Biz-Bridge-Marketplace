/**
 * Get the correct profile route based on user context
 * @param {string} userId - The user ID to view
 * @param {string} currentUserId - The current logged-in user's ID
 * @returns {string} The appropriate route
 */
export const getProfileRoute = (userId, currentUserId) => {
  if (!userId) return '/profile'; // Default to own profile
  if (userId === currentUserId) return '/profile'; // Own profile
  return `/profile/${userId}`; // Other user's profile
};

/**
 * Determine if user can edit profile
 * @param {string} profileUserId - The profile owner's user ID
 * @param {string} currentUserId - The current logged-in user's ID
 * @returns {boolean} Whether the user can edit this profile
 */
export const canEditProfile = (profileUserId, currentUserId) => {
  return profileUserId === currentUserId;
};

/**
 * Navigate to artisan profile from service card
 * @param {object} navigate - React Router navigate function
 * @param {string} artisanId - The artisan's user ID
 * @param {string} currentUserId - The current logged-in user's ID (optional)
 */
export const navigateToArtisanProfile = (navigate, artisanId, currentUserId = null) => {
  const route = getProfileRoute(artisanId, currentUserId);
  navigate(route);
};

/**
 * Get profile context for UI rendering
 * @param {string} profileUserId - The profile owner's user ID
 * @param {string} currentUserId - The current logged-in user's ID
 * @param {object} profileData - The profile data object
 * @returns {object} Context object for UI rendering
 */
export const getProfileContext = (profileUserId, currentUserId, profileData) => {
  const isOwnProfile = profileUserId === currentUserId;
  const isAuthenticated = !!currentUserId;
  
  return {
    isOwnProfile,
    isAuthenticated,
    canEdit: isOwnProfile,
    canContact: !isOwnProfile && isAuthenticated && profileData?.role === 'artisan',
    canSave: !isOwnProfile && isAuthenticated,
    canViewServices: profileData?.role === 'artisan'
  };
};

/**
 * Generate "View Artisan Profile" button props for service cards
 * @param {object} service - The service object containing artisan info
 * @param {function} navigate - React Router navigate function
 * @param {string} currentUserId - The current logged-in user's ID (optional)
 * @returns {object} Button props and handlers
 */
export const getViewArtisanButtonProps = (service, navigate, currentUserId = null) => {
  const artisanId = service.artisan?._id || service.artisan;
  const artisanName = service.artisan?.businessName || service.artisan?.fullName || 'Artisan';
  
  return {
    onClick: () => navigateToArtisanProfile(navigate, artisanId, currentUserId),
    text: `View ${artisanName}'s Profile`,
    shortText: 'View Profile',
    disabled: !artisanId,
    className: "text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
  };
};

/**
 * Enhanced service card component with "View Artisan Profile" functionality
 * This is an example of how to integrate the profile navigation into service cards
 */
export const ServiceCardWithArtisanLink = ({ service, navigate, currentUserId, className = "" }) => {
  const artisanButtonProps = getViewArtisanButtonProps(service, navigate, currentUserId);
  
  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition ${className}`}>
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
        
        {/* Artisan info with profile link */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
              {service.artisan?.profileImage ? (
                <img 
                  src={service.artisan.profileImage} 
                  alt="Artisan"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <span className="text-sm text-gray-600">
              {service.artisan?.businessName || service.artisan?.fullName || 'Unknown Artisan'}
            </span>
          </div>
          <button
            onClick={artisanButtonProps.onClick}
            className={artisanButtonProps.className}
            disabled={artisanButtonProps.disabled}
          >
            {artisanButtonProps.shortText}
          </button>
        </div>
        
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
            View Service
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Profile breadcrumb component for better navigation
 */
export const ProfileBreadcrumb = ({ profileData, isOwnProfile, currentPath }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
      <a href="/" className="hover:text-gray-700">Home</a>
      <span>/</span>
      {isOwnProfile ? (
        <span className="text-gray-900 font-medium">Your Profile</span>
      ) : (
        <>
          <span>Profiles</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">
            {profileData?.businessName || profileData?.fullName || 'Profile'}
          </span>
        </>
      )}
    </nav>
  );
};