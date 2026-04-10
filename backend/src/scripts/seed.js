// backend/src/scripts/seed.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

import User from '../models/user.js';
import Service from '../models/service.js';

const MONGO_URI = process.env.MONGO_URI;

// ─── USERS ────────────────────────────────────────────────────────────────────

const artisans = [
  {
    username: 'adebayo_crafts',
    email: 'adebayo@bizbridge.com',
    password: 'Password123',
    role: 'artisan',
    contactName: 'Adebayo Okafor',
    businessName: "Adebayo's Fine Woodworks",
    businessDescription:
      'Award-winning furniture maker with over 15 years of experience crafting bespoke hardwood pieces for homes and offices across Lagos. Every piece is hand-finished and built to last generations.',
    phoneNumber: '+2348012345678',
    whatsappNumber: '+2348012345678',
    profileImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    location: { address: '14 Balogun Street', city: 'Lagos', state: 'Lagos', lga: 'Lagos Island' },
    business: { yearEstablished: 2009, staffStrength: 4, isCACRegistered: true, cacNumber: 'RC123456' },
    professional: {
      specialties: ['Woodworking', 'Furniture Restoration'],
      experience: '15 years crafting custom hardwood furniture, cabinetry, and decorative wood pieces. Trained under master craftsmen in Ibadan.',
      certifications: ['Lagos State Artisan Guild Certified', 'NAFDAC Approved Workshop'],
    },
    analytics: { profileViews: 342, totalBookings: 87, completedBookings: 82, averageRating: 4.8, totalReviews: 64 },
    featured: { isFeatured: true, featuredOrder: 1 },
    isVerified: true,
  },
  {
    username: 'ngozi_pottery',
    email: 'ngozi@bizbridge.com',
    password: 'Password123',
    role: 'artisan',
    contactName: 'Ngozi Eze',
    businessName: 'Ngozi Clay Studio',
    businessDescription:
      'Contemporary pottery and ceramics studio blending traditional Igbo clay techniques with modern aesthetics. Specialising in functional tableware, decorative vases, and custom commissions.',
    phoneNumber: '+2348023456789',
    whatsappNumber: '+2348023456789',
    profileImage:
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face',
    location: { address: '7 Awolowo Road', city: 'Ikeja', state: 'Lagos', lga: 'Ikeja' },
    business: { yearEstablished: 2015, staffStrength: 2, isCACRegistered: false },
    professional: {
      specialties: ['Pottery & Ceramics', 'Sculpture'],
      experience: '10 years working with clay. Studied ceramics at Yaba College of Technology and apprenticed with a master potter in Abuja.',
      certifications: ['Yaba College of Technology – Ceramics Diploma'],
    },
    analytics: { profileViews: 218, totalBookings: 53, completedBookings: 50, averageRating: 4.9, totalReviews: 41 },
    featured: { isFeatured: true, featuredOrder: 2 },
    isVerified: true,
  },
  {
    username: 'fatima_textiles',
    email: 'fatima@bizbridge.com',
    password: 'Password123',
    role: 'artisan',
    contactName: 'Fatima Al-Hassan',
    businessName: 'Fatima Textile Arts',
    businessDescription:
      'Master weaver and embroiderer specialising in traditional Northern Nigerian textile arts — from hand-woven aso-oke to intricate embroidered agbada. Custom orders welcome for weddings and cultural events.',
    phoneNumber: '+2348034567890',
    whatsappNumber: '+2348034567890',
    profileImage:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
    location: { address: '22 Kano Road', city: 'Kano', state: 'Kano', lga: 'Kano Municipal' },
    business: { yearEstablished: 2012, staffStrength: 6, isCACRegistered: true, cacNumber: 'RC789012' },
    professional: {
      specialties: ['Textile Art', 'Embroidery', 'Traditional Clothing'],
      experience: '13 years in traditional textile arts. Learned weaving from her grandmother and expanded into embroidery and custom garment production.',
      certifications: ['National Board for Technical Education – Textile Arts', 'Kano Artisans Cooperative Member'],
    },
    analytics: { profileViews: 289, totalBookings: 71, completedBookings: 68, averageRating: 4.7, totalReviews: 55 },
    featured: { isFeatured: true, featuredOrder: 3 },
    isVerified: true,
  },
];

const customers = [
  {
    username: 'chidi_obi',
    email: 'chidi@bizbridge.com',
    password: 'Password123',
    role: 'customer',
    fullName: 'Chidi Obi',
    profileImage:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    customerLocation: { city: 'Lagos', state: 'Lagos', lga: 'Victoria Island' },
    preferences: { favoriteCategories: ['Woodworking', 'Pottery & Ceramics'] },
    isVerified: true,
  },
  {
    username: 'amaka_johnson',
    email: 'amaka@bizbridge.com',
    password: 'Password123',
    role: 'customer',
    fullName: 'Amaka Johnson',
    profileImage:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    customerLocation: { city: 'Abuja', state: 'FCT', lga: 'Garki' },
    preferences: { favoriteCategories: ['Textile Art', 'Embroidery', 'Traditional Clothing'] },
    isVerified: true,
  },
];

