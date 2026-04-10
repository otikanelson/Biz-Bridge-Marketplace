// backend/src/routes/seedRoutes.js - ONE-TIME USE, REMOVE AFTER SEEDING
import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import Service from '../models/service.js';

const router = express.Router();

const SEED_SECRET = process.env.SEED_SECRET || 'bizbridge-seed-2024';

// GET /api/seed?secret=bizbridge-seed-2024
router.get('/', async (req, res) => {
  try {
    const { secret } = req.query;
    if (secret !== SEED_SECRET) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const seedEmails = [
      'adebayo@bizbridge.com', 'ngozi@bizbridge.com', 'fatima@bizbridge.com',
      'chidi@bizbridge.com', 'amaka@bizbridge.com'
    ];

    // Clear existing seed data
    const existingUsers = await User.find({ email: { $in: seedEmails } });
    const existingIds = existingUsers.map(u => u._id);
    await Service.deleteMany({ artisan: { $in: existingIds } });
    await User.deleteMany({ email: { $in: seedEmails } });

    const hash = async (pw) => bcrypt.hash(pw, 12);

    // ── ARTISANS ──────────────────────────────────────────────────────────────
    const artisanDocs = await User.insertMany([
      {
        username: 'adebayo_crafts', email: 'adebayo@bizbridge.com',
        password: await hash('Password123'), role: 'artisan',
        contactName: 'Adebayo Okafor', businessName: "Adebayo's Fine Woodworks",
        businessDescription: 'Award-winning furniture maker with over 15 years of experience crafting bespoke hardwood pieces for homes and offices across Lagos. Every piece is hand-finished and built to last generations.',
        phoneNumber: '+2348012345678', whatsappNumber: '+2348012345678',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        location: { address: '14 Balogun Street', city: 'Lagos', state: 'Lagos', lga: 'Lagos Island' },
        business: { yearEstablished: 2009, staffStrength: 4, isCACRegistered: true, cacNumber: 'RC123456' },
        professional: {
          specialties: ['Woodworking', 'Furniture Restoration'],
          experience: '15 years crafting custom hardwood furniture, cabinetry, and decorative wood pieces.',
          certifications: ['Lagos State Artisan Guild Certified'],
        },
        analytics: { profileViews: 342, totalBookings: 87, completedBookings: 82, averageRating: 4.8, totalReviews: 64 },
        featured: { isFeatured: true, featuredOrder: 1 },
        isVerified: true,
      },
      {
        username: 'ngozi_pottery', email: 'ngozi@bizbridge.com',
        password: await hash('Password123'), role: 'artisan',
        contactName: 'Ngozi Eze', businessName: 'Ngozi Clay Studio',
        businessDescription: 'Contemporary pottery and ceramics studio blending traditional Igbo clay techniques with modern aesthetics. Specialising in functional tableware, decorative vases, and custom commissions.',
        phoneNumber: '+2348023456789', whatsappNumber: '+2348023456789',
        profileImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face',
        location: { address: '7 Awolowo Road', city: 'Ikeja', state: 'Lagos', lga: 'Ikeja' },
        business: { yearEstablished: 2015, staffStrength: 2, isCACRegistered: false },
        professional: {
          specialties: ['Pottery & Ceramics', 'Sculpture'],
          experience: '10 years working with clay. Studied ceramics at Yaba College of Technology.',
          certifications: ['Yaba College of Technology – Ceramics Diploma'],
        },
        analytics: { profileViews: 218, totalBookings: 53, completedBookings: 50, averageRating: 4.9, totalReviews: 41 },
        featured: { isFeatured: true, featuredOrder: 2 },
        isVerified: true,
      },
      {
        username: 'fatima_textiles', email: 'fatima@bizbridge.com',
        password: await hash('Password123'), role: 'artisan',
        contactName: 'Fatima Al-Hassan', businessName: 'Fatima Textile Arts',
        businessDescription: 'Master weaver and embroiderer specialising in traditional Northern Nigerian textile arts — from hand-woven aso-oke to intricate embroidered agbada. Custom orders welcome for weddings and cultural events.',
        phoneNumber: '+2348034567890', whatsappNumber: '+2348034567890',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
        location: { address: '22 Kano Road', city: 'Kano', state: 'Kano', lga: 'Kano Municipal' },
        business: { yearEstablished: 2012, staffStrength: 6, isCACRegistered: true, cacNumber: 'RC789012' },
        professional: {
          specialties: ['Textile Art', 'Embroidery', 'Traditional Clothing'],
          experience: '13 years in traditional textile arts. Learned weaving from her grandmother.',
          certifications: ['National Board for Technical Education – Textile Arts'],
        },
        analytics: { profileViews: 289, totalBookings: 71, completedBookings: 68, averageRating: 4.7, totalReviews: 55 },
        featured: { isFeatured: true, featuredOrder: 3 },
        isVerified: true,
      },
    ]);

    // ── CUSTOMERS ─────────────────────────────────────────────────────────────
    await User.insertMany([
      {
        username: 'chidi_obi', email: 'chidi@bizbridge.com',
        password: await hash('Password123'), role: 'customer',
        fullName: 'Chidi Obi',
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
        customerLocation: { city: 'Lagos', state: 'Lagos', lga: 'Victoria Island' },
        preferences: { favoriteCategories: ['Woodworking', 'Pottery & Ceramics'] },
        isVerified: true,
      },
      {
        username: 'amaka_johnson', email: 'amaka@bizbridge.com',
        password: await hash('Password123'), role: 'customer',
        fullName: 'Amaka Johnson',
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
        customerLocation: { city: 'Abuja', state: 'FCT', lga: 'Garki' },
        preferences: { favoriteCategories: ['Textile Art', 'Embroidery'] },
        isVerified: true,
      },
    ]);

    const [adebayo, ngozi, fatima] = artisanDocs;

    // ── SERVICES ──────────────────────────────────────────────────────────────
    const services = await Service.insertMany([
      {
        artisan: adebayo._id, title: 'Custom Hardwood Dining Table',
        description: 'Handcrafted solid hardwood dining tables made to your exact specifications. Choose from iroko, mahogany, or teak. Each table is hand-planed, mortise-and-tenon jointed, and finished with food-safe oil. Seats 4–12 people. Delivery and installation included within Lagos.',
        category: 'Woodworking',
        pricing: { type: 'fixed', basePrice: 185000, baseDuration: '3–4 weeks', currency: 'NGN', description: 'Price includes materials, finishing, and Lagos delivery.' },
        locations: [{ name: 'Lagos Island', lga: 'Lagos Island', type: 'lga' }, { name: 'Ikeja', lga: 'Ikeja', type: 'lga' }],
        images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop'],
        tags: ['dining table', 'hardwood', 'custom furniture', 'iroko'],
        ratings: { average: 4.9, count: 28 }, isActive: true,
      },
      {
        artisan: adebayo._id, title: 'Bespoke Wooden Furniture & Cabinetry',
        description: 'Full range of custom wooden furniture and built-in cabinetry. From bedroom wardrobes and kitchen cabinets to office shelving and TV units. All pieces are built from sustainably sourced Nigerian hardwood with dovetail joints and hand-applied finishes.',
        category: 'Woodworking',
        pricing: {
          type: 'categorized', currency: 'NGN',
          description: 'Pricing varies by piece type and complexity.',
          categories: [
            { name: 'Furniture Making', price: 120000, duration: '2–3 weeks', description: 'Chairs, stools, side tables' },
            { name: 'Cabinet Making', price: 200000, duration: '3–5 weeks', description: 'Kitchen cabinets, wardrobes' },
            { name: 'Wood Carving', price: 45000, duration: '1–2 weeks', description: 'Decorative carvings and wall art' },
            { name: 'Restoration', price: 35000, duration: '1 week', description: 'Repair and refinishing' },
          ],
        },
        locations: [{ name: 'Lagos Island', lga: 'Lagos Island', type: 'lga' }],
        images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'],
        tags: ['cabinet', 'wardrobe', 'kitchen', 'custom woodwork'],
        ratings: { average: 4.7, count: 19 }, isActive: true,
      },
      {
        artisan: ngozi._id, title: 'Custom Ceramic Tableware Set',
        description: 'Handthrown ceramic tableware sets crafted to order. Each piece is wheel-thrown, bisque fired, glazed with food-safe glazes, and kiln fired to 1200°C. Sets include dinner plates, side plates, bowls, and mugs. Choose from a range of glaze colours and surface textures.',
        category: 'Pottery & Ceramics',
        pricing: { type: 'negotiate', currency: 'NGN', description: 'Price depends on set size, glaze complexity, and quantity. Contact for a quote.' },
        locations: [{ name: 'Ikeja', lga: 'Ikeja', type: 'lga' }, { name: 'Surulere', lga: 'Surulere', type: 'lga' }],
        images: ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800&h=600&fit=crop'],
        tags: ['ceramics', 'tableware', 'handmade', 'pottery'],
        ratings: { average: 5.0, count: 14 }, isActive: true,
      },
      {
        artisan: ngozi._id, title: 'Decorative Clay Sculpture & Wall Art',
        description: 'Original sculptural pieces and wall-mounted ceramic art inspired by Igbo and Yoruba visual traditions. Each piece is one-of-a-kind, hand-built using coiling and slab techniques, and finished with natural oxide stains.',
        category: 'Sculpture',
        pricing: { type: 'fixed', basePrice: 55000, baseDuration: '2–3 weeks', currency: 'NGN', description: 'Price per piece. Larger installations quoted separately.' },
        locations: [{ name: 'Ikeja', lga: 'Ikeja', type: 'lga' }],
        images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800&h=600&fit=crop'],
        tags: ['sculpture', 'wall art', 'clay', 'African art'],
        ratings: { average: 4.8, count: 11 }, isActive: true,
      },
      {
        artisan: fatima._id, title: 'Hand-Woven Aso-Oke & Traditional Fabric',
        description: 'Authentic hand-woven aso-oke fabric produced on traditional narrow-band looms. Available in ìpèlé, gèlè, and sòkòtò sets. Custom colour combinations and patterns available. Ideal for weddings, naming ceremonies, and cultural events.',
        category: 'Textile Art',
        pricing: {
          type: 'categorized', currency: 'NGN',
          description: 'Pricing per set or per yard depending on weave complexity.',
          categories: [
            { name: 'Weaving', price: 28000, duration: '1–2 weeks', description: 'Standard aso-oke set' },
            { name: 'Custom Clothing', price: 65000, duration: '2–3 weeks', description: 'Full custom agbada or buba-and-iro set' },
            { name: 'Fabric Dyeing', price: 15000, duration: '3–5 days', description: 'Adire or tie-and-dye on customer fabric' },
            { name: 'Home Textiles', price: 22000, duration: '1 week', description: 'Table runners, cushion covers, wall hangings' },
          ],
        },
        locations: [{ name: 'Kano Municipal', lga: 'Kano Municipal', type: 'lga' }],
        images: ['https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&h=600&fit=crop'],
        tags: ['aso-oke', 'weaving', 'traditional fabric', 'wedding'],
        ratings: { average: 4.7, count: 22 }, isActive: true,
      },
      {
        artisan: fatima._id, title: 'Custom Embroidered Agbada & Kaftan',
        description: 'Exquisite hand-embroidered agbada and kaftan garments using traditional Hausa embroidery techniques. Intricate geometric and floral patterns stitched with silk and metallic threads. Nationwide delivery available.',
        category: 'Embroidery',
        pricing: { type: 'fixed', basePrice: 75000, baseDuration: '2–4 weeks', currency: 'NGN', description: 'Price includes embroidery work and basic tailoring.' },
        locations: [{ name: 'Kano Municipal', lga: 'Kano Municipal', type: 'lga' }],
        images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&h=600&fit=crop'],
        tags: ['embroidery', 'agbada', 'kaftan', 'Hausa'],
        ratings: { average: 4.6, count: 18 }, isActive: true,
      },
    ]);

    // Link services to artisans
    for (const svc of services) {
      await User.findByIdAndUpdate(svc.artisan, { $addToSet: { services: svc._id } });
    }

    res.json({
      success: true,
      message: 'Database seeded successfully',
      data: { artisans: 3, customers: 2, services: services.length },
      credentials: [
        { role: 'artisan', email: 'adebayo@bizbridge.com', password: 'Password123' },
        { role: 'artisan', email: 'ngozi@bizbridge.com', password: 'Password123' },
        { role: 'artisan', email: 'fatima@bizbridge.com', password: 'Password123' },
        { role: 'customer', email: 'chidi@bizbridge.com', password: 'Password123' },
        { role: 'customer', email: 'amaka@bizbridge.com', password: 'Password123' },
      ],
    });
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
