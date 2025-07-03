// scripts/test-service-api.js
// API Testing Script for New Pricing System

import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';
const TEST_IMAGE_PATH = './test-assets/sample-service-image.jpg'; // You'll need to add a test image

class ServiceAPITester {
  constructor() {
    this.authTokens = {
      artisan: null,
      customer: null
    };
    this.testResults = {
      passed: 0,
      failed: 0,
      tests: []
    };
    this.createdServices = [];
  }

  // Helper method to make API requests
  async makeRequest(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    const config = {
      ...options,
      headers: defaultHeaders
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      return {
        status: response.status,
        success: response.ok,
        data
      };
    } catch (error) {
      return {
        status: 500,
        success: false,
        error: error.message
      };
    }
  }

  // Helper method for authenticated requests
  async authenticatedRequest(endpoint, options = {}, userType = 'artisan') {
    const token = this.authTokens[userType];
    if (!token) {
      throw new Error(`No auth token for ${userType}`);
    }

    return this.makeRequest(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // Log test results
  logTest(testName, passed, details = '') {
    const result = { testName, passed, details };
    this.testResults.tests.push(result);
    
    if (passed) {
      this.testResults.passed++;
      console.log(`✅ ${testName}`);
    } else {
      this.testResults.failed++;
      console.log(`❌ ${testName}: ${details}`);
    }
  }

  // ========== SETUP METHODS ==========
  
  async setupTestUsers() {
    console.log('\n🔧 Setting up test users...');
    
    // Create test artisan
    const artisanData = {
      contactName: 'Test Artisan',
      email: 'testartisan@example.com',
      password: 'testpassword123',
      role: 'artisan',
      category: 'Woodworking',
      phoneNumber: '08012345678'
    };

    const artisanResult = await this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(artisanData)
    });

    if (artisanResult.success) {
      this.authTokens.artisan = artisanResult.data.token;
      console.log('✅ Test artisan created and authenticated');
    } else {
      // Try to login if user already exists
      const loginResult = await this.makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: artisanData.email,
          password: artisanData.password
        })
      });
      
      if (loginResult.success) {
        this.authTokens.artisan = loginResult.data.token;
        console.log('✅ Test artisan logged in');
      } else {
        throw new Error('Failed to setup test artisan');
      }
    }

    // Create test customer
    const customerData = {
      fullName: 'Test Customer',
      email: 'testcustomer@example.com',
      password: 'testpassword123',
      role: 'customer'
    };

    const customerResult = await this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(customerData)
    });

    if (customerResult.success) {
      this.authTokens.customer = customerResult.data.token;
      console.log('✅ Test customer created and authenticated');
    } else {
      // Try to login if user already exists
      const loginResult = await this.makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: customerData.email,
          password: customerData.password
        })
      });
      
      if (loginResult.success) {
        this.authTokens.customer = loginResult.data.token;
        console.log('✅ Test customer logged in');
      } else {
        throw new Error('Failed to setup test customer');
      }
    }
  }

  // ========== PRICING SYSTEM TESTS ==========

  async testCategoryBreakdownEndpoints() {
    console.log('\n🔍 Testing Category Breakdown Endpoints...');

    // Test getting breakdown for supported category
    const woodworkingResult = await this.makeRequest('/services/categories/Woodworking/breakdown');
    this.logTest(
      'Get Woodworking category breakdown',
      woodworkingResult.success && Array.isArray(woodworkingResult.data.breakdown),
      woodworkingResult.success ? '' : woodworkingResult.data.message
    );

    // Test getting breakdown for unsupported category
    const unsupportedResult = await this.makeRequest('/services/categories/Photography/breakdown');
    this.logTest(
      'Get unsupported category breakdown (should fail)',
      !unsupportedResult.success && unsupportedResult.status === 404,
      unsupportedResult.success ? 'Should have failed' : 'Correctly failed'
    );

    // Test getting all supported categories
    const supportedResult = await this.makeRequest('/services/categorized-pricing/supported');
    this.logTest(
      'Get all supported categorized pricing categories',
      supportedResult.success && Array.isArray(supportedResult.data.supportedCategories),
      supportedResult.success ? '' : supportedResult.data.message
    );
  }

  async testFixedPricingService() {
    console.log('\n💰 Testing Fixed Pricing Service Creation...');

    const serviceData = {
      title: 'TEST_Custom Wooden Table',
      description: 'Beautiful handcrafted wooden dining table',
      category: 'Woodworking',
      pricing: JSON.stringify({
        type: 'fixed',
        basePrice: 75000,
        baseDuration: '2-3 weeks',
        currency: 'NGN',
        description: 'Fixed price for standard dining table'
      }),
      locations: JSON.stringify([{
        name: 'Lagos Island',
        lga: 'Lagos Island',
        type: 'lga'
      }]),
      tags: JSON.stringify(['furniture', 'wood', 'dining', 'custom']),
      isActive: true
    };

    const result = await this.authenticatedRequest('/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(serviceData)
    });

    const success = result.success && 
                   result.data.service.pricing.type === 'fixed' &&
                   result.data.service.pricing.basePrice === 75000;

    this.logTest(
      'Create fixed pricing service',
      success,
      success ? '' : result.data?.message || 'Failed to create service'
    );

    if (success) {
      this.createdServices.push(result.data.service);
      console.log(`   📝 Created service: ${result.data.service._id}`);
      console.log(`   💰 Display price: ${result.data.service.displayPrice}`);
    }

    return success ? result.data.service : null;
  }

  async testNegotiatePricingService() {
    console.log('\n🤝 Testing Negotiate Pricing Service Creation...');

    const serviceData = {
      title: 'TEST_Custom Wood Carving',
      description: 'Artistic wood carving services for any occasion',
      category: 'Woodworking',
      pricing: JSON.stringify({
        type: 'negotiate',
        currency: 'NGN',
        description: 'Price depends on complexity, size, and materials'
      }),
      locations: JSON.stringify([{
        name: 'Ikeja',
        lga: 'Ikeja',
        type: 'lga'
      }]),
      tags: JSON.stringify(['art', 'carving', 'custom', 'decorative']),
      isActive: true
    };

    const result = await this.authenticatedRequest('/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(serviceData)
    });

    const success = result.success && 
                   result.data.service.pricing.type === 'negotiate';

    this.logTest(
      'Create negotiate pricing service',
      success,
      success ? '' : result.data?.message || 'Failed to create service'
    );

    if (success) {
      this.createdServices.push(result.data.service);
      console.log(`   📝 Created service: ${result.data.service._id}`);
      console.log(`   💰 Display price: ${result.data.service.displayPrice}`);
    }

    return success ? result.data.service : null;
  }

  async testCategorizedPricingService() {
    console.log('\n📊 Testing Categorized Pricing Service Creation...');

    const serviceData = {
      title: 'TEST_Metal Fabrication Services',
      description: 'Professional metal fabrication and welding services',
      category: 'Metalwork',
      pricing: JSON.stringify({
        type: 'categorized',
        categories: [
          {
            name: 'Welding',
            price: 40000,
            duration: '1-2 weeks',
            description: 'General welding services'
          },
          {
            name: 'Decorative Metalwork',
            price: 60000,
            duration: '2-3 weeks',
            description: 'Artistic metal pieces and sculptures'
          },
          {
            name: 'Tool Making',
            price: 25000,
            duration: '1 week',
            description: 'Custom tool creation and repair'
          }
        ],
        currency: 'NGN',
        description: 'Choose from our specialized service categories'
      }),
      locations: JSON.stringify([{
        name: 'Surulere',
        lga: 'Surulere',
        type: 'lga'
      }]),
      tags: JSON.stringify(['metal', 'fabrication', 'welding', 'custom']),
      isActive: true
    };

    const result = await this.authenticatedRequest('/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(serviceData)
    });

    const success = result.success && 
                   result.data.service.pricing.type === 'categorized' &&
                   Array.isArray(result.data.service.pricing.categories) &&
                   result.data.service.pricing.categories.length === 3;

    this.logTest(
      'Create categorized pricing service',
      success,
      success ? '' : result.data?.message || 'Failed to create service'
    );

    if (success) {
      this.createdServices.push(result.data.service);
      console.log(`   📝 Created service: ${result.data.service._id}`);
      console.log(`   💰 Display price: ${result.data.service.displayPrice}`);
      console.log(`   📊 Categories: ${result.data.service.pricing.categories.map(c => c.name).join(', ')}`);
    }

    return success ? result.data.service : null;
  }

  async testInvalidPricingServices() {
    console.log('\n❌ Testing Invalid Pricing Service Creation...');

    // Test categorized pricing on unsupported category
    const invalidCategorizedData = {
      title: 'TEST_Invalid Categorized Service',
      description: 'This should fail',
      category: 'Photography', // Doesn't support categorized pricing
      pricing: JSON.stringify({
        type: 'categorized',
        categories: [
          { name: 'Basic', price: 10000, duration: '1 week' }
        ]
      })
    };

    const invalidResult = await this.authenticatedRequest('/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(invalidCategorizedData)
    });

    this.logTest(
      'Reject categorized pricing on unsupported category',
      !invalidResult.success,
      invalidResult.success ? 'Should have failed' : 'Correctly rejected'
    );

    // Test fixed pricing without base price
    const invalidFixedData = {
      title: 'TEST_Invalid Fixed Service',
      description: 'This should fail',
      category: 'Woodworking',
      pricing: JSON.stringify({
        type: 'fixed',
        // Missing basePrice
        baseDuration: '1 week'
      })
    };

    const invalidFixedResult = await this.authenticatedRequest('/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(invalidFixedData)
    });

    this.logTest(
      'Reject fixed pricing without base price',
      !invalidFixedResult.success,
      invalidFixedResult.success ? 'Should have failed' : 'Correctly rejected'
    );

    // Test empty categorized pricing
    const emptyCategorizedData = {
      title: 'TEST_Empty Categorized Service',
      description: 'This should fail',
      category: 'Metalwork',
      pricing: JSON.stringify({
        type: 'categorized',
        categories: [] // Empty categories
      })
    };

    const emptyResult = await this.authenticatedRequest('/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emptyCategorizedData)
    });

    this.logTest(
      'Reject categorized pricing with empty categories',
      !emptyResult.success,
      emptyResult.success ? 'Should have failed' : 'Correctly rejected'
    );
  }

  async testServiceSearchAndFiltering() {
    console.log('\n🔍 Testing Service Search and Filtering...');

    // Test search by pricing type
    const fixedServicesResult = await this.makeRequest('/services/pricing/fixed');
    this.logTest(
      'Search services by fixed pricing type',
      fixedServicesResult.success && Array.isArray(fixedServicesResult.data.services),
      fixedServicesResult.success ? '' : fixedServicesResult.data.message
    );

    const categorizedServicesResult = await this.makeRequest('/services/pricing/categorized');
    this.logTest(
      'Search services by categorized pricing type',
      categorizedServicesResult.success && Array.isArray(categorizedServicesResult.data.services),
      categorizedServicesResult.success ? '' : categorizedServicesResult.data.message
    );

    // Test advanced search with pricing filters
    const searchParams = new URLSearchParams({
      category: 'Woodworking',
      pricingType: 'fixed',
      minPrice: '50000',
      maxPrice: '100000'
    });

    const advancedSearchResult = await this.makeRequest(`/services/search?${searchParams}`);
    this.logTest(
      'Advanced search with pricing filters',
      advancedSearchResult.success && Array.isArray(advancedSearchResult.data.services),
      advancedSearchResult.success ? '' : advancedSearchResult.data.message
    );

    // Test getting all services (should include new pricing structure)
    const allServicesResult = await this.makeRequest('/services');
    this.logTest(
      'Get all services with new pricing structure',
      allServicesResult.success && 
      Array.isArray(allServicesResult.data.services) &&
      allServicesResult.data.services.some(s => s.pricing && s.displayPrice),
      allServicesResult.success ? '' : allServicesResult.data.message
    );
  }

  async testServiceRetrieval() {
    console.log('\n📄 Testing Service Retrieval...');

    if (this.createdServices.length === 0) {
      this.logTest('Service retrieval test', false, 'No services created to test');
      return;
    }

    const service = this.createdServices[0];
    
    // Test getting single service
    const serviceResult = await this.makeRequest(`/services/${service._id}`);
    this.logTest(
      'Get single service with pricing structure',
      serviceResult.success && 
      serviceResult.data.service.pricing &&
      serviceResult.data.service.displayPrice,
      serviceResult.success ? '' : serviceResult.data.message
    );

    // Test getting artisan's services
    const myServicesResult = await this.authenticatedRequest('/services/my-services');
    this.logTest(
      'Get artisan\'s services',
      myServicesResult.success && 
      Array.isArray(myServicesResult.data.services) &&
      myServicesResult.data.services.length > 0,
      myServicesResult.success ? '' : myServicesResult.data.message
    );
  }

  async testServiceUpdates() {
    console.log('\n✏️ Testing Service Updates...');

    if (this.createdServices.length === 0) {
      this.logTest('Service update test', false, 'No services created to test');
      return;
    }

    const service = this.createdServices[0];
    
    // Test updating pricing structure
    const updateData = {
      title: service.title + ' - UPDATED',
      pricing: JSON.stringify({
        type: 'negotiate', // Change from fixed to negotiate
        currency: 'NGN',
        description: 'Updated to negotiable pricing'
      })
    };

    const updateResult = await this.authenticatedRequest(`/services/${service._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    this.logTest(
      'Update service pricing structure',
      updateResult.success && 
      updateResult.data.service.pricing.type === 'negotiate',
      updateResult.success ? '' : updateResult.data.message
    );
  }

  // ========== AUTHORIZATION TESTS ==========
  
  async testAuthorizationControls() {
    console.log('\n🔒 Testing Authorization Controls...');

    if (this.createdServices.length === 0) {
      this.logTest('Authorization test', false, 'No services created to test');
      return;
    }

    const service = this.createdServices[0];

    // Test customer trying to create service (should fail)
    const customerCreateResult = await this.authenticatedRequest('/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Customer Test Service',
        description: 'This should fail',
        category: 'Woodworking',
        pricing: JSON.stringify({ type: 'fixed', basePrice: 10000, baseDuration: '1 week' })
      })
    }, 'customer');

    this.logTest(
      'Prevent customer from creating service',
      !customerCreateResult.success,
      customerCreateResult.success ? 'Should have failed' : 'Correctly prevented'
    );

    // Test customer trying to update service (should fail)
    const customerUpdateResult = await this.authenticatedRequest(`/services/${service._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: 'Hacked Title' })
    }, 'customer');

    this.logTest(
      'Prevent customer from updating artisan service',
      !customerUpdateResult.success,
      customerUpdateResult.success ? 'Should have failed' : 'Correctly prevented'
    );
  }

  // ========== CLEANUP ==========
  
  async cleanup() {
    console.log('\n🧹 Cleaning up test data...');

    for (const service of this.createdServices) {
      try {
        await this.authenticatedRequest(`/services/${service._id}`, {
          method: 'DELETE'
        });
        console.log(`   🗑️ Deleted service: ${service._id}`);
      } catch (error) {
        console.log(`   ❌ Failed to delete service: ${service._id}`);
      }
    }
  }

  // ========== MAIN TEST RUNNER ==========
  
  async runAllTests() {
    console.log('🧪 Starting Service API Tests for New Pricing System');
    console.log('==================================================');

    try {
      await this.setupTestUsers();
      await this.testCategoryBreakdownEndpoints();
      await this.testFixedPricingService();
      await this.testNegotiatePricingService();
      await this.testCategorizedPricingService();
      await this.testInvalidPricingServices();
      await this.testServiceSearchAndFiltering();
      await this.testServiceRetrieval();
      await this.testServiceUpdates();
      await this.testAuthorizationControls();
      
      this.printTestResults();
      await this.cleanup();
      
      const allPassed = this.testResults.failed === 0;
      return allPassed;
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      throw error;
    }
  }

  printTestResults() {
    console.log('\n📊 TEST RESULTS SUMMARY');
    console.log('=======================');
    
    console.log(`Total Tests: ${this.testResults.passed + this.testResults.failed}`);
    console.log(`✅ Passed: ${this.testResults.passed}`);
    console.log(`❌ Failed: ${this.testResults.failed}`);
    
    const successRate = (this.testResults.passed / (this.testResults.passed + this.testResults.failed)) * 100;
    console.log(`Success Rate: ${successRate.toFixed(1)}%`);
    
    if (this.testResults.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults.tests
        .filter(test => !test.passed)
        .forEach(test => {
          console.log(`   - ${test.testName}: ${test.details}`);
        });
    }
    
    if (this.testResults.failed === 0) {
      console.log('\n🎉 ALL TESTS PASSED! The new pricing system is working correctly.');
    } else {
      console.log('\n⚠️ Some tests failed. Please review the errors above.');
    }
  }
}

// ========== EXECUTION ==========
async function runTests() {
  const tester = new ServiceAPITester();
  
  try {
    const success = await tester.runAllTests();
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('💥 Test suite crashed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export default ServiceAPITester;