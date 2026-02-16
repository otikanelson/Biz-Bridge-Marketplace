// src/utils/profileNavigation.js - Enhanced Day 9 Implementation

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
 * Navigate to artisan profile from service card - Day 9 Core Feature
 * @param {object} navigate - React Router navigate function
 * @param {string} artisanId - The artisan's user ID
 * @param {string} currentUserId - The current logged-in user's ID (optional)
 */
export const navigateToArtisanProfile = (navigate, artisanId, currentUserId = null) => {
  const route = getProfileRoute(artisanId, currentUserId);
  navigate(route);
};

/**
 * Get profile context for UI rendering - Enhanced Day 9 Version
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
    viewerRole: currentUserId ? 'user' : 'guest',
    profileOwnerRole: profileData?.role || 'unknown'
  };
};

/**
 * Get appropriate navigation items based on user role and context - Day 9 Feature
 * @param {object} currentUser - Current logged-in user
 * @param {boolean} isOwnProfile - Whether viewing own profile
 * @returns {array} Navigation items array
 */
export const getNavigationItems = (currentUser, isOwnProfile = true) => {
  const baseItems = [
    { href: '/services', label: 'Browse Services' },
    { href: '/dashboard', label: 'Dashboard' }
  ];

  // Add "Your Profile" link when viewing others
  if (currentUser && !isOwnProfile) {
    baseItems.push({ href: '/profile', label: 'Your Profile' });
  }

  return baseItems;
};

/**
 * Get role-based quick actions for profile sidebar - Day 9 Feature
 * @param {string} userRole - User's role (artisan/customer)
 * @param {boolean} canEdit - Whether user can edit this profile
 * @param {number} servicesCount - Number of services (for artisans)
 * @returns {array} Quick actions array
 */
export const getQuickActions = (userRole, canEdit, servicesCount = 0) => {
  if (!canEdit) return [];

  const actions = [
    { 
      label: 'Complete Profile', 
      href: '/profile/edit', 
      icon: '✏️',
      variant: 'secondary'
    }
  ];

  if (userRole === 'artisan') {
    actions.unshift({
      label: servicesCount === 0 ? 'Add Your First Service' : 'Add New Service',
      href: '/ServicesAdd',
      icon: '🛠️',
      variant: 'primary'
    });
  }

  if (userRole === 'customer') {
    actions.push({
      label: 'Browse Services',
      href: '/services',
      icon: '🔍',
      variant: 'primary'
    });
  }

  return actions;
};

/**
 * Get appropriate warning messages for profile pages - Day 9 Feature
 * @param {string} pageContext - Context where warning appears
 * @param {string} userRole - User role
 * @returns {object|null} Warning configuration or null
 */
export const getPaymentWarning = (pageContext, userRole = null) => {
  const warnings = {
    'profile-contact': {
      size: 'small',
      variant: 'warning',
      show: userRole === 'artisan'
    },
    'service-request': {
      size: 'default',
      variant: 'warning',
      show: true
    },
    'booking-page': {
      size: 'large',
      variant: 'critical',
      show: true
    },
    'services-tab': {
      size: 'default',
      variant: 'info',
      show: userRole === 'artisan'
    }
  };

  const config = warnings[pageContext];
  return config && config.show ? config : null;
};

/**
 * Validate profile route and redirect if necessary - Day 9 Security Feature
 * @param {string} userId - User ID from URL params
 * @param {object} currentUser - Current logged-in user
 * @param {object} navigate - React Router navigate function
 * @returns {boolean} Whether route is valid
 */
export const validateProfileRoute = (userId, currentUser, navigate) => {
  // If no userId in URL but user is logged in, redirect to own profile
  if (!userId && currentUser) {
    navigate('/profile', { replace: true });
    return false;
  }

  // If userId matches current user, redirect to clean own profile URL
  if (userId && currentUser && userId === currentUser._id) {
    navigate('/profile', { replace: true });
    return false;
  }

  return true;
};

/**
 * Get tab configuration based on user role - Day 9 Feature
 * @param {string} userRole - User role (artisan/customer)
 * @param {number} servicesCount - Number of services for count display
 * @returns {array} Tab configuration array
 */
export const getProfileTabs = (userRole, servicesCount = 0) => {
  const baseTabs = [
    { key: 'overview', label: 'Overview', icon: '📋' }
  ];

  if (userRole === 'artisan') {
    return [
      ...baseTabs,
      { key: 'services', label: 'Services', icon: '🛠️', count: servicesCount },
      { key: 'portfolio', label: 'Portfolio', icon: '🎨' },
      { key: 'contact', label: 'Contact', icon: '📞' }
    ];
  } else {
    return [
      ...baseTabs,
      { key: 'activity', label: 'Activity', icon: '📊' },
      { key: 'preferences', label: 'Preferences', icon: '⚙️' }
    ];
  }
};

/**
 * Generate profile page title and metadata - Day 9 SEO Feature
 * @param {object} profileData - Profile data object
 * @param {boolean} isOwnProfile - Whether viewing own profile
 * @returns {object} Page metadata
 */
export const getProfileMetadata = (profileData, isOwnProfile) => {
  const name = profileData?.name || profileData?.username || 'User';
  const role = profileData?.role || 'user';
  
  if (isOwnProfile) {
    return {
      title: 'Your Profile - BizBridge',
      description: 'Manage your BizBridge profile and settings'
    };
  }

  return {
    title: `${name} - ${role === 'artisan' ? 'Artisan' : 'Customer'} Profile - BizBridge`,
    description: `View ${name}'s ${role === 'artisan' ? 'services and portfolio' : 'profile'} on BizBridge`
  };
};

/**
 * Check if profile action is allowed - Day 9 Security Feature
 * @param {string} action - Action to check (edit, contact, save)
 * @param {object} context - Profile context object
 * @returns {boolean} Whether action is allowed
 */
export const isActionAllowed = (action, context) => {
  const permissions = {
    'edit': context.canEdit,
    'contact': context.canContact,
    'save': context.canSave,
    'view-private': context.isOwnProfile,
    'view-stats': context.isOwnProfile || context.profileOwnerRole === 'artisan'
  };

  return permissions[action] || false;
};

// Export default object with all utilities
const ProfileNavigation = {
  getProfileRoute,
  canEditProfile,
  navigateToArtisanProfile,
  getProfileContext,
  getNavigationItems,
  getQuickActions,
  getPaymentWarning,
  validateProfileRoute,
  getProfileTabs,
  getProfileMetadata,
  isActionAllowed
};

export default ProfileNavigation;