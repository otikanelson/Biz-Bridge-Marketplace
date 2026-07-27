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
const DEFAULT_PASSWORD = 'Password123';

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
    profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face&sat=-100',
    location: { address: '5 Aba Road', city: 'Aba', state: 'Abia', lga: 'Aba South' },
    business: { yearEstablished: 2014, staffStrength: 4, isCACRegistered: true, cacNumber: 'RC567890' },
    professional: {
      specialties: ['Leathercraft', 'Shoemaking'],
      experience: '11 years in leatherworking, trained in the Aba leather district.',
      certifications: ['Aba Leather Cluster Association Member'],
    },
    analytics: { profileViews: 245, totalBookings: 61, completedBookings: 58, averageRating: 4.7, totalReviews: 47 },
    featured: { isFeatured: false, featuredOrder: 0 },
    isVerified: true,
  },
  {
    username: 'yetunde_soaps',
    email: 'yetunde@bizbridge.com',
    password: DEFAULT_PASSWORD,
    role: 'artisan',
    contactName: 'Yetunde Bello',
    businessName: 'Yetunde Naturals',
    businessDescription:
      'Handmade organic soaps and scented candles using shea butter, black soap base, and essential oils.',
    phoneNumber: '+2348089012345',
    whatsappNumber: '+2348089012345',
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
    location: { address: '11 Allen Avenue', city: 'Ikeja', state: 'Lagos', lga: 'Ikeja' },
    business: { yearEstablished: 2020, staffStrength: 2, isCACRegistered: false },
    professional: {
      specialties: ['Soap & Candle Making'],
      experience: '5 years making organic soaps and candles.',
      certifications: ['NAFDAC Registered Products'],
    },
    analytics: { profileViews: 310, totalBookings: 84, completedBookings: 80, averageRating: 4.9, totalReviews: 66 },
    featured: { isFeatured: false, featuredOrder: 0 },
    isVerified: true,
  },
  {
    username: 'blessing_hair',
    email: 'blessing@bizbridge.com',
    password: DEFAULT_PASSWORD,
    role: 'artisan',
    contactName: 'Blessing Adeyemi',
    businessName: 'Blessing Hair Studio',
    businessDescription:
      'Professional hair braiding and styling studio specialising in protective styles, weaves, and natural hair care.',
    phoneNumber: '+2348090123456',
    whatsappNumber: '+2348090123456',
    profileImage: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=400&fit=crop&crop=face',
    location: { address: '27 Ogunlana Drive', city: 'Lagos', state: 'Lagos', lga: 'Surulere' },
    business: { yearEstablished: 2018, staffStrength: 5, isCACRegistered: true, cacNumber: 'RC678901' },
    professional: {
      specialties: ['Hair Braiding & Styling'],
      experience: '9 years in professional hair styling and braiding.',
      certifications: ['Lagos Hairdressers Association Certified'],
    },
    analytics: { profileViews: 512, totalBookings: 143, completedBookings: 138, averageRating: 4.8, totalReviews: 110 },
    featured: { isFeatured: false, featuredOrder: 0 },
    isVerified: true,
  },
  {
    username: 'musa_beads',
    email: 'musa@bizbridge.com',
    password: DEFAULT_PASSWORD,
    role: 'artisan',
    contactName: 'Musa Ibrahim',
    businessName: 'Musa Calabash & Beadwork',
    businessDescription:
      'Traditional calabash decoration and beadwork artist, producing decorative gourds and ceremonial beadwear.',
    phoneNumber: '+2348001234567',
    whatsappNumber: '+2348001234567',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    location: { address: '2 Zaria Road', city: 'Kaduna', state: 'Kaduna', lga: 'Kaduna North' },
    business: { yearEstablished: 2011, staffStrength: 3, isCACRegistered: false },
    professional: {
      specialties: ['Calabash Carving', 'Beadwork'],
      experience: '14 years carving and decorating calabash gourds.',
      certifications: [],
    },
    analytics: { profileViews: 158, totalBookings: 37, completedBookings: 35, averageRating: 4.6, totalReviews: 26 },
    featured: { isFeatured: false, featuredOrder: 0 },
    isVerified: true,
  },
];

// ─── USERS: CUSTOMERS ─────────────────────────────────────────────────────────

