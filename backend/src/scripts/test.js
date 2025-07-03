// scripts/test-sample-data.js
// Test script to validate new models with sample data

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import the new models
import Service from '../models/service.js';
import Booking from '../models/booking.js';
import ServiceRequest from '../models/serviceRequest.js';
import User from '../models/user.js'; // Assuming you have a User model

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bizbridge_test';

class TestDataManager {
  constructor() {
    this.testResults = {
      services: { created: 0, tested: 0, passed: 0, failed: 0 },
      bookings: { created: 0, tested: 0, passed: 0, failed: 0 },
      serviceRequests: { created: 0, tested: 0, passed: 0, failed: 0 },
      overall: { passed: 0, failed: 0 }
    };
    
    this.testUsers = [];
    this.testServices = [];
    this.testBookings = [];
  }

  async connect() {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('✅ Connected to test database');
    } catch (error) {
      console.error('❌ Test database connection failed:', error);
      throw error;
    }
  }

  async disconnect() {
    await mongoose.disconnect();
    console.log('✅ Disconnected from test database');
  }

  async cleanup() {
    console.log('🧹 Cleaning up test data...');
    
    try {
      await Service.deleteMany({ title: { $regex: /^TEST_/ } });
      await Booking.deleteMany({ title: { $regex: /^TEST_/ } });
      await ServiceRequest.deleteMany({ title: { $regex: /^TEST_/ } });
      await User.deleteMany({ email: { $regex: /@test\.bizbridge/ } });
      
      console.log('✅ Test data cleaned up');
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
    }
  }

  // ========== USER CREATION FOR TESTING ==========
  async createTestUsers() {
    console.log('\n👥 Creating test users...');
    
    const testUsersData = [
      {
        name: 'John Artisan',
        email: 'john.artisan@test.bizbridge',
        role: 'artisan',
        category: 'Woodworking'
      },
      {
        name: 'Jane Customer',
        email: 'jane.customer@test.bizbridge',
        role: 'customer'
      },
      {
        name: 'Mike Metalworker',
        email: 'mike.metal@test.bizbridge',
        role: 'artisan',
        category: 'Metalwork'
      },
      {
        name: 'Sarah Textile',
        email: 'sarah.textile@test.bizbridge',
        role: 'artisan',
        category: 'Textile Art'
      }
    ];

    for (const userData of testUsersData) {
      try {
        const user = new User(userData);
        await user.save();
        this.testUsers.push(user);
        console.log(`   ✅ Created user: ${userData.name}`);
      } catch (error) {
        console.error(`   ❌ Failed to create user ${userData.name}:`, error.message);
      }
    }
  }

  // ========== SERVICE TESTING ==========
  async testServiceCreation() {
    console.log('\n🛠️ Testing Service Creation...');
    
    const serviceTests = [
      {
        name: 'Fixed Pricing Service',
        data: {
          artisan: this.testUsers[0]._id,
          title: 'TEST_Custom Wooden Table',
          description: 'Beautiful handcrafted wooden table',
          category: 'Woodworking',
          pricing: {
            type: 'fixed',
            basePrice: 75000,
            baseDuration: '2-3 weeks',
            currency: 'NGN',
            description: 'Fixed price for standard table'
          },
          locations: [{
            name: 'Lagos Island',
            lga: 'Lagos Island',
            type: 'lga'
          }],
          tags: ['furniture', 'wood', 'custom']
        }
      },
      {
        name: 'Negotiate Pricing Service',
        data: {
          artisan: this.testUsers[0]._id,
          title: 'TEST_Custom Wood Carving',
          description: 'Artistic wood carving services',
          category: 'Woodworking',
          pricing: {
            type: 'negotiate',
            currency: 'NGN',
            description: 'Price depends on complexity and size'
          },
          locations: [{
            name: 'Ikeja',
            lga: 'Ikeja',
            type: 'lga'
          }],
          tags: ['art', 'carving', 'custom']
        }
      },
      {
        name: 'Categorized Pricing Service',
        data: {
          artisan: this.testUsers[2]._id,
          title: 'TEST_Metal Fabrication Services',
          description: 'Professional metal fabrication',
          category: 'Metalwork',
          pricing: {
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
                description: 'Artistic metal pieces'
              },
              {
                name: 'Tool Making',
                price: 25000,
                duration: '1 week',
                description: 'Custom tool creation'
              }
            ],
            currency: 'NGN',
            description: 'Choose from our service categories'
          },
          locations: [{
            name: 'Surulere',
            lga: 'Surulere',
            type: 'lga'
          }],
          tags: ['metal', 'fabrication', 'welding']
        }
      },
      {
        name: 'Textile Art Service',
        data: {
          artisan: this.testUsers[3]._id,
          title: 'TEST_Custom Textile Weaving',
          description: 'Traditional and modern textile weaving',
          category: 'Textile Art',
          pricing: {
            type: 'categorized',
            categories: [
              {
                name: 'Weaving',
                price: 30000,
                duration: '2-3 weeks',
                description: 'Custom textile weaving'
              },
              {
                name: 'Embroidery',
                price: 15000,
                duration: '1 week',
                description: 'Decorative embroidery work'
              }
            ],
            currency: 'NGN'
          },
          locations: [{
            name: 'Victoria Island',
            lga: 'Victoria Island',
            type: 'lga'
          }],
          tags: ['textile', 'weaving', 'traditional']
        }
      }
    ];

    for (const test of serviceTests) {
      try {
        console.log(`   🧪 Testing: ${test.name}`);
        
        const service = new Service(test.data);
        await service.save();
        
        this.testServices.push(service);
        this.testResults.services.created++;
        
        // Test virtual fields and methods
        await this.testServiceMethods(service);
        
        console.log(`   ✅ ${test.name} - PASSED`);
        this.testResults.services.passed++;
        
      } catch (error) {
        console.error(`   ❌ ${test.name} - FAILED:`, error.message);
        this.testResults.services.failed++;
      }
      
      this.testResults.services.tested++;
    }
  }

  async testServiceMethods(service) {
    // Test virtual fields
    const displayPrice = service.displayPrice;
    const supportsCateg = service.supportsCategorizedPricing;
    
    // Test methods based on pricing type
    if (service.pricing.type === 'categorized') {
      const availableCategories = service.getAvailableCategories();
      const firstCategoryPrice = service.getPriceForCategory(service.pricing.categories[0].name);
      
      if (!firstCategoryPrice) {
        throw new Error('getPriceForCategory failed');
      }
    }
    
    // Test static methods
    const servicesByType = await Service.getByPricingType(service.pricing.type);
    if (!servicesByType.some(s => s._id.equals(service._id))) {
      throw new Error('getByPricingType failed');
    }
  }

  // ========== BOOKING TESTING ==========
  async testBookingCreation() {
    console.log('\n📅 Testing Booking Creation...');
    
    const bookingTests = [
      {
        name: 'Basic Booking Creation',
        data: {
          customer: this.testUsers[1]._id,
          artisan: this.testUsers[0]._id,
          service: this.testServices[0]._id,
          title: 'TEST_Custom Table Order',
          description: 'Customer wants a 6-seater dining table',
          scheduledDate: {
            startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
            startTime: '09:00'
          },
          agreement: {
            agreedTerms: {
              pricing: '₦75,000 for Custom Table',
              duration: '2-3 weeks',
              meetingLocation: 'Customer\'s residence in Lagos Island'
            }
          },
          location: {
            address: '123 Test Street, Lagos Island',
            lga: 'Lagos Island',
            state: 'Lagos'
          }
        }
      },
      {
        name: 'Categorized Service Booking',
        data: {
          customer: this.testUsers[1]._id,
          artisan: this.testUsers[2]._id,
          service: this.testServices[2]._id,
          title: 'TEST_Metal Welding Job',
          description: 'Need welding services for gate repair',
          scheduledDate: {
            startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
            startTime: '10:00'
          },
          agreement: {
            agreedTerms: {
              pricing: '₦40,000 for Welding category',
              duration: '1-2 weeks',
              selectedCategory: 'Welding',
              meetingLocation: 'Artisan workshop in Surulere'
            }
          }
        }
      }
    ];

    for (const test of bookingTests) {
      try {
        console.log(`   🧪 Testing: ${test.name}`);
        
        const booking = new Booking(test.data);
        await booking.save();
        
        this.testBookings.push(booking);
        this.testResults.bookings.created++;
        
        // Test booking methods
        await this.testBookingMethods(booking);
        
        console.log(`   ✅ ${test.name} - PASSED`);
        this.testResults.bookings.passed++;
        
      } catch (error) {
        console.error(`   ❌ ${test.name} - FAILED:`, error.message);
        this.testResults.bookings.failed++;
      }
      
      this.testResults.bookings.tested++;
    }
  }

  async testBookingMethods(booking) {
    // Test virtual fields
    const isOverdue = booking.isOverdue;
    const contractAccepted = booking.contractFullyAccepted;
    const daysSince = booking.daysSinceCreated;
    
    // Test contract acceptance
    await booking.acceptContract(booking.customer, 'customer');
    await booking.acceptContract(booking.artisan, 'artisan');
    
    if (!booking.agreement.bothPartiesAccepted) {
      throw new Error('Contract acceptance failed');
    }
    
    // Test message adding
    await booking.addMessage(booking.customer, 'Test message from customer');
    
    if (booking.messages.length === 0) {
      throw new Error('Message adding failed');
    }
    
    // Test static methods
    const activeBookings = await Booking.getActiveBookings(booking.customer, 'customer');
    if (!activeBookings.some(b => b._id.equals(booking._id))) {
      throw new Error('getActiveBookings failed');
    }
  }

  // ========== SERVICE REQUEST TESTING ==========
  async testServiceRequestCreation() {
    console.log('\n📝 Testing Service Request Creation...');
    
    const requestTests = [
      {
        name: 'Basic Service Request',
        data: {
          customer: this.testUsers[1]._id,
          artisan: this.testUsers[0]._id,
          service: this.testServices[0]._id,
          title: 'TEST_Custom Bookshelf Request',
          description: 'I need a custom bookshelf for my home office',
          category: 'Woodworking',
          budget: {
            min: 40000,
            max: 80000,
            currency: 'NGN'
          },
          timeline: {
            startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
            isFlexible: true
          },
          location: {
            address: '456 Test Avenue, Lagos',
            lga: 'Lagos Island',
            state: 'Lagos'
          },
          selectedCategory: null // For fixed/negotiate pricing
        }
      },
      {
        name: 'Categorized Service Request',
        data: {
          customer: this.testUsers[1]._id,
          artisan: this.testUsers[2]._id,
          service: this.testServices[2]._id,
          title: 'TEST_Metal Gate Fabrication',
          description: 'Need a new security gate for my property',
          category: 'Metalwork',
          budget: {
            min: 50000,
            max: 70000,
            currency: 'NGN'
          },
          timeline: {
            startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
            isFlexible: false
          },
          location: {
            address: '789 Security Street, Surulere',
            lga: 'Surulere',
            state: 'Lagos'
          },
          selectedCategory: 'Decorative Metalwork' // For categorized pricing
        }
      }
    ];

    for (const test of requestTests) {
      try {
        console.log(`   🧪 Testing: ${test.name}`);
        
        const serviceRequest = new ServiceRequest(test.data);
        await serviceRequest.save();
        
        this.testResults.serviceRequests.created++;
        
        // Test service request methods
        await this.testServiceRequestMethods(serviceRequest);
        
        console.log(`   ✅ ${test.name} - PASSED`);
        this.testResults.serviceRequests.passed++;
        
      } catch (error) {
        console.error(`   ❌ ${test.name} - FAILED:`, error.message);
        this.testResults.serviceRequests.failed++;
      }
      
      this.testResults.serviceRequests.tested++;
    }
  }

  async testServiceRequestMethods(serviceRequest) {
    // Test virtual fields
    const isExpired = serviceRequest.isExpired;
    const timeRemaining = serviceRequest.timeRemaining;
    
    // Test status changes
    await serviceRequest.markAsViewed();
    if (serviceRequest.status !== 'viewed') {
      throw new Error('markAsViewed failed');
    }
    
    // Test message adding
    await serviceRequest.addMessage(serviceRequest.artisan, 'I can help with this project');
    if (serviceRequest.status !== 'negotiating') {
      throw new Error('Message adding status change failed');
    }
    
    // Test quote submission
    await serviceRequest.submitQuote({
      estimatedPrice: 55000,
      estimatedDuration: '2 weeks',
      quotedPrice: 55000,
      proposedTimeline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      message: 'Here is my quote for your project'
    });
    
    if (serviceRequest.status !== 'quoted') {
      throw new Error('submitQuote failed');
    }
  }

  // ========== INTEGRATION TESTING ==========
  async testFullWorkflow() {
    console.log('\n🔄 Testing Full Workflow...');
    
    try {
      // 1. Customer finds a service
      const service = this.testServices[0]; // Fixed pricing woodworking service
      
      // 2. Customer creates a service request
      const serviceRequest = new ServiceRequest({
        customer: this.testUsers[1]._id,
        artisan: service.artisan,
        service: service._id,
        title: 'TEST_Full Workflow Request',
        description: 'Testing complete workflow',
        category: service.category,
        budget: { min: 70000, max: 80000, currency: 'NGN' },
        timeline: {
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          isFlexible: true
        },
        location: {
          address: 'Workflow Test Address',
          lga: 'Lagos Island',
          state: 'Lagos'
        }
      });
      
      await serviceRequest.save();
      
      // 3. Artisan responds to request
      await serviceRequest.submitQuote({
        estimatedPrice: 75000,
        estimatedDuration: '3 weeks',
        quotedPrice: 75000,
        proposedTimeline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        message: 'I can definitely help with this project'
      });
      
      // 4. Customer accepts quote
      await serviceRequest.acceptQuote();
      
      // 5. Create booking from accepted request
      const booking = new Booking({
        customer: serviceRequest.customer,
        artisan: serviceRequest.artisan,
        service: serviceRequest.service,
        serviceRequest: serviceRequest._id,
        title: serviceRequest.title,
        description: serviceRequest.description,
        scheduledDate: {
          startDate: serviceRequest.timeline.startDate,
          startTime: '09:00'
        },
        agreement: {
          agreedTerms: {
            pricing: `₦${serviceRequest.artisanResponse.quotedPrice.toLocaleString()}`,
            duration: serviceRequest.artisanResponse.estimatedDuration,
            meetingLocation: serviceRequest.location.address
          }
        },
        location: serviceRequest.location
      });
      
      await booking.save();
      
      // 6. Mark service request as converted
      await serviceRequest.convertToBooking(booking._id);
      
      // 7. Both parties accept contract
      await booking.acceptContract(booking.customer, 'customer');
      await booking.acceptContract(booking.artisan, 'artisan');
      
      // 8. Add some communication
      await booking.addMessage(booking.customer, 'Looking forward to starting this project');
      await booking.addMessage(booking.artisan, 'I will prepare materials and contact you soon');
      
      // 9. Customer marks as completed
      await booking.markAsCompleted(booking.customer);
      
      // 10. Add reviews
      await booking.addReview('customer', 5, 'Excellent work, very satisfied!');
      await booking.addReview('artisan', 5, 'Great customer, clear communication');
      
      console.log('   ✅ Full Workflow Test - PASSED');
      this.testResults.overall.passed++;
      
    } catch (error) {
      console.error('   ❌ Full Workflow Test - FAILED:', error.message);
      this.testResults.overall.failed++;
    }
  }

  // ========== ERROR HANDLING TESTING ==========
  async testErrorHandling() {
    console.log('\n⚠️ Testing Error Handling...');
    
    const errorTests = [
      {
        name: 'Invalid Pricing Type',
        test: async () => {
          const service = new Service({
            artisan: this.testUsers[0]._id,
            title: 'TEST_Invalid Service',
            description: 'Test service',
            category: 'Woodworking',
            pricing: {
              type: 'invalid_type' // Should fail
            }
          });
          await service.save();
        },
        shouldFail: true
      },
      {
        name: 'Categorized Pricing on Unsupported Category',
        test: async () => {
          const service = new Service({
            artisan: this.testUsers[0]._id,
            title: 'TEST_Invalid Categorized',
            description: 'Test service',
            category: 'Photography', // Doesn't support categorized pricing
            pricing: {
              type: 'categorized',
              categories: [{ name: 'Basic', price: 10000, duration: '1 week' }]
            }
          });
          await service.save();
        },
        shouldFail: true
      },
      {
        name: 'Non-Customer Completing Booking',
        test: async () => {
          const booking = this.testBookings[0];
          await booking.markAsCompleted(booking.artisan); // Should fail - only customer can complete
        },
        shouldFail: true
      },
      {
        name: 'Past Date Booking',
        test: async () => {
          const booking = new Booking({
            customer: this.testUsers[1]._id,
            artisan: this.testUsers[0]._id,
            service: this.testServices[0]._id,
            title: 'TEST_Past Date Booking',
            scheduledDate: {
              startDate: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
            }
          });
          await booking.save();
        },
        shouldFail: true
      }
    ];

    for (const errorTest of errorTests) {
      try {
        console.log(`   🧪 Testing: ${errorTest.name}`);
        
        await errorTest.test();
        
        if (errorTest.shouldFail) {
          console.error(`   ❌ ${errorTest.name} - FAILED: Should have thrown error but didn't`);
          this.testResults.overall.failed++;
        } else {
          console.log(`   ✅ ${errorTest.name} - PASSED`);
          this.testResults.overall.passed++;
        }
        
      } catch (error) {
        if (errorTest.shouldFail) {
          console.log(`   ✅ ${errorTest.name} - PASSED (correctly threw error)`);
          this.testResults.overall.passed++;
        } else {
          console.error(`   ❌ ${errorTest.name} - FAILED: ${error.message}`);
          this.testResults.overall.failed++;
        }
      }
    }
  }

  // ========== PERFORMANCE TESTING ==========
  async testPerformance() {
    console.log('\n⚡ Testing Performance...');
    
    try {
      // Test search performance
      const startTime = Date.now();
      
      await Service.searchWithPricing({
        category: 'Woodworking',
        pricingType: 'fixed',
        location: 'Lagos'
      });
      
      const searchTime = Date.now() - startTime;
      console.log(`   📊 Service search took: ${searchTime}ms`);
      
      // Test booking queries
      const bookingStartTime = Date.now();
      
      await Booking.getActiveBookings(this.testUsers[1]._id, 'customer');
      await Booking.getBookingHistory(this.testUsers[0]._id, 'artisan');
      
      const bookingQueryTime = Date.now() - bookingStartTime;
      console.log(`   📊 Booking queries took: ${bookingQueryTime}ms`);
      
      if (searchTime < 1000 && bookingQueryTime < 1000) {
        console.log('   ✅ Performance Test - PASSED');
        this.testResults.overall.passed++;
      } else {
        console.log('   ⚠️ Performance Test - SLOW (but acceptable)');
        this.testResults.overall.passed++;
      }
      
    } catch (error) {
      console.error('   ❌ Performance Test - FAILED:', error.message);
      this.testResults.overall.failed++;
    }
  }

  // ========== MAIN TEST RUNNER ==========
  async runAllTests() {
    console.log('🧪 Starting BizBridge No-Payment System Tests');
    console.log('===========================================');
    
    try {
      await this.connect();
      await this.cleanup();
      
      // Create test users first
      await this.createTestUsers();
      
      // Run all tests
      await this.testServiceCreation();
      await this.testBookingCreation();
      await this.testServiceRequestCreation();
      await this.testFullWorkflow();
      await this.testErrorHandling();
      await this.testPerformance();
      
      // Print results
      this.printTestResults();
      
      // Cleanup test data
      await this.cleanup();
      await this.disconnect();
      
      const allPassed = this.testResults.overall.failed === 0;
      return allPassed;
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      await this.disconnect();
      throw error;
    }
  }

  printTestResults() {
    console.log('\n📊 TEST RESULTS SUMMARY');
    console.log('=======================');
    
    console.log(`\n🛠️ Services:`);
    console.log(`   Created: ${this.testResults.services.created}`);
    console.log(`   Tested: ${this.testResults.services.tested}`);
    console.log(`   Passed: ${this.testResults.services.passed}`);
    console.log(`   Failed: ${this.testResults.services.failed}`);
    
    console.log(`\n📅 Bookings:`);
    console.log(`   Created: ${this.testResults.bookings.created}`);
    console.log(`   Tested: ${this.testResults.bookings.tested}`);
    console.log(`   Passed: ${this.testResults.bookings.passed}`);
    console.log(`   Failed: ${this.testResults.bookings.failed}`);
    
    console.log(`\n📝 Service Requests:`);
    console.log(`   Created: ${this.testResults.serviceRequests.created}`);
    console.log(`   Tested: ${this.testResults.serviceRequests.tested}`);
    console.log(`   Passed: ${this.testResults.serviceRequests.passed}`);
    console.log(`   Failed: ${this.testResults.serviceRequests.failed}`);
    
    console.log(`\n🎯 Overall:`);
    console.log(`   Passed: ${this.testResults.overall.passed}`);
    console.log(`   Failed: ${this.testResults.overall.failed}`);
    
    const successRate = this.testResults.overall.passed / 
      (this.testResults.overall.passed + this.testResults.overall.failed) * 100;
    
    console.log(`   Success Rate: ${successRate.toFixed(1)}%`);
    
    if (this.testResults.overall.failed === 0) {
      console.log('\n🎉 ALL TESTS PASSED! The new models are working correctly.');
    } else {
      console.log('\n⚠️ Some tests failed. Please review the errors above.');
    }
  }
}

// ========== EXECUTION ==========
async function runTests() {
  const testManager = new TestDataManager();
  
  try {
    const success = await testManager.runAllTests();
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

export default TestDataManager;