// backend/src/scripts/seed.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicit absolute fallback paths to guarantee env config matches across Node sub-shells
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

import User from '../models/user.js';
import Service from '../models/service.js';

// Fallbacks check if MONGO_URI was supplied in place of MONGODB_URI
let MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const DEFAULT_PASSWORD = 'Password123';

if (!MONGO_URI) {
  console.error('❌ Error: Database Connection string (MONGO_URI) missing from environment variables.');
  process.exit(1);
}

// Automatically resolve modern querySrv connection blocks on local network routers
if (MONGO_URI.includes('mongodb+srv://') && MONGO_URI.includes('cluster0.pnsx1ps.mongodb.net')) {
  console.log('⚠️ Local DNS protocol restriction detected. Activating direct connection fallback...');
  MONGO_URI = 'mongodb://Nelson:W9qVs0r44OFqa3n8@ac-movygpe-shard-00-00.pnsx1ps.mongodb.net:27017,ac-movygpe-shard-00-01.pnsx1ps.mongodb.net:27017,ac-movygpe-shard-00-02.pnsx1ps.mongodb.net:27017/bizbridge?ssl=true&replicaSet=atlas-4iw6s3-shard-0&authSource=admin&appName=Cluster0';
}

// ─── USERS: ARTISANS ──────────────────────────────────────────────────────────

