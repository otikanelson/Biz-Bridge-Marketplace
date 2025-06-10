import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ContactUs = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType, currentUser, logout } = useAuth();
  
  // Search states for navbar (for customers)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    userType: 'general'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.message) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSubmitSuccess(true);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          userType: 'general'
        });
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setIsSubmitting(false);
      }
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
              <span className="text-gray-700">Contact Us</span>
            </nav>
          </div>

          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're here to help! Whether you're a customer looking for amazing artisan services or an artisan wanting to join our platform, we'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
              
              <div className="space-y-8">
                {/* Quick Contact Cards */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <div className="bg-red-500 rounded-full p-3 mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-red-700">Phone Support</h3>
                      <p className="text-gray-700 mb-2">
                        <strong>Customer Support:</strong> +234 123 456 7890<br />
                        <strong>Artisan Support:</strong> +234 123 456 7891<br />
                        <strong>General Inquiries:</strong> +234 123 456 7892
                      </p>
                      <p className="text-sm text-gray-600">Available Monday - Friday, 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <div className="bg-blue-500 rounded-full p-3 mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">Email Support</h3>
                      <p className="text-gray-700 mb-2">
                        <strong>Customer Support:</strong> support@bizbridge.com<br />
                        <strong>Artisan Support:</strong> artisans@bizbridge.com<br />
                        <strong>Business Inquiries:</strong> info@bizbridge.com
                      </p>
                      <p className="text-sm text-gray-600">We respond within 24 hours</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <div className="bg-green-500 rounded-full p-3 mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-green-700">Our Office</h3>
                      <p className="text-gray-700 mb-2">
                        BizBridge Headquarters<br />
                        123 Innovation Drive<br />
                        Victoria Island, Lagos<br />
                        Nigeria
                      </p>
                      <p className="text-sm text-gray-600">Visit us during business hours</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <div className="bg-purple-500 rounded-full p-3 mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-purple-700">Business Hours</h3>
                      <p className="text-gray-700">
                        <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM<br />
                        <strong>Saturday:</strong> 10:00 AM - 2:00 PM<br />
                        <strong>Sunday:</strong> Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              
              {submitSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                  <div className="bg-green-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Message Sent Successfully!</h3>
                  <p className="text-green-700 mb-4">
                    Thank you for contacting us. We will get back to you as soon as possible.
                  </p>
                  <button 
                    onClick={() => setSubmitSuccess(false)}
                    className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Enter your email address"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">I am a...</label>
                    <select
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="customer">Customer</option>
                      <option value="artisan">Artisan/Service Provider</option>
                      <option value="business">Business Partnership</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="What is your message about?"
                    />
                    {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Please provide details about your inquiry..."
                    ></textarea>
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                  </div>
                  
                  <button
                    type="submit"
                    className={`w-full bg-red-500 text-white py-3 px-6 rounded-md hover:bg-red-600 transition font-medium ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </div>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-16 bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-2">How do I book a service?</h3>
                <p className="text-gray-600 text-sm mb-4">Simply browse our services, select an artisan, and click "Book Now" to send a booking request.</p>
                
                <h3 className="font-semibold mb-2">How do I become an artisan?</h3>
                <p className="text-gray-600 text-sm mb-4">Click "Become an Artisan" in the header and create your profile with your skills and services.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Is my payment secure?</h3>
                <p className="text-gray-600 text-sm mb-4">Yes, we use industry-standard encryption to protect all payment information.</p>
                
                <h3 className="font-semibold mb-2">What if I need to cancel a booking?</h3>
                <p className="text-gray-600 text-sm mb-4">You can cancel bookings through your dashboard. Cancellation policies vary by artisan.</p>
              </div>
            </div>
            <div className="text-center mt-6">
              <span 
                onClick={() => navigate('/faq')}
                className="text-red-500 hover:text-red-600 cursor-pointer font-medium"
              >
                View More FAQs →
              </span>
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

export default ContactUs;