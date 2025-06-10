// src/components/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <span onClick={() => navigate('/')} className="text-red-500 text-5xl select-none font-bold cursor-pointer">𐐒</span>
          <span onClick={() => navigate('/')} className="text-white text-4xl select-none font-bold cursor-pointer">B</span>
          <span onClick={() => navigate('/')} className="text-red-500 text-2xl select-none cursor-pointer font-semibold ml-5">BizBridge</span>
        </div>
        <div className="flex items-center space-x-8">
          {isAuthenticated ? (
            <>
              <span onClick={() => navigate('/dashboard')} className="hover:text-red-400 cursor-pointer">Dashboard</span>
              {userType === 'customer' && (
                <span onClick={() => navigate('/bookings')} className="hover:text-red-400 cursor-pointer">My Bookings</span>
              )}
              {userType === 'artisan' && (
                <span onClick={() => navigate('/services')} className="hover:text-red-400 cursor-pointer">My Services</span>
              )}
              {/* Add notification system here */}
              <NotificationSystem />
              <span onClick={handleLogout} className="hover:text-red-400 cursor-pointer">Logout</span>
            </>
          ) : (
            <>
              <span onClick={() => navigate('/login')} className="hover:text-red-400 cursor-pointer">Login</span>
              <span onClick={() => navigate('/signup')} className="hover:text-red-400 cursor-pointer">Sign Up</span>
              <span onClick={() => navigate('/signup?type=artisan')} className="hover:text-red-400 cursor-pointer">Get Your Service Listed</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;