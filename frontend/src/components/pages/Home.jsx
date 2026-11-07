import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import baskets from '../../assets/baskets.jpg';
import ceramics from '../../assets/ceramics.jpg';
import mosaic from '../../assets/mosaic.jpg';
import pottery from '../../assets/pottery.jpg';
import abstractArt from '../../assets/abstractArt.jpg';
import announcement from '../../assets/announcement.png';
import AppHeader from '../layout/AppHeader';
import Footer from '../layout/Footer';
import Rail from '../home/Rail';
import HeroCard from '../home/HeroCard';
import CategoryCard from '../home/CategoryCard';
import PromoCard from '../home/PromoCard';
import MiniCard from '../home/MiniCard';
import RailSkeleton from '../home/RailSkeleton';
import useRecentlyViewed from '../../hooks/useRecentlyViewed';
import axios from 'axios';


const heroImage =
  'https://images.unsplash.com/photo-1736143157411-0a70fe999ecb?q=80&w=1920&auto=format&fit=crop';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType, logout } = useAuth();
  const { recentlyViewed } = useRecentlyViewed();

  const [railsData, setRailsData] = useState(null);
  const [recentlyViewedServices, setRecentlyViewedServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    'Woodworking', 'Pottery & Ceramics', 'Leathercraft', 'Textile Art',
    'Jewelry Making', 'Metalwork', 'Glass Art', 'Traditional Clothing',
    'Painting & Drawing', 'Sculpture', 'Basket Weaving', 'Beadwork',
    'Paper Crafts', 'Soap & Candle Making', 'Calabash Carving',
    'Musical Instruments', 'Hair Braiding & Styling', 'Furniture Restoration',
    'Shoemaking', 'Sign Writing', 'Tie & Dye', 'Adire Textile',
    'Food Preservation', 'Batik', 'Embroidery', 'Photography', 'Other'
  ];

  const quickCategories = [
    'Woodworking', 'Pottery & Ceramics', 'Jewelry Making', 'Textile Art',
    'Metalwork', 'Hair Braiding & Styling', 'Basket Weaving', 'Embroidery'
  ];

  const locations = [
    'Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Badagry',
    'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja',
    'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin',
    'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere', 'Yaba'
  ];

  const goTo = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setMobileMenuOpen(false);
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

  const handleQuickCategory = (category) => {
    setMobileMenuOpen(false);
    navigate(`/services?category=${encodeURIComponent(category)}`);
  };

  // Load homepage rails data
  useEffect(() => {
    const loadRailsData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/api/services/home-rails`);
        
        if (response.data.success) {
          setRailsData(response.data.rails);
        } else {
          setError('Unable to load content');
        }
      } catch (err) {
        console.error('🏠 Error loading rails:', err);
        setError('Unable to load content');
      } finally {
        setIsLoading(false);
      }
    };

    loadRailsData();
  }, []);

  // Load recently viewed services
  useEffect(() => {
    const loadRecentlyViewed = async () => {
      if (recentlyViewed.length === 0) return;

      try {
        const ids = recentlyViewed.slice(0, 10).join(',');
        const response = await axios.get(`${API_URL}/api/services/by-ids?ids=${ids}`);
        
        if (response.data.success) {
          setRecentlyViewedServices(response.data.services);
        }
      } catch (err) {
        console.error('Error loading recently viewed:', err);
      }
    };

    loadRecentlyViewed();
  }, [recentlyViewed]);

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

  const handleRetry = () => {
    window.location.reload();
  };

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
        activePage="home"
        activeCategory=""
      />

      <main className="flex-grow bg-white">
        {/* HERO SECTION */}
        <section className="relative h-[440px] xs:h-[480px] sm:h-[480px] md:h-[560px] overflow-hidden">
          <img
            src={heroImage}
            alt="Artisan crafting handmade pottery"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />

          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl text-white">
                <span className="inline-block bg-yellow-400 text-black text-[10px] sm:text-xs font-bold uppercase tracking-wide px-3 py-1 rounded mb-4">
                  Trusted by 1,000+ artisans across Lagos
                </span>
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                  Discover Nigeria's <span className="text-yellow-300">Finest Artisans</span>
                </h1>
                <p className="text-sm sm:text-lg mb-8 text-gray-200 max-w-lg">
                  From handwoven baskets to custom furniture — connect with skilled
                  craftsmen near you and bring authentic, handmade work into your life.
                </p>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <button
                    onClick={handleGetStarted}
                    className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 px-5 sm:px-8 rounded-lg transition shadow-lg text-sm sm:text-base"
                  >
                    Start Shopping Now
                  </button>
                  <button
                    onClick={handleJoinAsArtisan}
                    className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-bold py-3 px-5 sm:px-8 rounded-lg transition text-sm sm:text-base"
                  >
                    Join as Artisan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRIMARY RAIL - Featured & Promos */}
        <section className="container mx-auto px-4 py-8">
          {isLoading ? (
            <>
              <RailSkeleton variant="hero" count={3} />
              <RailSkeleton variant="category" count={4} />
            </>
          ) : error ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Something went wrong</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition"
              >
                Try Again
              </button>
            </div>
          ) : railsData ? (
            <>
              {/* Hero Rail - Featured Services */}
              {railsData.featured?.length > 0 && (
                <Rail title="Featured Services">
                  {railsData.featured.map(service => (
                    <HeroCard key={service._id} service={service} badge="FEATURED" />
                  ))}
                </Rail>
              )}

              {/* Categories Rail */}
              {railsData.categoryTiles?.length > 0 && (
                <Rail title="Browse by Category">
                  {railsData.categoryTiles.map((cat, index) => (
                    <CategoryCard
                      key={cat._id || index}
                      category={cat._id}
                      image={cat.sampleImage}
                      count={cat.count}
                    />
                  ))}
                </Rail>
              )}
            </>
          ) : null}
        </section>

        {/* SECONDARY RAILS */}
        <section className="bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <>
                <RailSkeleton variant="mini" count={6} />
                <RailSkeleton variant="mini" count={6} />
              </>
            ) : railsData ? (
              <>
                {/* Top Rated */}
                {railsData.topRated?.length > 0 && (
                  <Rail title="Top Rated Services" variant="compact">
                    {railsData.topRated.map(service => (
                      <MiniCard key={service._id} service={service} />
                    ))}
                  </Rail>
                )}

                {/* New This Week */}
                {railsData.newThisWeek?.length > 0 && (
                  <Rail title="New This Week" variant="compact">
                    {railsData.newThisWeek.map(service => (
                      <MiniCard key={service._id} service={service} />
                    ))}
                  </Rail>
                )}

                {/* Under Budget */}
                {railsData.underBudget?.length > 0 && (
                  <Rail title="Services Under ₦10,000" variant="compact">
                    {railsData.underBudget.map(service => (
                      <MiniCard key={service._id} service={service} />
                    ))}
                  </Rail>
                )}

                {/* Recently Viewed */}
                {recentlyViewedServices.length > 0 && (
                  <Rail title="Recently Viewed" variant="compact">
                    {recentlyViewedServices.map(service => (
                      <MiniCard key={service._id} service={service} />
                    ))}
                  </Rail>
                )}
              </>
            ) : null}
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="container mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">About Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative border-4 border-red-400 rounded overflow-hidden group">
              <img
                src={baskets}
                alt="Baskets"
                className="w-full h-56 xs:h-64 sm:h-80 md:h-96 object-cover transition-transform duration-300 md:group-hover:scale-110"
              />
              <div className="md:hidden bg-black/80 text-white p-4">
                <span className="font-bold font-sans block mb-1">Our Story</span>
                <p className="font-sans text-sm">BizBridge was born out of a passion for craftsmanship and a vision to empower artisans. In a world where mass production often overshadows individual talent, we saw an opportunity to bring artisans into the spotlight and provide them with a platform to showcase their skills.</p>
              </div>
              <div className="hidden md:flex absolute inset-0 bg-black bg-opacity-70 text-white items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-center px-4">
                  <span className='font-bold font-sans'>Our Story</span>
                  <p className='font-sans'>BizBridge was born out of a passion for craftsmanship and a vision to empower artisans.
                  In a world where mass production often overshadows individual talent, we saw an opportunity to bring artisans into the spotlight and provide them with a platform to showcase their skills.
                  Our journey began with a simple idea: to create a bridge that connects talented artisans with customers who appreciate the value of handmade, bespoke, and high-quality services.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative border-4 border-red-400 rounded overflow-hidden group">
              <img
                src={ceramics}
                alt="Ceramics"
                className="w-full h-56 xs:h-64 sm:h-80 md:h-96 object-cover transition-transform duration-300 md:group-hover:scale-110"
              />
              <div className="md:hidden bg-black/80 text-white p-4">
                <span className="font-bold font-sans block mb-1">Our Mission</span>
                <p className="font-sans text-sm">Our mission at BizBridge is twofold: support artisans with the tools, resources, and visibility they need to succeed, while alleviating the operational challenges that stand between them and their craft.</p>
              </div>
              <div className="hidden md:flex absolute inset-0 bg-black bg-opacity-70 text-white items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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

            <div className="relative border-4 border-red-400 rounded overflow-hidden group">
              <img
                src={mosaic}
                alt="Mosaic"
                className="w-full h-56 xs:h-64 sm:h-80 md:h-96 object-cover transition-transform duration-300 md:group-hover:scale-110"
              />
              <div className="md:hidden bg-black/80 text-white p-4">
                <span className="font-bold font-sans block mb-1">Our Vision</span>
                <p className="font-sans text-sm">Our vision is a thriving marketplace where artisans showcase their talents, preserving traditional crafts while embracing innovation — and where handmade work and artisanal businesses can grow.</p>
              </div>
              <div className="hidden md:flex absolute inset-0 bg-black bg-opacity-70 text-white items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="border-4 border-red-400 p-6 sm:p-10 md:p-16 text-center">
              <p className="text-sm sm:text-md font-semibold md:text-base">
                At BizBridge, we are more than just a platform – we are a bridge to a world of possibilities. Discover the difference that dedicated craftsmanship and exceptional service can make. Welcome to BizBridge, where artisans and customers come together to create something extraordinary.
              </p>
            </div>
            <div className="border-4 border-red-400 p-6 sm:p-10 md:p-16 text-center">
              <p className="text-sm sm:text-md font-semibold md:text-base">
                Whether you are an artisan looking to expand your reach and grow your business, or a customer in search of high-quality, reliable services, BizBridge is here to help. Join us on this exciting journey and become part of a community that celebrates craftsmanship, creativity, and excellence.
              </p>
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section id="offers" className="container mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="relative border-4 border-red-400 rounded overflow-hidden group">
              <img
                src={abstractArt}
                alt="Abstract artwork"
                className="w-full h-56 xs:h-64 sm:h-80 md:h-96 object-cover transition-transform duration-300 md:group-hover:scale-110"
              />
              <div className="md:hidden bg-black/80 text-white p-4">
                <span className="font-bold font-sans block mb-1">For Artisans</span>
                <p className="font-sans text-sm">Manage your business with profile creation, service listings, scheduling, and secure payments — plus marketing tools and a supportive community to grow alongside.</p>
              </div>
              <div className="hidden md:flex absolute inset-0 bg-black bg-opacity-70 text-white items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
                className="w-full h-56 xs:h-64 sm:h-80 md:h-96 object-cover transition-transform duration-300 md:group-hover:scale-110"
              />
              <div className="md:hidden bg-black/80 text-white p-4">
                <span className="font-bold font-sans block mb-1">For Customers</span>
                <p className="font-sans text-sm">An intuitive interface to find the right artisan — filter by service type, location, and reviews, and browse detailed profiles and portfolios before you hire.</p>
              </div>
              <div className="hidden md:flex absolute inset-0 bg-black bg-opacity-70 text-white items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
            <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-12">
              <div className="flex-1">
                <img
                  src={announcement}
                  alt="Join BizBridge"
                  className="w-32 h-32 xs:w-40 xs:h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 mx-auto object-contain"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Ready to Join BizBridge?</h2>
                <p className="text-sm sm:text-lg md:text-xl mb-6">
                  Whether you're looking to discover amazing crafts or showcase your own skills,
                  BizBridge is the perfect platform to connect with the artisan community.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Join Us Section */}
      <section className="py-12 sm:py-16 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12">
            {/* For Customers */}
            <div className="text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold mb-6">For Customers</h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="bg-red-500 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-left">
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
                  <div className="text-left">
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
                  <div className="text-left">
                    <h4 className="font-semibold text-lg">Custom Orders Available</h4>
                    <p className="text-gray-300">Work directly with artisans for personalized pieces</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleGetStarted}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg transition-colors w-full sm:w-auto"
              >
                Start Shopping Now
              </button>
            </div>

            {/* For Artisans */}
            <div className="text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold mb-6">For Artisans</h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="bg-red-500 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-left">
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
                  <div className="text-left">
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
                  <div className="text-left">
                    <h4 className="font-semibold text-lg">Build Your Brand</h4>
                    <p className="text-gray-300">Showcase your skills and build a loyal customer base</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleJoinAsArtisan}
                className="bg-white text-black hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors w-full sm:w-auto"
              >
                Join as Artisan
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer variant="full" />
    </div>
  );
};

export default HomePage;