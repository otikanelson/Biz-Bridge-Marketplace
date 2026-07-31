import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ServiceCard from '../cards/ServiceCard';
import { searchServices, getAllServices } from '../../api/search';
import AppHeader from '../layout/AppHeader';
import Footer from '../layout/Footer';

const ServiceSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, userType, logout } = useAuth();
  
  // Search states for navbar
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  
  // State for search results and UI
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // State for filters and sorting
  const [sortBy, setSortBy] = useState('newest');

  // Job categories for search
  const categories = [
    'Woodworking', 'Pottery', 'Jewelry Making', 'Textile Art', 
    'Leathercraft', 'Metalwork', 'Basket Weaving', 'Beadwork',
    'Calabash Decoration', 'Glass Blowing', 'Leather Shoes', 'Embroidery',
    'Soap Making', 'Candle Making', 'Hair Braiding & Styling'
  ];

  // Lagos LGAs for search
  const locations = [
    'Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Badagry',
    'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja',
    'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin',
    'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere', 'Yaba'
  ];

  // Get search parameters from URL
  const getSearchParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      search: params.get('search') || '',
      category: params.get('category') || params.get('job') || '',
      location: params.get('location') || '',
      page: parseInt(params.get('page') || '1'),
      sort: params.get('sort') || 'newest'
    };
  };

  // Initialize search states from URL on component mount
  useEffect(() => {
    const params = getSearchParams();
    setSearchQuery(params.search);
    setSelectedCategory(params.category);
    setSelectedLocation(params.location);
    setSortBy(params.sort);
  }, []);

  // Initialize search on component mount and when URL changes
  useEffect(() => {
    performSearch();
  }, [location.search]);

  // Perform the search
  const performSearch = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const searchParams = getSearchParams();
      console.log('🔍 ServiceSearch: Searching with params:', searchParams);
      
      let result;
      
      // If no search criteria, get all services
      if (!searchParams.search && !searchParams.category && !searchParams.location) {
        result = await getAllServices({
          page: searchParams.page,
          limit: 12,
          sort: searchParams.sort
        });
      } else {
        // Otherwise, perform filtered search
        result = await searchServices({
          search: searchParams.search,
          category: searchParams.category,
          location: searchParams.location,
          page: searchParams.page,
          limit: 12,
          sort: searchParams.sort
        });
      }
      
      console.log('🔍 ServiceSearch: Search result:', result);
      
      if (result && result.success) {
        const processedServices = (result.services || []).map(service => ({
          ...service,
          id: service._id || service.id,
          _id: service._id || service.id
        }));
        
        setServices(processedServices);
        setTotalResults(result.total || result.totalResults || 0);
        setCurrentPage(result.currentPage || searchParams.page);
        setTotalPages(result.totalPages || Math.ceil((result.total || 0) / 12));
        
        console.log(`🔍 ServiceSearch: Loaded ${processedServices.length} services`);
      } else {
        throw new Error(result?.message || 'Failed to fetch services');
      }
    } catch (err) {
      console.error('🔍 ServiceSearch: Search error:', err);
      setError(err.message || 'Failed to load services. Please try again.');
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle navbar search
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
    if (sortBy !== 'newest') {
      searchParams.set('sort', sortBy);
    }
    
    // Reset to page 1 for new searches
    searchParams.set('page', '1');
    
    navigate(`/services?${searchParams.toString()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    const params = new URLSearchParams(location.search);
    params.set('page', page.toString());
    navigate(`/services?${params.toString()}`);
  };

  // Handle sort change
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    const params = new URLSearchParams(location.search);
    params.set('sort', newSort);
    params.set('page', '1'); // Reset to first page
    navigate(`/services?${params.toString()}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get current search params for display
  const currentSearchParams = getSearchParams();

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        onSearch={handleSearch}
        activePage="services"
      />

      {/* Main Content - Add top padding for fixed header */}
      <div className="bg-gray-50 flex-grow pt-24">
        <div className="container mx-auto px-4 py-8">
          {/* Results Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  {currentSearchParams.search ? 'Search Results' : 'All Services'}
                </h1>
                {!isLoading && (
                  <p className="text-gray-600 text-lg">
                    {totalResults === 0 ? 
                      'No services found' : 
                      `${totalResults} ${totalResults === 1 ? 'service' : 'services'} found`}
                  </p>
                )}
                {(currentSearchParams.category || currentSearchParams.location || currentSearchParams.search) && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {currentSearchParams.search && (
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                        Search: "{currentSearchParams.search}"
                      </span>
                    )}
                    {currentSearchParams.category && (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        Category: {currentSearchParams.category}
                      </span>
                    )}
                    {currentSearchParams.location && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Location: {currentSearchParams.location}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Sort Controls */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-red-700 font-medium">Something went wrong</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                  <button 
                    onClick={performSearch}
                    className="mt-3 text-red-600 hover:text-red-800 underline text-sm font-medium"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading services...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Services Grid */}
              {services.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
                    {services.map(service => (
                      <ServiceCard 
                        key={service._id || service.id} 
                        service={service}
                        showControls={false}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center">
                      <div className="flex items-center space-x-2">
                        {/* Previous Button */}
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-4 py-2 rounded-lg font-medium ${
                            currentPage === 1
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                          }`}
                        >
                          Previous
                        </button>

                        {/* Page Numbers */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-4 py-2 rounded-lg font-medium ${
                                currentPage === pageNum
                                  ? 'bg-red-500 text-white'
                                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        {totalPages > 5 && (
                          <>
                            <span className="px-2 text-gray-500">...</span>
                            <button
                              onClick={() => handlePageChange(totalPages)}
                              className={`px-4 py-2 rounded-lg font-medium ${
                                currentPage === totalPages
                                  ? 'bg-red-500 text-white'
                                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                              }`}
                            >
                              {totalPages}
                            </button>
                          </>
                        )}

                        {/* Next Button */}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`px-4 py-2 rounded-lg font-medium ${
                            currentPage === totalPages
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <div className="max-w-md mx-auto">
                    <div className="text-8xl mb-6">🔍</div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">No services found</h3>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                      {currentSearchParams.search || currentSearchParams.category || currentSearchParams.location
                        ? 'Try adjusting your search criteria or browse all services.'
                        : 'No services are available at the moment. Check back later!'}
                    </p>
                    <div className="space-y-3">
                      {(currentSearchParams.search || currentSearchParams.category || currentSearchParams.location) && (
                        <button
                          onClick={() => navigate('/services')}
                          className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition font-medium"
                        >
                          Browse All Services
                        </button>
                      )}
                      <div>
                        <button
                          onClick={() => navigate('/')}
                          className="text-red-500 hover:text-red-600 font-medium"
                        >
                          ← Back to Home
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer variant="full" />
    </div>
  );
};

export default ServiceSearch;