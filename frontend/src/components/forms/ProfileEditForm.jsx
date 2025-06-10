import React, { useState } from 'react';
import { updateMyProfile, uploadProfileImage } from '../../api/userProfile';
import ImageUpload from '../common/ImageUpload';

const ProfileEditForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    // Common fields
    username: user.username || '',
    profileImage: null,
    
    // Customer fields
    fullName: user.fullName || '',
    
    // Artisan fields
    contactName: user.contactName || '',
    businessName: user.businessName || '',
    phoneNumber: user.phoneNumber || '',
    address: user.address || '',
    city: user.city || '',
    localGovernmentArea: user.localGovernmentArea || '',
    websiteURL: user.websiteURL || '',
    yearEstablished: user.yearEstablished || '',
    staffStrength: user.staffStrength || ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(user.profileImage);

  // Lagos LGAs for dropdown
  const LAGOS_LGAS = [
    'Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa', 'Badagry',
    'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja', 'Ikorodu',
    'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin', 'Ojo', 'Oshodi-Isolo',
    'Shomolu', 'Surulere'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleImageChange = (file) => {
    setFormData(prev => ({
      ...prev,
      profileImage: file
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Common validations
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    // Customer-specific validations
    if (user.role === 'customer') {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
    }

    // Artisan-specific validations
    if (user.role === 'artisan') {
      if (!formData.contactName.trim()) {
        newErrors.contactName = 'Contact name is required';
      }
      if (!formData.businessName.trim()) {
        newErrors.businessName = 'Business name is required';
      }
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone number is required';
      }
    }

    // Email validation if provided
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }

    // Website URL validation if provided
    if (formData.websiteURL && !formData.websiteURL.match(/^https?:\/\/.+/)) {
      newErrors.websiteURL = 'Website URL must start with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // First, upload profile image if changed
      let updatedProfileImage = user.profileImage;
      if (formData.profileImage instanceof File) {
        console.log('📸 Uploading new profile image...');
        const imageResponse = await uploadProfileImage(formData.profileImage);
        if (imageResponse.success) {
          updatedProfileImage = imageResponse.profileImage;
        }
      }

      // Prepare profile data (exclude image file)
      const profileData = { ...formData };
      delete profileData.profileImage;

      // Update profile
      console.log('✏️ Updating profile...');
      const response = await updateMyProfile(profileData);

      if (response.success) {
        const updatedUser = {
          ...response.user,
          profileImage: updatedProfileImage
        };
        
        onSave(updatedUser);
        console.log('✅ Profile updated successfully');
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }

    } catch (error) {
      console.error('❌ Profile update error:', error);
      setErrors({ submit: error.message || 'Failed to update profile' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Edit Profile</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {errors.submit && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Image
          </label>
          <ImageUpload
            initialImage={imagePreview}
            onImageChange={handleImageChange}
            label="Upload New Image"
            className="mb-4"
          />
        </div>

        {/* Common Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-md ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>
        </div>

        {/* Customer-specific Fields */}
        {user.role === 'customer' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Personal Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>
          </div>
        )}

        {/* Artisan-specific Fields */}
        {user.role === 'artisan' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Business Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Name *
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md ${
                    errors.contactName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Your full name"
                />
                {errors.contactName && (
                  <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md ${
                    errors.businessName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Your business name"
                />
                {errors.businessName && (
                  <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+234 800 XXX XXXX"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Local Government Area
                </label>
                <select
                  name="localGovernmentArea"
                  value={formData.localGovernmentArea}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                >
                  <option value="">Select LGA</option>
                  {LAGOS_LGAS.map(lga => (
                    <option key={lga} value={lga}>{lga}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Lagos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year Established
                </label>
                <input
                  type="number"
                  name="yearEstablished"
                  value={formData.yearEstablished}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="2020"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
                rows="3"
                placeholder="Enter your business address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  name="websiteURL"
                  value={formData.websiteURL}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md ${
                    errors.websiteURL ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://yourwebsite.com"
                />
                {errors.websiteURL && (
                  <p className="text-red-500 text-sm mt-1">{errors.websiteURL}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Staff Strength
                </label>
                <select
                  name="staffStrength"
                  value={formData.staffStrength}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                >
                  <option value="">Select staff size</option>
                  <option value="1">Just me</option>
                  <option value="2-5">2-5 employees</option>
                  <option value="6-10">6-10 employees</option>
                  <option value="11-25">11-25 employees</option>
                  <option value="26-50">26-50 employees</option>
                  <option value="50+">50+ employees</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition ${
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
                Saving...
              </span>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;