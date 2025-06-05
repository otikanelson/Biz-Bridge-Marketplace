// backend/index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Import route files
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const searchRoutes = require('./routes/searchRoutes');
const favouriteRoutes = require('./routes/favouriteRoutes');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bizbridge')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger for development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/favourites', favouriteRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to BizBridge API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});