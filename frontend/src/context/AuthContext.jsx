// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, loginUser, logoutUser, setAuthToken, registerCustomer, registerArtisan } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize authentication state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    console.log('🔑 Initializing authentication...');
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('🔑 No token found');
        setIsAuthenticated(false);
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      console.log('🔑 Token found, verifying user...');
      
      // Set the token for API calls
      setAuthToken(token);
      
      // Get current user data
      const response = await getCurrentUser();
      
      if (response.success && response.user) {
        console.log('🔑 User authenticated:', response.user.username, 'Role:', response.user.role);
        setCurrentUser(response.user);
        setIsAuthenticated(true);
        setAuthError(null);
      } else {
        console.log('🔑 Invalid token, clearing auth');
        handleAuthFailure();
      }
    } catch (error) {
      console.error('🔑 Auth initialization error:', error);
      handleAuthFailure();
    } finally {
      setLoading(false);
    }
  };

  const handleAuthFailure = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const login = async (credentials) => {
    console.log('🔑 Attempting login for:', credentials.email);
    setAuthError(null);
    
    try {
      const response = await loginUser(credentials);
      
      if (response.success && response.user && response.token) {
        console.log('🔑 Login successful:', response.user.username);
        setCurrentUser(response.user);
        setIsAuthenticated(true);
        setAuthError(null);
        
        return { success: true, user: response.user };
      } else {
        const errorMsg = response.message || 'Login failed';
        setAuthError(errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      console.error('🔑 Login error:', error);
      const errorMsg = error.message || 'Login failed. Please try again.';
      setAuthError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  // ✅ NEW: Register customer function
  const registerNewCustomer = async (formData) => {
    console.log('🔑 Registering new customer...');
    setAuthError(null);
    
    try {
      const response = await registerCustomer(formData);
      
      if (response.success && response.user && response.token) {
        console.log('🔑 Customer registration successful:', response.user.username);
        setCurrentUser(response.user);
        setIsAuthenticated(true);
        setAuthError(null);
        
        return { success: true, user: response.user };
      } else {
        const errorMsg = response.message || 'Registration failed';
        setAuthError(errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      console.error('🔑 Customer registration error:', error);
      const errorMsg = error.message || 'Registration failed. Please try again.';
      setAuthError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  // ✅ NEW: Register artisan function
  const registerNewArtisan = async (formData) => {
    console.log('🔑 Registering new artisan...');
    setAuthError(null);
    
    try {
      const response = await registerArtisan(formData);
      
      if (response.success && response.user && response.token) {
        console.log('🔑 Artisan registration successful:', response.user.username);
        setCurrentUser(response.user);
        setIsAuthenticated(true);
        setAuthError(null);
        
        return { success: true, user: response.user };
      } else {
        const errorMsg = response.message || 'Registration failed';
        setAuthError(errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      console.error('🔑 Artisan registration error:', error);
      const errorMsg = error.message || 'Registration failed. Please try again.';
      setAuthError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const logout = () => {
    console.log('🔑 Logging out user');
    logoutUser(); // This clears the token
    setCurrentUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
  };

  // Get user type helper
  const userType = currentUser?.role || null;

  // Get display name helper
  const getDisplayName = () => {
    if (!currentUser) return 'User';
    
    if (currentUser.role === 'customer') {
      return currentUser.fullName || currentUser.username || 'Customer';
    } else if (currentUser.role === 'artisan') {
      return currentUser.contactName || currentUser.businessName || currentUser.username || 'Artisan';
    } else {
      return currentUser.username || 'User';
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    userType,
    loading,
    authError,
    login,
    logout,
    registerNewCustomer, // ✅ NEW: Added customer registration
    registerNewArtisan,  // ✅ NEW: Added artisan registration
    getDisplayName,
    // Add a method to refresh user data
    refreshUser: initializeAuth
  };

  console.log('🔑 AuthContext state:', {
    isAuthenticated,
    userType,
    loading,
    hasUser: !!currentUser,
    username: currentUser?.username
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};