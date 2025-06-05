import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import JobSelection from '../pages/JobSelection';
import LocationSelection from '../pages/LocationSelection';
import { createService, getServiceById, updateService } from '../../../../backend/src/api/Services';

const ServicesAdd = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams(); // For edit mode
  const { userType, logout } = useAuth();
  
  const isEditMode = !!serviceId;
  
  const [formStep, setFormStep] = useState(1); // 1: Basic Info, 2: Job Selection, 3: Location Selection
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    isActive: true,
    serviceImage: null
  });

  // Ensure only artisans can access this page
  useEffect(() => {
    if (userType !== 'artisan') {
      navigate('/unauthorized');
      return;
    }

    // If in edit mode, fetch the service data
    if (isEditMode) {
      fetchServiceData();
    }
  }, [userType, navigate, isEditMode, serviceId]);

  // Fetch service data for edit mode
  const fetchServiceData = async () => {
    try {
      console.log("Fetching service data for edit:", serviceId);
      const response = await getServiceById(serviceId);
      
      if (response && response.service) {
        const service = response.service;
        
        // Set basic form fields
        setServiceForm({
          title: service.title || '',
          description: service.description || '',
          price: service.price || '',
          duration: service.duration || '',
          isActive: service.isActive !== undefined ? service.isActive : true,
          serviceImage: null // We can't load the file back, just the URL
        });
        
        // Set jobs (categories)
        if (service.category) {
          const jobMatch = JOB_CATEGORIES.find(job => 
            job.name.toLowerCase() === service.category.toLowerCase()
          );
          
          if (jobMatch) {
            setSelectedJobs([jobMatch]);
          }
        }
        
        // Set locations
        if (service.locations && service.locations.length > 0) {
          setSelectedLocations(service.locations.map(loc => ({
            id: loc.id || `loc-${Math.random().toString(36).substr(2, 9)}`,
            name: loc.name,
            type: loc.type || 'lga',
            lga: loc.lga,
            region: loc.region || 'Lagos'
          })));
        }
      } else {
        setSubmitError('Could not load service data for editing.');
      }
    } catch (error) {
      console.error('Error fetching service data:', error);
      setSubmitError('Failed to load service data. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setServiceForm({
        ...serviceForm,
        serviceImage: files[0]
      });
    } else {
      setServiceForm({
        ...serviceForm,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleJobSelect = (job) => {
    // Check if job is already selected
    const isAlreadySelected = selectedJobs.some(selectedJob => selectedJob.id === job.id);
    
    if (isAlreadySelected) {
      // Remove job if already selected
      setSelectedJobs(selectedJobs.filter(selectedJob => selectedJob.id !== job.id));
    } else {
      // Add job if not already selected (up to a maximum of 5)
      if (selectedJobs.length < 5) {
        setSelectedJobs([...selectedJobs, job]);
      } else {
        // Show error or notification that max jobs are selected
        setFormErrors({
          ...formErrors,
          jobs: 'You can select a maximum of 5 job categories'
        });
        
        // Clear error after 3 seconds
        setTimeout(() => {
          setFormErrors({
            ...formErrors,
            jobs: ''
          });
        }, 3000);
      }
    }
  };

  const handleLocationSelect = (location) => {
    console.log("Location selected:", location);
    
    // Check if location is already selected
    const isAlreadySelected = selectedLocations.some(
      selectedLocation => selectedLocation.name === location.name && selectedLocation.type === location.type
    );
    
    if (isAlreadySelected) {
      // Remove location if already selected
      setSelectedLocations(selectedLocations.filter(
        selectedLocation => !(selectedLocation.name === location.name && selectedLocation.type === location.type)
      ));
    } else {
      // Add location if not already selected (up to a maximum of 3)
      if (selectedLocations.length < 3) {
        setSelectedLocations([...selectedLocations, location]);
      } else {
        // Show error that max locations are selected
        setFormErrors({
          ...formErrors,
          locations: 'You can select a maximum of 3 locations'
        });
        
        // Clear error after 3 seconds
        setTimeout(() => {
          setFormErrors({
            ...formErrors,
            locations: ''
          });
        }, 3000);
      }
    }
  };

  const validateFormStep = (step) => {
    const FormErrors = {};
    let isValid = true;
    
    if (step === 1) {
      if (!serviceForm.title) {
        FormErrors.title = 'Service title is required';
        isValid = false;
      }
      if (!serviceForm.description) {
        FormErrors.description = 'Description is required';
        isValid = false;
      }
      if (!serviceForm.price) {
        FormErrors.price = 'Price is required';
        isValid = false;
      }
    } else if (step === 2) {
      if (selectedJobs.length === 0) {
        FormErrors.jobs = 'Please select at least one job category';
        isValid = false;
      }
    } else if (step === 3) {
      if (selectedLocations.length === 0) {
        FormErrors.locations = 'Please select at least one location';
        isValid = false;
      }
    }
    
    setFormErrors(FormErrors);
    return isValid;
  };
  
  const handleNextStep = () => {
    if (validateFormStep(formStep)) {
      console.log(`Moving to step ${formStep + 1}`);
      setFormStep(formStep + 1);
    }
  };
  
  const handlePrevStep = () => {
    setFormStep(formStep - 1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    // Only allow submission on the final step
    if (formStep !== 3) {
      console.error("Attempted to submit before completing all steps");
      return;
    }
    
    // Validate the current step
    if (!validateFormStep(formStep)) {
      console.log("Validation failed for step", formStep);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Preparing form data for submission");
      
      // Prepare service data for API
      const formData = {
        title: serviceForm.title,
        description: serviceForm.description,
        price: serviceForm.price,
        duration: serviceForm.duration,
        category: selectedJobs.length > 0 ? selectedJobs[0].name : null,
        locations: selectedLocations,
        isActive: serviceForm.isActive,
        serviceImage: serviceForm.serviceImage,
        tags: selectedJobs.map(job => job.name)
      };
      
      console.log("Form data prepared, sending to API");
      
      // Call API to create service - store the response in a variable
      const response = await createService(formData);
      
      console.log('Service API response:', response);
      
      if (!response || (response.success === false)) {
        throw new Error(response?.message || 'Failed to save service');
      }
      
      setSubmitSuccess(true);
      
      // Reset form after success and redirect to services page after a delay
      setTimeout(() => {
        setServiceForm({
          title: '',
          description: '',
          price: '',
          duration: '',
          isActive: true,
          serviceImage: null
        });
        setSelectedJobs([]);
        setSelectedLocations([]);
        setFormStep(1);
        navigate('/ServicesManagement');
      }, 3000);
    } catch (error) {
      console.error('Error saving service:', error);
      setSubmitError(error.message || 'Failed to save service. Please try again.');
      // Scroll to top to show the error
      window.scrollTo(0, 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/ServicesManagement');
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
            <span onClick={() => navigate('/ServicesManagement')} className="hover:text-red-400 cursor-pointer">My Services</span>
            <span onClick={handleLogout} className="hover:text-red-400 cursor-pointer">Logout</span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="bg-white flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{isEditMode ? 'Edit Service' : 'Add New Service'}</h1>
            <p className="text-gray-600 mt-2">Fill in the details below to {isEditMode ? 'update your' : 'add a new'} service to your profile.</p>
          </div>
          
          <div className="bg-white p-6 border rounded-lg shadow-sm mb-8">
            {submitSuccess ? (
              <div className="text-center py-12 bg-green-50 rounded-lg">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Service {isEditMode ? 'Updated' : 'Added'} Successfully!</h2>
                <p className="text-gray-600 mb-6">Your service has been {isEditMode ? 'updated' : 'added to your listings'}.</p>
                <p className="text-gray-500">Redirecting to your services page...</p>
              </div>
            ) : (
              <>
                {/* Form Steps Progress */}
                <div className="mb-8">
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      formStep >= 1 ? 'border-red-500 bg-red-500 text-white' : 'border-gray-300'
                    }`}>
                      1
                    </div>
                    <div className={`flex-1 h-1 mx-2 ${formStep >= 2 ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      formStep >= 2 ? 'border-red-500 bg-red-500 text-white' : 'border-gray-300'
                    }`}>
                      2
                    </div>
                    <div className={`flex-1 h-1 mx-2 ${formStep >= 3 ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      formStep >= 3 ? 'border-red-500 bg-red-500 text-white' : 'border-gray-300'
                    }`}>
                      3
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs font-medium">Basic Info</span>
                    <span className="text-xs font-medium">Select Jobs</span>
                    <span className="text-xs font-medium">Locations</span>
                  </div>
                </div>
                
                {submitError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <span className="font-bold">Error:</span> {submitError}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Basic Info */}
                  {formStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-gray-700 mb-2">Service Title <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          name="title"
                          value={serviceForm.title}
                          onChange={handleInputChange}
                          className={`w-full p-3 border ${formErrors.title ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                        />
                        {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
                        <textarea
                          name="description"
                          value={serviceForm.description}
                          onChange={handleInputChange}
                          rows="5"
                          className={`w-full p-3 border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                          placeholder="Provide detailed information about your service including what customers can expect, materials used, and any other relevant details..."
                        ></textarea>
                        {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-2">Price Range <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          name="price"
                          value={serviceForm.price}
                          onChange={handleInputChange}
                          className={`w-full p-3 border ${formErrors.price ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                          placeholder="e.g., ₦15,000 - ₦50,000"
                        />
                        {formErrors.price && <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-2">Duration</label>
                        <input
                          type="text"
                          name="duration"
                          value={serviceForm.duration}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="e.g., 2-3 days"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-2">Service Image</label>
                        <div className="flex items-center">
                          <label 
                            htmlFor="serviceImage" 
                            className="bg-red-400 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-500 transition"
                          >
                            Choose Image
                          </label>
                          <input
                            type="file"
                            id="serviceImage"
                            name="serviceImage"
                            onChange={handleInputChange}
                            accept="image/*"
                            className="hidden"
                          />
                          <span className="ml-4 text-gray-600">
                            {serviceForm.serviceImage 
                              ? serviceForm.serviceImage.name 
                              : 'No file chosen (will use default image)'}
                          </span>
                        </div>
                        {serviceForm.serviceImage && (
                          <div className="mt-3">
                            <img 
                              src={URL.createObjectURL(serviceForm.serviceImage)} 
                              alt="Preview" 
                              className="h-40 object-cover rounded border border-gray-300" 
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isActive"
                          name="isActive"
                          checked={serviceForm.isActive}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-red-500 focus:ring-red-400 border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="ml-2 block text-gray-700">
                          Make this service active and visible to customers
                        </label>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 2: Job Selection */}
                  {formStep === 2 && (
                    <div>
                      <JobSelection onJobSelect={handleJobSelect} selectedJobs={selectedJobs} />
                      
                      {formErrors.jobs && (
                        <p className="text-red-500 text-sm mt-4">{formErrors.jobs}</p>
                      )}
                      
                      {selectedJobs.length > 0 && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-semibold mb-3">Selected Job Categories:</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedJobs.map(job => (
                              <span 
                                key={job.id}
                                className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full flex items-center"
                              >
                                {job.name}
                                <button 
                                  type="button"
                                  onClick={() => handleJobSelect(job)}
                                  className="ml-2 focus:outline-none"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </span>
                            ))}
                          </div>
                          <p className="text-sm text-gray-500 mt-3">
                            You have selected {selectedJobs.length} out of 5 maximum job categories.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Step 3: Location Selection */}
                  {formStep === 3 && (
                    <div>
                      <LocationSelection onLocationSelect={handleLocationSelect} selectedLocations={selectedLocations} />
                      
                      {formErrors.locations && (
                        <p className="text-red-500 text-sm mt-4">{formErrors.locations}</p>
                      )}
                      
                      {selectedLocations.length > 0 && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-semibold mb-3">Selected Locations:</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedLocations.map((location, index) => (
                              <span 
                                key={`${location.type}-${location.name}-${index}`}
                                className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full flex items-center"
                              >
                                {location.name} {location.type === 'locality' && location.lga && `(${location.lga})`}
                                <button 
                                  type="button"
                                  onClick={() => handleLocationSelect(location)}
                                  className="ml-2 focus:outline-none"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </span>
                            ))}
                          </div>
                          <p className="text-sm text-gray-500 mt-3">
                            You have selected {selectedLocations.length} out of 3 maximum locations.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex justify-between mt-8">
                    {formStep > 1 ? (
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="bg-gray-200 text-gray-800 py-2 px-6 rounded hover:bg-gray-300 transition flex items-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-gray-200 text-gray-800 py-2 px-6 rounded hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                    )}
                    
                    {formStep < 3 ? (
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="ml-auto bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition flex items-center"
                      >
                        Next
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="ml-auto bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition flex items-center"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            {isEditMode ? 'Update Service' : 'Save Service'}
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </>
            )}
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Tips for Creating Effective Services</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex">
                <svg className="flex-shrink-0 w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Use a clear, descriptive title that highlights what makes your service unique
              </li>
              <li className="flex">
                <svg className="flex-shrink-0 w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Provide detailed descriptions including materials, process, and what customers can expect
              </li>
              <li className="flex">
                <svg className="flex-shrink-0 w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Upload high-quality images that showcase your work (professional photos work best)
              </li>
              <li className="flex">
                <svg className="flex-shrink-0 w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Be transparent about pricing - provide clear ranges or starting prices
              </li>
              <li className="flex">
                <svg className="flex-shrink-0 w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Select the most relevant job categories and locations to improve searchability
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} BizBridge. All rights reserved.</p>
            <div className="mt-2 flex flex-wrap justify-center">
              <span onClick={() => navigate('/terms')} className="text-red-400 hover:text-red-500 mx-2 cursor-pointer">Terms of Service</span>
              <span onClick={() => navigate('/privacy')} className="text-red-400 hover:text-red-500 mx-2 cursor-pointer">Privacy Policy</span>
              <span onClick={() => navigate('/contact')} className="text-red-400 hover:text-red-500 mx-2 cursor-pointer">Contact Us</span>
              <span onClick={() => navigate('/faq')} className="text-red-400 hover:text-red-500 mx-2 cursor-pointer">FAQ</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ServicesAdd;