import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-black text-white w-full top-0 z-10 fixed">
        <div className="py-2">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center">
              <span onClick={() => navigate('/')} className="text-red-500 text-5xl select-none font-bold cursor-pointer">𐐒</span>
              <span onClick={() => navigate('/')} className="text-white text-4xl select-none font-bold cursor-pointer">B</span>
              <span onClick={() => navigate('/')} className="text-red-500 text-2xl select-none cursor-pointer font-semibold ml-5">BizBridge</span>
            </div>
            <div className="flex items-center space-x-6">
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/services?category=Woodworking')}>
                Woodworking
              </span>
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/services?category=Metalwork')}>
                Metalwork  
              </span>
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/services?category=Soap Making')}>
                Soap Making
              </span>  
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/services?category=Hair Braiding & Styling')}>
                Hair Braiding
              </span>
              <span className="cursor-pointer hover:text-red-400" onClick={() => navigate('/contact')}>
                Contact Us
              </span>
            </div>
          </div>
        </div>
      </header>

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
              <span className="text-gray-700">Privacy Policy</span>
            </nav>
          </div>

          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information when you use BizBridge's marketplace platform.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: January 2025
            </p>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  1. Information We Collect
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-red-600">Personal Information</h3>
                    <p className="text-gray-700 mb-3">
                      When you create an account, we collect information such as your name, email address, phone number, and location. For artisans, we also collect business information, skills, portfolio details, and service pricing information.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-red-600">Service & Pricing Information</h3>
                    <p className="text-gray-700 mb-3">
                      We collect information about services offered, pricing types (Fixed, Negotiate, or Categorized), service categories, and project requirements to facilitate connections between customers and artisans.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-red-600">Usage Information</h3>
                    <p className="text-gray-700 mb-3">
                      We collect information about how you use our platform, including pages visited, services viewed, searches performed, and interaction patterns to improve our service.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-red-600">Communication Data</h3>
                    <p className="text-gray-700 mb-3">
                      We store messages exchanged between customers and artisans through our platform, service agreements, and dispute resolution communications to facilitate bookings and provide support.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  2. How We Use Your Information
                </h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700"><strong>Account Management:</strong> To create and maintain your account, provide customer support, and facilitate platform features</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700"><strong>Platform Improvement:</strong> To analyze usage patterns and improve our platform features, pricing models, and user experience</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700"><strong>Safety & Security:</strong> To detect and prevent fraud, abuse, and other harmful activities on our platform</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700"><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</span>
                    </li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  3. Information Sharing
                </h2>
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2 text-yellow-800">We Do NOT Sell Your Data</h3>
                    <p className="text-yellow-700">
                      BizBridge does not sell, rent, or trade your personal information to third parties for marketing purposes.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold mb-2 text-red-600">When We Share Information</h3>
                    <ul className="text-gray-700 space-y-2 list-disc pl-6">
                      <li><strong>Between Users:</strong> We share relevant information between customers and artisans to facilitate services (contact details, project requirements, pricing agreements)</li>
                      <li><strong>Service Providers:</strong> We may share data with trusted service providers who help us operate our platform (hosting, analytics, customer support)</li>
                      <li><strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our users and platform</li>
                      <li><strong>Business Transfers:</strong> In the event of a merger or acquisition, user data may be transferred as part of business assets</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-2 text-blue-800">Important: No Payment Data</h3>
                    <p className="text-blue-700">
                      Since BizBridge does not process payments, we do not collect, store, or share any payment card information or financial data. All payment arrangements are handled directly between users.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  4. Data Security
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Technical Safeguards</h4>
                      <ul className="text-green-700 text-sm space-y-1">
                        <li>• Encrypted data transmission (SSL/TLS)</li>
                        <li>• Secure data storage</li>
                        <li>• Regular security updates</li>
                        <li>• Access controls and authentication</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Organizational Measures</h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Limited access to personal data</li>
                        <li>• Employee training on data protection</li>
                        <li>• Regular security assessments</li>
                        <li>• Incident response procedures</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  5. Your Rights and Choices
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    You have certain rights regarding your personal information, depending on your location:
                  </p>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold mb-3 text-gray-800">Your Data Rights</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                        <div>
                          <span className="font-medium text-gray-800">Access:</span>
                          <span className="text-gray-700"> Request a copy of the personal information we hold about you</span>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                        <div>
                          <span className="font-medium text-gray-800">Correction:</span>
                          <span className="text-gray-700"> Update or correct inaccurate information in your profile</span>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                        <div>
                          <span className="font-medium text-gray-800">Deletion:</span>
                          <span className="text-gray-700"> Request deletion of your account and associated data (subject to legal requirements)</span>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</span>
                        <div>
                          <span className="font-medium text-gray-800">Portability:</span>
                          <span className="text-gray-700"> Receive your data in a portable format</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  6. Data Retention
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    We retain your personal information for as long as necessary to provide our services and comply with legal obligations.
                  </p>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-2 text-orange-800">Retention Periods</h3>
                    <ul className="text-orange-700 space-y-1">
                      <li>• Active accounts: Data retained while account is active</li>
                      <li>• Service agreements: Retained for 7 years for legal compliance</li>
                      <li>• Communication records: Retained for 3 years for dispute resolution</li>
                      <li>• Usage analytics: Anonymized data may be retained indefinitely</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  7. Cookies and Tracking
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    We use cookies and similar technologies to improve your experience on our platform:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Essential Cookies</h4>
                      <p className="text-green-700 text-sm">
                        Required for basic platform functionality and security.
                      </p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Performance Cookies</h4>
                      <p className="text-blue-700 text-sm">
                        Help us understand how users interact with our platform.
                      </p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-2">Preference Cookies</h4>
                      <p className="text-purple-700 text-sm">
                        Remember your preferences and settings.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  8. Children's Privacy
                </h2>
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-2 text-red-800">Age Restriction</h3>
                    <p className="text-red-700">
                      BizBridge is not intended for use by children under 16 years of age. We do not knowingly collect personal information from children under 16.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  9. International Data Transfers
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during such transfers.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  10. Changes to This Policy
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on our platform and updating the "Last updated" date.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  11. Contact Us
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    If you have questions about this privacy policy or how we handle your personal information, please contact us:
                  </p>
                  <div className="text-center">
                    <button 
                      onClick={() => navigate('/contact')}
                      className="bg-red-500 text-white py-3 px-8 rounded-md hover:bg-red-600 transition font-medium"
                    >
                      Contact Privacy Team
                    </button>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          {/* Social Media Icons */}
          <div className="text-center mb-8">
            <div className="flex justify-center space-x-4">
              <a href="#" className="bg-red-500 hover:bg-red-600 rounded-full p-3 flex items-center justify-center w-12 h-12 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="bg-red-500 hover:bg-red-600 rounded-full p-3 flex items-center justify-center w-12 h-12 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="bg-red-500 hover:bg-red-600 rounded-full p-3 flex items-center justify-center w-12 h-12 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.40z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Footer Links */}
          <div className="text-center">
            <p className="mb-4">&copy; {new Date().getFullYear()} BizBridge. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <span onClick={() => navigate('/terms')} className="text-red-400 hover:text-red-300 cursor-pointer transition">Terms of Service</span>
              <span onClick={() => navigate('/privacy')} className="text-red-400 hover:text-red-300 cursor-pointer transition">Privacy Policy</span>
              <span onClick={() => navigate('/contact')} className="text-red-400 hover:text-red-300 cursor-pointer transition">Contact Us</span>
              <span onClick={() => navigate('/faq')} className="text-red-400 hover:text-red-300 cursor-pointer transition">FAQ</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;