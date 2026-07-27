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

// Stock hero image (Unsplash, free to use / no attribution required)
const heroImage =
  'https://images.unsplash.com/photo-1736143157411-0a70fe999ecb?q=80&w=1920&auto=format&fit=crop';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType, logout } = useAuth();

  // One fetch, three views: the backend flags each service with
  // `featured.isFeatured` / `popular.isPopular`, so we split client-side
  // instead of hitting three different endpoints.
  const [allActiveServices, setAllActiveServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Job categories
  const categories = [
    'Woodworking', 'Pottery', 'Jewelry Making', 'Textile Art',
    'Leathercraft', 'Metalwork', 'Basket Weaving', 'Beadwork',
    'Calabash Decoration', 'Glass Blowing', 'Leather Shoes', 'Embroidery',
    'Soap Making', 'Candle Making', 'Hair Braiding & Styling'
  ];

  // Short chip list — the subset shown as quick-tap pills on mobile
  const quickCategories = [
    'Woodworking', 'Pottery', 'Jewelry Making', 'Textile Art',
    'Metalwork', 'Hair Braiding & Styling', 'Basket Weaving', 'Embroidery'
  ];

  // Lagos LGAs
  const locations = [
    'Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Badagry',
    'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja',
    'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin',
    'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere', 'Yaba'
  ];

  // Closes the mobile menu, then navigates — used by all mobile menu links
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

  // Load services from the database and split into All / Popular / Featured
  useEffect(() => {
    const loadServices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Pull a larger batch once; each service carries its own
        // featured.isFeatured / popular.isPopular flags from the schema.
        const response = await getFeaturedServices(30);

        if (response.success && response.services && response.services.length > 0) {
          const processedServices = response.services.map(service => ({
            ...service,
            id: service._id || service.id,
            _id: service._id || service.id
          }));
          setAllActiveServices(processedServices);
        } else {
          setAllActiveServices([]);
        }
      } catch (err) {
        console.error('🏠 Error loading services:', err);
        setError('Unable to load services');
        setAllActiveServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, []);

  const popularServices = allActiveServices.filter(s => s.popular?.isPopular);
  const featuredServices = allActiveServices.filter(s => s.featured?.isFeatured);

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

  // Reusable renderer so All / Popular / Featured sections stay in sync
  const renderServiceGrid = (list, emptyTitle, emptyBody) => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      );
    }
    if (error) {
      return (
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
      );
    }
    if (list.length > 0) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {list.map(service => (
            <div key={service._id || service.id}>
              <ServiceCard service={service} showControls={false} />
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">{emptyTitle}</h3>
        <p className="mb-4 opacity-75">{emptyBody}</p>
        <button
          onClick={handleViewAllServices}
          className="bg-white text-red-500 py-2 px-6 rounded hover:bg-gray-100 transition"
        >
          Browse All Services
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ✅ HEADER — sticky, not fixed, so it always pushes page content down by its real height. */}
      <header className="bg-black text-white w-full sticky top-0 z-50">

        {/* ══════════════ MOBILE HEADER (Amazon-style, 3 stacked bars) ══════════════ */}
        <div className="md:hidden">
          {/* Bar 1: hamburger, logo, account, bookings */}
          <div className="flex items-center justify-between px-2 py-2 gap-1 bg-black">
            <button
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="p-2 text-white active:bg-white/10 rounded-md transition flex-shrink-0"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-panel"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            <div className="flex items-center cursor-pointer flex-shrink-0" onClick={() => navigate('/')}>
              <span className="text-red-500 text-xl select-none font-bold">𐐒</span>
              <span className="text-white text-lg select-none font-bold">B</span>
              <span className="text-red-500 text-xs select-none font-semibold ml-1">BizBridge</span>
            </div>

            <div className="flex-1" />

            {/* Account icon + one-line greeting, tappable */}
            <button
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
              className="flex flex-col items-center px-1.5 py-1 active:bg-white/10 rounded-md flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-[9px] leading-tight whitespace-nowrap">
                {isAuthenticated ? 'Account' : 'Sign in'}
              </span>
            </button>

            {/* "Cart"-equivalent: Bookings / Services */}
            <button
              onClick={() => navigate(
                !isAuthenticated ? '/login'
                : userType === 'artisan' ? '/ServicesManagement'
                : '/bookings/my-bookings'
              )}
              className="flex flex-col items-center px-1.5 py-1 active:bg-white/10 rounded-md flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7h-3V6a4 4 0 00-8 0v1H6a1 1 0 00-1 1v11a2 2 0 002 2h10a2 2 0 002-2V8a1 1 0 00-1-1zM9 6a3 3 0 016 0v1H9V6z" />
              </svg>
              <span className="text-[9px] leading-tight whitespace-nowrap">
                {userType === 'artisan' ? 'Services' : 'Bookings'}
              </span>
            </button>
          </div>

          {/* Bar 2: single-row search, category picker folded into a leading select */}
          <div className="px-2 pb-2 bg-black">
            <div className="flex w-full rounded-md overflow-hidden bg-white">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Category"
                className="bg-gray-100 text-black text-xs px-2 border-r border-gray-300 focus:outline-none max-w-[84px]"
              >
                <option value="">All</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search BizBridge"
                className="flex-1 min-w-0 px-2 py-2 text-black text-sm focus:outline-none"
              />
              <button
                onClick={handleSearch}
                className="bg-yellow-400 active:bg-yellow-300 px-3 flex-shrink-0"
                aria-label="Search"
              >
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Bar 3: thin strip — "All" + scrollable category/quick-link pills */}
          <div className="bg-neutral-900 border-t border-white/10">
            <div className="flex items-center gap-1 overflow-x-auto px-2 py-1.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold px-2 py-1 whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                All
              </button>
              <span className="w-px h-4 bg-white/20 flex-shrink-0" />
              {quickCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleQuickCategory(category)}
                  className="flex-shrink-0 text-xs font-medium px-2 py-1 whitespace-nowrap active:text-red-400 transition"
                >
                  {category}
                </button>
              ))}
              <button
                onClick={handleAdClick}
                className="flex-shrink-0 text-xs font-semibold px-2 py-1 whitespace-nowrap text-yellow-400"
              >
                Sell Your Crafts
              </button>
            </div>
          </div>
        </div>

        {/* ══════════════ DESKTOP HEADER (unchanged layout) ══════════════ */}
        <div className="hidden md:block py-2">
          <div className="container mx-auto px-4 flex items-center justify-between gap-x-4">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <span className="text-red-500 text-4xl select-none font-bold">𐐒</span>
              <span className="text-white text-3xl select-none font-bold">B</span>
              <span className="text-red-500 text-lg select-none font-semibold ml-3">BizBridge</span>
            </div>

            {/* ✅ SEARCH BAR */}
            <div className="flex-1 max-w-3xl mx-8">
              <div className="flex w-full">
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
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search for services, artisans, or crafts..."
                  className="flex-1 px-4 py-2 text-black focus:outline-none text-sm"
                />
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
                <button
                  onClick={handleSearch}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-r-md transition flex-shrink-0"
                  aria-label="Search"
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
                    <div className="text-center cursor-pointer" onClick={() => navigate('/bookings/my-bookings')}>
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

        {/* Secondary Navigation — desktop only; scrolls horizontally instead of wrapping */}
        <div className="hidden md:block bg-black border-y-2 border-red-500 py-2">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-6 text-sm overflow-x-auto whitespace-nowrap">
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/')}>Home</span>
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/services')}>All Services</span>
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/services?category=Woodworking')}>Woodworking</span>
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/services?category=Metalwork')}>MetalWorks</span>
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/services?category=Embroidery')}>Embroidery</span>
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/services?category=Soap & Candle Making')}>Soap Making</span>
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/services?category=Hair Braiding & Styling')}>Hair Braiding</span>
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/services?category=Pottery & Ceramics')}>Pottery</span>
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/services?category=Jewelry Making')}>Jewelry</span>
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/services?category=Textile Art')}>Textiles</span>
              <span className="cursor-pointer hover:text-red-400" onClick={handleAdClick}>Sell Your Crafts</span>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu — full nav + account links, slides down below the header */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop so the panel reads as an overlay, not part of the page flow */}
            <div
              className="md:hidden fixed inset-0 top-auto bg-black/40 z-40"
              style={{ top: 'var(--header-h, 0)' }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <div
              id="mobile-nav-panel"
              className="md:hidden relative z-50 bg-black border-t border-red-500 max-h-[75vh] overflow-y-auto animate-[fadeIn_0.15s_ease-out]"
            >
              <div className="container mx-auto px-4 py-4">
                {/* Account section */}
                <div className="space-y-1 pb-4 mb-4 border-b border-gray-700">
                  {!isAuthenticated ? (
                    <>
                      <div className="cursor-pointer hover:text-red-400 py-2" onClick={() => goTo('/login')}>
                        <span className="text-xs block">Hey, sign up/in</span>
                        <span className="text-sm font-bold">to Book a service</span>
                      </div>
                      <div className="cursor-pointer hover:text-red-400 py-2" onClick={() => goTo('/signup?type=artisan')}>
                        <span className="text-xs block">Get your</span>
                        <span className="text-sm font-bold">Professional service listed</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="cursor-pointer py-2" onClick={() => goTo('/dashboard')}>
                        <span className="text-xs block">Hello, {userType}</span>
                        <span className="text-sm font-bold">Dashboard</span>
                      </div>
                      {userType === 'customer' && (
                        <div className="cursor-pointer py-2" onClick={() => goTo('/bookings/my-bookings')}>
                          <span className="text-sm font-bold">Your Bookings</span>
                        </div>
                      )}
                      {userType === 'artisan' && (
                        <div className="cursor-pointer py-2" onClick={() => goTo('/ServicesManagement')}>
                          <span className="text-sm font-bold">Your Services</span>
                        </div>
                      )}
                      <div className="cursor-pointer py-2" onClick={handleLogout}>
                        <span className="text-sm font-bold">Sign Out</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Nav links — grid of tappable rows instead of a cramped single column */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <span className="cursor-pointer hover:text-red-400 py-2 border-b border-gray-800" onClick={() => goTo('/')}>Home</span>
                  <span className="cursor-pointer hover:text-red-400 py-2 border-b border-gray-800" onClick={() => goTo('/services')}>All Services</span>
                  <span className="cursor-pointer hover:text-red-400 py-2 border-b border-gray-800" onClick={() => goTo('/services?category=Woodworking')}>Woodworking</span>
                  <span className="cursor-pointer hover:text-red-400 py-2 border-b border-gray-800" onClick={() => goTo('/services?category=Metalwork')}>MetalWorks</span>
                  <span className="cursor-pointer hover:text-red-400 py-2 border-b border-gray-800" onClick={() => goTo('/services?category=Embroidery')}>Embroidery</span>
                  <span className="cursor-pointer hover:text-red-400 py-2 border-b border-gray-800" onClick={() => goTo('/services?category=Soap & Candle Making')}>Soap Making</span>
                  <span className="cursor-pointer hover:text-red-400 py-2 border-b border-gray-800" onClick={() => goTo('/services?category=Hair Braiding & Styling')}>Hair Braiding</span>
                  <span className="cursor-pointer hover:text-red-400 py-2 border-b border-gray-800" onClick={() => goTo('/services?category=Pottery & Ceramics')}>Pottery</span>
                  <span className="cursor-pointer hover:text-red-400 py-2 border-b border-gray-800" onClick={() => goTo('/services?category=Jewelry Making')}>Jewelry</span>
                  <span className="cursor-pointer hover:text-red-400 py-2 border-b border-gray-800" onClick={() => goTo('/services?category=Textile Art')}>Textiles</span>
                  <span
                    className="cursor-pointer hover:text-red-400 py-2 border-b border-gray-800 col-span-2 text-center font-semibold text-red-400"
                    onClick={() => { setMobileMenuOpen(false); handleAdClick(); }}
                  >
                    Sell Your Crafts
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-white">

        {/* ✅ HERO SECTION (stock image banner) */}
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

        {/* ✅ ALL SERVICES */}
        <section className="bg-gradient-to-r from-red-500 to-orange-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">All Services</h2>
              {renderServiceGrid(
                allActiveServices,
                'No services yet',
                'Check back soon for amazing services from our artisans!'
              )}
              {allActiveServices.length > 0 && (
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

        {/* ✅ POPULAR SERVICES — driven by service.popular.isPopular */}
        <section className="bg-gradient-to-r from-red-500 to-orange-800 text-white pb-4">
          <div className="container mx-auto px-4">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">Popular Services</h2>
              {renderServiceGrid(
                popularServices,
                'No popular services yet',
                'Check back soon — popular picks are updated as bookings come in!'
              )}
              {popularServices.length > 0 && (
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

        {/* ✅ FEATURED SERVICES — driven by service.featured.isFeatured */}
        <section className="bg-gradient-to-r from-red-500 to-orange-800 text-white py-4">
          <div className="container mx-auto px-4">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">Featured Services</h2>
              {renderServiceGrid(
                featuredServices,
                'No featured services yet',
                'Check back soon for amazing services from our artisans!'
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

      {/* Footer */}
      <footer className="bg-black text-white py-10 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
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
              <h4 className="text-base sm:text-lg font-semibold mb-4">For Customers</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li><span onClick={() => navigate('/services')} className="hover:text-white transition cursor-pointer">Browse Services</span></li>
                <li><span onClick={() => navigate('/signup')} className="hover:text-white transition cursor-pointer">Create Account</span></li>
                <li><span onClick={() => navigate('/login')} className="hover:text-white transition cursor-pointer">Sign In</span></li>
                <li><span className="hover:text-white transition cursor-pointer">How It Works</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-4">For Artisans</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li><span onClick={() => navigate('/signup?type=artisan')} className="hover:text-white transition cursor-pointer">Become an Artisan</span></li>
                <li><span onClick={() => navigate('/login')} className="hover:text-white transition cursor-pointer">Artisan Login</span></li>
                <li><span onClick={() => navigate('/login')} className="hover:text-white transition cursor-pointer">Seller Resources</span></li>
                <li><span onClick={() => navigate('/login')} className="hover:text-white transition cursor-pointer">Success Stories</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li><span onClick={() => navigate('/contact')} className="hover:text-white transition cursor-pointer">Contact Us</span></li>
                <li><span onClick={() => navigate('/faq')} className="hover:text-white transition cursor-pointer">Help Center</span></li>
                <li><span onClick={() => navigate('/privacy')} className="hover:text-white transition cursor-pointer">Privacy Policy</span></li>
                <li><span onClick={() => navigate('/terms')} className="hover:text-white transition cursor-pointer">Terms of Service</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} BizBridge. All rights reserved. Made with ❤️ for African artisans.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;