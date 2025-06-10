import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TermsConditions = () => {
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
              <span className="text-gray-700">Terms & Conditions</span>
            </nav>
          </div>

          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Welcome to BizBridge! These terms govern your use of our platform and the relationship between customers and artisans.
            </p>
          </div>

          {/* Key Terms Summary */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-6 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-red-800">Key Terms Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-red-500 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Fair Use</h3>
                <p className="text-sm text-gray-600">Use our platform responsibly and respect other users</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-500 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Safe Payments</h3>
                <p className="text-sm text-gray-600">Secure payment processing with buyer protection</p>
              </div>
              <div className="text-center">
                <div className="bg-green-500 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Support Available</h3>
                <p className="text-sm text-gray-600">Get help when you need it through our support team</p>
              </div>
            </div>
          </div>

          {/* Main Terms Content */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  1. Acceptance of Terms
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    By accessing and using BizBridge, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our platform.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800">
                      <strong>Important:</strong> These terms apply to all users, including customers, artisans, and visitors to our platform.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  2. Platform Description
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    BizBridge is an online marketplace that connects customers with skilled artisans and service providers in Nigeria. We facilitate:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-semibold mb-2 text-green-800">For Customers</h3>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Browse and discover artisan services</li>
                        <li>• Book services directly with artisans</li>
                        <li>• Secure payment processing</li>
                        <li>• Review and rating system</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h3 className="font-semibold mb-2 text-purple-800">For Artisans</h3>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• Create detailed service profiles</li>
                        <li>• Manage bookings and requests</li>
                        <li>• Receive payments securely</li>
                        <li>• Build customer relationships</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  3. User Accounts and Registration
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-red-600">Account Requirements</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>You must be at least 18 years old to create an account</li>
                      <li>Provide accurate and complete registration information</li>
                      <li>Maintain the security of your account credentials</li>
                      <li>You are responsible for all activities under your account</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-red-600">Account Types</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 mb-2">
                        <strong>Customer Accounts:</strong> For individuals seeking artisan services
                      </p>
                      <p className="text-gray-700">
                        <strong>Artisan Accounts:</strong> For service providers offering their skills and crafts
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  4. User Conduct and Responsibilities
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-red-600">Acceptable Use</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-green-600">✅ You May:</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• Use the platform for legitimate business purposes</li>
                          <li>• Post accurate service descriptions and pricing</li>
                          <li>• Communicate respectfully with other users</li>
                          <li>• Provide honest reviews and feedback</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-red-600">❌ You May Not:</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• Post false or misleading information</li>
                          <li>• Engage in harassment or discrimination</li>
                          <li>• Attempt to circumvent our platform</li>
                          <li>• Violate any applicable laws</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3 text-yellow-800">Content Guidelines</h3>
                    <p className="text-yellow-700 mb-3">
                      All content posted on BizBridge must be appropriate, accurate, and legal. This includes:
                    </p>
                    <ul className="text-yellow-700 space-y-1">
                      <li>• Service descriptions and images</li>
                      <li>• Profile information</li>
                      <li>• Reviews and comments</li>
                      <li>• Messages between users</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  5. Booking and Payment Terms
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-red-600">Booking Process</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <ol className="list-decimal list-inside space-y-2 text-blue-800">
                        <li>Customer browses services and selects an artisan</li>
                        <li>Customer sends a booking request with project details</li>
                        <li>Artisan reviews and accepts/declines the request</li>
                        <li>Both parties agree on terms, timeline, and pricing</li>
                        <li>Payment is processed securely through our platform</li>
                      </ol>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-red-600">Payment Terms</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Payment Processing</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• Secure payment gateway integration</li>
                          <li>• Multiple payment methods accepted</li>
                          <li>• Payments held in escrow until completion</li>
                          <li>• Automatic release upon service completion</li>
                        </ul>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Fees and Charges</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• Platform fee charged to artisans</li>
                          <li>• Payment processing fees apply</li>
                          <li>• No hidden charges for customers</li>
                          <li>• Transparent fee structure</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  6. Cancellation and Refund Policy
                </h2>
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3 text-red-800">Cancellation Rules</h3>
                    <div className="space-y-3">
                      <p className="text-red-700">
                        <strong>Before Work Begins:</strong> Full refund available if cancelled before artisan starts work
                      </p>
                      <p className="text-red-700">
                        <strong>Work in Progress:</strong> Partial refund based on work completed and materials used
                      </p>
                      <p className="text-red-700">
                        <strong>Work Completed:</strong> No refund unless service does not meet agreed specifications
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-red-600">Dispute Resolution</h3>
                    <p className="text-gray-700 mb-3">
                      If disputes arise between customers and artisans, BizBridge will:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      <li>Facilitate communication between parties</li>
                      <li>Review evidence and documentation</li>
                      <li>Make fair decisions based on platform policies</li>
                      <li>Process refunds or payments accordingly</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  7. Intellectual Property
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Users retain ownership of content they create and upload to BizBridge, including service descriptions, images, and portfolio items. However, by using our platform, you grant BizBridge a license to use this content for platform operations and marketing.
                  </p>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-2 text-purple-800">Platform Content</h3>
                    <p className="text-purple-700">
                      BizBridge's platform, including design, code, and functionality, is protected by intellectual property laws. Users may not copy, modify, or distribute our platform without permission.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  8. Privacy and Data Protection
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Your privacy is important to us. Our use of your personal information is governed by our Privacy Policy, which is incorporated into these terms by reference.
                  </p>
                  <div className="flex items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <button 
                      onClick={() => navigate('/privacy')}
                      className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition font-medium"
                    >
                      Read Our Privacy Policy
                    </button>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  9. Limitation of Liability
                </h2>
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="font-semibold mb-3 text-yellow-800">Platform Role</h3>
                    <p className="text-yellow-700 mb-3">
                      BizBridge acts as a marketplace facilitator. We do not directly provide services or guarantee the quality of work performed by artisans.
                    </p>
                    <ul className="text-yellow-700 space-y-1">
                      <li>• Artisans are independent contractors</li>
                      <li>• We facilitate connections but don't control service delivery</li>
                      <li>• Users are responsible for their own interactions</li>
                      <li>• We provide dispute resolution assistance</li>
                    </ul>
                  </div>
                  
                  <p className="text-gray-700">
                    To the maximum extent permitted by law, BizBridge's liability is limited to the amount of fees paid for the specific transaction in question.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  10. Account Termination
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-red-600">User-Initiated Termination</h3>
                    <p className="text-gray-700 mb-3">
                      You may delete your account at any time through your account settings. Upon termination:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      <li>Your profile will be removed from public view</li>
                      <li>Active bookings will be handled according to their terms</li>
                      <li>Some data may be retained for legal compliance</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-red-600">Platform-Initiated Termination</h3>
                    <p className="text-gray-700">
                      We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or pose risks to other users.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  11. Changes to Terms
                </h2>
                <p className="text-gray-700 mb-4">
                  We may update these Terms and Conditions from time to time. Significant changes will be communicated through:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Email notifications to registered users</li>
                  <li>Prominent notices on our platform</li>
                  <li>Updated posting date at the bottom of this page</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  Continued use of the platform after changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  12. Governing Law
                </h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700">
                    These Terms and Conditions are governed by the laws of Nigeria. Any disputes will be resolved through the courts of Lagos State, Nigeria, or through alternative dispute resolution methods as mutually agreed.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  13. Contact Information
                </h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <p className="text-blue-700 mb-4">
                    If you have questions about these Terms and Conditions, please contact us:
                  </p>
                  <div className="space-y-2 text-blue-700">
                    <p><strong>Legal Team:</strong> legal@bizbridge.com</p>
                    <p><strong>General Support:</strong> support@bizbridge.com</p>
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
                  These terms are effective immediately and apply to all users of the BizBridge platform
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
                Contact Legal Team
              </button>
              <button 
                onClick={() => navigate('/privacy')}
                className="bg-gray-500 text-white py-3 px-6 rounded-md hover:bg-gray-600 transition font-medium"
              >
                View Privacy Policy
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

export default TermsConditions;