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

if (MONGO_URI.includes('mongodb+srv://') && MONGO_URI.includes('cluster0.pnsx1ps.mongodb.net')) {
  console.log('⚠️ Local DNS protocol restriction detected. Activating direct connection fallback...');
  MONGO_URI = 'mongodb://Nelson:W9qVs0r44OFqa3n8@ac-movygpe-shard-00-00.pnsx1ps.mongodb.net:27017,ac-movygpe-shard-00-01.pnsx1ps.mongodb.net:27017,ac-movygpe-shard-00-02.pnsx1ps.mongodb.net:27017/bizbridge?ssl=true&replicaSet=atlas-4iw6s3-shard-0&authSource=admin&appName=Cluster0';
}

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
    profileImage: 'https://picsum.photos/id/1005/400/400',
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
          'https://picsum.photos/id/1070/800/600',
          'https://picsum.photos/id/1068/800/600'
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
          'https://picsum.photos/id/1071/800/600',
          'https://picsum.photos/id/1072/800/600'
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
          'https://picsum.photos/id/1069/800/600',
          'https://picsum.photos/id/1067/800/600'
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
    profileImage: 'https://picsum.photos/id/1027/400/400',
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
          'https://picsum.photos/id/1060/800/600',
          'https://picsum.photos/id/1059/800/600'
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
          'https://picsum.photos/id/1058/800/600',
          'https://picsum.photos/id/1057/800/600'
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
          'https://picsum.photos/id/1056/800/600',
          'https://picsum.photos/id/1055/800/600'
        ],
        locations: [{ address: '7 Awolowo Road', city: 'Ikeja', state: 'Lagos', lga: 'Ikeja' }],
        tags: ['wallart', 'sculpture', 'ceramics', 'decor'],
        ratings: { average: 4.8, count: 9 }
      }
    ]
  },
  {
    username: 'fatima_textiles',
    email: 'fatima@bizbridge.com',
    password: DEFAULT_PASSWORD,
    role: 'artisan',
    contactName: 'Fatima Al-Hassan',
    businessName: 'Fatima Textile Arts',
    businessDescription: 'Master weaver and embroiderer specialising in traditional Northern Nigerian textile arts.',
    phoneNumber: '+2348034567890',
    whatsappNumber: '+2348034567890',
    profileImage: 'https://picsum.photos/id/1011/400/400',
    location: { address: '22 Kano Road', city: 'Kano', state: 'Kano', lga: 'Kano Municipal' },
    business: { yearEstablished: 2012, staffStrength: 6, isCACRegistered: true, cacNumber: 'RC789012' },
    professional: {
      specialties: ['Textile Art'],
      experience: '13 years in traditional textile arts.',
      certifications: ['National Board for Technical Education – Textile Arts'],
    },
    analytics: { profileViews: 289, totalBookings: 71, completedBookings: 68, averageRating: 4.7, totalReviews: 55 },
    featured: { isFeatured: true, featuredOrder: 3 },
    isVerified: true,
    servicesToCreate: [
      {
        title: 'Hand-Woven Aso-Oke & Traditional Fabric',
        description: 'Authentic hand-woven aso-oke fabric produced on traditional narrow-band looms for traditional ceremonies.',
        category: 'Textile Art',
        pricing: {
          type: 'categorized',
          categories: [
            { name: 'Plain Weave', price: 30000, duration: '1 week', description: 'Single color traditional weave' },
            { name: 'Embroidered Metallic Weave', price: 65000, duration: '2 weeks', description: 'Patterned weave with gold/silver thread accents' }
          ],
          currency: 'NGN'
        },
        hasBreakdown: true,
        breakdownSupported: true,
        isActive: true,
        images: [
          'https://picsum.photos/id/1048/800/600',
          'https://picsum.photos/id/1049/800/600'
        ],
        locations: [{ address: '22 Kano Road', city: 'Kano', state: 'Kano', lga: 'Kano Municipal' }],
        tags: ['textiles', 'aso-oke', 'weaving', 'traditional', 'fashion'],
        ratings: { average: 4.8, count: 31 }
      },
      {
        title: 'Hand-Embroidered Caftans & Agbada Sets',
        description: 'Intricately embroidered garments tailored using premium cotton, brocade, and damask fabrics.',
        category: 'Textile Art',
        pricing: {
          type: 'fixed',
          basePrice: 55000,
          baseDuration: '2 weeks',
          currency: 'NGN'
        },
        hasBreakdown: false,
        breakdownSupported: false,
        isActive: true,
        images: [
          'https://picsum.photos/id/1050/800/600',
          'https://picsum.photos/id/1051/800/600'
        ],
        locations: [{ address: '22 Kano Road', city: 'Kano', state: 'Kano', lga: 'Kano Municipal' }],
        tags: ['clothing', 'embroidery', 'agbada', 'caftan', 'fashion'],
        ratings: { average: 4.6, count: 18 }
      },
      {
        title: 'Custom Fabric Dyeing & Tie-Dye (Adire)',
        description: 'Hand-dyed organic indigo and colorful pattern textiles using authentic resist-dye techniques.',
        category: 'Textile Art',
        pricing: {
          type: 'fixed',
          basePrice: 25000,
          baseDuration: '5 days',
          currency: 'NGN'
        },
        hasBreakdown: false,
        breakdownSupported: false,
        isActive: true,
        images: [
          'https://picsum.photos/id/1052/800/600',
          'https://picsum.photos/id/1053/800/600'
        ],
        locations: [{ address: '22 Kano Road', city: 'Kano', state: 'Kano', lga: 'Kano Municipal' }],
        tags: ['adire', 'dyeing', 'textiles', 'traditional'],
        ratings: { average: 4.9, count: 12 }
      }
    ]
  },
  {
    username: 'tunde_metalworks',
    email: 'tunde@bizbridge.com',
    password: DEFAULT_PASSWORD,
    role: 'artisan',
    contactName: 'Tunde Bakare',
    businessName: 'Bakare Metalworks',
    businessDescription: 'Blacksmith and metal fabricator producing custom gates, decorative ironwork, and welded furniture.',
    phoneNumber: '+2348056789012',
    whatsappNumber: '+2348056789012',
    profileImage: 'https://picsum.photos/id/1012/400/400',
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
    servicesToCreate: [
      {
        title: 'Custom Wrought Iron Gates & Railings',
        description: 'Heavy-duty forged iron security gates, balcony railings, and stair balustrades customized to architectural specs.',
        category: 'Metalwork',
        pricing: {
          type: 'categorized',
          categories: [
            { name: 'Pedestrian Security Gate', price: 85000, duration: '1-2 weeks', description: 'Standard single-leaf iron gate with anti-rust priming' },
            { name: 'Double Automated Driveway Gate', price: 350000, duration: '3-4 weeks', description: 'Heavy-gauge forged iron gate prepared for automatic openers' }
          ],
          currency: 'NGN'
        },
        hasBreakdown: true,
        breakdownSupported: true,
        isActive: true,
        images: [
          'https://picsum.photos/id/1040/800/600',
          'https://picsum.photos/id/1041/800/600'
        ],
        locations: [{ address: '18 Iyana Ipaja Rd', city: 'Lagos', state: 'Lagos', lga: 'Alimosho' }],
        tags: ['metalwork', 'iron', 'gates', 'welding', 'security'],
        ratings: { average: 4.6, count: 20 }
      },
      {
        title: 'Industrial Stainless Steel Balustrades',
        description: 'Polished stainless steel staircases, glass-reinforced balcony railings, and commercial handrails.',
        category: 'Metalwork',
        pricing: {
          type: 'fixed',
          basePrice: 120000,
          baseDuration: '1-2 weeks',
          currency: 'NGN'
        },
        hasBreakdown: true,
        breakdownSupported: true,
        isActive: true,
        images: [
          'https://picsum.photos/id/1042/800/600',
          'https://picsum.photos/id/1043/800/600'
        ],
        locations: [{ address: '18 Iyana Ipaja Rd', city: 'Lagos', state: 'Lagos', lga: 'Alimosho' }],
        tags: ['stainless', 'steel', 'balustrade', 'railing'],
        ratings: { average: 4.8, count: 11 }
      },
      {
        title: 'Metal Frame Dining & Living Room Furniture',
        description: 'Modern minimalistic metal table bases, steel bookshelves, and heavy-duty iron bed frames.',
        category: 'Metalwork',
        pricing: {
          type: 'fixed',
          basePrice: 95000,
          baseDuration: '1 week',
          currency: 'NGN'
        },
        hasBreakdown: false,
        breakdownSupported: true,
        isActive: true,
        images: [
          'https://picsum.photos/id/1044/800/600',
          'https://picsum.photos/id/1045/800/600'
        ],
        locations: [{ address: '18 Iyana Ipaja Rd', city: 'Lagos', state: 'Lagos', lga: 'Alimosho' }],
        tags: ['furniture', 'steel', 'metalwork', 'industrial'],
        ratings: { average: 4.5, count: 8 }
      }
    ]
  },
  {
    username: 'emeka_leather',
    email: 'emeka@bizbridge.com',
    password: DEFAULT_PASSWORD,
    role: 'artisan',
    contactName: 'Emeka Chukwu',
    businessName: 'Chukwu Leather Co.',
    businessDescription: 'Handmade leather bags, wallets, and sandals crafted from full-grain Nigerian leather.',
    phoneNumber: '+2348078901234',
    whatsappNumber: '+2348078901234',
    profileImage: 'https://picsum.photos/id/1025/400/400',
    location: { address: '5 Aba Road', city: 'Aba', state: 'Abia', lga: 'Aba South' },
    business: { yearEstablished: 2014, staffStrength: 4, isCACRegistered: true, cacNumber: 'RC567890' },
    professional: {
      specialties: ['Leathercraft'],
      experience: '11 years processing and styling finished leather items.',
      certifications: [],
    },
    analytics: { profileViews: 204, totalBookings: 61, completedBookings: 58, averageRating: 4.8, totalReviews: 44 },
    featured: { isFeatured: false, featuredOrder: 0 },
    isVerified: true,
    servicesToCreate: [
      {
        title: 'Bespoke Handstitched Leather Travel Duffle',
        description: 'Full-grain vegetable-tanned leather duffle bags built with solid brass hardware and reinforced stitching.',
        category: 'Leathercraft',
        pricing: {
          type: 'fixed',
          basePrice: 42000,
          baseDuration: '1-2 weeks',
          currency: 'NGN'
        },
        hasBreakdown: false,
        breakdownSupported: false,
        isActive: true,
        images: [
          'https://picsum.photos/id/1033/800/600',
          'https://picsum.photos/id/1035/800/600'
        ],
        locations: [{ address: '5 Aba Road', city: 'Aba', state: 'Abia', lga: 'Aba South' }],
        tags: ['leather', 'bags', 'duffle', 'travel', 'handmade'],
        ratings: { average: 4.9, count: 25 }
      },
      {
        title: 'Custom Fitted Men Leather Oxford Shoes',
        description: 'Hand-crafted oxford footwear made with genuine leather soles, cushioned insoles, and personalized sizing.',
        category: 'Leathercraft',
        pricing: {
          type: 'fixed',
          basePrice: 38000,
          baseDuration: '10 days',
          currency: 'NGN'
        },
        hasBreakdown: false,
        breakdownSupported: false,
        isActive: true,
        images: [
          'https://picsum.photos/id/1036/800/600',
          'https://picsum.photos/id/1037/800/600'
        ],
        locations: [{ address: '5 Aba Road', city: 'Aba', state: 'Abia', lga: 'Aba South' }],
        tags: ['shoes', 'footwear', 'oxfords', 'leather'],
        ratings: { average: 4.7, count: 19 }
      },
      {
        title: 'Genuine Leather Belts & Minimalist Wallets',
        description: 'Durable full-grain leather waist belts paired with slim bifold cardholders.',
        category: 'Leathercraft',
        pricing: {
          type: 'fixed',
          basePrice: 15000,
          baseDuration: '3 days',
          currency: 'NGN'
        },
        hasBreakdown: false,
        breakdownSupported: false,
        isActive: true,
        images: [
          'https://picsum.photos/id/1038/800/600',
          'https://picsum.photos/id/1039/800/600'
        ],
        locations: [{ address: '5 Aba Road', city: 'Aba', state: 'Abia', lga: 'Aba South' }],
        tags: ['wallet', 'belt', 'accessories', 'leather'],
        ratings: { average: 4.8, count: 30 }
      }
    ]
  },
  {
    username: 'kemi_interiors',
    email: 'kemi@bizbridge.com',
    password: DEFAULT_PASSWORD,
    role: 'artisan',
    contactName: 'Kemi Adeleke',
    businessName: 'Kemi Space Design',
    businessDescription: 'Interior architectural stylist transforming residential spaces and offices with contemporary accent decor.',
    phoneNumber: '+2348089012345',
    whatsappNumber: '+2348089012345',
    profileImage: 'https://picsum.photos/id/1026/400/400',
    location: { address: '12 Admiralty Way', city: 'Lekki', state: 'Lagos', lga: 'Eti-Osa' },
    business: { yearEstablished: 2018, staffStrength: 3, isCACRegistered: true, cacNumber: 'RC890123' },
    professional: {
      specialties: ['Woodworking'],
      experience: '8 years designing commercial and private spaces.',
      certifications: ['Interior Designers Association of Nigeria'],
    },
    analytics: { profileViews: 412, totalBookings: 95, completedBookings: 91, averageRating: 4.9, totalReviews: 72 },
    featured: { isFeatured: true, featuredOrder: 4 },
    isVerified: true,
    servicesToCreate: [
      {
        title: 'Full Residential Living Room Design Consult',
        description: 'Complete 3D living space layout design, color palette selection, and furniture sourcing consultation.',
        category: 'Woodworking',
        pricing: {
          type: 'fixed',
          basePrice: 180000,
          baseDuration: '1-2 weeks',
          currency: 'NGN'
        },
        hasBreakdown: true,
        breakdownSupported: true,
        isActive: true,
        images: [
          'https://picsum.photos/id/1029/800/600',
          'https://picsum.photos/id/1031/800/600'
        ],
        locations: [{ address: '12 Admiralty Way', city: 'Lekki', state: 'Lagos', lga: 'Eti-Osa' }],
        tags: ['interior', 'decor', 'consulting', 'home', 'design'],
        ratings: { average: 5.0, count: 35 }
      },
      {
        title: 'Custom POP Ceiling & Ambient Lighting Setup',
        description: 'Modern Plaster of Paris ceiling designs integrated with LED strip lighting and recessed spotlights.',
        category: 'Woodworking',
        pricing: {
          type: 'fixed',
          basePrice: 220000,
          baseDuration: '2 weeks',
          currency: 'NGN'
        },
        hasBreakdown: true,
        breakdownSupported: true,
        isActive: true,
        images: [
          'https://picsum.photos/id/1032/800/600',
          'https://picsum.photos/id/1028/800/600'
        ],
        locations: [{ address: '12 Admiralty Way', city: 'Lekki', state: 'Lagos', lga: 'Eti-Osa' }],
        tags: ['pop', 'lighting', 'interior', 'ceiling'],
        ratings: { average: 4.8, count: 21 }
      },
      {
        title: 'Acoustic & Decorative Wall Paneling',
        description: 'Sound-dampening wooden fluted panels or geometric acoustic wall decor installed for home theaters and offices.',
        category: 'Woodworking',
        pricing: {
          type: 'fixed',
          basePrice: 140000,
          baseDuration: '1 week',
          currency: 'NGN'
        },
        hasBreakdown: true,
        breakdownSupported: true,
        isActive: true,
        images: [
          'https://picsum.photos/id/1018/800/600',
          'https://picsum.photos/id/1019/800/600'
        ],
        locations: [{ address: '12 Admiralty Way', city: 'Lekki', state: 'Lagos', lga: 'Eti-Osa' }],
        tags: ['acoustic', 'wallpanels', 'interior', 'decor'],
        ratings: { average: 4.9, count: 16 }
      }
    ]
  },
  {
    username: 'ibrahim_glass',
    email: 'ibrahim@bizbridge.com',
    password: DEFAULT_PASSWORD,
    role: 'artisan',
    contactName: 'Ibrahim Bello',
    businessName: 'Bello Glass Works',
    businessDescription: 'Glazier specialized in frameless glass shower enclosures, mirrored walls, and structural aluminum glazing.',
    phoneNumber: '+2348090123456',
    whatsappNumber: '+2348090123456',
    profileImage: 'https://picsum.photos/id/1000/400/400',
    location: { address: '33 Ahmadu Bello Way', city: 'Kaduna', state: 'Kaduna', lga: 'Kaduna North' },
    business: { yearEstablished: 2016, staffStrength: 3, isCACRegistered: true, cacNumber: 'RC901234' },
    professional: {
      specialties: ['Metalwork'],
      experience: '9 years in structural glass installations.',
      certifications: [],
    },
    analytics: { profileViews: 154, totalBookings: 38, completedBookings: 36, averageRating: 4.7, totalReviews: 29 },
    featured: { isFeatured: false, featuredOrder: 0 },
    isVerified: true,
    servicesToCreate: [
      {
        title: 'Frameless Tempered Glass Shower Enclosure',
        description: '10mm clear tempered safety glass shower doors fitted with stainless steel hinges and waterproof seals.',
        category: 'Metalwork',
        pricing: {
          type: 'fixed',
          basePrice: 165000,
          baseDuration: '5-7 days',
          currency: 'NGN'
        },
        hasBreakdown: true,
        breakdownSupported: true,
        isActive: true,
        images: [
          'https://picsum.photos/id/1015/800/600',
          'https://picsum.photos/id/1016/800/600'
        ],
        locations: [{ address: '33 Ahmadu Bello Way', city: 'Kaduna', state: 'Kaduna', lga: 'Kaduna North' }],
        tags: ['glass', 'shower', 'bathroom', 'temperedglass'],
        ratings: { average: 4.8, count: 17 }
      },
      {
        title: 'Custom Beveled Wall Mirrors & LED Backlighting',
        description: 'Large vanity or gym wall mirrors precision-cut with polished/beveled edges and integrated touch LED strips.',
        category: 'Metalwork',
        pricing: {
          type: 'fixed',
          basePrice: 75000,
          baseDuration: '3 days',
          currency: 'NGN'
        },
        hasBreakdown: false,
        breakdownSupported: false,
        isActive: true,
        images: [
          'https://picsum.photos/id/1020/800/600',
          'https://picsum.photos/id/1021/800/600'
        ],
        locations: [{ address: '33 Ahmadu Bello Way', city: 'Kaduna', state: 'Kaduna', lga: 'Kaduna North' }],
        tags: ['mirror', 'glass', 'led', 'vanity'],
        ratings: { average: 4.6, count: 12 }
      },
      {
        title: 'Aluminum & Glass Office Partitions',
        description: 'Modular acoustic glass office cubicle walls and sliding glass partition systems for commercial spaces.',
        category: 'Metalwork',
        pricing: {
          type: 'negotiate',
          currency: 'NGN',
          description: 'Quoted per square meter based on glass thickness and aluminum specs.'
        },
        hasBreakdown: true,
        breakdownSupported: true,
        isActive: true,
        images: [
          'https://picsum.photos/id/1022/800/600',
          'https://picsum.photos/id/1023/800/600'
        ],
        locations: [{ address: '33 Ahmadu Bello Way', city: 'Kaduna', state: 'Kaduna', lga: 'Kaduna North' }],
        tags: ['office', 'partition', 'glass', 'aluminum'],
        ratings: { average: 4.7, count: 10 }
      }
    ]
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

    console.log('🗑️ Purging existing artisan and service records...');
    await User.deleteMany({ role: 'artisan' });
    await Service.deleteMany({});

    console.log('🔐 Hashing default artisan credentials safely...');
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(DEFAULT_PASSWORD, salt);

    const insertedServices = [];

    for (const artisanData of artisansData) {
      const { servicesToCreate, ...userFields } = artisanData;
      
      const createdUser = await User.create({
        ...userFields,
        password: encryptedPassword
      });

      if (servicesToCreate && servicesToCreate.length > 0) {
        for (const serviceData of servicesToCreate) {
          insertedServices.push({
            ...serviceData,
            artisan: createdUser._id
          });
        }
      }
    }

    if (insertedServices.length > 0) {
      await Service.insertMany(insertedServices);
      console.log(`📦 Successfully created ${insertedServices.length} service records across categories.`);
    }

    console.log('🌟 Database seed finalized flawlessly.');
  } catch (error) {
    console.error('❌ Execution halted. Seeding sequence failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Connection channels securely detached.');
    process.exit(0);
  }
};

seedDatabase();