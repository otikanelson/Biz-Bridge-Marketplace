import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import User from '../models/user.js';

let MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ Error: Database Connection string missing.');
  process.exit(1);
}

if (MONGO_URI.includes('mongodb+srv://') && MONGO_URI.includes('cluster0.pnsx1ps.mongodb.net')) {
  console.log('⚠️ Local DNS protocol restriction detected. Activating direct connection fallback...');
  MONGO_URI = 'mongodb://Nelson:W9qVs0r44OFqa3n8@ac-movygpe-shard-00-00.pnsx1ps.mongodb.net:27017,ac-movygpe-shard-00-01.pnsx1ps.mongodb.net:27017,ac-movygpe-shard-00-02.pnsx1ps.mongodb.net:27017/bizbridge?ssl=true&replicaSet=atlas-4iw6s3-shard-0&authSource=admin&appName=Cluster0';
}

const testLogin = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to database\n');

    const testEmail = 'adebayo@bizbridge.com';
    const testPassword = 'Password123';

    console.log(`🔍 Looking for user: ${testEmail}`);
    const user = await User.findOne({ email: testEmail });

    if (!user) {
      console.log('❌ User not found!');
      process.exit(1);
    }

    console.log('✅ User found!');
    console.log('Username:', user.username);
    console.log('Role:', user.role);
    console.log('Password hash (first 20 chars):', user.password.substring(0, 20) + '...');
    console.log('\n🔐 Testing password...');
    console.log(`Comparing "${testPassword}" with stored hash...`);

    const isMatch = await bcrypt.compare(testPassword, user.password);
    
    console.log('\n📊 Result:', isMatch ? '✅ PASSWORD MATCHES!' : '❌ PASSWORD DOES NOT MATCH!');

    if (!isMatch) {
      console.log('\n🔍 Debugging:');
      console.log('Plain password:', testPassword);
      console.log('Stored hash:', user.password);
      
      // Try manual hash comparison
      const newHash = await bcrypt.hash(testPassword, 10);
      console.log('Newly generated hash:', newHash);
      console.log('New hash matches:', await bcrypt.compare(testPassword, newHash));
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected');
    process.exit(0);
  }
};

testLogin();