// ─── SERVICES ─────────────────────────────────────────────────────────────────

const buildServices = (artisanMap) => [
  // Adebayo – Woodworking (fixed)
  {
    artisan: artisanMap['adebayo_crafts'],
    title: 'Custom Hardwood Dining Table',
    description:
      'Handcrafted solid hardwood dining tables made to your exact specifications. Choose from iroko, mahogany, or teak. Each table is hand-planed, mortise-and-tenon jointed, and finished with food-safe oil. Seats 4–12 people. Delivery and installation included within Lagos.',
    category: 'Woodworking',
    pricing: { type: 'fixed', basePrice: 185000, baseDuration: '3–4 weeks', currency: 'NGN', description: 'Price includes materials, finishing, and Lagos delivery.' },
    locations: [{ name: 'Lagos Island', lga: 'Lagos Island', type: 'lga' }, { name: 'Ikeja', lga: 'Ikeja', type: 'lga' }, { name: 'Victoria Island', lga: 'Eti-Osa', type: 'lga' }],
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&h=600&fit=crop',
    ],
    tags: ['dining table', 'hardwood', 'custom furniture', 'iroko', 'mahogany'],
    ratings: { average: 4.9, count: 28 },
    isActive: true,
  },
  // Adebayo – Woodworking (categorized)
  {
    artisan: artisanMap['adebayo_crafts'],
    title: 'Bespoke Wooden Furniture & Cabinetry',
    description:
      'Full range of custom wooden furniture and built-in cabinetry. From bedroom wardrobes and kitchen cabinets to office shelving and TV units. All pieces are built from sustainably sourced Nigerian hardwood with dovetail joints and hand-applied finishes.',
    category: 'Woodworking',
    pricing: {
      type: 'categorized',
      currency: 'NGN',
      description: 'Pricing varies by piece type and complexity.',
      categories: [
        { name: 'Furniture Making', price: 120000, duration: '2–3 weeks', description: 'Chairs, stools, side tables, and accent pieces' },
        { name: 'Cabinet Making', price: 200000, duration: '3–5 weeks', description: 'Kitchen cabinets, wardrobes, and built-in storage' },
        { name: 'Wood Carving', price: 45000, duration: '1–2 weeks', description: 'Decorative carvings, wall art, and figurines' },
        { name: 'Restoration', price: 35000, duration: '1 week', description: 'Repair and refinishing of existing wooden furniture' },
      ],
    },
    locations: [{ name: 'Lagos Island', lga: 'Lagos Island', type: 'lga' }, { name: 'Ikeja', lga: 'Ikeja', type: 'lga' }],
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    ],
    tags: ['cabinet', 'wardrobe', 'kitchen', 'shelving', 'custom woodwork'],
    ratings: { average: 4.7, count: 19 },
    isActive: true,
  },
  // Ngozi – Pottery (negotiate)
  {
    artisan: artisanMap['ngozi_pottery'],
    title: 'Custom Ceramic Tableware Set',
    description:
      'Handthrown ceramic tableware sets crafted to order. Each piece is wheel-thrown, bisque fired, glazed with food-safe glazes, and kiln fired to 1200°C. Sets include dinner plates, side plates, bowls, and mugs. Choose from a range of glaze colours and surface textures. Perfect for weddings, restaurants, and home use.',
    category: 'Pottery & Ceramics',
    pricing: { type: 'negotiate', currency: 'NGN', description: 'Price depends on set size, glaze complexity, and quantity. Contact for a quote.' },
    locations: [{ name: 'Ikeja', lga: 'Ikeja', type: 'lga' }, { name: 'Surulere', lga: 'Surulere', type: 'lga' }],
    images: [
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&h=600&fit=crop',
    ],
    tags: ['ceramics', 'tableware', 'handmade', 'pottery', 'custom'],
    ratings: { average: 5.0, count: 14 },
    isActive: true,
  },
  // Ngozi – Sculpture (fixed)
  {
    artisan: artisanMap['ngozi_pottery'],
    title: 'Decorative Clay Sculpture & Wall Art',
    description:
      'Original sculptural pieces and wall-mounted ceramic art inspired by Igbo and Yoruba visual traditions. Each piece is one-of-a-kind, hand-built using coiling and slab techniques, and finished with natural oxide stains. Ideal for home décor, corporate lobbies, and gallery collections.',
    category: 'Sculpture',
    pricing: { type: 'fixed', basePrice: 55000, baseDuration: '2–3 weeks', currency: 'NGN', description: 'Price per piece. Larger installations quoted separately.' },
    locations: [{ name: 'Ikeja', lga: 'Ikeja', type: 'lga' }, { name: 'Lagos Island', lga: 'Lagos Island', type: 'lga' }],
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800&h=600&fit=crop',
    ],
    tags: ['sculpture', 'wall art', 'clay', 'decorative', 'African art'],
    ratings: { average: 4.8, count: 11 },
    isActive: true,
  },
  // Fatima – Textile (categorized)
  {
    artisan: artisanMap['fatima_textiles'],
    title: 'Hand-Woven Aso-Oke & Traditional Fabric',
    description:
      'Authentic hand-woven aso-oke fabric produced on traditional narrow-band looms. Available in ìpèlé (shoulder cloth), gèlè (head tie), and sòkòtò (trouser fabric) sets. Custom colour combinations and patterns available. Minimum order 3 yards. Ideal for weddings, naming ceremonies, and cultural events.',
    category: 'Textile Art',
    pricing: {
      type: 'categorized',
      currency: 'NGN',
      description: 'Pricing per set or per yard depending on weave complexity.',
      categories: [
        { name: 'Weaving', price: 28000, duration: '1–2 weeks', description: 'Standard aso-oke set (ìpèlé, gèlè, sòkòtò)' },
        { name: 'Custom Clothing', price: 65000, duration: '2–3 weeks', description: 'Full custom agbada or buba-and-iro set with embroidery' },
        { name: 'Fabric Dyeing', price: 15000, duration: '3–5 days', description: 'Adire or tie-and-dye on customer-supplied fabric' },
        { name: 'Home Textiles', price: 22000, duration: '1 week', description: 'Table runners, cushion covers, and wall hangings' },
      ],
    },
    locations: [{ name: 'Kano Municipal', lga: 'Kano Municipal', type: 'lga' }, { name: 'Nassarawa', lga: 'Nassarawa', type: 'lga' }],
    images: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1594938298603-c8148c4b4f7f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&h=600&fit=crop',
    ],
    tags: ['aso-oke', 'weaving', 'traditional fabric', 'wedding', 'Nigerian textile'],
    ratings: { average: 4.7, count: 22 },
    isActive: true,
  },
  // Fatima – Embroidery (fixed)
  {
    artisan: artisanMap['fatima_textiles'],
    title: 'Custom Embroidered Agbada & Kaftan',
    description:
      'Exquisite hand-embroidered agbada and kaftan garments using traditional Hausa embroidery techniques. Intricate geometric and floral patterns stitched with silk and metallic threads. Provide your fabric or choose from our premium stock. Measurements taken in-person or via video call. Nationwide delivery available.',
    category: 'Embroidery',
    pricing: { type: 'fixed', basePrice: 75000, baseDuration: '2–4 weeks', currency: 'NGN', description: 'Price includes embroidery work and basic tailoring. Premium fabric add-ons available.' },
    locations: [{ name: 'Kano Municipal', lga: 'Kano Municipal', type: 'lga' }],
    images: [
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&h=600&fit=crop',
    ],
    tags: ['embroidery', 'agbada', 'kaftan', 'Hausa', 'custom clothing'],
    ratings: { average: 4.6, count: 18 },
    isActive: true,
  },
];

