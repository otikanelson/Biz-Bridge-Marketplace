// src/components/pages/TermsOfService.jsx - Updated for New Pricing System
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleHeader from '../layout/SimpleHeader';
import Footer from '../layout/Footer';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <SimpleHeader activePage="terms" />

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
              <span className="text-gray-700">Terms of Service</span>
            </nav>
          </div>

          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These terms govern your use of BizBridge. By using our platform, you agree to these terms and our commitment to facilitating connections between customers and artisans.
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
                  1. Platform Overview
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    BizBridge is a marketplace platform that connects customers with skilled artisans in Nigeria. We facilitate connections, communication, and service agreements between users but do not directly provide services or process payments.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-2 text-blue-800">Important Notice</h3>
                    <p className="text-blue-700">
                      <strong>BizBridge does NOT process payments.</strong> All financial transactions must be handled directly between customers and artisans. We provide dispute resolution support and facilitate the creation of service agreements.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  2. User Responsibilities
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-red-600">For Customers</h3>
                    <ul className="text-gray-700 space-y-2 list-disc pl-6">
                      <li>Provide accurate project requirements and specifications</li>
                      <li>Communicate clearly about timelines and expectations</li>
                      <li>Handle all payments directly with artisans</li>
                      <li>Report issues promptly through our dispute resolution system</li>
                      <li>Respect artisans' expertise and pricing decisions</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-red-600">For Artisans</h3>
                    <ul className="text-gray-700 space-y-2 list-disc pl-6">
                      <li>Provide accurate service descriptions and pricing information</li>
                      <li>Deliver services as described and agreed upon</li>
                      <li>Maintain professional communication with customers</li>
                      <li>Honor your pricing commitments, especially for categorized services</li>
                      <li>Complete projects within agreed timelines</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  3. Service Pricing & Payment Terms
                </h2>
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="font-semibold mb-3 text-yellow-800">No Payment Processing</h3>
                    <p className="text-yellow-700 mb-3">
                      BizBridge does not process, hold, or facilitate payments. All financial transactions are the responsibility of customers and artisans.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Fixed Pricing</h4>
                      <p className="text-green-700 text-sm">
                        Transparent, upfront pricing. Customers know exactly what they'll pay before booking.
                      </p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Negotiate Pricing</h4>
                      <p className="text-blue-700 text-sm">
                        Flexible pricing based on project requirements. Artisans provide quotes after reviewing customer needs.
                      </p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-2">Categorized Pricing</h4>
                      <p className="text-purple-700 text-sm">
                        Different prices for different service categories with enhanced BizBridge dispute protection.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  4. Service Agreements & Contracts
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    When a service request is accepted, BizBridge automatically generates a service agreement between the customer and artisan. This contract outlines the agreed terms, pricing, and project specifications.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold mb-3 text-gray-800">Contract Protection Levels</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                        <div>
                          <span className="font-medium text-gray-800">Basic Protection:</span>
                          <span className="text-gray-700"> Contract facilitation and basic dispute mediation for Fixed and Negotiate pricing.</span>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                        <div>
                          <span className="font-medium text-gray-800">Enhanced Protection:</span>
                          <span className="text-gray-700"> Full contract enforcement and comprehensive dispute resolution for Categorized pricing services.</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  5. Dispute Resolution
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    BizBridge provides dispute resolution services to help resolve conflicts between customers and artisans. Our level of involvement depends on the service pricing type.
                  </p>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <h3 className="font-semibold mb-3 text-orange-800">Dispute Resolution Process</h3>
                    <ol className="space-y-2 text-orange-700">
                      <li><strong>1. Filing:</strong> Either party can file a dispute through the platform</li>
                      <li><strong>2. Review:</strong> BizBridge reviews the case and contract terms</li>
                      <li><strong>3. Mediation:</strong> We facilitate communication between parties</li>
                      <li><strong>4. Resolution:</strong> For categorized services, we provide binding mediation</li>
                    </ol>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  6. Account Requirements
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-red-600">Account Creation</h3>
                    <p className="text-gray-700 mb-3">
                      Users must provide accurate information when creating accounts. You are responsible for maintaining the security of your account credentials.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-red-600">Artisan Verification</h3>
                    <p className="text-gray-700 mb-3">
                      Artisans may be subject to additional verification requirements to ensure service quality and platform safety.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  7. Intellectual Property
                </h2>
                <div className="space-y-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-2 text-purple-800">User Content</h3>
                    <p className="text-purple-700">
                      You retain ownership of content you upload, but grant BizBridge permission to display it on the platform for facilitating connections.
                    </p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-2 text-purple-800">Platform Content</h3>
                    <p className="text-purple-700">
                      BizBridge's platform, including design, code, and functionality, is protected by intellectual property laws. Users may not copy, modify, or distribute our platform without permission.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  8. Privacy and Data Protection
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Your privacy is important to us. Our use of your personal information is governed by our Privacy Policy, which is incorporated into these terms by reference.
                  </p>
                  <div className="flex items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <button 
                      onClick={() => navigate('/privacy')}
                      className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition font-medium"
                    >
                      Read Our Privacy Policy
                    </button>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  9. Limitation of Liability
                </h2>
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="font-semibold mb-3 text-yellow-800">Platform Role</h3>
                    <p className="text-yellow-700 mb-3">
                      BizBridge acts as a marketplace facilitator. We do not directly provide services or guarantee the quality of work performed by artisans.
                    </p>
                    <ul className="text-yellow-700 space-y-1">
                      <li>• Artisans are independent contractors</li>
                      <li>• We facilitate connections but don't control service delivery</li>
                      <li>• Users are responsible for their own interactions</li>
                      <li>• We provide dispute resolution assistance based on service type</li>
                      <li>• Payment processing is entirely between users</li>
                    </ul>
                  </div>
                  
                  <p className="text-gray-700">
                    To the maximum extent permitted by law, BizBridge's liability is limited to the extent of our platform facilitation services. We are not liable for financial transactions between users.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  10. Termination
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Either party may terminate their account at any time. BizBridge reserves the right to suspend or terminate accounts for violations of these terms or harmful behavior.
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-2 text-red-800">Upon Termination</h3>
                    <p className="text-red-700">
                      Existing service agreements and disputes will continue to be honored according to the terms established at the time of service booking.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  11. Changes to Terms
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    We may update these terms to reflect changes in our services or legal requirements. Users will be notified of significant changes, and continued use of the platform constitutes acceptance of updated terms.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  12. Contact Information
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    For questions about these terms or our services, please contact us through our Contact Us page or support channels.
                  </p>
                  <div className="text-center">
                    <button 
                      onClick={() => navigate('/contact')}
                      className="bg-red-500 text-white py-3 px-8 rounded-md hover:bg-red-600 transition font-medium"
                    >
                      Contact Support
                    </button>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>

      <Footer variant="full" />
    </div>
  );
};

export default TermsOfService;