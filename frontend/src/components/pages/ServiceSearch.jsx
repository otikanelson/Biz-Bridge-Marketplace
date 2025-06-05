import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SearchFilters from '../layout/SearchFIlters';
import ServiceCard from '../cards/ServiceCard';
import { searchServices, getAllServices } from '../../api/search';

const ServiceSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, userType, logout } = useAuth();
  
  // State for search results and UI
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // State for filters and sorting
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

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
      console.log('Searching with params:', searchParams);
      
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
      
      console.log('Search result:', result);
      
      if (result && result.success) {
        setServices(result.services || []);
        setTotalResults(result.total || 0);
        setCurrentPage(result.currentPage || 1);
        setTotalPages(result.totalPages || 1);
      } else {
        throw new Error(result?.message || 'Failed to fetch services');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to load services. Please try again.');
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = (filters) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.set('search', filters.search);
    if (filters.jobCategory) params.set('category', filters.jobCategory);
    if (filters.location) params.set('location', filters.location);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    
    // Reset to page 1 for new searches
    params.set('page', '1');
    
    navigate(`/services?${params.toString()}`);
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

  // Handle service card click
  const handleViewService = (service) => {
    navigate(`/services/${service._id || service.id}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get current search params for display
  const currentSearchParams = getSearchParams();

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
            <span onClick={() => navigate('/')} className="hover:text-red-400 cursor-pointer">Home</span>
            {isAuthenticated ? (
              <>
                <span onClick={() => navigate('/dashboard')} className="hover:text-red-400 cursor-pointer">Dashboard</span>
                {userType === 'customer' && (
                  <span onClick={() => navigate('/bookings')} className="hover:text-red-400 cursor-pointer">My Bookings</span>
                )}
                <span onClick={handleLogout} className="hover:text-red-400 cursor-pointer">Logout</span>
              </>
            ) : (
              <>
                <span onClick={() => navigate('/login')} className="hover:text-red-400 cursor-pointer">Login</span>
                <span onClick={() => navigate('/signup')} className="hover:text-red-400 cursor-pointer">Sign Up</span>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="bg-gray-50 flex-grow">
        {/* Search Section */}
        <div className="bg-white border-b">
          <div className="container mx-auto py-6 px-4">
            <div className="mb-4">
              <h1 className="text-3xl font-bold mb-2">Find Services</h1>
              <p className="text-gray-600">Discover talented artisans and quality services</p>
            </div>
            
            {/* Search Filters */}
            <SearchFilters 
              onSearch={handleSearch}
              initialValues={{
                search: currentSearchParams.search,
                jobCategory: currentSearchParams.category,
                location: currentSearchParams.location
              }}
            />
          </div>
        </div>

        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Filters */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden text-red-500 hover:text-red-600"
                  >
                    {showFilters ? 'Hide' : 'Show'}
                  </button>
                </div>
                
                <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                  {/* Sort Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="title">Title A-Z</option>
                      <option value="popular">Most Popular</option>
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="all">All Prices</option>
                      <option value="under-10k">Under ₦10,000</option>
                      <option value="10k-50k">₦10,000 - ₦50,000</option>
                      <option value="50k-100k">₦50,000 - ₦100,000</option>
                      <option value="over-100k">Over ₦100,000</option>
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <button
                    onClick={() => {
                      setSortBy('newest');
                      setPriceRange('all');
                      setCategoryFilter('');
                      setLocationFilter('');
                      navigate('/services');
                    }}
                    className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content - Search Results */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  {!isLoading && (
                    <h2 className="text-xl font-semibold">
                      {totalResults === 0 ? 'No services found' : 
                       `${totalResults} ${totalResults === 1 ? 'service' : 'services'} found`}
                    </h2>
                  )}
                  {(currentSearchParams.category || currentSearchParams.location || currentSearchParams.search) && (
                    <p className="text-gray-600 mt-1">
                      {currentSearchParams.search && `Search: "${currentSearchParams.search}"`}
                      {currentSearchParams.category && ` • Category: ${currentSearchParams.category}`}
                      {currentSearchParams.location && ` • Location: ${currentSearchParams.location}`}
                    </p>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                  <p className="text-red-700">{error}</p>
                  <button 
                    onClick={performSearch}
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
                  {services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {services.map(service => (
                        <ServiceCard 
                          key={service._id || service.id} 
                          service={service}
                          onClick={handleViewService}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white rounded-lg">
                      <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No services found</h3>
                      <p className="mt-2 text-gray-500">
                        Try adjusting your search criteria or browse all services.
                      </p>
                      <button
                        onClick={() => navigate('/services')}
                        className="mt-6 bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition"
                      >
                        Browse All Services
                      </button>
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-12">
                      <div className="flex space-x-2">
                        {/* Previous Button */}
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-4 py-2 rounded ${
                            currentPage === 1 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                              : 'bg-white text-gray-700 hover:bg-gray-50 border'
                          }`}
                        >
                          Previous
                        </button>

                        {/* Page Numbers */}
                        {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                          let pageNumber;
                          if (totalPages <= 7) {
                            pageNumber = i + 1;
                          } else if (currentPage <= 4) {
                            pageNumber = i + 1;
                          } else if (currentPage >= totalPages - 3) {
                            pageNumber = totalPages - 6 + i;
                          } else {
                            pageNumber = currentPage - 3 + i;
                          }

                          return (
                            <button
                              key={i}
                              onClick={() => handlePageChange(pageNumber)}
                              className={`px-4 py-2 rounded ${
                                pageNumber === currentPage
                                  ? 'bg-red-500 text-white'
                                  : 'bg-white text-gray-700 hover:bg-gray-50 border'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        })}

                        {/* Next Button */}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`px-4 py-2 rounded ${
                            currentPage === totalPages
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border'
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
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
    </div>
  );
};

export default ServiceSearch;