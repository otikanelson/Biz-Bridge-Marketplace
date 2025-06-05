import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const FAQ = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Create state to track which FAQ item is open
  const [openItems, setOpenItems] = useState({});
  
  // Function to toggle FAQ items
  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // FAQ data - structured by category
  const faqData = {
    general: [
      {
        id: 'general-1',
        question: 'What is BizBridge?',
        answer: 'BizBridge is a platform that connects skilled artisans with customers looking for quality craftsmanship. We aim to promote and preserve traditional crafts while providing artisans with a digital presence to expand their reach.'
      },
      {
        id: 'general-2',
        question: 'How does BizBridge work?',
        answer: 'BizBridge allows artisans to create profiles and list their services. Customers can browse these services, view portfolios, read reviews, and book services directly through our platform. We handle the connection and facilitate communication between artisans and customers.'
      },
      {
        id: 'general-3',
        question: 'Is BizBridge available throughout Nigeria?',
        answer: 'Yes, BizBridge is available across Nigeria. However, service availability may vary depending on the location of artisans. We are continually expanding our network to include more artisans from different regions.'
      },
      {
        id: 'general-4',
        question: 'Do I need to create an account to use BizBridge?',
        answer: 'Yes, both artisans and customers need to create an account to fully utilize our platform. Creating an account allows you to book services, save favorite artisans, receive notifications, and manage your profile.'
      }
    ],
    customers: [
      {
        id: 'customer-1',
        question: 'How do I find an artisan on BizBridge?',
        answer: 'You can search for artisans based on service category, location, ratings, and availability. Our search filters help you narrow down options to find the perfect match for your needs. You can also browse featured artisans on our homepage.'
      },
      {
        id: 'customer-2',
        question: 'How do I book a service?',
        answer: 'To book a service, navigate to the artisan\'s profile, select the service you\'re interested in, choose your preferred date and time, provide any specific requirements, and confirm your booking. You\'ll receive a confirmation notification once the artisan accepts your booking.'
      },
      {
        id: 'customer-3',
        question: 'Can I cancel a booking?',
        answer: 'Yes, you can cancel a booking through your dashboard. Please note that cancellation policies may vary by artisan, and some may charge a cancellation fee depending on how close to the service date you cancel. We recommend canceling as early as possible if needed.'
      },
      {
        id: 'customer-4',
        question: 'How do I pay for services?',
        answer: 'BizBridge offers secure payment options including credit/debit cards, bank transfers, and mobile payment solutions. You can either pay the full amount upfront or, for certain services, pay a deposit at booking and the remainder upon completion.'
      },
      {
        id: 'customer-5',
        question: 'What if I\'m not satisfied with the service?',
        answer: 'If you\'re not satisfied with a service, we encourage you to first communicate directly with the artisan to resolve the issue. If that doesn\'t work, you can report the issue to our customer support team through your dashboard, and we\'ll help mediate and find a resolution.'
      }
    ],
    artisans: [
      {
        id: 'artisan-1',
        question: 'How do I register as an artisan?',
        answer: 'To register as an artisan, click on "Get Your Service Listed" on our homepage, complete the registration form with your personal and business details, and submit any required documentation. Our team will review your application and activate your account once approved.'
      },
      {
        id: 'artisan-2',
        question: 'Is there a fee to list my services on BizBridge?',
        answer: 'Basic registration and listing on BizBridge is free. However, we have premium options available for enhanced visibility and additional features. We charge a small commission on bookings made through our platform.'
      },
      {
        id: 'artisan-3',
        question: 'How do I receive payments for my services?',
        answer: 'When a customer books and pays for your service, the payment is held securely until the service is completed. Once the service is marked as complete and the customer confirms satisfaction, the payment is released to your account minus our platform fee. You can withdraw funds to your bank account at any time.'
      },
      {
        id: 'artisan-4',
        question: 'How can I improve my visibility on the platform?',
        answer: 'To improve your visibility: complete your profile with high-quality photos of your work, respond promptly to inquiries, encourage satisfied customers to leave reviews, regularly update your availability calendar, and consider our premium listing options for featured placement.'
      },
      {
        id: 'artisan-5',
        question: 'What happens if a customer cancels a booking?',
        answer: 'If a customer cancels a booking, you\'ll be notified immediately. Depending on your cancellation policy and how close to the service date the cancellation occurs, you may receive a full or partial payment. You can set your own cancellation policy in your profile settings.'
      }
    ],
    technical: [
      {
        id: 'technical-1',
        question: 'Is my personal information secure on BizBridge?',
        answer: 'Yes, we take data security seriously. We use encryption and secure protocols to protect your personal and payment information. We do not share your data with third parties without your consent, except as required for service fulfillment or by law.'
      },
      {
        id: 'technical-2',
        question: 'How do I reset my password?',
        answer: 'To reset your password, click on "Login", then select "Forgot password?". Enter your registered email address, and we\'ll send you a link to reset your password. If you don\'t receive the email, check your spam folder or contact our support team.'
      },
      {
        id: 'technical-3',
        question: 'Can I use BizBridge on my mobile device?',
        answer: 'Yes, BizBridge is fully responsive and works on all mobile devices. You can access all features through your mobile browser. We also have plans to launch dedicated iOS and Android apps in the near future for an enhanced mobile experience.'
      },
      {
        id: 'technical-4',
        question: 'What should I do if I encounter a technical issue?',
        answer: 'If you encounter any technical issues, first try refreshing your browser or clearing your cache. If the problem persists, please contact our technical support team via the "Contact Us" page, providing as much detail as possible about the issue, including screenshots if applicable.'
      }
    ]
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
            <h1 className="text-4xl font-bold text-center">Frequently Asked Questions</h1>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* FAQ Search Box */}
            <div className="mb-12">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for answers..."
                  className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <div className="absolute left-4 top-4">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* General Questions */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-red-500">General Questions</h2>
              <div className="space-y-4">
                {faqData.general.map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      className="flex justify-between items-center w-full p-4 text-left font-medium focus:outline-none"
                      onClick={() => toggleItem(item.id)}
                    >
                      <span>{item.question}</span>
                      <svg
                        className={`w-5 h-5 transition-transform ${openItems[item.id] ? 'transform rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openItems[item.id] && (
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* For Customers */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-red-500">For Customers</h2>
              <div className="space-y-4">
                {faqData.customers.map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      className="flex justify-between items-center w-full p-4 text-left font-medium focus:outline-none"
                      onClick={() => toggleItem(item.id)}
                    >
                      <span>{item.question}</span>
                      <svg
                        className={`w-5 h-5 transition-transform ${openItems[item.id] ? 'transform rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openItems[item.id] && (
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* For Artisans */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-red-500">For Artisans</h2>
              <div className="space-y-4">
                {faqData.artisans.map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      className="flex justify-between items-center w-full p-4 text-left font-medium focus:outline-none"
                      onClick={() => toggleItem(item.id)}
                    >
                      <span>{item.question}</span>
                      <svg
                        className={`w-5 h-5 transition-transform ${openItems[item.id] ? 'transform rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openItems[item.id] && (
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Technical Support */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-red-500">Technical Support</h2>
              <div className="space-y-4">
                {faqData.technical.map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      className="flex justify-between items-center w-full p-4 text-left font-medium focus:outline-none"
                      onClick={() => toggleItem(item.id)}
                    >
                      <span>{item.question}</span>
                      <svg
                        className={`w-5 h-5 transition-transform ${openItems[item.id] ? 'transform rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openItems[item.id] && (
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Still Have Questions Section */}
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
              <p className="text-gray-700 mb-6">
                If you couldn't find the answer to your question, feel free to contact our support team.
              </p>
              <button 
                onClick={() => navigate('/contact')}
                className="bg-red-500 text-white py-3 px-8 rounded-md hover:bg-red-600 transition"
              >
                Contact Us
              </button>
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

export default FAQ;