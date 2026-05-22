// Load environment variables at the absolute top before any other imports
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();


// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection state check middleware
const dbCheck = (req, res, next) => {
  if (mongoose.connection.readyState !== 1 && process.env.USE_MOCK_DB !== 'true') {
    return res.status(503).json({
      success: false,
      message: 'Database connection failed. Please ensure MongoDB is running and your MONGO_URI is correct.',
    });
  }
  next();
};

// Protect all API routes with Database connection state check
app.use('/api', dbCheck);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Radhakrishna General Store API is running...',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      cart: '/api/cart',
      orders: '/api/orders',
      wishlist: '/api/wishlist',
      admin: '/api/admin',
    },
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler (must be after routes)
app.use(errorHandler);

// Database initialization and Server Startup Sequence
const startServer = async () => {
  try {
    // 1. Wait for database connection first
    await connectDB();

    // 2. Only start Express server if DB successfully connects
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🏪 Radhakrishna General Store API running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error(`💥 Critical Server Startup Failure: Server could not be started.`);
    console.error(`💡 Tip: Please check your .env file or verify that MongoDB is running on port 27017.`);
    process.exit(1);
  }
};

startServer();