const artisans = [
  {
    username: 'adebayo_crafts',
    email: 'adebayo@bizbridge.com',
    password: DEFAULT_PASSWORD,
    role: 'artisan',
    contactName: 'Adebayo Okafor',
    businessName: "Adebayo's Fine Woodworks",
    businessDescription:
      'Award-winning furniture maker with over 15 years of experience crafting bespoke hardwood pieces for homes and offices across Lagos.',
    phoneNumber: '+2348012345678',
    whatsappNumber: '+2348012345678',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    location: { address: '14 Balogun Street', city: 'Lagos', state: 'Lagos', lga: 'Lagos Island' },
    business: { yearEstablished: 2009, staffStrength: 4, isCACRegistered: true, cacNumber: 'RC123456' },
    professional: {
      specialties: ['Woodworking', 'Furniture Restoration'],
      experience: '15 years crafting custom hardwood furniture and cabinetry.',
      certifications: ['Lagos State Artisan Guild Certified'],
    },
    analytics: { profileViews: 342, totalBookings: 87, completedBookings: 82, averageRating: 4.8, totalReviews: 64 },
    featured: { isFeatured: true, featuredOrder: 1 },
    isVerified: true,
  },
  {
    username: 'ngozi_pottery',
    email: 'ngozi@bizbridge.com',
    password: DEFAULT_PASSWORD,
    role: 'artisan',
    contactName: 'Ngozi Eze',
    businessName: 'Ngozi Clay Studio',
    businessDescription:
      'Contemporary pottery and ceramics studio blending traditional Igbo clay techniques with modern aesthetics.',
    phoneNumber: '+2348023456789',
    whatsappNumber: '+2348023456789',
    profileImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face',
    location: { address: '7 Awolowo Road', city: 'Ikeja', state: 'Lagos', lga: 'Ikeja' },
    business: { yearEstablished: 2015, staffStrength: 2, isCACRegistered: false },
    professional: {
      specialties: ['Pottery & Ceramics', 'Sculpture'],
      experience: '10 years working with clay, trained at Yaba College of Technology.',
      certifications: ['Yaba College of Technology – Ceramics Diploma'],
    },
    analytics: { profileViews: 218, totalBookings: 53, completedBookings: 50, averageRating: 4.9, totalReviews: 41 },
    featured: { isFeatured: true, featuredOrder: 2 },
    isVerified: true,
  },
  {
    username: 'fatima_textiles',
    email: 'fatima@bizbridge.com',
    password: DEFAULT_PASSWORD,
    role: 'artisan',
    contactName: 'Fatima Al-Hassan',
    businessName: 'Fatima Textile Arts',
    businessDescription:
      'Master weaver and embroiderer specialising in traditional Northern Nigerian textile arts.',
    phoneNumber: '+2348034567890',
    whatsappNumber: '+2348034567890',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
    location: { address: '22 Kano Road', city: 'Kano', state: 'Kano', lga: 'Kano Municipal' },
    business: { yearEstablished: 2012, staffStrength: 6, isCACRegistered: true, cacNumber: 'RC789012' },
    professional: {
      specialties: ['Textile Art', 'Embroidery', 'Traditional Clothing'],
      experience: '13 years in traditional textile arts.',
      certifications: ['National Board for Technical Education – Textile Arts'],
    },
    analytics: { profileViews: 289, totalBookings: 71, completedBookings: 68, averageRating: 4.7, totalReviews: 55 },
    featured: { isFeatured: true, featuredOrder: 3 },
    isVerified: true,
  },
  {
    username: 'chioma_jewelry',
    email: 'chioma@bizbridge.com',
    password: DEFAULT_PASSWORD,
    role: 'artisan',
    contactName: 'Chioma Nwankwo',
    businessName: 'Chioma Gold & Bead House',
    businessDescription:
      'Handmade fine jewelry and beadwork studio, blending brass, gold-plated pieces, and traditional coral beads.',
    phoneNumber: '+2348045678901',
    whatsappNumber: '+2348045678901',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    location: { address: '3 Adeniran Ogunsanya St', city: 'Lagos', state: 'Lagos', lga: 'Surulere' },
    business: { yearEstablished: 2017, staffStrength: 3, isCACRegistered: true, cacNumber: 'RC345678' },
    professional: {
      specialties: ['Jewelry Making', 'Beadwork'],
      experience: '8 years designing custom jewelry and traditional bead pieces.',
      certifications: ['Lagos Fashion & Craft Institute – Jewelry Design'],
    },
    analytics: { profileViews: 401, totalBookings: 96, completedBookings: 90, averageRating: 4.9, totalReviews: 77 },
    featured: { isFeatured: true, featuredOrder: 4 },
    isVerified: true,
  },
  {
    username: 'tunde_metalworks',
    email: 'tunde@bizbridge.com',
    password: DEFAULT_PASSWORD,
    role: 'artisan',
    contactName: 'Tunde Bakare',
    businessName: 'Bakare Metalworks',
    businessDescription:
      'Blacksmith and metal fabricator producing custom gates, decorative ironwork, and welded furniture.',
    phoneNumber: '+2348056789012',
    whatsappNumber: '+2348056789012',
    profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face',
    location: { address: '18 Iyana Ipaja Rd', city: 'Lagos', state: 'Lagos', lga: 'Alimosho' },
    business: { yearEstablished: 2008, staffStrength: 5, isCACRegistered: true, cacNumber: 'RC456789' },
    professional: {
      specialties: ['Metalwork'],
      experience: '17 years in blacksmithing and metal fabrication.',
      certifications: ['Industrial Training Fund – Welding Certificate'],
    },
    analytics: { profileViews: 176, totalBookings: 44, completedBookings: 41, averageRating: 4.6, totalReviews: 33 },
    featured: { isFeatured: false, featuredOrder: 0 },
    isVerified: true,
  },
  {
    username: 'amina_baskets',
    email: 'amina@bizbridge.com',
    password: DEFAULT_PASSWORD,
    role: 'artisan',
    contactName: 'Amina Sule',
    businessName: 'Amina Basket Weaves',
    businessDescription:
      'Hand-woven baskets, mats, and home storage pieces made from raffia and elephant grass.',
    phoneNumber: '+2348067890123',
    whatsappNumber: '+2348067890123',
    profileImage: 'https://images.unsplash.com/photo-1521252659862-eec69941b071?w=400&h=400&fit=crop&crop=face',
    location: { address: '9 Ojota Rd', city: 'Lagos', state: 'Lagos', lga: 'Kosofe' },
    business: { yearEstablished: 2019, staffStrength: 2, isCACRegistered: false },
    professional: {
      specialties: ['Basket Weaving'],
      experience: '6 years weaving traditional baskets and storage mats.',
      certifications: [],
    },
    analytics: { profileViews: 132, totalBookings: 29, completedBookings: 27, averageRating: 4.8, totalReviews: 20 },
    featured: { isFeatured: false, featuredOrder: 0 },
    isVerified: true,
  },
  {
    username: 'emeka_leather',
    email: 'emeka@bizbridge.com',
    password: DEFAULT_PASSWORD,
    role: 'artisan',
    contactName: 'Emeka Chukwu',
    businessName: 'Chukwu Leather Co.',
    businessDescription:
      'Handmade leather bags, wallets, and sandals crafted from full-grain Nigerian leather.',
    phoneNumber: '+2348078901234',
    whatsappNumber: '+2348078901234',
    profileImage: 'https://unsplash.com',
    location: { address: '5 Aba Road', city: 'Aba', state: 'Abia', lga: 'Aba South' },
    business: { yearEstablished: 2014, staffStrength: 4, isCACRegistered: true, cacNumber: 'RC567890' },
    professional: {
      specialties: ['Leathercraft', 'Shoemaking'],
      experience: '11 years processing and styling finished leather items.',
      certifications: [],
    },
    analytics: { profileViews: 204, totalBookings: 61, completedBookings: 58, averageRating: 4.8, totalReviews: 44 },
    featured: { isFeatured: false, featuredOrder: 0 },
    isVerified: true,
  }
];

// ─── RUN SEED LOGIC ───────────────────────────────────────────────────────────

const seedDatabase = async () => {
  try {
    console.log('🔄 Attempting Connection to MongoDB Atlas Cluster...');

    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ Connected successfully to database ecosystem.');

    // Clean existing artisan entries cleanly
    console.log('🗑️ Purging existing artisan records...');
    await User.deleteMany({ role: 'artisan' });
    console.log('🔐 Hashing default artisan credentials safely...');
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(DEFAULT_PASSWORD, salt);
    const preparedArtisans = artisans.map(artisan => ({ ...artisan, password: encryptedPassword }));
    await User.insertMany(preparedArtisans); console.log('🌟 Database seed finalized flawlessly.');
  } catch (error) { console.error('❌ Execution halted. Seeding sequence failed:', error); } finally { await mongoose.disconnect(); console.log('🔌 Shard connection channels securely detached.'); process.exit(0); }
}; seedDatabase();