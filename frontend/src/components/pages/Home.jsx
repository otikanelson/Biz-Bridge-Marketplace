// src/components/pages/Home.jsx - AMAZON-STYLE LAYOUT
// Search bar in navbar, featured services in hero section

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import baskets from '../../assets/baskets.jpg';
import ceramics from '../../assets/ceramics.jpg';
import mosaic from '../../assets/mosaic.jpg';
import pottery from '../../assets/pottery.jpg';
import abstractArt from '../../assets/abstractArt.jpg';
import announcement from '../../assets/announcement.png';
import ServiceCard from '../../components/cards/ServiceCard';
import { getFeaturedServices } from '../../api/search';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType, logout } = useAuth();
  
  const [featuredServices, setFeaturedServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Job categories
  const categories = [
    'Woodworking', 'Pottery', 'Jewelry Making', 'Textile Art', 
    'Leathercraft', 'Metalwork', 'Basket Weaving', 'Beadwork',
    'Calabash Decoration', 'Glass Blowing', 'Leather Shoes', 'Embroidery',
    'Soap Making', 'Candle Making', 'Hair Braiding & Styling'
  ];

  // Lagos LGAs
  const locations = [
    'Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Badagry',
    'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja',
    'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin',
    'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere', 'Yaba'
  ];
  
  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

    const handleGetStarted = () => {
    if (!isAuthenticated) {
      navigate('/signup');
    } else {
      navigate('/services');
    }
  };

    const handleJoinAsArtisan = () => {
    if (!isAuthenticated) {
      navigate('/signup?type=artisan');
    } else if (userType === 'artisan') {
      navigate('/ServicesManagement');
    } else {
      navigate('/signup?type=artisan');
    }
  };

  // Load real featured services from database
  useEffect(() => {
    const loadFeaturedServices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('🏠 Loading featured services from database...');
        
        const response = await getFeaturedServices(6);
        
        if (response.success && response.services && response.services.length > 0) {
          console.log('🏠 Featured services loaded:', response.services.length);
          
          const processedServices = response.services.map(service => ({
            ...service,
            id: service._id || service.id,
            _id: service._id || service.id
          }));
          
          setFeaturedServices(processedServices);
        } else {
          console.log('🏠 No featured services returned');
          setFeaturedServices([]);
        }
      } catch (error) {
        console.error('🏠 Error loading featured services:', error);
        setError('Unable to load featured services');
        setFeaturedServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedServices();
  }, []);

  // Search handler for navbar search
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleViewAllServices = () => {
    navigate('/services');
  };

  const handleAdClick = () => {
    if (!isAuthenticated) {
      navigate('/signup?type=artisan');
    } else if (userType === 'artisan') {
      navigate('/dashboard');
    } else {
      navigate('/signup?type=artisan');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ✅ AMAZON-STYLE HEADER WITH SEARCH BAR */}
      <header className="bg-black text-white w-full top-0 z-10 fixed">
        {/* Main Header */}
        <div className="py-2">
          <div className="container mx-auto px-4 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <span className="text-red-500 text-4xl select-none font-bold">𐐒</span>
              <span className="text-white text-3xl select-none font-bold">B</span>
              <span className="text-red-500 text-lg select-none font-semibold ml-3">BizBridge</span>
            </div>

            {/* ✅ AMAZON-STYLE SEARCH BAR */}
            <div className="flex-1 max-w-3xl mx-8">
              <div className="flex">
                {/* Category Selector */}
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-gray-200 text-black px-3 py-2 rounded-l-md border-r border-gray-300 focus:outline-none text-sm min-w-[140px]"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                {/* Search Input */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search for services, artisans, or crafts..."
                  className="flex-1 px-4 py-2 text-black focus:outline-none text-sm"
                />
                
                {/* Location Selector */}
                <select 
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="bg-gray-200 text-black px-3 py-2 border-l border-gray-300 focus:outline-none text-sm min-w-[120px]"
                >
                  <option value="">All LGAs</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                
                {/* Search Button */}
                <button 
                  onClick={handleSearch}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-r-md transition"
                >
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Account & Navigation */}
            <div className="flex items-center space-x-6">
              {!isAuthenticated ? (
                <>
                  <div className="text-center cursor-pointer hover:text-red-400" onClick={() => navigate('/login')}>
                    <div className="text-xs">Hey, sign up/in</div>
                    <div className="text-sm font-bold">to Book a service</div>
                  </div>
                  <div className="text-center cursor-pointer hover:text-red-400" onClick={() => navigate('/signup?type=artisan')}>
                    <div className="text-xs">Get your</div>
                    <div className="text-sm font-bold">Professional service listed</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <div className="text-xs">Hello, {userType}</div>
                    <div className="text-sm font-bold">Dashboard</div>
                  </div>
                  {userType === 'customer' && (
                    <div className="text-center cursor-pointer" onClick={() => navigate('/bookings')}>
                      <div className="text-xs">Your</div>
                      <div className="text-sm font-bold">Bookings</div>
                    </div>
                  )}
                  {userType === 'artisan' && (
                    <div className="text-center cursor-pointer" onClick={() => navigate('/ServicesManagement')}>
                      <div className="text-xs">Your</div>
                      <div className="text-sm font-bold">Services</div>
                    </div>
                  )}
                  <div className="text-center cursor-pointer" onClick={handleLogout}>
                    <div className="text-xs">Sign</div>
                    <div className="text-sm font-bold">Out</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="bg-black border-y-2 border-red-500 py-2">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-6 text-sm">
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/')}>
                Home
              </span>
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/services')}>
                All Services
              </span>
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/services?category=Woodworking')}>
                Woodworking
              </span>
             <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/services?category=Woodworking')}>
                MetalWorks
              </span>
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/services?category=Woodworking')}>
                Embroidery
              </span>
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/services?category=Woodworking')}>
                soapmaking
              </span>  
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/services?category=Woodworking')}>
                Hair Braiding
              </span>
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/services?category=Pottery')}>
                Pottery
              </span>
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/services?category=Jewelry Making')}>
                Jewelry
              </span>
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/services?category=Textile Art')}>
                Textiles
              </span>
              <span className="cursor-pointer hover:text-red-400" onClick={handleAdClick}>
                Sell Your Crafts
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-white pt-24">
        {/* ✅ HERO SECTION WITH FEATURED SERVICES */}
        <section className="bg-gradient-to-r from-red-500 to-orange-800 text-white py-8">
          <div className="container mx-auto px-4">
            {/* Hero Text */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">
                Discover Nigeria's <span className="text-yellow-300">Finest Artisans</span>
              </h1>
              <p className="text-lg mb-6 opacity-90">
                Connect with skilled craftsmen and bring authentic handmade creations to your life
              </p>
            </div>

            {/* Services Grid */}
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-center">All Services</h2>
              
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">Unable to load services</h3>
                  <p className="mb-4 opacity-75">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="bg-white text-red-500 py-2 px-6 rounded hover:bg-gray-100 transition"
                  >
                    Try Again
                  </button>
                </div>
              ) : featuredServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredServices.map(service => (
                    <div key={service._id || service.id} className="transform hover:scale-105 transition-transform">
                      <ServiceCard 
                        service={service}
                        showControls={false}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No services yet</h3>
                  <p className="mb-4 opacity-75">Check back soon for amazing services from our artisans!</p>
                  <button 
                    onClick={handleViewAllServices}
                    className="bg-white text-red-500 py-2 px-6 rounded hover:bg-gray-100 transition"
                  >
                    Browse All Services
                  </button>
                </div>
              )}

              {featuredServices.length > 0 && (
                <div className="text-center mt-8">
                  <button 
                    onClick={handleViewAllServices}
                    className="bg-white text-red-500 py-3 px-8 rounded-lg hover:bg-gray-100 transition font-medium"
                  >
                    View All Services
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
        <section className="bg-gradient-to-r from-red-500 to-orange-800 text-white pb-4">
          <div className="container mx-auto px-4">

            {/* Popular Services Grid */}
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-center">Popular Services</h2>
              
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">Unable to load services</h3>
                  <p className="mb-4 opacity-75">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="bg-white text-red-500 py-2 px-6 rounded hover:bg-gray-100 transition"
                  >
                    Try Again
                  </button>
                </div>
              ) : featuredServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredServices.map(service => (
                    <div key={service._id || service.id} className="transform hover:scale-105 transition-transform">
                      <ServiceCard 
                        service={service}
                        showControls={false}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No Popular services yet</h3>
                  <p className="mb-4 opacity-75">Check back soon for amazing services from our artisans!</p>
                  <button 
                    onClick={handleViewAllServices}
                    className="bg-white text-red-500 py-2 px-6 rounded hover:bg-gray-100 transition"
                  >
                    Browse All Services
                  </button>
                </div>
              )}

              {featuredServices.length > 0 && (
                <div className="text-center mt-8">
                  <button 
                    onClick={handleViewAllServices}
                    className="bg-white text-red-500 py-3 px-8 rounded-lg hover:bg-gray-100 transition font-medium"
                  >
                    View All Services
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
        <section className="bg-gradient-to-r from-red-500 to-orange-800 text-white py-4">
          <div className="container mx-auto px-4">
            {/* Featured Services Grid */}
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-center">Featured Services</h2>
              
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">Unable to load services</h3>
                  <p className="mb-4 opacity-75">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="bg-white text-red-500 py-2 px-6 rounded hover:bg-gray-100 transition"
                  >
                    Try Again
                  </button>
                </div>
              ) : featuredServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredServices.map(service => (
                    <div key={service._id || service.id} className="transform hover:scale-105 transition-transform">
                      <ServiceCard 
                        service={service}
                        showControls={false}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No featured services yet</h3>
                  <p className="mb-4 opacity-75">Check back soon for amazing services from our artisans!</p>
                  <button 
                    onClick={handleViewAllServices}
                    className="bg-white text-red-500 py-2 px-6 rounded hover:bg-gray-100 transition"
                  >
                    Browse All Services
                  </button>
                </div>
              )}

              {featuredServices.length > 0 && (
                <div className="text-center mt-8">
                  <button 
                    onClick={handleViewAllServices}
                    className="bg-white text-red-500 py-3 px-8 rounded-lg hover:bg-gray-100 transition font-medium"
                  >
                    View All Services
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* About Us Section - EXACT from project files */}
        <section id="about" className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-8">About Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* First Image Box with Hover Effect */}
            <div className="relative border-4 border-red-400 rounded overflow-hidden group">
            <img 
              src={baskets} 
              alt="Baskets" 
              className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-110"
            />
              <div className="absolute inset-0 bg-black bg-opacity-70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-center px-4">
                  <span className='font-bold font-sans'>Our Story</span>
                  <p className='font-sans'>BizBridge was born out of a passion for craftsmanship and a vision to empower artisans. 
                  In a world where mass production often overshadows individual talent, we saw an opportunity to bring artisans into the spotlight and provide them with a platform to showcase their skills. 
                  Our journey began with a simple idea: to create a bridge that connects talented artisans with customers who appreciate the value of handmade, bespoke, and high-quality services.
                  </p>
                </div>
              </div>
            </div>

            {/* Second Image Box with Hover Effect */}
            <div className="relative border-4 border-red-400 rounded overflow-hidden group">
            <img 
              src={ceramics} 
              alt="Ceramics" 
              className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-110"
            />
              <div className="absolute inset-0 bg-black bg-opacity-70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-center px-4">
                  <span className='font-bold font-sans'>Our Mission</span>
                  <p className='font-sans'>
                  Our mission at BizBridge is twofold. 
                  First, we aim to support and promote artisans by providing them with the tools, resources, and visibility they need to succeed.
                   We understand the challenges that artisans face, from marketing their services to managing their business operations. 
                   BizBridge is designed to alleviate these challenges, allowing artisans to focus on what they do best – creating and perfecting their craft.                
                  </p>
                </div>
              </div>
            </div>

            {/* Third Image Box with Hover Effect */}
            <div className="relative border-4 border-red-400 rounded overflow-hidden group">
            <img 
              src={mosaic} 
              alt="Mosaic" 
              className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-110"
            />
              <div className="absolute inset-0 bg-black bg-opacity-70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-center px-4">
                  <span className='font-bold font-sans'>Our Vision</span>
                  <p className='font-sans'>
                  Our vision is to create a thriving marketplace where artisans can showcase their talents and connect with customers who value quality craftsmanship.
                  We believe in preserving traditional crafts while embracing innovation and creativity.
                  Through BizBridge, we aim to foster a community that celebrates the art of handmade and supports the growth of artisanal businesses.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-4 border-red-400 p-16 text-center">
              <p className="text-md font-semibold md:text-base">
                At BizBridge, we are more than just a platform – we are a bridge to a world of possibilities. Discover the difference that dedicated craftsmanship and exceptional service can make. Welcome to BizBridge, where artisans and customers come together to create something extraordinary.
              </p>
            </div>
            <div className="border-4 border-red-400 p-16 text-center">
              <p className="text-md font-semibold md:text-base">
                Whether you are an artisan looking to expand your reach and grow your business, or a customer in search of high-quality, reliable services, BizBridge is here to help. Join us on this exciting journey and become part of a community that celebrates craftsmanship, creativity, and excellence.
              </p>
            </div>
          </div>
        </section>

        {/* What We Offer Section - EXACT from project files */}
        <section id="offers" className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-8 text-center">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative border-4 border-red-400 rounded overflow-hidden group">
            <img 
              src={abstractArt} 
              alt="Abstract artwork" 
              className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-110"
            />
              <div className="absolute inset-0 bg-black bg-opacity-70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-center px-4">
                  <span className='font-bold font-sans'>For Artisans</span>
                  <p className='font-sans'>
                  We provide a robust set of tools to help artisans manage their business, including profile creation, service listings, appointment scheduling, and secure payment processing.
                  Our platform also features marketing and promotional opportunities to increase visibility and attract new customers.
                  We are committed to fostering a supportive community where artisans can connect, share knowledge, and grow together.                
                  </p>
                </div>
              </div>
            </div>
            <div className="relative border-4 border-red-400 rounded-md overflow-hidden group">
            <img 
              src={pottery}
              alt="Handcrafted pottery" 
              className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-110"
            />
              <div className="absolute inset-0 bg-black bg-opacity-70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-center px-4">
                  <span className='font-bold font-sans'>For Customers</span>
                  <p className='font-sans'>
                  We offer an intuitive and user-friendly interface that makes it easy to find and connect with the right artisan for your needs.
                  Our search and filtering options allow you to browse by service type, location, and customer reviews. We also provide detailed profiles and portfolios so you can make informed decisions.
                  With BizBridge, you can trust that you are hiring skilled professionals who are passionate about their craft.            
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-4 bg-red-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12">
              <div className="flex-1">
                <img 
                  src={announcement} 
                  alt="Join BizBridge" 
                  className="w-64 h-64 mx-auto object-contain"
                />
              </div>
              <div className="flex-1 text-left">
                <h2 className="text-4xl font-bold mb-4">Ready to Join BizBridge?</h2>
                <p className="text-xl mb-6">
                  Whether you're looking to discover amazing crafts or showcase your own skills, 
                  BizBridge is the perfect platform to connect with the artisan community.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

 {/* Join Us Section */}
        <section className="py-16 bg-black text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* For Customers */}
              <div className="text-center lg:text-left">
                <h3 className="text-3xl font-bold mb-6">For Customers</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start space-x-3">
                    <div className="bg-red-500 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Discover Authentic Crafts</h4>
                      <p className="text-gray-300">Find unique, handcrafted items that tell a story</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-red-500 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Support Local Artisans</h4>
                      <p className="text-gray-300">Your purchase directly supports skilled craftspeople</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-red-500 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Custom Orders Available</h4>
                      <p className="text-gray-300">Work directly with artisans for personalized pieces</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleGetStarted}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  Start Shopping Now
                </button>
              </div>

              {/* For Artisans */}
              <div className="text-center lg:text-left">
                <h3 className="text-3xl font-bold mb-6">For Artisans</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start space-x-3">
                    <div className="bg-red-500 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Reach More Customers</h4>
                      <p className="text-gray-300">Expand your market beyond your local community</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-red-500 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Fair Pricing Control</h4>
                      <p className="text-gray-300">Set your own prices and keep most of your earnings</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-red-500 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Build Your Brand</h4>
                      <p className="text-gray-300">Showcase your skills and build a loyal customer base</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleJoinAsArtisan}
                  className="bg-white text-black hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  Join as Artisan
                </button>
              </div>
            </div>
          </div>
        </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-red-500 text-3xl font-bold">𐐒</span>
                <span className="text-white text-2xl font-bold">B</span>
                <span className="text-red-500 text-lg font-semibold ml-2">BizBridge</span>
              </div>
              <p className="text-gray-400 mb-4">
                Connecting customers with talented African artisans, preserving culture through craft.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-red-500 cursor-pointer transition-colors">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-red-500 cursor-pointer transition-colors">
                  <span className="text-sm">t</span>
                </div>
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-red-500 cursor-pointer transition-colors">
                  <span className="text-sm">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">For Customers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><span onClick={() => navigate('/services')} className="hover:text-white transition cursor-pointer">Browse Services</span></li>
                <li><span onClick={() => navigate('/signup')} className="hover:text-white transition cursor-pointer">Create Account</span></li>
                <li><span onClick={() => navigate('/login')} className="hover:text-white transition cursor-pointer">Sign In</span></li>
                <li><span className="hover:text-white transition cursor-pointer">How It Works</span></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">For Artisans</h4>
              <ul className="space-y-2 text-gray-400">
                <li><span onClick={() => navigate('/signup?type=artisan')} className="hover:text-white transition cursor-pointer">Become an Artisan</span></li>
                <li><span onClick={() => navigate('/login')} className="hover:text-white transition cursor-pointer">Artisan Login</span></li>
                <li><span className="hover:text-white transition cursor-pointer">Seller Resources</span></li>
                <li><span className="hover:text-white transition cursor-pointer">Success Stories</span></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><span className="hover:text-white transition cursor-pointer">Contact Us</span></li>
                <li><span className="hover:text-white transition cursor-pointer">Help Center</span></li>
                <li><span className="hover:text-white transition cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-white transition cursor-pointer">Terms of Service</span></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} BizBridge. All rights reserved. Made with ❤️ for African artisans.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;