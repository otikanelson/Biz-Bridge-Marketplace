// backend/server.js - Updated with new routes
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import authRoutes from './src/routes/authRoutes.js';
import serviceRoutes from './src/routes/serviceRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js'; // ✅ New admin routes
import userRoutes from './src/routes/userRoutes.js';   // ✅ New user routes

const app = express();

// MongoDB Connection Function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`📍 Database Host: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);
    
    // Listen for connection events
    mongoose.connection.on('connected', () => {
      console.log('🔗 Mongoose connected to DB');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ Mongoose disconnected');
    });
    
  } catch (error) {
    console.error('❌ MongoDB Connection Failed!');
    console.error('Error details:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('🔧 Make sure MongoDB is running on your machine');
      console.log('💡 Start MongoDB with: mongod --dbpath /your/db/path');
    }
    
    process.exit(1);
  }
};

// Connect to database
await connectDB();

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174',
    'http://localhost:3000',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.method !== 'GET') {
      console.log('Request body:', { ...req.body, password: req.body.password ? '[HIDDEN]' : undefined });
    }
    next();
  });
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/admin', adminRoutes);   // ✅ Admin routes for managing featured artisans
app.use('/api/users', userRoutes);    // ✅ User routes for public featured artisans

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'BizBridge API is running!',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString(),
    features: {
      featuredArtisans: true,
      adminPanel: true,
      serviceSearch: true
    }
  });
});

// Test database connection route
app.get('/api/test-db', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    
    res.json({
      success: true,
      database: {
        status: states[dbState],
        host: mongoose.connection.host,
        name: mongoose.connection.name,
        collections: await mongoose.connection.db.listCollections().toArray()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database test failed',
      error: error.message
    });
  }
});

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to BizBridge API',
    version: '1.0.0',
    status: 'active',
    features: {
      authentication: true,
      services: true,
      adminPanel: true,
      featuredArtisans: true
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Global Error Handler:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? {
      stack: err.stack,
      details: err
    } : undefined
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT. Graceful shutdown...');
  await mongoose.connection.close();
  console.log('📴 MongoDB connection closed.');
  process.exit(0);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\n🚀 ================================');
  console.log(`🚀 BizBridge Server Started!`);
  console.log(`🚀 Port: ${PORT}`);
  console.log(`🚀 Environment: ${process.env.NODE_ENV}`);
  console.log(`🚀 API URL: http://localhost:${PORT}`);
  console.log(`🚀 Features: Authentication, Services, Admin Panel, Featured Artisans`);
  console.log('🚀 ================================\n');
  
  if (process.env.NODE_ENV === 'development') {
    console.log('💡 Development Tips:');
    console.log('   - Run "node scripts/createAdmin.js" to create admin user');
    console.log('   - Use admin panel to feature artisans');
    console.log('   - Featured artisans will appear on homepage\n');
  }
});