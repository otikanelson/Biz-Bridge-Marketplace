// src/components/pages/ServiceRequestDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ServiceRequestDetails = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [request, setRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch request details
    // For now, just redirect back
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  }, [requestId, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading request details...</p>
        <p className="text-sm text-gray-500 mt-2">Redirecting to dashboard...</p>
      </div>
    </div>
  );
};

export default ServiceRequestDetails;