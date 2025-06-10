import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import components
import HomePage from './components/pages/Home';
import Login from './components/pages/Login';
import Signup from './components/pages/Signup';
import Dashboard from './components/pages/Dashboard';
import Profile from './components/pages/Profile';
import ServiceView from './components/pages/ServiceView';
import ServiceSearch from './components/pages/ServiceSearch';
import ServicesAdd from './components/pages/ServicesAdd';
import ServicesManagement from './components/pages/ServicesManagement';
import Bookings from './components/pages/MyBookings';
import ContactUs from './components/pages/ContactUs';
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import TermsOfService from './components/pages/TermsOfService';
import Unauthorized from './components/pages/Unauthorized';
import ServiceRequestInbox from './components/pages/ServiceRequestInbox';
import ServiceRequestDetails from './components/pages/ServiceRequestDetail';
import MyBookings from './components/pages/MyBookings';
import MyWork from './components/pages/MyWork';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/services" element={<ServiceSearch />} />
            <Route path="/services/:serviceId" element={<ServiceView />} />
            
            {/* Legal/Info Pages */}
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Service Request Pages */}
            <Route path="/service-requests/inbox" element={
              <ProtectedRoute allowedUserTypes={['artisan']}>
                <ServiceRequestInbox />
              </ProtectedRoute>
            } />
            <Route path="/service-requests/:requestId" element={
              <ProtectedRoute>
                <ServiceRequestDetails />
              </ProtectedRoute>
            } />
            
            {/* Booking Pages */}
            <Route path="/bookings/my-bookings" element={
              <ProtectedRoute allowedUserTypes={['customer']}>
                <MyBookings />
              </ProtectedRoute>
            } />
            <Route path="/bookings/my-work" element={
              <ProtectedRoute allowedUserTypes={['artisan']}>
                <MyWork />
              </ProtectedRoute>
            } />
            
            {/* Profile Routes - Dynamic */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/user/:userId" element={<Profile />} /> {/* Public profile view */}
            
            {/* Protected Routes - All Users */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedUserTypes={['customer', 'artisan']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Customer Only Routes */}
            <Route path="/bookings" element={
              <ProtectedRoute allowedUserTypes={['customer']}>
                <Bookings />
              </ProtectedRoute>
            } />
            
            {/* Artisan Only Routes */}
            <Route path="/ServicesAdd" element={
              <ProtectedRoute allowedUserTypes={['artisan']}>
                <ServicesAdd />
              </ProtectedRoute>
            } />
            <Route path="/ServicesManagement" element={
              <ProtectedRoute allowedUserTypes={['artisan']}>
                <ServicesManagement />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={
              <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-xl text-gray-600 mb-8">Oops! Page not found</p>
                  <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
                  <div className="space-x-4">
                    <button 
                      onClick={() => window.location.href = '/'}
                      className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Go Home
                    </button>
                    <button 
                      onClick={() => window.history.back()}
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;