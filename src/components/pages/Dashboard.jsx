import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { currentUser, userType, logout } = useAuth();
  const navigate = useNavigate();
  
  // States for customer dashboard
  const [savedArtisans, setSavedArtisans] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [featuredArtisans, setFeaturedArtisans] = useState([]);
  
  // States for artisan dashboard
  const [serviceRequests, setServiceRequests] = useState([]);
  const [services, setServices] = useState([]);
  
  // Mock data for customer dashboard
  const mockSavedArtisans = [
    {
      id: 1,
      name: 'John Woodworks',
      category: 'Woodworking',
      location: 'Lagos',
      rating: 4.8,
      imageUrl: 'https://via.placeholder.com/100'
    },
    {
      id: 2,
      name: 'Sarah Ceramics',
      category: 'Pottery',
      location: 'Abuja',
      rating: 4.5,
      imageUrl: 'https://via.placeholder.com/100'
    }
  ];
  
  const mockBookingHistory = [
    {
      id: 101,
      artisanName: 'Jane Textiles',
      serviceName: 'Custom Fabric Weaving',
      date: '2025-02-15',
      status: 'Completed',
      price: '₦25,000'
    },
    {
      id: 102,
      artisanName: 'Michael Arts',
      serviceName: 'Portrait Painting',
      date: '2025-03-02',
      status: 'Scheduled',
      price: '₦40,000'
    },
    {
      id: 103,
      artisanName: 'John Woodworks',
      serviceName: 'Custom Coffee Table',
      date: '2025-01-20',
      status: 'In Progress',
      price: '₦65,000'
    }
  ];
  
  const mockFeaturedArtisans = [
    {
      id: 201,
      name: 'Emma Jewelry',
      businessName: 'Elegant Gems',
      category: 'Jewelry Making',
      description: 'Specializing in handcrafted silver and gold jewelry with local gemstones.',
      location: 'Lagos',
      rating: 4.9,
      imageUrl: 'https://via.placeholder.com/300x200',
      price: 'From ₦15,000'
    },
    {
      id: 202,
      name: 'David Leatherworks',
      businessName: 'Precision Leather',
      category: 'Leathercraft',
      description: 'Creating premium leather products including bags, wallets, and custom items.',
      location: 'Port Harcourt',
      rating: 4.7,
      imageUrl: 'https://via.placeholder.com/300x200',
      price: 'From ₦8,000'
    },
    {
      id: 203,
      name: 'Aisha Textiles',
      businessName: 'Heritage Fabrics',
      category: 'Textile Art',
      description: 'Traditional and contemporary textile designs, specializing in adire and aso-oke.',
      location: 'Ibadan',
      rating: 4.8,
      imageUrl: 'https://via.placeholder.com/300x200',
      price: 'From ₦12,000'
    }
  ];
  
  // Mock data for artisan dashboard
  const mockServiceRequests = [
    {
      id: 301,
      customerName: 'James Anderson',
      serviceName: 'Custom Dining Table',
      requestDate: '2025-03-01',
      proposedDate: '2025-03-20',
      budget: '₦120,000',
      status: 'Pending',
      message: 'Looking for a handcrafted wooden dining table for 6 people. Would like to discuss wood options.'
    },
    {
      id: 302,
      customerName: 'Linda Wright',
      serviceName: 'Decorative Wall Shelf',
      requestDate: '2025-03-02',
      proposedDate: '2025-03-15',
      budget: '₦45,000',
      status: 'Accepted',
      message: 'Need a decorative floating shelf for my living room, approximately 1.5m in length.'
    },
    {
      id: 303,
      customerName: 'Robert Johnson',
      serviceName: 'Office Desk',
      requestDate: '2025-02-28',
      proposedDate: '2025-03-25',
      budget: '₦85,000',
      status: 'Pending',
      message: 'Looking for a custom desk with specific measurements to fit my home office space.'
    }
  ];
  
  const mockServices = [
    {
      id: 401,
      title: 'Custom Furniture Making',
      category: 'Woodworking',
      bookings: 12,
      isActive: true
    },
    {
      id: 402,
      title: 'Wood Carving',
      category: 'Woodworking',
      bookings: 8,
      isActive: true
    },
    {
      id: 403,
      title: 'Furniture Restoration',
      category: 'Woodworking',
      bookings: 5,
      isActive: false
    }
  ];

  // Load mock data
  useEffect(() => {
    setSavedArtisans(mockSavedArtisans);
    setBookingHistory(mockBookingHistory);
    setFeaturedArtisans(mockFeaturedArtisans);
    setServiceRequests(mockServiceRequests);
    setServices(mockServices);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchQuery}&location=${searchLocation}`);
  };
  
  const handleViewServiceDetails = (requestId) => {
    // In a real app, navigate to service request details page
    console.log(`View details for request ${requestId}`);
  };
  
  const handleAcceptRequest = (requestId) => {
    // In a real app, would call API to accept request
    setServiceRequests(serviceRequests.map(request => 
      request.id === requestId ? { ...request, status: 'Accepted' } : request
    ));
  };
  
  const handleDeclineRequest = (requestId) => {
    // In a real app, would call API to decline request
    setServiceRequests(serviceRequests.map(request => 
      request.id === requestId ? { ...request, status: 'Declined' } : request
    ));
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
            <span onClick={() => navigate('/dashboard')} className="text-red-400 cursor-pointer">Dashboard</span>
            {userType === 'customer' && (
            <span onClick={() => navigate('/bookings')} className="hover:text-red-400 cursor-pointer">My Bookings</span>)}
            {userType === 'artisan' && (
            <span onClick={() => navigate('/Services')} className="hover:text-red-400 cursor-pointer">My Services</span>)}
            <span onClick={handleLogout} className="hover:text-red-400 cursor-pointer">Logout</span>
            </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="bg-white flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">
            Welcome, {currentUser?.username || currentUser?.contactName || 'User'}!
          </h1>

          {/* Customer Dashboard Content */}
          {userType === 'customer' && (
            <div className="space-y-8">
              {/* Search Section */}
              <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Find Artisans</h2>
                <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
                  <div className="flex-1 min-w-[200px]">
                    <select 
                      className="w-full p-3 border border-gray-300 rounded-md"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    >
                      <option value="">What service do you need?</option>
                      <option value="woodworking">Woodworking</option>
                      <option value="pottery">Pottery & Ceramics</option>
                      <option value="textiles">Textiles & Fabric</option>
                      <option value="jewelry">Jewelry Making</option>
                      <option value="leathercraft">Leathercraft</option>
                    </select>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <select 
                      className="w-full p-3 border border-gray-300 rounded-md"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                    >
                      <option value="">Where?</option>
                      <option value="lagos">Lagos</option>
                      <option value="abuja">Abuja</option>
                      <option value="port-harcourt">Port Harcourt</option>
                      <option value="ibadan">Ibadan</option>
                      <option value="kano">Kano</option>
                    </select>
                  </div>
                  <button type="submit" className="bg-red-500 text-white p-3 rounded-md hover:bg-red-600 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </form>
              </div>
              
              {/* Featured Artisans */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Featured Artisans</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredArtisans.map(artisan => (
                    <div key={artisan.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                      <img src={artisan.imageUrl} alt={artisan.businessName} className="w-full h-48 object-cover" />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-1">{artisan.businessName}</h3>
                        <p className="text-sm text-gray-600 mb-2">{artisan.name}</p>
                        <p className="text-sm line-clamp-2 mb-3">{artisan.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1 text-sm font-semibold">{artisan.rating}</span>
                          </div>
                          <span className="text-sm font-medium">{artisan.price}</span>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">{artisan.category}</span>
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">{artisan.location}</span>
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
              </div>
              
              {/* Booking History */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Recent Bookings</h2>
                <div className="bg-white border rounded-lg overflow-hidden">
                  {bookingHistory.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artisan</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {bookingHistory.map(booking => (
                            <tr key={booking.id}>
                              <td className="px-6 py-4 whitespace-nowrap">{booking.artisanName}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{booking.serviceName}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{new Date(booking.date).toLocaleDateString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{booking.price}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${booking.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                    booking.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' : 
                                    'bg-yellow-100 text-yellow-800'}`}>
                                  {booking.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <button className="text-red-600 hover:text-red-900">Details</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-gray-500">You don't have any bookings yet.</p>
                      <button 
                        onClick={() => navigate('/search')}
                        className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                      >
                        Find Services
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Saved Artisans */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Saved Artisans</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {savedArtisans.length > 0 ? savedArtisans.map(artisan => (
                    <div key={artisan.id} className="bg-white border rounded-lg overflow-hidden shadow-sm flex p-4">
                      <img src={artisan.imageUrl} alt={artisan.name} className="w-16 h-16 rounded-full object-cover" />
                      <div className="ml-4">
                        <h3 className="font-semibold">{artisan.name}</h3>
                        <p className="text-sm text-gray-600">{artisan.category}</p>
                        <div className="flex items-center mt-1">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="ml-1 text-sm">{artisan.rating}</span>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-full p-6 bg-gray-50 rounded-lg text-center">
                      <p className="text-gray-500">You haven't saved any artisans yet.</p>
                      <button 
                        onClick={() => navigate('/search')}
                        className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                      >
                        Browse Artisans
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Artisan Dashboard Content */}
          {userType === 'artisan' && (
            <div className="space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Services</h2>
                  <p className="text-3xl font-bold text-gray-700">{services.length}</p>
                  <p className="text-sm text-gray-500 mt-1">Active services</p>
                  <button 
                    onClick={() => navigate('/services')} 
                    className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                  >
                    Add New Service
                  </button>
                </div>
                
                <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Requests</h2>
                  <p className="text-3xl font-bold text-gray-700">
                    {serviceRequests.filter(request => request.status === 'Pending').length}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Pending requests</p>
                  <button 
                    onClick={() => document.getElementById('requests-section').scrollIntoView({ behavior: 'smooth' })} 
                    className="mt-4 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition"
                  >
                    View All
                  </button>
                </div>
                
                <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Your Services</h2>
                  <ul className="space-y-2">
                    {services.slice(0, 3).map(service => (
                      <li key={service.id} className="flex justify-between">
                        <span className="text-sm">{service.title}</span>
                        <span className={`text-xs px-2 py-1 rounded ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {service.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => navigate('/services')} 
                    className="mt-4 w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition text-sm"
                  >
                    Manage Services
                  </button>
                </div>
              </div>
              
              {/* Service Requests Section */}
              <div id="requests-section">
                <h2 className="text-2xl font-bold mb-4">Service Requests</h2>
                {serviceRequests.length > 0 ? (
                  <div className="space-y-4">
                    {serviceRequests.map(request => (
                      <div 
                        key={request.id} 
                        className={`bg-white border rounded-lg p-5 ${
                          request.status === 'Accepted' ? 'border-green-400' : 
                          request.status === 'Declined' ? 'border-red-400 opacity-70' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex flex-wrap justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{request.serviceName}</h3>
                            <p className="text-sm text-gray-600">From: {request.customerName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">Request Date: {new Date(request.requestDate).toLocaleDateString()}</p>
                            <p className="text-sm">Proposed: {new Date(request.proposedDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm mb-2"><span className="font-semibold">Budget:</span> {request.budget}</p>
                          <p className="text-sm mb-2"><span className="font-semibold">Message:</span></p>
                          <p className="text-sm bg-gray-50 p-3 rounded">{request.message}</p>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                            ${request.status === 'Accepted' ? 'bg-green-100 text-green-800' : 
                              request.status === 'Declined' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'}`}>
                            {request.status}
                          </span>
                          
                          <div className="space-x-2">
                            <button 
                              onClick={() => handleViewServiceDetails(request.id)}
                              className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-300 transition"
                            >
                              Details
                            </button>
                            
                            {request.status === 'Pending' && (
                              <>
                                <button 
                                  onClick={() => handleAcceptRequest(request.id)}
                                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition"
                                >
                                  Accept
                                </button>
                                <button 
                                  onClick={() => handleDeclineRequest(request.id)}
                                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                                >
                                  Decline
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <p className="text-gray-500 mb-4">You don't have any service requests yet.</p>
                    <p className="text-sm text-gray-600">Make sure your services are active and up-to-date to attract customers.</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Quick Tips Section - Common for both user types */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Quick Tips</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              {userType === 'artisan' ? (
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Add a complete profile to attract more customers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Upload high-quality photos of your work</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Respond promptly to booking inquiries</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Ask satisfied customers to leave reviews</span>
                  </li>
                </ul>
              ) : (
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Check artisan reviews before booking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Message artisans with specific details about your needs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Save your favorite artisans for future projects</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Leave honest feedback after your project is complete</span>
                  </li>
                </ul>
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
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;