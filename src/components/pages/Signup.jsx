import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const Signup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();
  
  // Check if artisan signup was requested via URL parameter
  const [userType, setUserType] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('type') === 'artisan' ? 'artisan' : 'customer';
  });
  
  const [formData, setFormData] = useState({
    // Customer signup fields
    customerEmail: '',
    customerUsername: '',
    customerPassword: '',
    customerConfirmPassword: '',
    
    // Artisan signup fields
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    businessName: '',
    isCAC: '',
    staffStrength: '',
    yearEstablished: '',
    contactAddress: '',
    city: '',
    websiteURL: '',
    username: '',
    password: '',
    confirmPassword: '',
    cacDocument: null
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  // Update user type based on URL parameters when location changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    if (type === 'artisan') {
      setUserType('artisan');
    } else if (type === 'customer') {
      setUserType('customer');
    }
  }, [location]);
  
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const validateForm = (type) => {
    const newErrors = {};
    
    if (type === 'customer') {
      if (!formData.customerEmail) newErrors.customerEmail = 'Email is required';
      if (!formData.customerUsername) newErrors.customerUsername = 'Username is required';
      if (!formData.customerPassword) newErrors.customerPassword = 'Password is required';
      if (formData.customerPassword && formData.customerPassword.length < 6) {
        newErrors.customerPassword = 'Password must be at least 6 characters';
      }
      if (formData.customerPassword !== formData.customerConfirmPassword) {
        newErrors.customerConfirmPassword = 'Passwords do not match';
      }
    } 
    
    else if (type === 'artisan') {
      if (!formData.contactName) newErrors.contactName = 'Contact name is required';
      if (!formData.contactPhone) newErrors.contactPhone = 'Phone number is required';
      if (!formData.contactEmail) newErrors.contactEmail = 'Email is required';
      if (!formData.businessName) newErrors.businessName = 'Business name is required';
      if (!formData.password) newErrors.password = 'Password is required';
      if (formData.password && formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
// Updated handleSubmit function to store user type with registration data
const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitError('');
  
  if (validateForm(userType)) {
    setIsSubmitting(true);
    
    try {
      if (userType === 'customer') {
        // Store user registration info in localStorage
        const userData = {
          email: formData.customerEmail,
          username: formData.customerUsername,
          type: 'customer',
          id: Math.random().toString(36).substr(2, 9)
        };
        
        // Store user in registeredUsers array
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        registeredUsers.push(userData);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        
        // Mock customer signup API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const success = signup(userData, 'customer');
        
        if (success) {
          setSubmitSuccess(true);
          navigate('/dashboard');
        }
      } 
      else if (userType === 'artisan') {
        // Store artisan registration info in localStorage
        const userData = {
          email: formData.contactEmail,
          contactName: formData.contactName,
          businessName: formData.businessName,
          type: 'artisan',
          phone: formData.contactPhone,
          id: Math.random().toString(36).substr(2, 9)
        };
        
        // Store user in registeredUsers array
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        registeredUsers.push(userData);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        
        // Mock artisan signup API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const success = signup(userData, 'artisan');
        
        if (success) {
          setSubmitSuccess(true);
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setSubmitError('Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }
};
  
  const toggleUserType = () => {
    setUserType(userType === 'customer' ? 'artisan' : 'customer');
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span onClick={() => navigate('/')} className="text-red-500 text-5xl select-none font-bold cursor-pointer">𐐒</span>
            <span onClick={() => navigate('/')} className="text-white text-4xl select-none font-bold cursor-pointer">B</span>
            <span onClick={() => navigate('/')} className="text-red-500 text-2xl select-none cursor-pointer font-semibold ml-5">BizBridge</span>
          </div>
          <nav className="flex space-x-8">
            <span onClick={() => navigate('/')} className="hover:text-red-400 cursor-pointer">Home</span>
            <span onClick={() => navigate('/login')} className="hover:text-red-400 cursor-pointer">Login</span>
            <span onClick={() => navigate('/signup')} className="text-red-400 cursor-pointer">Sign Up</span>
            <span onClick={() => navigate('/signup?type=artisan')} className="hover:text-red-400 cursor-pointer">Get Your Service Listed</span>
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="bg-white flex-grow py-12">
        <div className="container mx-auto border-y border-orange-500 py-8 px-4 mb-8">
          <h1 className="text-4xl font-bold text-center mb-8">
            {userType === 'customer' 
              ? 'Sign Up to Find Quality Services' 
              : 'Register Your Services on BizBridge'}
          </h1>
        </div>
        
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-md shadow-md">
          {submitSuccess ? (
            <div className="text-center py-8">
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <h2 className="text-2xl font-bold mb-4">Success!</h2>
              <p className="mb-6">Your account has been created successfully.</p>
              <p>Redirecting to dashboard...</p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex justify-between">
                <h2 className="text-2xl font-bold">
                  {userType === 'customer' ? 'Customer Registration' : 'Artisan Registration'}
                </h2>
                <button 
                  onClick={toggleUserType}
                  className="text-red-500 hover:underline"
                >
                  Switch to {userType === 'customer' ? 'Artisan' : 'Customer'} Signup
                </button>
              </div>
              
              {submitError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {submitError}
                </div>
              )}
              
              {/* Customer Signup Form */}
              {userType === 'customer' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Enter your email"
                    />
                    {errors.customerEmail && <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      name="customerUsername"
                      value={formData.customerUsername}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Choose a username"
                    />
                    {errors.customerUsername && <p className="text-red-500 text-sm mt-1">{errors.customerUsername}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      name="customerPassword"
                      value={formData.customerPassword}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Choose a password (min 6 characters)"
                    />
                    {errors.customerPassword && <p className="text-red-500 text-sm mt-1">{errors.customerPassword}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      name="customerConfirmPassword"
                      value={formData.customerConfirmPassword}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Confirm your password"
                    />
                    {errors.customerConfirmPassword && <p className="text-red-500 text-sm mt-1">{errors.customerConfirmPassword}</p>}
                  </div>
                  <button
                    type="submit"
                    className={`w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Signing up...' : 'Sign Up'}
                  </button>
                  
                  <div className="text-center mt-6">
                    <p className="text-gray-600">
                      Already have an account?{' '}
                      <Link to="/login" className="text-red-500 hover:underline">
                        Login here
                      </Link>
                    </p>
                  </div>
                </form>
              )}
              
              {/* Artisan Signup Form */}
              {userType === 'artisan' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-xl font-bold mb-4 text-center">Artisan Registration Form</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 mb-2">Contact Name</label>
                        <input
                          type="text"
                          name="contactName"
                          value={formData.contactName}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                        {errors.contactName && <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-2">Contact Email</label>
                        <input
                          type="email"
                          name="contactEmail"
                          value={formData.contactEmail}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                        {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
                      </div>
                      
                      <div className="flex flex-col">
                        <label className="block text-gray-700 mb-2">Are you registered with CAC?</label>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="cacYes"
                              name="isCAC"
                              value="Yes"
                              checked={formData.isCAC === "Yes"}
                              onChange={handleChange}
                              className="mr-2"
                            />
                            <label htmlFor="cacYes">Yes</label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="cacNo"
                              name="isCAC"
                              value="No"
                              checked={formData.isCAC === "No"}
                              onChange={handleChange}
                              className="mr-2"
                            />
                            <label htmlFor="cacNo">No</label>
                          </div>
                          
                          {/* File upload button next to CAC question */}
                          {formData.isCAC === "Yes" && (
                            <div className="flex items-center">
                              <label 
                                htmlFor="cacFile" 
                                className="bg-red-400 text-white px-3 py-1 rounded cursor-pointer hover:bg-red-500 text-sm"
                              >
                                Choose File
                              </label>
                              <input
                                type="file"
                                id="cacFile"
                                name="cacDocument"
                                onChange={handleChange}
                                className="hidden"
                              />
                              <span className="ml-2 text-sm">
                                {formData.cacDocument ? formData.cacDocument.name : "No file chosen"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-2">Contact Address</label>
                        <input
                          type="text"
                          name="contactAddress"
                          value={formData.contactAddress}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-2">Website URL</label>
                        <input
                          type="url"
                          name="websiteURL"
                          value={formData.websiteURL}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                      </div>
                    </div>
                    
                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 mb-2">Contact Phone Number</label>
                        <input
                          type="tel"
                          name="contactPhone"
                          value={formData.contactPhone}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                        {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-2">Business Name</label>
                        <input
                          type="text"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                        {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 mb-2">Year Established</label>
                          <select
                            name="yearEstablished"
                            value={formData.yearEstablished}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                          >
                            <option value="">--Select Year--</option>
                            {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 mb-2">Staff Strength</label>
                          <select
                            name="staffStrength"
                            value={formData.staffStrength}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                          >
                            <option value="">--Select--</option>
                            <option value="1-10">1-10</option>
                            <option value="11-50">11-50</option>
                            <option value="51-200">51-200</option>
                            <option value="201+">201+</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-2">Preferred Username</label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-2">Confirm Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center pt-4">
                    <button
                      type="submit"
                      className={`bg-red-500 text-white py-2 px-8 rounded hover:bg-red-600 transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Register as Artisan'}
                    </button>
                  </div>
                  
                  <div className="text-center mt-4">
                    <p className="text-sm">
                      Already listed your service? <Link to="/login" className="text-red-500 hover:underline cursor-pointer">Log in</Link>
                    </p>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-4">Connect with us!</h3>
            <div className="flex justify-center space-x-4">
              <a href="#" className="bg-red-400 hover:bg-red-500 rounded-full p-3 flex items-center justify-center w-10 h-10">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z"/>
                  <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z"/>
                </svg>
              </a>
              <a href="#" className="bg-red-400 hover:bg-red-500 rounded-full p-3 flex items-center justify-center w-10 h-10">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="bg-red-400 hover:bg-red-500 rounded-full p-3 flex items-center justify-center w-10 h-10">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="bg-red-400 hover:bg-red-500 rounded-full p-3 flex items-center justify-center w-10 h-10">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} BizBridge. All rights reserved.</p>
            <div className="mt-2">
              <a href="#" className="text-red-400 hover:text-red-500 mx-2">Terms of Service</a>
              <a href="#" className="text-red-400 hover:text-red-500 mx-2">Privacy Policy</a>
              <a href="#" className="text-red-400 hover:text-red-500 mx-2">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Signup;