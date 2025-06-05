import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import Home from "./components/pages/Home"; 
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import Dashboard from "./components/pages/Dashboard";
import NotFound from "./components/pages/NotFound";
import Unauthorized from "./components/pages/Unauthorized";
import Bookings from "./components/pages/Bookings";
import ServicesAdd from "./components/pages/ServicesAdd";
import TermsOfService from "./components/pages/TermsOfService";
import PrivacyPolicy from "./components/pages/PrivacyPolicy";
import ContactUs from "./components/pages/ContactUs";
import FAQ from "./components/pages/FAQ";
import ProtectedRoute from "./components/ProtectedRoute";
import ServicesManagement from './components/pages/ServicesManagement';
import ServiceView from './components/pages/ServiceView';
import ArtisanProfile from './components/pages/ArtisanProfile'; 
import Profile from './components/pages/Profile';
import ServiceSearch from './components/pages/ServiceSearch'; // Add this import

const App = () => {
  console.log("VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
  console.log("✅ App component is rendering!");
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* ✅ Public Service Search and Browse Routes */}
          <Route path="/services" element={<ServiceSearch />} />
          <Route path="/search" element={<ServiceSearch />} />
          <Route path="/browse" element={<ServiceSearch />} />
          
          {/* ✅ Public Profile Routes - Anyone can view profiles */}
          <Route path="/services/:serviceId" element={<ServiceView />} />
          <Route path="/artisan/:artisanId" element={<ArtisanProfile />} />
          <Route path="/user/:userId" element={<Profile />} />
          
          {/* Public information pages */}
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Protected routes - for both user types */}
          <Route element={<ProtectedRoute allowedUserTypes={['customer', 'artisan']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          
          {/* Protected routes - for artisans only */}
          <Route element={<ProtectedRoute allowedUserTypes={['artisan']} />}>
            <Route path="/ServicesManagement" element={<ServicesManagement />} />
            <Route path="/ServicesAdd" element={<ServicesAdd />} />
          </Route>
          
          {/* Protected routes - for customers only */}
          <Route element={<ProtectedRoute allowedUserTypes={['customer']} />}>
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/saved" element={<Dashboard />} />
          </Route>
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;