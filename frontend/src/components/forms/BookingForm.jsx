import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const BookingForm = ({ service, artisan, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const { isAuthenticated, userType } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    requirements: '',
    location: 'artisan', // Default to artisan's location
    contactPhone: ''
  });
  
  // UI state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Ensure only customers can book
  if (userType === 'artisan') {
    return (
      <div className="p-6 text-center">
        <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium">Artisans Cannot Book Services</h3>
        <p className="mt-1 text-gray-500">As an artisan, you cannot book services from other artisans.</p>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
        >
          Close
        </button>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="p-6 text-center">
        <svg className="mx-auto h-12 w-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium">Login Required</h3>
        <p className="mt-1 text-gray-500">Please log in or create an account to book this service.</p>
        <div className="mt-4 flex justify-center space-x-3">
          <button
            onClick={() => navigate('/login')}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition"
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.date) newErrors.date = 'Please select a date';
      if (!formData.time) newErrors.time = 'Please select a time';
    } else if (currentStep === 2) {
      if (!formData.contactPhone) newErrors.contactPhone = 'Please provide a contact phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateForm()) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // In a real app, you would make API call here to create the booking
        // For example: await createBooking({ ...formData, serviceId: service.id, artisanId: artisan.id });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Call success callback
        if (onSuccess) {
          onSuccess({
            id: Math.random().toString(36).substr(2, 9),
            service,
            artisan,
            ...formData,
            status: 'pending',
            createdAt: new Date().toISOString()
          });
        }
        
        // Close the form
        onClose();
        
        // Navigate to bookings page
        navigate('/bookings');
      } catch (error) {
        console.error('Booking error:', error);
        // Handle error
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Available time slots for selection
  const timeSlots = [
    { value: '09:00', label: '9:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '17:00', label: '5:00 PM' }
  ];

  // Calculate booking platform fee based on artisan expertise
  const calculatePlatformFee = () => {
    const baseRates = {
      'Beginner': 500,
      'Intermediate': 800,
      'Expert': 1200
    };
    
    return baseRates[artisan?.expertiseLevel || 'Intermediate'];
  };

  // Render step 1 (Date & Time selection)
  const renderStep1 = () => {
    return (
      <>
        <div className="mb-4">
          <p className="text-gray-700 mb-1">Service: <span className="font-medium">{service?.title}</span></p>
          <p className="text-gray-700 mb-1">Artisan: <span className="font-medium">{artisan?.businessName}</span></p>
          <p className="text-gray-700 mb-1">Price: <span className="font-medium">{service?.price}</span></p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Select Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full p-2 border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded`}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Select Time *</label>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={`w-full p-2 border ${errors.time ? 'border-red-500' : 'border-gray-300'} rounded`}
            >
              <option value="">Select a time</option>
              {timeSlots.map(slot => (
                <option key={slot.value} value={slot.value}>{slot.label}</option>
              ))}
            </select>
            {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Special Requirements</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Any special requests or requirements..."
              rows="3"
            ></textarea>
            <p className="text-sm text-gray-500 mt-1">Optional: Provide any special requirements or details about your booking.</p>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Service Location</label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="locationArtisan"
                  name="location"
                  value="artisan"
                  checked={formData.location === 'artisan'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="locationArtisan">Artisan's Location ({artisan?.location})</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="locationCustomer"
                  name="location"
                  value="customer"
                  checked={formData.location === 'customer'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="locationCustomer">My Location (Additional fees may apply)</label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-4 flex justify-end">
          <button
            type="button"
            onClick={handleNextStep}
            className="bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition"
          >
            Next: Review & Payment
          </button>
        </div>
      </>
    );
  };

  // Render step 2 (Review & Payment)
  const renderStep2 = () => {
    const platformFee = calculatePlatformFee();
    
    return (
      <>
        <div className="mb-6">
          <h3 className="font-medium text-lg mb-3">Booking Details</h3>
          <div className="bg-gray-50 p-4 rounded">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Service:</p>
                <p className="font-medium">{service?.title}</p>
              </div>
              <div>
                <p className="text-gray-500">Artisan:</p>
                <p className="font-medium">{artisan?.businessName}</p>
              </div>
              <div>
                <p className="text-gray-500">Date:</p>
                <p className="font-medium">{new Date(formData.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Time:</p>
                <p className="font-medium">
                  {timeSlots.find(slot => slot.value === formData.time)?.label || formData.time}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Location:</p>
                <p className="font-medium">{formData.location === 'artisan' ? `Artisan's Location (${artisan?.location})` : 'Your Location'}</p>
              </div>
              <div>
                <p className="text-gray-500">Requirements:</p>
                <p className="font-medium">{formData.requirements || 'None specified'}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div>
            <label className="block text-gray-700 mb-2">Contact Phone *</label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className={`w-full p-2 border ${errors.contactPhone ? 'border-red-500' : 'border-gray-300'} rounded`}
              placeholder="Enter your phone number"
            />
            {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
            <p className="text-sm text-gray-500 mt-1">The artisan will use this to contact you regarding your booking.</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium text-lg mb-3">Payment Details</h3>
          <div className="bg-gray-50 p-4 rounded mb-4">
            <div className="flex justify-between mb-2">
              <span>Platform Booking Fee:</span>
              <span>₦{platformFee.toLocaleString()}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold">
              <span>Total Due Now:</span>
              <span>₦{platformFee.toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              This is a platform booking fee only. The final service price will be agreed upon with the artisan directly.
            </p>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Payment Method</label>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div
                className={`border rounded p-3 cursor-pointer flex items-center ${
                  paymentMethod === 'card' ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                onClick={() => setPaymentMethod('card')}
              >
                <input
                  type="radio"
                  id="paymentCard"
                  name="paymentMethod"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="mr-2"
                />
                <label htmlFor="paymentCard" className="cursor-pointer flex-1">
                  <span className="font-medium">Card Payment</span>
                  <div className="flex mt-1">
                    <span className="text-xs bg-gray-100 p-1 rounded">VISA</span>
                    <span className="text-xs bg-gray-100 p-1 rounded ml-1">MASTERCARD</span>
                  </div>
                </label>
              </div>
              
              <div
                className={`border rounded p-3 cursor-pointer flex items-center ${
                  paymentMethod === 'transfer' ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                onClick={() => setPaymentMethod('transfer')}
              >
                <input
                  type="radio"
                  id="paymentTransfer"
                  name="paymentMethod"
                  checked={paymentMethod === 'transfer'}
                  onChange={() => setPaymentMethod('transfer')}
                  className="mr-2"
                />
                <label htmlFor="paymentTransfer" className="cursor-pointer flex-1">
                  <span className="font-medium">Bank Transfer</span>
                  <div className="flex mt-1">
                    <span className="text-xs bg-gray-100 p-1 rounded">BANK</span>
                  </div>
                </label>
              </div>
            </div>
            
            {paymentMethod === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Card Number</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm">Expiry Date</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm">CVV</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {paymentMethod === 'transfer' && (
              <div className="border border-gray-300 rounded p-3">
                <p className="font-medium mb-2">Bank Transfer Details:</p>
                <p className="text-sm">Bank: First Bank</p>
                <p className="text-sm">Account Name: BizBridge Payments Ltd</p>
                <p className="text-sm">Account Number: 1234567890</p>
                <p className="text-sm mt-2">Your booking will be confirmed once payment is received.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="pt-2 flex justify-between">
          <button
            type="button"
            onClick={handlePrevStep}
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className={`bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Confirm & Pay'
            )}
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Book Service</h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Progress Steps */}
      <div className="flex mb-6">
        <div className="flex-1">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 1 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              1
            </div>
            <div className={`h-1 flex-1 ${currentStep >= 2 ? 'bg-red-500' : 'bg-gray-200'}`}></div>
          </div>
          <div className="text-center mt-2 text-sm">Booking Info</div>
        </div>
        <div className="flex-1">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              2
            </div>
          </div>
          <div className="text-center mt-2 text-sm">Review & Payment</div>
        </div>
      </div>
      
      <form onSubmit={(e) => e.preventDefault()}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
      </form>
    </div>
  );
};

export default BookingForm;