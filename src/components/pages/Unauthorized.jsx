import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
                <span onClick={() => navigate('/signup')} className="hover:text-red-400 cursor-pointer">Sign Up</span>
              </>
            ) : (
              <>
                <span onClick={() => navigate('/dashboard')} className="hover:text-red-400 cursor-pointer">Dashboard</span>
                <span onClick={handleLogout} className="hover:text-red-400 cursor-pointer">Logout</span>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="bg-white flex-grow flex items-center justify-center py-16 px-4">
        <div className="max-w-lg w-full text-center">
          <div className="mb-8">
            <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-left">
            <p className="text-red-700">
              {isAuthenticated ? (
                userType === 'customer' ? 
                  "This area is restricted to artisans only. As a customer, you don't have access to this page." :
                  "This area is restricted to customers only. As an artisan, you don't have access to this page."
              ) : (
                "You need to be logged in to access this page."
              )}
            </p>
          </div>
          
          <p className="text-gray-600 mb-8">
            Please navigate to an appropriate section of the website based on your account type.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {isAuthenticated ? (
              <>
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition"
                >
                  Go to Dashboard
                </button>
                <button 
                  onClick={() => navigate('/')} 
                  className="bg-gray-200 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-300 transition"
                >
                  Return to Home
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/login')} 
                  className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/signup')} 
                  className="bg-gray-200 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-300 transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
          
          {isAuthenticated && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-500 text-sm mb-4">
                If you believe you should have access to this page, please contact our support team.
              </p>
              <button 
                onClick={() => navigate('/contact')} 
                className="text-red-500 hover:text-red-600 text-sm font-medium"
              >
                Contact Support
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} BizBridge. All rights reserved.</p>
            <div className="mt-2 flex flex-wrap justify-center">
              <span onClick={() => navigate('/terms')} className="text-red-400 hover:text-red-500 mx-2 cursor-pointer">Terms of Service</span>
              <span onClick={() => navigate('/privacy')} className="text-red-400 hover:text-red-500 mx-2 cursor-pointer">Privacy Policy</span>
              <span onClick={() => navigate('/contact')} className="text-red-400 hover:text-red-500 mx-2 cursor-pointer">Contact Us</span>
              <span onClick={() => navigate('/faq')} className="text-red-400 hover:text-red-500 mx-2 cursor-pointer">FAQ</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Unauthorized;