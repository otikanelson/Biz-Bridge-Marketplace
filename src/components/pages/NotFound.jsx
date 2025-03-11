import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NotFound = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span onClick={() => navigate('/')} className="text-red-500 text-5xl select-none font-bold cursor-pointer">𐐒</span>
            <span onClick={() => navigate('/')} className="text-white text-4xl select-none font-bold cursor-pointer">B</span>
            <span onClick={() => navigate('/')} className="text-red-500 text-2xl select-none cursor-pointer font-semibold ml-5">BizBridge</span>
          </div>
          <nav className="flex space-x-8">
            <span onClick={() => navigate('/')} className="hover:text-red-400 cursor-pointer">Home</span>
            {!isAuthenticated ? (
              <>
                <span onClick={() => navigate('/login')} className="hover:text-red-400 cursor-pointer">Login</span>
                <span onClick={() => navigate('/login?tab=artisanSignup')} className="hover:text-red-400 cursor-pointer">Get Your Service List</span>
              </>
            ) : (
              <span onClick={() => navigate('/dashboard')} className="hover:text-red-400 cursor-pointer">Dashboard</span>
            )}
          </nav>
        </div>
      </header>

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

      {/* Footer */}
      <footer className="bg-black text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} BizBridge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;