const customers = [
  {
    username: 'chidi_obi',
    email: 'chidi@bizbridge.com',
    password: DEFAULT_PASSWORD,
    role: 'customer',
    fullName: 'Chidi Obi',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    customerLocation: { city: 'Lagos', state: 'Lagos', lga: 'Victoria Island' },
    preferences: { favoriteCategories: ['Woodworking', 'Pottery & Ceramics'] },
    isVerified: true,
  },
  {
    username: 'amaka_johnson',
    email: 'amaka@bizbridge.com',
    password: DEFAULT_PASSWORD,
    role: 'customer',
    fullName: 'Amaka Johnson',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    customerLocation: { city: 'Abuja', state: 'FCT', lga: 'Garki' },
    preferences: { favoriteCategories: ['Textile Art', 'Embroidery', 'Traditional Clothing'] },
    isVerified: true,
  },
];

// ─── SERVICES ─────────────────────────────────────────────────────────────────
// Helper to keep the featured/popular blocks terse and consistent.
const feat = (isFeatured, order = 0) => ({ isFeatured, featuredOrder: order });
const pop = (isPopular, order = 0, bookingCount = 0) => ({ isPopular, popularOrder: order, bookingCount });

const buildServices = (artisanMap) => [
  // ── Adebayo – Woodworking ──────────────────────────────────────────────
  {
    artisan: artisanMap['adebayo_crafts'],
    title: 'Custom Hardwood Dining Table',
    description: 'Handcrafted solid hardwood dining tables made to your exact specifications. Choose from iroko, mahogany, or teak. Seats 4–12 people. Delivery and installation included within Lagos.',
    category: 'Woodworking',
    pricing: { type: 'fixed', basePrice: 185000, baseDuration: '3–4 weeks', currency: 'NGN', description: 'Price includes materials, finishing, and Lagos delivery.' },
    locations: [{ name: 'Lagos Island', lga: 'Lagos Island', type: 'lga' }, { name: 'Ikeja', lga: 'Ikeja', type: 'lga' }, { name: 'Victoria Island', lga: 'Eti-Osa', type: 'lga' }],
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop'],
    tags: ['dining table', 'hardwood', 'custom furniture'],
    ratings: { average: 4.9, count: 28 },
    isActive: true,
    featured: feat(true, 1),
    popular: pop(true, 1, 87),
  },
  {
    artisan: artisanMap['adebayo_crafts'],
    title: 'Bespoke Wooden Furniture & Cabinetry',
    description: 'Full range of custom wooden furniture and built-in cabinetry, from bedroom wardrobes to office shelving. Built from sustainably sourced Nigerian hardwood.',
    category: 'Woodworking',
    pricing: { type: 'categorized', currency: 'NGN', description: 'Pricing varies by piece type and complexity.',
      categories: [
        { name: 'Furniture Making', price: 120000, duration: '2–3 weeks', description: 'Chairs, stools, side tables, accent pieces' },
        { name: 'Cabinet Making', price: 200000, duration: '3–5 weeks', description: 'Kitchen cabinets, wardrobes, built-in storage' },
        { name: 'Wood Carving', price: 45000, duration: '1–2 weeks', description: 'Decorative carvings, wall art, figurines' },
        { name: 'Restoration', price: 35000, duration: '1 week', description: 'Repair and refinishing of existing furniture' },
      ] },
    locations: [{ name: 'Lagos Island', lga: 'Lagos Island', type: 'lga' }, { name: 'Ikeja', lga: 'Ikeja', type: 'lga' }],
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'],
    tags: ['cabinet', 'wardrobe', 'kitchen'],
    ratings: { average: 4.7, count: 19 },
    isActive: true,
    featured: feat(false),
    popular: pop(true, 5, 41),
  },

  // ── Ngozi – Pottery / Sculpture ────────────────────────────────────────
  {
    artisan: artisanMap['ngozi_pottery'],
    title: 'Custom Ceramic Tableware Set',
    description: 'Handthrown ceramic tableware sets crafted to order — dinner plates, side plates, bowls, and mugs, glazed and kiln fired to 1200°C. Great for weddings and restaurants.',
    category: 'Pottery & Ceramics',
    pricing: { type: 'negotiate', currency: 'NGN', description: 'Price depends on set size, glaze complexity, and quantity.' },
    locations: [{ name: 'Ikeja', lga: 'Ikeja', type: 'lga' }, { name: 'Surulere', lga: 'Surulere', type: 'lga' }],
    images: ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800&h=600&fit=crop'],
    tags: ['ceramics', 'tableware', 'handmade'],
    ratings: { average: 5.0, count: 14 },
    isActive: true,
    featured: feat(true, 2),
    popular: pop(false),
  },
  {
    artisan: artisanMap['ngozi_pottery'],
    title: 'Decorative Clay Sculpture & Wall Art',
    description: 'Original sculptural pieces and wall-mounted ceramic art inspired by Igbo and Yoruba visual traditions. Hand-built using coiling and slab techniques.',
    category: 'Sculpture',
    pricing: { type: 'fixed', basePrice: 55000, baseDuration: '2–3 weeks', currency: 'NGN', description: 'Price per piece. Larger installations quoted separately.' },
    locations: [{ name: 'Ikeja', lga: 'Ikeja', type: 'lga' }, { name: 'Lagos Island', lga: 'Lagos Island', type: 'lga' }],
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800&h=600&fit=crop'],
    tags: ['sculpture', 'wall art', 'clay'],
    ratings: { average: 4.8, count: 11 },
    isActive: true,
    featured: feat(false),
    popular: pop(false),
  },

  // ── Fatima – Textile / Embroidery ──────────────────────────────────────
  {
    artisan: artisanMap['fatima_textiles'],
    title: 'Hand-Woven Aso-Oke & Traditional Fabric',
    description: 'Authentic hand-woven aso-oke produced on traditional narrow-band looms. Custom colour combinations available. Ideal for weddings and ceremonies.',
    category: 'Textile Art',
    pricing: { type: 'categorized', currency: 'NGN', description: 'Pricing per set or per yard depending on weave complexity.',
      categories: [
        { name: 'Weaving', price: 28000, duration: '1–2 weeks', description: 'Standard aso-oke set' },
        { name: 'Custom Clothing', price: 65000, duration: '2–3 weeks', description: 'Full custom agbada or buba-and-iro set' },
        { name: 'Fabric Dyeing', price: 15000, duration: '3–5 days', description: 'Adire or tie-and-dye on customer fabric' },
        { name: 'Home Textiles', price: 22000, duration: '1 week', description: 'Table runners, cushion covers, wall hangings' },
      ] },
    locations: [{ name: 'Kano Municipal', lga: 'Kano Municipal', type: 'lga' }, { name: 'Nassarawa', lga: 'Nassarawa', type: 'lga' }],
    images: ['https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1594938298603-c8148c4b4f7f?w=800&h=600&fit=crop'],
    tags: ['aso-oke', 'weaving', 'traditional fabric'],
    ratings: { average: 4.7, count: 22 },
    isActive: true,
    featured: feat(true, 3),
    popular: pop(true, 2, 71),
  },
  {
    artisan: artisanMap['fatima_textiles'],
    title: 'Custom Embroidered Agbada & Kaftan',
    description: 'Exquisite hand-embroidered agbada and kaftan using traditional Hausa embroidery techniques. Provide your fabric or choose from our premium stock.',
    category: 'Embroidery',
    pricing: { type: 'fixed', basePrice: 75000, baseDuration: '2–4 weeks', currency: 'NGN', description: 'Includes embroidery and basic tailoring.' },
    locations: [{ name: 'Kano Municipal', lga: 'Kano Municipal', type: 'lga' }],
    images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&h=600&fit=crop'],
    tags: ['embroidery', 'agbada', 'kaftan'],
    ratings: { average: 4.6, count: 18 },
    isActive: true,
    featured: feat(false),
    popular: pop(false),
  },

  // ── Chioma – Jewelry / Beadwork ────────────────────────────────────────
  {
    artisan: artisanMap['chioma_jewelry'],
    title: 'Handmade Gold-Plated Statement Jewelry',
    description: 'Custom-designed necklaces, earrings, and bracelets in gold-plated brass. Great for weddings, owambe events, and everyday elegance.',
    category: 'Jewelry Making',
    pricing: { type: 'fixed', basePrice: 32000, baseDuration: '1 week', currency: 'NGN', description: 'Per piece; sets priced on request.' },
    locations: [{ name: 'Surulere', lga: 'Surulere', type: 'lga' }, { name: 'Yaba', lga: 'Lagos Mainland', type: 'lga' }],
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop'],
    tags: ['jewelry', 'gold-plated', 'statement piece'],
    ratings: { average: 4.9, count: 51 },
    isActive: true,
    featured: feat(true, 4),
    popular: pop(true, 3, 96),
  },
  {
    artisan: artisanMap['chioma_jewelry'],
    title: 'Traditional Coral Bead Ceremonial Set',
    description: 'Handcrafted coral and glass bead sets for traditional weddings and chieftaincy ceremonies — necklace, bracelet, and crown accents.',
    category: 'Beadwork',
    pricing: { type: 'negotiate', currency: 'NGN', description: 'Price varies by bead type and set size.' },
    locations: [{ name: 'Surulere', lga: 'Surulere', type: 'lga' }],
    images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=600&fit=crop'],
    tags: ['coral beads', 'traditional wedding', 'ceremonial'],
    ratings: { average: 4.8, count: 24 },
    isActive: true,
    featured: feat(false),
    popular: pop(true, 6, 38),
  },

  // ── Tunde – Metalwork ───────────────────────────────────────────────────
  {
    artisan: artisanMap['tunde_metalworks'],
    title: 'Custom Wrought Iron Gates & Fencing',
    description: 'Durable, decorative wrought iron gates and perimeter fencing, custom-designed and installed. Rust-treated and painted to spec.',
    category: 'Metalwork',
    pricing: { type: 'fixed', basePrice: 250000, baseDuration: '3–5 weeks', currency: 'NGN', description: 'Price depends on size; site visit included.' },
    locations: [{ name: 'Alimosho', lga: 'Alimosho', type: 'lga' }, { name: 'Ikeja', lga: 'Ikeja', type: 'lga' }],
    images: ['https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1581091870622-2c2b8b1b5e8b?w=800&h=600&fit=crop'],
    tags: ['gate', 'wrought iron', 'fencing'],
    ratings: { average: 4.6, count: 15 },
    isActive: true,
    featured: feat(false),
    popular: pop(false),
  },
  {
    artisan: artisanMap['tunde_metalworks'],
    title: 'Welded Metal Furniture & Fixtures',
    description: 'Custom welded metal furniture including bar stools, shelving units, and window burglar-proofing, finished in powder coat or paint.',
    category: 'Metalwork',
    pricing: { type: 'categorized', currency: 'NGN', description: 'Pricing by job type.',
      categories: [
        { name: 'Welding', price: 40000, duration: '1–2 weeks', description: 'General welding and repair jobs' },
        { name: 'Decorative Metalwork', price: 60000, duration: '2–3 weeks', description: 'Artistic railings, screens, and fixtures' },
        { name: 'Tool Making', price: 20000, duration: '1 week', description: 'Custom tool and hardware fabrication' },
      ] },
    locations: [{ name: 'Alimosho', lga: 'Alimosho', type: 'lga' }],
    images: ['https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop'],
    tags: ['metal furniture', 'welding', 'fabrication'],
    ratings: { average: 4.5, count: 12 },
    isActive: true,
    featured: feat(false),
    popular: pop(false),
  },

  // ── Amina – Basket Weaving ───────────────────────────────────────────────
  {
    artisan: artisanMap['amina_baskets'],
    title: 'Hand-Woven Storage & Laundry Baskets',
    description: 'Sturdy raffia and elephant-grass baskets for laundry, storage, and décor. Custom sizes and colour patterns available.',
    category: 'Basket Weaving',
    pricing: { type: 'fixed', basePrice: 12000, baseDuration: '3–5 days', currency: 'NGN', description: 'Price per basket; bulk discounts available.' },
    locations: [{ name: 'Kosofe', lga: 'Kosofe', type: 'lga' }, { name: 'Ikorodu', lga: 'Ikorodu', type: 'lga' }],
    images: ['https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1520981825232-ece5fae45120?w=800&h=600&fit=crop'],
    tags: ['basket', 'raffia', 'home storage'],
    ratings: { average: 4.8, count: 20 },
    isActive: true,
    featured: feat(false),
    popular: pop(true, 7, 29),
  },
  {
    artisan: artisanMap['amina_baskets'],
    title: 'Woven Table Mats & Placemat Sets',
    description: 'Handwoven table mats and placemat sets in traditional patterns, made from dyed raffia. Sold in sets of 4, 6, or 8.',
    category: 'Basket Weaving',
    pricing: { type: 'fixed', basePrice: 8000, baseDuration: '2–3 days', currency: 'NGN', description: 'Priced per set of 6.' },
    locations: [{ name: 'Kosofe', lga: 'Kosofe', type: 'lga' }],
    images: ['https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&h=600&fit=crop'],
    tags: ['table mats', 'placemats', 'raffia'],
    ratings: { average: 4.7, count: 9 },
    isActive: true,
    featured: feat(false),
    popular: pop(false),
  },

  // ── Emeka – Leathercraft / Shoemaking ────────────────────────────────────
  {
    artisan: artisanMap['emeka_leather'],
    title: 'Handmade Full-Grain Leather Bags',
    description: 'Durable, hand-stitched leather totes, briefcases, and backpacks made from full-grain Nigerian leather. Customisable colours and monogramming.',
    category: 'Leathercraft',
    pricing: { type: 'fixed', basePrice: 45000, baseDuration: '1–2 weeks', currency: 'NGN', description: 'Price per bag; monogramming extra.' },
    locations: [{ name: 'Aba South', lga: 'Aba South', type: 'lga' }],
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&h=600&fit=crop'],
    tags: ['leather bag', 'handmade', 'briefcase'],
    ratings: { average: 4.7, count: 33 },
    isActive: true,
    featured: feat(true, 5),
    popular: pop(true, 4, 61),
  },
  {
    artisan: artisanMap['emeka_leather'],
    title: 'Custom Leather Sandals & Shoes',
    description: 'Handcrafted leather sandals and formal shoes, made to measure with reinforced stitching and cushioned soles.',
    category: 'Shoemaking',
    pricing: { type: 'fixed', basePrice: 28000, baseDuration: '1 week', currency: 'NGN', description: 'Price per pair; custom sizing included.' },
    locations: [{ name: 'Aba South', lga: 'Aba South', type: 'lga' }],
    images: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&h=600&fit=crop'],
    tags: ['sandals', 'shoes', 'leather'],
    ratings: { average: 4.6, count: 21 },
    isActive: true,
    featured: feat(false),
    popular: pop(false),
  },

  // ── Yetunde – Soap & Candle Making ───────────────────────────────────────
  {
    artisan: artisanMap['yetunde_soaps'],
    title: 'Organic Shea Butter Soap Bars',
    description: 'Handmade organic soap bars using raw shea butter, black soap base, and essential oils. Sold individually or in gift sets.',
    category: 'Soap & Candle Making',
    pricing: { type: 'fixed', basePrice: 3500, baseDuration: '1–2 days', currency: 'NGN', description: 'Price per bar; gift sets priced separately.' },
    locations: [{ name: 'Ikeja', lga: 'Ikeja', type: 'lga' }, { name: 'Surulere', lga: 'Surulere', type: 'lga' }],
    images: ['https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1585232351009-aa87416fca90?w=800&h=600&fit=crop'],
    tags: ['organic soap', 'shea butter', 'handmade'],
    ratings: { average: 4.9, count: 58 },
    isActive: true,
    featured: feat(true, 6),
    popular: pop(true, 8, 80),
  },
  {
    artisan: artisanMap['yetunde_soaps'],
    title: 'Scented Soy Candles & Gift Boxes',
    description: 'Hand-poured soy candles in reusable glass jars, available in a range of scents. Custom gift boxes for weddings and events.',
    category: 'Soap & Candle Making',
    pricing: { type: 'fixed', basePrice: 6000, baseDuration: '2–3 days', currency: 'NGN', description: 'Price per candle; gift boxes quoted on request.' },
    locations: [{ name: 'Ikeja', lga: 'Ikeja', type: 'lga' }],
    images: ['https://images.unsplash.com/photo-1602874801007-bd45bc4ac2b1?w=800&h=600&fit=crop'],
    tags: ['candles', 'soy wax', 'gift box'],
    ratings: { average: 4.8, count: 25 },
    isActive: true,
    featured: feat(false),
    popular: pop(false),
  },

  // ── Blessing – Hair Braiding & Styling ────────────────────────────────────
  {
    artisan: artisanMap['blessing_hair'],
    title: 'Box Braids & Protective Styling',
    description: 'Professional box braids, knotless braids, and other protective styles using premium synthetic or human hair. Home service available.',
    category: 'Hair Braiding & Styling',
    pricing: { type: 'categorized', currency: 'NGN', description: 'Pricing by style and length.',
      categories: [
        { name: 'Box Braids (Medium)', price: 15000, duration: '3–4 hours', description: 'Shoulder-length box braids' },
        { name: 'Knotless Braids (Long)', price: 22000, duration: '5–6 hours', description: 'Waist-length knotless braids' },
        { name: 'Cornrows', price: 8000, duration: '1–2 hours', description: 'Classic straight-back cornrows' },
      ] },
    locations: [{ name: 'Surulere', lga: 'Surulere', type: 'lga' }, { name: 'Yaba', lga: 'Lagos Mainland', type: 'lga' }],
    images: ['https://images.unsplash.com/photo-1595499280869-2a9bffed7817?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&h=600&fit=crop'],
    tags: ['box braids', 'protective style', 'hair'],
    ratings: { average: 4.8, count: 90 },
    isActive: true,
    featured: feat(true, 7),
    popular: pop(true, 9, 143),
  },
  {
    artisan: artisanMap['blessing_hair'],
    title: 'Natural Hair Care & Treatment',
    description: 'Deep conditioning, silk press, and natural hair treatments designed to restore moisture and strengthen curl pattern.',
    category: 'Hair Braiding & Styling',
    pricing: { type: 'fixed', basePrice: 12000, baseDuration: '2 hours', currency: 'NGN', description: 'Includes wash, treatment, and style.' },
    locations: [{ name: 'Surulere', lga: 'Surulere', type: 'lga' }],
    images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop'],
    tags: ['natural hair', 'treatment', 'silk press'],
    ratings: { average: 4.7, count: 34 },
    isActive: true,
    featured: feat(false),
    popular: pop(true, 10, 45),
  },

  // ── Musa – Calabash Carving / Beadwork ───────────────────────────────────
  {
    artisan: artisanMap['musa_beads'],
    title: 'Hand-Carved Decorative Calabash',
    description: 'Traditional carved and painted calabash gourds for home décor and ceremonial use. Custom motifs available on request.',
    category: 'Calabash Carving',
    pricing: { type: 'fixed', basePrice: 9500, baseDuration: '3–5 days', currency: 'NGN', description: 'Price per piece; sets priced on request.' },
    locations: [{ name: 'Kaduna North', lga: 'Kaduna North', type: 'lga' }],
    images: ['https://images.unsplash.com/photo-1587582423116-ec07293f0395?w=800&h=600&fit=crop'],
    tags: ['calabash', 'carving', 'décor'],
    ratings: { average: 4.6, count: 16 },
    isActive: true,
    featured: feat(false),
    popular: pop(false),
  },
  {
    artisan: artisanMap['musa_beads'],
    title: 'Ceremonial Beadwear & Regalia',
    description: 'Handmade beaded caps, wristlets, and ceremonial regalia for cultural festivals and traditional title-taking events.',
    category: 'Beadwork',
    pricing: { type: 'negotiate', currency: 'NGN', description: 'Price depends on complexity and materials.' },
    locations: [{ name: 'Kaduna North', lga: 'Kaduna North', type: 'lga' }],
    images: ['https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=800&h=600&fit=crop'],
    tags: ['beadwork', 'regalia', 'cultural'],
    ratings: { average: 4.5, count: 10 },
    isActive: true,
    featured: feat(false),
    popular: pop(false),
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

    const featuredCount = insertedServices.filter(s => s.featured?.isFeatured).length;
    const popularCount = insertedServices.filter(s => s.popular?.isPopular).length;

    console.log('\n🎉 Seed complete!\n');
    console.log(`   📌 Featured services: ${featuredCount}`);
    console.log(`   🔥 Popular services:  ${popularCount}`);
    console.log('\n─── Login credentials ───────────────────');
    [...artisans, ...customers].forEach(u => {
      console.log(`  ${u.role.padEnd(8)} | ${u.email.padEnd(28)} | ${DEFAULT_PASSWORD}`);
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