// src/components/forms/ServiceRequestForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const ServiceRequestForm = ({ service, artisan, onClose, onSuccess }) => {
  const { currentUser } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    title: service?.title ? `Custom ${service.title}` : '',
    description: '',
    budgetMin: '',
    budgetMax: '',
    preferredStartDate: '',
    preferredEndDate: '',
    flexibility: 'somewhat_flexible',
    locationType: 'customer_location',
    address: '',
    lga: '',
    materials: [{ name: '', specifications: '', customerProvided: false }],
    dimensions: { length: '', width: '', height: '', unit: 'cm' },
    colors: [''],
    specialInstructions: '',
    inspiration: '',
    priority: 'medium'
  });

  // UI state
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceImages, setReferenceImages] = useState([]);

  // Lagos LGAs
  const lagosLGAs = [
    'Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Badagry',
    'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja',
    'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin',
    'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere', 'Yaba'
  ];

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Handle nested object changes
  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  // Handle array changes
  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  // Add material
  const addMaterial = () => {
    setFormData(prev => ({
      ...prev,
      materials: [...prev.materials, { name: '', specifications: '', customerProvided: false }]
    }));
  };

  // Remove material
  const removeMaterial = (index) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  // Add color
  const addColor = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, '']
    }));
  };

  // Remove color
  const removeColor = (index) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxFiles = 5;
    
    if (referenceImages.length + files.length > maxFiles) {
      alert(`You can upload a maximum of ${maxFiles} reference images`);
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setReferenceImages(prev => [...prev, {
          file,
          url: event.target.result,
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image
  const removeImage = (index) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index));
  };

  // Validate current step
  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.budgetMin) newErrors.budgetMin = 'Minimum budget is required';
        if (formData.budgetMax && parseFloat(formData.budgetMax) < parseFloat(formData.budgetMin)) {
          newErrors.budgetMax = 'Maximum budget must be greater than minimum';
        }
        break;
      case 2:
        if (!formData.preferredStartDate) newErrors.preferredStartDate = 'Preferred start date is required';
        if (formData.preferredEndDate && new Date(formData.preferredEndDate) <= new Date(formData.preferredStartDate)) {
          newErrors.preferredEndDate = 'End date must be after start date';
        }
        if (formData.locationType === 'customer_location' && !formData.address.trim()) {
          newErrors.address = 'Address is required for customer location';
        }
        if (!formData.lga) newErrors.lga = 'LGA is required';
        break;
      case 3:
        // Optional step - no required validation
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      // Prepare request data
      const requestData = {
        artisanId: artisan._id,
        serviceId: service._id,
        title: formData.title,
        description: formData.description,
        category: service.category,
        budget: {
          min: parseFloat(formData.budgetMin),
          max: formData.budgetMax ? parseFloat(formData.budgetMax) : null,
          currency: 'NGN'
        },
        timeline: {
          preferredStartDate: formData.preferredStartDate,
          preferredEndDate: formData.preferredEndDate || null,
          flexibility: formData.flexibility
        },
        location: {
          type: formData.locationType,
          address: formData.address,
          lga: formData.lga
        },
        requirements: {
          materials: formData.materials.filter(m => m.name.trim()),
          dimensions: formData.dimensions.length ? formData.dimensions : null,
          colors: formData.colors.filter(c => c.trim()),
          specialInstructions: formData.specialInstructions,
          referenceImages: referenceImages.map(img => img.url), // In production, upload to server first
          inspiration: formData.inspiration
        },
        priority: formData.priority,
        source: 'direct_service'
      };

      // TODO: Replace with actual API call
      console.log('📝 Creating service request:', requestData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('✅ Service request created successfully');
      onSuccess();
      
    } catch (error) {
      console.error('❌ Error creating service request:', error);
      alert('Failed to create service request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-500 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Request Custom Quote</h2>
              <p className="text-blue-100 mt-1">Get a personalized quote from {artisan?.businessName || artisan?.contactName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step <= currentStep ? 'bg-white text-blue-500' : 'bg-blue-400 text-blue-100'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      step < currentStep ? 'bg-white' : 'bg-blue-400'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between text-xs text-blue-100 mt-2">
              <span>Basic Info</span>
              <span>Timeline & Location</span>
              <span>Requirements</span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Custom dining table with storage"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  placeholder="Describe what you need in detail. Include size, style, materials, and any specific requirements..."
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Budget (₦) *
                  </label>
                  <input
                    type="number"
                    value={formData.budgetMin}
                    onChange={(e) => handleInputChange('budgetMin', e.target.value)}
                    placeholder="50000"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.budgetMin ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.budgetMin && <p className="text-red-500 text-sm mt-1">{errors.budgetMin}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Budget (₦)
                  </label>
                  <input
                    type="number"
                    value={formData.budgetMax}
                    onChange={(e) => handleInputChange('budgetMax', e.target.value)}
                    placeholder="100000"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.budgetMax ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.budgetMax && <p className="text-red-500 text-sm mt-1">{errors.budgetMax}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low - I'm flexible with timing</option>
                  <option value="medium">Medium - Standard timeline</option>
                  <option value="high">High - I need this soon</option>
                  <option value="urgent">Urgent - This is time-sensitive</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Timeline & Location */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.preferredStartDate}
                    onChange={(e) => handleInputChange('preferredStartDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.preferredStartDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.preferredStartDate && <p className="text-red-500 text-sm mt-1">{errors.preferredStartDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred End Date
                  </label>
                  <input
                    type="date"
                    value={formData.preferredEndDate}
                    onChange={(e) => handleInputChange('preferredEndDate', e.target.value)}
                    min={formData.preferredStartDate}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.preferredEndDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.preferredEndDate && <p className="text-red-500 text-sm mt-1">{errors.preferredEndDate}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeline Flexibility
                </label>
                <select
                  value={formData.flexibility}
                  onChange={(e) => handleInputChange('flexibility', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="rigid">Rigid - These dates are fixed</option>
                  <option value="somewhat_flexible">Somewhat Flexible - Can adjust by a few days</option>
                  <option value="very_flexible">Very Flexible - Dates are just a guideline</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Where should the work be done?
                </label>
                <select
                  value={formData.locationType}
                  onChange={(e) => handleInputChange('locationType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="customer_location">My Location</option>
                  <option value="artisan_workshop">Artisan's Workshop</option>
                  <option value="neutral_location">Neutral Location</option>
                  <option value="pickup_delivery">Pickup/Delivery</option>
                </select>
              </div>

              {(formData.locationType === 'customer_location' || formData.locationType === 'neutral_location') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter complete address"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Local Government Area (LGA) *
                </label>
                <select
                  value={formData.lga}
                  onChange={(e) => handleInputChange('lga', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.lga ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select LGA</option>
                  {lagosLGAs.map(lga => (
                    <option key={lga} value={lga}>{lga}</option>
                  ))}
                </select>
                {errors.lga && <p className="text-red-500 text-sm mt-1">{errors.lga}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Requirements */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Materials */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Materials Needed
                </label>
                {formData.materials.map((material, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={material.name}
                      onChange={(e) => handleArrayChange('materials', index, { ...material, name: e.target.value })}
                      placeholder="Material name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={material.specifications}
                      onChange={(e) => handleArrayChange('materials', index, { ...material, specifications: e.target.value })}
                      placeholder="Specifications"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={material.customerProvided}
                        onChange={(e) => handleArrayChange('materials', index, { ...material, customerProvided: e.target.checked })}
                        className="mr-1"
                      />
                      <span className="text-xs">I'll provide</span>
                    </label>
                    {formData.materials.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMaterial(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMaterial}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  + Add Material
                </button>
              </div>

              {/* Dimensions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions (Optional)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <input
                    type="number"
                    value={formData.dimensions.length}
                    onChange={(e) => handleNestedChange('dimensions', 'length', e.target.value)}
                    placeholder="Length"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={formData.dimensions.width}
                    onChange={(e) => handleNestedChange('dimensions', 'width', e.target.value)}
                    placeholder="Width"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={formData.dimensions.height}
                    onChange={(e) => handleNestedChange('dimensions', 'height', e.target.value)}
                    placeholder="Height"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={formData.dimensions.unit}
                    onChange={(e) => handleNestedChange('dimensions', 'unit', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cm">cm</option>
                    <option value="m">m</option>
                    <option value="inch">inch</option>
                    <option value="ft">ft</option>
                  </select>
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Colors
                </label>
                {formData.colors.map((color, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => handleArrayChange('colors', index, e.target.value)}
                      placeholder="Color preference"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.colors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeColor(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addColor}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  + Add Color
                </button>
              </div>

              {/* Reference Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference Images (Optional)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="reference-images"
                />
                <label
                  htmlFor="reference-images"
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 block"
                >
                  <span className="text-gray-600">Click to upload reference images</span>
                  <span className="text-xs text-gray-500 block mt-1">Maximum 5 images</span>
                </label>
                
                {referenceImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {referenceImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.url}
                          alt={`Reference ${index + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions
                </label>
                <textarea
                  value={formData.specialInstructions}
                  onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  rows={3}
                  placeholder="Any special requirements, techniques, or considerations..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Inspiration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Style Inspiration
                </label>
                <input
                  type="text"
                  value={formData.inspiration}
                  onChange={(e) => handleInputChange('inspiration', e.target.value)}
                  placeholder="e.g., Modern minimalist, Rustic farmhouse, Traditional Nigerian..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Step {currentStep} of 3
          </div>
          
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Previous
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-lg transition ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Request...
                  </div>
                ) : (
                  'Send Request'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
</div>

  );
};

export default ServiceRequestForm;