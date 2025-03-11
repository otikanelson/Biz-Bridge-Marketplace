import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the auth context
const AuthContext = createContext(null);

// Provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check localStorage on init
  useEffect(function() {
    const userData = localStorage.getItem('userData');
    const userTypeData = localStorage.getItem('userType');
    
    if (userData && userTypeData) {
      setCurrentUser(JSON.parse(userData));
      setUserType(userTypeData);
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  // Login function
  function login(userData, type) {
    try {
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('userType', type);
      
      setCurrentUser(userData);
      setUserType(type);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  // Signup function
  function signup(userData, type) {
    try {
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('userType', type);
      
      setCurrentUser(userData);
      setUserType(type);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  }

  // Logout function
  function logout() {
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
    
    setCurrentUser(null);
    setUserType(null);
    setIsAuthenticated(false);
  }

  const value = {
    currentUser,
    userType,
    isAuthenticated,
    loading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}