import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = [
  'Woodworking', 'Pottery', 'Jewelry Making', 'Textile Art',
  'Leathercraft', 'Metalwork', 'Basket Weaving', 'Beadwork',
  'Calabash Decoration', 'Glass Blowing', 'Leather Shoes', 'Embroidery',
  'Soap Making', 'Candle Making', 'Hair Braiding & Styling',
];

const QUICK_CATEGORIES = [
  'Woodworking', 'Pottery', 'Jewelry Making', 'Textile Art',
  'Metalwork', 'Hair Braiding & Styling', 'Basket Weaving', 'Embroidery',
];

const LOCATIONS = [
  'Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Badagry',
  'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja',
  'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin',
  'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere', 'Yaba',
];

const AppHeader = ({
  searchQuery = '',
  setSearchQuery = () => {},
  selectedCategory = '',
  setSelectedCategory = () => {},
  selectedLocation = '',
  setSelectedLocation = () => {},
  onSearch = () => {},
  activePage = '',
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, userType, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goTo = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setMobileMenuOpen(false);
    logout();
    navigate('/');
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSearch();
  };

  const handleQuickCategory = (category) => {
    setMobileMenuOpen(false);
    navigate(`/services?category=${encodeURIComponent(category)}`);
  };

  const secondaryLinks = [
    { label: 'All Services', path: '/services',                              key: 'services'    },
    { label: 'Woodworking',  path: '/services?category=Woodworking',         key: 'woodworking' },
    { label: 'MetalWorks',   path: '/services?category=Metalwork',           key: 'metalwork'   },
    { label: 'Embroidery',   path: '/services?category=Embroidery',          key: 'embroidery'  },
    { label: 'Soap Making',  path: '/services?category=Soap & Candle Making',key: 'soap'        },
    { label: 'Hair Braiding',path: '/services?category=Hair Braiding & Styling', key: 'hair'   },
    { label: 'Pottery',      path: '/services?category=Pottery & Ceramics',  key: 'pottery'     },
    { label: 'Jewelry',      path: '/services?category=Jewelry Making',      key: 'jewelry'     },
    { label: 'Textiles',     path: '/services?category=Textile Art',         key: 'textiles'    },
  ];

  return (
    <header className="bg-black text-white w-full sticky top-0 z-50">

      {/* ── MOBILE HEADER ── */}
      <div className="md:hidden">
        {/* Bar 1 */}
        <div className="flex items-center justify-between px-2 py-2 gap-1 bg-black">
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
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

          <button
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
            className="flex flex-col items-center px-1.5 py-1 active:bg-white/10 rounded-md flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[8px] leading-tight whitespace-nowrap">
              {isAuthenticated ? 'Account' : 'Sign in'}
            </span>
          </button>

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
            <span className="text-[8px] leading-tight whitespace-nowrap">
              {userType === 'artisan' ? 'Services' : 'Bookings'}
            </span>
          </button>
        </div>

        {/* Bar 2: search */}
        <div className="px-2 pb-2 bg-black">
          <div className="flex w-full rounded-md overflow-hidden bg-white">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Category"
              className="bg-gray-100 text-black text-xs px-2 border-r border-gray-300 focus:outline-none max-w-[84px]"
            >
              <option value="">All</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search BizBridge"
              className="flex-1 min-w-0 px-2 py-1.5 text-black text-xs focus:outline-none"
            />
            <button
              onClick={onSearch}
              className="bg-yellow-400 active:bg-yellow-300 px-3 flex-shrink-0"
              aria-label="Search"
            >
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Bar 3: quick pills */}
        <div className="bg-neutral-900 border-t border-white/10">
          <div className="flex items-center gap-0.5 overflow-x-auto px-2 py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {/* "All Services" link — replaces the redundant hamburger+All button */}
            <button
              onClick={() => navigate('/services')}
              className={`flex-shrink-0 text-[10px] font-semibold px-2 py-1 whitespace-nowrap transition ${
                activePage === 'services' ? 'text-red-400' : 'hover:text-red-400'
              }`}
            >
              All Services
            </button>
            <span className="w-px h-3 bg-white/20 flex-shrink-0" />
            {QUICK_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleQuickCategory(cat)}
                className="flex-shrink-0 text-[10px] font-medium px-2 py-1 whitespace-nowrap active:text-red-400 transition"
              >
                {cat}
              </button>
            ))}
            <button
              onClick={handleAdClick}
              className="flex-shrink-0 text-[10px] font-semibold px-2 py-1 whitespace-nowrap text-yellow-400"
            >
              Sell Your Crafts
            </button>
          </div>
        </div>
      </div>

      {/* ── DESKTOP HEADER ── */}
      <div className="hidden md:block py-2">
        <div className="container mx-auto px-4 flex items-center justify-between gap-x-4">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-red-500 text-4xl select-none font-bold">𐐒</span>
            <span className="text-white text-3xl select-none font-bold">B</span>
            <span className="text-red-500 text-lg select-none font-semibold ml-3">BizBridge</span>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-3xl mx-8">
            <div className="flex w-full">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-200 text-black px-3 py-2 rounded-l-md border-r border-gray-300 focus:outline-none text-sm min-w-[140px]"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search for services, artisans, or crafts..."
                className="flex-1 px-4 py-2 text-black focus:outline-none text-sm"
              />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-gray-200 text-black px-3 py-2 border-l border-gray-300 focus:outline-none text-sm min-w-[120px]"
              >
                <option value="">All LGAs</option>
                {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              <button
                onClick={onSearch}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-r-md transition flex-shrink-0"
                aria-label="Search"
              >
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Account links */}
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

      {/* Secondary nav (desktop) */}
      <div className="hidden md:block bg-black border-y-2 border-red-500 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-6 text-sm overflow-x-auto whitespace-nowrap">
            {secondaryLinks.map(({ label, path, key }) => (
              <span
                key={key}
                onClick={() => navigate(path)}
                className={`cursor-pointer transition ${
                  activePage === key ? 'text-red-400 font-semibold' : 'hover:text-red-400'
                }`}
              >
                {label}
              </span>
            ))}
            <span
              className="cursor-pointer hover:text-red-400"
              onClick={handleAdClick}
            >
              Sell Your Crafts
            </span>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/40 z-40"
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

              {/* Nav grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                {secondaryLinks.map(({ label, path, key }) => (
                  <span
                    key={key}
                    onClick={() => goTo(path)}
                    className={`cursor-pointer py-2 border-b border-gray-800 transition ${
                      activePage === key ? 'text-red-400 font-semibold' : 'hover:text-red-400'
                    }`}
                  >
                    {label}
                  </span>
                ))}
                <span
                  className="cursor-pointer hover:text-red-400 py-2 border-b border-gray-800 col-span-2 text-center font-semibold text-yellow-400"
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
  );
};

export default AppHeader;
