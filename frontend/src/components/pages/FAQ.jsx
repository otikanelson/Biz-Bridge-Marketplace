import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const FAQ = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType, currentUser, logout } = useAuth();
  
  // Search states for navbar (for customers)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  
  // FAQ search state
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState({});

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

  // FAQ Data organized by categories
  const faqData = {
    general: [
      {
        id: 'general-1',
        question: 'What is BizBridge?',
        answer: 'BizBridge is an online marketplace that connects customers with skilled artisans and service providers across Nigeria. Our platform makes it easy to find, book, and pay for high-quality artisan services ranging from woodworking and pottery to jewelry making and textile arts.'
      },
      {
        id: 'general-2',
        question: 'How does BizBridge work?',
        answer: 'BizBridge works in simple steps: 1) Browse our marketplace to find artisans and services that match your needs, 2) Send a booking request with your project details, 3) Discuss terms and pricing with the artisan, 4) Make secure payment through our platform, 5) Receive your completed service and leave a review.'
      },
      {
        id: 'general-3',
        question: 'Is BizBridge free to use?',
        answer: 'Yes! Creating an account and browsing services on BizBridge is completely free for customers. Artisans pay a small platform fee only when they complete a booking. There are no hidden charges or subscription fees.'
      },
      {
        id: 'general-4',
        question: 'What types of services are available?',
        answer: 'BizBridge offers a wide variety of artisan services including Woodworking, Pottery, Jewelry Making, Textile Arts, Leathercraft, Metalwork, Basket Weaving, Beadwork, Calabash Decoration, Glass Blowing, Leather Shoes, Embroidery, Soap Making, Candle Making, and Hair Braiding & Styling.'
      }
    ],
    customers: [
      {
        id: 'customer-1',
        question: 'How do I book a service?',
        answer: 'To book a service: 1) Browse or search for the service you need, 2) Click on an artisan\'s profile to view their work and pricing, 3) Click "Book Now" and fill out the booking request form with your project details, 4) Wait for the artisan to accept your request and discuss any details, 5) Make payment through our secure platform once terms are agreed.'
      },
      {
        id: 'customer-2',
        question: 'How do I pay for services?',
        answer: 'BizBridge uses secure payment processing with multiple payment methods including credit/debit cards, bank transfers, and mobile money. Payments are held in escrow until the service is completed to your satisfaction, ensuring both parties are protected.'
      },
      {
        id: 'customer-3',
        question: 'What if I\'m not satisfied with a service?',
        answer: 'If you\'re not satisfied with a completed service, you can raise a dispute through your dashboard within 7 days. Our support team will review the case and work with both parties to reach a fair resolution. In cases where the service doesn\'t meet agreed specifications, refunds may be issued.'
      },
      {
        id: 'customer-4',
        question: 'Can I cancel a booking?',
        answer: 'Yes, you can cancel bookings under certain conditions: Before work begins - full refund available; Work in progress - partial refund based on completed work; Work completed - no refund unless service doesn\'t meet specifications. Check our Terms & Conditions for detailed cancellation policies.'
      },
      {
        id: 'customer-5',
        question: 'How do I communicate with artisans?',
        answer: 'Once you send a booking request, you can communicate with artisans through our built-in messaging system. This keeps all communication secure and documented. You can discuss project details, timelines, pricing, and any special requirements directly with the artisan.'
      }
    ],
    artisans: [
      {
        id: 'artisan-1',
        question: 'How do I become an artisan on BizBridge?',
        answer: 'To join as an artisan: 1) Click "Become an Artisan" in the header, 2) Create your account with business details, 3) Set up your profile with skills, experience, and portfolio images, 4) Add your services with descriptions and pricing, 5) Wait for approval, then start receiving booking requests from customers.'
      },
      {
        id: 'artisan-2',
        question: 'What fees do artisans pay?',
        answer: 'Artisans pay a small platform fee (typically 5-10%) only when they complete a booking and receive payment. There are no upfront costs, monthly fees, or charges for creating your profile. You only pay when you earn.'
      },
      {
        id: 'artisan-3',
        question: 'How do I get paid?',
        answer: 'Payments are automatically released to your account once a service is marked as completed and the customer has confirmed satisfaction (or after 7 days if no disputes are raised). You can withdraw funds to your bank account or mobile money wallet.'
      },
      {
        id: 'artisan-4',
        question: 'How do I manage my bookings?',
        answer: 'Use your artisan dashboard to manage all bookings. You can view incoming requests, accept or decline bookings, communicate with customers, update booking status, upload progress photos, and track payments. The dashboard gives you complete control over your business.'
      },
      {
        id: 'artisan-5',
        question: 'Can I set my own prices?',
        answer: 'Absolutely! As an artisan, you have full control over your pricing. You can set different prices for different services, offer package deals, or quote custom prices for unique projects. Our platform gives you the flexibility to price your services competitively.'
      }
    ],
    payments: [
      {
        id: 'payment-1',
        question: 'Is my payment information secure?',
        answer: 'Yes, absolutely. BizBridge uses industry-standard SSL encryption and secure payment gateways to protect all financial information. We never store your complete card details on our servers, and all transactions are processed through certified payment providers.'
      },
      {
        id: 'payment-2',
        question: 'What payment methods are accepted?',
        answer: 'We accept major credit cards (Visa, Mastercard), debit cards, bank transfers, and popular mobile money services in Nigeria. More payment options are continuously being added to serve our diverse user base.'
      },
      {
        id: 'payment-3',
        question: 'How does escrow protection work?',
        answer: 'Escrow protection means your payment is held securely by BizBridge until the service is completed. The artisan only receives payment once you confirm satisfaction with the work, or automatically after 7 days if no issues are reported. This protects both customers and artisans.'
      },
      {
        id: 'payment-4',
        question: 'Can I get a refund?',
        answer: 'Refunds are available in specific circumstances: if the artisan cancels before starting work, if the service doesn\'t meet agreed specifications, or if there are other valid disputes. Our support team reviews each refund request individually to ensure fairness.'
      }
    ],
    technical: [
      {
        id: 'technical-1',
        question: 'What browsers are supported?',
        answer: 'BizBridge works best with modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated to the latest version for the best experience and security.'
      },
      {
        id: 'technical-2',
        question: 'Is there a mobile app?',
        answer: 'Currently, BizBridge is optimized for mobile browsers and works great on all devices. We have plans to launch dedicated iOS and Android apps in the near future to provide an even better mobile experience.'
      },
      {
        id: 'technical-3',
        question: 'How do I reset my password?',
        answer: 'To reset your password, go to the login page and click "Forgot Password." Enter your email address, and we\'ll send you a secure link to create a new password. If you don\'t receive the email, check your spam folder or contact support.'
      },
      {
        id: 'technical-4',
        question: 'What should I do if I encounter a technical issue?',
        answer: 'If you encounter any technical issues, first try refreshing your browser or clearing your cache. If the problem persists, please contact our technical support team via the "Contact Us" page, providing as much detail as possible about the issue.'
      }
    ]
  };

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

  const toggleItem = (itemId) => {
    setOpenItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Filter FAQ items based on search query
  const filterFAQs = (items) => {
    if (!faqSearchQuery) return items;
    
    return items.filter(item =>
      item.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(faqSearchQuery.toLowerCase())
    );
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
              <span className="text-gray-700">Frequently Asked Questions</span>
            </nav>
          </div>

          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about BizBridge, our services, and how to make the most of our platform.
            </p>
          </div>

          {/* FAQ Search Box */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for answers..."
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
              />
              <div className="absolute left-4 top-4">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Quick Help Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 text-center">
              <div className="bg-blue-500 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-blue-800">New to BizBridge?</h3>
              <p className="text-blue-700 text-sm mb-3">Learn how to get started with our platform</p>
              <button 
                onClick={() => navigate('/signup')}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition text-sm"
              >
                Create Account
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6 text-center">
              <div className="bg-green-500 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-green-800">Need Personal Help?</h3>
              <p className="text-green-700 text-sm mb-3">Get direct support from our team</p>
              <button 
                onClick={() => navigate('/contact')}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition text-sm"
              >
                Contact Support
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6 text-center">
              <div className="bg-purple-500 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h1a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-purple-800">Want to Sell Services?</h3>
              <p className="text-purple-700 text-sm mb-3">Join as an artisan and grow your business</p>
              <button 
                onClick={() => navigate('/signup?type=artisan')}
                className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition text-sm"
              >
                Become Artisan
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* General Questions */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-red-600 border-b border-red-200 pb-2">
                🏠 General Questions
              </h2>
              <div className="space-y-4">
                {filterFAQs(faqData.general).map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                    <button
                      className="flex justify-between items-center w-full p-4 text-left font-medium focus:outline-none hover:bg-gray-50"
                      onClick={() => toggleItem(item.id)}
                    >
                      <span className="text-gray-900">{item.question}</span>
                      <svg
                        className={`w-5 h-5 transition-transform text-red-500 ${openItems[item.id] ? 'transform rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openItems[item.id] && (
                      <div className="px-4 py-3 bg-green-50 border-t border-green-200">
                        <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Payments & Security */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-purple-600 border-b border-purple-200 pb-2">
                💳 Payments & Security
              </h2>
              <div className="space-y-4">
                {filterFAQs(faqData.payments).map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                    <button
                      className="flex justify-between items-center w-full p-4 text-left font-medium focus:outline-none hover:bg-purple-50"
                      onClick={() => toggleItem(item.id)}
                    >
                      <span className="text-gray-900">{item.question}</span>
                      <svg
                        className={`w-5 h-5 transition-transform text-purple-500 ${openItems[item.id] ? 'transform rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openItems[item.id] && (
                      <div className="px-4 py-3 bg-purple-50 border-t border-purple-200">
                        <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Support */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-orange-600 border-b border-orange-200 pb-2">
                🔧 Technical Support
              </h2>
              <div className="space-y-4">
                {filterFAQs(faqData.technical).map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                    <button
                      className="flex justify-between items-center w-full p-4 text-left font-medium focus:outline-none hover:bg-orange-50"
                      onClick={() => toggleItem(item.id)}
                    >
                      <span className="text-gray-900">{item.question}</span>
                      <svg
                        className={`w-5 h-5 transition-transform text-orange-500 ${openItems[item.id] ? 'transform rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openItems[item.id] && (
                      <div className="px-4 py-3 bg-orange-50 border-t border-orange-200">
                        <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Still Have Questions Section */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-8 text-center">
              <div className="bg-red-500 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-red-800">Still Have Questions?</h2>
              <p className="text-red-700 mb-6 text-lg">
                If you couldn't find the answer to your question, our support team is here to help you 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate('/contact')}
                  className="bg-red-500 text-white py-3 px-8 rounded-md hover:bg-red-600 transition font-medium"
                >
                  Contact Support
                </button>
                <button 
                  onClick={() => navigate('/services')}
                  className="bg-white text-red-500 border border-red-500 py-3 px-8 rounded-md hover:bg-red-50 transition font-medium"
                >
                  Browse Services
                </button>
              </div>
            </div>
          </div>

          {/* Popular Resources */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">Popular Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition">
                <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Getting Started Guide</h3>
                <p className="text-sm text-gray-600 mb-3">Learn the basics of using BizBridge</p>
                <button 
                  onClick={() => navigate('/signup')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Read Guide →
                </button>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition">
                <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Safety Guidelines</h3>
                <p className="text-sm text-gray-600 mb-3">Stay safe while using our platform</p>
                <button 
                  onClick={() => navigate('/terms')}
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  View Guidelines →
                </button>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition">
                <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Payment Security</h3>
                <p className="text-sm text-gray-600 mb-3">Learn about our payment protection</p>
                <button 
                  onClick={() => navigate('/privacy')}
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                >
                  Learn More →
                </button>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition">
                <div className="bg-red-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Quick Start</h3>
                <p className="text-sm text-gray-600 mb-3">Start booking services in minutes</p>
                <button 
                  onClick={() => navigate('/services')}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Get Started →
                </button>
              </div>
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

export default FAQ; 