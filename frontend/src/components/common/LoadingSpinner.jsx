// frontend/src/components/common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ 
  message = "Loading...", 
  size = "large", 
  color = "red" 
}) => {
  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-8 w-8", 
    large: "h-12 w-12",
    xlarge: "h-16 w-16"
  };

  const colorClasses = {
    red: "border-red-500",
    blue: "border-blue-500",
    gray: "border-gray-500",
    green: "border-green-500"
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]} mb-4`}></div>
      {message && (
        <p className="text-gray-600 text-center">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;