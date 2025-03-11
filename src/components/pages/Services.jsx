import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AddService = () => {
  const navigate = useNavigate();
  const { userType, logout } = useAuth();
  
  const [serviceData, setServiceData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    location: '',
    imageUrl: null,
    isActive: true
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Ensure only artisans can access this page
  useEffect(() => {
    if (userType !== 'artisan') {
      navigate('/dashboard');
    }
  }, [userType, navigate]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setServiceData({
        ...serviceData,
        imageUrl: files[0]
      });
    } else {
      setServiceData({
        ...serviceData,
        [name]: value
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!serviceData.title) newErrors.title = 'Service title is required';
    if (!serviceData.description) newErrors.description = 'Description is required';
    if (!serviceData.category) newErrors.category = 'Category is required';
    if (!serviceData.price) newErrors.price = 'Price is required';
    if (!serviceData.location) newErrors.location = 'Location is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Simulate service creation API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, you would upload the image and send data to backend
        const newService = {
          ...serviceData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString()
        };
        
        // Here you would typically call an API to create the service
        console.log('New Service Created:', newService);
        
        setSubmitSuccess(true);
        
        // Redirect to services page after 2 seconds
        setTimeout(() => {
          navigate('/services');
        }, 2000);
      } catch (error) {
        console.error('Service creation error:', error);
        setSubmitError('Failed to create service. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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
            <span onClick={() => navigate('/dashboard')} className="hover:text-red-400 cursor-pointer">Dashboard</span>
            <span onClick={handleLogout} className="hover:text-red-400 cursor-pointer">Logout</span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="bg-white flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Add New Service</h1>

          {submitSuccess ? (
            <div className="text-center py-8 bg-green-50 rounded-lg">
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <h2 className="text-2xl font-bold mb-4">Service Created Successfully!</h2>
              <p>Redirecting to your services page...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 border rounded-lg shadow-sm">
              {submitError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {submitError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Service Title</label>
                  <input
                    type="text"
                    name="title"
                    value={serviceData.title}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="e.g., Custom Wooden Furniture"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Category</label>
                  <select
                    name="category"
                    value={serviceData.category}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select Category</option>
                    <option value="Woodworking">Woodworking</option>
                    <option value="Pottery">Pottery</option>
                    <option value="Textiles">Textiles</option>
                    <option value="Jewelry">Jewelry Making</option>
                    <option value="Leathercraft">Leathercraft</option>
                  </select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={serviceData.description}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows="4"
                  placeholder="Describe your service in detail"
                ></textarea>
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-gray-700 mb-2">Price Range</label>
                  <input
                    type="text"
                    name="price"
                    value={serviceData.price}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="e.g., From ₦50,000"
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Location</label>
                  <select
                    name="location"
                    value={serviceData.location}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select Location</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Abuja">Abuja</option>
                    <option value="Port Harcourt">Port Harcourt</option>
                    <option value="Ibadan">Ibadan</option>
                    <option value="Kano">Kano</option>
                  </select>
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-gray-700 mb-2">Service Image</label>
                <div className="flex items-center">
                  <label 
                    htmlFor="serviceImage" 
                    className="bg-red-400 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-500"
                  >
                    Choose Image
                  </label>
                  <input
                    type="file"
                    id="serviceImage"
                    name="imageUrl"
                    onChange={handleChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <span className="ml-4">
                    {serviceData.imageUrl 
                      ? serviceData.imageUrl.name 
                      : 'No file chosen'}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={serviceData.isActive}
                  onChange={(e) => setServiceData({...serviceData, isActive: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-gray-700">
                  Make this service active and visible to customers
                </label>
              </div>

              <div className="mt-6 flex justify-between">
                <button 
                  type="button"
                  onClick={() => navigate('/services')}
                  className="bg-gray-200 text-gray-800 py-2 px-6 rounded hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Service'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} BizBridge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AddService;