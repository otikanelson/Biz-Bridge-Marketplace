// src/components/pages/FAQ.jsx - Updated for New Pricing System
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const FAQ = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType, currentUser, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState({});

  // FAQ Categories
  const faqCategories = {
    'pricing': {
      title: 'Pricing & Payments',
      icon: '💰',
      items: [
        {
          id: 'pricing-1',
          question: 'Does BizBridge process payments?',
          answer: 'No, BizBridge does NOT process payments. All financial transactions must be handled directly between customers and artisans. We facilitate connections and provide dispute resolution support, but you are responsible for arranging payment methods with your service provider.'
        },
        {
          id: 'pricing-2',
          question: 'What are the different pricing options for services?',
          answer: 'BizBridge offers three pricing models: (1) Fixed Pricing - transparent, upfront prices with no surprises, (2) Negotiate Pricing - flexible pricing based on project requirements, and (3) Categorized Pricing - different prices for different service categories with enhanced BizBridge dispute protection.'
        },
        {
          id: 'pricing-3',
          question: 'What is Categorized Pricing and how does it work?',
          answer: 'Categorized Pricing allows artisans to set different prices for different types of work within their service category (e.g., "Furniture Making" vs "Wood Carving" for woodworking). This option is available for Woodworking, Metalwork, and Textile Art services and includes enhanced dispute resolution support from BizBridge.'
        },
        {
          id: 'pricing-4',
          question: 'How do I pay for services?',
          answer: 'You arrange payment directly with the artisan using your preferred method (cash, bank transfer, mobile money, etc.). BizBridge provides service agreements and dispute resolution but does not handle the actual payment transaction. Discuss payment terms with your artisan before work begins.'
        },
        {
          id: 'pricing-5',
          question: 'Can prices change after I book a service?',
          answer: 'For Fixed and Categorized pricing, prices are protected by the service agreement. For Negotiate pricing, you and the artisan agree on the final price before work begins. Any price changes must be mutually agreed upon and documented.'
        }
      ]
    },
    'booking': {
      title: 'Booking & Services',
      icon: '📅',
      items: [
        {
          id: 'booking-1',
          question: 'How do I book a service?',
          answer: 'Browse services, select one that matches your needs, and click "Request Service" or "Request Quote" depending on the pricing type. Provide details about your project, and the artisan will respond with availability and any additional information needed.'
        },
        {
          id: 'booking-2',
          question: 'What happens after I send a service request?',
          answer: 'The artisan will review your request and respond with either acceptance (for fixed/categorized pricing) or a detailed quote (for negotiate pricing). Once accepted, a service agreement is automatically generated for both parties to review and sign.'
        },
        {
          id: 'booking-3',
          question: 'Can I cancel a booking?',
          answer: 'Yes, but cancellation terms depend on the service agreement and how far work has progressed. Contact the artisan directly to discuss cancellation. For disputes, you can use our dispute resolution system.'
        },
        {
          id: 'booking-4',
          question: 'How do I know when my service is complete?',
          answer: 'As the customer, you have the ability to mark services as complete once you\'re satisfied with the work. The artisan cannot mark a service as complete - this ensures you have control over the final approval.'
        }
      ]
    },
    'disputes': {
      title: 'Disputes & Protection',
      icon: '🛡️',
      items: [
        {
          id: 'disputes-1',
          question: 'What dispute protection does BizBridge provide?',
          answer: 'BizBridge provides different levels of dispute protection based on pricing type: Basic protection (mediation and contract facilitation) for Fixed and Negotiate pricing, and Enhanced protection (full contract enforcement and comprehensive dispute resolution) for Categorized pricing services.'
        },
        {
          id: 'disputes-2',
          question: 'How do I file a dispute?',
          answer: 'You can file a dispute through your booking dashboard if issues arise with service quality, pricing disagreements, or contract violations. Provide detailed information about the issue, and our support team will review the case and facilitate resolution.'
        },
        {
          id: 'disputes-3',
          question: 'What types of disputes can BizBridge help resolve?',
          answer: 'We help resolve disputes related to service quality, contract violations, pricing disagreements (especially for categorized services), timeline issues, and communication problems. We cannot resolve payment disputes since we don\'t process payments.'
        },
        {
          id: 'disputes-4',
          question: 'How long does dispute resolution take?',
          answer: 'Most disputes are resolved within 3-7 business days. Complex cases may take longer. For categorized pricing services, we provide expedited resolution within 2-3 business days due to enhanced protection coverage.'
        }
      ]
    },
    'platform': {
      title: 'Platform & Account',
      icon: '⚙️',
      items: [
        {
          id: 'platform-1',
          question: 'How do I create an account?',
          answer: 'Click "Sign Up" and choose either "Customer" or "Artisan" account. Provide your basic information, verify your email, and complete your profile. Artisans may need additional verification for certain service categories.'
        },
        {
          id: 'platform-2',
          question: 'Is BizBridge free to use?',
          answer: 'Yes, creating an account and browsing services is free. BizBridge earns revenue through premium features and advertising, not by taking a percentage of your transactions since we don\'t process payments.'
        },
        {
          id: 'platform-3',
          question: 'How do I become a verified artisan?',
          answer: 'Complete your profile with portfolio examples, provide accurate service information, and maintain good customer ratings. Some categories may require additional verification. Verified artisans get priority in search results and customer trust badges.'
        },
        {
          id: 'platform-4',
          question: 'Can I have both customer and artisan accounts?',
          answer: 'Currently, each user can have one account type. However, you can contact support to discuss switching account types if your needs change.'
        }
      ]
    },
    'technical': {
      title: 'Technical Support',
      icon: '🔧',
      items: [
        {
          id: 'technical-1',
          question: 'What browsers does BizBridge support?',
          answer: 'BizBridge works best on modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience.'
        },
        {
          id: 'technical-2',
          question: 'How do I upload images for my service?',
          answer: 'When creating or editing a service, click the image upload area and select photos from your device. We support JPG, PNG, and WebP formats up to 5MB per image. Good quality photos help attract more customers.'
        },
        {
          id: 'technical-3',
          question: 'I forgot my password. How do I reset it?',
          answer: 'Click "Forgot Password" on the login page. Enter your email address, and we\'ll send you a secure link to create a new password. If you don\'t receive the email, check your spam folder or contact support.'
        },
        {
          id: 'technical-4',
          question: 'What should I do if I encounter a technical issue?',
          answer: 'If you encounter any technical issues, first try refreshing your browser or clearing your cache. If the problem persists, please contact our technical support team via the "Contact Us" page, providing as much detail as possible about the issue.'
        }
      ]
    }
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
      {/* Header */}
      <header className="bg-black text-white w-full top-0 z-10 fixed">
        <div className="py-2">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center">
              <span onClick={() => navigate('/')} className="text-red-500 text-5xl select-none font-bold cursor-pointer">𐐒</span>
              <span onClick={() => navigate('/')} className="text-white text-4xl select-none font-bold cursor-pointer">B</span>
              <span onClick={() => navigate('/')} className="text-red-500 text-2xl select-none cursor-pointer font-semibold ml-5">BizBridge</span>
            </div>
            <div className="flex items-center space-x-6">
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/services?category=Woodworking')}>
                Woodworking
              </span>
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/services?category=Metalwork')}>
                Metalwork  
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
              Find answers to common questions about BizBridge, our new pricing system, and how to make the most of our platform.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search FAQs..."
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pl-12"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="max-w-4xl mx-auto">
            {Object.entries(faqCategories).map(([categoryKey, category]) => {
              const filteredItems = filterFAQs(category.items);
              
              if (filteredItems.length === 0 && faqSearchQuery) return null;

              return (
                <div key={categoryKey} className="mb-12">
                  <div className="flex items-center mb-6">
                    <span className="text-3xl mr-3">{category.icon}</span>
                    <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {filteredItems.map((item) => (
                      <div key={item.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <button
                          onClick={() => toggleItem(item.id)}
                          className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900 pr-4">{item.question}</span>
                          <svg
                            className={`h-5 w-5 text-gray-500 transform transition-transform ${
                              openItems[item.id] ? 'transform rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {openItems[item.id] && (
                          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* No Results */}
            {faqSearchQuery && Object.values(faqCategories).every(category => filterFAQs(category.items).length === 0) && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No results found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any FAQs matching "{faqSearchQuery}". Try different keywords or browse our categories above.
                </p>
                <button
                  onClick={() => setFaqSearchQuery('')}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Clear Search
                </button>
              </div>
            )}

            {/* Still Have Questions Section */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-8 text-center">
              <div className="bg-red-500 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-red-800">Still Have Questions?</h2>
              <p className="text-red-700 mb-6 text-lg">
                If you couldn't find the answer to your question, our support team is here to help you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate('/contact')}
                  className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition font-medium"
                >
                  Contact Support
                </button>
                <button 
                  onClick={() => navigate('/services')}
                  className="bg-white text-red-500 border border-red-500 px-8 py-3 rounded-lg hover:bg-red-50 transition font-medium"
                >
                  Browse Services
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
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.40z"/>
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