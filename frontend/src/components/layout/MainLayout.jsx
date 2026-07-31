import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SimpleHeader from './SimpleHeader';
import Footer from './Footer';

const MainLayout = ({ children, title = "" }) => {
  const navigate = useNavigate();
  const { isAuthenticated, userType, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SimpleHeader activePage="" />

      {/* Main Content */}
      <div className="bg-white flex-grow py-12">
        <div className="container mx-auto px-4">
          {title && (
            <h1 className="text-3xl font-bold mb-8">{title}</h1>
          )}
          {children}
        </div>
      </div>

      <Footer variant="simple" />
    </div>
  );
};

export default MainLayout;