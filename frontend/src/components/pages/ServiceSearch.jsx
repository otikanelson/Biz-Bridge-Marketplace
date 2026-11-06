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

  // Job categories for search - Match backend categories exactly
  const categories = [
    'Woodworking', 'Pottery & Ceramics', 'Leathercraft', 'Textile Art',
    'Jewelry Making', 'Metalwork', 'Glass Art', 'Traditional Clothing',
    'Painting & Drawing', 'Sculpture', 'Basket Weaving', 'Beadwork',
    'Paper Crafts', 'Soap & Candle Making', 'Calabash Carving',
    'Musical Instruments', 'Hair Braiding & Styling', 'Furniture Restoration',
    'Shoemaking', 'Sign Writing', 'Tie & Dye', 'Adire Textile',
    'Food Preservation', 'Batik', 'Embroidery', 'Photography', 'Other'
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
        activeCategory={currentSearchParams.category}
      />

      {/* Main Content with Gradient Background like Home page */}
      <div className="flex-grow bg-gradient-to-r from-red-500 to-orange-800">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 sm:p-6">
            {/* Results Header */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                <div className="text-white">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                    {currentSearchParams.search ? 'Search Results' : 'All Services'}
                  </h1>
                  {!isLoading && (
                    <p className="text-white/90 text-base sm:text-lg">
                      {totalResults === 0 ? 
                        'No services found' : 
                        `${totalResults} ${totalResults === 1 ? 'service' : 'services'} found`}
                    </p>
                  )}
                  {(currentSearchParams.category || currentSearchParams.location || currentSearchParams.search) && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {currentSearchParams.search && (
                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm">
                          Search: "{currentSearchParams.search}"
                        </span>
                      )}
                      {currentSearchParams.category && (
                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm">
                          Category: {currentSearchParams.category}
                        </span>
                      )}
                      {currentSearchParams.location && (
                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm">
                          Location: {currentSearchParams.location}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Sort Controls */}
                <div className="flex items-center space-x-2">
                  <label className="text-xs sm:text-sm text-white font-medium whitespace-nowrap">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="border border-white/30 rounded-lg px-3 py-2 text-sm bg-white/20 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <option value="newest" className="text-black">Newest First</option>
                    <option value="oldest" className="text-black">Oldest First</option>
                    <option value="price_low" className="text-black">Price: Low to High</option>
                    <option value="price_high" className="text-black">Price: High to Low</option>
                    <option value="rating" className="text-black">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-white/20 backdrop-blur-sm border-l-4 border-white p-4 sm:p-6 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3 text-white">
                    <p className="font-medium text-sm sm:text-base">Something went wrong</p>
                    <p className="text-white/80 text-xs sm:text-sm mt-1">{error}</p>
                    <button 
                      onClick={performSearch}
                      className="mt-3 text-white hover:text-white/80 underline text-xs sm:text-sm font-medium"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading ? (
              <div className="flex justify-center py-12 sm:py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-white mx-auto mb-4"></div>
                  <p className="text-white text-sm sm:text-base">Loading services...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Services Grid - matching Home page layout */}
                {services.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 mb-8">
                      {services.map(service => (
                        <div key={service._id || service.id}>
                          <ServiceCard 
                            service={service}
                            showControls={false}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center mt-8">
                        <div className="flex items-center space-x-2">
                          {/* Previous Button */}
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base ${
                              currentPage === 1
                                ? 'bg-white/10 text-white/40 cursor-not-allowed'
                                : 'bg-white text-red-500 hover:bg-white/90'
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
                                className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base ${
                                  currentPage === pageNum
                                    ? 'bg-white text-red-500'
                                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}

                          {totalPages > 5 && (
                            <>
                              <span className="px-2 text-white text-sm sm:text-base">...</span>
                              <button
                                onClick={() => handlePageChange(totalPages)}
                                className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base ${
                                  currentPage === totalPages
                                    ? 'bg-white text-red-500'
                                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
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
                            className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base ${
                              currentPage === totalPages
                                ? 'bg-white/10 text-white/40 cursor-not-allowed'
                                : 'bg-white text-red-500 hover:bg-white/90'
                            }`}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 sm:py-20">
                    <div className="max-w-md mx-auto text-white">
                      <div className="text-6xl sm:text-4xl mb-6">🔍</div>
                      <h3 className="text-xl sm:text-2xl font-semibold mb-4">No services found</h3>
                      <p className="text-white/80 mb-8 leading-relaxed text-sm sm:text-base px-4">
                        {currentSearchParams.search || currentSearchParams.category || currentSearchParams.location
                          ? 'Try adjusting your search criteria or browse all services.'
                          : 'No services are available at the moment. Check back later!'}
                      </p>
                      <div className="space-y-3">
                        {(currentSearchParams.search || currentSearchParams.category || currentSearchParams.location) && (
                          <button
                            onClick={() => navigate('/services')}
                            className="bg-white text-red-500 px-6 sm:px-8 py-3 rounded-lg hover:bg-white/90 transition font-medium text-sm sm:text-base"
                          >
                            Browse All Services
                          </button>
                        )}
                        <div>
                          <button
                            onClick={() => navigate('/')}
                            className="text-white hover:text-white/80 font-medium text-sm sm:text-base"
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
      </div>
      <Footer variant="full" />
    </div>
  );
};

export default ServiceSearch;