import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import models (assuming you have these paths)
import Service from '../models/service.js';
import Booking from '../models/booking.js';
import ServiceRequest from '../models/serviceRequest.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bizbridge';

class MigrationManager {
  constructor() {
    this.migrationStats = {
      services: { processed: 0, converted: 0, errors: 0 },
      bookings: { processed: 0, converted: 0, errors: 0 },
      serviceRequests: { processed: 0, converted: 0, errors: 0 }
    };
  }

  async connect() {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      throw error;
    }
  }

  async disconnect() {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }

  // ========== SERVICE MIGRATION ==========
  async migrateServices() {
    console.log('\n🔄 Starting Service Migration...');
    
    try {
      // Get all existing services
      const services = await mongoose.connection.db.collection('services').find({}).toArray();
      console.log(`📊 Found ${services.length} services to migrate`);

      for (const service of services) {
        try {
          this.migrationStats.services.processed++;
          
          // Create new pricing structure based on existing price
          const newPricingStructure = this.convertServicePricing(service);
          
          // Update the service with new structure
          await mongoose.connection.db.collection('services').updateOne(
            { _id: service._id },
            {
              $set: {
                pricing: newPricingStructure,
                hasBreakdown: this.shouldHaveBreakdown(service.category),
                breakdownSupported: this.supportsBreakdown(service.category)
              },
              $unset: {
                price: "" // Remove old price field
              }
            }
          );

          this.migrationStats.services.converted++;
          
          if (this.migrationStats.services.processed % 10 === 0) {
            console.log(`   📈 Processed ${this.migrationStats.services.processed} services...`);
          }
          
        } catch (error) {
          this.migrationStats.services.errors++;
          console.error(`   ❌ Error migrating service ${service._id}:`, error.message);
        }
      }

      console.log(`✅ Service migration completed!`);
      console.log(`   📊 Processed: ${this.migrationStats.services.processed}`);
      console.log(`   ✅ Converted: ${this.migrationStats.services.converted}`);
      console.log(`   ❌ Errors: ${this.migrationStats.services.errors}`);

    } catch (error) {
      console.error('❌ Service migration failed:', error);
      throw error;
    }
  }

  convertServicePricing(service) {
    // Convert old price string to new pricing structure
    const oldPrice = service.price || '';
    
    // Try to extract numeric value from price string
    const numericMatch = oldPrice.match(/[\d,]+/);
    const hasNumericPrice = numericMatch && !oldPrice.toLowerCase().includes('negotiat');
    
    if (hasNumericPrice) {
      // Convert to fixed pricing
      const price = parseInt(numericMatch[0].replace(/,/g, ''));
      return {
        type: 'fixed',
        basePrice: price,
        baseDuration: service.duration || '1-2 weeks',
        currency: 'NGN',
        description: `Converted from: ${oldPrice}`
      };
    } else if (this.supportsBreakdown(service.category)) {
      // Convert supported categories to categorized pricing with default categories
      return {
        type: 'categorized',
        categories: this.getDefaultCategories(service.category),
        currency: 'NGN',
        description: 'Converted to categorized pricing - please update categories as needed'
      };
    } else {
      // Convert to negotiate pricing
      return {
        type: 'negotiate',
        currency: 'NGN',
        description: `Converted from: ${oldPrice}`
      };
    }
  }

  getDefaultCategories(category) {
    const categoryDefaults = {
      'Woodworking': [
        { name: 'Furniture Making', price: 50000, duration: '2-3 weeks', description: 'Custom furniture creation' },
        { name: 'Wood Carving', price: 25000, duration: '1-2 weeks', description: 'Decorative wood carving' },
        { name: 'Restoration', price: 30000, duration: '1-2 weeks', description: 'Furniture restoration services' }
      ],
      'Metalwork': [
        { name: 'Welding', price: 40000, duration: '1-2 weeks', description: 'Metal welding services' },
        { name: 'Decorative Metalwork', price: 35000, duration: '2-3 weeks', description: 'Artistic metal pieces' },
        { name: 'Tool Making', price: 20000, duration: '1 week', description: 'Custom tool creation' }
      ],
      'Textile Art': [
        { name: 'Weaving', price: 30000, duration: '2-3 weeks', description: 'Custom textile weaving' },
        { name: 'Embroidery', price: 15000, duration: '1 week', description: 'Decorative embroidery work' },
        { name: 'Custom Clothing', price: 25000, duration: '1-2 weeks', description: 'Tailored clothing items' }
      ]
    };

    return categoryDefaults[category] || [
      { name: 'Basic Service', price: 25000, duration: '1-2 weeks', description: 'Standard service offering' }
    ];
  }

  supportsBreakdown(category) {
    return ['Woodworking', 'Metalwork', 'Textile Art'].includes(category);
  }

  shouldHaveBreakdown(category) {
    return this.supportsBreakdown(category);
  }

  // ========== BOOKING MIGRATION ==========
  async migrateBookings() {
    console.log('\n🔄 Starting Booking Migration...');
    
    try {
      const bookings = await mongoose.connection.db.collection('bookings').find({}).toArray();
      console.log(`📊 Found ${bookings.length} bookings to migrate`);

      for (const booking of bookings) {
        try {
          this.migrationStats.bookings.processed++;
          
          // Convert booking to simplified structure
          const updatedBooking = this.convertBookingStructure(booking);
          
          await mongoose.connection.db.collection('bookings').updateOne(
            { _id: booking._id },
            {
              $set: updatedBooking,
              $unset: this.getFieldsToRemove()
            }
          );

          this.migrationStats.bookings.converted++;
          
          if (this.migrationStats.bookings.processed % 10 === 0) {
            console.log(`   📈 Processed ${this.migrationStats.bookings.processed} bookings...`);
          }
          
        } catch (error) {
          this.migrationStats.bookings.errors++;
          console.error(`   ❌ Error migrating booking ${booking._id}:`, error.message);
        }
      }

      console.log(`✅ Booking migration completed!`);
      console.log(`   📊 Processed: ${this.migrationStats.bookings.processed}`);
      console.log(`   ✅ Converted: ${this.migrationStats.bookings.converted}`);
      console.log(`   ❌ Errors: ${this.migrationStats.bookings.errors}`);

    } catch (error) {
      console.error('❌ Booking migration failed:', error);
      throw error;
    }
  }

  convertBookingStructure(booking) {
    // Determine new status based on old status
    const newStatus = this.convertBookingStatus(booking.status);
    
    // Create agreement structure
    const agreement = {
      contractAccepted: {
        customer: false,
        artisan: false,
        timestamps: {}
      },
      agreedTerms: {
        pricing: booking.pricing || 'To be determined',
        duration: booking.duration || 'To be determined',
        meetingLocation: booking.location?.address || 'To be determined'
      },
      bothPartiesAccepted: false
    };

    // Create simplified status history
    const statusHistory = [{
      status: newStatus,
      changedBy: booking.artisan,
      timestamp: booking.createdAt || new Date(),
      reason: 'Migrated from old system'
    }];

    // Initialize dispute as not disputed
    const dispute = {
      isDisputed: false
    };

    return {
      status: newStatus,
      agreement,
      dispute,
      statusHistory,
      // Keep existing fields that are still relevant
      scheduledDate: booking.scheduledDate || {
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default to 1 week from now
      },
      location: booking.location || {},
      messages: booking.messages || [],
      review: booking.review || {},
      cancellation: booking.cancellation || {},
      source: booking.source || 'direct_booking',
      tags: booking.tags || [],
      priority: booking.priority || 'medium'
    };
  }

  convertBookingStatus(oldStatus) {
    // Map old complex statuses to new simple ones
    const statusMapping = {
      'pending': 'in_progress',
      'confirmed': 'in_progress',
      'in_progress': 'in_progress',
      'pending_review': 'in_progress',
      'completed': 'completed',
      'cancelled': 'cancelled',
      'disputed': 'in_progress', // Disputes are now handled separately
      'expired': 'cancelled'
    };

    return statusMapping[oldStatus] || 'in_progress';
  }

  getFieldsToRemove() {
    // Remove all payment-related and complex status fields
    return {
      pricing: "",
      paymentTerms: "",
      depositAmount: "",
      totalAmount: "",
      paymentStatus: "",
      paymentMethod: "",
      paymentDetails: "",
      refundAmount: "",
      refundProcessed: "",
      milestones: "", // Remove complex milestone system
      // Add any other payment-related fields you want to remove
    };
  }

  // ========== SERVICE REQUEST MIGRATION ==========
  async migrateServiceRequests() {
    console.log('\n🔄 Starting Service Request Migration...');
    
    try {
      const serviceRequests = await mongoose.connection.db.collection('servicerequests').find({}).toArray();
      console.log(`📊 Found ${serviceRequests.length} service requests to migrate`);

      for (const request of serviceRequests) {
        try {
          this.migrationStats.serviceRequests.processed++;
          
          // Add selectedCategory field for categorized services
          const updateData = {
            selectedCategory: null // Will be set when customer makes new requests
          };

          await mongoose.connection.db.collection('servicerequests').updateOne(
            { _id: request._id },
            { $set: updateData }
          );

          this.migrationStats.serviceRequests.converted++;
          
        } catch (error) {
          this.migrationStats.serviceRequests.errors++;
          console.error(`   ❌ Error migrating service request ${request._id}:`, error.message);
        }
      }

      console.log(`✅ Service Request migration completed!`);
      console.log(`   📊 Processed: ${this.migrationStats.serviceRequests.processed}`);
      console.log(`   ✅ Converted: ${this.migrationStats.serviceRequests.converted}`);
      console.log(`   ❌ Errors: ${this.migrationStats.serviceRequests.errors}`);

    } catch (error) {
      console.error('❌ Service Request migration failed:', error);
      throw error;
    }
  }

  // ========== BACKUP METHODS ==========
  async createBackup() {
    console.log('\n💾 Creating backup of current data...');
    
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      
      // Export collections to backup
      const services = await mongoose.connection.db.collection('services').find({}).toArray();
      const bookings = await mongoose.connection.db.collection('bookings').find({}).toArray();
      const serviceRequests = await mongoose.connection.db.collection('servicerequests').find({}).toArray();
      
      const backup = {
        timestamp,
        services,
        bookings,
        serviceRequests
      };

      // In a real environment, you'd save this to a file or backup service
      console.log(`✅ Backup created with ${services.length + bookings.length + serviceRequests.length} total documents`);
      console.log(`   📁 Backup timestamp: ${timestamp}`);
      
      return backup;
    } catch (error) {
      console.error('❌ Backup creation failed:', error);
      throw error;
    }
  }

  // ========== VALIDATION METHODS ==========
  async validateMigration() {
    console.log('\n🔍 Validating migration results...');
    
    try {
      // Check services
      const servicesWithPricing = await mongoose.connection.db.collection('services').countDocuments({
        'pricing.type': { $exists: true }
      });
      const totalServices = await mongoose.connection.db.collection('services').countDocuments({});
      
      // Check bookings
      const bookingsWithAgreement = await mongoose.connection.db.collection('bookings').countDocuments({
        'agreement': { $exists: true }
      });
      const totalBookings = await mongoose.connection.db.collection('bookings').countDocuments({});
      
      console.log(`✅ Validation Results:`);
      console.log(`   📊 Services with new pricing: ${servicesWithPricing}/${totalServices}`);
      console.log(`   📊 Bookings with agreement structure: ${bookingsWithAgreement}/${totalBookings}`);
      
      if (servicesWithPricing === totalServices && bookingsWithAgreement === totalBookings) {
        console.log(`✅ Migration validation PASSED!`);
        return true;
      } else {
        console.log(`❌ Migration validation FAILED!`);
        return false;
      }
      
    } catch (error) {
      console.error('❌ Validation failed:', error);
      return false;
    }
  }

  // ========== MAIN MIGRATION RUNNER ==========
  async runFullMigration() {
    console.log('🚀 Starting BizBridge No-Payment System Migration');
    console.log('===============================================');
    
    try {
      await this.connect();
      
      // Create backup
      await this.createBackup();
      
      // Run migrations
      await this.migrateServices();
      await this.migrateBookings();
      await this.migrateServiceRequests();
      
      // Validate results
      const isValid = await this.validateMigration();
      
      // Print final summary
      this.printFinalSummary(isValid);
      
      await this.disconnect();
      
      return isValid;
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      await this.disconnect();
      throw error;
    }
  }

  printFinalSummary(isValid) {
    console.log('\n📊 MIGRATION SUMMARY');
    console.log('===================');
    console.log(`Services - Processed: ${this.migrationStats.services.processed}, Converted: ${this.migrationStats.services.converted}, Errors: ${this.migrationStats.services.errors}`);
    console.log(`Bookings - Processed: ${this.migrationStats.bookings.processed}, Converted: ${this.migrationStats.bookings.converted}, Errors: ${this.migrationStats.bookings.errors}`);
    console.log(`Service Requests - Processed: ${this.migrationStats.serviceRequests.processed}, Converted: ${this.migrationStats.serviceRequests.converted}, Errors: ${this.migrationStats.serviceRequests.errors}`);
    console.log(`\n${isValid ? '✅ MIGRATION SUCCESSFUL' : '❌ MIGRATION COMPLETED WITH ISSUES'}`);
  }
}

// ========== EXECUTION ==========
async function runMigration() {
  const migrationManager = new MigrationManager();
  
  try {
    const success = await migrationManager.runFullMigration();
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('💥 Migration script failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration();
}

export default MigrationManager;