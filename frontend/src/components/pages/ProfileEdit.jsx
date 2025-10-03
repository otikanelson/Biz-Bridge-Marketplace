import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, updateMyProfile, uploadProfileImage } from '../../api/userProfile';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phoneNumber: '',
    bio: '',
    businessName: '',
    website: '',
    location: {
      state: '',
      lga: '',
      address: ''
    },
    specialties: [],
    workingHours: {
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
      sunday: ''
    }
  });
  
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');

  // Lagos LGAs for location dropdown
  const lagosLGAs = [
    'Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa', 'Badagry',
    'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja', 'Ikorodu',
    'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin', 'Ojo', 'Oshodi-Isolo',
    'Shomolu', 'Surulere', 'Yaba'
  ];

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    fetchProfileData();
  }, [currentUser, navigate]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await getMyProfile();
      
      if (response.success) {
        const profile = response.user || response.profile;
        setFormData({
          name: profile.name || '',
          username: profile.username || '',
          email: profile.email || '',
          phoneNumber: profile.phoneNumber || '',
          bio: profile.bio || '',
          businessName: profile.businessName || '',
          website: profile.website || '',
          location: {
            state: profile.location?.state || 'Lagos',
            lga: profile.location?.lga || '',
            address: profile.location?.address || ''
          },
          specialties: profile.specialties || [],
          workingHours: {
            monday: profile.workingHours?.monday || '',
            tuesday: profile.workingHours?.tuesday || '',
            wednesday: profile.workingHours?.wednesday || '',
            thursday: profile.workingHours?.thursday || '',
            friday: profile.workingHours?.friday || '',
            saturday: profile.workingHours?.saturday || '',
            sunday: profile.workingHours?.sunday || ''
          }
        });
        
        if (profile.profileImage) {
          setImagePreview(profile.profileImage);
        }
      }
    } catch (err) {
      setError('Failed to load profile data');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      
      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty('');
    }
  };

  const handleRemoveSpecialty = (index) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Upload image first if there's a new one
      if (profileImage) {
        setUploadingImage(true);
        const imageResponse = await uploadProfileImage(profileImage);
        if (imageResponse.success) {
          setImagePreview(imageResponse.imageUrl || imageResponse.profileImage);
        }
        setUploadingImage(false);
      }

      // Update profile data
      const response = await updateMyProfile(formData);
      
      if (response.success) {
        setSuccess('Profile updated successfully!');
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      console.error('Profile update error:', err);
    } finally {
      setSaving(false);
      setUploadingImage(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-black text-white w-full top-0 z-10 fixed">
          <div className="py-2">
            <div className="container mx-auto px-4 flex items-center justify-between">
              <div className="flex items-center cursor-pointer py-3" onClick={() => navigate('/')}>
                <span className="text-red-500 text-5xl select-none font-bold">𐐒</span>
                <span className="text-white text-4xl select-none font-bold">B</span>
                <span className="text-red-500 text-2xl select-none font-semibold ml-5">BizBridge</span>
              </div>
            </div>
          </div>
        </header>
        
        <div className="bg-gray-50 flex-grow pt-16 flex items-center justify-center">
          <div className="text-center">
            <svg className="animate-spin w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <p className="text-gray-600 text-lg">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header - Consistent with app pattern */}
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
            <div className="flex items-center space-x-6">
              <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate('/profile')}>
                <div>Your</div>
                <div className="font-bold">Profile</div>
              </div>
              <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate('/dashboard')}>
                <div>Your</div>
                <div className="font-bold">Dashboard</div>
              </div>
              <div className="text-xs cursor-pointer hover:text-red-400" onClick={handleLogout}>
                <div>Sign</div>
                <div className="font-bold">Out</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="bg-gray-50 flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          
          {/* Page Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h1>
                <p className="text-gray-600">Update your profile information and settings</p>
              </div>
              <button
                onClick={() => navigate('/profile')}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold transition"
              >
                Back to Profile
              </button>
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {success}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Profile Image Section */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Picture</h3>
                  
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto bg-gray-300 rounded-full overflow-hidden mb-4">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                          <span className="text-white text-4xl font-bold">
                            {(formData.name || formData.username || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <input
                      type="file"
                      id="profileImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    
                    <label
                      htmlFor="profileImage"
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition cursor-pointer inline-block"
                    >
                      {uploadingImage ? 'Uploading...' : 'Change Picture'}
                    </label>
                    
                    <p className="text-gray-500 text-sm mt-2">
                      JPG, PNG or GIF. Max size 5MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Form Section */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Basic Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username *
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Enter your username"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Enter your email"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio / Description
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Tell others about yourself..."
                    />
                  </div>
                </div>

                {/* Business Information (for Artisans) */}
                {currentUser?.role === 'artisan' && (
                  <>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Business Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Name
                          </label>
                          <input
                            type="text"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Enter your business name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Website
                          </label>
                          <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="https://your-website.com"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Specialties</h3>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {formData.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium flex items-center gap-2"
                          >
                            {specialty}
                            <button
                              type="button"
                              onClick={() => handleRemoveSpecialty(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newSpecialty}
                          onChange={(e) => setNewSpecialty(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Add a specialty (e.g., Woodworking, Metalwork)"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecialty())}
                        />
                        <button
                          type="button"
                          onClick={handleAddSpecialty}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Location */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Location</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <select
                        name="location.state"
                        value={formData.location.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="Lagos">Lagos</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Local Government Area
                      </label>
                      <select
                        name="location.lga"
                        value={formData.location.lga}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="">Select LGA</option>
                        {lagosLGAs.map(lga => (
                          <option key={lga} value={lga}>{lga}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="location.address"
                      value={formData.location.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter your address"
                    />
                  </div>
                </div>

                {/* Working Hours (for Artisans) */}
                {currentUser?.role === 'artisan' && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Working Hours</h3>
                    
                    <div className="space-y-3">
                      {Object.keys(formData.workingHours).map(day => (
                        <div key={day} className="flex items-center gap-4">
                          <div className="w-24">
                            <span className="text-sm font-medium text-gray-700 capitalize">
                              {day}:
                            </span>
                          </div>
                          <input
                            type="text"
                            name={`workingHours.${day}`}
                            value={formData.workingHours[day]}
                            onChange={handleInputChange}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="e.g., 9:00 AM - 6:00 PM or Closed"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => navigate('/profile')}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving || uploadingImage}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;