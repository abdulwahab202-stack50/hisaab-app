const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');

// Load environment variables (from server/.env and root if present)
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

// Connect to MongoDB
connectDB().catch((err) => {
  console.log('Initial DB connection attempt deferred:', err.message);
});

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection middleware for serverless execution
app.use(async (req, res, next) => {
  // Allow health check and root route without blocking on DB
  if (req.path === '/' || req.path === '/api/health') {
    return next();
  }
  try {
    await connectDB();
    next();
  } catch (dbErr) {
    console.error('Database connection error in request:', dbErr.message);
    return res.status(500).json({
      message: `Database connection error: ${dbErr.message}. Ensure MONGO_URI is set in Vercel Project Settings and MongoDB Atlas Network Access whitelist has 0.0.0.0/0 enabled.`,
    });
  }
});

// Health check & diagnostic endpoint
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  let dbError = null;
  const hasMongoUri = !!process.env.MONGO_URI;

  try {
    await connectDB();
    dbStatus = 'connected';
  } catch (err) {
    dbStatus = 'failed';
    dbError = err.message;
  }

  res.json({
    status: 'online',
    appName: 'Hisab App API',
    database: {
      status: dbStatus,
      hasMongoUri,
      readyState: mongoose.connection.readyState,
      error: dbError,
    },
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Root route
app.get('/', (req, res) => {
  res.send('Hisab App - Money Tracker & Client Management API is running...');
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

if (require.main === module && !process.env.VERCEL) {
  app.listen(PORT, async () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    
    // Auto-seed default admin if not existing
    try {
      await connectDB();
      const adminExists = await User.findOne({ role: 'admin' });
      if (!adminExists) {
        const farFuture = new Date();
        farFuture.setFullYear(farFuture.getFullYear() + 20); // 20 years validity for admin
        await User.create({
          name: 'Master Admin',
          email: 'admin@hisab.com',
          password: 'admin123',
          role: 'admin',
          isActive: true,
          expiryDate: farFuture,
        });
        console.log('Default Admin Account Created -> Email: admin@hisab.com | Password: admin123');
      }
    } catch (seedErr) {
      console.log('Admin check/seed waiting for DB connection');
    }
  });
}

module.exports = app;
