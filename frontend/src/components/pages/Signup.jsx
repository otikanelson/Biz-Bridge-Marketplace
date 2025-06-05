// frontend/src/pages/Signup.jsx - Fix the function calls
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Lagos LGAs for location dropdown
const LAGOS_LGAS = [
  { id: 1, name: 'Agege', region: 'Mainland' },
  { id: 2, name: 'Ajeromi-Ifelodun', region: 'Mainland' },
  { id: 3, name: 'Alimosho', region: 'Mainland' },
  { id: 4, name: 'Amuwo-Odofin', region: 'Mainland' },
  { id: 5, name: 'Apapa', region: 'Mainland' },
  { id: 6, name: 'Badagry', region: 'Mainland' },
  { id: 7, name: 'Epe', region: 'Mainland' },
  { id: 8, name: 'Eti-Osa', region: 'Island' },
  { id: 9, name: 'Ibeju-Lekki', region: 'Island' },
  { id: 10, name: 'Ifako-Ijaiye', region: 'Mainland' },
  { id: 11, name: 'Ikeja', region: 'Mainland' },
  { id: 12, name: 'Ikorodu', region: 'Mainland' },
  { id: 13, name: 'Kosofe', region: 'Mainland' },
  { id: 14, name: 'Lagos Island', region: 'Island' },
  { id: 15, name: 'Lagos Mainland', region: 'Mainland' },
  { id: 16, name: 'Mushin', region: 'Mainland' },
  { id: 17, name: 'Ojo', region: 'Mainland' },
  { id: 18, name: 'Oshodi-Isolo', region: 'Mainland' },
  { id: 19, name: 'Shomolu', region: 'Mainland' },
  { id: 20, name: 'Surulere', region: 'Mainland' }
];

