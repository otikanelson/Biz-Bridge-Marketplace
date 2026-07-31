import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SimpleHeader from '../layout/SimpleHeader';
import Footer from '../layout/Footer';

const NotFound = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <SimpleHeader activePage="" />

      {/* Main Content */}
      <div className="bg-white flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-3xl w-full text-center">
          <div className="mb-8">
            <span className="text-red-500 text-9xl font-bold">404</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-6">Page Not Found</h1>
          
          <p className="text-gray-600 text-lg mb-8">
            Oops! It seems like the page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="border-t border-b border-gray-200 py-8 px-4 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Here are some helpful links:</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/" className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 transition">
                <div className="text-red-500 text-3xl mb-2">🏠</div>
                <div className="font-medium">Home</div>
                <div className="text-sm text-gray-500">Return to our homepage</div>
              </Link>
              
              <Link to={isAuthenticated ? "/dashboard" : "/login"} className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 transition">
                <div className="text-red-500 text-3xl mb-2">👤</div>
                <div className="font-medium">{isAuthenticated ? "Dashboard" : "Login"}</div>
                <div className="text-sm text-gray-500">{isAuthenticated ? "Go to your dashboard" : "Sign in to your account"}</div>
              </Link>
              
              <Link to="/login?tab=artisanSignup" className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 transition">
                <div className="text-red-500 text-3xl mb-2">🛠️</div>
                <div className="font-medium">Register as Artisan</div>
                <div className="text-sm text-gray-500">Join our community</div>
              </Link>
            </div>
          </div>
          
          <button 
            onClick={() => navigate(-1)} 
            className="bg-red-500 text-white py-3 px-8 rounded-md hover:bg-red-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>

      <Footer variant="simple" />
    </div>
  );
};

export default NotFound;