import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, userType, logout } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    // Common fields
    email: '',
    username: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
    
    // Customer specific fields
    firstName: '',
    lastName: '',
    phoneNumber: '',
    
    // Artisan specific fields
    contactName: '',
    contactPhone: '',
    businessName: '',
    biography: '',
    location: '',
    contactAddress: '',
    websiteURL: '',
    businessHours: '',
    cacRegistered: false,
    yearEstablished: '',
    profileImage: null
  });
  
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Mock artisan skills data
  const [skills, setSkills] = useState([
    { id: 1, name: 'Woodworking', level: 'Expert' },
    { id: 2, name: 'Furniture Design', level: 'Advanced' },
    { id: 3, name: 'Wood Carving', level: 'Intermediate' }
  ]);
  
  // Load initial profile data
  useEffect(() => {
    if (currentUser) {
      if (userType === 'customer') {
        // Mock customer data
        setProfileData({
          ...profileData,
          email: currentUser.email || '',
          username: currentUser.username || '',
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '+234 800 123 4567',
          profileImage: 'https://via.placeholder.com/150'
        });
      } else if (userType === 'artisan') {
        // Mock artisan data
        setProfileData({
          ...profileData,
          email: currentUser.email || '',
          contactName: currentUser.contactName || '',
          contactPhone: currentUser.phone || '+234 800 987 6543',
          businessName: currentUser.businessName || 'Creative Woodworking',
          biography: 'Experienced woodworker specializing in custom furniture and wood carvings. Serving clients in Lagos since 2018.',
          location: 'Lagos',
          contactAddress: '123 Craftsman Avenue, Lekki, Lagos',
          websiteURL: 'https://creativewoodworking.ng',
          businessHours: 'Mon-Fri: 9AM-5PM, Sat: 10AM-2PM',
          cacRegistered: true,
          yearEstablished: '2018',
          profileImage: 'https://via.placeholder.com/150'
        });
      }
    }
  }, [currentUser, userType]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setProfileData({
        ...profileData,
        [name]: files[0]
      });
    } else if (type === 'checkbox') {
      setProfileData({
        ...profileData,
        [name]: checked
      });
    } else {
      setProfileData({
        ...profileData,
        [name]: value
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (userType === 'customer') {
      if (!profileData.email) newErrors.email = 'Email is required';
      if (!profileData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    } else if (userType === 'artisan') {
      if (!profileData.email) newErrors.email = 'Email is required';
      if (!profileData.contactName) newErrors.contactName = 'Contact name is required';
      if (!profileData.contactPhone) newErrors.contactPhone = 'Phone number is required';
      if (!profileData.businessName) newErrors.businessName = 'Business name is required';
      if (!profileData.location) newErrors.location = 'Location is required';
    }
    
    if (profileData.newPassword && profileData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (profileData.newPassword !== profileData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveError('');
    
    if (validateForm()) {
      setIsSaving(true);
      
      try {
        // Simulate API call to update profile
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, you would send the updated profile data to the backend
        console.log('Profile Updated:', profileData);
        
        setSaveSuccess(true);
        setIsEditing(false);
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } catch (error) {
        console.error('Profile update error:', error);
        setSaveError('Failed to update profile. Please try again.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (profileData.newPassword) {
      // Simulate password update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Close modal and show success message
      setShowPasswordModal(false);
      setSaveSuccess(true);
      
      // Reset form fields
      setProfileData({
        ...profileData,
        password: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }
  };

  const handleDeleteAccount = async () => {
    // Simulate account deletion
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you would send a request to delete the account
    logout();
    navigate('/');
  };

  const handleAddSkill = () => {
    const newSkill = {
      id: Date.now(), // Simple ID generation
      name: 'New Skill',
      level: 'Beginner'
    };
    
    setSkills([...skills, newSkill]);
  };

  const handleUpdateSkill = (id, field, value) => {
    setSkills(skills.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    ));
  };

  const handleRemoveSkill = (id) => {
    setSkills(skills.filter(skill => skill.id !== id));
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
            {userType === 'customer' && (
              <span onClick={() => navigate('/bookings')} className="hover:text-red-400 cursor-pointer">My Bookings</span>
            )}
            {userType === 'artisan' && (
              <span onClick={() => navigate('/services')} className="hover:text-red-400 cursor-pointer">My Services</span>
            )}
            <span onClick={handleLogout} className="hover:text-red-400 cursor-pointer">Logout</span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="bg-white flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>
          
          {saveSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <span className="font-bold">Success!</span> Your profile has been updated.
            </div>
          )}
          
          {saveError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <span className="font-bold">Error:</span> {saveError}
            </div>
          )}
          
          <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
            <div className="p-6">
              <div className="flex flex-wrap md:flex-nowrap">
                {/* Profile Image */}
                <div className="w-full md:w-auto mb-6 md:mb-0 md:mr-8">
                  <div className="relative w-32 h-32 mx-auto md:mx-0">
                    <img 
                      src={profileData.profileImage || 'https://via.placeholder.com/150'} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-full object-cover"
                    />
                    {isEditing && (
                      <label htmlFor="profileImage" className="absolute bottom-0 right-0 bg-red-500 text-white rounded-full p-2 cursor-pointer hover:bg-red-600 transition">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input
                          type="file"
                          id="profileImage"
                          name="profileImage"
                          onChange={handleChange}
                          className="hidden"
                          accept="image/*"
                        />
                      </label>
                    )}
                  </div>
                  {isEditing ? (
                    <div className="mt-4 text-center md:text-left">
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Change Password
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 text-center md:text-left">
                      <h2 className="text-xl font-semibold">
                        {userType === 'customer' 
                          ? `${profileData.firstName} ${profileData.lastName}`
                          : profileData.contactName
                        }
                      </h2>
                      <p className="text-gray-600">
                        {userType === 'customer' ? 'Customer' : 'Artisan'}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Profile Details */}
                <div className="flex-1 w-full">
                  <div className="flex justify-between mb-6">
                    <h2 className="text-xl font-semibold">
                      {isEditing ? 'Edit Profile' : 'Profile Information'}
                    </h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                  
                  <form onSubmit={handleSaveProfile}>
                    {/* Customer Profile Form */}
                    {userType === 'customer' && (
                      <div className={`${isEditing ? 'space-y-4' : ''}`}>
                        {isEditing ? (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-gray-700 mb-2">First Name</label>
                                <input
                                  type="text"
                                  name="firstName"
                                  value={profileData.firstName}
                                  onChange={handleChange}
                                  className="w-full p-2 border border-gray-300 rounded"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-700 mb-2">Last Name</label>
                                <input
                                  type="text"
                                  name="lastName"
                                  value={profileData.lastName}
                                  onChange={handleChange}
                                  className="w-full p-2 border border-gray-300 rounded"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-gray-700 mb-2">Email</label>
                                <input
                                  type="email"
                                  name="email"
                                  value={profileData.email}
                                  onChange={handleChange}
                                  className="w-full p-2 border border-gray-300 rounded"
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                              </div>
                              <div>
                                <label className="block text-gray-700 mb-2">Phone Number</label>
                                <input
                                  type="tel"
                                  name="phoneNumber"
                                  value={profileData.phoneNumber}
                                  onChange={handleChange}
                                  className="w-full p-2 border border-gray-300 rounded"
                                />
                                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                              </div>
                            </div>
                            <div>
                              <label className="block text-gray-700 mb-2">Username</label>
                              <input
                                type="text"
                                name="username"
                                value={profileData.username}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded"
                              />
                            </div>
                          </>
                        ) : (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                              <div>
                                <p className="text-sm text-gray-500">First Name</p>
                                <p className="font-medium">{profileData.firstName}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Last Name</p>
                                <p className="font-medium">{profileData.lastName}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{profileData.email}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Phone Number</p>
                                <p className="font-medium">{profileData.phoneNumber}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Username</p>
                                <p className="font-medium">{profileData.username}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Artisan Profile Form */}
                    {userType === 'artisan' && (
                      <div className={`${isEditing ? 'space-y-4' : ''}`}>
                        {isEditing ? (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-gray-700 mb-2">Contact Name</label>
                                <input
                                  type="text"
                                  name="contactName"
                                  value={profileData.contactName}
                                  onChange={handleChange}
                                  className="w-full p-2 border border-gray-300 rounded"
                                />
                                {errors.contactName && <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>}
                              </div>
                              <div>
                                <label className="block text-gray-700 mb-2">Business Name</label>
                                <input
                                  type="text"
                                  name="businessName"
                                  value={profileData.businessName}
                                  onChange={handleChange}
                                  className="w-full p-2 border border-gray-300 rounded"
                                />
                                {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-gray-700 mb-2">Email</label>
                                <input
                                  type="email"
                                  name="email"
                                  value={profileData.email}
                                  onChange={handleChange}
                                  className="w-full p-2 border border-gray-300 rounded"
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                              </div>
                              <div>
                                <label className="block text-gray-700 mb-2">Contact Phone</label>
                                <input
                                  type="tel"
                                  name="contactPhone"
                                  value={profileData.contactPhone}
                                  onChange={handleChange}
                                  className="w-full p-2 border border-gray-300 rounded"
                                />
                                {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
                              </div>
                            </div>
                            <div>
                              <label className="block text-gray-700 mb-2">Biography</label>
                              <textarea
                                name="biography"
                                value={profileData.biography}
                                onChange={handleChange}
                                rows="3"
                                className="w-full p-2 border border-gray-300 rounded"
                              ></textarea>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-gray-700 mb-2">Location</label>
                                <select
                                  name="location"
                                  value={profileData.location}
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
                              <div>
                                <label className="block text-gray-700 mb-2">Year Established</label>
                                <input
                                  type="text"
                                  name="yearEstablished"
                                  value={profileData.yearEstablished}
                                  onChange={handleChange}
                                  className="w-full p-2 border border-gray-300 rounded"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-gray-700 mb-2">Contact Address</label>
                              <input
                                type="text"
                                name="contactAddress"
                                value={profileData.contactAddress}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded"
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-gray-700 mb-2">Website URL</label>
                                <input
                                  type="url"
                                  name="websiteURL"
                                  value={profileData.websiteURL}
                                  onChange={handleChange}
                                  className="w-full p-2 border border-gray-300 rounded"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-700 mb-2">Business Hours</label>
                                <input
                                  type="text"
                                  name="businessHours"
                                  value={profileData.businessHours}
                                  onChange={handleChange}
                                  className="w-full p-2 border border-gray-300 rounded"
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="cacRegistered"
                                  name="cacRegistered"
                                  checked={profileData.cacRegistered}
                                  onChange={handleChange}
                                  className="mr-2"
                                />
                                <label htmlFor="cacRegistered" className="text-gray-700">
                                  Registered with CAC
                                </label>
                              </div>
                            </div>
                            
                            {/* Skills Section for Artisans */}
                            <div className="mt-6">
                              <div className="flex justify-between items-center mb-2">
                                <label className="block text-gray-700 font-medium">Skills & Expertise</label>
                                <button 
                                  type="button"
                                  onClick={handleAddSkill}
                                  className="text-sm text-red-500 hover:text-red-700"
                                >
                                  + Add Skill
                                </button>
                              </div>
                              
                              {skills.map((skill, index) => (
                                <div key={skill.id} className="flex flex-wrap items-center mb-2 pb-2 border-b border-gray-200 last:border-0">
                                  <div className="w-full sm:w-1/2 mb-2 sm:mb-0">
                                    <input
                                      type="text"
                                      value={skill.name}
                                      onChange={(e) => handleUpdateSkill(skill.id, 'name', e.target.value)}
                                      className="w-full p-2 border border-gray-300 rounded"
                                      placeholder="Skill name"
                                    />
                                  </div>
                                  <div className="w-full sm:w-1/3 sm:px-2 mb-2 sm:mb-0">
                                    <select
                                      value={skill.level}
                                      onChange={(e) => handleUpdateSkill(skill.id, 'level', e.target.value)}
                                      className="w-full p-2 border border-gray-300 rounded"
                                    >
                                      <option value="Beginner">Beginner</option>
                                      <option value="Intermediate">Intermediate</option>
                                      <option value="Advanced">Advanced</option>
                                      <option value="Expert">Expert</option>
                                    </select>
                                  </div>
                                  <div className="w-full sm:w-auto">
                                    <button 
                                      type="button"
                                      onClick={() => handleRemoveSkill(skill.id)}
                                      className="text-red-500 hover:text-red-700 ml-2"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg font-semibold mb-2">{profileData.businessName}</h3>
                              <p className="text-gray-700">{profileData.biography}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                              <div>
                                <p className="text-sm text-gray-500">Contact Name</p>
                                <p className="font-medium">{profileData.contactName}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{profileData.email}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium">{profileData.contactPhone}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Location</p>
                                <p className="font-medium">{profileData.location}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="font-medium">{profileData.contactAddress}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Business Hours</p>
                                <p className="font-medium">{profileData.businessHours}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Website</p>
                                <p className="font-medium">
                                  {profileData.websiteURL ? (
                                    <a href={profileData.websiteURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{profileData.websiteURL}</a>
                                  ) : (
                                    'Not provided'
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Year Established</p>
                                <p className="font-medium">{profileData.yearEstablished}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">CAC Registration</p>
                                <p className="font-medium">{profileData.cacRegistered ? 'Yes' : 'No'}</p>
                              </div>
                            </div>
                            
                            {/* Skills Display */}
                            <div>
                              <p className="text-sm text-gray-500 mb-2">Skills & Expertise</p>
                              <div className="flex flex-wrap gap-2">
                                {skills.map(skill => (
                                  <div key={skill.id} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                                    {skill.name} ({skill.level})
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Form Buttons */}
                    {isEditing && (
                      <div className="flex justify-between mt-8">
                        <button 
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setErrors({});
                          }}
                          className="bg-gray-300 text-gray-800 py-2 px-6 rounded hover:bg-gray-400 transition"
                        >
                          Cancel
                        </button>
                        <div className="flex space-x-4">
                          <button 
                            type="button"
                            onClick={() => setShowDeleteModal(true)}
                            className="bg-red-100 text-red-600 py-2 px-6 rounded hover:bg-red-200 transition"
                          >
                            Delete Account
                          </button>
                          <button 
                            type="submit"
                            className={`bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                            disabled={isSaving}
                          >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Additional sections */}
          {userType === 'customer' && (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <div className="bg-white border rounded-lg overflow-hidden shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <div className="flex justify-between">
                      <p className="font-medium">Custom Wooden Table</p>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Upcoming</span>
                    </div>
                    <p className="text-sm text-gray-600">Natural Creations - Mar 20, 2025</p>
                    <div className="flex justify-end mt-2">
                      <button className="text-sm text-blue-600 hover:text-blue-800">View Details</button>
                    </div>
                  </div>
                  <div className="border-b pb-4">
                    <div className="flex justify-between">
                      <p className="font-medium">Handcrafted Leather Wallet</p>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Completed</span>
                    </div>
                    <p className="text-sm text-gray-600">Precision Leather - Feb 10, 2025</p>
                    <div className="flex justify-end mt-2">
                      <button className="text-sm text-blue-600 hover:text-blue-800">View Details</button>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <button 
                    onClick={() => navigate('/bookings')}
                    className="text-red-500 hover:text-red-600"
                  >
                    View All Bookings
                  </button>
                </div>
              </div>
              
              {/* Saved Artisans */}
              <div className="bg-white border rounded-lg overflow-hidden shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Saved Artisans</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center">
                      <img src="https://via.placeholder.com/40" alt="Artisan" className="w-10 h-10 rounded-full object-cover mr-3" />
                      <div>
                        <p className="font-medium">Elegant Gems</p>
                        <p className="text-sm text-gray-600">Jewelry Making</p>
                      </div>
                    </div>
                    <button 
                      className="text-sm text-blue-600 hover:text-blue-800"
                      onClick={() => navigate('/artisan/201')}
                    >
                      View Profile
                    </button>
                  </div>
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center">
                      <img src="https://via.placeholder.com/40" alt="Artisan" className="w-10 h-10 rounded-full object-cover mr-3" />
                      <div>
                        <p className="font-medium">Heritage Fabrics</p>
                        <p className="text-sm text-gray-600">Textile Art</p>
                      </div>
                    </div>
                    <button 
                      className="text-sm text-blue-600 hover:text-blue-800"
                      onClick={() => navigate('/artisan/203')}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <button className="text-red-500 hover:text-red-600">View All Saved Artisans</button>
                </div>
              </div>
            </div>
          )}
          
          {userType === 'artisan' && (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Services */}
              <div className="bg-white border rounded-lg overflow-hidden shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Your Services</h2>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <div className="flex justify-between">
                      <p className="font-medium">Custom Furniture Making</p>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                    </div>
                    <p className="text-sm text-gray-600">From ₦75,000</p>
                    <div className="flex justify-end mt-2">
                      <button className="text-sm text-blue-600 hover:text-blue-800 mr-4">Edit</button>
                      <button className="text-sm text-red-600 hover:text-red-800">Deactivate</button>
                    </div>
                  </div>
                  <div className="border-b pb-4">
                    <div className="flex justify-between">
                      <p className="font-medium">Wood Carving</p>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                    </div>
                    <p className="text-sm text-gray-600">From ₦25,000</p>
                    <div className="flex justify-end mt-2">
                      <button className="text-sm text-blue-600 hover:text-blue-800 mr-4">Edit</button>
                      <button className="text-sm text-red-600 hover:text-red-800">Deactivate</button>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <button 
                    onClick={() => navigate('/services')}
                    className="text-red-500 hover:text-red-600"
                  >
                    Manage All Services
                  </button>
                </div>
              </div>
              
              {/* Recent Requests */}
              <div className="bg-white border rounded-lg overflow-hidden shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Service Requests</h2>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <div className="flex justify-between">
                      <p className="font-medium">Custom Dining Table</p>
                      <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Pending</span>
                    </div>
                    <p className="text-sm text-gray-600">From: James Anderson</p>
                    <p className="text-sm text-gray-600">Proposed Date: Mar 20, 2025</p>
                    <div className="flex justify-end mt-2">
                      <button className="text-sm text-blue-600 hover:text-blue-800">View Details</button>
                    </div>
                  </div>
                  <div className="border-b pb-4">
                    <div className="flex justify-between">
                      <p className="font-medium">Decorative Wall Shelf</p>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Accepted</span>
                    </div>
                    <p className="text-sm text-gray-600">From: Linda Wright</p>
                    <p className="text-sm text-gray-600">Proposed Date: Mar 15, 2025</p>
                    <div className="flex justify-end mt-2">
                      <button className="text-sm text-blue-600 hover:text-blue-800">View Details</button>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <button className="text-red-500 hover:text-red-600">View All Requests</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Change Password</h3>
            <form onSubmit={handleUpdatePassword}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    name="password"
                    value={profileData.password}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={profileData.newPassword}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                    minLength="6"
                  />
                  {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={profileData.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Delete Account</h3>
            <p className="mb-4">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

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

export default Profile;