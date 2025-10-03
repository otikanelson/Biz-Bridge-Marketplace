// src/pages/ServicesManagement.jsx - Complete Rewrite with Fixed Image Display
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ServiceCard from '../../components/cards/ServiceCard';

// API service functions for managing artisan's services
const getMyServices = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('🔄 Fetching artisan services from API...');
    const response = await fetch('http://localhost:3000/api/services/my-services', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch services');
    }

    const data = await response.json();
    console.log('✅ Services fetched successfully:', {
      count: data.services?.length || 0,
      services: data.services?.map(s => ({
        id: s._id,
        title: s.title,
        hasImages: !!(s.images?.length || s.serviceImage),
        pricingType: s.pricing?.type
      }))
    });
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching services:', error);
    throw error;
  }
};

const deleteService = async (serviceId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('🗑️ Deleting service:', serviceId);
    const response = await fetch(`http://localhost:3000/api/services/${serviceId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete service');
    }

    const data = await response.json();
    console.log('✅ Service deleted successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Error deleting service:', error);
    throw error;
  }
};

const ServicesManagement = () => {
  const navigate = useNavigate();
  const { userType, currentUser, logout } = useAuth();
  
  // Search states for navbar
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  
  // State for services data
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for UI controls
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // Categories and locations for navbar search
  const categories = [
    'Woodworking', 'Pottery', 'Jewelry Making', 'Textile Art', 
    'Leathercraft', 'Metalwork', 'Basket Weaving', 'Beadwork',
    'Calabash Decoration', 'Glass Blowing', 'Leather Shoes', 'Embroidery',
    'Soap Making', 'Candle Making', 'Hair Braiding & Styling'
  ];

  const locations = [
    'Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Badagry',
    'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja',
    'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin',
    'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere', 'Yaba'
  ];

  // Redirect non-artisans
  useEffect(() => {
    if (userType !== 'artisan') {
      navigate('/unauthorized');
      return;
    }
  }, [userType, navigate]);

  // Fetch services from database
  useEffect(() => {
    const fetchServices = async () => {
      if (userType !== 'artisan') return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await getMyServices();
        
        if (response.success && response.services) {
          setServices(response.services);
        } else {
          throw new Error('Failed to load services');
        }
      } catch (error) {
        setError(error.message || 'Failed to load services. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServices();
  }, [userType]);

  // Filter services based on status and search term
  const filteredServices = services.filter(service => {
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && service.isActive) ||
      (filterStatus === 'inactive' && !service.isActive);
    
    const matchesSearch = searchTerm === '' || 
      service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Handle actions
  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    
    if (searchQuery && searchQuery.trim()) {
      searchParams.set('search', searchQuery.trim());
    }
    if (selectedCategory && selectedCategory !== '') {
      searchParams.set('category', selectedCategory);
    }
    if (selectedLocation && selectedLocation !== '') {
      searchParams.set('location', selectedLocation);
    }
    
    const queryString = searchParams.toString();
    navigate(queryString ? `/services?${queryString}` : '/services');
  };

  const handleEditService = (service) => {
    navigate(`/ServicesAdd/${service._id}`);
  };

  const handleDeleteClick = (service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;
    
    try {
      await deleteService(serviceToDelete._id);
      setServices(services.filter(s => s._id !== serviceToDelete._id));
      setShowDeleteModal(false);
      setServiceToDelete(null);
    } catch (error) {
      alert('Failed to delete service: ' + error.message);
    }
  };

  const handleToggleStatus = async (service) => {
    // Note: This would need an API endpoint to toggle service status
    // For now, we'll just update the local state
    setServices(services.map(s => 
      s._id === service._id 
        ? { ...s, isActive: !s.isActive }
        : s
    ));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (userType !== 'artisan') {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      {/* Header - Consistent with app pattern */}
      <header className="bg-black text-white w-full top-0 z-10 fixed">
        <div className="py-2">
          <div className="container mx-auto px-4 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center cursor-pointer py-3" onClick={() => navigate('/')}>
              <span className="text-red-500 text-5xl select-none font-bold">𐐒</span>
              <span className="text-white text-4xl select-none font-bold">B</span>
              <span className="text-red-500 text-2xl select-none font-semibold ml-5">BizBridge</span>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-6 text-sm">
              <span onClick={() => navigate('/dashboard')} className="text-xs cursor-pointer hover:text-red-400">
              <div>Your</div>
              <div className='font-bold'>Dashboard</div></span>
              <span onClick={() => navigate('/bookings/my-work')} className="text-xs cursor-pointer hover:text-red-400">
              <div>Your</div>
              <div className='font-bold'>bookings</div></span>
              <span onClick={() => navigate('/service-requests/inbox')} className="text-xs cursor-pointer hover:text-red-400">
              <div>Service</div>
              <div className='font-bold'>requests</div></span>
              <span onClick={() => navigate('/profile')} className="text-xs cursor-pointer hover:text-red-400">
              <div>Your</div>
              <div className='font-bold'>Profile</div></span>
              <span onClick={handleLogout}  className="text-xs cursor-pointer hover:text-red-400">
              <div>Sign</div>
              <div className='font-bold'>out</div></span>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="bg-gray-50 flex-grow pt-32">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Services</h1>
                <p className="text-gray-600">
                  Manage your services and track their performance
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/ServicesAdd')}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition font-medium"
                >
                  Add New Service
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-600">Total Services</h3>
                <p className="text-2xl font-bold text-blue-700">{services.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-600">Active Services</h3>
                <p className="text-2xl font-bold text-green-700">
                  {services.filter(s => s.isActive).length}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600">Inactive Services</h3>
                <p className="text-2xl font-bold text-gray-700">
                  {services.filter(s => !s.isActive).length}
                </p>
              </div>
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search your services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <svg className="absolute right-3 top-3 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Services</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">View:</span>
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="bg-white rounded-lg shadow-sm p-12">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                <span className="ml-3 text-gray-600">Loading your services...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <div className="flex items-center">
                <div className="text-red-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-red-800 text-sm font-medium ml-2">{error}</span>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Try again
              </button>
            </div>
          )}

          {/* Services Content */}
          {!isLoading && !error && (
            <>
              {filteredServices.length === 0 ? (
                /* Empty State */
                <div className="bg-white rounded-lg shadow-sm p-12">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {services.length === 0 
                        ? "No services yet" 
                        : "No services match your filters"
                      }
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {services.length === 0
                        ? "You haven't created any services yet. Start by adding your first service!"
                        : "No services match your current filters. Try adjusting your search or filter criteria."
                      }
                    </p>
                    {services.length === 0 && (
                      <button
                        onClick={() => navigate('/ServicesAdd')}
                        className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition font-medium"
                      >
                        Add Your First Service
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Services Display */
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {viewMode === 'grid' ? (
                    /* Grid View */
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
                      {filteredServices.map((service) => (
                        <ServiceCard
                          key={service._id}
                          service={service}
                          showActions={true}
                          onEdit={handleEditService}
                          onDelete={handleDeleteClick}
                          onToggleStatus={handleToggleStatus}
                        />
                      ))}
                    </div>
                  ) : (
                    /* List View */
                    <div className="space-y-6 p-6">
                      {filteredServices.map((service) => (
                        <div key={service._id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <ServiceCard
                            service={service}
                            showActions={true}
                            onEdit={handleEditService}
                            onDelete={handleDeleteClick}
                            onToggleStatus={handleToggleStatus}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">Delete Service</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete "{serviceToDelete?.title}"? This action cannot be undone.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManagement;