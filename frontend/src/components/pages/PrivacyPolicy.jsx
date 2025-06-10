import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType, currentUser, logout } = useAuth();
  
  // Search states for navbar (for customers)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Job categories for search
  const categories = [
    'Woodworking', 'Pottery', 'Jewelry Making', 'Textile Art', 
    'Leathercraft', 'Metalwork', 'Basket Weaving', 'Beadwork',
    'Calabash Decoration', 'Glass Blowing', 'Leather Shoes', 'Embroidery',
    'Soap Making', 'Candle Making', 'Hair Braiding & Styling'
  ];

  // Lagos LGAs for search
  const locations = [
    'Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Badagry',
    'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja',
    'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin',
    'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere', 'Yaba'
  ];

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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDisplayName = () => {
    if (!currentUser) return 'User';
    
    if (userType === 'customer') {
      return currentUser.fullName || currentUser.username || 'Customer';
    } else if (userType === 'artisan') {
      return currentUser.contactName || currentUser.businessName || currentUser.username || 'Artisan';
    } else {
      return currentUser.username || 'User';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ✅ AMAZON-STYLE HEADER WITH CONDITIONAL SEARCH BAR */}
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

            {/* ✅ SEARCH BAR - ONLY FOR CUSTOMERS */}
            {userType === 'customer' && (
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
            )}

            {/* Account & Navigation */}
            <div className="flex items-center space-x-6">
              {!isAuthenticated ? (
                <>
                  <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate('/login')}>
                    <div className="text-xs">Hello, sign in</div>
                    <div className="text-sm font-bold">Account & Lists</div>
                  </div>
                  <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate('/signup?type=artisan')}>
                    <div className="text-xs">Become an</div>
                    <div className="text-sm font-bold">Artisan</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate('/dashboard')}>
                    <div className="text-xs">Hello, {getDisplayName()}</div>
                    <div className="text-sm font-bold">Dashboard</div>
                  </div>
                  {userType === 'customer' && (
                    <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate('/bookings')}>
                      <div className="text-xs">Returns</div>
                      <div className="text-sm font-bold">& Bookings</div>
                    </div>
                  )}
                  {userType === 'artisan' && (
                    <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate('/ServicesManagement')}>
                      <div className="text-xs">Your</div>
                      <div className="text-sm font-bold">Services</div>
                    </div>
                  )}
                  <div className="text-xs cursor-pointer hover:text-red-400" onClick={handleLogout}>
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
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/services?category=Metalwork')}>
                MetalWorks
              </span>
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/services?category=Embroidery')}>
                Embroidery
              </span>
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/services?category=Soap Making')}>
                Soap Making
              </span>  
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/services?category=Hair Braiding & Styling')}>
                Hair Braiding
              </span>
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/contact')}>
                Contact Us
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 flex-grow bg-white">
        <div className="container mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="text-sm">
              <span 
                onClick={() => navigate('/')} 
                className="text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Home
              </span>
              <span className="mx-2 text-gray-500">›</span>
              <span className="text-gray-700">Privacy Policy</span>
            </nav>
          </div>

          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information when you use BizBridge.
            </p>
          </div>

          {/* Quick Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-12">
            <h2 className="text-2xl font-bold mb-4 text-blue-800">Privacy at a Glance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-500 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Data Protection</h3>
                <p className="text-sm text-gray-600">We use industry-standard encryption to protect your personal information.</p>
              </div>
              <div className="text-center">
                <div className="bg-green-500 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Your Control</h3>
                <p className="text-sm text-gray-600">You can manage your privacy settings and data preferences anytime.</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-500 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Transparency</h3>
                <p className="text-sm text-gray-600">We're clear about what data we collect and how we use it.</p>
              </div>
            </div>
          </div>

          {/* Main Privacy Policy Content */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  1. Information We Collect
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-red-600">Personal Information</h3>
                    <p className="text-gray-700 mb-3">
                      When you create an account, we collect information such as your name, email address, phone number, and location. For artisans, we also collect business information, skills, and portfolio details.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-red-600">Usage Information</h3>
                    <p className="text-gray-700 mb-3">
                      We collect information about how you use our platform, including pages visited, services viewed, searches performed, and interaction patterns to improve our service.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-red-600">Communication Data</h3>
                    <p className="text-gray-700 mb-3">
                      We store messages exchanged between customers and artisans through our platform to facilitate bookings and provide customer support.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  2. How We Use Your Information
                </h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700"><strong>Service Delivery:</strong> To connect customers with artisans and facilitate bookings and communications</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700"><strong>Account Management:</strong> To create and maintain your account, process payments, and provide customer support</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700"><strong>Platform Improvement:</strong> To analyze usage patterns and improve our platform features and user experience</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700"><strong>Safety & Security:</strong> To detect and prevent fraud, abuse, and other harmful activities</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700"><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</span>
                    </li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  3. Information Sharing
                </h2>
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2 text-yellow-800">We Do NOT Sell Your Data</h3>
                    <p className="text-yellow-700">
                      BizBridge does not sell, rent, or trade your personal information to third parties for marketing purposes.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-red-600">Limited Sharing</h3>
                    <p className="text-gray-700 mb-3">
                      We only share your information in specific circumstances:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li><strong>With Other Users:</strong> Your profile information is visible to facilitate connections between customers and artisans</li>
                      <li><strong>Service Providers:</strong> We work with trusted partners for payment processing, cloud hosting, and customer support</li>
                      <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights and safety</li>
                      <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  4. Data Security
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3 text-green-800">Technical Safeguards</h3>
                    <ul className="space-y-2 text-green-700">
                      <li>• SSL/TLS encryption for data transmission</li>
                      <li>• Encrypted data storage</li>
                      <li>• Regular security audits</li>
                      <li>• Secure payment processing</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3 text-blue-800">Operational Safeguards</h3>
                    <ul className="space-y-2 text-blue-700">
                      <li>• Limited employee access</li>
                      <li>• Background checks for staff</li>
                      <li>• Regular training on data protection</li>
                      <li>• Incident response procedures</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  5. Your Rights and Choices
                </h2>
                <div className="space-y-6">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3 text-purple-800">Account Controls</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">✅ Access & Update</h4>
                        <p className="text-sm text-gray-600">View and modify your personal information through your account settings</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">🗑️ Delete Account</h4>
                        <p className="text-sm text-gray-600">Request deletion of your account and associated data</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">📧 Communication Preferences</h4>
                        <p className="text-sm text-gray-600">Opt-out of marketing emails while keeping essential notifications</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">📱 Data Portability</h4>
                        <p className="text-sm text-gray-600">Request a copy of your data in a portable format</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  6. Cookies and Tracking
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    We use cookies and similar technologies to enhance your experience, remember your preferences, and analyze platform usage.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 text-blue-600">Essential Cookies</h4>
                      <p className="text-sm text-gray-600">Required for platform functionality, login, and security. Cannot be disabled.</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 text-green-600">Performance Cookies</h4>
                      <p className="text-sm text-gray-600">Help us understand how you use our platform to improve performance.</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 text-purple-600">Marketing Cookies</h4>
                      <p className="text-sm text-gray-600">Used to show relevant content and measure advertising effectiveness.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  7. Data Retention
                </h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 mb-4">
                    We retain your personal information only as long as necessary to provide our services and comply with legal obligations:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Active Accounts:</strong> We keep your data while your account is active</li>
                    <li><strong>Inactive Accounts:</strong> Data is retained for 2 years after last activity, then deleted</li>
                    <li><strong>Transaction Records:</strong> Financial records kept for 7 years for legal compliance</li>
                    <li><strong>Support Communications:</strong> Kept for 3 years to improve customer service</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  8. International Users
                </h2>
                <p className="text-gray-700 mb-4">
                  While BizBridge primarily serves users in Nigeria, we may transfer and process your data in other countries where our service providers operate. We ensure appropriate safeguards are in place to protect your information regardless of location.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  9. Children's Privacy
                </h2>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <p className="text-red-700">
                    BizBridge is not intended for users under 18 years of age. We do not knowingly collect personal information from children under 18. If we learn that we have collected information from a child under 18, we will delete it immediately.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  10. Updates to This Policy
                </h2>
                <p className="text-gray-700 mb-4">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes by:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Posting the updated policy on our platform</li>
                  <li>Sending email notifications for material changes</li>
                  <li>Displaying prominent notices on our platform</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  11. Contact Information
                </h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <p className="text-blue-700 mb-4">
                    If you have questions about this Privacy Policy or want to exercise your rights, please contact us:
                  </p>
                  <div className="space-y-2 text-blue-700">
                    <p><strong>Privacy Officer:</strong> privacy@bizbridge.com</p>
                    <p><strong>General Contact:</strong> support@bizbridge.com</p>
                    <p><strong>Phone:</strong> +234 123 456 7890</p>
                    <p><strong>Address:</strong> 123 Innovation Drive, Victoria Island, Lagos, Nigeria</p>
                  </div>
                </div>
              </section>

              <div className="bg-gray-100 rounded-lg p-6 text-center">
                <p className="text-gray-600 text-sm">
                  <strong>Last updated:</strong> June 10, 2025
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Previous versions of this policy are available upon request
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-12 text-center">
            <div className="inline-flex space-x-4">
              <button 
                onClick={() => navigate('/contact')}
                className="bg-red-500 text-white py-3 px-6 rounded-md hover:bg-red-600 transition font-medium"
              >
                Contact Privacy Team
              </button>
              <button 
                onClick={() => navigate('/terms')}
                className="bg-gray-500 text-white py-3 px-6 rounded-md hover:bg-gray-600 transition font-medium"
              >
                View Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          {/* Social Media Icons */}
          <div className="text-center mb-8">
            <div className="flex justify-center space-x-4">
              <a href="#" className="bg-red-500 hover:bg-red-600 rounded-full p-3 flex items-center justify-center w-12 h-12 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="bg-red-500 hover:bg-red-600 rounded-full p-3 flex items-center justify-center w-12 h-12 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="bg-red-500 hover:bg-red-600 rounded-full p-3 flex items-center justify-center w-12 h-12 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.342-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.163-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.757-1.378l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
              <a href="#" className="bg-red-500 hover:bg-red-600 rounded-full p-3 flex items-center justify-center w-12 h-12 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Footer Links */}
          <div className="text-center">
            <p className="mb-4">&copy; {new Date().getFullYear()} BizBridge. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <span onClick={() => navigate('/terms')} className="text-red-400 hover:text-red-300 cursor-pointer transition">Terms of Service</span>
              <span onClick={() => navigate('/privacy')} className="text-red-400 hover:text-red-300 cursor-pointer transition">Privacy Policy</span>
              <span onClick={() => navigate('/contact')} className="text-red-400 hover:text-red-300 cursor-pointer transition">Contact Us</span>
              <span onClick={() => navigate('/faq')} className="text-red-400 hover:text-red-300 cursor-pointer transition">FAQ</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;