const Signup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // ✅ Fixed: Use the correct function names from AuthContext
  const { isAuthenticated, registerNewCustomer, registerNewArtisan, authError, loading } = useAuth();
  
  // Determine signup type from URL params
  const [userType, setUserType] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('type') === 'artisan' ? 'artisan' : 'customer';
  });
  
  // Customer form data
  const [customerForm, setCustomerForm] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    profileImage: null
  });
  
  // Artisan form data
  const [artisanForm, setArtisanForm] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    contactName: '',
    contactPhone: '',
    businessName: '',
    yearEstablished: '',
    staffStrength: '',
    isCAC: 'No',
    contactAddress: '',
    city: '',
    lga: '',
    websiteURL: '',
    profileImage: null,
    cacDocument: null
  });
  
  // UI state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);
  
  // Update user type based on URL params when location changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    if (type === 'artisan') {
      setUserType('artisan');
    } else if (type === 'customer') {
      setUserType('customer');
    }
  }, [location]);
  
  // Handle customer form changes
  const handleCustomerChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setCustomerForm({
        ...customerForm,
        [name]: files[0]
      });
    } else {
      setCustomerForm({
        ...customerForm,
        [name]: value
      });
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Handle artisan form changes
  const handleArtisanChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    
    if (type === 'file') {
      setArtisanForm({
        ...artisanForm,
        [name]: files[0]
      });
    } else if (type === 'checkbox') {
      setArtisanForm({
        ...artisanForm,
        [name]: checked
      });
    } else if (type === 'radio') {
      setArtisanForm({
        ...artisanForm,
        [name]: value
      });
    } else {
      setArtisanForm({
        ...artisanForm,
        [name]: value
      });
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Validate customer form
  const validateCustomerForm = () => {
    const newErrors = {};
    
    if (!customerForm.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerForm.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    if (!customerForm.username) {
      newErrors.username = 'Username is required';
    }
    
    if (!customerForm.password) {
      newErrors.password = 'Password is required';
    } else if (customerForm.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (customerForm.password !== customerForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!customerForm.fullName) {
      newErrors.fullName = 'Full name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Validate artisan form
  const validateArtisanForm = () => {
    const newErrors = {};
    
    if (!artisanForm.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(artisanForm.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    if (!artisanForm.username) {
      newErrors.username = 'Username is required';
    }
    
    if (!artisanForm.password) {
      newErrors.password = 'Password is required';
    } else if (artisanForm.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (artisanForm.password !== artisanForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!artisanForm.contactName) {
      newErrors.contactName = 'Contact name is required';
    }
    
    if (!artisanForm.contactPhone) {
      newErrors.contactPhone = 'Phone number is required';
    }
    
    if (!artisanForm.businessName) {
      newErrors.businessName = 'Business name is required';
    }
    
    if (!artisanForm.lga) {
      newErrors.lga = 'Please select your LGA';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    
    if (validateCustomerForm()) {
      setIsSubmitting(true);
      
      try {
        console.log('Submitting customer registration...');
        
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('email', customerForm.email);
        formData.append('username', customerForm.username);
        formData.append('password', customerForm.password);
        formData.append('fullName', customerForm.fullName);
        
        if (customerForm.profileImage) {
          formData.append('profileImage', customerForm.profileImage);
        }
        
        const result = await registerNewCustomer(formData);
        
        if (result.success) {
          setSubmitSuccess(true);
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        }
      } catch (error) {
        console.error('Customer registration error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const handleArtisanSubmit = async (e) => {
    e.preventDefault();
    
    if (validateArtisanForm()) {
      setIsSubmitting(true);
      
      try {
        console.log('Submitting artisan registration...');
        
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('email', artisanForm.email);
        formData.append('username', artisanForm.username);
        formData.append('password', artisanForm.password);
        formData.append('contactName', artisanForm.contactName);
        formData.append('contactPhone', artisanForm.contactPhone);
        formData.append('businessName', artisanForm.businessName);
        formData.append('yearEstablished', artisanForm.yearEstablished);
        formData.append('staffStrength', artisanForm.staffStrength);
        formData.append('isCAC', artisanForm.isCAC);
        formData.append('contactAddress', artisanForm.contactAddress);
        formData.append('city', artisanForm.city);
        formData.append('lga', artisanForm.lga);
        formData.append('websiteURL', artisanForm.websiteURL);
        
        if (artisanForm.profileImage) {
          formData.append('profileImage', artisanForm.profileImage);
        }
        
        if (artisanForm.cacDocument) {
          formData.append('cacDocument', artisanForm.cacDocument);
        }
        
        const result = await registerNewArtisan(formData);
        
        if (result.success) {
          setSubmitSuccess(true);
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        }
      } catch (error) {
        console.error('Artisan registration error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  // Toggle between customer and artisan signup
  const toggleUserType = () => {
    setUserType(userType === 'customer' ? 'artisan' : 'customer');
    setErrors({});
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
            <span onClick={() => navigate('/signup')} className="text-red-400 cursor-pointer">Register</span>
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
                <button 
                  onClick={toggleUserType}
                  className="text-red-500 hover:underline focus:outline-none"
                >
                  Switch to {userType === 'customer' ? 'Artisan' : 'Customer'} Signup
                </button>
              </div>
              
              {/* Authentication Error */}
              {authError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {authError}
                </div>
              )}
              
              {/* Customer Signup Form */}
              {userType === 'customer' && (
                <form onSubmit={handleCustomerSubmit} className="space-y-4">
                  <div className="bg-gradient-to-r from-red-50 to-white p-6 rounded-lg mb-6">
                    <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Customer Registration</h2>
                    <p className="text-center text-gray-600 mb-4">Welcome to our community where you can find skilled artisans to assist you in various tasks</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Full Name*</label>
                    <input
                      type="text"
                      name="fullName"
                      value={customerForm.fullName}
                      onChange={handleCustomerChange}
                      className={`w-full p-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded`}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Email Address*</label>
                    <input
                      type="email"
                      name="email"
                      value={customerForm.email}
                      onChange={handleCustomerChange}
                      className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded`}
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Username*</label>
                    <input
                      type="text"
                      name="username"
                      value={customerForm.username}
                      onChange={handleCustomerChange}
                      className={`w-full p-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded`}
                      placeholder="Choose a username"
                    />
                    {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Password*</label>
                    <input
                      type="password"
                      name="password"
                      value={customerForm.password}
                      onChange={handleCustomerChange}
                      className={`w-full p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded`}
                      placeholder="Choose a password (min 6 characters)"
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Confirm Password*</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={customerForm.confirmPassword}
                      onChange={handleCustomerChange}
                      className={`w-full p-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded`}
                      placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Profile Image</label>
                    <input
                      type="file"
                      name="profileImage"
                      onChange={handleCustomerChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      accept="image/*"
                    />
                    <p className="text-gray-500 text-sm mt-1">Optional: Upload a profile image</p>
                  </div>
                  
                  <button
                    type="submit"
                    className={`w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition ${isSubmitting || loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={isSubmitting || loading}
                  >
                    {isSubmitting || loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing up...
                      </div>
                    ) : (
                      'Sign Up'
                    )}
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
              
              {/* Artisan Signup Form - Similar structure but with artisan fields */}
              {userType === 'artisan' && (
                <form onSubmit={handleArtisanSubmit} className="space-y-6">
                  {/* Artisan form content similar to your existing form but with proper validation */}
                  <div className="bg-gradient-to-r from-red-50 to-white p-6 rounded-lg mb-6">
                    <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Artisan Registration</h2>
                    <p className="text-center text-gray-600 mb-4">Join our community of skilled artisans and grow your business</p>
                  </div>
                  
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Contact Name*</label>
                      <input
                        type="text"
                        name="contactName"
                        value={artisanForm.contactName}
                        onChange={handleArtisanChange}
                        className={`w-full p-2 border ${errors.contactName ? 'border-red-500' : 'border-gray-300'} rounded`}
                        placeholder="Your full name"
                      />
                      {errors.contactName && <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Business Name*</label>
                      <input
                        type="text"
                        name="businessName"
                        value={artisanForm.businessName}
                        onChange={handleArtisanChange}
                        className={`w-full p-2 border ${errors.businessName ? 'border-red-500' : 'border-gray-300'} rounded`}
                        placeholder="Your business name"
                      />
                      {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Email Address*</label>
                      <input
                        type="email"
                        name="email"
                        value={artisanForm.email}
                        onChange={handleArtisanChange}
                        className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Username*</label>
                      <input
                        type="text"
                        name="username"
                        value={artisanForm.username}
                        onChange={handleArtisanChange}
                        className={`w-full p-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded`}
                        placeholder="Choose a username"
                      />
                      {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Password*</label>
                      <input
                        type="password"
                        name="password"
                        value={artisanForm.password}
                        onChange={handleArtisanChange}
                        className={`w-full p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded`}
                        placeholder="Create a secure password"
                      />
                      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Confirm Password*</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={artisanForm.confirmPassword}
                        onChange={handleArtisanChange}
                        className={`w-full p-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded`}
                        placeholder="Confirm your password"
                      />
                      {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>

                                      <div>
                    <label className="block text-gray-700 mb-2">Profile Image</label>
                    <input
                      type="file"
                      name="profileImage"
                      onChange={handleCustomerChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      accept="image/*"
                    />
                    <p className="text-gray-500 text-sm mt-1">Optional: Upload a profile image</p>
                  </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Phone Number*</label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={artisanForm.contactPhone}
                        onChange={handleArtisanChange}
                        className={`w-full p-2 border ${errors.contactPhone ? 'border-red-500' : 'border-gray-300'} rounded`}
                        placeholder="+234 800 XXX XXXX"
                      />
                      {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Local Government Area*</label>
                      <select
                        name="lga"
                        value={artisanForm.lga}
                        onChange={handleArtisanChange}
                        className={`w-full p-2 border ${errors.lga ? 'border-red-500' : 'border-gray-300'} rounded`}
                      >
                        <option value="">-- Select LGA --</option>
                        {LAGOS_LGAS.map(lga => (
                          <option key={lga.id} value={lga.name}>{lga.name}</option>
                        ))}
                      </select>
                      {errors.lga && <p className="text-red-500 text-sm mt-1">{errors.lga}</p>}
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className={`w-full bg-red-500 text-white py-3 px-6 rounded hover:bg-red-600 transition ${isSubmitting || loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={isSubmitting || loading}
                  >
                    {isSubmitting || loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating your account...
                      </div>
                    ) : (
                      'Register as Artisan'
                    )}
                  </button>
                  
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                      Already have an account? <Link to="/login" className="text-red-500 hover:underline">Log in</Link>
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
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} BizBridge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Signup;