const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'Hisab App API',
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

app.listen(PORT, async () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  
  // Auto-seed default admin if not existing
  try {
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
    // If DB is not connected yet, it will log smoothly without crashing
    console.log('Admin check/seed waiting for DB connection');
  }
});
