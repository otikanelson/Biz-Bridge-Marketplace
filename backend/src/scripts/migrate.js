import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicit absolute fallback paths to guarantee env config matches across Node sub-shells
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

// Import models
import Service from '../models/service.js';
import Booking from '../models/booking.js';
import ServiceRequest from '../models/serviceRequest.js';

// Prioritize environment configuration variable over local fallback
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/bizbridge';

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
      console.log('🔄 Attempting Connection to MongoDB Atlas Cluster via SRV Link...');
      
      // Configuration parameters added to resolve Atlas querySrv timeouts over local DNS
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000, 
        socketTimeoutMS: 45000,
      });
      
      console.log('✅ Connected to MongoDB Ecosystem Successfully');
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
      const services = await mongoose.connection.db.collection('services').find({}).toArray();
      console.log(`📊 Found ${services.length} services to migrate`);

      for (const service of services) {
        try {
          this.migrationStats.services.processed++;
          
          const newPricingStructure = this.convertServicePricing(service);
          
          await mongoose.connection.db.collection('services').updateOne(
            { _id: service._id },
            {
              $set: {
                pricing: newPricingStructure,
                hasBreakdown: this.shouldHaveBreakdown(service.category),
                breakdownSupported: this.supportsBreakdown(service.category)
              },
              $unset: {
                price: "" 
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
    const oldPrice = service.price || '';
    const numericMatch = oldPrice.match(/[\d,]+/);
    const hasNumericPrice = numericMatch && !oldPrice.toLowerCase().includes('negotiat');
    
    if (hasNumericPrice) {
      const price = parseInt(numericMatch[0].replace(/,/g, ''));
      return {
        type: 'fixed',
        basePrice: price,
        baseDuration: service.duration || '1-2 weeks',
        currency: 'NGN',
        description: `Converted from: ${oldPrice}`
      };
    } else if (this.supportsBreakdown(service.category)) {
      return {
        type: 'categorized',
        categories: this.getDefaultCategories(service.category),
        currency: 'NGN',
        description: 'Converted to categorized pricing - please update categories as needed'
      };
    } else {
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
    const newStatus = this.convertBookingStatus(booking.status);
    
    const agreement = {
      contractAccepted: { customer: false, artisan: false, timestamps: {} },
      agreedTerms: {
        pricing: booking.pricing || 'To be determined',
        duration: booking.duration || 'To be determined',
        meetingLocation: booking.location?.address || 'To be determined'
      },
      bothPartiesAccepted: false
    };

    const statusHistory = [{
      status: newStatus,
      changedBy: booking.artisan,
      timestamp: booking.createdAt || new Date(),
      reason: 'Migrated from old system'
    }];

    return {
      status: newStatus,
      agreement,
      statusHistory
    };
  }

  convertBookingStatus(status) {
    const statusMap = {
      'pending': 'pending',
      'confirmed': 'confirmed',
      'completed': 'completed',
      'cancelled': 'cancelled'
    };
    return statusMap[status?.toLowerCase()] || 'pending';
  }

  getFieldsToRemove() {
    return {
      oldPriceField: "", 
      oldDurationField: ""
    };
  }
}

// ========== INITIALIZATION ORCHESTRATION ==========
const runMigrationSequence = async () => {
  const manager = new MigrationManager();
  try {
    await manager.connect();
    await manager.migrateServices();
    await manager.migrateBookings();
    console.log('\n🎉 System migration tasks executed fully without system dropouts.');
  } catch (error) {
    console.error('\n❌ Fatal: Migration runner encountered unrecoverable break:', error);
  } finally {
    await manager.disconnect();
    process.exit(0);
  }
};

runMigrationSequence();
