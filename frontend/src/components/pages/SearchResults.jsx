import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SearchFilters from '../layout/SearchFIlters';
import ServiceCard from '../../components/cards/ServiceCard';


const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const jobCategory = params.get('job') || '';
    const locationName = params.get('location') || '';
    
    // In a real app, you would make an API call here
    // For now we're just simulating a search
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock results - in a real app this would come from your API
        const mockResults = [
          {
            id: 'a101',
            name: 'John Adebayo',
            businessName: 'Premium Woodworks',
            categories: ['Woodworking', 'Furniture Restoration', 'Carpentry'],
            locations: ['Lagos', 'Ikeja', 'Surulere'],
            expertise: 'Expert',
            rating: 4.8,
            description: 'Premium Woodworks specializes in creating high-quality custom wooden furniture using traditional techniques and locally-sourced materials.',
            imageUrl: ''
          },
          {
            id: 'a102',
            name: 'Aminat Oladele',
            businessName: 'Creative Ceramics',
            categories: ['Pottery & Ceramics'],
            locations: ['Lagos', 'Lekki', 'Ikoyi'],
            expertise: 'Advanced',
            rating: 4.5,
            description: 'Handcrafted ceramic pieces including decorative items, tableware, and custom commissions.',
            imageUrl: ''
          },
          {
            id: 'a103',
            name: 'Emeka Nwosu',
            businessName: 'Precision Leatherworks',
            categories: ['Leathercraft', 'Shoemaking'],
            locations: ['Lagos', 'Surulere', 'Mainland'],
            expertise: 'Expert',
            rating: 4.7,
            description: 'Custom leather goods including bags, footwear, and accessories made with premium leather.',
            imageUrl: ''
          },
          {
            id: 'a104',
            name: 'Fatima Ibrahim',
            businessName: 'Heritage Textiles',
            categories: ['Textile Art', 'Tie & Dye', 'Adire Textile'],
            locations: ['Lagos', 'Yaba', 'Alimosho'],
            expertise: 'Expert',
            rating: 4.9,
            description: 'Traditional textile art featuring adire, batik, and tie-dye techniques on various fabrics.',
            imageUrl: ''
          },
          {
            id: 'a105',
            name: 'Samuel Johnson',
            businessName: 'Elegant Gems',
            categories: ['Jewelry Making'],
            locations: ['Lagos', 'Victoria Island', 'Ikoyi'],
            expertise: 'Advanced',
            rating: 4.6,
            description: 'Handcrafted jewelry pieces using gold, silver, and locally sourced gemstones.',
            imageUrl: ''
          }
        ].filter(artisan => {
          const matchesJob = !jobCategory || artisan.categories.includes(jobCategory);
          const matchesLocation = !locationName || artisan.locations.includes(locationName);
          return matchesJob && matchesLocation;
        });
        
        setResults(mockResults);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResults();
  }, [location.search]);
  
  const handleSearch = (filters) => {
    navigate(`/search?job=${encodeURIComponent(filters.jobCategory || '')}&location=${encodeURIComponent(filters.location || '')}`);
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
            <span onClick={() => navigate('/')} className="hover:text-red-400 cursor-pointer">Home</span>
            {isAuthenticated ? (
              <span onClick={() => navigate('/dashboard')} className="hover:text-red-400 cursor-pointer">Dashboard</span>
            ) : (
              <>
                <span onClick={() => navigate('/login')} className="hover:text-red-400 cursor-pointer">Login</span>
                <span onClick={() => navigate('/signup')} className="hover:text-red-400 cursor-pointer">Sign Up</span>
              </>
            )}
          </nav>
        </div>
      </header>
      
      <div className="bg-white flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Search Results</h1>
          
          {/* Search filters */}
          <div className="mb-8">
            <SearchFilters 
              onSearch={handleSearch}
              initialValues={{
                jobCategory: new URLSearchParams(location.search).get('job') || '',
                location: new URLSearchParams(location.search).get('location') || ''
              }}
            />
          </div>
          
          {/* Results section */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((artisan) => (
                <div key={artisan.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer">
                  <div onClick={() => navigate(`/artisan/${artisan.id}`)} className="relative h-48 overflow-hidden">
                    <img 
                      src={artisan.imageUrl} 
                      alt={artisan.businessName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 onClick={() => navigate(`/artisan/${artisan.id}`)} className="text-lg font-semibold mb-1 cursor-pointer hover:text-red-500">{artisan.businessName}</h3>
                    <p className="text-sm text-gray-600 mb-2">{artisan.name}</p>
                    
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">{artisan.categories[0]}</span>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 text-sm font-medium">{artisan.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 line-clamp-3 mb-4">{artisan.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{artisan.locations.slice(0, 2).join(', ')}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{artisan.expertise} Level</span>
                    </div>
                    
                    <button 
                      onClick={() => navigate(`/artisan/${artisan.id}`)}
                      className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No results found</h3>
              <p className="mt-1 text-gray-500">No artisans match your search criteria.</p>
              <button 
                onClick={() => {
                  navigate('/search');
                  const params = new URLSearchParams();
                  params.set('job', '');
                  params.set('location', '');
                  window.history.replaceState({}, '', `/search?${params.toString()}`);
                  window.location.reload();
                }}
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
              >
                Reset Search
              </button>
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
    </div>
  );
};

export default SearchResults;