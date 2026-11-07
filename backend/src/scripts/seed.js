import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

import User from '../models/user.js';
import Service from '../models/service.js';

let MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const DEFAULT_PASSWORD = 'Password123';

if (!MONGO_URI) {
  console.error('❌ Error: Database Connection string (MONGO_URI) missing from environment variables.');
  process.exit(1);
}

// ⚠️ SECURITY WARNING: DO NOT hardcode credentials
// Always use environment variables for database connections

// Artisans Data (2 artisans)
const artisansData = [
  {
    username: 'adebayo_crafts',
    email: 'adebayo@bizbridge.com',
    password: DEFAULT_PASSWORD,
    role: 'artisan',
    contactName: 'Adebayo Okafor',
    businessName: "Adebayo's Fine Woodworks",
    businessDescription: 'Award-winning furniture maker with over 15 years of experience crafting bespoke hardwood pieces for homes and offices across Lagos.',
    phoneNumber: '+2348012345678',
    whatsappNumber: '+2348012345678',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    location: { address: '14 Balogun Street', city: 'Lagos', state: 'Lagos', lga: 'Lagos Island' },
    business: { yearEstablished: 2009, staffStrength: 4, isCACRegistered: true, cacNumber: 'RC123456' },
    professional: {
      specialties: ['Woodworking'],
      experience: '15 years crafting custom hardwood furniture and cabinetry.',
      certifications: ['Lagos State Artisan Guild Certified'],
    },
    analytics: { profileViews: 342, totalBookings: 87, completedBookings: 82, averageRating: 4.8, totalReviews: 64 },
    featured: { isFeatured: true, featuredOrder: 1 },
    isVerified: true,
    servicesToCreate: [
      {
        title: 'Bespoke Executive Mahogany Desk',
        description: 'Handcrafted solid mahogany desk custom-built with intricate wood joinery, built-in wire management, and leather inlay.',
        category: 'Woodworking',
        pricing: {
          type: 'categorized',
          categories: [
            { name: 'Standard Desk', price: 150000, duration: '2-3 weeks', description: 'Basic solid mahogany finish with two drawers' },
            { name: 'Executive Suite Desk', price: 280000, duration: '3-4 weeks', description: 'Includes custom side drawers, cable organizer, and leather inlay' }
          ],
          currency: 'NGN'
        },
        hasBreakdown: true,
        breakdownSupported: true,
        isActive: true,
        images: [
          'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=600&fit=crop'
        ],
        locations: [{ address: '14 Balogun Street', city: 'Lagos', state: 'Lagos', lga: 'Lagos Island' }],
        tags: ['woodworking', 'furniture', 'mahogany', 'desk', 'office'],
        ratings: { average: 4.9, count: 28 }
      },
      {
        title: 'Custom Hardwood Dining Table & Chairs',
        description: 'Six to twelve-seater dining tables built from seasoned teak or mahogany, finished with natural heat-resistant varnish.',
        category: 'Woodworking',
        pricing: {
          type: 'negotiate',
          currency: 'NGN',
          description: 'Pricing varies based on dimensions, chair count, and wood type.'
        },
        hasBreakdown: false,
        breakdownSupported: true,
        isActive: true,
        images: [
          'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=600&fit=crop'
        ],
        locations: [{ address: '14 Balogun Street', city: 'Lagos', state: 'Lagos', lga: 'Lagos Island' }],
        tags: ['woodworking', 'dining', 'table', 'teak', 'home'],
        ratings: { average: 4.8, count: 19 }
      },
      {
        title: 'Modular Kitchen Cabinet Installation',
        description: 'Custom kitchen cabinetry setup featuring moisture-resistant hardwoods, soft-close hinges, and modular layout designs.',
        category: 'Woodworking',
        pricing: {
          type: 'fixed',
          basePrice: 350000,
          baseDuration: '2-3 weeks',
          currency: 'NGN'
        },
        hasBreakdown: true,
        breakdownSupported: true,
        isActive: true,
        images: [
          'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop'
        ],
        locations: [{ address: '14 Balogun Street', city: 'Lagos', state: 'Lagos', lga: 'Lagos Island' }],
        tags: ['kitchen', 'cabinets', 'woodworking', 'interior'],
        ratings: { average: 4.7, count: 15 }
      }
    ]
  },
  {
    username: 'ngozi_pottery',
    email: 'ngozi@bizbridge.com',
    password: DEFAULT_PASSWORD,
    role: 'artisan',
    contactName: 'Ngozi Eze',
    businessName: 'Ngozi Clay Studio',
    businessDescription: 'Contemporary pottery and ceramics studio blending traditional Igbo clay techniques with modern aesthetics.',
    phoneNumber: '+2348023456789',
    whatsappNumber: '+2348023456789',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    location: { address: '7 Awolowo Road', city: 'Ikeja', state: 'Lagos', lga: 'Ikeja' },
    business: { yearEstablished: 2015, staffStrength: 2, isCACRegistered: false },
    professional: {
      specialties: ['Pottery & Ceramics'],
      experience: '10 years working with clay, trained at Yaba College of Technology.',
      certifications: ['Yaba College of Technology – Ceramics Diploma'],
    },
    analytics: { profileViews: 218, totalBookings: 53, completedBookings: 50, averageRating: 4.9, totalReviews: 41 },
    featured: { isFeatured: true, featuredOrder: 2 },
    isVerified: true,
    servicesToCreate: [
      {
        title: 'Custom Ceramic Tableware Set',
        description: 'Handthrown ceramic tableware sets crafted to order. Each piece is wheel-thrown and high-fired with food-safe glazes.',
        category: 'Pottery & Ceramics',
        pricing: {
          type: 'fixed',
          basePrice: 45000,
          baseDuration: '1-2 weeks',
          currency: 'NGN'
        },
        hasBreakdown: false,
        breakdownSupported: false,
        isActive: true,
        images: [
          'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&h=600&fit=crop'
        ],
        locations: [{ address: '7 Awolowo Road', city: 'Ikeja', state: 'Lagos', lga: 'Ikeja' }],
        tags: ['ceramics', 'pottery', 'tableware', 'handthrown', 'kitchen'],
        ratings: { average: 5.0, count: 14 }
      },
      {
        title: 'Decorative Clay Vases & Terracotta Planters',
        description: 'Artisanal interior display vases and porous clay planters ideal for luxury homes and garden spaces.',
        category: 'Pottery & Ceramics',
        pricing: {
          type: 'fixed',
          basePrice: 20000,
          baseDuration: '1 week',
          currency: 'NGN'
        },
        hasBreakdown: false,
        breakdownSupported: false,
        isActive: true,
        images: [
          'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=800&h=600&fit=crop'
        ],
        locations: [{ address: '7 Awolowo Road', city: 'Ikeja', state: 'Lagos', lga: 'Ikeja' }],
        tags: ['pottery', 'vases', 'planters', 'decor', 'terracotta'],
        ratings: { average: 4.7, count: 22 }
      },
      {
        title: 'Handcrafted Clay Wall Art Sculptures',
        description: 'Unique embossed ceramic wall panels and abstract terracotta tiles designed for accent walls.',
        category: 'Pottery & Ceramics',
        pricing: {
          type: 'fixed',
          basePrice: 60000,
          baseDuration: '2 weeks',
          currency: 'NGN'
        },
        hasBreakdown: false,
        breakdownSupported: true,
        isActive: true,
        images: [
          'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=600&fit=crop'
        ],
        locations: [{ address: '7 Awolowo Road', city: 'Ikeja', state: 'Lagos', lga: 'Ikeja' }],
        tags: ['wallart', 'sculpture', 'ceramics', 'decor'],
        ratings: { average: 4.8, count: 9 }
      }
    ]
  },
];

