import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ServiceCard from '../ServiceCard';

const SavedItems = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType, logout } = useAuth();
  
  // State for tab and data
  const [activeTab, setActiveTab] = useState('artisans');
  const [savedArtisans, setSavedArtisans] = useState([]);
  const [savedServices, setSavedServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated
  useEffect(() => {

if (!isAuthenticated) {
    navigate('/login');
    return;
  }
    
    // Only customers can save items
    if (userType !== 'customer') {
      navigate('/unauthorized');
      return;
    }
    
    // Fetch saved items
    const fetchSavedItems = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock saved artisans
        const mockSavedArtisans = [
          {
            id: 'a201',
            contactName: 'Emma Jewelry',
            businessName: 'Elegant Gems',
            profileImage: '',
            category: 'Jewelry Making',
            location: 'Lagos',
            expertiseLevel: 'Expert',
            savedOn: '2025-02-15'
          },
          {
            id: 'a202',
            contactName: 'David Leatherworks',
            businessName: 'Precision Leather',
            profileImage: '',
            category: 'Leathercraft',
            location: 'Port Harcourt',
            expertiseLevel: 'Intermediate',
            savedOn: '2025-02-20'
          },
          {
            id: 'a203',
            contactName: 'Aisha Textiles',
            businessName: 'Heritage Fabrics',
            profileImage: '',
            category: 'Textile Art',
            location: 'Ibadan',
            expertiseLevel: 'Expert',
            savedOn: '2025-03-01'
          }
        ];
        
        // Mock saved services
        const mockSavedServices = [
          {
            id: 's101',
            title: 'Custom Gold Necklace',
            description: 'Handcrafted gold necklace made to your design specifications.',
            category: 'Jewelry Making',
            price: 'From ₦75,000',
            duration: '1-2 weeks',
            location: 'Lagos',
            serviceImage: '',
            isActive: true,
            artisanName: 'Emma Jewelry',
            artisanId: 'a201',
            savedOn: '2025-02-18'
          },
          {
            id: 's102',
            title: 'Handcrafted Leather Wallet',
            description: 'Premium handcrafted leather wallet with custom initials.',
            category: 'Leathercraft',
            price: 'From ₦25,000',
            duration: '3-5 days',
            location: 'Port Harcourt',
            serviceImage: '',
            isActive: true,
            artisanName: 'David Leatherworks',
            artisanId: 'a202',
            savedOn: '2025-02-25'
          },
          {
            id: 's103',
            title: 'Custom Adire Fabric',
            description: 'Traditional Adire fabric with modern patterns (5 yards minimum).',
            category: 'Textile Art',
            price: 'From ₦35,000',
            duration: '1-2 weeks',
            location: 'Ibadan',
            serviceImage: '',
            isActive: true,
            artisanName: 'Aisha Textiles',
            artisanId: 'a203',
            savedOn: '2025-03-05'
          }
        ];
        
        setSavedArtisans(mockSavedArtisans);
        setSavedServices(mockSavedServices);
      } catch (error) {
        console.error('Error fetching saved items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSavedItems();
  }, [isAuthenticated, userType, navigate]);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Handle remove artisan from saved
  const handleRemoveArtisan = (artisanId) => {
    setSavedArtisans(savedArtisans.filter(artisan => artisan.id !== artisanId));
    // In a real app, make API call to remove from saved
    // For example: await removeFromSaved('artisan', artisanId);
  };

  // Handle remove service from saved
  const handleRemoveService = (serviceId) => {
    setSavedServices(savedServices.filter(service => service.id !== serviceId));
    // In a real app, make API call to remove from saved
    // For example: await removeFromSaved('service', serviceId);
  };

  // Handle view artisan profile
  const handleViewArtisan = (artisanId) => {
    navigate(`/artisan/${artisanId}`);
  };

  // Handle view service
  const handleViewService = (serviceId) => {
    navigate(`/services/${serviceId}`);
  };

  // Format saved date
  const formatSavedDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (    <div className="flex flex-col min-h-screen">
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
          <span onClick={handleLogout} className="hover:text-red-400 cursor-pointer">Logout</span>
        </nav>
      </div>
    </header>

    {/* Main Content */}
    <div className="bg-white flex-grow py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Saved Items</h1>
        
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px space-x-8">
              <button
                onClick={() => setActiveTab('artisans')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'artisans'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Saved Artisans
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'services'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Saved Services
              </button>
            </nav>
          </div>
        </div>
        
        {/* Saved Artisans Tab */}
        {activeTab === 'artisans' && (
          <>
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
              </div>
            ) : savedArtisans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedArtisans.map(artisan => (
                  <div key={artisan.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <img 
                          src={artisan.profileImage} 
                          alt={artisan.businessName} 
                          className="w-16 h-16 rounded-full object-cover mr-4"
                        />
                        <div>
                          <h3 className="font-semibold text-lg">{artisan.businessName}</h3>
                          <p className="text-gray-600 text-sm">{artisan.contactName}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Specialty</p>
                          <p className="text-sm">{artisan.category}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="text-sm">{artisan.location}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Expertise</p>
                          <p className="text-sm">{artisan.expertiseLevel}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Saved On</p>
                          <p className="text-sm">{formatSavedDate(artisan.savedOn)}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between pt-3 border-t">
                        <button
                          onClick={() => handleRemoveArtisan(artisan.id)}
                          className="text-red-500 text-sm hover:text-red-700"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => handleViewArtisan(artisan.id)}
                          className="bg-red-500 text-white px-4 py-1 rounded text-sm hover:bg-red-600 transition"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No saved artisans</h3>
                <p className="mt-1 text-gray-500">You haven't saved any artisans yet.</p>
                <button 
                  onClick={() => navigate('/search')}
                  className="mt-6 bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition"
                >
                  Discover Artisans
                </button>
              </div>
            )}
          </>
        )}
        
        {/* Saved Services Tab */}
        {activeTab === 'services' && (
          <>
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
              </div>
            ) : savedServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedServices.map(service => (
                  <div key={service.id} className="relative">
                    <ServiceCard 
                      service={service}
                      onClick={() => handleViewService(service.id)}
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveService(service.id);
                        }}
                        className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="bg-white p-2 border-t text-center text-sm text-gray-500">
                      Saved on {formatSavedDate(service.savedOn)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No saved services</h3>
                <p className="mt-1 text-gray-500">You haven't saved any services yet.</p>
                <button 
                  onClick={() => navigate('/search')}
                  className="mt-6 bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition"
                >
                  Discover Services
                </button>
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

export default SavedItems;