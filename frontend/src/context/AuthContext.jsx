// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { registerCustomer, registerArtisan, loginUser, logoutUser, getCurrentUser } from '../api/auth';

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
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Load user on app start
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setLoading(true);
    setAuthError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, user not authenticated');
        setLoading(false);
        return;
      }

      console.log('Token found, checking user authentication...');
      const response = await getCurrentUser();
      
      if (response.success && response.user) {
        console.log('User authenticated successfully:', response.user.role);
        setCurrentUser(response.user);
        setIsAuthenticated(true);
        setUserType(response.user.role);
        setAuthError(null);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      setAuthError(error.message || 'Authentication failed');
      // Clear invalid token
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setCurrentUser(null);
      setUserType(null);
    } finally {
      setLoading(false);
    }
  };

  const registerNewCustomer = async (formData) => {
    setLoading(true);
    setAuthError(null);
    
    try {
      console.log('Attempting customer registration...');
      const response = await registerCustomer(formData);
      
      if (response.success && response.user) {
        console.log('Customer registration successful');
        setCurrentUser(response.user);
        setIsAuthenticated(true);
        setUserType('customer');
        setAuthError(null);
        return { success: true };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Customer registration failed:', error);
      setAuthError(error.message || 'Registration failed');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const registerNewArtisan = async (formData) => {
    setLoading(true);
    setAuthError(null);
    
    try {
      console.log('Attempting artisan registration...');
      const response = await registerArtisan(formData);
      
      if (response.success && response.user) {
        console.log('Artisan registration successful');
        setCurrentUser(response.user);
        setIsAuthenticated(true);
        setUserType('artisan');
        setAuthError(null);
        return { success: true };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Artisan registration failed:', error);
      setAuthError(error.message || 'Registration failed');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    setAuthError(null);
    
    try {
      console.log('Attempting login for:', credentials.email);
      const response = await loginUser(credentials);
      
      if (response.success && response.user) {
        console.log('Login successful for user:', response.user.role);
        setCurrentUser(response.user);
        setIsAuthenticated(true);
        setUserType(response.user.role);
        setAuthError(null);
        return { success: true };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setAuthError(error.message || 'Login failed');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('User logging out...');
    logoutUser();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setUserType(null);
    setAuthError(null);
  };

  const clearError = () => {
    setAuthError(null);
  };

  const value = {
    currentUser,
    isAuthenticated,
    userType,
    loading,
    authError,
    registerNewCustomer,
    registerNewArtisan,
    login,
    logout,
    clearError,
    setAuthError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};