import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TermsOfService = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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
            <span onClick={() => navigate('/')} className="hover:text-red-400 cursor-pointer">Home</span>
            {!isAuthenticated ? (
              <>
                <span onClick={() => navigate('/login')} className="hover:text-red-400 cursor-pointer">Login</span>
                <span onClick={() => navigate('/signup')} className="hover:text-red-400 cursor-pointer">Sign Up</span>
                <span onClick={() => navigate('/signup?type=artisan')} className="hover:text-red-400 cursor-pointer">Get Your Service Listed</span>
              </>
            ) : (
              <span onClick={() => navigate('/dashboard')} className="hover:text-red-400 cursor-pointer">Dashboard</span>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="bg-white flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="border-y border-orange-500 py-8 mb-8">
            <h1 className="text-4xl font-bold text-center">Terms of Service</h1>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <p className="text-gray-700 mb-6">
                Welcome to BizBridge. By using our platform, you agree to comply with and be bound by the following terms and conditions. Please review them carefully.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing or using BizBridge, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">2. User Accounts</h2>
              <p className="text-gray-700 mb-4">
                To use certain features of our platform, you must register for an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
              </p>
              <p className="text-gray-700 mb-4">
                You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">3. Artisan Services</h2>
              <p className="text-gray-700 mb-4">
                BizBridge acts as a platform connecting customers with artisans. We do not guarantee the quality, safety, or legality of artisan services. Customers are encouraged to review artisan profiles, ratings, and reviews before making a booking.
              </p>
              <p className="text-gray-700 mb-4">
                Artisans are independent contractors and not employees of BizBridge. Artisans are responsible for complying with all applicable laws and regulations related to their services.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">4. Fees and Payments</h2>
              <p className="text-gray-700 mb-4">
                BizBridge may charge fees for certain services. All fees are non-refundable unless otherwise specified. Payments between customers and artisans are facilitated through our platform, and we may charge a service fee for this facilitation.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">5. User Content</h2>
              <p className="text-gray-700 mb-4">
                Users may post content, including reviews, photos, and messages. By posting content, you grant BizBridge a non-exclusive, royalty-free, perpetual, irrevocable right to use, reproduce, modify, adapt, publish, translate, and distribute such content.
              </p>
              <p className="text-gray-700 mb-4">
                You agree not to post content that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">6. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                The BizBridge name, logo, website, and all content, features, and functionality are owned by BizBridge and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                BizBridge is not liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of your use or inability to use our platform or services.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">8. Indemnification</h2>
              <p className="text-gray-700 mb-4">
                You agree to indemnify and hold harmless BizBridge and its affiliates, officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your use of our platform or services.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">9. Modification of Terms</h2>
              <p className="text-gray-700 mb-4">
                BizBridge reserves the right to modify these Terms of Service at any time. We will provide notice of significant changes by posting the new Terms of Service on our website. Your continued use of our platform after any changes constitutes acceptance of the new Terms.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">10. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These Terms of Service are governed by and construed in accordance with the laws of Nigeria, without regard to its conflict of law principles.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">11. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us at support@bizbridge.com.
              </p>
              
              <p className="text-gray-700 mt-8">
                Last updated: March 1, 2025
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <div className="flex justify-center space-x-4">
              <a href="#" className="bg-red-400 hover:bg-red-500 rounded-full p-3 flex items-center justify-center w-10 h-10">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z"/>
                  <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z"/>
                </svg>
              </a>
              <a href="#" className="bg-red-400 hover:bg-red-500 rounded-full p-3 flex items-center justify-center w-10 h-10">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="bg-red-400 hover:bg-red-500 rounded-full p-3 flex items-center justify-center w-10 h-10">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>
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

export default TermsOfService;