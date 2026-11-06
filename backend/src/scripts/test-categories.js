import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import Service from '../models/service.js';

let MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ Error: Database Connection string missing.');
  process.exit(1);
}

if (MONGO_URI.includes('mongodb+srv://') && MONGO_URI.includes('cluster0.pnsx1ps.mongodb.net')) {
  console.log('⚠️ Local DNS protocol restriction detected. Activating direct connection fallback...');
  MONGO_URI = 'mongodb://Nelson:W9qVs0r44OFqa3n8@ac-movygpe-shard-00-00.pnsx1ps.mongodb.net:27017,ac-movygpe-shard-00-01.pnsx1ps.mongodb.net:27017,ac-movygpe-shard-00-02.pnsx1ps.mongodb.net:27017/bizbridge?ssl=true&replicaSet=atlas-4iw6s3-shard-0&authSource=admin&appName=Cluster0';
}

const testCategories = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to database\n');

    // Get all services
    const allServices = await Service.find({});
    console.log(`📊 Total services in database: ${allServices.length}\n`);

    // Group by category
    const byCategory = {};
    allServices.forEach(service => {
      const cat = service.category;
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(service.title);
    });

    console.log('📋 Services by category:');
    console.log('='.repeat(50));
    Object.entries(byCategory).forEach(([category, services]) => {
      console.log(`\n🏷️  ${category} (${services.length} services):`);
      services.forEach(title => console.log(`   - ${title}`));
    });

    // Test exact search for "Pottery & Ceramics"
    console.log('\n\n🔍 Testing search for "Pottery & Ceramics":');
    console.log('='.repeat(50));
    const potteryServices = await Service.find({ category: 'Pottery & Ceramics', isActive: true });
    console.log(`Found ${potteryServices.length} services`);
    potteryServices.forEach(s => {
      console.log(`  ✓ ${s.title} (category: "${s.category}")`);
    });

    // Test variations
    console.log('\n\n🔍 Testing search variations:');
    console.log('='.repeat(50));
    
    const testCases = [
      'Pottery & Ceramics',
      'pottery & ceramics',
      'Pottery',
      'pottery'
    ];

    for (const testCase of testCases) {
      const results = await Service.find({ category: testCase, isActive: true });
      console.log(`"${testCase}" => ${results.length} services`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected');
    process.exit(0);
  }
};

testCategories();
