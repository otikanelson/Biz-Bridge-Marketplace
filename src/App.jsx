import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import Home from "./components/pages/Home"; 
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import Dashboard from "./components/pages/Dashboard";
import NotFound from "./components/pages/NotFound";
import Unauthorized from "./components/pages/Unauthorized";
import Bookings from "./components/pages/Bookings";
import Services from "./components/pages/Services";
import Profile from "./components/pages/Profile";
import TermsOfService from "./components/pages/TermsOfService";
import PrivacyPolicy from "./components/pages/PrivacyPolicy";
import ContactUs from "./components/pages/ContactUs";
import FAQ from "./components/pages/FAQ";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Public information pages */}
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Protected routes - for both user types */}
          <Route element={<ProtectedRoute allowedUserTypes={['customer', 'artisan']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          
          {/* Protected routes - for artisans only */}
          <Route element={<ProtectedRoute allowedUserTypes={['artisan']} />}>
            <Route path="/services" element={<Services />} />
            <Route path="/services/add" element={<Dashboard />} /> {/* Will implement a real service add page later */}
          </Route>
          
          {/* Protected routes - for customers only */}
          <Route element={<ProtectedRoute allowedUserTypes={['customer']} />}>
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/saved" element={<Dashboard />} /> {/* Will implement a real saved artisans page later */}
          </Route>
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;