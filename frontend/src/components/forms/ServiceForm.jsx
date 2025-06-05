import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ServiceForm = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams(); // For edit mode
  const { userType } = useAuth();
  const isEditMode = !!serviceId;
  
  // Form data state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    duration: '',
    location: '',
    isActive: true,
    serviceImage: null
  });
  
  // UI state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  // Ensure only artisans can access this page
  useEffect(() => {
    if (userType !== 'artisan') {
      navigate('/unauthorized');
      return;
    }
    
    // If in edit mode, fetch the service data
    if (isEditMode) {
      const fetchService = async () => {
        try {
          // In a real app, you would fetch from API
          // For now, simulate API call with timeout
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Mock service data (in a real app, fetch this from API)
          const mockService = {
            id: 's1',
            title: 'Custom Wooden Furniture',
            description: 'Handcrafted wooden furniture made to your specifications. Each piece is carefully crafted using traditional techniques and high-quality materials.',
            category: 'Woodworking',
            price: 'From ₦50,000',
            duration: '2-4 weeks',
            location: 'Lagos',
            serviceImage: '../src/assets/abstractArt.jpg',
            isActive: true
          };
          
          setFormData(mockService);
          setImagePreview(mockService.serviceImage);
        } catch (error) {
          console.error('Error fetching service:', error);
          setSubmitError('Could not load service data. Please try again.');
        }
      };
      
      fetchService();
    }
  }, [isEditMode, serviceId, userType, navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      if (files && files[0]) {
        setFormData({
          ...formData,
          [name]: files[0]
        });
        
        // Create image preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(files[0]);
      }
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title) newErrors.title = 'Service title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.location) newErrors.location = 'Location is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // In a real app, you would send formData to your API
        // For example:
        // if (isEditMode) {
        //   await updateService(serviceId, formData);
        // } else {
        //   await createService(formData);
        // }
        
        setSubmitSuccess(true);
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/services');
        }, 2000);
      } catch (error) {
        console.error('Service submission error:', error);
        setSubmitError('Failed to save service. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Cancel form and return to services page
  const handleCancel = () => {
    navigate('/services');
  };

  // Categories for dropdown
  const serviceCategories = [
    'Woodworking',
    'Pottery',
    'Textiles',
    'Jewelry Making',
    'Leathercraft',
    'Metalwork',
    'Carpentry',
    'Plumbing',
    'Electrical Work',
    'Painting',
    'Tailoring',
    'Interior Design',
    'Catering',
    'Beauty Services',
    'Other'
  ];

  // Locations for dropdown
  const locations = [
    'Lagos',
    'Abuja',
    'Port Harcourt',
    'Ibadan',
    'Kano',
    'Enugu',
    'Calabar',
    'Owerri',
    'Warri',
    'Kaduna',
    'Other'
  ];

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
            <span onClick={() => navigate('/services')} className="hover:text-red-400 cursor-pointer">My Services</span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="bg-white flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <button 
              onClick={() => navigate('/services')}
              className="text-gray-600 hover:text-gray-900 mr-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold">{isEditMode ? 'Edit Service' : 'Add New Service'}</h1>
          </div>

          {submitSuccess ? (
            <div className="max-w-2xl mx-auto text-center py-8 bg-green-50 rounded-lg">
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <h2 className="text-2xl font-bold mb-4">Service {isEditMode ? 'Updated' : 'Created'} Successfully!</h2>
              <p>Redirecting to your services page...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 border rounded-lg shadow-sm">
              {submitError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {submitError}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">Service Image</label>
                <div className="flex items-center space-x-4">
                  <div className="w-32 h-32 border-2 border-gray-300 rounded-lg overflow-hidden">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Service preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label 
                      htmlFor="serviceImage" 
                      className="block bg-red-500 text-white text-center py-2 px-4 rounded cursor-pointer hover:bg-red-600 transition"
                    >
                      {imagePreview ? 'Change Image' : 'Upload Image'}
                    </label>
                    <input
                      type="file"
                      id="serviceImage"
                      name="serviceImage"
                      onChange={handleChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <p className="text-sm text-gray-500 mt-2">Recommended size: 800x600 pixels</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">Service Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full p-3 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  placeholder="e.g., Custom Wooden Furniture"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">Description*</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full p-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  rows="4"
                  placeholder="Describe your service in detail"
                ></textarea>
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                <p className="text-sm text-gray-500 mt-1">{formData.description.length}/500 characters</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Category*</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full p-3 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  >
                    <option value="">Select Category</option>
                    {serviceCategories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Location*</label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full p-3 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  >
                    <option value="">Select Location</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Price Range</label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="e.g., From ₦50,000"
                  />
                  <p className="text-sm text-gray-500 mt-1">Enter a starting price or range</p>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="e.g., 2-3 days, 1 week"
                  />
                  <p className="text-sm text-gray-500 mt-1">Typical time to complete this service</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label htmlFor="isActive" className="ml-2 text-gray-700">
                    Make this service active and visible to customers
                  </label>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button 
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-200 text-gray-800 py-2 px-6 rounded hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </span>
                  ) : (
                    isEditMode ? 'Update Service' : 'Create Service'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Service Form Tips */}
          {!submitSuccess && (
            <div className="max-w-2xl mx-auto mt-8 bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Tips for a Great Service Listing</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>Clear title:</strong> Use a descriptive title that clearly communicates what you offer.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>Detailed description:</strong> Include information about materials, process, customization options, and what makes your service unique.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>High-quality image:</strong> Upload a clear, well-lit photo of your work that showcases the quality of your service.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>Realistic timeframes:</strong> Set accurate expectations for how long your service takes to complete.</span>
                </li>
              </ul>
            </div>
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

export default ServiceForm;