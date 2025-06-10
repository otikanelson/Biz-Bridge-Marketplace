// frontend/src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedUserTypes = ['customer', 'artisan', 'admin'] }) => {
  const { isAuthenticated, userType, loading, currentUser } = useAuth();
  const location = useLocation();

  console.log('🔒 ProtectedRoute Check:', {
    isAuthenticated,
    userType,
    loading,
    currentUser: currentUser ? 'exists' : 'null',
    allowedUserTypes,
    pathname: location.pathname
  });

  // While auth is being checked, show loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login with return path
  if (!isAuthenticated) {
    console.log('🔒 Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user type doesn't match allowed types, show unauthorized
  if (!allowedUserTypes.includes(userType)) {
    console.log('🔒 User type not allowed:', userType, 'allowed:', allowedUserTypes);
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center bg-red-50 p-8 rounded-lg">
          <svg className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold mb-2 text-red-800">Access Denied</h2>
          <p className="text-red-700 mb-4">You don't have permission to access this page.</p>
          <p className="text-sm text-gray-600 mb-4">
            Required: {allowedUserTypes.join(', ')} | Your role: {userType}
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  console.log('🔒 Access granted, rendering children');
  // Render the protected content
  return children;
};

export default ProtectedRoute;