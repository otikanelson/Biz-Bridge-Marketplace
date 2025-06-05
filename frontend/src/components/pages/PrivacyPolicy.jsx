import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivacyPolicy = () => {
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
            <h1 className="text-4xl font-bold text-center">Privacy Policy</h1>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <p className="text-gray-700 mb-6">
                At BizBridge, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this policy carefully.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                We collect information that you provide directly to us when you:
              </p>
              <ul className="list-disc pl-8 mb-4 text-gray-700">
                <li>Create an account or profile</li>
                <li>Use our services</li>
                <li>Contact customer support</li>
                <li>Participate in surveys or promotions</li>
                <li>Communicate with artisans or customers</li>
              </ul>
              <p className="text-gray-700 mb-4">
                This information may include your name, email address, phone number, address, payment information, and any other information you choose to provide.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Information Collected Automatically</h3>
              <p className="text-gray-700 mb-4">
                When you access or use our platform, we may automatically collect information about you, including:
              </p>
              <ul className="list-disc pl-8 mb-4 text-gray-700">
                <li>Log and usage data (IP address, browser type, pages visited)</li>
                <li>Device information (device type, operating system)</li>
                <li>Location information</li>
                <li>Cookies and similar technologies</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We may use the information we collect for various purposes, including to:
              </p>
              <ul className="list-disc pl-8 mb-4 text-gray-700">
                <li>Provide, maintain, and improve our platform</li>
                <li>Process transactions and send transaction notifications</li>
                <li>Facilitate communication between artisans and customers</li>
                <li>Personalize your experience on our platform</li>
                <li>Send promotional materials and other communications</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                <li>Comply with legal obligations</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">3. Sharing of Information</h2>
              <p className="text-gray-700 mb-4">
                We may share your information with:
              </p>
              <ul className="list-disc pl-8 mb-4 text-gray-700">
                <li>Other users of our platform (e.g., when customers book services with artisans)</li>
                <li>Vendors, consultants, and other service providers who need access to such information to carry out work on our behalf</li>
                <li>In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process</li>
                <li>In connection with a merger, sale of company assets, financing, or acquisition of all or a portion of our business</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">4. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no internet or electronic communications service is ever completely secure, so we encourage you to take care to protect your personal information.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">5. Your Choices</h2>
              <h3 className="text-xl font-semibold mt-6 mb-3">Account Information</h3>
              <p className="text-gray-700 mb-4">
                You may update, correct, or delete information about you at any time by logging into your online account or emailing us at privacy@bizbridge.com. We may retain certain information as required by law or for legitimate business purposes.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Cookies</h3>
              <p className="text-gray-700 mb-4">
                Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove or reject cookies. Please note that if you choose to remove or reject cookies, this could affect the availability and functionality of our platform.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Promotional Communications</h3>
              <p className="text-gray-700 mb-4">
                You may opt out of receiving promotional emails from BizBridge by following the instructions in those emails. If you opt out, we may still send you non-promotional emails, such as those about your account or our ongoing business relations.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">6. Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our platform is not directed to children under 18 years of age, and we do not knowingly collect personal information from children under 18. If we learn we have collected personal information from a child under 18, we will delete such information.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">7. Changes to this Privacy Policy</h2>
              <p className="text-gray-700 mb-4">
                We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the bottom of the policy and, in some cases, we may provide you with additional notice. We encourage you to review the Privacy Policy whenever you access our platform to stay informed about our information practices.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">8. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-gray-700 mb-4">
                BizBridge<br />
                Attention: Privacy Officer<br />
                Email: privacy@bizbridge.com
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

export default PrivacyPolicy;