// Regular Users Data (2 customers)
const usersData = [
  {
    username: 'chioma_client',
    email: 'chioma@example.com',
    password: DEFAULT_PASSWORD,
    role: 'customer',
    fullName: 'Chioma Nwosu',
    phoneNumber: '+2348011111111',
    whatsappNumber: '+2348011111111',
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    customerLocation: { 
      address: '25 Victoria Island', 
      city: 'Lagos', 
      state: 'Lagos', 
      lga: 'Eti-Osa' 
    },
    isVerified: true,
  },
  {
    username: 'yusuf_client',
    email: 'yusuf@example.com',
    password: DEFAULT_PASSWORD,
    role: 'customer',
    fullName: 'Yusuf Mohammed',
    phoneNumber: '+2348022222222',
    whatsappNumber: '+2348022222222',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    customerLocation: { 
      address: '10 Independence Avenue', 
      city: 'Abuja', 
      state: 'FCT', 
      lga: 'Abuja Municipal' 
    },
    isVerified: true,
  },
];

const seedDatabase = async () => {
  try {
    console.log('🔄 Attempting Connection to MongoDB Atlas Cluster...');

    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ Connected successfully to database ecosystem.');

    console.log('🗑️ Purging existing user and service records...');
    await User.deleteMany({});
    await Service.deleteMany({});

    console.log('💡 Using plain password - User model will hash it automatically...');

    const insertedServices = [];

    // Create artisan users with their services
    console.log('👷 Creating artisan accounts...');
    for (const artisanData of artisansData) {
      const { servicesToCreate, ...userFields } = artisanData;
      
      const createdUser = await User.create({
        ...userFields,
        password: DEFAULT_PASSWORD  // ✅ Pass plain password - model will hash it
      });

      console.log(`✅ Created artisan: ${createdUser.username}`);

      if (servicesToCreate && servicesToCreate.length > 0) {
        for (const serviceData of servicesToCreate) {
          insertedServices.push({
            ...serviceData,
            artisan: createdUser._id
          });
        }
      }
    }

    // Create regular users
    console.log('👤 Creating regular user accounts...');
    for (const userData of usersData) {
      const createdUser = await User.create({
        ...userData,
        password: DEFAULT_PASSWORD  // ✅ Pass plain password - model will hash it
      });
      console.log(`✅ Created user: ${createdUser.username}`);
    }

    if (insertedServices.length > 0) {
      await Service.insertMany(insertedServices);
      console.log(`📦 Successfully created ${insertedServices.length} service records across categories.`);
    }

    console.log('🌟 Database seed finalized flawlessly.');
    console.log(`📊 Summary: ${artisansData.length} artisans, ${usersData.length} regular users, ${insertedServices.length} services`);
  } catch (error) {
    console.error('❌ Execution halted. Seeding sequence failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Connection channels securely detached.');
    process.exit(0);
  }
};

seedDatabase();