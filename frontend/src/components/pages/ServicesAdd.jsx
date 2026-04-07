// src/pages/ServicesAdd.jsx - Fixed with Proper Component Integration & Consistent UI
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createService, updateService, getServiceById } from '../../api/services';
import ImageUpload from '../common/ImageUpload';
import JobSelection from '../pages/JobSelection';
import LocationSelection from '../pages/LocationSelection';

// Default categories for categorized pricing
const DEFAULT_CATEGORIES = {
  'Woodworking': [
    { name: 'Furniture Making', price: 50000, duration: '2-3 weeks', description: 'Custom furniture pieces' },
    { name: 'Wood Carving', price: 25000, duration: '1-2 weeks', description: 'Decorative wood carvings' },
    { name: 'Cabinetry', price: 75000, duration: '3-4 weeks', description: 'Custom cabinets and storage' }
  ],
  'Metalwork': [
    { name: 'Welding Services', price: 30000, duration: '1-2 weeks', description: 'Metal welding and repair' },
    { name: 'Metalworking', price: 40000, duration: '2-3 weeks', description: 'Custom metal fabrication' },
    { name: 'Steel Work', price: 60000, duration: '3-4 weeks', description: 'Structural steel work' }
  ],
  'Textile Art': [
    { name: 'Custom Clothing', price: 15000, duration: '1 week', description: 'Tailored clothing pieces' },
    { name: 'Fabric Design', price: 20000, duration: '1-2 weeks', description: 'Custom fabric patterns' },
    { name: 'Embroidery', price: 10000, duration: '3-5 days', description: 'Hand embroidered items' }
  ]
};

// Pricing Type Component
const PricingTypeSelector = ({ selectedType, onTypeChange, supportsCategorized, selectedCategory }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Choose Your Pricing Method</h3>
      <p className="text-sm text-gray-600">How would you like to price this {selectedCategory} service?</p>
      
      {/* Fixed Pricing */}
      <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
        <input
          type="radio"
          name="pricingType"
          value="fixed"
          checked={selectedType === 'fixed'}
          onChange={(e) => onTypeChange(e.target.value)}
          className="mt-1 text-red-500 focus:ring-red-500"
        />
        <div className="ml-3">
          <div className="text-sm font-medium text-gray-900">Fixed Price</div>
          <div className="text-sm text-gray-600">Set one price for the entire service. Best for standardized services.</div>
        </div>
      </label>

      {/* Negotiable Pricing */}
      <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
        <input
          type="radio"
          name="pricingType"
          value="negotiate"
          checked={selectedType === 'negotiate'}
          onChange={(e) => onTypeChange(e.target.value)}
          className="mt-1 text-red-500 focus:ring-red-500"
        />
        <div className="ml-3">
          <div className="text-sm font-medium text-gray-900">Contact for Pricing</div>
          <div className="text-sm text-gray-600">Customers contact you for custom quotes. Good for complex or variable projects.</div>
        </div>
      </label>

      {/* Categorized Pricing - Only for supported categories */}
      {supportsCategorized && (
        <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            name="pricingType"
            value="categorized"
            checked={selectedType === 'categorized'}
            onChange={(e) => onTypeChange(e.target.value)}
            className="mt-1 text-red-500 focus:ring-red-500"
          />
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">Category-Based Pricing</div>
            <div className="text-sm text-gray-600">Set different prices for different types of {selectedCategory.toLowerCase()} work.</div>
          </div>
        </label>
      )}
    </div>
  );
};

