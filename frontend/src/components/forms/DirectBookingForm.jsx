// src/components/forms/DirectBookingForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const DirectBookingForm = ({ service, artisan, onClose, onSuccess }) => {
  const { currentUser } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    title: service?.title || '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '17:00',
    agreedPrice: service?.price ? service.price.replace(/[^0-9]/g, '') : '',
    paymentTerms: 'deposit_balance',
    depositAmount: '',
    locationType: 'customer_location',
    address: '',
    lga: '',
    specialRequests: ''
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

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

  // Calculate deposit amount based on payment terms
  const calculateDeposit = () => {
    const price = parseFloat(formData.agreedPrice) || 0;
    switch (formData.paymentTerms) {
      case 'full_upfront':
        return price;
      case 'deposit_balance':
        return Math.round(price * 0.5); // 50% deposit
      case 'milestone_based':
        return Math.round(price * 0.3); // 30% deposit
      case 'on_completion':
        return 0;
      default:
        return 0;
    }
  };

  // Update deposit amount when payment terms or price changes
  React.useEffect(() => {
    if (formData.paymentTerms !== 'custom') {
      setFormData(prev => ({
        ...prev,
        depositAmount: calculateDeposit().toString()
      }));
    }
  }, [formData.agreedPrice, formData.paymentTerms]);

  // Validate current step
  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (new Date(formData.startDate) < new Date()) {
          newErrors.startDate = 'Start date cannot be in the past';
        }
        if (formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
          newErrors.endDate = 'End date must be after start date';
        }
        break;
      case 2:
        if (!formData.agreedPrice || parseFloat(formData.agreedPrice) <= 0) {
          newErrors.agreedPrice = 'Valid price is required';
        }
        if (formData.locationType === 'customer_location' && !formData.address.trim()) {
          newErrors.address = 'Address is required for customer location';
        }
        if (!formData.lga) newErrors.lga = 'LGA is required';
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
      // Prepare booking data
      const bookingData = {
        serviceId: service._id,
        artisanId: artisan._id,
        title: formData.title,
        description: formData.description,
        scheduledDate: {
          startDate: new Date(`${formData.startDate}T${formData.startTime}`).toISOString(),
          endDate: formData.endDate ? new Date(`${formData.endDate}T${formData.endTime}`).toISOString() : null,
          startTime: formData.startTime,
          endTime: formData.endTime
        },
        pricing: {
          agreedPrice: parseFloat(formData.agreedPrice),
          currency: 'NGN',
          paymentTerms: formData.paymentTerms,
          depositAmount: parseFloat(formData.depositAmount) || 0
        },
        location: {
          type: formData.locationType,
          address: formData.address,
          lga: formData.lga
        },
        specialRequests: formData.specialRequests
      };

      // TODO: Replace with actual API call
      console.log('📅 Creating direct booking:', bookingData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('✅ Direct booking created successfully');
      onSuccess();
      
    } catch (error) {
      console.error('❌ Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-red-500 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Book Service Directly</h2>
              <p className="text-red-100 mt-1">Book {service?.title} with {artisan?.businessName || artisan?.contactName}</p>
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
              {[1, 2].map((step) => (
                <React.Fragment key={step}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step <= currentStep ? 'bg-white text-red-500' : 'bg-red-400 text-red-100'
                  }`}>
                    {step}
                  </div>
                  {step < 2 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      step < currentStep ? 'bg-white' : 'bg-red-400'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between text-xs text-red-100 mt-2">
              <span>Schedule & Details</span>
              <span>Pricing & Location</span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {/* Step 1: Schedule & Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Service booking title"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Details
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  placeholder="Any specific requirements or notes for this booking..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.startDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    min={formData.startDate}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.endDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests
                </label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  rows={3}
                  placeholder="Any special requests or considerations for the artisan..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          )}

          {/* Step 2: Pricing & Location */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agreed Price (₦) *
                </label>
                <input
                  type="number"
                  value={formData.agreedPrice}
                  onChange={(e) => handleInputChange('agreedPrice', e.target.value)}
                  placeholder="Enter agreed price"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.agreedPrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.agreedPrice && <p className="text-red-500 text-sm mt-1">{errors.agreedPrice}</p>}
                {service?.price && (
                  <p className="text-sm text-gray-600 mt-1">
                    Artisan's listed price: {service.price}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Terms
                </label>
                <select
                  value={formData.paymentTerms}
                  onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="full_upfront">Full Payment Upfront</option>
                  <option value="deposit_balance">50% Deposit + Balance on Completion</option>
                  <option value="milestone_based">30% Deposit + Milestone Payments</option>
                  <option value="on_completion">Payment on Completion</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deposit Amount (₦)
                </label>
                <input
                  type="number"
                  value={formData.depositAmount}
                  onChange={(e) => handleInputChange('depositAmount', e.target.value)}
                  placeholder="Deposit amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Calculated deposit: ₦{calculateDeposit().toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Where should the work be done?
                </label>
                <select
                  value={formData.locationType}
                  onChange={(e) => handleInputChange('locationType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
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
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
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

              {/* Booking Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-medium">{formData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">
                      {formData.startDate} {formData.endDate && `to ${formData.endDate}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="font-medium">{formData.startTime} - {formData.endTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Price:</span>
                    <span className="font-medium">₦{parseFloat(formData.agreedPrice || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deposit Required:</span>
                    <span className="font-medium text-red-500">₦{parseFloat(formData.depositAmount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-medium capitalize">{formData.locationType.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Step {currentStep} of 2
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
            
            {currentStep < 2 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
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
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Booking...
                  </div>
                ) : (
                  'Confirm Booking'
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

export default DirectBookingForm;