// ─── SEED FUNCTION ────────────────────────────────────────────────────────────

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing seed data
    const seedEmails = [...artisans, ...customers].map(u => u.email);
    await User.deleteMany({ email: { $in: seedEmails } });
    console.log('🗑️  Cleared existing seed users');

    // Hash passwords and insert users
    const hashedArtisans = await Promise.all(
      artisans.map(async (u) => {
        const salt = await bcrypt.genSalt(12);
        return { ...u, password: await bcrypt.hash(u.password, salt) };
      })
    );
    const hashedCustomers = await Promise.all(
      customers.map(async (u) => {
        const salt = await bcrypt.genSalt(12);
        return { ...u, password: await bcrypt.hash(u.password, salt) };
      })
    );

    const insertedArtisans = await User.insertMany(hashedArtisans);
    const insertedCustomers = await User.insertMany(hashedCustomers);
    console.log(`✅ Inserted ${insertedArtisans.length} artisans, ${insertedCustomers.length} customers`);

    // Build username → _id map
    const artisanMap = {};
    insertedArtisans.forEach(a => { artisanMap[a.username] = a._id; });

    // Clear existing seed services
    const artisanIds = Object.values(artisanMap);
    await Service.deleteMany({ artisan: { $in: artisanIds } });
    console.log('🗑️  Cleared existing seed services');

    const services = buildServices(artisanMap);
    const insertedServices = await Service.insertMany(services);
    console.log(`✅ Inserted ${insertedServices.length} services`);

    // Link services back to artisan documents
    for (const service of insertedServices) {
      await User.findByIdAndUpdate(service.artisan, {
        $addToSet: { services: service._id }
      });
    }
    console.log('✅ Linked services to artisan profiles');

    console.log('\n🎉 Seed complete!\n');
    console.log('─── Login credentials ───────────────────');
    [...artisans, ...customers].forEach(u => {
      console.log(`  ${u.role.padEnd(8)} | ${u.email.padEnd(28)} | Password123`);
    });
    console.log('─────────────────────────────────────────\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
