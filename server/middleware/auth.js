const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'hisab_secret_123'
      );

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'User not found or authorization revoked' });
      }

      // Check if user is active and not expired (admin bypasses expiry)
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

      req.user = user;
      next();
    } catch (error) {
      console.error('JWT auth error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied: Admin privileges required' });
  }
};

module.exports = { protect, adminOnly };