// Category Breakdown Component
const CategoryBreakdown = ({ categories, onCategoryChange, selectedCategory }) => {
  const defaultCategories = DEFAULT_CATEGORIES[selectedCategory] || [];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Set Category Prices</h3>
      <p className="text-sm text-gray-600">Define pricing for different types of {selectedCategory.toLowerCase()} services:</p>
      
      <div className="space-y-4">
        {defaultCategories.map((category, index) => {
          const currentData = categories.find(c => c.name === category.name) || category;
          
          return (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{category.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{category.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
                  <input
                    type="number"
                    min="0"
                    value={currentData.price || ''}
                    onChange={(e) => onCategoryChange(index, 'price', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter price"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={currentData.duration || ''}
                    onChange={(e) => onCategoryChange(index, 'duration', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 1-2 weeks"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ServicesAdd = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Service form state
  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    pricingType: 'fixed',
    pricing: {
      type: 'fixed',
      basePrice: '',
      baseDuration: '',
      categories: []
    },
    isActive: true,
    serviceImage: null
  });

  // Load service data for editing
  useEffect(() => {
    if (isEditMode) {
      loadServiceData();
    }
  }, [id, isEditMode]);

  const loadServiceData = async () => {
    try {
      const service = await getServiceById(id);
      if (service) {
        // Extract pricing data
        const pricingType = service.pricing?.type || service.pricingType || 'fixed';
        const pricing = service.pricing || {
          type: pricingType,
          basePrice: service.basePrice || '',
          baseDuration: service.baseDuration || '',
          categories: service.categories || []
        };

        setServiceForm({
          title: service.title || '',
          description: service.description || '',
          pricingType: pricingType,
          pricing: pricing,
          isActive: service.isActive !== undefined ? service.isActive : true,
          serviceImage: null
        });
        
        // Set other form data
        if (service.category) {
          setSelectedJobs([{ name: service.category, id: service.category }]);
        }
        if (service.locations) {
          setSelectedLocations(service.locations);
        }
      }
    } catch (error) {
      console.error('Error fetching service data:', error);
      setSubmitError('Failed to load service data');
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setServiceForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Handle job selection (from JobSelection component)
  const handleJobSelect = (job) => {
    setSelectedJobs([job]); // Only allow one job selection
    
    // If switching category and currently on categorized pricing, check if new category supports it
    if (serviceForm.pricingType === 'categorized') {
      const newCategorySupportsIt = ['Woodworking', 'Metalwork', 'Textile Art'].includes(job.name);
      if (!newCategorySupportsIt) {
        // Reset to fixed pricing if new category doesn't support categorized
        setServiceForm(prev => ({
          ...prev,
          pricingType: 'fixed',
          pricing: {
            ...prev.pricing,
            type: 'fixed',
            categories: []
          }
        }));
      }
    }
  };

  // FIXED: Handle location selection properly
  const handleLocationSelect = (location) => {
    setSelectedLocations(prev => {
      // Check if location is already selected
      const isAlreadySelected = prev.some(loc => 
        loc.id === location.id || 
        (loc.name === location.name && loc.type === location.type)
      );
      
      if (isAlreadySelected) {
        // Remove location if already selected
        return prev.filter(loc => 
          loc.id !== location.id && 
          !(loc.name === location.name && loc.type === location.type)
        );
      } else {
        // Add location if not selected
        return [...prev, location];
      }
    });
    
    // Clear location errors
    if (formErrors.locations) {
      setFormErrors(prev => ({
        ...prev,
        locations: ''
      }));
    }
  };

  // Handle pricing type change
  const handlePricingTypeChange = (type) => {
    setServiceForm(prev => ({
      ...prev,
      pricingType: type,
      pricing: {
        ...prev.pricing,
        type: type,
        // Reset type-specific fields
        basePrice: type === 'fixed' ? prev.pricing.basePrice : '',
        baseDuration: type === 'fixed' ? prev.pricing.baseDuration : '',
        categories: type === 'categorized' ? (prev.pricing.categories || DEFAULT_CATEGORIES[selectedJobs[0]?.name] || []) : []
      }
    }));
  };

  // Handle category pricing changes
  const handleCategoryChange = (index, field, value) => {
    const selectedCategory = selectedJobs[0]?.name;
    const defaultCategories = DEFAULT_CATEGORIES[selectedCategory] || [];
    
    setServiceForm(prev => {
      const updatedCategories = [...(prev.pricing.categories || defaultCategories)];
      if (!updatedCategories[index]) {
        updatedCategories[index] = { ...defaultCategories[index] };
      }
      updatedCategories[index] = {
        ...updatedCategories[index],
        [field]: value
      };
      
      return {
        ...prev,
        pricing: {
          ...prev.pricing,
          categories: updatedCategories
        }
      };
    });
  };

  // Validation function
  const validateStep = (step) => {
    const errors = {};
    
    switch (step) {
      case 1:
        if (!serviceForm.title.trim()) errors.title = 'Service title is required';
        if (!serviceForm.description.trim()) errors.description = 'Service description is required';
        break;
        
      case 2:
        if (selectedJobs.length === 0) errors.category = 'Please select a service category';
        break;
        
      case 3:
        if (serviceForm.pricingType === 'fixed') {
          if (!serviceForm.pricing.basePrice) errors.basePrice = 'Base price is required';
          if (!serviceForm.pricing.baseDuration) errors.baseDuration = 'Duration is required';
        } else if (serviceForm.pricingType === 'categorized') {
          const hasInvalidCategory = serviceForm.pricing.categories?.some(cat => !cat.price || !cat.duration);
          if (hasInvalidCategory) {
            errors.categories = 'All categories must have price and duration';
          }
        }
        break;
        
      case 4:
        if (selectedLocations.length === 0) errors.locations = 'Please select at least one service area';
        break;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step navigation
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(5, prev + 1));
    } else {
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // Form submission
  const handleSubmit = async () => {
    if (!validateStep(5)) {
      window.scrollTo(0, 0);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Prepare the service data object (not FormData - let the API service handle that)
      const serviceData = {
        title: serviceForm.title,
        description: serviceForm.description,
        category: selectedJobs.length > 0 ? selectedJobs[0].name : '',
        pricing: JSON.stringify(serviceForm.pricing), // Stringify the pricing object
        duration: serviceForm.pricing.baseDuration || null,
        locations: selectedLocations,
        isActive: serviceForm.isActive,
        serviceImage: serviceForm.serviceImage,
        tags: selectedJobs.map(job => job.name)
      };
      
      console.log("📝 Service data prepared for submission:", serviceData);
      
      const response = isEditMode 
        ? await updateService(id, serviceData)
        : await createService(serviceData);
      
      console.log('✅ Service API response:', response);
      
      if (!response || (response.success === false)) {
        throw new Error(response?.message || 'Failed to save service');
      }
      
      setSubmitSuccess(true);
      
      setTimeout(() => {
        navigate('/ServicesManagement');
      }, 3000);
    } catch (error) {
      console.error('❌ Error saving service:', error);
      setSubmitError(error.message || 'Failed to save service. Please try again.');
      window.scrollTo(0, 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const steps = ['Basic Info', 'Category', 'Pricing', 'Locations', 'Review'];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header*/}
      <header className="bg-black text-white w-full top-0 z-10 fixed">
        <div className="py-2">
          <div className="container mx-auto px-4 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center cursor-pointer py-3" onClick={() => navigate('/')}>
              <span className="text-red-500 text-5xl select-none font-bold">𐐒</span>
              <span className="text-white text-4xl select-none font-bold">B</span>
              <span className="text-red-500 text-2xl select-none font-semibold ml-5">BizBridge</span>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-6 text-sm">
              <span onClick={() => navigate('/dashboard')} className="text-xs cursor-pointer hover:text-red-400">
              <div>Your</div>
              <div className='font-bold'>Dashboard</div></span>
              <span onClick={() => navigate('/ServicesManagement')} className="text-xs cursor-pointer hover:text-red-400">
              <div>Your</div>
              <div className='font-bold'>services</div></span>
              <span onClick={() => navigate('/profile')} className="text-xs cursor-pointer hover:text-red-400">
              <div>Your</div>
              <div className='font-bold'>Profile</div></span>
              <span onClick={handleLogout}  className="text-xs cursor-pointer hover:text-red-400">
              <div>Sign</div>
              <div className='font-bold'>out</div></span>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="bg-gray-50 flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {isEditMode ? 'Edit Service' : 'Add New Service'}
                </h1>
                <p className="text-gray-600">
                  {isEditMode ? 'Update your service details' : 'Create a new service for your customers'}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Step {currentStep} of {steps.length}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center">
                {steps.map((step, index) => (
                  <React.Fragment key={index}>
                    <div className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        index + 1 <= currentStep 
                          ? 'bg-red-500 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <span className={`ml-2 text-sm font-medium ${
                        index + 1 <= currentStep ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {step}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-4 ${
                        index + 1 < currentStep ? 'bg-red-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Success Message */}
          {submitSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="text-green-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-green-800 text-sm font-medium ml-2">
                  Service {isEditMode ? 'updated' : 'created'} successfully! Redirecting...
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="text-red-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-red-800 text-sm font-medium ml-2">{submitError}</span>
              </div>
            </div>
          )}

          {/* Form Steps */}
          <div className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Title *
                    </label>
                    <input
                      type="text"
                      value={serviceForm.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        formErrors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your service title"
                    />
                    {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Description *
                    </label>
                    <textarea
                      value={serviceForm.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        formErrors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Describe your service in detail"
                    />
                    {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={serviceForm.isActive}
                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                        className="text-red-500 focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Make this service active and visible to customers</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Next: Select Category
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Category Selection */}
            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Service Category</h2>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    Select the category that best describes your service. This helps customers find you.
                  </p>
                </div>
                
                <JobSelection
                  selectedJobs={selectedJobs}
                  onJobSelect={handleJobSelect}
                  multiSelect={false}
                />
                
                {formErrors.category && <p className="text-red-500 text-sm mt-4">{formErrors.category}</p>}

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Next: Set Pricing
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Pricing */}
            {currentStep === 3 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Pricing Setup</h2>
                
                {/* Important Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <div className="text-yellow-600">
                      <svg className="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
                      <div className="text-sm text-yellow-700 mt-1">
                        BizBridge does not process payments. All pricing is for reference only. Payment arrangements are made directly between you and your customers.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Pricing Type Selection */}
                  <PricingTypeSelector
                    selectedType={serviceForm.pricingType}
                    onTypeChange={handlePricingTypeChange}
                    supportsCategorized={['Woodworking', 'Metalwork', 'Textile Art'].includes(selectedJobs[0]?.name)}
                    selectedCategory={selectedJobs[0]?.name || ''}
                  />

                  {/* Fixed Pricing Fields */}
                  {serviceForm.pricingType === 'fixed' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Fixed Pricing Details</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Base Price (₦) *
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={serviceForm.pricing.basePrice}
                            onChange={(e) => setServiceForm(prev => ({
                              ...prev,
                              pricing: { ...prev.pricing, basePrice: e.target.value }
                            }))}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                              formErrors.basePrice ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter base price"
                          />
                          {formErrors.basePrice && <p className="text-red-500 text-sm mt-1">{formErrors.basePrice}</p>}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duration *
                          </label>
                          <input
                            type="text"
                            value={serviceForm.pricing.baseDuration}
                            onChange={(e) => setServiceForm(prev => ({
                              ...prev,
                              pricing: { ...prev.pricing, baseDuration: e.target.value }
                            }))}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                              formErrors.baseDuration ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="e.g., 1-2 weeks"
                          />
                          {formErrors.baseDuration && <p className="text-red-500 text-sm mt-1">{formErrors.baseDuration}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Negotiable Pricing Info */}
                  {serviceForm.pricingType === 'negotiate' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact for Pricing</h3>
                      <p className="text-sm text-gray-600">
                        Customers will contact you directly for quotes. This is perfect for custom projects where pricing depends on specific requirements, materials, or complexity.
                      </p>
                    </div>
                  )}

                  {/* Categorized Pricing */}
                  {serviceForm.pricingType === 'categorized' && selectedJobs[0] && (
                    <CategoryBreakdown
                      categories={serviceForm.pricing.categories}
                      onCategoryChange={handleCategoryChange}
                      selectedCategory={selectedJobs[0].name}
                    />
                  )}
                  
                  {formErrors.categories && <p className="text-red-500 text-sm mt-2">{formErrors.categories}</p>}
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Next: Service Areas
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Location Selection */}
            {currentStep === 4 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Service Areas</h2>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    Select the areas where you provide this service. Customers in these areas will be able to find and request your service.
                  </p>
                </div>
                
                {/* Selected Locations Display */}
                {selectedLocations.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Selected Areas ({selectedLocations.length})</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedLocations.map((location, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          {location.name}
                          {location.type === 'locality' && location.lga && (
                            <span className="text-red-600 ml-1">({location.lga})</span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleLocationSelect(location)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* FIXED: Use LocationSelection component with proper props */}
                <LocationSelection
                  onLocationSelect={handleLocationSelect}
                  selectedLocations={selectedLocations}
                />
                
                {formErrors.locations && <p className="text-red-500 text-sm mt-2">{formErrors.locations}</p>}

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Next: Review & Publish
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Review & Submit */}
            {currentStep === 5 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Review & Publish</h2>
                
                {/* Service Image Upload */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Service Image (Optional)</h3>
                  <ImageUpload
                    onImageChange={(file) => handleInputChange('serviceImage', file)}
                    initialImage={serviceForm.serviceImage}
                    label="Upload Service Image"
                    previewClassName="w-32 h-32"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Add an image to make your service more attractive to customers.
                  </p>
                </div>

                {/* Service Summary */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Service Summary</h3>
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Title:</span>
                        <p className="text-gray-900">{serviceForm.title}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Category:</span>
                        <p className="text-gray-900">{selectedJobs.length > 0 ? selectedJobs[0].name : ''}</p>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700">Description:</span>
                      <p className="text-gray-900 mt-1">{serviceForm.description}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700">Pricing:</span>
                      <div className="mt-1">
                        {serviceForm.pricingType === 'fixed' && (
                          <p className="text-gray-900">
                            ₦{serviceForm.pricing.basePrice} - {serviceForm.pricing.baseDuration}
                          </p>
                        )}
                        {serviceForm.pricingType === 'negotiate' && (
                          <p className="text-gray-900">Contact for Pricing</p>
                        )}
                        {serviceForm.pricingType === 'categorized' && (
                          <div className="space-y-1">
                            {serviceForm.pricing.categories?.map((category, index) => (
                              <p key={index} className="text-gray-900 text-sm">
                                {category.name}: ₦{category.price} - {category.duration}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700">Service Areas:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {selectedLocations.map((location, index) => (
                          <span key={index} className="text-sm text-gray-900 bg-gray-200 px-2 py-1 rounded">
                            {location.name}
                            {location.type === 'locality' && location.lga && (
                              <span className="text-gray-600"> ({location.lga})</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700">Status:</span>
                      <p className="text-gray-900">
                        {serviceForm.isActive ? 'Active (Visible to customers)' : 'Inactive (Hidden from customers)'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Final Notice */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <div className="text-red-600">
                      <svg className="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Payment Notice</h3>
                      <div className="text-sm text-red-700 mt-1">
                        Remember: BizBridge does not handle payments. All transactions and payment arrangements are made directly between you and your customers.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`px-6 py-3 rounded-lg transition-colors ${
                      isSubmitting
                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    {isSubmitting ? 'Publishing...' : (isEditMode ? 'Update Service' : 'Publish Service')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesAdd;