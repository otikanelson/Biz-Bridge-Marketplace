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

// ========== IMPORT ROUTES ==========
import authRoutes from './src/routes/authRoutes.js';
import serviceRoutes from './src/routes/serviceRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import profileRoutes from './src/routes/profileRoutes.js';
import serviceRequestRoutes from './src/routes/serviceRequestRoutes.js';  // ✅ NEW
import bookingRoutes from './src/routes/bookingRoutes.js';              // ✅ ENHANCED

const app = express();

// MongoDB Connection Function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    throw error; // let the request handler return a 500 instead of killing the process
  }
};

// Serverless-safe connection caching
let isConnected = false;
const ensureConnected = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;
  await connectDB();
  isConnected = true;
};

// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || origin.includes('localhost') || origin.includes('192.168.') || origin.includes('10.0.') || origin.includes('172.')) {
      return callback(null, true);
    }
    const allowed = [process.env.FRONTEND_URL].filter(Boolean);
    if (allowed.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Ensure DB is connected on each request (serverless-safe)
app.use(async (req, res, next) => {
  try {
    await ensureConnected();
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});

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

// ========== API ROUTES ==========
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/service-requests', serviceRequestRoutes);  // ✅ NEW: Service request system
app.use('/api/bookings', bookingRoutes);                // ✅ ENHANCED: Enhanced booking system

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'BizBridge API is running!',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString(),
    features: {
      authentication: true,
      services: true,
      userProfiles: true,
      serviceRequests: true,  // ✅ NEW
      bookingSystem: true,    // ✅ ENHANCED
      featuredArtisans: true,
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
    version: '2.0.0',
    status: 'active',
    features: {
      authentication: true,
      services: true,
      userProfiles: true,
      serviceRequests: true,    // ✅ NEW: Service request system
      enhancedBookings: true,   // ✅ ENHANCED: Full booking lifecycle
      messaging: true,          // ✅ NEW: In-app messaging
      reviews: true,            // ✅ NEW: Dual review system
      milestones: true,         // ✅ NEW: Project milestones
      analytics: true,          // ✅ NEW: Booking analytics
      featuredArtisans: true
    },
    endpoints: {
      serviceRequests: '/api/service-requests',
      bookings: '/api/bookings',
      auth: '/api/auth',
      services: '/api/services',
      profiles: '/api/profiles',
      users: '/api/users'
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
  await mongoose.connection.close();
  process.exit(0);
});

// Start server locally or export for serverless
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 BizBridge Server running on port ${PORT}`);
  });
}

export default app;