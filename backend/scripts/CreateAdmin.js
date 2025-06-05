// backend/scripts/createAdmin.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/user.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('❌ Admin user already exists:', existingAdmin.email);
      process.exit(1);
    }

    // Admin details
    const adminData = {
      username: 'admin',
      email: 'admin@bizbridge.com',
      password: 'admin123456', // Change this to a secure password
      role: 'admin',
      adminLevel: 'super',
      adminPermissions: [
        'manage_users',
        'manage_services', 
        'manage_featured',
        'view_analytics',
        'moderate_content'
      ],
      isVerified: true,
      isActive: true
    };

    // Hash password
    const salt = await bcrypt.genSalt(12);
    adminData.password = await bcrypt.hash(adminData.password, salt);

    // Create admin user
    const admin = new User(adminData);
    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password: admin123456 (CHANGE THIS!)');
    console.log('🔒 Please change the password after first login');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📴 Database connection closed');
    process.exit(0);
  }
};

// Run the script
createAdmin();