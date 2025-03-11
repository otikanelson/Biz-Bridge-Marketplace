import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import baskets from '../../assets/baskets.jpg';
import ceramics from '../../assets/ceramics.jpg';
import mosaic from '../../assets/mosaic.jpg';
import pottery from '../../assets/pottery.jpg';
import abstractArt from '../../assets/abstractArt.jpg';
import announcement from '../../assets/announcement.png';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  
  // Mock featured artisans data
  const featuredArtisans = [
    {
      id: 1,
      name: 'Emma Jewelry',
      businessName: 'Elegant Gems',
      category: 'Jewelry Making',
      location: 'Lagos',
      imageUrl: 'https://via.placeholder.com/300x200',
    },
    {
      id: 2,
      name: 'David Leatherworks',
      businessName: 'Precision Leather',
      category: 'Leathercraft',
      location: 'Port Harcourt',
      imageUrl: 'https://via.placeholder.com/300x200',
    },
    {
      id: 3,
      name: 'Aisha Textiles',
      businessName: 'Heritage Fabrics',
      category: 'Textile Art',
      location: 'Ibadan',
      imageUrl: 'https://via.placeholder.com/300x200',
    },
    {
      id: 4,
      name: 'Michael Woodcrafts',
      businessName: 'Natural Creations',
      category: 'Woodworking',
      location: 'Enugu',
      imageUrl: 'https://via.placeholder.com/300x200',
    }
  ];
  
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login');
    } else {
      // Redirect to search page if authenticated
      navigate(`/search?q=${searchQuery}&location=${searchLocation}`);
    }
  };
  
  const handleViewArtisans = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login');
    } else {
      // Redirect to search page if authenticated
      navigate('/search');
    }
  };
  
  const handleAdClick = () => {
    if (!isAuthenticated) {
      // Redirect to artisan signup if not authenticated
      navigate('/signup?type=artisan');
    } else if (userType === 'artisan') {
      // Redirect to dashboard if artisan
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navigation */}
      <header className="bg-black text-white p-4 w-full top-0 z-10 fixed">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-red-500 text-5xl select-none cursor-pointer font-bold">𐐒</Link>
            <span className="text-white text-4xl select-none cursor-pointer font-bold">B</span>
            <span className="text-red-500 text-2xl select-none cursor-pointer font-semibold ml-5">BizBridge</span>
          </div>
          <nav className="flex space-x-8">
            <Link to="/" className="text-red-400">Home</Link>
            
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="hover:text-red-400">Login</Link>
                <Link to="/signup?type=artisan" className="hover:text-red-400">Get Your Service Listed</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="hover:text-red-400">Dashboard</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section with Banner */}
      <div className="bg-white border-y mt-24 border-orange-500 ">
        <div className="container mx-auto py-12 px-4 text-center ">
          <h1 className="text-4xl font-bold mb-8 ">We Bring Clients & Reputable Service Providers Together</h1>
          {!isAuthenticated && (
            <a href="#service-list" className="inline-block border border-gray-400 rounded-full py-3 px-6 text-center hover:bg-gray-100 transition">
              Browse Artisans →
            </a>
          )}
        </div>
      </div>

      {/* Search Section - Show for logged out users and customers */}
      {(!isAuthenticated || userType === 'customer') && (
        <div className="py-16 bg-white">
          <div className="container mx-auto flex justify-center">
            <form onSubmit={handleSearch} className="flex w-full max-w-3xl">
              <select 
                className="border-4 border-red-400 rounded-l p-3 w-1/2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              >
                <option value="">What service do you need?</option>
                <option value="woodworking">Handcrafted Furniture</option>
                <option value="pottery">Pottery & Ceramics</option>
                <option value="textiles">Textiles & Fabric Art</option>
                <option value="jewelry">Jewelry Making</option>
                <option value="leathercraft">Leathercraft</option>
              </select>
              <select 
                className="border-t border-b border-red-400 p-3 w-1/2"
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
              <button type="submit" className="bg-red-500 text-white p-3 rounded-r">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Top Ad Banner - Show for logged out users and artisans */}
      {(!isAuthenticated || userType === 'artisan') && (
        <div 
          className="bg-red-500 p-8 mb-8 mt-6 cursor-pointer hover:bg-red-600 transition"
          onClick={handleAdClick}
        >
          <div className="container mx-auto flex items-center">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <img alt='Advert image' src={announcement} className='mw-72 h-56'>
                </img>
              </div>
            </div>
            <div className="flex-1 text-left text-black text-4xl font-bold">
              Browse Our Featured Artisans
            </div>
          </div>
        </div>
      )}

      {/* Featured Artisans Section */}
      <section className="container mx-auto px-4 py-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {featuredArtisans.map(artisan => (
            <div key={artisan.id} className="border-4 border-red-400 rounded-lg overflow-hidden">
              <img 
                src={artisan.imageUrl} 
                alt={artisan.businessName} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">{artisan.businessName}</h3>
                <p className="text-sm text-gray-600">{artisan.category}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-sm">{artisan.name}</span>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">{artisan.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
        {(!isAuthenticated || userType === 'customer') && (
          <button 
            onClick={handleViewArtisans}
            className="bg-red-500 text-white py-3 px-6 rounded-md hover:bg-red-600 transition"
          >
            View All Artisans
          </button>)}
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">About Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* First Image Box with Hover Effect */}
          <div className="relative border-4 border-red-400 rounded overflow-hidden group">
            <img 
              src={baskets} 
              alt="Handcrafted baskets" 
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
              alt="Ceramic pottery" 
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
              alt="Artisan workspace" 
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

      {/* What We Offer Section */}
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

      {/* Join Us Section */}
      <section id="join" className="container mx-auto px-4 py-8 mb-12">
        <h2 className="text-3xl font-bold mb-8 text-right">Join Us</h2>
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-xl mb-6">Be part of our growing community of artisans and customers</p>
          <div className="flex flex-wrap justify-center gap-4">
            {!isAuthenticated && (
              <>
                <Link 
                  to="/signup" 
                  className="bg-red-500 text-white py-3 px-6 rounded-md hover:bg-red-600 transition"
                >
                  Sign Up as Customer
                </Link>
                <Link 
                  to="/signup?type=artisan" 
                  className="bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition"
                >
                  Register as Artisan
                </Link>
              </>
            )}
            {isAuthenticated && userType === 'customer' && (
              <button 
                onClick={() => navigate('/search')}
                className="bg-red-500 text-white py-3 px-6 rounded-md hover:bg-red-600 transition"
              >
                Find Artisans Now
              </button>
            )}
            {isAuthenticated && userType === 'artisan' && (
              <button 
                onClick={() => navigate('/services/add')}
                className="bg-red-500 text-white py-3 px-6 rounded-md hover:bg-red-600 transition"
              >
                List Your Services
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Connect with us!</h3>
            <div className="flex justify-center space-x-4">
              <a href="#" className="bg-red-400 hover:bg-red-500 rounded-full p-3 flex items-center justify-center w-12 h-12">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z"/>
                  <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z"/>
                </svg>
              </a>
              <a href="#" className="bg-red-400 hover:bg-red-500 rounded-full p-3 flex items-center justify-center w-12 h-12">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="bg-red-400 hover:bg-red-500 rounded-full p-3 flex items-center justify-center w-12 h-12">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="bg-red-400 hover:bg-red-500 rounded-full p-3 flex items-center justify-center w-12 h-12">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} BizBridge. All rights reserved.</p>
            <div className="mt-4 flex flex-wrap justify-center">
              <Link to="/terms" className="text-red-400 hover:text-red-500 mx-3 my-1">Terms of Service</Link>
              <Link to="/privacy" className="text-red-400 hover:text-red-500 mx-3 my-1">Privacy Policy</Link>
              <Link to="/contact" className="text-red-400 hover:text-red-500 mx-3 my-1">Contact Us</Link>
              <Link to="/faq" className="text-red-400 hover:text-red-500 mx-3 my-1">FAQ</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;