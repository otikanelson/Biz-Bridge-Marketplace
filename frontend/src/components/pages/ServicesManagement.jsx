import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ServiceCard from '../../components/cards/ServiceCard';
import { getMyServices, deleteService, toggleServiceStatus } from '../../../../backend/src/api/Services'; // ✅ FIXED: Import path (Services.js not services.js)

const ServicesManagement = () => {
  const navigate = useNavigate();
  const { userType, logout } = useAuth();
  
  // State for services data
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for UI controls
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Ensure only artisans can access this page
  useEffect(() => {
    if (userType !== 'artisan') {
      navigate('/unauthorized');
    }
  }, [userType, navigate]);

  // Fetch services data
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('🔧 ServicesManagement: Fetching artisan services...');
        const response = await getMyServices();
        
        if (response && response.success) {
          // ✅ FIXED: Process services to ensure consistent ID structure
          const processedServices = (response.services || []).map(service => ({
            ...service,
            id: service._id || service.id,
            _id: service._id || service.id
          }));
          
          setServices(processedServices);
          console.log('🔧 ServicesManagement: Loaded', processedServices.length, 'services');
        } else {
          throw new Error(response?.message || 'Failed to fetch services');
        }
      } catch (error) {
        console.error('🔧 ServicesManagement: Error fetching services:', error);
        setError('Failed to load services. Please try again.');
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userType === 'artisan') {
      fetchServices();
    }
  }, [userType]);

  // ✅ FIXED: Handle service edit
  const handleEditService = (service) => {
    const serviceId = service._id || service.id;
    if (serviceId) {
      console.log('🔧 ServicesManagement: Editing service:', serviceId);
      navigate(`/ServicesAdd?edit=${serviceId}`);
    } else {
      console.error('🔧 ServicesManagement: Cannot edit - no service ID');
      setError('Cannot edit service - missing ID');
    }
  };

  // ✅ FIXED: Handle service deletion
  const handleDeleteService = async (service) => {
    try {
      const serviceId = service._id || service.id;
      if (!serviceId) {
        throw new Error('No service ID found');
      }

      console.log('🔧 ServicesManagement: Deleting service:', serviceId);
      const response = await deleteService(serviceId);
      
      if (response.success) {
        // Remove service from local state
        setServices(services.filter(s => (s._id || s.id) !== serviceId));
        console.log('🔧 ServicesManagement: Service deleted successfully');
      } else {
        throw new Error(response.message || 'Failed to delete service');
      }
    } catch (error) {
      console.error('🔧 ServicesManagement: Error deleting service:', error);
      setError('Failed to delete service. Please try again.');
    }
  };

  // ✅ FIXED: Handle toggle service status
  const handleToggleActive = async (service) => {
    try {
      const serviceId = service._id || service.id;
      if (!serviceId) {
        throw new Error('No service ID found');
      }

      console.log('🔧 ServicesManagement: Toggling service status:', serviceId);
      const response = await toggleServiceStatus(serviceId);
      
      if (response.success) {
        // Update service status in local state
        setServices(services.map(s => 
          (s._id || s.id) === serviceId 
            ? { ...s, isActive: !s.isActive } 
            : s
        ));
        console.log('🔧 ServicesManagement: Service status updated successfully');
      } else {
        throw new Error(response.message || 'Failed to update service status');
      }
    } catch (error) {
      console.error('🔧 ServicesManagement: Error toggling service status:', error);
      setError('Failed to update service status. Please try again.');
    }
  };

  // Filter services based on status and search term
  const filteredServices = services.filter(service => {
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && service.isActive) ||
      (filterStatus === 'inactive' && !service.isActive);
    
    const matchesSearch = !searchTerm || 
      service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const handleLogout = () => {
    logout();
    navigate('/');
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
            <span onClick={() => navigate('/dashboard')} className="hover:text-red-400 cursor-pointer">Dashboard</span>
            <span onClick={() => navigate('/ServicesAdd')} className="hover:text-red-400 cursor-pointer">Add Service</span>
            <span onClick={() => navigate('/profile')} className="hover:text-red-400 cursor-pointer">Profile</span>
            <span onClick={handleLogout} className="hover:text-red-400 cursor-pointer">Logout</span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="bg-white flex-grow py-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Services</h1>
              <p className="text-gray-600">
                Manage your services, view bookings, and track performance
              </p>
            </div>
            <button 
              onClick={() => navigate('/ServicesAdd')}
              className="mt-4 md:mt-0 bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition font-medium flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Service
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700">{error}</p>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 text-red-600 hover:text-red-800 underline text-sm"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Search and Filter Controls */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg min-w-[150px]"
              >
                <option value="all">All Services</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
          
          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
          ) : (
            <>
              {/* Services Count */}
              <div className="mb-6 text-sm text-gray-600">
                {filteredServices.length === 0 ? (
                  'No services found'
                ) : (
                  `Showing ${filteredServices.length} of ${services.length} services`
                )}
                {(searchTerm || filterStatus !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterStatus('all');
                    }}
                    className="ml-2 text-red-500 hover:text-red-700 underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              {/* Services Grid */}
              {filteredServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map(service => (
                    <ServiceCard 
                      key={service._id || service.id}
                      service={service}
                      showControls={true}
                      onEdit={handleEditService}
                      onDelete={handleDeleteService}
                      onToggleActive={handleToggleActive}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    {searchTerm || filterStatus !== 'all' ? 'No matching services found' : 'No services yet'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Try adjusting your search or filter criteria' 
                      : 'Create your first service to start receiving bookings from customers!'
                    }
                  </p>
                  <button 
                    onClick={() => navigate('/ServicesAdd')}
                    className="bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition font-medium"
                  >
                    {services.length === 0 ? 'Create Your First Service' : 'Add New Service'}
                  </button>
                </div>
              )}

              {/* Services Statistics */}
              {services.length > 0 && (
                <div className="mt-12 bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Services Overview</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded text-center">
                      <div className="text-2xl font-bold text-blue-600">{services.length}</div>
                      <div className="text-gray-600 text-sm">Total Services</div>
                    </div>
                    <div className="bg-white p-4 rounded text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {services.filter(s => s.isActive).length}
                      </div>
                      <div className="text-gray-600 text-sm">Active Services</div>
                    </div>
                    <div className="bg-white p-4 rounded text-center">
                      <div className="text-2xl font-bold text-amber-600">
                        {services.filter(s => !s.isActive).length}
                      </div>
                      <div className="text-gray-600 text-sm">Inactive Services</div>
                    </div>
                    <div className="bg-white p-4 rounded text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {Math.round((services.filter(s => s.isActive).length / services.length) * 100)}%
                      </div>
                      <div className="text-gray-600 text-sm">Active Rate</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              {services.length > 0 && (
                <div className="mt-8 bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => navigate('/ServicesAdd')}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition text-sm"
                    >
                      Add New Service
                    </button>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition text-sm"
                    >
                      View Dashboard
                    </button>
                    <button
                      onClick={() => navigate('/profile')}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition text-sm"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => {
                        setFilterStatus('inactive');
                        setSearchTerm('');
                      }}
                      className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition text-sm"
                    >
                      View Inactive Services
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} BizBridge. All rights reserved.</p>
            <div className="mt-2 flex flex-wrap justify-center space-x-4">
              <span onClick={() => navigate('/terms')} className="text-red-400 hover:text-red-500 cursor-pointer">Terms of Service</span>
              <span onClick={() => navigate('/privacy')} className="text-red-400 hover:text-red-500 cursor-pointer">Privacy Policy</span>
              <span onClick={() => navigate('/contact')} className="text-red-400 hover:text-red-500 cursor-pointer">Contact Us</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ServicesManagement;