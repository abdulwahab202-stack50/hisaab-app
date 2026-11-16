const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate JWT
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'hisab_secret_123',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new client
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Default expiry 30 days from today
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'client', // Default role is client
      isActive: true,
      expiryDate,
    });

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        expiryDate: user.expiryDate,
        createdAt: user.createdAt,
      },
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check account access and expiry (clients only; admin can always manage system)
    if (user.role !== 'admin') {
      const isExpired = user.expiryDate && new Date(user.expiryDate) < new Date();
      if (!user.isActive || isExpired) {
        return res.status(403).json({
          message: 'Your access expired, contact admin',
          isExpired: true,
          isActive: user.isActive,
        });
      }
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        expiryDate: user.expiryDate,
        createdAt: user.createdAt,
      },
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
