// src/components/pages/ContactUs.jsx - Updated for New Pricing System
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleHeader from '../layout/SimpleHeader';
import Footer from '../layout/Footer';

const ContactUs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userType: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        userType: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SimpleHeader activePage="contact" />

      {/* Main Content */}
      <div className="pt-24 flex-grow bg-white">
        <div className="container mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="text-sm">
              <span 
                onClick={() => navigate('/')} 
                className="text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Home
              </span>
              <span className="mx-2 text-gray-500">›</span>
              <span className="text-gray-700">Contact Us</span>
            </nav>
          </div>

          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're a customer looking for amazing artisan services or an artisan wanting to join our platform, we'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
              
              <div className="space-y-8">
                {/* Quick Contact Cards */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <div className="bg-red-500 rounded-full p-3 mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-red-700">Phone Support</h3>
                      <p className="text-gray-700 mb-2">
                        <strong>Customer Support:</strong> +234 123 456 7890<br />
                        <strong>Artisan Support:</strong> +234 123 456 7891<br />
                        <strong>Pricing & Billing:</strong> +234 123 456 7892<br />
                        <strong>Disputes & Resolution:</strong> +234 123 456 7893
                      </p>
                      <p className="text-sm text-gray-600">Available Monday - Friday, 9:00 AM - 6:00 PM WAT</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <div className="bg-blue-500 rounded-full p-3 mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-blue-700">Email Support</h3>
                      <p className="text-gray-700 mb-2">
                        <strong>General Inquiries:</strong> support@bizbridge.ng<br />
                        <strong>Technical Issues:</strong> tech@bizbridge.ng<br />
                        <strong>Dispute Resolution:</strong> disputes@bizbridge.ng<br />
                        <strong>Partnership Inquiries:</strong> partners@bizbridge.ng
                      </p>
                      <p className="text-sm text-gray-600">Response within 24 hours</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <div className="bg-green-500 rounded-full p-3 mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-green-700">Our Location</h3>
                      <p className="text-gray-700 mb-2">
                        BizBridge Nigeria<br />
                        123 Innovation Drive<br />
                        Victoria Island, Lagos<br />
                        Lagos State, Nigeria
                      </p>
                      <p className="text-sm text-gray-600">Office hours: Monday - Friday, 9:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </div>

                {/* New Pricing Support Section */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <div className="bg-purple-500 rounded-full p-3 mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-purple-700">Pricing & Payment Support</h3>
                      <p className="text-gray-700 mb-2">
                        <strong>Important:</strong> BizBridge does NOT process payments. Need help understanding our pricing models or dispute resolution? Contact us for guidance.
                      </p>
                      <div className="text-sm text-purple-600 space-y-1">
                        <p>• Fixed Pricing explanations</p>
                        <p>• Categorized Pricing benefits</p>
                        <p>• Dispute resolution process</p>
                        <p>• Service agreement guidance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-8">Send us a Message</h2>
              
              {submitSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                  <div className="bg-green-500 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Message Sent Successfully!</h3>
                  <p className="text-green-700 mb-6">
                    Thank you for contacting us. We will get back to you as soon as possible.
                  </p>
                  <button 
                    onClick={() => setSubmitSuccess(false)}
                    className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Enter your email address"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">I am a...</label>
                    <select
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Select your role</option>
                      <option value="customer">Customer looking for services</option>
                      <option value="artisan">Artisan wanting to offer services</option>
                      <option value="business">Business/Partner inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Subject *</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Question</option>
                      <option value="technical">Technical Support</option>
                      <option value="pricing">Pricing & Payment Questions</option>
                      <option value="dispute">Dispute Resolution</option>
                      <option value="categorized-pricing">Categorized Pricing Help</option>
                      <option value="account">Account Issues</option>
                      <option value="partnership">Partnership Inquiry</option>
                      <option value="feedback">Feedback & Suggestions</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-vertical"
                      placeholder="Please describe your question or concern in detail..."
                    />
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-6 rounded-md font-medium transition ${
                      isSubmitting
                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    {isSubmitting ? 'Sending Message...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">Quick Answers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold mb-2 text-gray-800">How does pricing work?</h3>
                <p className="text-gray-600 text-sm">
                  BizBridge offers three pricing models: Fixed (transparent upfront pricing), Negotiate (flexible project-based pricing), and Categorized (different prices for different service types with enhanced protection).
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold mb-2 text-gray-800">Do you process payments?</h3>
                <p className="text-gray-600 text-sm">
                  No, BizBridge does NOT process payments. All financial transactions are handled directly between customers and artisans. We provide dispute resolution and contract facilitation.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold mb-2 text-gray-800">What is Categorized Pricing?</h3>
                <p className="text-gray-600 text-sm">
                  Available for Woodworking, Metalwork, and Textile Art, this allows different prices for different service categories with enhanced BizBridge dispute protection and contract enforcement.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold mb-2 text-gray-800">How do disputes work?</h3>
                <p className="text-gray-600 text-sm">
                  We provide different levels of dispute resolution based on pricing type. Categorized pricing includes full contract enforcement, while other types receive mediation support.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold mb-2 text-gray-800">How do I become an artisan?</h3>
                <p className="text-gray-600 text-sm">
                  Create an artisan account, complete your profile with portfolio examples, set up your services with appropriate pricing, and start receiving requests from customers.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold mb-2 text-gray-800">Is BizBridge free to use?</h3>
                <p className="text-gray-600 text-sm">
                  Yes, creating an account and using basic features is free. We earn revenue through premium features and partnerships, not by taking a percentage of your transactions.
                </p>
              </div>
            </div>
            <div className="text-center mt-6">
              <span 
                onClick={() => navigate('/faq')}
                className="text-red-500 hover:text-red-600 cursor-pointer font-medium"
              >
                View More FAQs →
              </span>
            </div>
          </div>
        </div>
      </div>

      <Footer variant="full" />
    </div>
  );
};

export default ContactUs;