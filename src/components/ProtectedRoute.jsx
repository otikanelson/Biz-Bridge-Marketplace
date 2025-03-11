import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedUserTypes = ['customer', 'artisan'] }) => {
  const { isAuthenticated, userType, loading } = useAuth();
  const location = useLocation();

  // While auth is being checked, show nothing
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user type doesn't match allowed types, redirect to unauthorized
  if (!allowedUserTypes.includes(userType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render the child routes
  return <Outlet />;
};

export default ProtectedRoute;