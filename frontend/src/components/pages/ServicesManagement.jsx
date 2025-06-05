import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ServiceCard from '../../components/cards/ServiceCard';
import { getMyServices, deleteService, toggleServiceStatus } from '../../../../backend/src/api/Services';

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // Ensure only artisans can access this page
  useEffect(() => {
    if (userType !== 'artisan') {
      navigate('/unauthorized');
    }
  }, [userType, navigate]);

  // Fetch services data
// In ServicesManagement.jsx
useEffect(() => {
  const fetchServices = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getMyServices();
      
      if (response && response.success) {
        setServices(response.services || []);
      } else {
        throw new Error(response?.message || 'Failed to fetch services');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services. Please try again.');
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  fetchServices();
}, []);

  // Toggle service active status
  const handleToggleActive = async (service) => {
    try {
      await toggleServiceStatus(service.id);
      
      // Update services state locally
      setServices(services.map(s => 
        s.id === service.id ? { ...s, isActive: !s.isActive } : s
      ));
      
    } catch (error) {
      console.error('Error toggling service status:', error);
      setError('Failed to update service status. Please try again.');
    }
  };

  // Show delete confirmation modal
  const handleDeleteConfirmation = (service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  // Delete service
const handleDeleteService = async () => {
  try {
    setIsLoading(true);
    const response = await deleteService(serviceToDelete.id);
    
    if (response && response.success) {
      // Update services state by removing the deleted service
      setServices(services.filter(s => s.id !== serviceToDelete.id));
      // Show success message
      setSuccessMessage('Service deleted successfully');
      // Close the modal
      setShowDeleteModal(false);
      setServiceToDelete(null);
    } else {
      throw new Error(response?.message || 'Failed to delete service');
    }
  } catch (error) {
    console.error('Error deleting service:', error);
    setError('Failed to delete service. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  // Handle service edit
  const handleEditService = (service) => {
    navigate(`/services/edit/${service.id}`);
  };

  // Filter services based on status and search term
  const filteredServices = services.filter(service => {
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && service.isActive) || 
      (filterStatus === 'inactive' && !service.isActive);
    
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.category && service.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
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
            <span onClick={() => navigate('/ServicesManagement')} className="text-red-400 cursor-pointer">My Services</span>
            <span onClick={handleLogout} className="hover:text-red-400 cursor-pointer">Logout</span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="bg-white flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Services</h1>
            <button 
              onClick={() => navigate('/ServicesAdd')}
              className="bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition"
            >
              Add New Service
            </button>
          </div>
          
          {/* Filters and Search */}
          <div className="mb-8 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="all">All Services</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-md"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-700">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 text-red-600 hover:text-red-800 underline"
              >
                Try Again
              </button>
            </div>
          )}
          
          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
          ) : (
            <>
              {/* Services Grid */}
              {filteredServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map(service => (
                    <ServiceCard 
                      key={service.id || service._id} 
                      service={{
                        ...service,
                        id: service.id || service._id // Handle both id formats
                      }}
                      showControls={true}
                      onEdit={() => handleEditService(service)}
                      onDelete={() => handleDeleteConfirmation(service)}
                      onToggleActive={() => handleToggleActive(service)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No services found</h3>
                  <p className="mt-2 text-gray-500">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Try adjusting your filters or search criteria.' 
                      : 'You haven\'t created any services yet.'}
                  </p>
                  <button
                    onClick={() => navigate('/ServicesAdd')}
                    className="mt-6 bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition"
                  >
                    Add Your First Service
                  </button>
                </div>
              )}
            </>
          )}
          
          {/* Service Stats */}
          {services.length > 0 && (
            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Service Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded shadow-sm">
                  <p className="text-sm text-gray-500">Total Services</p>
                  <p className="text-2xl font-bold">{services.length}</p>
                </div>
                <div className="bg-white p-4 rounded shadow-sm">
                  <p className="text-sm text-gray-500">Active Services</p>
                  <p className="text-2xl font-bold">{services.filter(s => s.isActive).length}</p>
                </div>
                <div className="bg-white p-4 rounded shadow-sm">
                  <p className="text-sm text-gray-500">Inactive Services</p>
                  <p className="text-2xl font-bold">{services.filter(s => !s.isActive).length}</p>
                </div>
              </div>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Delete Service</h3>
            <p className="mb-4">
              Are you sure you want to delete <span className="font-medium">{serviceToDelete?.title}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => {
                  setShowDeleteModal(false);
                  setServiceToDelete(null);
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteService}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManagement;